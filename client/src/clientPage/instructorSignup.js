import React, { useState, useEffect } from "react";
import ax from "../conf/ax";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const InstructorSignup = () => {
    const [formData, setFormData] = useState({
        name_teacher: "",
        description_teacher: "",
        users_permissions_user: "",
        img_teacher: null,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await ax.get("/users/me");
                console.log("User info:", response.data);
                setFormData({
                    name_teacher: response.data.username,
                    users_permissions_user: response.data.documentId,
                    description_teacher: "",
                    img_teacher: null,
                });
            } catch (err) {
                console.error("Error fetching user info:", err);
            }
        };
        fetchUserInfo();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setFileContent(null);
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setFileContent(content);
            };

            if (file.type.startsWith("image/")) {
                reader.readAsDataURL(file);
            } else {
                console.warn("File type not supported for simple reading.");
                reader.readAsText(file);
            }
        }
    };

    const notifySuccess = (message) => {
        toast.success(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const notifyError = (message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setError(null);

            let imageId = null;
            if (selectedFile) {
                const imageFormData = new FormData();
                imageFormData.append("files", selectedFile);

                const uploadResponse = await ax.post("/upload", imageFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (uploadResponse.data && uploadResponse.data.length > 0) {
                    imageId = uploadResponse.data[0].id;
                }
            }

            const dataToSend = {
                ...formData,
                img_teacher: imageId,
            };

            console.log("Data to send:", dataToSend);

            const response = await ax.post("/instructors", {
                data: dataToSend,
            });

            console.log("Signup successful:", response.data);
            notifySuccess("Successfully requesting the right to become an instructor!");
            setTimeout(() => {
                navigate("/client-home");
            }, 1500);
        } catch (err) {
            console.error("Error signing up:", err);
            if (err.response) {
                console.error("Server response:", err.response.data);
            }
            notifyError("Signup failed. Please try again.");
            setError("Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100"
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Instructor Signup
                </h2>
                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 mb-4 text-center"
                    >
                        {error}
                    </motion.p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name_teacher"
                            value={formData.name_teacher}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            name="description_teacher"
                            value={formData.description_teacher}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            name="img_teacher"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {selectedFile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4"
                            >
                                <p className="text-gray-700">Selected File: {selectedFile.name}</p>
                                {fileContent && (
                                    <div className="mt-2 p-2 border rounded-lg">
                                        {typeof fileContent === "string" &&
                                            fileContent.startsWith("data:image/") ? (
                                            <img
                                                src={fileContent}
                                                alt="File Preview"
                                                className="max-w-full rounded-lg"
                                            />
                                        ) : null}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing up..." : "Sign Up"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default InstructorSignup;