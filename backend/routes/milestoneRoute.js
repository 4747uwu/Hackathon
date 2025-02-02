import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Milestone from "../models/milestone.js";
import Project from "../models/Project.js"
import axios from "axios";
import Task from "../models/Task.js";

const router = express.Router();

// 🟢 Fetch milestones for a project
router.get("/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const milestoneDoc = await Milestone.findOne({ project: projectId });

    if (!milestoneDoc) {
      return res.status(404).json({ message: "No milestones found for this project" });
    }

    res.json(milestoneDoc.milestones);
  } catch (err) {
    res.status(500).json({ message: "Error fetching milestones", error: err.message });
  }
});

// 🟢 Add a milestone (PUSH to top of stack)
router.post("/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;

    let milestoneDoc = await Milestone.findOne({ project: projectId });

    if (!milestoneDoc) {
      milestoneDoc = new Milestone({ project: projectId, milestones: [] });
    }

    milestoneDoc.milestones.unshift({ title, completed: false });

    await milestoneDoc.save();
    res.status(201).json(milestoneDoc.milestones);
  } catch (error) {
    res.status(500).json({ message: "Error adding milestone", error: error.message });
  }
});

// 🟢 Remove the most recent milestone (POP from top of stack)
router.delete("/:projectId", authMiddleware, async (req, res) => {
    const { projectId } = req.params;
    console.log("project_id:" ,projectId)
    const milestoneDoc = await Milestone.findOne({ project: projectId });
    console.log(milestoneDoc);
  try {
    const { projectId } = req.params;
    const milestoneDoc = await Milestone.findOne({ project: projectId });

    if (!milestoneDoc || milestoneDoc.milestones.length === 0) {
      return res.status(404).json({ message: "No milestones to remove" });
    }
    console.log(milestoneDoc);
    milestoneDoc.milestones.shift();
    await milestoneDoc.save();

    res.json(milestoneDoc.milestones);
  } catch (error) {
    res.status(500).json({ message: "Error removing milestone", error: error.message });
  }
});

// 🟢 Mark first uncompleted milestone as completed
router.put("/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    const milestoneDoc = await Milestone.findOne({ project: projectId });

    if (!milestoneDoc) {
      return res.status(404).json({ message: "No milestones found for this project" });
    }

    const milestoneToUpdate = milestoneDoc.milestones.find(milestone => !milestone.completed);

    if (!milestoneToUpdate) {
      return res.status(400).json({ message: "All milestones are already completed" });
    }

    milestoneToUpdate.completed = true;
    await milestoneDoc.save();

    res.json(milestoneDoc.milestones);
  } catch (error) {
    res.status(500).json({ message: "Error updating milestone", error: error.message });
  }
});


router.post("/generate/:projectId", authMiddleware, async (req, res) => {
    try {
      const { projectId } = req.params;
  
      // ✅ Step 1: Fetch project details
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // ✅ Step 2: Fetch tasks concurrently using Promise.all
      let tasks = [];
      try {
        tasks = await Promise.all(
          project.tasks.map(async (taskId) => {
            const task = await Task.findOne({ _id: taskId });
            if (!task) throw new Error(`Task with ID ${taskId} not found`);
            return task; // Extract task title
          })
        );
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return res.status(500).json({ message: "Server Error", error: error.message });
      }
  
      console.log("Tasks:", tasks);
     const incompleteTasks = tasks.filter((task) => {
  console.log("Task Status:", task.status); // Debug log to check the status
  return task.status.trim() !== 'completed'; // Ensure no leading/trailing spaces
});

console.log("Incomplete Tasks:", incompleteTasks);
  
      // ✅ Step 3: Prepare prompt for Gemini API
      const prompt = `Given the project titled "${project.title}" with the description: "${project.description}" and tasks are ${incompleteTasks}, generate a structured list of key milestones that might be needed in the project. Only return a list of milestone names with hints for doing them in this exact format: ["milestone1","milestone2","milestone3","milestone4"]. Avoid backticks or any quotes outside of the array. emphasis including the name of the tasks dont give general milestones like`;
  
      console.log("Using API Key:", process.env.GEMINI_API_KEY);
  
      // ✅ Step 4: Call Gemini API for milestone generation
      let generatedArray;
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
  
        const responseText = response.data.candidates[0].content.parts[0].text.trim();
        console.log("Raw Response from API:", responseText);
  
        // ✅ Step 5: Parse response safely
        if (!responseText.startsWith("[")) {
          throw new Error("Invalid response format: Expected JSON array");
        }
  
        generatedArray = JSON.parse(responseText);
        if (!Array.isArray(generatedArray)) {
          throw new Error("Parsed response is not an array");
        }
  
        console.log("Parsed Milestones:", generatedArray);
      } catch (error) {
        console.error("Error calling Gemini API:", error.message);
        if (error.response) {
          console.error("Response Status:", error.response.status);
          console.error("Response Data:", error.response.data);
        }
        return res.status(500).json({ message: "Error generating milestones", error: error.message });
      }
  
      // ✅ Step 6: Format milestones for database
      const milestoneTitles = generatedArray.map((title) => ({ title, completed: false }));
  
      // ✅ Step 7: Save milestones to the database
      let milestoneDoc = await Milestone.findOne({ project: projectId });
  
      if (!milestoneDoc) {
        milestoneDoc = new Milestone({ project: projectId, milestones: [] });
      }
  
      milestoneDoc.milestones = milestoneTitles;
      await milestoneDoc.save();
  
      // ✅ Step 8: Return saved milestones
      return res.status(200).json(milestoneDoc.milestones);
    } catch (error) {
      console.error("Unexpected error:", error.message);
      return res.status(500).json({ message: "Unexpected Server Error", error: error.message });
    }
  });


export default router;
