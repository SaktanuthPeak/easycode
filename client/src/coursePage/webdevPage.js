import React from "react";
import htmlandcsscourse from './courseThumbnail/htmlandcss.jpg'
import reactwithnextjs from './courseThumbnail/reactwithnextjs.jpg'
import javascripts from './courseThumbnail/javascripts.jpg'
import tailwindcss from './courseThumbnail/tailwindcss.jpg'
import strapi from './courseThumbnail/strapi.jpg'
import mysql from './courseThumbnail/mysql.jpg'
import djangowithpython from './courseThumbnail/django.jpg'
import { useNavigate } from 'react-router-dom'
import CategorySidebar from "../component/categorySidebar";




// CourseCard Component

const HtmlAndCssCard = () => {
    return (
        <div className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <img
                src={htmlandcsscourse}
                alt="Course Thumbnail"
                className="rounded-t-lg w-full"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold">Front-End development with HTML and CSS</h3>
                <p className="text-sm text-gray-600">Created By Me :)</p>
                <p className="text-sm text-gray-600">
                    ⭐⭐⭐⭐⭐ (2300 Ratings)
                </p>
                <p className="text-sm text-gray-600">
                    22 Total Hours, 155 Lectures, Beginner
                </p>
                <p className="text-lg font-bold mt-2">฿99.99</p>
            </div>
        </div>
    );
};

const ReactWithNextjsCard = () => {
    return (
        <div className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <img
                src={reactwithnextjs}
                alt="Course Thumbnail"
                className="rounded-t-lg w-full"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold">Developing website with React and Next.js</h3>
                <p className="text-sm text-gray-600">Created By Me :)</p>
                <p className="text-sm text-gray-600">
                    ⭐⭐⭐⭐⭐ (2300 Ratings)
                </p>
                <p className="text-sm text-gray-600">
                    22 Total Hours, 155 Lectures, Beginner
                </p>
                <p className="text-lg font-bold mt-2">฿99.99</p>
            </div>
        </div>
    );
};

const JavascriptsCard = () => {
    const navigate = useNavigate();
    const intoJavascriptsCourse = () => {
        navigate("/clienthome/web-dev/javascripts")
    }
    return (
        <div
            onClick={intoJavascriptsCourse}
            className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <img
                src={javascripts}
                alt="Course Thumbnail"
                className="rounded-t-lg w-full"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold">Zero to Hero:</h3>
                <h3 className="text-lg font-bold">Javascripts</h3>
                <p className="text-sm text-gray-600">Created By Me :)</p>
                <p className="text-sm text-gray-600">
                    ⭐⭐⭐⭐⭐ (2300 Ratings)
                </p>
                <p className="text-sm text-gray-600">
                    22 Total Hours, 155 Lectures, Beginner
                </p>
                <p className="text-lg font-bold mt-2">฿99.99</p>
            </div>
        </div>
    );
};

const TailwindcssCard = () => {
    return (
        <div className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <img
                src={tailwindcss}
                alt="Course Thumbnail"
                className="rounded-t-lg w-full"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold">Designing website with Tailwind CSS </h3>
                <p className="text-sm text-gray-600">Created By Me :)</p>
                <p className="text-sm text-gray-600">
                    ⭐⭐⭐⭐⭐ (2300 Ratings)
                </p>
                <p className="text-sm text-gray-600">
                    22 Total Hours, 155 Lectures, Beginner
                </p>
                <p className="text-lg font-bold mt-2">฿99.99</p>
            </div>
        </div>
    );
};

const StrapiCard = () => {
    return (
        <div className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <img
                src={strapi}
                alt="Course Thumbnail"
                className="rounded-t-lg w-full"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold">Back-End development with Strapi</h3>
                <p className="text-sm text-gray-600">Created By Me :)</p>
                <p className="text-sm text-gray-600">
                    ⭐⭐⭐⭐⭐ (2300 Ratings)
                </p>
                <p className="text-sm text-gray-600">
                    22 Total Hours, 155 Lectures, Beginner
                </p>
                <p className="text-lg font-bold mt-2">฿99.99</p>
            </div>
        </div>
    );
};

const MysqlCard = () => {
    return (
        <div className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <img
                src={mysql}
                alt="Course Thumbnail"
                className="rounded-t-lg w-full"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold">Developing Back-End with MySql</h3>
                <p className="text-sm text-gray-600">Created By Me :)</p>
                <p className="text-sm text-gray-600">
                    ⭐⭐⭐⭐⭐ (2300 Ratings)
                </p>
                <p className="text-sm text-gray-600">
                    22 Total Hours, 155 Lectures, Beginner
                </p>
                <p className="text-lg font-bold mt-2">฿99.99</p>
            </div>
        </div>
    );
};

const DjangoCard = () => {
    return (
        <div className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <img
                src={djangowithpython}
                alt="Course Thumbnail"
                className="rounded-t-lg w-full"
            />
            <div className="p-4">
                <h3 className="text-lg font-bold">Developing website with Django framework</h3>
                <p className="text-sm text-gray-600">Created By Me :)</p>
                <p className="text-sm text-gray-600">
                    ⭐⭐⭐⭐⭐ (2300 Ratings)
                </p>
                <p className="text-sm text-gray-600">
                    22 Total Hours, 155 Lectures, Beginner
                </p>
                <p className="text-lg font-bold mt-2">฿99.99</p>
            </div>
        </div>
    );
};



// CategorySidebar Component


// Main Page Component
const WebDevPage = () => {

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Web-Development Courses</h1>
            <div className="flex">
                {/* Sidebar */}
                <div className="w-1/4 pr-4">
                    <CategorySidebar />
                </div>
                {/* Courses */}
                <div className="w-3/4 grid grid-cols-3 gap-6">
                    <HtmlAndCssCard />
                    <ReactWithNextjsCard />
                    <JavascriptsCard />
                    <TailwindcssCard />
                    <StrapiCard />
                    <MysqlCard />
                    <DjangoCard />
                </div>
            </div>
        </div>
    );
};

export default WebDevPage;
