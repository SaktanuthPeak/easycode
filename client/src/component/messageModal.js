import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import ax from '../conf/ax';
import { toast } from 'react-toastify';
import { motion } from "framer-motion"
const MessageModalContext = createContext();

export const MessageModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <MessageModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {isOpen && <MessageModal onClose={closeModal} />}
        </MessageModalContext.Provider>
    );
};

export const useMessageModal = () => {
    const context = useContext(MessageModalContext);
    if (!context) {
        throw new Error('useMessageModal must be used within a MessageModalProvider');
    }
    return context;
};

const MessageModal = ({ onClose }) => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        context: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await ax.get(`users/me?populate=*`);
                const user = userResponse.data;
                setUserData(user);
                setFormData(prev => ({
                    ...prev,
                    username: user.username || '',
                    email: user.email || ''
                }));
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                toast.error('Failed to fetch user data.');
            }
        };

        fetchUserData();
    }, []); // ดึงข้อมูลเฉพาะตอนโมดัลเปิดครั้งแรก

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await ax.post('/messages', {
                data: {
                    username: formData.username,
                    context: formData.context,
                    timestamp: new Date().toISOString()
                }
            });

            // Reset form and close modal on success
            setFormData({ username: userData?.username || '', context: '' });
            onClose();

            toast.success('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end p-20 bg-black bg-opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-full max-w-md p-6 bg-white shadow-xl rounded-lg"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Send Message</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <textarea
                            placeholder="Your message"
                            value={formData.context}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                context: e.target.value
                            }))}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {isLoading ? 'Sending...' : <>Send <Send className="w-4 h-4" /></>}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );

};

export default MessageModal;
