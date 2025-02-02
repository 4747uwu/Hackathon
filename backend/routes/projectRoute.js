import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Project from "../models/Project.js";
import User from "../models/userModel.js";

const router = express.Router();

//get all the projects

router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { team: req.user._id }
      ]
    }).populate('owner team', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

//post a project

// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const newProject = new Project({
//       ...req.body,
//       leader: req.user._id,
//       team: [req.user._id]
//     });
//     await newProject.save();
//     res.json(newProject);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

router.post("/", authMiddleware, async (req, res) => {
  console.log("yes");
  try {
    const { title, description, status } = req.body;

    const newProject = new Project({
      ...req.body,
      
      title,
      owner: req.user._id, // Assign the logged-in user as the owner
      team: [req.user._id] // Automatically add the creator to the team
    });

    await newProject.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { projects: { Project: newProject._id, name: newProject.title, role: "leader" } }
    });
    // Populate the 'owner' and 'team' fields after saving
    const populatedProject = await Project.findById(newProject._id)
      .populate("owner", "name email") // Only populate necessary fields
      .populate("team", "name email");

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
});


//update a project 

router.put('/:_id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params._id).populate('team.user', 'name email'); // Populate the 'team' field with the user's name and email
    if (!project) return res.status(404).json({ msg: 'Project not found' });
    if (project.leader.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    const updatedProject = await Project.findByIdAndUpdate(
      req.params._id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedProject);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

router.get('/:_id',  async (req, res) => {
  try {
    const project = await Project.findById(req.params._id).populate('owner team', 'name email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

export default router;
