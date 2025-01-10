import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { ChevronDown, HomeIcon, Code, Database, Shield, Brain, Wifi, Gamepad } from "lucide-react";

const CategorySidebar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();
    const handleCategoryWebDev = () => navigate("/clienthome/web-dev");
    const handleCategoryDataScience = () => navigate("/clienthome/data-sci");
    const handleCategoryCyberSecurity = () => navigate("/clienthome/cyber-security");
    const handleCategoryAI = () => navigate("/clienthome/ai");
    const handleCategoryIoT = () => navigate("/clienthome/internet-of-things");
    const handleCategoryGameDev = () => navigate("/clienthome/game-dev");
    const handlehomebutton = () => navigate("/clienthome");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const categories = [
        { icon: Code, name: "Web Development", onClick: handleCategoryWebDev },
        { icon: Database, name: "Data Science", onClick: handleCategoryDataScience },
        { icon: Shield, name: "Cyber Security", onClick: handleCategoryCyberSecurity },
        { icon: Brain, name: "Artificial Intelligence", onClick: handleCategoryAI },
        { icon: Wifi, name: "Internet of Things", onClick: handleCategoryIoT },
        { icon: Gamepad, name: "Game Development", onClick: handleCategoryGameDev },
    ];

    return (
        <div className="w-64 bg-white rounded-lg shadow-md p-4">
            <div className="pb-3 border-b border-gray-200">
                <button
                    onClick={handlehomebutton}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4"
                >
                    <HomeIcon className="w-4 h-4" />
                    <span>Back to Home</span>
                </button>
                <h2 className="text-lg font-semibold">Categories</h2>
            </div>

            <div className="mt-4 relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors"
                >
                    <span>Select a Category</span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg border border-gray-200">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <button
                                    key={category.path}
                                    onClick={category.onClick}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md"
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{category.name}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorySidebar;