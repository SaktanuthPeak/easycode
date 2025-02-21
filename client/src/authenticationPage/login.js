"use client"

import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/Auth.context.js"
import { Facebook } from "lucide-react"
import loginPicture from "./pictures/login.jpg"
import axios from "axios"
import FacebookLoginButton from "./facebookLoginButton.js"
import { motion } from "framer-motion";

const LoginForm = () => {
    const { state: ContextState, login } = useContext(AuthContext)
    const { loginError } = ContextState

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)

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
    const handleFacebookLogin = async () => {
        try {
            const response = await axios.get("http://localhost:1337/api/connect/facebook")
            window.location.href = response.data.redirectUrl
        } catch (error) {
            console.error("Facebook login error", error)
        }
    }

    return (
        <motion.div
            className="flex flex-col lg:flex-row min-h-screen items-center justify-center bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Left Image Section */}
            <motion.div
                className="hidden lg:block lg:w-1/2 h-screen"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <img
                    src={loginPicture || "/placeholder.svg"}
                    alt="Person working on laptop"
                    className="object-cover w-full h-full"
                />
            </motion.div>

            {/* Right Form Section */}
            <motion.div
                className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:px-24 overflow-y-auto max-h-screen"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.div
                    className="w-full max-w-md space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-3xl font-semibold">Login</h1>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                        >
                            <label className="text-gray-700">Username</label>
                            <input
                                type="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                required
                            />
                        </motion.div>

                        <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                        >
                            <label className="text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                required
                            />
                        </motion.div>

                        <motion.div
                            className="flex items-center justify-between mt-4"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                        >
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    checked={rememberMe}
                                    onClick={handleFacebookLogin} // keep original onClick
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 }}
                        >
                            Login
                        </motion.button>
                        <FacebookLoginButton />
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>

                    </div>


                    {loginError &&
                        <motion.div
                            className="text-red-500 text-sm text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.8 }}
                        >
                            {loginError.message}
                        </motion.div>
                    }
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default LoginForm