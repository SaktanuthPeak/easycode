"use client"

import { useState } from "react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import signUpImage from "./pictures/signup.jpg"
import ax from "../conf/ax"
import { useNavigate } from "react-router-dom"

const storeUser = (data) => {
    localStorage.setItem(
        "user",
        JSON.stringify({
            username: data.username,
            jwt: data.jwt,
        })
    )
}

const Signup = () => {
    const initialUser = {
        firstname: "",
        lastname: "",
        birthdate: "",
        username: "",
        email: "",
        phone_number: "",
        password: "",
        user_group: "",
    };
    const [user, setUser] = useState(initialUser)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            setIsLoading(true)
            const url = "/auth/local/register"
            const payload = {
                username: user.username,
                email: user.email,
                password: user.password,
                firstname: user.firstname,
                lastname: user.lastname,
                birthdate: user.birthdate,
                phone_number: user.phone_number,
                user_group: user.user_group,
            }
            const { data } = await ax.post(url, payload)
            if (data.jwt) {
                storeUser(data)
                setUser(initialUser)
                // Show success toast
                toast.success('🎉 Sign up successful! Redirecting to login...', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                // Delay navigation to show the toast
                setTimeout(() => {
                    navigate("/login")
                }, 1000)
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.error?.message || "An unexpected error occurred.")
            // Show error toast
            toast.error('❌ ' + (error.response?.data?.error?.message || "An unexpected error occurred."), {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleUserChange = ({ target }) => {
        const { name, value } = target
        setUser((currentUser) => ({
            ...currentUser,
            [name]: value,
        }))
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={user.firstname}
                                    onChange={handleUserChange}
                                    placeholder="Enter your first name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={user.lastname}
                                    onChange={handleUserChange}
                                    placeholder="Enter your last name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-700">Birthdate</label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={user.birthdate}
                                    onChange={handleUserChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={nextStep}
                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Contact Details</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-gray-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={user.username}
                                    onChange={handleUserChange}
                                    placeholder="Choose a username"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleUserChange}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone_number"
                                    value={user.phone_number}
                                    onChange={handleUserChange}
                                    placeholder="Enter your phone number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleUserChange}
                                    placeholder="Create a password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">User Group</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-gray-700">User Group</label>
                                <select
                                    name="user_group"
                                    value={user.user_group}
                                    onChange={handleUserChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                    required
                                >
                                    <option value="">Select user group</option>
                                    <option value="high-school student">High-school student</option>
                                    <option value="university/college student">University/college student</option>
                                    <option value="graduated">Graduated</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm"
                            >
                                Previous
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm disabled:opacity-50"
                            >
                                {isLoading ? "Creating account..." : "Sign Up"}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }


    return (
        <div className="flex flex-col lg:flex-row min-h-screen items-center justify-center bg-white">
            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            {/* Left Image Section */}
            <div className="hidden lg:block lg:w-1/2 h-screen">
                <img
                    src={signUpImage || "/placeholder.svg"}
                    alt="Sign up illustration"
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:px-24 overflow-y-auto max-h-screen">
                <div className="w-full max-w-md space-y-6">
                    <div>
                        <h1 className="text-3xl font-semibold">Sign Up</h1>
                        <p className="text-gray-600">Step {currentStep} of 3</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                {errorMsg}
                            </div>
                        )}

                        {renderStep()}


                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup