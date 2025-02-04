import { useState } from "react";
import signUpImage from "./pictures/signup.jpg";
import { Toast, } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const storeUser = (data) => {
    localStorage.setItem(
        "user",
        JSON.stringify({
            username: data.username,
            jwt: data.jwt,
        })
    )
};




function Signup(props) {
    const initialUser = { identifier: "", password: "", email: "" };
    const [errMsg, setErrMsg] = useState(null)
    const [user, setUser] = useState(initialUser)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const signup = async (formData) => {
        try {
            setIsLoading(true);
            const url = "http://localhost:1337/api/auth/local/register";
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,

            };
            const { data } = await axios.post(url, payload);
            if (data.jwt) {
                storeUser(data);
                Toast.success("Registered successfully!", { hideProgressBar: true });
                setUser(initialUser);
                navigate("/login"); // Redirect to login
            }
        } catch (error) {
            setErrMsg(error.response?.data?.error?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleUserChange = ({ target }) => {
        const { name, value } = target;
        setUser((currentUser) => ({
            ...currentUser,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Sign Up</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            signup(user);
                        }}
                        autoComplete="off"
                        className="space-y-6"
                    >
                        {errMsg && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                {errMsg}
                            </div>
                        )}
                        {/* <div>
                            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                id="firstname"
                                name="firstname"
                                type="text"
                                onChange={handleUserChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div> */}
                        {/* <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                id="lastname"
                                name="lastname"
                                type="text"
                                onChange={handleUserChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div> */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={handleUserChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                onChange={handleUserChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                onChange={handleUserChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* <div>
                            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>
                            <input
                                id="birth_date"
                                name="birth_date"
                                type="date"
                                onChange={handleUserChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div> */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                        >
                            {isLoading ? "Loading..." : "Sign Up"}
                        </button>
                    </form>
                </div>
                <div className="hidden md:block w-1/2">
                    <img src={signUpImage} alt="Sign Up" className="object-cover h-full w-full" />
                </div>
            </div>
        </div>
    );
};

export default Signup;