import express from 'express';
import User from '../models/userModel.js';
import Project from '../models/Project.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Middleware to get `req.user`

const router = express.Router();

/**
 *  1. Search Users by Email
 */
router.get('/users', authMiddleware,  async (req, res) => {
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
 *  2. Send Project Invitation
 */
// router.post('/invite',authMiddleware,  async (req, res) => {
//   try {
//     const { userId, projectId } = req.body;
//     console.log('User ID:', userId);
//     console.log('Project ID:', projectId);

//     const receiver = await User.findById(userId);
//     if (!receiver) return res.status(404).json({ message: "User not found" });

//     const project = await Project.findById(projectId);
//     if (!project) return res.status(404).json({ message: "Project not found" });

//     // Check if an invite already exists
//     const alreadyInvited = receiver.pendingRequests.some(req => 
//       req.from.toString() === req.user._id && req.status === 'pending'
//     );

//     if (alreadyInvited) {
//       return res.status(400).json({ message: "Invite already sent!" });
//     }

//     // Add to receiver's pendingRequests
//     receiver.pendingRequests.push({ from: req.user._id });
//     await receiver.save();

//     res.json({ message: "Invite sent successfully!" });
//   } catch (err) {
//     res.status(500).json({ message: "Error sending invite", error: err.message });
//   }
// });


router.post('/invite', authMiddleware, async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    const invitingUser = req.user;
    console.log('Inviting user:', invitingUser);
    console.log('Project ID:', projectId);

    // Find the receiver by userId
    const receiver = await User.findById(userId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    receiver.pendingRequests.push({
      from: invitingUser._id,
      project: project._id,
      status: 'pending',
      timestamp: new Date()
    });

    await receiver.save();

    res.json({ message: 'Invite sent successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending invite', error: err.message });
  }
});

/**
 *  3. Get Pending Invitations for the User
 */
router.get('/invites',authMiddleware,  async (req, res) => {
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
 *  4. Accept Invitation
 */


router.put('/invite/accept/:inviteId', authMiddleware, async (req, res) => {
  try {
    console.log('Accept invite endpoint hit');
    const user = await User.findById(req.user._id);
    console.log('User found:', user);

    const inviteIndex = user.pendingRequests.findIndex(inv => inv._id.toString() === req.params.inviteId);
    console.log('Invite index:', inviteIndex);

    if (inviteIndex === -1) {
      console.log('Invite not found');
      return res.status(404).json({ message: "Invite not found" });
    }

    const invite = user.pendingRequests[inviteIndex];
    console.log('Invite found:', invite);

    // Fetch project and inviting user
    const invitingUser = await User.findById(invite.from);
    console.log('Inviting user found:', invitingUser);

    const project = await Project.findOne({ _id: invite.project });
    console.log('Project found:', project);

    // if (!invitingUser || !project) {
    //   console.log('Project or user not found');
    //   return res.status(404).json({ message: "Project or user not found" });
    // }

    // Update invite status
    user.pendingRequests[inviteIndex].status = 'accepted';
    await user.save();
    console.log('Invite status updated to accepted');

    // Add user to the project team
    project.team.push(user._id);
    await project.save();
    console.log('User added to project team');

    // Add project to user's projects list
    user.projects.push({ project: project._id, name: project.name, role: 'member' });
    await user.save();
    console.log('Project added to user\'s projects list');

       user.connections.push({
      _id: invitingUser._id,
      name: invitingUser.name,
      email: invitingUser.email,
      project: {
        _id: project._id,
        name: project.name
      }
    });
    invitingUser.connections.push({
      _id: user._id,
      name: user.name,
      email: user.email,
      project: {
        _id: project._id,
        name: project.name
      }
    });

    

    res.json({ message: "Invite accepted", project });
  } catch (err) {
    console.error('Error accepting invite:', err);
    res.status(500).json({ message: "Error accepting invite", error: err.message });
  }
});

// router.put('/invite/accept/:inviteId', authMiddleware, async (req, res) => {
//   try {
//     console.log('Accept invite endpoint hit');

//     const user = await User.findById(req.user._id);
//     console.log('User found:', user);

//     const inviteIndex = user.pendingRequests.findIndex(inv => inv._id.toString() === req.params.inviteId);
//     console.log('Invite index:', inviteIndex);

//     if (inviteIndex === -1) {
//       console.log('Invite not found');
//       return res.status(404).json({ message: "Invite not found" });
//     }

//     const invite = user.pendingRequests[inviteIndex];

//     // Fetch inviting user and project
//     const invitingUser = await User.findById(invite.from);
//     console.log('Inviting user found:', invitingUser);

//     const project = await Project.findById(invite.project);
//     console.log('Project found:', project);

//     if (!invitingUser || !project) {
//       console.log('Project or user not found');
//       return res.status(404).json({ message: "Project or user not found" });
//     }

//     // Update invite status
//     user.pendingRequests[inviteIndex].status = 'accepted';

//     // Add user to the project team
//     project.team.push(user._id);

//     // Add project to user's projects list
//     user.projects.push({ project: project._id, name: project.name, role: 'member' });

//     // Add each other as connections, storing both ObjectId & extra fields
//     if (!user.connections.some(conn => conn._id.equals(invitingUser._id))) {
//       user.connections.push({
//         _id: invitingUser._id,
//         name: invitingUser.name,
//         email: invitingUser.email,
//         project: {
//           _id: project._id,
//           name: project.name
//         }
//       });
//     }

//     if (!invitingUser.connections.some(conn => conn._id.equals(user._id))) {
//       invitingUser.connections.push({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         project: {
//           _id: project._id,
//           name: project.name
//         }
//       });
//     }

//     // Save all changes
//     await user.save();
//     await invitingUser.save();
//     await project.save();

//     console.log('Invite accepted successfully');

//     res.json({ message: "Invite accepted", project });

//   } catch (err) {
//     console.error('Error accepting invite:', err);
//     res.status(500).json({ message: "Error accepting invite", error: err.message });
//   }
// });


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
