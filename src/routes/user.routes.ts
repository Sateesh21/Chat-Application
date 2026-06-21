import express from "express";
// import { authMiddleware } from "../middlewares/auth.middleware";
import {
  userRegistration,
  userLogin,
  changePassword,
  getUser,
  updateUser,
  deleteUser,
  logoutUser
} from "../controllers/user.controller";
import validate from "../middlewares/validate.middleware";
import {registerValidator, loginValidator, changePasswordValidator} from "../validators/user.validatior";
import { authMiddleware } from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/register", validate(registerValidator), userRegistration);
authRouter.post("/login", validate(loginValidator), userLogin);
authRouter.get("/me", authMiddleware, getUser);
authRouter.put("/update-profile", authMiddleware, updateUser);
authRouter.put("/change-password",authMiddleware, validate(changePasswordValidator), changePassword);
authRouter.delete("/delete-profile",authMiddleware, deleteUser);
authRouter.post("/logout",authMiddleware, logoutUser);

export default authRouter;