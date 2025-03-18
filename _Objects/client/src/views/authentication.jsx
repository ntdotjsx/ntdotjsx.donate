import { useState } from "react";
import { useAuth } from "./modules/userAuthContext";
import { LoginAPI, RegisterAPI } from "./modules/Authentication";
import { Navbar, Footer } from "./modules/utility/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthSection() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        confirmPassword: "",
        firstname: "", 
        lastname: "", 
        telephone: "", 
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { login } = useAuth();

    const handleAuth = async () => {
        try {
            setError("");
            setSuccess(false);

            if (!isLoginMode && formData.password !== formData.confirmPassword) {
                setError("รหัสผ่านไม่ตรงกัน");
                return;
            }

            if (isLoginMode) {
                await LoginAPI(formData.username, formData.password, setSuccess, setError, login);
            } else {
                await RegisterAPI(
                    formData.username,
                    formData.email,
                    formData.password,
                    formData.confirmPassword,
                    formData.firstname,  
                    formData.lastname, 
                    formData.telephone, 
                    setSuccess,
                    setError
                );
            }
        } catch (error) {
            setError(error.response?.data?.error || "ไม่สามารถดำเนินการได้");
        }
    };

    const variants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <>
            <Navbar />
            <div className="flex items-center relative min-h-screen overflow-hidden px-4 md:px-0">
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3)), linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
                        backgroundSize: "100% 100%, 50px 50px, 50px 50px",
                        backgroundPosition: "0px 0px, 0px 0px, 0px 0px",
                    }}
                >
                </div>
                <div className="relative w-full">
                    <div className="relative w-full flex">
                        <div className="m-auto w-[400px] bg-white/10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={isLoginMode ? "login" : "register"}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    variants={variants}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-8">
                                        <h1 className="text-4xl py-1 font-bold w-fit bg-gradient-to-bl from-[#0000ff] to-[#3B82F6] bg-clip-text text-transparent">
                                            {isLoginMode ? "Login" : "Register"}
                                        </h1>
                                        <p className="text-black mb-2">ไปทำงานของคุณกันต่อดีกว่า!</p>
                                        <p className="text-xs text-black/60">
                                            {isLoginMode ? "หรือยังไม่มีบัญชีเลย?" : "หรือมีบัญชีอยู่แล้ว?"}
                                            <button
                                                className="px-2 bg-black/10 border border-black/10 text-black rounded-md transition duration-300 hover:bg-black/20"
                                                onClick={() => setIsLoginMode(!isLoginMode)}
                                            >
                                                {isLoginMode ? "ลงทะเบียน" : "เข้าสู่ระบบ"}
                                            </button>
                                        </p>
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        <div className="relative">
                                            <p className="absolute left-4 top-2 text-black/40 text-[10px]">Username / ชื่อผู้ใช้</p>
                                            <input
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                                                className="w-full bg-black/10 pt-6 pb-2 px-4 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <p className="absolute left-4 top-2 text-black/40 text-[10px]">Password / รหัสผ่าน</p>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                                                className="w-full bg-black/10 pt-6 pb-2 px-4 rounded-xl"
                                                required
                                            />
                                        </div>

                                        {!isLoginMode && (
                                            <>
                                                <div className="relative">
                                                    <p className="absolute left-4 top-2 text-black/40 text-[10px]">Confirm Password / ยืนยันรหัสผ่าน</p>
                                                    <input
                                                        type="password"
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                        onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                                                        className="w-full bg-black/10 pt-6 pb-2 px-4 rounded-xl"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <p className="absolute left-4 top-2 text-black/40 text-[10px]">Email / อีเมล</p>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                                                        className="w-full bg-black/10 pt-6 pb-2 px-4 rounded-xl"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <p className="absolute left-4 top-2 text-black/40 text-[10px]">First Name / ชื่อ</p>
                                                    <input
                                                        type="text"
                                                        value={formData.firstname}
                                                        onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                                                        onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                                                        className="w-full bg-black/10 pt-6 pb-2 px-4 rounded-xl"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <p className="absolute left-4 top-2 text-black/40 text-[10px]">Last Name / นามสกุล</p>
                                                    <input
                                                        type="text"
                                                        value={formData.lastname}
                                                        onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                                                        onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                                                        className="w-full bg-black/10 pt-6 pb-2 px-4 rounded-xl"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <p className="absolute left-4 top-2 text-black/40 text-[10px]">Telephone / เบอร์โทรศัพท์</p>
                                                    <input
                                                        type="text"
                                                        value={formData.telephone}
                                                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                                        onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                                                        className="w-full bg-black/10 pt-6 pb-2 px-4 rounded-xl"
                                                        required
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={handleAuth}
                                        className="w-full p-4 font-semibold bg-black text-white rounded-xl transition duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-black/40 mb-4"
                                    >
                                        {isLoginMode ? "เข้าสู่ระบบ" : "ลงทะเบียน"}
                                    </button>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
