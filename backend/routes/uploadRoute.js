import express from 'express';
import multer from 'multer';
import { put } from '@vercel/blob';
import authMiddleware from '../middleware/authMiddleware.js';
import Project from '../models/Project.js';
import path from 'path';
import fs from 'fs';
import axios from 'axios';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a file to a specific project
router.post('/upload/:projectId', authMiddleware, upload.single('file'), async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  console.log('Project ID:', projectId);
  console.log('User ID:', userId);

  try {
    // Check if the user is part of the project
    const project = await Project.findById(projectId);
    console.log('Project:', project);

   if (!project) {
      console.log('Project not found.');
      return res.status(404).json({ error: 'Project not found.' });
    }

    console.log('Project team:', project.team);

    const isUserInProject = project.team.some(member => {
      console.log('Team member:', member);
      return member._id && member._id.toString() === userId.toString();
    });

     if (!isUserInProject) {
      console.log('Access denied. User is not part of the project.');
      return res.status(403).json({ error: 'Access denied. You are not part of this project.' });
    }


    if (!req.file) {
      console.log('No file uploaded.');
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    console.log('File uploaded:', req.file.originalname);

    // Upload file to Vercel Blob
    const blob = await put(req.file.originalname, req.file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: req.file.mimetype,
      
      // Use "private" if you want restricted access
    });

    console.log('Blob URL:', blob.url);

    // Store the file in the project’s `files` array
    project.files.push({
      url: blob.url,
      name: req.file.originalname,
      uploadedBy: userId,
      contentType: req.file.mimetype,
    });

    await project.save();

    console.log('File saved to project:', project);

    res.json({ message: 'File uploaded successfully!', fileUrl: blob.url });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file' });
  }
});



router.get("/:projectId/files", authMiddleware, async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user._id;

  try {
    const project = await Project.findById(projectId);
    if (!project || !project.team.includes(userId)) {
      return res.status(403).json({ error: "Access denied. You are not part of this project." });
    }

    res.json(project.files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files." });
  }
});

router.get("/download/:projectId/:fileId", authMiddleware, async (req, res) => {
  const { projectId, fileId } = req.params;
  const userId = req.user._id;

  try {
    // Find the project and check if the user is part of it
    const project = await Project.findById(projectId);
    if (!project || !project.team.includes(userId)) {
      return res.status(403).json({ error: "Access denied. You are not part of this project." });
    }

    // Find the file inside the project
    const file = project.files.find(f => f._id.toString() === fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found." });
    }

    const fileUrl = file.url; // This is the Vercel Blob URL of the file

    // Fetch the file from the Vercel Blob URL
    const response = await axios.get(fileUrl, { responseType: 'stream' });

    // Set headers for downloading the file
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    res.setHeader('Content-Type', file.contentType); // Ensure the correct MIME type is set

    // Pipe the file stream directly to the response
    response.data.pipe(res);

  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Failed to fetch file." });
  }
});










export default router;