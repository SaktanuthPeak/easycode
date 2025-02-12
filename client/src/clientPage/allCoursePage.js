import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ax from "../conf/ax";
import conf from "../conf/main";
import no_image_available from "./images/No_image_available.svg.jpg";
import { motion } from "framer-motion";
import CategorySidebar from "../component/categorySidebar";
import { Search } from "lucide-react";

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

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    };

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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                {/* Sidebar */}
                <div >
                    <CategorySidebar />
                </div>

                {/* Courses List */}
                <div className="md:col-span-3">
                    <div className="flex mb-10">
                        <div className="relative w-3/4 md:w-2/3 lg:w-5/6">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="p-2 pl-10 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <motion.div
                                key={course.id}
                                className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.1, delay: 0.1 }}
                                onClick={() => navigate(`/client-home/${course.category?.documentId}/${course.documentId}`)}
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
                                    <h3 className="text-xl font-semibold text-gray-800">{truncateText(course.Course_name, 25)}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Created By Me</p>
                                    {course.rating ? renderStars(course.rating) : <p className="text-sm text-gray-500 mt-1">No rating</p>}
                                    <p className="text-sm text-gray-500 mt-1">
                                        Total Chapters: {course.course_chapters?.length || 0}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllCoursePage;
