import React from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from "react-router-dom";

function SignUp() {
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/Login')
    };


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    maxWidth: 400,
                    width: '100%',
                    padding: 3,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    Create your account
                </Typography>
                <Box component="form" sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="first-name"
                        label="First Name"
                        name="first-name"
                        autoComplete="given-name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="last-name"
                        label="Last Name"
                        name="last-name"
                        autoComplete="family-name"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="username"
                        label="Username"
                        id="username"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="dob"
                        type="date"
                        id="dob"

                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Link href="#" variant="body2" onClick={handleLogin}>
                            Already have an account? Sign In
                        </Link>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default SignUp;
