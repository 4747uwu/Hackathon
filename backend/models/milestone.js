import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Project", 
    required: true 
  }, 
  milestones: [{ 
    title: { type: String, required: true }, 
    completed: { type: Boolean, default: false } 
  }] // ✅ List of milestone objects
});

const Milestone = mongoose.model("Milestone", milestoneSchema);
export default Milestone;
