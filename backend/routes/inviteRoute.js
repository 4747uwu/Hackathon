import express from 'express';
import User from '../models/userModel.js';
import Project from '../models/Project.js';
// import { authenticateUser } from '../middleware/authMiddleware.js'; // Middleware to get `req.user`

const router = express.Router();

/**
 * 🔹 1. Search Users by Email
 */
router.get('/users',  async (req, res) => {
  try {
    const { email } = req.query;
    const users = await User.find({ 
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.user._id } // Exclude the current user
    }).select('name email avatar');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

/**
 * 🔹 2. Send Project Invitation
 */
router.post('/invite',  async (req, res) => {
  try {
    const { userId, projectId } = req.body;

    const receiver = await User.findById(userId);
    if (!receiver) return res.status(404).json({ message: "User not found" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Check if an invite already exists
    const alreadyInvited = receiver.pendingRequests.some(req => 
      req.from.toString() === req.user._id && req.status === 'pending'
    );

    if (alreadyInvited) {
      return res.status(400).json({ message: "Invite already sent!" });
    }

    // Add to receiver's pendingRequests
    receiver.pendingRequests.push({ from: req.user._id });
    await receiver.save();

    res.json({ message: "Invite sent successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error sending invite", error: err.message });
  }
});

/**
 * 🔹 3. Get Pending Invitations for the User
 */
router.get('/invites',  async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'pendingRequests.from',
      select: 'name email avatar'
    });

    res.json(user.pendingRequests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching invites", error: err.message });
  }
});

/**
 * 🔹 4. Accept Invitation
 */
router.put('/invite/accept/:inviteId',  async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const inviteIndex = user.pendingRequests.findIndex(inv => inv._id.toString() === req.params.inviteId);
    
    if (inviteIndex === -1) return res.status(404).json({ message: "Invite not found" });

    const invite = user.pendingRequests[inviteIndex];

    // Fetch project and inviting user
    const invitingUser = await User.findById(invite.from);
    const project = await Project.findOne({ _id: invite.project });

    if (!invitingUser || !project) return res.status(404).json({ message: "Project or user not found" });

    // Update invite status
    user.pendingRequests[inviteIndex].status = 'accepted';
    await user.save();

    // Add user to the project team
    project.team.push(user._id);
    await project.save();

    // Add project to user's projects list
    user.projects.push({ project: project._id, name: project.name, role: 'member' });
    await user.save();

    res.json({ message: "Invite accepted", project });
  } catch (err) {
    res.status(500).json({ message: "Error accepting invite", error: err.message });
  }
});

/**
 * 🔹 5. Reject Invitation
 */
router.put('/invite/reject/:inviteId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const inviteIndex = user.pendingRequests.findIndex(inv => inv._id.toString() === req.params.inviteId);
    
    if (inviteIndex === -1) return res.status(404).json({ message: "Invite not found" });

    user.pendingRequests[inviteIndex].status = 'rejected';
    await user.save();

    res.json({ message: "Invite rejected" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting invite", error: err.message });
  }
});

export default router;
