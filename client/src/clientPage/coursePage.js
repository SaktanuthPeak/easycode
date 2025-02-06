import React from "react";
import ax from "../conf/ax";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { useParams } from "react-router-dom";

const CoursePage = () => {
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState([]);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await ax.get(`courses?filters[documentId][$eq]=${courseId}`);
                console.log(response.data.data.Course_name)
                setCourseDetails(response.data.data)


            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCourseDetails();
    }, []);



    return (
        <div className="p-8">
            <motion.div
                className="mb-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {courseDetails.Course_name}
            </motion.div>
        </div>
    );
};
export default CoursePage