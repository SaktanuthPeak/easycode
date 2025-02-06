"use client"

import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/Auth.context.js"
import { motion } from "framer-motion"
import { Facebook, Eye, EyeOff } from "lucide-react"

const LoginForm = () => {
    const { state: ContextState, login } = useContext(AuthContext)
    const { isLoginPending, isLoggedIn, loginError } = ContextState

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const savedUsername = localStorage.getItem("username")
        const savedPassword = localStorage.getItem("password")
        if (savedUsername && savedPassword) {
            setUsername(savedUsername)
            setPassword(savedPassword)
            setRememberMe(true)
        }
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        login(username, password)
        if (rememberMe) {
            localStorage.setItem("username", username)
            localStorage.setItem("password", password)
        } else {
            localStorage.removeItem("username")
            localStorage.removeItem("password")
        }
    }

    const handleFacebookLogin = () => {
        // Implement Facebook login logic here
        console.log("Facebook login clicked")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Left Image Section */}
                <div
                    className="hidden md:block w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: "url('/placeholder.svg?height=600&width=400')" }}
                >
                    <div className="h-full w-full bg-blue-900 bg-opacity-50 flex items-center justify-center">
                        <h1 className="text-4xl font-bold text-white text-center">Welcome Back</h1>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="w-full md:w-1/2 p-12">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Login to Your Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {loginError && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
                            >
                                {loginError.message}
                            </motion.div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label className="ml-2 block text-sm text-gray-700">Remember Me</label>
                            </div>
                            <a href="#" className="text-sm text-blue-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                        >
                            {isLoginPending ? "Logging in..." : "Login"}
                        </button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleFacebookLogin}
                            className="w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
                        >
                            <Facebook size={20} className="mr-2" />
                            Login with Facebook
                        </button>
                        {isLoggedIn && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 p-2 bg-green-100 text-green-700 border border-green-400 rounded-md"
                            >
                                You have successfully logged in.
                            </motion.div>
                        )}
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginForm

