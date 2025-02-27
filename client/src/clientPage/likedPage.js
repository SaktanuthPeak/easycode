import React, { useState, useEffect } from "react";
import ax from "../conf/ax";
import conf from "../conf/main";
import no_image_available from "./images/No_image_available.svg.jpg";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const LikedPage = () => {
    const [likedCourses, setLikedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedCourses = async () => {
            try {
                const response = await ax.get(`users/me?populate=liked_courses.course_img&populate=liked_courses.category`);
                setLikedCourses(response.data?.liked_courses || []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching liked courses:", error);
                setError("Failed to load liked courses. Please try again.");
                setLoading(false);
            }
        };

        fetchLikedCourses();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    const getImageUrl = (img) => {
        if (!img || !img.url) return no_image_available;
        return img.url.startsWith("/") ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}` : img.url;
    };

    return (
        <div className="min-h-screen p-8 ">
            <motion.h1
                className="text-4xl font-bold text-center text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
            >
                Your Liked Courses
            </motion.h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {likedCourses.map((course) => (

                    <motion.div
                        key={course.documentId}
                        className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: 0.1 }}
                        onClick={() => navigate(`/client-home/${course.category.documentId}/${course.documentId}`)}

                    >
                        <motion.img
                            src={getImageUrl(course.course_img?.[0])}
                            alt={course.Course_name}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.1 }}
                        />
                        <h2 className="text-lg font-semibold">{course.Course_name}</h2>
                    </motion.div>

                ))}
            </div>
        </div>
    );
};

export default LikedPage;