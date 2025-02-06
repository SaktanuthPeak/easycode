import React, { useEffect, useState } from "react";
import ax from "../conf/ax";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const CoursePage = () => {
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState([]);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await ax.get(`courses?filters[documentId][$eq]=${courseId}`);
                console.log(response.data.data);
                if (response.data.data.length > 0) {
                    setCourseDetails(response.data.data[0]);
                } else {
                    setCourseDetails("Course not found");
                }
            } catch (error) {
                console.error("Error fetching course details:", error);
                setCourseDetails("Error loading course");
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <motion.div
                className="mb-12 text-center text-3xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl text-indigo-600">{courseDetails.Course_name}</h1>
                <p className="text-lg text-gray-600 mt-4">{courseDetails.course_overview}</p>
            </motion.div>

            <motion.div
                className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Course Description</h2>
                <div className="text-gray-700">
                    {courseDetails.course_description ? (
                        <p>{courseDetails.course_description}</p>
                    ) : (
                        <p className="text-red-500">Course description not available.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default CoursePage;
