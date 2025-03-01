import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            return [...state, action.payload];
        case 'REMOVE_FROM_CART':
            return state.filter(item => item.id !== action.payload.id);
        case 'CLEAR_CART':
            return [];
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
            }
        });
    };

    const removeFromCart = (courseId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id: courseId } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
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