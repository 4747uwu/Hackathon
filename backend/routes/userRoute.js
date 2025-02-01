import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";
import Project from "../models/Project.js";

const router = express.Router();

//search  by email

router.get("/search", authMiddleware, async (req, res)=>{
    try{
        const {email} = req.query;
        const user = await User.findOne({
            email:{$regex: email, $options: "i"},
            _id: {$ne: req.user._id}
        }).select('-password');
        res.json(user);


    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
})

//send connection request to other user

router.post("/connection", authMiddleware, async (req, res) =>{
    try{
        const {userId} = req.body;
        const targetUser = await User.findById(userId);

        if(!targetUser){
            return res.status(404).json({message: "User not found"});
        }

        const existingRequest = req.user.connections.find(
            req => req.from.toString() === req.user._id
        );

        if(existingRequest){
            return res.status(400).json({message: "Request already sent"});
        }

        targetUser.pendingRequests.push({from: req.user._id,
            status: "pending"
        });

        await targetUser.save();
        res.json({message: "Request sent"});


    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }
});


//accept connection request 
router.put('/connect/:requestId', authMiddleware, async (req, res) => {
    try{
        const { status } = req.body;
        const user = await User.findById(req.user._id);

        const requestIndex = user.pendingRequests.findIndex(
            req => req._id.toString() === req.params.requestId
        );

        if(requestIndex === -1){
            return res.status(404).json({message: "Request not found"});
        }

        if(status === "accepted"){
            const fromUser = user.pendingRequests[requestIndex].from;

            user.connections.push({fromUser});
            const otherUser = await User.findById(fromUser);
            otherUser.connections.push( user._id );
            await otherUser.save();


        }

        user.pendingRequests.splice(requestIndex, 1);
        await user.save();
        res.json({message: `Request ${status}`});


    }catch(error){
        res.status(500).json({message: "Server error", error: error.message});
    }

});

router.post('/project/:projectId/add', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check if user is project leader
    if (project.leader.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Add to project team
    if (!project.team.includes(userId)) {
      project.team.push(userId);
      await project.save();

      // Add project to user's projects
      user.projects.push({
        project: project._id,
        role: 'member'
      });
      await user.save();
    }

    res.json(project);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});






export default router;