import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ax from "../conf/ax";
import conf from "../conf/main";
import no_image_available from "./images/No_image_available.svg.jpg";
import { motion } from "framer-motion";
const CourseLearningPage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseResponse = await ax.get(`/courses/${courseId}?populate=course_chapters.video`);
                setCourse(courseResponse.data.data);
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };
        fetchCourse();
    }, [courseId]);
    const getImageUrl = (img) => {
        if (!img || !img.url) return no_image_available;
        return img.url.startsWith("/") ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}` : img.url;
    };
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800">Course Learning Page</h1>
            {course ? (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-700">{course.Course_name}</h2>

                    <div className="space-y-6 mt-6">
                        {course.course_chapters?.map((chapter) => (
                            <motion.div
                                key={chapter.id}
                                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                                whileHover={{ scale: 1.05 }}
                            >
                                <a href="https://www.youtube.com/watch?v=kCHYhymCQZs" target="_blank" rel="noopener noreferrer">
                                    <div className="flex items-center space-x-6">
                                        <img
                                            src={getImageUrl(chapter.video?.[0])}
                                            alt={chapter.name_of_chapter}
                                            className="w-32 h-32 object-cover rounded-md"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold">{chapter.name_of_chapter}</h3>
                                            <p className="text-gray-600 text-sm">{chapter.chapter_description}</p>
                                        </div>
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-6">Loading course data...</p>
            )}
        </div>
    );
};
export default CourseLearningPage;