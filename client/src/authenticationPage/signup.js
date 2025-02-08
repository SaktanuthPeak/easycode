"use client"

import { useState } from "react"
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
    const initialUser = { username: "", password: "", email: "" }
    const [user, setUser] = useState(initialUser)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            setIsLoading(true)
            const url = "/auth/local/register"
            const payload = {
                username: user.username,
                email: user.email,
                password: user.password,
            }
            const { data } = await ax.post(url, payload)
            if (data.jwt) {
                storeUser(data)
                setUser(initialUser)
                navigate("/login")
            }
        } catch (error) {
            setErrorMsg(error.response?.data?.error?.message || "An unexpected error occurred.")
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

    return (
        <div className="flex flex-col lg:flex-row min-h-screen items-center justify-center bg-white">
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
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMsg && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                {errorMsg}
                            </div>
                        )}

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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm disabled:opacity-50"
                        >
                            {isLoading ? "Creating account..." : "Sign Up"}
                        </button>
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