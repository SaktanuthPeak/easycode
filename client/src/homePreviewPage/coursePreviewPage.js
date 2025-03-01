"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ax from "../conf/ax"
import { Star, Globe, ShoppingCart } from "lucide-react"
import no_image_available from "./images/No_image_available.svg.jpg"
import conf from "../conf/main"

const CoursePreviewPage = () => {
    const { courseId } = useParams()
    const { categoryId } = useParams()
    const [courseDetails, setCourseDetails] = useState(null)
    const [activeTab, setActiveTab] = useState("description")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await ax.get(`courses?filters[documentId][$eq]=${courseId}&populate=*`)
                if (response.data.data.length > 0) {
                    setCourseDetails({
                        ...response.data.data[0],
                        id: response.data.data[0].documentId
                    })
                } else {
                    setCourseDetails("Course not found")
                }
            } catch (error) {
                console.error("Error fetching course details:", error)
                setCourseDetails("Error loading course")
            }
        }

        fetchCourseDetails()
    }, [courseId])

    const handlePreviewCart = () => {
        const wantToLogin = window.confirm("You need to login first to add courses to cart. Do you want to go to login page?")
        if (wantToLogin) {
            navigate("/login")
        }
        return
    }
    const getImageUrl = (img) => {
        if (!img || !img.url) return no_image_available;
        return img.url.startsWith("/") ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}` : img.url;
    };


    if (!courseDetails || typeof courseDetails === "string") {
        return <div className="p-8 text-center">{courseDetails || "Loading..."}</div>
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex mb-8 text-sm text-gray-500">
                    <a href="/client-home" className="hover:text-gray-900">
                        Home
                    </a>
                    <span className="mx-2">/</span>
                    <Link to={`/client-home/${categoryId}`} className="hover:text-gray-900">
                        Courses
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{courseDetails.Course_name}</span>
                </nav>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{courseDetails.Course_name}</h1>
                            <p className="text-lg text-gray-600 mb-6">{courseDetails.course_overview}</p>

                            {/* Course Stats */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center">
                                    <Star className="h-5 w-5 text-yellow-400" />
                                    <span className="ml-1 text-lg font-semibold">4.6</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-gray-400" />
                                    <span className="text-gray-600">English</span>
                                </div>
                            </div>

                            {/* Created By */}
                            <div className="flex items-center gap-3 mb-8">
                                <img src="/placeholder.svg?height=40&width=40" alt="Instructor" className="h-10 w-10 rounded-full" />
                                <div>
                                    <p className="text-sm text-gray-500">Created by</p>
                                    <a href="#" className="text-blue-600 hover:underline">
                                        Ronal Richards
                                    </a>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="mt-8">
                                <div className="border-b border-gray-200">
                                    <nav className="flex gap-4">
                                        {["description", "instructor", "syllabus"].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`py-2 px-1 border-b-2 font-medium ${activeTab === tab
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                                    }`}
                                            >
                                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                <div className="mt-6">
                                    {activeTab === "description" && (
                                        <div className="bg-white p-6 rounded-lg shadow-sm">
                                            <h2 className="text-2xl font-semibold mb-4">Course Description</h2>
                                            <p className="text-gray-600">{courseDetails.course_description}</p>
                                        </div>
                                    )}

                                    {activeTab === "instructor" && (
                                        <div className="bg-white p-6 rounded-lg shadow-sm">
                                            <div className="flex items-start gap-6">
                                                <img src="/placeholder.svg?height=120&width=120" alt="Instructor" className="rounded-full" />
                                                <div>
                                                    <h2 className="text-2xl font-semibold mb-4">Ronal Richards</h2>
                                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                                        <div>
                                                            <p className="text-2xl font-semibold">40,445</p>
                                                            <p className="text-gray-500">Reviews</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-2xl font-semibold">500</p>
                                                            <p className="text-gray-500">Students</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-2xl font-semibold">15</p>
                                                            <p className="text-gray-500">Courses</p>
                                                        </div>
                                                    </div>
                                                    <h3 className="font-semibold mb-2">Research Interests</h3>
                                                    <ul className="list-disc list-inside text-gray-600">
                                                        <li>Internet of Things (IoT)</li>
                                                        <li>Embedded Systems</li>
                                                        <li>Artificial Intelligence (AI) and Machine Learning</li>
                                                        <li>Cybersecurity</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "syllabus" && (
                                        <div className="bg-white p-6 rounded-lg shadow-sm">
                                            <h2 className="text-2xl font-semibold mb-4">Course Syllabus</h2>
                                            <p className="text-gray-600">22 Total Hours, 155 Lectures, All levels</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <div className="sticky top-8 bg-white rounded-lg shadow-sm overflow-hidden">
                                <img
                                    src={getImageUrl(courseDetails.course_img[0])}
                                    className="w-full"
                                />
                                <div className="p-6">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl font-bold">{courseDetails.price}฿</span>
                                    </div>
                                    <div className="space-y-3">

                                        <button
                                            onClick={handlePreviewCart}
                                            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-5 h-5" /> Add To Cart
                                        </button>


                                        <button className="w-full border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoursePreviewPage;