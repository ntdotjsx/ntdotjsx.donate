import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, X, Filter } from "lucide-react";
import { showToast } from "./utility/sentalert";

function EditUserModal({ user, onClose, onSave, onToggleStatus, onDeleteUser }) {
    const [formData, setFormData] = useState({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        telephone: user.telephone,
        created_at: user.createdAt
    });

    const [userStatus, setUserStatus] = useState(user.status);

    const handleToggleStatus = async () => {
        try {
            await onToggleStatus(user.id);
            setUserStatus((prev) => (prev === "YES" ? "NO" : "YES"));
        } catch (error) {
            console.error("Error toggling user status:", error);
            showToast("error", "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
        }
    };

    const handleDelete = async () => {
        if (window.confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?")) {
            try {
                await axios.delete(`http://localhost:3000/users/${user.id}`);
                onDeleteUser(user.id);
                showToast("success", "ลบผู้ใช้สำเร็จ");
                onClose();
            } catch (error) {
                console.error("Error deleting user:", error);
                showToast("error", "เกิดข้อผิดพลาดในการลบ");
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[100vh]">
                <h2 className="text-xl font-semibold mb-4">จัดการผู้ใช้</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">ชื่อ</label>
                        <input type="text" value={formData.firstname} className="w-full border p-2 rounded-md" disabled />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">นามสกุล</label>
                        <input type="text" value={formData.lastname} className="w-full border p-2 rounded-md" disabled />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">อีเมล</label>
                        <input type="email" value={formData.email} className="w-full border p-2 rounded-md" disabled />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">เบอร์</label>
                        <input type="text" value={formData.telephone} className="w-full border p-2 rounded-md" disabled />
                    </div>

                    <hr className="mt-3" />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleToggleStatus}
                        >
                            {userStatus === "YES" ? "ระงับ" : "เปิดใช้งาน"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDelete}
                        >
                            ลบ
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>ยกเลิก</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}



export default function AdminDashboard() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/users/");
                const fetchedData = response.data || [];
                const userData = fetchedData.filter((user) => user.role === "USER");
                setData(userData);
                setFilteredData(userData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
                setFilteredData([]);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = data;

        if (filterStatus !== "ALL") {
            filtered = filtered.filter((user) => user.status === filterStatus);
        }

        if (search !== "") {
            filtered = filtered.filter(
                (user) =>
                    user.username.toLowerCase().includes(search.toLowerCase()) ||
                    user.email.toLowerCase().includes(search.toLowerCase()) ||
                    user.status.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredData(filtered);
    }, [search, filterStatus, data]);

    const handleBlock = async (id) => {
        const currentUser = data.find((user) => user.id === id);
        if (!currentUser) return;

        const newStatus = currentUser.status === "YES" ? "NO" : "YES";
        const confirmMessage =
            newStatus === "NO"
                ? "คุณต้องการระงับผู้ใช้นี้หรือไม่?"
                : "คุณต้องการเปิดใช้งานผู้ใช้นี้หรือไม่?";

        if (window.confirm(confirmMessage)) {
            try {
                await axios.put(`http://localhost:3000/users/${id}/3`, { status: newStatus });
                setData((prev) =>
                    prev.map((user) =>
                        user.id === id ? { ...user, status: newStatus } : user
                    )
                );
                showToast('success', newStatus === "NO" ? "ระงับผู้ใช้สำเร็จ" : "เปิดใช้งานผู้ใช้สำเร็จ");
            } catch (error) {
                console.error("Error toggling user status:", error);
                showToast('error', "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ");
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const columns = [
        {
            name: "รูปภาพ",
            selector: (row) => row.image || "-",
            sortable: true,
            cell: (row) => (
                <div>
                    {row.image ? (
                        <img
                            src={"http://localhost:3000/" + row.image}
                            className="w-8 h-8 rounded-full object-cover"
                            alt={row.username}
                        />
                    ) : (
                        <img
                            src="https://arima.moe/easydonate/profile/2e667a7e1e27377dd8dab4add615e070.jpeg"
                            className="w-8 h-8 rounded-full object-cover"
                            alt={row.username}
                        />
                    )}
                </div>
            ),
        },
        {
            name: "ชื่อ",
            selector: (row) => row.firstname + " " + row.lastname || "-",
            sortable: true,
            cell: (row) => (
                <span>
                    {row.firstname} {row.lastname}
                </span>
            ),
        },
        {
            name: "เมล์",
            selector: (row) => row.email || "-",
            sortable: true,
        },
        {
            name: "ลงทะเบียนเมื่อ",
            selector: (row) => row.createdAt || "-",
            sortable: true,
        },
        // {
        //     name: "ระงับ",
        //     cell: (row) => (
        //         <button
        //             className={`px-3 py-1 rounded-lg ${row.status === "YES" ? "bg-gray-700 text-white" : "bg-green-500 text-white"}`}
        //             onClick={() => handleBlock(row.id)}
        //         >
        //             {row.status === "YES" ? "ระงับ" : "เปิดใช้งาน"}
        //         </button>
        //     ),
        // },
        {
            name: "จัดการ",
            cell: (row) => (
                <span
                    className="px-3 py-1 rounded-lg bg-blue-700 text-white"
                    onClick={() => handleEdit(row)}
                >
                    จัดการ
                </span>
            ),
        },
    ];

    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/donate/ranking")
            .then((response) => {
                setRanking(response.data);
            })
            .catch((error) => console.error("Error fetching ranking", error));
    }, []);

    return (
        <>
            <div className="relative w-full">
                <h1 className="text-4xl font-bold w-fit bg-gradient-to-bl from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    จัดการผู้ใช้
                </h1>
                <p className="text-xl mb-8 text-gray-700">User Manager</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {ranking.slice(0, 3).map((user, index) => (
                        <div
                            key={user.userId}
                            className={`relative bg-white border border-gray-200 p-5 rounded-2xl shadow-lg overflow-hidden ${index === 0 ? "ring-2 ring-yellow-400" : ""
                                }`}
                        >
                            <img
                                className="absolute top-0 left-0 w-full h-[120px] object-cover object-top"
                                src={"http://localhost:3000/" + user.user.image}
                                alt={user.user.username}
                                style={{
                                    maskImage:
                                        "-webkit-gradient(linear, 0% 0%, 0% 100%, from(rgba(0, 0, 0, 0.4)), to(rgba(0, 0, 0, 0)))",
                                }}
                            />
                            <span
                                className={`relative block w-fit text-xs py-1 px-3 rounded-full mb-4 ${index === 0
                                    ? "bg-yellow-400 text-white"
                                    : index === 1
                                        ? "bg-gray-300"
                                        : "bg-gray-100"
                                    }`}
                            >
                                อันดับที่ {index + 1}
                            </span>
                            <h2 className="relative text-lg font-semibold text-gray-700">
                                {user.user.firstname} {user.user.lastname}
                            </h2>
                            <h1 className="relative text-4xl font-semibold">
                                <span
                                    className={`${index === 0
                                        ? "text-yellow-500"
                                        : index === 1
                                            ? "text-gray-500"
                                            : "text-gray-700"
                                        }`}
                                >
                                    {user.totalAmount}
                                </span>{" "}
                                <span className="text-2xl">บาท</span>
                            </h1>
                            <p className="relative text-sm text-gray-500">
                                ได้รับบริจาค {user.donationCount} ครั้ง
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="relative w-full">
                    <Input
                        className="pl-10 pr-12"
                        placeholder="ค้นหาผู้ใช้..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    {search && (
                        <X
                            className="absolute right-3 top-3 h-5 w-5 text-gray-400 cursor-pointer"
                            onClick={() => setSearch("")}
                        />
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            {filterStatus === "ALL" ? "ทั้งหมด" : filterStatus}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setFilterStatus("ALL")}>
                            ทั้งหมด
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("YES")}>
                            ใช้งานได้
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilterStatus("NO")}>
                            ถูกระงับ
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-300 mb-6 bg-white shadow-md">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    pointerOnHover
                />
            </div>

            {modalOpen && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => {
                        setModalOpen(false);
                        setSelectedUser(null);
                    }}
                    onSave={(updatedUser) => {
                        setData((prev) =>
                            prev.map((user) =>
                                user.id === updatedUser.id ? updatedUser : user
                            )
                        );
                    }}
                    onToggleStatus={handleBlock}
                    onDeleteUser={(id) => {
                        setData((prev) => prev.filter((user) => user.id !== id));
                    }} // ✅ 
                />
            )}


        </>
    );
}
