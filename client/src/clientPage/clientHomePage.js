import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, FolderCode, Database, Shield, BrainCircuit, Wifi, Gamepad } from "lucide-react";
import ax from '../conf/ax';
import { motion } from 'framer-motion';
import WebFooter from '../component/webFooter';
import AdvertisementBanner from '../component/advertisementBanner';
import computerguy from "./images/computerguy.png"

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-">
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
              className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
              Checkout Courses →
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

const ClientHomePage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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
    fetchCategory();
  }, [navigate]);

  return (
    <div className="min-h-screen ">

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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6  mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </motion.div>
        <HeroSection />
      </div>
      <WebFooter />
    </div>
  );
};

export default ClientHomePage;