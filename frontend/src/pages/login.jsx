import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const { login, signup, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: ''
  });
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, [images]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/welcome-image/image',{withCredentials:true});
      const data = await response.json();
      console.log('Fetched image data:', data); // Debug log
      if (data && data.length > 0) {
        setImages(data.map(item => item.url));
        console.log('Image URLs set:', data.map(item => item.url)); // Debug log
      } else {
        console.log('No image URLs found in data:', data); // Debug log
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    console.log('Form data:', formData); // Debug log
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = isLogin
      ? await login(formData)
      : await signup(formData);
    console.log('Form data on submit:', formData); // Debug log

    if (result.success && isLogin) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } else if(result.success){
      console.log("registered")
      window.location.reload();
    } 
    else {
      // Handle error case
      console.error('Error result:', result.error); // Debug log
    }
  } catch (error) {
    console.error('Form submission error:', error);
  }
};

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.3,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, scale: 1.1, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        className="flex flex-col md:flex-row gap-8 max-w-6xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Container - Form */}
        <motion.div 
          className="flex-1 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm"
          variants={formVariants}
        >
          <h1 className="text-4xl font-bold mb-6">Welcome back!</h1>
          <p className="text-gray-600 mb-8">
            Taste the Purity, Taste the Love
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </motion.div>
            )}
            

            
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </motion.div>
            

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </motion.div>

            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-sm text-green-600 hover:underline">
                  Forgot Password?
                </a>
              </div>
            )}

            <motion.button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </motion.button>

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </form>

          <div className="mt-8">
            <p className="text-center text-gray-600">or continue with</p>
            <div className="flex justify-center space-x-4 mt-4">
              <motion.button
                onClick={handleGoogleLogin}
                className="p-3 bg-black rounded-full hover:bg-gray-800"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-6 h-6 text-white">G</div>
              </motion.button>
              {['apple', 'facebook'].map((platform) => (
                <motion.button
                  key={platform}
                  className="p-3 bg-black rounded-full hover:bg-gray-800"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-6 h-6 text-white" />
                </motion.button>
              ))}
            </div>
          </div>

          <motion.p 
            className="mt-8 text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {isLogin ? "Not a member? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-green-600 hover:underline"
            >
              {isLogin ? "Register now" : "Login"}
            </button>
          </motion.p>
        </motion.div>

        {/* Right Container - Image */}
        <motion.div 
          className="flex-1 bg-green-50 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm relative"
          variants={imageVariants}
        >
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <AnimatePresence>
              {images.length > 0 && (
                <motion.img
                  key={images[currentImageIndex]}
                  src={images[currentImageIndex]}
                  alt="Welcome illustration"
                  className="w-full h-full object-cover absolute inset-0"
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={imageVariants}
                />
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;