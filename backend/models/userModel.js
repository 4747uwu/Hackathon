import mongoose from "mongoose";
import Task from "./Task.js";
import Project from "./Project.js";
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, required: false },

  name: { type: String, required: false },
  email: { type: String, required: true,},
  password: { type: String, required: false },
  avatar: { type: String },
  profileImage: { type: String },
  bio: { type: String },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  connections: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    project: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      },
      name: String,
      priority: String,
      deadline: Date
    }
  }],
  pendingRequests: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  projects: [{
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    name: String,
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member'
    }
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;