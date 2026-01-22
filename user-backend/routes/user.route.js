import { Router } from "express";
import {
  login,
  logout,
  register,
  forgetPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forget-password", forgetPassword); 
router.post("/verify-otp", verifyOtp);           
router.post("/reset-password", resetPassword);

export default router;
