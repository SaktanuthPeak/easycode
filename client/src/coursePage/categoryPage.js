import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ax from "../conf/ax";
import no_image_available from "./images/No_image_available.svg.jpg";
import { motion } from "framer-motion";

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const baseURL = "http://localhost:1337";

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const response = await ax.get(`categories/${categoryId}?populate=courses.course_img`);
                console.log("API Response:", response.data);
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
    return (
        <div className="container mx-auto p-6">
            <motion.h1
                className="text-4xl font-bold text-center text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {categoryData.Category_name}'s Courses
            </motion.h1>
            <p className="text-lg text-center text-gray-600 mt-2">
                {categoryData.Category_description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
                {categoryData.courses.map((course) => (
                    <motion.div
                        key={course.id}
                        className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                        whileHover={{ scale: 1.05 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: course.id * 0.1 }}
                    >
                        <motion.img
                            src={course.course_img?.length > 0 ? `${baseURL}${course.course_img[0].url}` : no_image_available}
                            alt={course.Course_name}
                            className="rounded-lg w-full h-48 object-cover"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
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

export default CategoryPage;
