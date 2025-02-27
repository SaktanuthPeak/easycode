import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, HomeIcon, Code, Database, Shield, Brain, Wifi, Gamepad } from "lucide-react";
import ax from '../conf/ax';

const CategorySidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const fetchCategory = async () => {
        try {
            const response = await ax.get('categories?populate=*');


            if (Array.isArray(response.data.data)) {
                const categoryData = response.data.data.map(category => ({
                    name: category.Category_name,
                    id: category.documentId,
                }));
                setCategories(categoryData);
            } else {
                console.error('Fetched data is not an array');
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handlehomebutton = () => navigate("/client-home");

    const handleCategoryClick = (categoryId) => {
        navigate(`/client-home/${categoryId}`);
    };


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
                        {categories.map(({ name, id }) => {
                            let Icon;
                            switch (name) {
                                case "Web Development":
                                    Icon = Code;
                                    break;
                                case "Data Science":
                                    Icon = Database;
                                    break;
                                case "Cyber Security":
                                    Icon = Shield;
                                    break;
                                case "Artificial Intelligence":
                                    Icon = Brain;
                                    break;
                                case "Internet of Things":
                                    Icon = Wifi;
                                    break;
                                case "Game Development":
                                    Icon = Gamepad;
                                    break;
                                default:
                                    Icon = Code;
                            }

                            return (
                                <button
                                    key={id}
                                    onClick={() => handleCategoryClick(id)}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors first:rounded-t-md last:rounded-b-md"
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{name}</span>
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
