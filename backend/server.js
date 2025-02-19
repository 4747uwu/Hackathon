import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoute from "./routes/authRoute.js";
import projectRoute from "./routes/projectRoute.js";
import userRoute from "./routes/userRoute.js";
import userProfile from "./routes/userProfile.js";
import inviteRoute from "./routes/inviteRoute.js";
import setupWebSocketServer from './config/websocketConfig.js';
import http from 'http';
import discussionRoute from './routes/discussionRoute.js';
import taskRoute from './routes/taskRoute.js';
import {put} from '@vercel/blob'
import multer from 'multer';
import uploadRoute from './routes/uploadRoute.js'
import welcomeImage from './routes/welcomeImage.js'
import milestoneRoute from './routes/milestoneRoute.js'


const app = express();
const PORT = 5000;
const server = http.createServer(app);

// Connect to the database
connectDB();

// Setup CORS and WebSocket
const corsOptions = {
  origin: 'http://localhost:5173', // Allow frontend URL
  credentials: true, // Allow cookies to be sent
};
setupWebSocketServer(server); // Initialize WebSocket server

const storage = multer.memoryStorage();
const upload = multer({storage});

// Use middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'your_secret_key', // Replace with a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

// API routes
app.use('/auth', authRoute);
app.use('/project', projectRoute);
app.use('/task',taskRoute)
app.use('/user', userRoute);
app.use('/users/profile', userProfile);
app.use('/', inviteRoute);
app.use('/', discussionRoute);
app.use('/files',uploadRoute)
app.use('/welcome-image',welcomeImage)
app.use('/milestone',milestoneRoute)

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
