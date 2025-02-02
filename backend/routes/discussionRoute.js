import express from 'express';
import Message from '../models/messageSchema.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Project from '../models/Project.js';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/api/projects/:projectId/messages', async (req, res) => {
  console.log('GET request received for project:', req.params.projectId);
  try {
    const messages = await Message.find({ projectId: req.params.projectId })
      .populate('sender', 'name profileImage')
      .sort({ timestamp: 1 });

    console.log('Messages found:', messages);  // Debug log
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

router.post('/api/projects/:projectId/messages', authMiddleware, async (req, res) => {
  console.log('POST request received with data:', req.body);
  try {
    if (!req.body.content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const message = new Message({
      projectId: req.params.projectId,
      sender: req.user._id, // Make sure `req.user._id` is available
      content: req.body.content,
    });

    await message.save();
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profileImage');

    console.log('Saved message:', populatedMessage);  // Debug log

    res.json(populatedMessage);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ message: 'Error saving message' });
  }
});


export default router;
