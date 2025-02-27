import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ax from "../conf/ax";
import conf from '../conf/main';
import no_image_available from "./images/No_image_available.svg.jpg";
import { useCart } from '../context/Cart.context';
import dayjs from 'dayjs';

const CartPage = () => {
    const { cart, removeFromCart } = useCart();
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [originalTotal, setOriginalTotal] = useState(0);


    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (cart.length === 0) {
                setCourses([]);
                setOriginalTotal(0);
                setFinalTotal(0);
                return;
            }

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

    useEffect(() => {
        const orderDetails = calculateOrderDetails();
        setOriginalTotal(orderDetails.total);
        setFinalTotal(orderDetails.total - discount);
    }, [courses, discount]);


    const calculateOrderDetails = () => {
        const total = courses.reduce((total, course) => total + course.price, 0);
        return {
            total: total
        };
    };


    const getImageUrl = (img) => {
        if (!img || !img.url) return no_image_available;
        return img.url.startsWith("/") ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}` : img.url;
    };

    const handleApplyCoupon = async () => {
        setCouponError('');
        try {
            const fetchCoupon = await ax.get(`/discount-coupons?filters[coupon][$eq]=${couponCode}&populate=*`); // Assuming 'coupon' is the field for coupon code in backend
            if (fetchCoupon.data.data.length > 0) {
                const couponData = fetchCoupon.data.data[0];
                if (couponData) {
                    if (couponData.expired_date) {
                        const expiryDate = dayjs(couponData.expired_date);
                        if (dayjs().isAfter(expiryDate)) {
                            setCouponError('This coupon code has expired.');
                            setDiscount(0);
                            setFinalTotal(originalTotal);
                            return; // Stop applying coupon
                        }
                    }
                    let calculatedDiscount = 0;
                    const orderTotal = calculateOrderDetails().total;

                    if (couponData.discount_percent) { // Use discount_percent from JSON
                        calculatedDiscount = (orderTotal * couponData.discount_percent) / 100;
                    } else {
                        setCouponError('Coupon does not have a discount percentage.');
                        setDiscount(0);
                        setFinalTotal(originalTotal);
                        return;
                    }


                    if (calculatedDiscount > orderTotal) calculatedDiscount = orderTotal;
                    setDiscount(calculatedDiscount);
                    setFinalTotal(orderTotal - calculatedDiscount);
                } else {
                    setCouponError('Invalid coupon code.');
                    setDiscount(0);
                    setFinalTotal(originalTotal);
                }
            } else {
                setCouponError('Invalid coupon code.');
                setDiscount(0);
                setFinalTotal(originalTotal);
            }

        } catch (error) {
            console.error("Error fetching or applying coupon:", error);
            setCouponError('Error applying coupon. Please try again.');
            setDiscount(0);
            setFinalTotal(originalTotal);
        }
    };


    return (
        <div className="min-h-screen  flex flex-col">
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
                                    src={getImageUrl(course.course_img[0])}
                                    alt={course.Course_name}
                                    className="w-50 h-24 object-cover rounded-md mr-4"
                                />
                                <div className="flex-grow">
                                    <h2 className="font-semibold text-lg">{course.Course_name}</h2>
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{course.price.toFixed(2)} ฿</p>
                                    <div className="flex mt-2">
                                        {courses.length > 1 && (
                                            <button
                                                onClick={() => removeFromCart(course.id)}
                                                className="text-red-500 flex items-center hover:bg-red-50 p-1 rounded"
                                            >
                                                <Trash2 className="mr-1 w-4 h-4" /> Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Details */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                        <div className="mb-4">
                            <label htmlFor="couponCode" className="block text-gray-700 text-sm font-bold mb-2">
                                Coupon Code (Optional)
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    id="couponCode"
                                    placeholder="Enter coupon code"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="ml-2 px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 focus:outline-none focus:shadow-outline"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponError && <p className="text-red-500 text-xs italic mt-1">{couponError}</p>}
                        </div>


                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>฿ {originalTotal.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-green-500">Discount ({(discount / originalTotal * 100).toFixed(0)}%)</span> {/* Display discount percentage */}
                                    <span className="text-green-500">- ฿ {discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>Total</span>
                                <span>฿ {finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/client-home/cart/payment", {
                                state: {
                                    total: finalTotal,
                                    course_name: courses.map(course => course.Course_name).join(','),
                                    document_ids: courses.map(course => course.documentId).join(','),
                                    discount: discount
                                }
                            })}
                            disabled={courses.length === 0}
                            className={`w-full py-3 rounded-lg transition flex items-center justify-center
                            ${courses.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800"}`}
                        >
                            <ShoppingCart className="mr-2 w-5 h-5" /> Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;