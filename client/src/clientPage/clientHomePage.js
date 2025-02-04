import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Database, Shield, Brain, Wifi, Gamepad } from "lucide-react";
import ax from '../conf/ax';

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

const CourseCard = ({ image, title, author, rating, ratingCount, duration, lectures, level, price }) => (
  <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <img
      src={image}
      alt={title}
      className="w-full h-48 object-cover rounded-t-lg"
    />
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-2">By {author}</p>
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-600">({ratingCount})</span>
      </div>
      <p className="text-gray-600 mb-2">{duration} • {lectures} • {level}</p>
      <p className="text-xl font-bold text-blue-600">${price}</p>
    </div>
  </div>
);

const ClientHomePage = () => {
  const navigate = useNavigate();

  const handleCategoryWebDev = () => navigate("/clienthome/web-dev");
  const handleCategoryDataScience = () => navigate("/clienthome/data-sci");
  const handleCategoryCyberSecurity = () => navigate("/clienthome/cyber-security");
  const handleCategoryAI = () => navigate("/clienthome/ai");
  const handleCategoryIoT = () => navigate("/clienthome/internet-of-things");
  const handleCategoryGameDev = () => navigate("/clienthome/game-dev");

  const handleSeeAllCourses = () => navigate("/courses");
  const fetchDataInfo = async () => {
    try {
      const userResponse = await ax.get(`users/me?populate=role`);
      console.log(userResponse)


    } catch (error) {
      console.log(error)
    }
  };
  fetchDataInfo();


  const categories = [
    {
      icon: Code,
      title: 'Web Development',
      courses: 15,
      onClick: handleCategoryWebDev,
    },
    {
      icon: Database,
      title: 'Data Science',
      courses: 12,
      onClick: handleCategoryDataScience,
    },
    {
      icon: Shield,
      title: 'Cyber Security',
      courses: 10,
      onClick: handleCategoryCyberSecurity,
    },
    {
      icon: Brain,
      title: 'Artificial Intelligence',
      courses: 14,
      onClick: handleCategoryAI,
    },
    {
      icon: Wifi,
      title: 'Internet of Things',
      courses: 8,
      onClick: handleCategoryIoT,
    },
    {
      icon: Gamepad,
      title: 'Game Development',
      courses: 11,
      onClick: handleCategoryGameDev,
    },
  ];

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