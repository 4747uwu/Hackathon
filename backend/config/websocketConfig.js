import { Server } from 'socket.io';
import Message from '../models/messageSchema.js';  // Path to your Message model

const setupWebSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    socket.on('join', ({ projectId, userId }) => {
      socket.join(projectId); // Join the project room
    });

    socket.on('sendMessage', async ({ projectId, sender, content }) => {
      try {
        if (!content) {
          return socket.emit('error', 'Message content is required');
        }

        // Create the message in the database
        const message = new Message({
          projectId,
          sender,
          content,
        });

        await message.save();

        // Populate the sender's details
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name profileImage');

        // Emit the message to the room
        io.to(projectId).emit('message', populatedMessage);
      } catch (err) {
        console.error('Error saving message:', err);
        socket.emit('error', 'Error saving message');
      }
    });
  });

  return io;
};

export default setupWebSocketServer;