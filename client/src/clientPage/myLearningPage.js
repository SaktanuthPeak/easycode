import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ax from "../conf/ax";
import no_image_available from "./images/No_image_available.svg.jpg";
import { motion } from "framer-motion";

const MyLearningPage = () => {
    const [filteredCourses, setFilteredCourses] = useState([]);
    const baseURL = "http://localhost:1337";
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await ax.get("users/me?populate=*");
                const userCoursesData = userResponse.data.courses || [];

                const courseResponse = await ax.get("courses?populate=*");
                const allCoursesData = courseResponse.data.data || [];

                const matchedCourses = allCoursesData.filter(course =>
                    userCoursesData.some(userCourse => userCourse.documentId === course.documentId)
                );

                setFilteredCourses(matchedCourses);
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800">My Learning Page</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <motion.div
                            key={course.id}
                            className="bg-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate(`/course/${course.documentId}`)}
                        >
                            <img
                                src={
                                    course.course_img?.length > 0
                                        ? `${baseURL}${course.course_img[0].url}`
                                        : no_image_available
                                }
                                alt={course.Course_name}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <h2 className="text-lg font-semibold mt-2">{course.Course_name}</h2>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No matching courses found.</p>
                )}
            </div>
        </div>
    );
};

export default MyLearningPage;
