import { useEffect, useState } from 'react';
import axios from 'axios';
import loginImage from './login.jpg';

const URL_AUTH = "/api/auth/local";

const LoginScreen = ({ onLoginSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const savedUsername = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (formData) => {
        try {
            setIsLoading(true);
            setErrMsg(null);
            const response = await axios.post(URL_AUTH, { ...formData });
            const token = response.data.jwt;
            axios.defaults.headers.common = { 'Authorization': `bearer ${token}` };

            if (rememberMe) {
                localStorage.setItem('username', formData.identifier);
                localStorage.setItem('password', formData.password);
            } else {
                localStorage.removeItem('username');
                localStorage.removeItem('password');
            }

            onLoginSuccess();
        } catch (err) {
            console.log(err);
            setErrMsg(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const onFinish = () => {
        handleLogin({
            identifier: username,
            password: password,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Left Image Section */}
                <div className="hidden md:block w-1/2">
                    <img
                        src={loginImage}
                        alt="Login"
                        className="object-cover h-full w-full"
                    />
                </div>

                {/* Right Form Section */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Login</h2>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onFinish();
                        }}
                        autoComplete="off"
                        className="space-y-6"
                    >
                        {errMsg && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                {errMsg}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                Remember Me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
