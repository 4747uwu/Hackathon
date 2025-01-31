import express from 'express';
import User from '../models/userModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import passport from 'passport';
import {
  signup,
  login,
  forgotPassword,
  verifyAccount,
  googleAuth,
  googleAuthCallback
} from '../controller/authController.js';

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Verify account route
router.get('/verify/:token', verifyAccount);

// Google OAuth2 routes
router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  // Successful authentication
  console.log('Login with Google successful:', req.user);
  res.redirect('http://localhost:5173');
});

// router.get('/verify', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });


//here the issue was that the user was not being found by the _id instead it was being find by userId. lolll
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


export default router;
