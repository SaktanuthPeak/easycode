import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ax from "../conf/ax";
import { motion } from "framer-motion";

const CourseReviewsPage = () => {
    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                setLoading(true);
                const fetchUserData = await ax.get(`users/me`);
                const username = fetchUserData.data.username;
                const response = await ax.get(`/instructors?filters[name_teacher][$eq]=${username}&populate=courses.reviews`);
                console.log("data_response =>", response.data);
                setInstructorData(response.data.data[0]);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setError("Failed to load course reviews. Please try again later.");
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, []);


    const getTotalReviewCount = () => {
        if (!instructorData) return 0;
        return instructorData.courses.reduce((total, course) => {
            return total + (course.reviews ? course.reviews.length : 0);
        }, 0);
    };

    if (loading) return <div className="p-8 text-center">Loading reviews...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!instructorData) return <div className="p-8 text-center">No instructor data found.</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold mb-6">Course Reviews</h1>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Overview</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="mb-2">Instructor: <span className="font-medium">{instructorData.name_teacher}</span></p>
                        <p className="mb-2">Total Courses: <span className="font-medium">{instructorData.courses.length}</span></p>
                        <p>Total Reviews: <span className="font-medium">{getTotalReviewCount()}</span></p>
                    </div>
                </div>

                {/* 3-Column Layout for Courses */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructorData.courses.map((course) => (
                        <motion.div
                            key={course.id}
                            className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 h-96 flex flex-col"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold truncate">{course.Course_name}</h3>
                                <div className="flex items-center mt-2">
                                    <span className="text-yellow-500 mr-1">★</span>
                                    <span>{course.rating?.toFixed(1) || "N/A"}</span>
                                    <span className="text-gray-500 ml-2">({course.reviews ? course.reviews.length : 0} reviews)</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    Duration: {course.course_hour}h {course.course_minute}m
                                </p>
                                <p className="text-sm text-gray-500">
                                    Price: ${course.price}
                                </p>
                            </div>

                            <div className="font-medium mb-2 text-gray-700">Reviews:</div>

                            {course.reviews && course.reviews.length > 0 ? (
                                <div className="space-y-4 overflow-y-auto flex-grow">
                                    {course.reviews.map((review) => (
                                        <motion.div
                                            key={review.id}
                                            className="border-t pt-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <div className="flex justify-between mb-2">
                                                <p className="font-medium">{review.username}</p>
                                                <div className="flex text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i}>{i < review.stars ? "★" : "☆"}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm">{review.comment}</p>
                                            <p className="text-gray-400 text-xs mt-1">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic flex-grow flex items-center justify-center">No reviews yet for this course.</p>
                            )}
                        </motion.div>
                    ))}
                </div>

                {instructorData.courses.length === 0 && (
                    <div className="text-center p-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">You don't have any courses yet.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CourseReviewsPage;