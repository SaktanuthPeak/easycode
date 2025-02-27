import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ax from "../conf/ax";
import conf from "../conf/main";
import no_image_available from "./images/No_image_available.svg.jpg";
import { motion } from "framer-motion";
import { Progress } from "flowbite-react";

const MyLearningPage = () => {
    const [filteredCourses, setFilteredCourses] = useState([]);
    const navigate = useNavigate();
    const [progressData, setProgressData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await ax.get("users/me?populate=courses");
                const userCoursesData = userResponse.data.courses || [];

                const courseResponse = await ax.get("courses?populate=course_img&populate=course_chapters");
                const allCoursesData = courseResponse.data.data || [];

                const matchedCourses = allCoursesData.filter(course =>
                    userCoursesData.some(userCourse => userCourse.documentId === course.documentId)
                );

                setFilteredCourses(matchedCourses);

                // Calculate progress for each course
                const newProgressData = {};
                matchedCourses.forEach(course => {
                    const storedProgress = JSON.parse(localStorage.getItem(`completedChapters-${course.documentId}`)) || {};
                    const completedCount = Object.keys(storedProgress).length;
                    const totalChapters = course.course_chapters?.length || 0;
                    newProgressData[course.documentId] = totalChapters === 0 ? 0 : Math.round((completedCount / totalChapters) * 100);

                });

                setProgressData(newProgressData);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchData();
    }, []);

    const getImageUrl = (img) => {
        if (!img || !img.url) return no_image_available;
        return img.url.startsWith("/") ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}` : img.url;
    };

    return (
        <motion.div
            className="container mx-auto p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-center text-gray-800">My Learning Page</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <motion.div
                            key={course.id}
                            className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            onClick={() => navigate(`/client-home/my-learning/${course.documentId}`)}
                        >
                            <motion.img
                                src={getImageUrl(course.course_img?.[0])}
                                alt={course.Course_name}
                                className="w-full h-40 object-cover rounded-md"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                            <h2 className="text-lg font-semibold mt-2">{course.Course_name}</h2>
                            <p className="text-gray-500 font-semibold mt-2">🕗 {course.course_hour} hours {course.course_minute} minutes</p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full  mt-2">
                                <div
                                    className="bg-green-600 text-xs font-medium text-gray-100 text-center p-0.5 leading-none rounded-full transition-all duration-300"
                                    style={{ width: `${progressData[course.documentId] || 0}%` }}
                                >
                                    {progressData[course.documentId] || 0}%
                                </div>
                            </div>


                        </motion.div>
                    ))
                ) : (
                    <motion.p
                        className="text-center text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        No matching courses found.
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
};

export default MyLearningPage;
