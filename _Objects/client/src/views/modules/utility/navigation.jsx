import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Disclosure, Menu } from '@headlessui/react';
import { useAuth } from '../userAuthContext.jsx';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { NavbarLink } from '../../../config.base.jsx';
import { motion, AnimatePresence } from "framer-motion";
import { showConfirmationDialog } from './sentalert.jsx';

export function Navbar() {
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [profileImage, setProfileImage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:3000/users/${user.id}`);
                    setUserData(response.data);
                    setProfileImage('http://localhost:3000/' + response.data.image);
                } catch (error) {
                    console.error("Error fetching user data:", error);

                } finally {
                    setLoading(false);
                }
            };

            fetchData();

            const interval = setInterval(fetchData, 500);

            return () => clearInterval(interval);
        }
    }, [user]);

    const handleLogoutClick = async () => {
        await showConfirmationDialog(logout);
    };

    return (
        <Disclosure as="nav" className="fixed w-full top-0 z-50 shadow-lg bg-white/10 backdrop-blur-md">
            {({ open }) => (
                <>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">

                            <div className="flex items-center space-x-2">
                                <a href="/" className="text-2xl font-bold tracking-tight">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000ff] to-[#3B82F6]">
                                        FLUFFY
                                    </span>
                                    <span className="text-black">DONATE</span>
                                </a>
                            </div>

                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                                <div className="hidden sm:flex sm:space-x-8">
                                    <div className="flex space-x-4 items-center">
                                        {NavbarLink.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="w-full text-center sm:w-auto px-6 py-3 sm:py-1 bg-white/10 border border-white/10 sm:bg-transparent sm:border-none rounded-xl sm:rounded-full transition duration-300 hover:bg-white/20 sm:hover:bg-white/10 sm:hover:border-white/10"
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>

                                    {user ? (
                                        <Menu as="div" className="relative inline-block text-left">
                                            <Menu.Button
                                                type="button"
                                                className="w-full sm:w-auto bg-gray-100 border border-gray-300 pl-2 pr-3 py-1 flex justify-center items-center gap-2 rounded-full transition-all duration-300 hover:bg-gray-200 hover:border-blue-500"
                                            >
                                                <img
                                                    src={profileImage || "https://arima.moe/easydonate/profile/2e667a7e1e27377dd8dab4add615e070.jpeg"}
                                                    className="w-[30px] h-[30px] object-cover rounded-full"
                                                />
                                                <div className="text-left">
                                                    <h1 className="text-gray-800 text-sm">{userData?.username}</h1>
                                                </div>
                                                <p className="text-gray-800 text-sm">
                                                    <i className="fas fa-caret-down" />
                                                </p>
                                            </Menu.Button>

                                            <AnimatePresence>
                                                <Menu.Items
                                                    as={motion.div}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="absolute top-16 2xl:top-16 right-0 w-[250px] bg-white border border-gray-200 rounded-xl overflow-hidden p-2 shadow-lg"
                                                >
                                                    {userData?.role === "ADMIN" ? (
                                                        <>
                                                            <Menu.Item>
                                                                <div className="mb-2">
                                                                    <a href="/admin-controller">
                                                                        <button
                                                                            className="w-full p-2.5 rounded-xl bg-gray-100 text-black transition duration-300 hover:bg-gray-200"
                                                                        >
                                                                            การจัดการ
                                                                        </button>
                                                                    </a>
                                                                </div>
                                                            </Menu.Item>
                                                        </>
                                                    ) : ''}
                                                    {userData?.role === "ADMIN" ? (
                                                        ''
                                                    ) :
                                                        <Menu.Item>
                                                            <div className="mb-2">
                                                                <a href="/dashboard">
                                                                    <button
                                                                        className="w-full p-2.5 rounded-xl bg-gray-100 text-black transition duration-300 hover:bg-gray-200"
                                                                    >
                                                                        {user.role === "ADMIN" ? 'มุมมองผู้ใช้' : 'หน้าจัดการ'}
                                                                    </button>
                                                                </a>
                                                            </div>
                                                        </Menu.Item>
                                                    }

                                                    <Menu.Item>
                                                        <button
                                                            onClick={handleLogoutClick}
                                                            className="w-full p-2.5 rounded-xl bg-blue-500 text-white transition duration-300 hover:bg-blue-600"
                                                        >
                                                            <i className="far fa-power-off mr-2"></i>
                                                            ออกจากระบบ
                                                        </button>
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </AnimatePresence>
                                        </Menu>
                                    ) : (
                                        <div className="flex gap-4">
                                            <a
                                                href="/oauth"
                                                className="bg-gray-100 px-6 py-1 shadow-md border border-gray-300 rounded-full transition-all duration-300 hover:bg-gray-200 hover:border-blue-500"
                                            >
                                                Login
                                            </a>
                                            <a
                                                href="/oauth"
                                                className="bg-gray-100 px-6 py-1 shadow-md border border-gray-300 rounded-full transition-all duration-300 hover:bg-gray-200 hover:border-blue-500"
                                            >
                                                Register
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="sm:hidden flex items-center">
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 border bg-gray-100 border-gray-300 hover:bg-gray-100/80">
                                        <span className="sr-only">Open menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6 text-gray-800" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6 text-gray-800" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>

                                </div>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {NavbarLink.map((item) => (
                                <Disclosure.Button
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    className='block text-center sm:w-auto px-6 py-3 sm:py-1 bg-white/40 border border-gray-300 sm:bg-gray-100 sm:border-none rounded-xl sm:rounded-full transition duration-300 hover:bg-white/20 sm:hover:bg-white/20 sm:hover:border-white/10'
                                >
                                    {item.name}
                                </Disclosure.Button>
                            ))}

                            {user ? (
                                <>
                                    {userData?.role === "ADMIN" ? (
                                        <>
                                            <Disclosure.Button
                                                as="a"
                                                href="/admin-controller"
                                                className="block text-white bg-gradient-to-br from-yellow-400 to-orange-500 px-6 py-3 rounded-lg shadow-md hover:opacity-90"
                                            >
                                                แอดมิน
                                            </Disclosure.Button>
                                        </>
                                    ) : ''}
                                    <Disclosure.Button
                                        as="a"
                                        href="/dashboard"
                                        className="block text-white bg-gradient-to-br from-yellow-400 to-orange-500 px-6 py-3 rounded-lg shadow-md hover:opacity-90"
                                    >
                                        หน้าจัดการ
                                    </Disclosure.Button>
                                </>
                            ) : (
                                <>
                                    <Disclosure.Button
                                        as="a"
                                        href="/oauth"
                                        className="block text-white bg-gradient-to-br from-yellow-400 to-orange-500 px-6 py-3 rounded-lg shadow-md hover:opacity-90"
                                    >
                                        Login
                                    </Disclosure.Button>
                                    <Disclosure.Button
                                        as="a"
                                        href="/oauth"
                                        className="block text-white bg-gradient-to-br from-green-400 to-blue-500 px-6 py-3 rounded-lg shadow-md hover:opacity-90"
                                    >
                                        Register
                                    </Disclosure.Button>
                                </>
                            )}
                        </div>
                    </Disclosure.Panel>
                </>
            )}

        </Disclosure>
    )
}

export function Footer() {
    return (
        <>
            <footer className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="text-lg font-medium text-center sm:text-left">
                            FLUFFY <br className="sm:hidden" /> DONATE
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-0 text-center">
                            <a
                                href="/privacy"
                                className="hover:text-transparent bg-clip-text bg-gradient-to-bl from-blue-500 to-blue-400 transition duration-300 text-sm font-medium"
                            >
                                นโยบายความเป็นส่วนตัว
                            </a>
                            <a
                                href="/terms"
                                className="hover:text-transparent bg-clip-text bg-gradient-to-bl from-blue-500 to-blue-400 transition duration-300 text-sm font-medium"
                            >
                                เงื่อนไขการให้บริการ
                            </a>
                            <a
                                href="/contact"
                                className="hover:text-transparent bg-clip-text bg-gradient-to-bl from-blue-500 to-blue-400 transition duration-300 text-sm font-medium"
                            >
                                ติดต่อเรา
                            </a>
                        </div>
                    </div>


                    <div className="border-t border-gray-300 mt-8"></div>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        <p>
                            © 2024 FLUFFY by{" "}
                            <a
                                target="blank"
                                href="https://ntdotjsx.web.app"
                                className="underline text-transparent bg-clip-text bg-gradient-to-bl from-blue-500 to-blue-400 hover:text-red-500 transition duration-300"
                            >
                                ntdotjsx
                            </a>
                            . All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export function Paper() {
    return (
        <>
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
        </>
    )
}