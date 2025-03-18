import { Navbar, Footer } from "./modules/utility/navigation.jsx";
import { motion } from "framer-motion";
import { Feature } from "../config.base.jsx";

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="relative min-h-screen overflow-hidden flex items-center">
                <div className="absolute inset-0 w-full h-full">
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            background: 'radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.6), transparent 50%), radial-gradient(circle at 100% 100%, rgba(255, 255, 255, 0.4), transparent 50%), linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                        }}
                    ></div>
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage:
                                'linear-gradient(rgba(0, 0, 0, 0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.45) 1px, transparent 1px)',
                            backgroundSize: '100px 100px',
                            opacity: '0.1',
                        }}
                    >
                    </div>
                </div>
                <div className="hidden sm:block absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[#f1f1f1]/20 rounded-full blur-[50vw]" />
                <div className="hidden sm:block absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[100vw] h-[100vw] bg-[#f1f1f1]/20 rounded-full blur-[50vw]" />
                <div className="z-10 relative myContainer mx-auto flex items-center justify-start sm:justify-between">
                    <div data-aos="fade-left" data-aos-duration={1000} className="p-8 sm:p-10 aos-init aos-animate">
                        <h1 className="text-base sm:text-lg xl:text-xl mb-4 text-gray-800">รับเงินโดเนทจากผู้ติดตามของคุณ<br />ได้ง่ายกว่า เร็วกว่า และปลอดภัยกว่า ที่</h1>
                        <h1 className="text-6xl sm:text-7xl xl:text-8xl tracking-tighter font-inter-bold mb-12 relative">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000ff] to-[#3B82F6]">Fluffy</span>
                            <span className="text-black">Donate</span>
                        </h1>
                    </div>
                    <div className="hidden sm:block home_donate_page_preview_warp">
                        <img className="w-[400px] h-[225px] md:w-[533px] md:h-[300px] xl:w-[640px] xl:h-[360px] rounded-2xl shadow-xl shadow-black/30 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-800/30 home_donate_page_preview" src="./Untitled.png" alt />
                    </div>
                </div>
            </div>


            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        background: 'radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.6), transparent 50%), radial-gradient(circle at 100% 100%, rgba(255, 255, 255, 0.4), transparent 50%), linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                    }}
                ></div>
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(0, 0, 0, 0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.45) 1px, transparent 1px)',
                        backgroundSize: '100px 100px',
                        opacity: '0.1',
                    }}
                >
                </div>

                <div className="relative py-24">
                    <div className="mx-auto myContainer">
                        <motion.div
                            className="text-center max-w-3xl mx-auto mb-24"
                            initial={{ opacity: 0, y: -50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full mb-4">
                                Why Choose App?
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-semibold mb-6">
                                ระบบรับเงินโดเนทที่{" "}
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-bl from-[#0000ff] to-[#3B82F6]">
                                        ดีที่สุด
                                    </span>
                                    <div className="absolute -inset-1 bg-blue-500/20 blur-xl -z-0" />
                                </span>{" "}
                                สำหรับสตรีมเมอร์
                            </h1>
                            <p className="text-lg max-w-2xl mx-auto">
                                เราเข้าใจความต้องการของสตรีมเมอร์<br />
                                จึงพัฒนาระบบที่ใช้งานง่าย ปลอดภัย และไม่มีค่าธรรมเนียม!
                            </p>

                        </motion.div>


                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mb-32"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={{
                                hidden: { opacity: 0, scale: 0.95 },
                                visible: {
                                    opacity: 1,
                                    scale: 1,
                                    transition: { staggerChildren: 0.2 },
                                },
                            }}
                        >
                            {Feature.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="group relative bg-gradient-to-b from-white/70 to-gray-100 p-8 rounded-2xl border border-gray-300 hover:border-blue-400 transition-all duration-500"
                                    variants={{
                                        hidden: { opacity: 0, y: 50 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-200/50 to-transparent blur-3xl group-hover:opacity-75 transition duration-500 opacity-0"></div>
                                    <div className="relative">
                                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                            {item.icon}
                                        </div>
                                        <h2 className="text-2xl font-semibold mb-4 flex items-center">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-bl from-blue-500 to-blue-400">Easy</span>{item.name}
                                        </h2>
                                        <div className="space-y-4">
                                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                                                {item.detail}
                                            </p>
                                            <ul className="space-y-3">
                                                {item.verify.map((text) => (
                                                    <li className="flex items-center text-sm sm:text-base text-gray-600">
                                                        <svg
                                                            className="w-5 h-5 mr-3 text-blue-500"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        {text}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            className="relative max-w-5xl mx-auto mt-16"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 1 }}
                        >
                            <div className="relative overflow-hidden p-8 sm:p-12 bg-gradient-to-br from-white to-gray-100 border border-gray-200 rounded-2xl">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 via-transparent to-blue-100 blur-3xl opacity-50"></div>
                                <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8">
                                    <div>
                                        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-500 text-sm font-medium rounded-full mb-4">
                                            ข้อดีที่สุดของเรา
                                        </span>
                                        <h3 className="text-3xl font-semibold mb-4 text-gray-800">
                                            ไม่มีค่าธรรมเนียม<br />
                                            <span className="text-gray-600">
                                            รับเงินเต็มจำนวน
                                            </span>
                                        </h3>
                                        <div className="relative inline-block">
                                            <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-bl from-blue-500 to-blue-400">
                                                0%
                                            </h1>
                                            <div className="absolute -inset-4 bg-blue-100 blur-3xl -z-10" />
                                        </div>
                                    </div>
                                    <motion.div
                                        className="sm:max-w-sm w-full bg-white shadow-lg p-8 rounded-2xl border border-gray-200"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        <p className="text-lg mb-4 text-gray-600">
                                            เงินโดเนททุกบาทที่คุณได้รับ
                                        </p>
                                        <h2 className="text-4xl font-bold bg-gradient-to-bl from-blue-500 to-blue-400 bg-clip-text text-transparent">
                                            เป็นของคุณ 100%
                                        </h2>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            </div>
            <Footer />
        </>
    );
}