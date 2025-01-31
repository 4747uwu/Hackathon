import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional, for non-Google users
});

export default mongoose.model("User", UserSchema);
