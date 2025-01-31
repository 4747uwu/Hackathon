import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // Debug logs
    console.log('Auth Header:', authHeader);
    console.log('Token:', token);

    if (!token) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Decoded:', decoded);

      // Find user
      const user = await User.findById(decoded.id)
        .select('-password')
        .lean();

      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Attach user to request
      req.user = user;
      next();
      
    } catch (jwtError) {
      console.error('JWT Verification failed:', jwtError);
      return res.status(401).json({
        message: 'Invalid token',
        error: jwtError.message
      });
    }

  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export default authMiddleware;