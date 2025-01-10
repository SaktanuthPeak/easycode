import React from 'react';
import { useNavigate } from "react-router-dom";



const CategorySidebar = () => {
    const navigate = useNavigate();
    const handleCategoryWebDev = () => navigate("/clienthome/web-dev");
    const handleCategoryDataScience = () => navigate("/clienthome/data-sci");
    const handleCategoryCyberSecurity = () => navigate("/clienthome/cyber-security");
    const handleCategoryAI = () => navigate("/clienthome/ai");
    const handleCategoryIoT = () => navigate("/clienthome/internet-of-things");
    const handleCategoryGameDev = () => navigate("/clienthome/game-dev");


    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4">Number of Chapters</h2>
            <ul className="space-y-2">
                <li>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" /> 1-10
                    </label>
                </li>
                <li>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" /> 10-15
                    </label>
                </li>
                <li>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" /> 15-20
                    </label>
                </li>
                <li>
                    <label className="flex items-center">
                        <input type="checkbox" className="mr-2" /> 20-25
                    </label>
                </li>
            </ul>
            <h2 className="text-lg font-bold mt-6 mb-4">Category</h2>
            <ul className="space-y-2">
                <li>
                    <button onClick={handleCategoryWebDev} className="text-blue-500 hover:underline">Web Development</button>

                </li>
                <li>
                    <button onClick={handleCategoryDataScience} className="text-blue-500 hover:underline">Data Science</button>

                </li>
                <li>
                    <button onClick={handleCategoryCyberSecurity} className="text-blue-500 hover:underline">Cyber Security</button>
                </li>
                <li>
                    <button onClick={handleCategoryAI} className="text-blue-500 hover:underline">Artificial Inteligence</button>
                </li>
                <li>
                    <button onClick={handleCategoryIoT} className="text-blue-500 hover:underline">Internet of things</button>
                </li>
                <li>
                    <button onClick={handleCategoryGameDev} className="text-blue-500 hover:underline">Game Development</button>
                </li>
            </ul>
        </div>
    );
};
export default CategorySidebar