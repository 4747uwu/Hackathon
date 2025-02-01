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

const app = express();
const PORT = 5000;

connectDB();

const corsOptions = {
  origin: 'http://localhost:5173', // Allow frontend URL
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'your_secret_key', // Replace with a secure key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/auth', authRoute);
app.use('/project', projectRoute);
app.use('/user', userRoute);
app.use('/users/profile', userProfile);
app.use('/',inviteRoute)


