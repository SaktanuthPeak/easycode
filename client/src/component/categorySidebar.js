import React from 'react';
import { ChevronDown, HomeIcon, Code, Database, Shield, Brain, Wifi, Gamepad } from "lucide-react";

const CategorySidebar = ({ onNavigate = () => { } }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const categories = [
        { name: "Web Development", path: "/clienthome/web-dev", icon: Code },
        { name: "Data Science", path: "/clienthome/data-sci", icon: Database },
        { name: "Cyber Security", path: "/clienthome/cyber-security", icon: Shield },
        { name: "Artificial Intelligence", path: "/clienthome/ai", icon: Brain },
        { name: "Internet of Things", path: "/clienthome/internet-of-things", icon: Wifi },
        { name: "Game Development", path: "/clienthome/game-dev", icon: Gamepad },
    ];

    return (
        <div className="w-64 bg-white rounded-lg shadow-md p-4">
            <div className="pb-3 border-b border-gray-200">
                <button
                    onClick={() => onNavigate("/clienthome")}
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
                                    onClick={() => {
                                        onNavigate(category.path);
                                        setIsOpen(false);
                                    }}
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