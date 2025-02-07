import React, { createContext, useReducer, useContext } from 'react';
import no_image_available from "../clientPage/images/No_image_available.svg.jpg";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            if (state.some(item => item.id === action.payload.id)) return state;
            return [...state, action.payload];
        case 'REMOVE_FROM_CART':
            return state.filter(item => item.id !== action.payload.id);
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);

    const addToCart = (course) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                id: course.id,
                name: course.Course_name,
                price: course.price,
                image: course.course_img?.length > 0
                    ? `http://localhost:1337${course.course_img[0].url}`
                    : no_image_available
            }
        });
    };

    const removeFromCart = (courseId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: courseId } });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === null) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};