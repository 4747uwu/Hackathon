import express from 'express';
import WelcomeImage from '../models/WelcomeImage.js';

const router = express.Router();

// Endpoint to fetch all welcome images
router.get('/image', async (req, res) => {
  try {
    const images = await WelcomeImage.find(); // Fetch all welcome images
    res.json(images);
  } catch (error) {
    console.error('Error fetching welcome images:', error);
    res.status(500).json({ error: 'Failed to fetch welcome images' });
  }
});

export default router;
