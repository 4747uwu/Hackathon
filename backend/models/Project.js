import mongoose from "mongoose";
import Task from "./Task.js";
import User from "./userModel.js";
import { Team,Label,File,Discussion } from "./model.js";


const projectSchema = new mongoose.Schema({
  title: { type: String, required: false,}, // Unique project name
  description: { type: String, required: false }, // Brief overview
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Under Review", "Completed", "On Hold"],
    default: "Not Started"
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Creator of the project
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Team members
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Linked tasks
  deadline: { type: Date, required: false }, // Project deadline
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" }, // Importance level
  labels: [{ type: String }], // Custom tags for classification
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }], // Attached documents
  discussion: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Project-related comments/discussions
  createdAt: { type: Date, default: Date.now }, // Timestamp of project creation
  updatedAt: { type: Date, default: Date.now }, // Last update timestamp
  aiInsights: { type: String } // AI-generated project suggestions
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
