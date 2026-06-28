import dotenv from 'dotenv';
dotenv.config();

import { httpServer } from './app';
import connectDB from './config/database';
import { initializeSocket } from "./socket/index";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  initializeSocket(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();