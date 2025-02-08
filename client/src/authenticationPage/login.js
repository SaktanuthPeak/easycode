"use client"

import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/Auth.context.js"
import { Facebook } from "lucide-react"
import loginPicture from "./pictures/login.jpg"
import axios from "axios"
import FacebookLoginButton from "./facebookLoginButton.js"

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
        <div className="flex flex-col lg:flex-row min-h-screen items-center justify-center bg-white">
            {/* Left Image Section */}
            <div className="hidden lg:block lg:w-1/2 h-screen">
                <img
                    src={loginPicture || "/placeholder.svg"}
                    alt="Person working on laptop"
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Right Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:px-24 overflow-y-auto max-h-screen">
                <div className="w-full max-w-md space-y-6">
                    <div>
                        <h1 className="text-3xl font-semibold">Login</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-gray-700">Username</label>
                            <input
                                type="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    checked={rememberMe}
                                    onClick={handleFacebookLogin}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                        >
                            Login
                        </button>
                        <FacebookLoginButton />
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>

                    </div>


                    {loginError && <div className="text-red-500 text-sm text-center">{loginError.message}</div>}
                </div>
            </div>
        </div>
    )
}

export default LoginForm

