import { createContext, useContext, useState, useEffect } from 'react';
import React from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize user from localStorage if available
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
       
    
    // Check authentication status when component mounts
    useEffect(() => {
        checkAuth();
    }, []);

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
            const token = localStorage.getItem('token');
            const setToken = token;
            console.log(token);
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5000/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const userData = await response.json();
                console.log(userData);
                setUser(userData);
            } else {
                // If verification fails, clear everything
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            setError(error.message);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null); // Clear any previous errors
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
                credentials: 'include' // To handle cookies if your API uses them
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                console.log(data.token);
                setUser(data.user);
                console.log(data.user);
                return { success: true };
            } else {
                setError(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setError(error.message);
            return { success: false, message: error.message };
        }
    };

    const signup = async (credentials) => {
        try {
            setError(null);
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                // Don't set user here since they need to verify their email first
                return { 
                    success: true, 
                    message: 'Please check your email to verify your account' 
                };
            } else {
                setError(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setError(error.message);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            // Call logout endpoint if you have one
            // await fetch('http://localhost:4000/api/auth/logout', ...);

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setError(null);
            console.log('Logged out');
            await axios.get("http://localhost:5000/auth/logout", { withCredentials: true });
            return { success: true };
        } catch (error) {
            console.error('Error logging out:', error);
            setError(error.message);
            return { success: false, message: error.message };
        }
    };

    // Add a token refresh function
    // const refreshToken = async () => {
    //     try {
    //         const response = await fetch('http://localhost:4000/api/auth/refresh-token', {
    //             method: 'POST',
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             credentials: 'include'
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             localStorage.setItem('token', data.token);
    //             setUser(data.user);
    //             return true;
    //         }
    //         return false;
    //     } catch (error) {
    //         console.error('Error refreshing token:', error);
    //         return false;
    //     }
    // };

    // // Add automatic token refresh
    // useEffect(() => {
    //     if (user) {
    //         const refreshInterval = setInterval(() => {
    //             refreshToken();
    //         }, 14 * 60 * 1000); // Refresh every 14 minutes if token expires in 15 minutes

    //         return () => clearInterval(refreshInterval);
    //     }
    // }, [user]);

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        logout,
        
        checkAuth
    };

    if (loading) {
        return <div>Loading...</div>; // Or your loading component
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