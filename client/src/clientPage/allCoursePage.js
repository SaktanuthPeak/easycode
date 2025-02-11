import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ax from "../conf/ax";
import conf from "../conf/main";
import no_image_available from "./images/No_image_available.svg.jpg";
import { motion } from "framer-motion";

const AllCoursePage = () => {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const courseResponse = await ax.get(`/courses?populate=*`);
                setCourses(courseResponse.data.data);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchAllCourses();
    }, []);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        return (
            <div className="flex justify-center items-center mt-1">
                <div className="flex">
                    {[...Array(fullStars)].map((_, i) => (
                        <span key={i} className="text-yellow-500 text-lg">⭐</span>
                    ))}
                    {halfStar && <span className="text-yellow-500 text-lg">⭐️</span>}
                </div>
                <span className="text-gray-700 text-sm ml-2">({rating.toFixed(1)})</span>
            </div>
        );
    };

    const getImageUrl = (img) => {
        if (!img || !img.url) return no_image_available;
        return img.url.startsWith("/") ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}` : img.url;
    };

    const filteredCourses = courses.filter(course =>
        course.Course_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6">
            <motion.h1
                className="text-4xl font-bold text-center text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
            >
                All Courses
            </motion.h1>
            <p className="text-lg text-center text-gray-600 mt-2">
                Browse our available courses and start learning today!
            </p>

            <div className="flex justify-center mt-4">
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="p-2 border rounded-lg w-1/2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {filteredCourses.map((course) => (
                    <motion.div
                        key={course.id}
                        className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: 0.1 }}
                        onClick={() => navigate(`/client-home/${course.category.documentId}/${course.documentId}`)}
                    >
                        <motion.img
                            src={getImageUrl(course.course_img[0])}
                            alt={course.Course_name}
                            className="rounded-lg w-full h-48 object-cover"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.1 }}
                        />
                        <div className="p-4 text-center">
                            <h3 className="text-xl font-semibold text-gray-800">{course.Course_name}</h3>
                            <p className="text-sm text-gray-500 mt-1">Created By Me</p>
                            {course.rating ? renderStars(course.rating) : <p className="text-sm text-gray-500 mt-1">No rating</p>}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AllCoursePage;
