import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Database, Shield, Brain, Wifi, Gamepad } from "lucide-react";
import ax from '../conf/ax';

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
    <div
      onClick={onClick}
      className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="bg-blue-100 rounded-full p-4 mb-4">
        <Icon className="w-10 h-10 text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{courses} Courses</p>
    </div>
  );
};

const ClientHomePage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await ax.get(`categories?populate=*`);
        const fetchedCategories = response.data.data.map(item => ({
          title: item.Category_name,
          icon: iconMap[item.Category_name] || Code,
          courses: item.courses_count || 0,

          onClick: () => navigate(`/client-home/${item.documentId}`), // ใช้ item.id แทน documentId
        }));
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, [navigate]);

  return (
    <div className="p-8">
      {/* Categories Section */}
      <div className="mb-12">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">All Categories</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientHomePage;
