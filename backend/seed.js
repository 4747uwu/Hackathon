import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WelcomeImage from './models/WelcomeImage.js';
import connectDB from '../backend/config/db.js'; // Adjust the path to where your model is located

dotenv.config(); // Load environment variables

// Connect to MongoDB
connectDB();

// Seed the database with initial data
const seedDatabase = async () => {
  try {
    // Clear existing data in the collection
    await WelcomeImage.deleteMany();

    // Define initial data
    const welcomeImages = [
      {
        title: 'Welcome Image 1',
        description: 'This is the first welcome image.',
        url: 'https://res.cloudinary.com/darcn1hgn/image/upload/f_auto,q_auto/sq8lasw3zjfc2vggohm9',
      },
      {
        title: 'Welcome Image 2',
        description: 'This is the second welcome image.',
        url: 'https://res.cloudinary.com/darcn1hgn/image/upload/f_auto,q_auto/pun4yd9qpkkjktw3faf8',
      },
      {
        title: 'Welcome Image 3',
        description: 'This is the third welcome image.',
        url: 'https://res.cloudinary.com/darcn1hgn/image/upload/f_auto,q_auto/ber21qyuxzqvahizm4z4',
      },
      {
        title: 'Welcome Image 4',
        description: 'This is the fourth welcome image.',
        url: 'https://res.cloudinary.com/darcn1hgn/image/upload/f_auto,q_auto/vytgnkhgikkfr7edjr9n',
      },
    ];

    // Insert the initial data into the database
    await WelcomeImage.insertMany(welcomeImages);
    console.log('Welcome images have been seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();