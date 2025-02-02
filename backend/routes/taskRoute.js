import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Task from "../models/Task.js";
import User from "../models/userModel.js";
import Project from "../models/Project.js";
import mongoose from "mongoose"

const router = express.Router();

//get all the projects

router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Task.find({
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
      const { title, description, status, p_id,dueDate } = req.body;
  
      console.log("title:", title);
      console.log(req.body);
  
      // Create a new task
      const newTask = new Task({
        title,
        description,
        status,
        dueDate : dueDate,
      });
  
      console.log(newTask);
  
      // Save the new task
      await newTask.save();
  
      console.log("Project ID:", p_id);
  
      // Ensure p_id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(p_id)) {
        return res.status(400).json({ error: "Invalid Project ID" });
      }
  
      // Append the newly created task's ObjectId to the project's tasks list
      const updatedProject = await Project.findOneAndUpdate(
        { _id: p_id },  
        { $push: { tasks: newTask._id } },  // Push task's ObjectId, not req.body.task
        { new: true, runValidators: true }
      );
  
      console.log("yes");
  
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
  
      res.status(201).json({ message: "Task created and linked successfully", task: newTask });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating task", error });
    }
  });
  


//update a project 

router.put('/:_id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params._id);
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
router.put('/complete/:_id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params._id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Update only the status field
        if(task.status == "completed") {
            task.status = "in-progress";
            console.log("alt");
        }
        else{task.status = "completed"};
        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.put('/assign/:_id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params._id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Update only the status field
        task.assignedTo = req.body.assignedTo;
        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.get('/:_id',  async (req, res) => {
  try {
    const project = await Task.findById(req.params._id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});



export default router;
