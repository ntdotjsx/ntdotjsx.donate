import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../404';
import axios from 'axios';
import { useStripe } from '@stripe/react-stripe-js';
import { showToast } from './utility/sentalert';

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [amount, setAmount] = useState(null);
    const [guestser, setGuest] = useState(null);
    const [message, setMessage] = useState(null);
    const [setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const stripe = useStripe();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/donate/page/${username}`);
                setUser(response.data);
                // console.log(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [username]);

    if (!user) return <NotFound />;

    const handlePay = async (amount) => {
        if (amount < 10) {
            showToast("error", "จำนวนเงินขั้นต่ำในการบริจาคคือ 10 บาท")
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/donate/create-payment-intent', {
                amount: amount * 100,
            });

            const { clientSecret } = response.data;

            const { error, paymentIntent } = await stripe.confirmPromptPayPayment(clientSecret, {
                payment_method: {
                    type: 'promptpay',
                    billing_details: {
                        email: "anonymous@example.com",
                    },
                },
            });

            if (error) {
                console.error("Error during payment:", error);
                alert("Payment failed");
            } else if (paymentIntent.status === 'succeeded') {
                Notification(amount);
            }
        } catch (error) {
            console.error("Error creating payment intent:", error);
        }
    };

    const Notification = async (amount) => {
        const payload = {
            userID: user.id,
            donorName: guestser || "Anonymous",
            amount: amount,
            message: message,
        };

        console.log(payload);

        if (isSending) return;
        setIsSending(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/donate/donations",
                payload
            );
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error sending notification:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <>
            <div className="relative min-h-screen bg-white text-black overflow-hidden pt-0 lg:pt-8 pb-16 xl:pt-16" style={{ backgroundImage: "linear-gradient(-40deg, rgba(59, 130, 246, 0.05) 0%, rgba(255, 255, 255, 0.8) 60%, rgba(59, 130, 246, 0.1) 100%)" }}>
                <div className="relative w-full xl:w-[1280px] mx-auto">
                    <div className="relative w-full h-[200px] lg:h-[400px] bg-gray-100 rounded-b-2xl lg:rounded-2xl overflow-hidden">
                        <img className="w-full h-full object-cover" src="./bnef3fhuqm261.png" />
                        <div className="absolute bottom-0 left-0 w-full flex justify-center px-4 lg:px-0">
                            <div className="w-full lg:w-[1000px] h-[50px] bg-white/80 rounded-t-2xl"></div>
                        </div>
                    </div>
                    <div className="flex justify-center px-4 xl:px-0">
                        <div className="w-full lg:w-[1000px] px-4 sm:px-0 text-center -mt-[50px] bg-gray-50 border border-gray-200 backdrop-blur-md rounded-2xl pb-8 mb-8" style={{ backgroundImage: "linear-gradient(rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.9) 60%)" }}>
                            <div className="relative flex justify-center -mt-[80px]">
                                <img className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] mx-auto mb-4 bg-gray-200 object-cover rounded-full" src={'http://localhost:3000/'+user.image || "https://arima.moe/easydonate/profile/2e667a7e1e27377dd8dab4add615e070.jpeg"} />
                            </div>
                            <h1 className="text-3xl sm:text-4xl text-black font-semibold mb-1">{user.username}</h1>
                            <p className="text-xs text-gray-500">fydn.app/{user.username}</p>
                        </div>
                    </div>
                    <div className="p-6 sm:p-8 mx-4 xl:mx-auto bg-gray-50 border border-gray-200 rounded-2xl backdrop-blur-md">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full">
                                <div className="flex items-center gap-2 mb-4">
                                    <a className="bg-blue-500 text-white px-3 py-0.5 text-xs rounded-full">ขั้นตอนที่ 1</a>
                                    <p className="text-sm">กรอกสิ่งที่คุณต้องการจะบอก</p>
                                </div>
                                <div className="space-y-4 mb-8 w-full">
                                    <div className="relative">
                                        <p className="absolute left-4 top-2 text-gray-400 text-[10px]">Your name / ชื่อของคุณ</p>
                                        <input
                                            type="text"
                                            name="donorName"
                                            className="w-full bg-white border border-gray-300 pt-6 pb-2 px-4 rounded-xl"
                                            defaultValue="Anonymous"
                                            required
                                            onChange={(e) => setGuest(e.target.value)} />
                                    </div>
                                    <div className="relative">
                                        <p className="absolute left-4 top-2 text-gray-400 text-[10px]">Message / ข้อความที่ต้องการจะบอก</p>
                                        <textarea
                                            name="message"
                                            className="w-full min-h-[100px] bg-white border border-gray-300 pt-6 pb-2 px-4 rounded-xl"
                                            required
                                            onChange={(e) => setMessage(e.target.value)}
                                        ></textarea>

                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <a className="bg-blue-500 text-white px-3 py-0.5 text-xs rounded-full">ขั้นตอนที่ 2</a>
                                    <p className="text-sm">ดำเนินการชำระเงิน</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 md:gap-4">
                                    <div className="rounded-xl h-fit bg-white border border-gray-300 p-6">
                                        <h1 className="text-lg sm:text-xl font-semibold mb-4">วิธีการชำระเงิน</h1>
                                        <div className="text-xs sm:text-sm space-y-2">
                                            <p>1) เข้าแอพธนาคารใดก็ได้ ที่มี QR Code แนบอยู่ในสลิปการโอนเงิน เช่น K PLUS, NEXT, SCB EASY</p>
                                            <p>2) ดำเนินการโอนเงินไปยังที่อยู่การรับเงินในหน้าเว็บ ตามจำนวนเงินที่ต้องการจะโดเนท</p>
                                            <p>3) เมื่อโอนเงินเสร็จแล้วเด้งเลย</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <p className="absolute left-4 top-2 text-gray-400 text-[10px]">Amount / จำนวนเงิน</p>
                                            <input
                                                type="number"
                                                name="amount"
                                                className="w-full bg-white border border-gray-300 pt-6 pb-2 px-4 rounded-xl mb-3"
                                                defaultValue="1"
                                                required
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={() => handlePay(amount)}
                                            disabled={isSending}
                                            className="w-full py-3 bg-blue-500 text-white rounded-xl transition duration-300"
                                        >
                                            {isSending ? "กำลังส่ง..." : <p><i className="far fa-rocket"></i> เปย์เลย</p>}
                                        </button>
                                        <div className="hidden" id="reader" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
