import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Project from "../models/Project.js";

const router = express.Router();

//get all the projects

router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { leader: req.user.id },
        { team: req.user.id }
      ]
    }).populate('leader team', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

//post a project

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newProject = new Project({
      ...req.body,
      leader: req.user.id,
      team: [req.user.id]
    });
    await newProject.save();
    res.json(newProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//update a project 

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    if (project.leader.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedProject);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

export default router;
