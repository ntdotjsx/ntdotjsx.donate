import axios from "axios";
import * as React from "react";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import DataTable from "react-data-table-component";
import { useAuth } from "./userAuthContext";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export default function UserDashboard() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (!user || !user.id) return;
        console.log("Fetching data for user:", user.id);

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/donate/${user.id}`);
                console.log("API Response:", response.data);
                const responseData = Array.isArray(response.data)
                    ? response.data
                    : [response.data];
                setData(responseData);
                setTableData(responseData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
                setTableData([]);
            }
        };

        fetchData();
    }, [user]);

    const totalAmount = data.reduce((acc, row) => acc + (Number(row.amount) || 0), 0);
    const todayAmount = data
        .filter((row) => new Date(row.created_at).toDateString() === new Date().toDateString())
        .reduce((acc, row) => acc + (Number(row.amount) || 0), 0);


    const columns = [
        {
            name: "ชื่อ",
            selector: (row) => row.guest_name || "-",
            sortable: true,
        },
        {
            name: "จำนวน",
            selector: (row) => row.amount + ' ฿' || "-",
            sortable: true,
        },
        {
            name: "ข้อความ",
            selector: (row) => row.message || "-",
            sortable: true,
        },
        {
            name: "เวลา",
            selector: (row) =>
                row.created_at ? new Date(row.created_at).toLocaleString() : "-",
            sortable: true,
        },
    ];

    const chartData = data.map((row) => ({
        date: row.created_at,
        amount: row.amount,
        payment_method: row.payment_method,
    }));

    const chartConfig = {
        visitors: {
            label: "Visitors",
        },
        payment_method: {
            label: "วิธีชำระเงิน",
            color: "hsl(217.2 91.2% 59.8%)",
        },
    };

    const [timeRange, setTimeRange] = React.useState("90d");

    const filteredChartData = chartData.filter((item) => {
        const itemDate = new Date(item.date);
        const referenceDate = new Date("2024-06-30");
        let daysToSubtract = 90;
        if (timeRange === "30d") {
            daysToSubtract = 30;
        } else if (timeRange === "7d") {
            daysToSubtract = 7;
        }
        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);
        return itemDate >= startDate;
    });

    return (
        <>
            <div className="space-y-12">
                <div className="relative w-full">
                    <h1 className="text-4xl font-bold w-fit bg-gradient-to-bl from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        ยินดีต้อนรับกลับมานะ
                    </h1>
                    <p className="text-xl mb-8 text-gray-700">Welcome back</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                        <div className="relative bg-white border border-gray-200 p-5 rounded-2xl overflow-hidden">
                            <a className="block w-fit bg-gray-100 text-xs py-1 px-3 rounded-full mb-4">
                                ยอดการรับเงินวันนี้
                            </a>
                            <h1 className="relative text-4xl">
                                <span className="font-semibold">{todayAmount}</span>{" "}
                                <span className="text-2xl">บาท</span>
                            </h1>
                        </div>
                        <div className="relative bg-white border border-gray-200 p-5 rounded-2xl overflow-hidden">
                            <a className="block w-fit bg-blue-500 text-xs py-1 px-3 rounded-full mb-4">
                                ยอดการรับเงินทั้งหมด
                            </a>
                            <h1 className="relative text-4xl">
                                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-bl from-blue-500 to-blue-400">
                                    {totalAmount}
                                </span>{" "}
                                <span className="text-2xl">บาท</span>
                            </h1>
                        </div>
                    </div>

                    <Card>
                        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                            <div className="grid flex-1 gap-1 text-center sm:text-left">
                                <CardTitle>รายการโดเนท</CardTitle>
                                <CardDescription>
                                    แสดงการโดเนททั้งหมดในช่วง 3 เดือนที่ผ่านมา
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-auto h-[250px] w-full"
                            >
                                <AreaChart data={filteredChartData}>
                                    <defs>
                                        <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="var(--color-desktop)"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--color-desktop)"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                        <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="var(--color-mobile)"
                                                stopOpacity={0.8}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--color-mobile)"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            });
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={(value) => {
                                                    return new Date(value).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    });
                                                }}
                                                indicator="dot"
                                            />
                                        }
                                    />
                                    <Area dataKey="amount" stroke="#3B82F6" fill="#3B82F6" />
                                    <ChartLegend content={<ChartLegendContent />} />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                        <DataTable
                            columns={columns}
                            data={tableData}
                            pagination
                            highlightOnHover
                            pointerOnHover
                        />
                    </Card>
                </div>
            </div>
        </>
    );
}
