// Login.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './login';
import { AuthContext } from '../context/Auth.context';
import '@testing-library/jest-dom';

const mockAuthContext = {
    state: {
        loginError: null,
        isAuthenticated: false
    },
    login: jest.fn()
};

describe('Login Component', () => {
    const renderLogin = () => {
        return render(
            <AuthContext.Provider value={mockAuthContext}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form with all input fields', () => {
        renderLogin();

        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: /remember me/i })).toBeInTheDocument();
    });

    test('handles input changes correctly', async () => {
        renderLogin();

        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Enter Password');
        const rememberMeCheckbox = screen.getByRole('checkbox', { name: /remember me/i });

        await userEvent.type(usernameInput, 'testuser');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(rememberMeCheckbox);

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
        expect(rememberMeCheckbox).toBeChecked();
    });


});