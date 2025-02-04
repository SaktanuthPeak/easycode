import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/Auth.context.js';
import loginImage from './pictures/login.jpg';

const LoginForm = () => {
    const { state: ContextState, login } = useContext(AuthContext);
    const { isLoginPending, isLoggedIn, loginError } = ContextState;

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

    const handleSubmit = (event) => {
        event.preventDefault();
        login(username, password);
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        } else {
            localStorage.removeItem('username');
            localStorage.removeItem('password');
        }
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {loginError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                {loginError.message}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
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
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="ml-2 block text-sm text-gray-700">Remember Me</label>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            {isLoginPending ? 'Loading...' : 'Login'}
                        </button>
                        {isLoggedIn && (
                            <div className="mt-4 p-2 bg-green-100 text-green-700 border border-green-400 rounded-md">
                                You have successfully logged in.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
