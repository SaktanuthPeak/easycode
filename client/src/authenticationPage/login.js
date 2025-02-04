import React, { useContext } from 'react';
import { AuthContext } from '../context/Auth.context.js';

const LoginForm = () => {
    const { state: ContextState, login } = useContext(AuthContext);
    const { isLoginPending, isLoggedIn, loginError } = ContextState;

    const handleSubmit = (event) => {
        try {
            event.preventDefault();
            const formData = new FormData(event.target);
            const username = formData.get('username');
            const password = formData.get('password');
            login(username, password);
            event.target.reset();
        } catch (e) {
            console.log(e)
        }
    };

    return isLoginPending && (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h3 className="text-center text-xl font-semibold mb-4">easycode</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
                        Login
                    </button>
                </form>
                {isLoggedIn && (
                    <div className="mt-4 p-2 bg-green-100 text-green-700 border border-green-400 rounded-md">
                        You have successfully logged in.
                    </div>
                )}
                {loginError && (
                    <div className="mt-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded-md">
                        {loginError.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
