import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="loader">Loading...</div>
        </motion.div>
    );
};

export default Loading;