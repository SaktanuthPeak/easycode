import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ax from "../conf/ax";
import no_image_available from "./images/No_image_available.svg.jpg";
import { useCart } from '../context/Cart.context';

const CartPage = () => {
    const location = useLocation();
    const { cart, removeFromCart } = useCart();
    const [courses, setCourses] = useState([]);
    const baseURL = "http://localhost:1337";
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const coursePromises = cart.map(async (cartItem) => {
                    const response = await ax.get(`courses?filters[documentId][$eq]=${cartItem.id}&populate=*`);
                    if (response.data.data.length > 0) {
                        return {
                            ...response.data.data[0],
                            id: response.data.data[0].documentId,
                            price: response.data.data[0].price
                        };
                    }
                    return null;
                });

                const fetchedCourses = await Promise.all(coursePromises);
                setCourses(fetchedCourses.filter(course => course !== null));
            } catch (error) {
                console.error("Error fetching course details:", error);
            }
        };

        if (cart.length > 0) {
            fetchCourseDetails();
        }
    }, [cart]);

    const calculateOrderDetails = () => {
        const total = courses.reduce((total, course) => total + course.price, 0);

        return {
            total: total
        };
    };

    const orderDetails = calculateOrderDetails();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Shopping Cart</h1>
                    <Link to="/courses" className="text-blue-600 hover:underline">
                        Continue Shopping
                    </Link>
                </div>

                <div className="grid md:grid-cols-[2fr_1fr] gap-6">

                    <div className="space-y-4">
                        {courses.map((course) => (
                            <div key={course.id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                                <img
                                    src={course.course_img?.length > 0 ? `${baseURL}${course.course_img[0].url}` : no_image_available}
                                    alt={course.Course_name}
                                    className="w-50 h-24 object-cover rounded-md mr-4"
                                />
                                <div className="flex-grow">
                                    <h2 className="font-semibold text-lg">{course.Course_name}</h2>
                                    {/* <p className="text-gray-600">By {course.instructor}</p> */}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">${course.price.toFixed(2)}</p>
                                    <div className="flex mt-2">
                                        <button
                                            onClick={() => removeFromCart(course.id)}
                                            className="text-red-500 flex items-center hover:bg-red-50 p-1 rounded"
                                        >
                                            <Trash2 className="mr-1 w-4 h-4" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">



                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total</span>
                                <span>${orderDetails.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/client-home/cart/payment",
                                {
                                    state: {
                                        total: orderDetails.total,
                                        course_name: courses.map(course => course.Course_name).join(', ')
                                    }
                                })}
                            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center">
                            <ShoppingCart className="mr-2 w-5 h-5" /> Proceed to Checkout
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;