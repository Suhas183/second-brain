import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB or other databases
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit process with failure
  }
};

startServer();
