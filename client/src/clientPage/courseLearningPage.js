import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import ax from "../conf/ax";
import conf from "../conf/main";
import no_image_available from "./images/No_image_available.svg.jpg";
import certificateImg from "./images/certificate.png"
import { use } from "react";

const CourseLearningPage = () => {
    const [name, setName] = useState(null);

    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [courseName, setCourseName] = useState(null);
    const certificateRef = useRef(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [completedChapters, setCompletedChapters] = useState(() => {
        return JSON.parse(localStorage.getItem(`completedChapters-${courseId}`)) || {};
    });

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseResponse = await ax.get(`/courses/${courseId}?populate=course_chapters.video`);
                setCourse(courseResponse.data.data);
                setCourseName(courseResponse.data.Course_name)
                if (courseResponse.data.data.course_chapters?.length > 0) {
                    setSelectedChapter(courseResponse.data.data.course_chapters[0]);
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
                const fetchName = await ax.get(`users/me`)
                const fullNamae = `${fetchName.data.firstname} ${fetchName.data.lastname}`
                setName(fullNamae)

            } catch (error) {
                console.log("Error fetching name:", error)
            }
        };
        fetchName();
    })

    useEffect(() => {
        localStorage.setItem(`completedChapters-${courseId}`, JSON.stringify(completedChapters));
    }, [completedChapters, courseId]);

    const toggleCompletion = (chapterId) => {
        setCompletedChapters((prev) => ({
            ...prev,
            [chapterId]: true,
        }));
    };

    const getImageUrl = (img) => {
        if (!img || !img.url) return no_image_available;
        return img.url.startsWith("/") ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}` : img.url;
    };

    const completedCount = Object.keys(completedChapters).length;
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

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4 flex justify-between">
                    <h1 className="text-2xl font-bold">{course?.Course_name}</h1>
                    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900 transition-colors">
                        ← Back to courses
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8 flex gap-8">
                {/* Main Content */}
                <div className="flex-1">
                    {selectedChapter && (
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-800">
                                <img
                                    src={getImageUrl(selectedChapter.video?.[0])}
                                    alt={selectedChapter.name_of_chapter}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-2">{selectedChapter.name_of_chapter}</h2>
                                <p className="text-gray-600">{selectedChapter.chapter_description}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-96 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Course Completion</h2>

                    {/* Completion Percentage Display */}
                    <div className="text-center my-4">
                        <p className="text-lg font-semibold">Completion: {completionPercentage}%</p>
                    </div>

                    <div className="space-y-2">
                        {course?.course_chapters?.map((chapter, index) => (
                            <button
                                key={chapter.id}
                                onClick={() => {
                                    setSelectedChapter(chapter);
                                    toggleCompletion(chapter.id);
                                }}
                                className={`w - full flex items - center justify - between p - 3 rounded - lg text - left transition - colors ${selectedChapter?.id === chapter.id
                                    ? "bg-gray-900 text-white"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w - 5 h - 5 rounded - full border flex items - center justify - center ${completedChapters[chapter.id]
                                            ? "bg-blue-500 border-blue-500"
                                            : "border-gray-300"
                                            }`}
                                    >
                                        {completedChapters[chapter.id] && <CheckCircleIcon className="w-4 h-4 text-white" />}
                                    </div>
                                    <span className="font-medium">{index + 1}. {chapter.name_of_chapter}</span>
                                </div>

                            </button>
                        ))}
                    </div>

                    {/* Button to Download Certificate */}
                    {completionPercentage === 100 && (
                        <button
                            onClick={downloadCertificate}
                            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            🎓 Download Certificate
                        </button>
                    )}
                </div>
            </div>

            {/* Hidden Certificate Template */}
            <div ref={certificateRef} className="hidden p-8 bg-white text-center border shadow-lg w-[600px]">
                <h2 className="text-2xl font-semibold mt-2">Peak</h2>
                <p className="mt-4 text-gray-600">For successfully completing the course:</p>
                <h3 className="text-xl font-medium text-blue-600">{course?.Course_name}</h3>
            </div>
        </div>
    );
}

export default CourseLearningPage;
