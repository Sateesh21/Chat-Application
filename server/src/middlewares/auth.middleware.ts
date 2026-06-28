import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - please login",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_KEY as string
    ) as { userId: string };

    req.user = { userId: decoded.userId };
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token, please login again",
    });
  }
};