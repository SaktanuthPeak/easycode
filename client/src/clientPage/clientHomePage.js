import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, FolderCode, Database, Shield, BrainCircuit, Wifi, Gamepad } from "lucide-react";
import ax from '../conf/ax';
import { motion } from 'framer-motion';
import WebFooter from '../component/webFooter';
import AdvertisementBanner from '../component/advertisementBanner';
import computerguy from "./images/computerguy.png"
import no_image_available from "./images/No_image_available.svg.jpg";
import conf from '../conf/main';
import instructor from "./images/teacher.png"
import { ArrowRight } from 'lucide-react';

const iconMap = {
    "Web Development": FolderCode,
    "Data Science": Database,
    "Cyber Security": Shield,
    "Artificial Intelligence": BrainCircuit,
    "Internet of Things": Wifi,
    "Game Development": Gamepad,
};

const HeroSection = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Transform your life through education
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            Learners around the world are launching new careers, advancing in their fields, and enriching their lives.
                        </p>
                        <button
                            onClick={() => navigate('/client-home/all-courses')}
                            className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-md font-medium hover:bg-gray-800 transition-colors">
                            Checkout Courses <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                    <div className="relative">
                        <div className="bg-blue-100 rounded-3xl overflow-hidden">
                            <img
                                src={computerguy}
                                alt="Student learning on laptop"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
const BecomeInstructorSection = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                <motion.div
                    className="relative w-full lg:w-3/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="bg-purple-200 rounded-full w-full aspect-square max-w-lg mx-auto overflow-hidden relative">
                        <img
                            src={instructor}
                            alt="Instructor"
                            className="object-cover object-center w-full h-full"
                        />
                    </div>
                </motion.div>

                <motion.div
                    className="w-full lg:w-1/2 space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Become an Instructor
                    </h2>

                    <p className="text-lg text-gray-700">
                        Instructors from around the world teach millions of students on Byway.
                        We provide the tools and skills to teach what you love.
                    </p>

                    <button
                        onClick={() => navigate('/client-home/instructor-signup')}
                        className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
                    >
                        Start Your Instructor Journey
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

const CategoryCard = ({ icon: Icon, title, courses, onClick }) => {
    return (
        <motion.div
            onClick={onClick}
            className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="bg-blue-100 rounded-full p-4 mb-4"
                whileHover={{ rotate: 10 }}
            >
                <Icon className="w-10 h-10 text-blue-600" />
            </motion.div>
            <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
            <p className="text-gray-600">{courses} Courses</p>
        </motion.div>
    );
};
const CourseCard = ({ course, navigate }) => {
    const getImageUrl = (img) => {
        if (!img || !img.url) return no_image_available;
        return img.url.startsWith("/") ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}` : img.url;
    };

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

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <motion.div
            className="flex flex-col items-center p-4 mt-8 bg-white rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, delay: 0.1 }}
            onClick={() => navigate(`/client-home/${course.category?.documentId}/${course.documentId}`)}
        >
            <motion.img
                src={getImageUrl(course.image || course.course_img?.[0])}
                alt={course.name || course.Course_name}
                className="rounded-lg w-full h-40 object-cover"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.1 }}
            />
            <div className="p-3 text-center w-full">
                <h3 className="text-lg font-semibold text-gray-800">{truncateText(course.name || course.Course_name, 20)}</h3>
                <p className="text-sm text-gray-500 mt-1">Created By Me</p>
                {course.rating ? renderStars(course.rating) : <p className="text-sm text-gray-500 mt-1">No rating</p>}
                <p className="text-sm text-gray-500 mt-1">
                    Total Chapters: {course.course_chapters?.length || 0}
                </p>
                {course.price && <p className="text-l text-black-500 mt-2">price: {course.price} ฿</p>}
            </div>
        </motion.div>
    );
};

const ClientHomePage = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [topCourses, setTopCourses] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await ax.get("categories?populate=*");
                const fetchedCategories = response.data.data.map(item => ({
                    title: item.Category_name,
                    icon: iconMap[item.Category_name] || Code,
                    courses: item.courses.length || 0,
                    onClick: () => navigate(`/client-home/${item.documentId}`),
                }));
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);

            }
        };

        const fetchTopCourses = async () => {
            try {
                const response = await ax.get("courses?populate=users&populate=course_img&populate=course_chapters&populate=category");
                const sortedCourses = response.data.data
                    .map(course => ({
                        documentId: course.documentId,
                        name: course.Course_name,
                        users: course.users.length,
                        image: course.course_img?.[0] || null,
                        rating: course.rating,
                        course_chapters: course.course_chapters,
                        price: course.price,
                        category: course.category
                    }))
                    .sort((a, b) => b.users - a.users)
                    .slice(0, 4);
                setTopCourses(sortedCourses);
            } catch (error) {
                console.error("Error fetching top courses:", error);
            }
        };

        fetchCategory();
        fetchTopCourses();
    }, [navigate]);

    return (
        <div className="min-h-screen">
            <motion.div
                className="mb-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <AdvertisementBanner />
            </motion.div>
            <div className="p-8">
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl font-bold text-gray-800">All Categories</h1>
                    <p className="text-lg text-gray-600 mt-2">Explore a variety of courses</p>
                </motion.div>
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {categories.map((category, index) => (
                        <CategoryCard key={index} {...category} />
                    ))}
                </motion.div>
                <motion.div
                    className="mb-12 text-center mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >

                    <h1 className="text-4xl font-bold text-gray-800">Top Courses</h1>
                    <p className="text-lg text-gray-600 mt-2">Courses with the most people studying</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                        {topCourses.map((course, index) => (
                            <CourseCard
                                key={index}
                                course={course}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                </motion.div>

                <BecomeInstructorSection />
                <HeroSection />
            </div>
            <WebFooter />
        </div>
    );
};

export default ClientHomePage;