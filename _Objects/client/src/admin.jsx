import { Navbar, Footer, Paper } from "./views/modules/utility/navigation";
import { motion } from "framer-motion";
import { Tab } from "@headlessui/react";
import { AdminMap } from "./config.base";

export default function AdminControl() {
    return (
        <>
            <Navbar />
            <Tab.Group>
                <div className="min-h-screen relative overflow-hidden pb-24 2xl:pt-24 2xl:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Paper />
                    </motion.div>
                    <div className="relative flex flex-col-reverse 2xl:flex-row pt-24 2xl:pt-0">
                        <Sidebar />

                        <div className="flex w-full pl-4 pr-4 2xl:pl-0 2xl:pr-8">
                            <div className="mx-auto myContainer-noPadding">
                                <Tab.Panels>
                                    {AdminMap.map((item, index) => (
                                        <Tab.Panel>{item.element}</Tab.Panel>
                                    ))}
                                </Tab.Panels>
                            </div>
                        </div>

                    </div>
                </div>
            </Tab.Group>
            <Footer />
        </>
    );
}

function Sidebar() {
    return (
        <motion.div
            className="block 2xl:min-w-[300px] 2xl:px-8 2xl:relative 2xl:order-none order-1 px-4 2xl:pt-0 pt-5 2xl:pb-0 pb-5 fixed 2xl:static bottom-0 left-0 right-0 z-10"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
        >
            <div className="bg-white border border-gray-200 rounded-2xl 2xl:shadow-lg">
                <Tab.List className="flex 2xl:flex-col flex-row space-x-2 2xl:space-x-0 2xl:space-y-2 overflow-x-auto">
                    {AdminMap.map((item, index) => (
                        <Tab
                            key={index}
                            className="relative block px-8 2xl:px-6 py-2 rounded-2xl transition duration-300 whitespace-nowrap hover:bg-gray-100 text-gray-800"
                        >
                            {({ selected }) => (
                                <div
                                    className="flex flex-col 2xl:text-left text-center"
                                >
                                    <h1 className="text-gray-800">{item.title}</h1>
                                    <p className="text-gray-500 text-[10px] mb-1">{item.subtitle}</p>
                                    {selected && (
                                        <div
                                            className={`transition duration-300 bg-[#0000ff] rounded-full ${"2xl:absolute 2xl:left-0 2xl:top-1/2 2xl:-translate-y-1/2 2xl:w-[6px] 2xl:h-[20px] " + "mx-auto w-[30px] h-[4px]"}`}

                                        />
                                    )}
                                </div>
                            )}
                        </Tab>
                    ))}
                </Tab.List>
                <motion.p
                    className="hidden 2xl:block text-center text-xs text-gray-400 pt-4 pb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    เมนูลัด / fast menu
                </motion.p>
            </div>
        </motion.div>
    );
}