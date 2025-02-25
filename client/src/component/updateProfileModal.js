import React from "react";
import { motion } from "framer-motion";

const UpdateProfileModal = ({ isOpen, onClose, formData, handleInputChange, handleSubmit, isLoading }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="bg-white p-6 rounded shadow-lg w-full max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                <h2 className="text-xl font-bold mb-4">Update Profile ✏️</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <motion.input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            className="w-full p-2 border rounded"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                        />
                        <motion.input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            className="w-full p-2 border rounded"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.2 }}
                        />
                        <motion.input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="w-full p-2 border rounded"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.3 }}
                        />
                        <motion.input
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                            className="w-full p-2 border rounded"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.4 }}
                        />
                        <motion.input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleInputChange}
                            placeholder="Birthdate"
                            className="w-full p-2 border rounded"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.5 }}
                        />
                    </div>
                    <motion.div
                        className="flex justify-end mt-6 space-x-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.6 }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </button>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default UpdateProfileModal;