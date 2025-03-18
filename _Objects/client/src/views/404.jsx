import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function NotFound() {
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
        );
    }, []);

    return (
        <div ref={containerRef} className="h-screen flex">
            <div className="mx-auto myContainer my-auto text-center sm:text-left">
                <h1 className="text-4xl sm:text-6xl mx-auto sm:mx-0 font-semibold bg-gradient-to-bl from-[#33f1ff] to-[#7f33ff] py-1 sm:py-4 text-transparent bg-clip-text w-fit">
                    ไม่พบหน้ารับเงินนี้
                </h1>
                <p className="text-xl sm:text-4xl">Not Found this donate page.</p>
                <div className="flex flex-col sm:flex-row gap-2 mt-6">
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="px-3 py-2 border-2 text-sm border-gray-700 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-700 hover:text-white transition-all duration-300"
                    >
                        กลับสู่หน้าแรก
                    </button>
                </div>
            </div>
        </div>
    );
}