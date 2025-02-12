import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Database, Shield, Brain, Wifi, Gamepad } from "lucide-react";
import ax from '../conf/ax';
import { motion } from 'framer-motion';
import AdvertisementBanner from '../component/advertisementBanner';
import WebFooter from '../component/webFooter';

const iconMap = {
    "Web Development": Code,
    "Data Science": Database,
    "Cyber Security": Shield,
    "Artificial Intelligence": Brain,
    "Internet of Things": Wifi,
    "Game Development": Gamepad,
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

const HomePreviewPage = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await ax.get("categories?populate=*");
                console.log(response.data.data)
                const fetchedCategories = response.data.data.map(item => ({
                    title: item.Category_name,
                    icon: iconMap[item.Category_name] || Code,
                    courses: item.courses.length || 0,
                    onClick: () => navigate(`/home-preview/${item.documentId}`),
                }));
                setCategories(fetchedCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategory();
    }, [navigate]);

    return (
        <div>
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
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {categories.map((category, index) => (
                        <CategoryCard key={index} {...category} />
                    ))}
                </motion.div>
            </div>
            <WebFooter />
        </div>


    );
};

export default HomePreviewPage;
