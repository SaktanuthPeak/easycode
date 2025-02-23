import React from 'react';
import { Menu, MenuItem, MenuItems, MenuButton } from "@headlessui/react";
import { BellIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } }
};

const notificationItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: i => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.2 } }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

const Notification = ({ notifications, fetchNotifications, deleteNotification }) => {
    return (
        <Menu as="div" className="relative">
            {({ open }) => (
                <>
                    <MenuButton
                        className="relative rounded-full bg-white p-1 text-black-400 hover:text-gray-1000 focus:outline-0 focus:ring-2 focus:ring-black mr-2"
                        onClick={fetchNotifications}
                    >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </MenuButton>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                className="absolute right-0 z-10 mt-2 w-96 origin-top-right"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={dropdownVariants}
                            >
                                <MenuItems static className="rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        <AnimatePresence>
                                            {notifications.length > 0 ? (
                                                notifications.map((notification, index) => {
                                                    const adminContext = notification?.admin_context;
                                                    const contextMessage = notification?.context;

                                                    if (adminContext) {
                                                        return (
                                                            <motion.div
                                                                key={notification.documentId}
                                                                custom={index}
                                                                initial="hidden"
                                                                animate="visible"
                                                                exit="exit"
                                                                variants={notificationItemVariants}
                                                                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
                                                            >
                                                                <div>
                                                                    <p className="text-sm text-gray-800">
                                                                        💬 <span className="font-semibold">{contextMessage}</span>
                                                                    </p>
                                                                    <p className="text-sm text-gray-800">
                                                                        Reply from admin 🛡️: <span className="font-semibold">{adminContext}</span>
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    className="text-red-500 hover:text-red-700"
                                                                    onClick={() => deleteNotification(notification.documentId)}
                                                                >
                                                                    <TrashIcon className="h-5 w-5" />
                                                                </button>
                                                            </motion.div>
                                                        );
                                                    }
                                                    return null;
                                                })
                                            ) : (
                                                <motion.div
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    variants={notificationItemVariants}
                                                >
                                                    <div className="px-4 py-2 text-sm text-gray-500">
                                                        No new notifications at this time.
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </MenuItems>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}
        </Menu>
    );
};

export default Notification;