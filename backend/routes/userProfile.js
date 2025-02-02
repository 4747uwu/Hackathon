import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary config missing');
} else {
  console.log('Cloudinary config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

if (cloudinary.config()) {
  console.log('Cloudinary config is set');
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Define your routes here

// router.put('/', authMiddleware, async (req, res) => {
//   try {
//     const { name, role, email, bio } = req.body;

//     // Find user and check if email is already taken (if email is being changed)
// const user = await User.findById(req.user._id)
//   .populate({
//     path: 'pendingRequests.from',
//     select: 'name email'
//   })
//   .exec();
//   console.log(user.pendingRequests);
//     if (email !== user.email) {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Email already in use' });
//       }
//     }

//     // Only allow role update if user is admin
//     const updateFields = {
//       name,
//       email,
//       bio
//     };

//     if (req.user.role === 'admin') {
//       updateFields.role = role;
//     }else{
//         console.log("You are not an admin")
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       { $set: updateFields },
//       { new: true, runValidators: true }
//     )
//       .populate('connections', 'name profileImage')
//       .populate({
//         path: 'projects.project',
//         select: 'name description status'
//       })
//       .populate({
//         path: 'pendingRequests.from',
//         select: 'name profileImage'
//       })
//       .populate('tasks', 'title status dueDate');

//     res.json(updatedUser);
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, role, email, bio } = req.body;

    // Find user and check if email is already taken (if email is being changed)
    const user = await User.findById(req.user._id)
      .populate({
        path: 'pendingRequests.from',
        select: 'name email profileImage'  // Include 'profileImage' to ensure it's populated
      })
      .exec();

    // Log the populated requests to ensure it's working
    console.log("Populated pendingRequests: ", user.pendingRequests);

    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Only allow role update if user is admin
    const updateFields = {
      name,
      email,
      bio
    };
    console.log(req.user.role);
    if (req.user.role === 'admin') {
      updateFields.role = role;
    } else {
      console.log("You are not an admin");
    }

    // Update user and populate necessary fields
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    )
      .populate('connections', 'name profileImage')
      .populate({
        path: 'projects.project',
        select: 'name description status'
      })
      .populate({
        path: 'pendingRequests.from',
        select: 'name profileImage'  // Ensure 'profileImage' is included
      })
      .populate('tasks', 'title status dueDate');

    // Send the updated user data
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update profile image
router.put('/profile-image', authMiddleware, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'profile_images',
      resource_type: 'auto',
    });

    // Update user profile with new image URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          profileImage: result.secure_url 
        } 
      },
      { new: true }
    );

    res.json({
      profileImage: result.secure_url,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// Get user verification status



export default router;