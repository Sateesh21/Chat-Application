import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { createServer } from 'http';
import authRouter from "./routes/user.routes";
import cookieParser from "cookie-parser";
import roomRouter from './routes/room.routes';

const app = express();
const httpServer = createServer(app);

// Middlewares — order matters
app.use(cors({
  origin: "http://localhost:5501",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/rooms", roomRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Chat API is running' });
});

export { app, httpServer };