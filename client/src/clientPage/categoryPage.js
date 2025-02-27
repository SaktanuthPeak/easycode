import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ax from "../conf/ax";
import conf from "../conf/main";
import no_image_available from "./images/No_image_available.svg.jpg";
import { motion } from "framer-motion";
import CategorySidebar from "../component/categorySidebar";

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const response = await ax.get(`categories/${categoryId}?populate=courses.course_img`);
                setCategoryData(response.data.data);
            } catch (error) {
                console.error("Error fetching category details:", error);
            }
        };

        fetchCategoryDetails();
    }, [categoryId]);

    if (!categoryData) {
        return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
    }

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

    return (
        <div className="container mx-auto p-6">
            <motion.h1
                className="text-4xl font-bold text-center text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.1 }}
            >
                {categoryData.Category_name}'s Courses
            </motion.h1>
            <p className="text-lg text-center text-gray-600 mt-2">
                {categoryData.Category_description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
                {/* Sidebar */}
                <div className="md:col-span-1">
                    <CategorySidebar />
                </div>

                {/* Courses List */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryData.courses.map((course) => (
                        <motion.div
                            key={course.id}
                            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 1, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1, delay: 0.1 }}
                            onClick={() => navigate(`/client-home/${categoryId}/${course.documentId}`)}
                        >
                            <motion.img
                                src={course.course_img?.length > 0 ? getImageUrl(course.course_img[0]) : no_image_available}
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
        </div>
    );
};

export default CategoryPage;
