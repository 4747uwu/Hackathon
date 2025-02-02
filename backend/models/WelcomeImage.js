import mongoose from 'mongoose';

// Define the schema for the welcome image
const welcomeImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    // Add any other fields you want, such as image metadata
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create the model from the schema
const WelcomeImage = mongoose.model('WelcomeImage', welcomeImageSchema);

export default WelcomeImage;
