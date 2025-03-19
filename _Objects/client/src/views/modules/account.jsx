import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./userAuthContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showToast } from "./utility/sentalert";
import Personal from "./utility/personal";

dayjs.extend(relativeTime);

export default function Account() {
    const { user } = useAuth();
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [newProfileImage, setNewProfileImage] = useState(null);

    const [initialUsername, setInitialUsername] = useState("");
    const [initialEmail, setInitialEmail] = useState("");

    const isDataModified = username !== initialUsername || email !== initialEmail;


    const [isSending, setIsSending] = useState(false);

    const inputRef = useRef(null);
    const handleCopy = () => {
        if (inputRef.current) {
            navigator.clipboard.writeText(inputRef.current.value)
                .then(() => {
                    showToast("success", 'คัดลอกลิงก์เรียบร้อยแล้ว!');
                })
                .catch((err) => {
                    console.error('การคัดลอกล้มเหลว:', err);
                });
        }
    };

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showToast("error", "รหัสผ่านใหม่ไม่ตรงกัน");
            return;
        }

        setIsChangingPassword(true);

        try {
            const response = await axios.put(`http://localhost:3000/users/${user.id}/password`, {
                currentPassword,
                newPassword,
            });

            showToast("success", response.data.message || "เปลี่ยนรหัสผ่านสำเร็จ");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            const errorMessage = error.response ? error.response.data.error : error.message;
            showToast("error", errorMessage);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const inputRef2 = useRef(null);
    const handleCopy2 = () => {
        if (inputRef2.current) {
            navigator.clipboard.writeText(inputRef2.current.value)
                .then(() => {
                    showToast("success", 'คัดลอกลิงก์เรียบร้อยแล้ว!');
                })
                .catch((err) => {
                    console.error('การคัดลอกล้มเหลว:', err);
                });
        }
    };

    const handleTestNotification = async () => {
        const payload = {
            userID: user.id,
            donorName: "Anonymous",
            amount: 1999,
            message: "ทดสอบการแจ้งเตือน Fluffy Donate",
        };

        if (isSending) return;
        setIsSending(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/donate/test",
                payload
            );
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error sending notification:", error);
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${user.id}`);
                setUserData(response.data);
                if (!editing) {
                    setUsername(response.data.username);
                    setEmail(response.data.email);
                    setProfileImage('http://localhost:3000/' + response.data.image);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => clearInterval(interval);
    }, [user.id, editing]);

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/users/${user.id}`, {
                username,
                email,
            });

            setUserData({ ...userData, username, email });
            setInitialUsername(username);
            setInitialEmail(email);
            setEditing(false);
            showToast('success', response.data.message || 'แก้ไขโปรไฟล์สำเร็จ');
        } catch (error) {
            const errorMessage = error.response ? error.response.data.error : error.message;
            showToast('error', errorMessage);
        }
    };


    const handleEditCancel = () => {
        setUsername(initialUsername);
        setEmail(initialEmail);
        setEditing(false);
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!newProfileImage) return;

        const formData = new FormData();
        formData.append("image", newProfileImage);

        try {
            const response = await axios.put(
                `http://localhost:3000/users/${user.id}/profile-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setProfileImage(response.data.profileImage);
            setNewProfileImage(null);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    return (
        <>
            <div className="relative w-full" style={{ opacity: 1, transform: "none" }}>
                <div className="flex w-full">
                    <div className="mx-auto myContainer-noPadding">
                        <div className="flex flex-col lg:flex-row gap-6 mb-6">
                            <div className="w-full relative mt-12 p-6 pb-8 bg-white border border-gray-300 rounded-2xl" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 60%)' }}>
                                <div className="relative -mt-20 justify-center mb-8">
                                    <div className="text-center">
                                        <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] mx-auto mb-4">
                                            {profileImage ? (
                                                <img className="bg-gray-100 w-full h-full object-cover rounded-full border border-gray-300" src={profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} />
                                            ) : (
                                                <div className="bg-gray-100 w-full h-full rounded-full flex justify-center items-center border border-gray-300">
                                                    <i className="animate-pulse text-xl text-transparent bg-clip-text bg-gradient-to-r from-[#0000ff] to-[#3B82F6] fa-solid fa-cloud-arrow-up"></i>
                                                </div>
                                            )}

                                            <div className="absolute bottom-3 right-3">
                                                <div className="relative flex justify-center items-center w-[35px] h-[35px] rounded-full bg-white border border-gray-300 backdrop-blur-sm overflow-hidden transition duration-300 hover:bg-gray-200">
                                                    <p className="text-xs"><i className="far fa-upload" /></p>
                                                    <input type="file" className="opacity-0 absolute" onChange={handleProfileImageChange} />
                                                </div>
                                            </div>
                                        </div>
                                        {newProfileImage && (
                                            <button
                                                type="button"
                                                className="mt-2 p-2 bg-blue-500 text-white rounded-xl"
                                                onClick={handleImageUpload}
                                            >
                                                บันทึกรูปภาพใหม่
                                            </button>
                                        )}
                                        <form className="flex justify-center items-center space-x-2">
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    className="text-3xl text-center bg-white border border-gray-300 font-semibold mb-1 text-black rounded-lg"
                                                    style={{
                                                        minWidth: '2ch',
                                                        width: `${Math.max(username.length + 1, 2)}ch`,
                                                    }}
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />
                                            ) : (
                                                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000ff] to-[#3B82F6] text-3xl font-semibold w-fit mb-1 text-gray-800">{userData?.username}</h1>
                                            )}
                                            <button
                                                type="button"
                                                className="h-fit border bg-white border-gray-300 text-gray-800 hover:bg-gray-100 w-[30px] text-center py-0.5 text-[10px] rounded-md transition duration-300"
                                                onClick={editing ? (isDataModified ? handleSaveClick : handleEditCancel) : handleEditClick}
                                            >
                                                {editing ? (
                                                    isDataModified ? (
                                                        <i className="far fa-check" />
                                                    ) : (
                                                        <i className="far fa-times" />
                                                    )
                                                ) : (
                                                    <i className="far fa-edit" />
                                                )}
                                            </button>
                                        </form>
                                        <p className="text-xs text-gray-600">fydn.app/{userData?.username}</p>
                                    </div>
                                </div>

                                <div className="relative grid grid-cols-1 sm:grid-cols-1">
                                    <div className="text-center py-6 lg:py-0 border-b sm:border-b-0 border-gray-300">
                                        <p className="text-xs text-gray-600 mb-1">เข้าร่วมกับเราตั้งแต่</p>
                                        <h1 className="text-xl font-semibold text-gray-800">
                                            {userData?.createdAt ? dayjs(userData.createdAt).format("DD/MM/YYYY") : "-"}
                                        </h1>
                                        <p className="text-sm -mt-1 text-gray-600">
                                            {userData?.createdAt ? dayjs(userData.createdAt).fromNow(true) : "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Personal userData={userData} setUserData={setUserData} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                <div className="w-1/2">
                    <p className="text-lg font-semibold text-gray-900">ลิงก์วิดเจ็ตการแจ้งเตือนโดเนทของคุณ</p>
                    <p className="text-sm text-gray-500">นำลิงก์นี้ไปใส่ใน OBS</p>
                </div>
                <div className="flex w-full items-center bg-gray-100 border border-gray-300 rounded-xl px-4 py-2">
                    <input
                        ref={inputRef}
                        className="flex-1 bg-transparent text-gray-800 placeholder-gray-400"
                        type="text"
                        defaultValue={`http://localhost:5173/display?user_id=${user.id}`}
                        readOnly
                    />
                    <button
                        onClick={handleCopy}
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition hover:bg-blue-700"
                    >
                        <i className="far fa-copy"></i> คัดลอก
                    </button>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
                <div className="w-1/2">
                    <p className="text-lg font-semibold text-gray-900">ลิงก์สำหรับผู้ติดตามของคุณ</p>
                    <p className="text-sm text-gray-500">นำลิงก์นี้ไปแปะให้ผู้ติดตามของคุณเลย</p>
                </div>
                <div className="flex w-full items-center bg-gray-100 border border-gray-300 rounded-xl px-4 py-2">
                    <input
                        ref={inputRef2}
                        className="flex-1 bg-transparent text-gray-800 placeholder-gray-400"
                        type="text"
                        defaultValue={`http://localhost:5173/${user.username}`}
                        readOnly
                    />
                    <button
                        onClick={handleCopy2}
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition hover:bg-blue-700"
                    >
                        <i className="far fa-copy"></i> คัดลอก
                    </button>
                </div>
            </div>
            <button
                onClick={handleTestNotification}
                disabled={isSending}
                className={`p-3.5 text-sm rounded-xl transition duration-300 ${isSending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-300 text-white"
                    }`}
            >
                {isSending ? "กำลังส่ง..." : <i className="fa-solid fa-play"></i>}
            </button>
            <div className="mt-5">
                <h2 className="text-lg font-semibold mb-4">เปลี่ยนรหัสผ่าน</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">รหัสผ่านปัจจุบัน</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 block w-full border rounded-lg p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">รหัสผ่านใหม่</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="mt-1 block w-full border rounded-lg p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full border rounded-lg p-2"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isChangingPassword}
                        className={`w-full p-3 rounded-lg text-white transition ${isChangingPassword ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                        {isChangingPassword ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
                    </button>
                </form>
            </div>
        </>
    );
}
