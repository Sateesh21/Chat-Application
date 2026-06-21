import bcrypt from "bcrypt";
import User from "../models/user.model";
import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const userRegistration = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body; //Accept the details from the user

    const existUser = await User.findOne({ email }); // check if the exist user or not.
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered, Please login",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password to save in db using bcrypt

    const newUser = new User({ name, email, password: hashedPassword }); // create new user
    await newUser.save(); //save

    return res.status(201).json({
      success: true,
      message: "User registered successfully", //Success Message.
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error", //If these are any issues.
    });
  }
};

//Logins

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "user not found ! please register first.",
      });
    }

    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credientials",
      });
    }

    const accessToken = generateAccessToken(findUser.id);
    const refreshToken = generateRefreshToken(findUser.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Change Password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User must login to change the password",
      });
    }

    const matchOldPassword = await bcrypt.compare(currentPassword, user.password);
    if (!matchOldPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid Old Password",
      });
    }

    const matchNewPassword = await bcrypt.compare(newPassword, user.password);
    if (matchNewPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password Should not be the Old Password",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

//get the user to display on frontend
export const getUser = async (req: Request, res: Response) => {
  try {
    const findUser = await User.findById(req.user?.userId).select("-password");

    if (!findUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        avatar: findUser.avatar,
        isOnline: findUser.isOnline,
        lastSeen: findUser.lastSeen,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Update the User profile or username
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { newUserName, newAvatar } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found to update the details",
      });
    }

    if (newUserName === user.name) {
      return res.status(400).json({
        success: false,
        message: "New name cannot be the same as old name",
      });
    }

    user.name = newUserName || user.name;
    user.avatar = newAvatar || user.avatar;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user?.userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};