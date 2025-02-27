import React, { useState, useEffect } from "react";
import ax from "../conf/ax";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";

const NotificationPage = () => {
    const [username, setUsername] = useState("");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const fetchUser = await ax.get(`/users/me`);
                setUsername(fetchUser.data.username);
            } catch (error) {
                console.error("Error fetching username:", error);
            }
        };
        fetchUsername();
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const fetchMessage = await ax.get(`/messages?filters[username][$eq]=${username}&populate=*`);

                setNotifications(fetchMessage.data.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
                setNotifications([]);
            }
        };

        if (username) {
            fetchNotifications();
        }
    }, [username]);

    const deleteNotification = async (documentId) => {
        try {
            await ax.delete(`messages/${documentId}`);
            setNotifications(notifications.filter((notification) => notification.documentId !== documentId));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    return (
        <div className="min-h-screen p-8 ">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="space-y-4">
                <AnimatePresence>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => {
                            const adminContext = notification?.admin_context;
                            const contextMessage = notification?.context;

                            return (
                                <motion.div
                                    key={notification.documentId || index}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex justify-between items-center p-4 bg-white shadow rounded-md"
                                >
                                    <div>
                                        {contextMessage && (
                                            <p className="text-sm text-gray-800 mb-1">
                                                💬 <span className="font-semibold">{contextMessage}</span>
                                            </p>
                                        )}
                                        {adminContext && (
                                            <p className="text-sm text-gray-800">
                                                Reply from admin 🛡️: <span className="font-semibold">{adminContext}</span>
                                            </p>
                                        )}
                                        {!contextMessage && !adminContext && (
                                            <p className="text-sm text-gray-800">
                                                New notification received
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => deleteNotification(notification.documentId)}
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 bg-white shadow rounded-md"
                        >
                            <p className="text-sm text-gray-500">No new notifications at this time.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NotificationPage;