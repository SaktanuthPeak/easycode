import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import ax from "../conf/ax";
import conf from "../conf/main";
import no_image_available from "./images/No_image_available.svg.jpg";
import certificateImg from "./images/certificate.png";
import ReviewModal from "../component/reviewModal";
import { motion, AnimatePresence } from "framer-motion";

const CourseLearningPage = () => {
    const [name, setName] = useState(null);
    const [username, setUsername] = useState(null);
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [courseName, setCourseName] = useState(null);
    const certificateRef = useRef(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [completedChapters, setCompletedChapters] = useState(() => {
        return JSON.parse(localStorage.getItem(`completedChapters-${courseId}`)) || {};
    });
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [reviewStars, setReviewStars] = useState(0);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseResponse = await ax.get(`/courses/${courseId}?populate=course_chapters.video`);
                const sortedChapters = courseResponse.data.data.course_chapters.sort(
                    (a, b) => a.chapter_number - b.chapter_number
                );
                setCourse({
                    ...courseResponse.data.data,
                    course_chapters: sortedChapters
                });
                setCourseName(courseResponse.data.Course_name);
                if (sortedChapters?.length > 0) {
                    setSelectedChapter(sortedChapters[0]);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        };
        fetchCourse();
    }, [courseId]);

    useEffect(() => {
        const fetchName = async () => {
            try {
                const fetchName = await ax.get(`users/me`);
                const fullName = `${fetchName.data.firstname} ${fetchName.data.lastname}`;
                const user = fetchName.data.username
                setName(fullName);
                setUsername(user)
            } catch (error) {
                console.log("Error fetching name:", error);
            }
        };
        fetchName();
    }, []);

    useEffect(() => {
        localStorage.setItem(`completedChapters-${courseId}`, JSON.stringify(completedChapters));
    }, [completedChapters, courseId]);

    const toggleCompletion = (chapterId) => {
        setCompletedChapters((prev) => ({
            ...prev,
            [chapterId]: true,
        }));
    };

    const completedCount = Object.values(completedChapters).filter(value => value === true).length;
    const totalChapters = course?.course_chapters?.length || 0;
    const completionPercentage = totalChapters === 0 ? 0 : Math.round((completedCount / totalChapters) * 100);

    const downloadCertificate = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const img = new Image();
        img.src = certificateImg;
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            ctx.font = "50px Arial";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";

            ctx.fillText(name, canvas.width / 2, canvas.height * 0.485);
            ctx.fillText(course?.Course_name, canvas.width / 2, canvas.height * 0.6);

            canvas.toBlob((blob) => {
                download(blob, `${course?.Course_name}.png`);
            });
        };
    };

    const handleReviewSubmit = async () => {
        try {
            const response = await ax.post("/reviews", {
                data: {
                    comment: reviewText,
                    stars: reviewStars,
                    course: course?.id,
                    username: username,
                },
            });
            setIsReviewModalOpen(false);
            setReviewText("");
            setReviewStars(0);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border-b border-gray-200"
            >
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <motion.h1
                        className="text-2xl font-bold"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {courseName}
                    </motion.h1>
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="text-sm font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Progress: {completedCount}/{totalChapters} chapters
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            ← Back to courses
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsReviewModalOpen(true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Leave a Review
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            <div className="container mx-auto px-6 py-8 flex gap-8">
                {/* Main Content */}
                <motion.div
                    className="flex-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <AnimatePresence mode="wait">
                        {selectedChapter && (
                            <motion.div
                                key={selectedChapter.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                            >
                                <div className="aspect-w-16 aspect-h-9 bg-gray-800">
                                    <video
                                        className="w-full h-full object-cover"
                                        controls
                                        src={`${conf.apiUrlPrefix.replace("/api", "")}${selectedChapter.video?.[0]?.url}`}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="p-6">
                                    <motion.h2
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xl font-semibold mb-4"
                                    >
                                        {selectedChapter.name_of_chapter}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-gray-600 mb-6"
                                    >
                                        {selectedChapter.chapter_description}
                                    </motion.p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleCompletion(selectedChapter.id)}
                                        className={`px-4 py-2 rounded-lg transition-colors ${completedChapters[selectedChapter.id]
                                            ? "bg-green-500 text-white hover:bg-green-600"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                            }`}
                                    >
                                        {completedChapters[selectedChapter.id] ? "Completed ✓" : "Mark as Complete"}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    className="w-96 bg-white rounded-lg shadow-lg p-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {/* Course Progress */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Course Progress</h2>
                        <div className="bg-gray-200 rounded-full h-4 mb-2">
                            <motion.div
                                className="bg-blue-500 h-4 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(completionPercentage, 100)}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                        </div>
                        <motion.div
                            className="text-center text-sm font-medium text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {Math.min(completionPercentage, 100)}% Complete
                        </motion.div>
                    </div>

                    {/* Chapters List */}
                    <h2 className="text-xl font-semibold mb-4">Course Chapters</h2>
                    <div className="space-y-2">
                        {course?.course_chapters?.map((chapter, index) => (
                            <motion.button
                                key={chapter.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedChapter(chapter)}
                                className={`w-full flex items-center p-4 rounded-lg text-left transition-colors ${selectedChapter?.id === chapter.id
                                    ? "bg-gray-900 text-white"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className="flex-shrink-0">
                                        <div
                                            className={`w-6 h-6 rounded-full border flex items-center justify-center ${completedChapters[chapter.id]
                                                ? "bg-green-500 border-green-500"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {completedChapters[chapter.id] && (
                                                <CheckCircleIcon className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            Chapter {chapter.chapter_number}: {chapter.name_of_chapter}
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Certificate Download */}
                    <AnimatePresence>
                        {completionPercentage === 100 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mt-6"
                            >
                                <motion.div
                                    className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <p className="text-green-800 text-center font-medium">
                                        🎉 Congratulations! You've completed the course!
                                    </p>
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={downloadCertificate}
                                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>🎓</span> Download Your Certificate
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                reviewText={reviewText}
                setReviewText={setReviewText}
                reviewStars={reviewStars}
                setReviewStars={setReviewStars}
            />
        </div>
    );
};


export default CourseLearningPage;