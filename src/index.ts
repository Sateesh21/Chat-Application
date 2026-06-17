import dotenv from 'dotenv';
dotenv.config();

import { httpServer } from './app';
import connectDB from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB(); // connect DB first

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
