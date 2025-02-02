import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Update localStorage when token changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Check authentication status when component mounts or token changes
    useEffect(() => {
        checkAuth();
    }, [token]); // Added token as dependency

    // Update localStorage whenever user state changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const checkAuth = async () => {
        try {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:5000/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.data) {
                setUser(response.data);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setToken(null);
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            setError(error.message);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:5000/auth/login', 
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            const { token: newToken, user: userData } = response.data;
            setToken(newToken);
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Error logging in:', error);
            setError(error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const signup = async (credentials) => {
        try {
            setError(null);
            const response = await axios.post('http://localhost:5000/auth/signup',
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            return { 
                success: true, 
                message: 'Please check your email to verify your account' 
            };
        } catch (error) {
            console.error('Error signing up:', error);
            setError(error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || error.message };
        }
    };

    const logout = async () => {
        try {
            await axios.get("http://localhost:5000/auth/logout", { 
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true 
            });
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            // Always clear local state, even if the server request fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            setError(null);
            return { success: true };
        }
    };

    const value = {
        user,
        token,
        loading,
        error,
        login,
        signup,
        logout,
        checkAuth
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;