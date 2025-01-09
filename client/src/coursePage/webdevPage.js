// webDevPage.jsx
import React from "react";

// CourseCard Component
const CourseCard = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <img
                src="https://via.placeholder.com/150"
                alt="Course Thumbnail"
                className="rounded-t-lg w-full"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold">Beginner's Guide to Design</h3>
                <p className="text-sm text-gray-600">By Ronald Richards</p>
                <p className="text-sm text-gray-600">
                    ⭐⭐⭐⭐⭐ (2300 Ratings)
                </p>
                <p className="text-sm text-gray-600">
                    22 Total Hours, 155 Lectures, Beginner
                </p>
                <p className="text-lg font-bold mt-2">$149.9</p>
            </div>
        </div>
    );
};

// CategorySidebar Component
const CategorySidebar = () => {
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
                    <button className="text-blue-500 hover:underline">Development</button>
                </li>
                <li>
                    <button className="text-blue-500 hover:underline">Design</button>
                </li>
                <li>
                    <button className="text-blue-500 hover:underline">Marketing</button>
                </li>
                <li>
                    <button className="text-blue-500 hover:underline">Photography</button>
                </li>
            </ul>
        </div>
    );
};

// Main Page Component
const WebDevPage = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Design Courses</h1>
            <div className="flex">
                {/* Sidebar */}
                <div className="w-1/4 pr-4">
                    <CategorySidebar />
                </div>
                {/* Courses */}
                <div className="w-3/4 grid grid-cols-3 gap-6">
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                    <CourseCard />
                </div>
            </div>
        </div>
    );
};

export default WebDevPage;
