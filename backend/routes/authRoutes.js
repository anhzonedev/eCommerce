import express from "express";
import {
  changePassword,
  forgotPassword,
  resetPassword,
  verifyOtp,
} from "../controller/authController.js";
import authorizeRole from "../middleware/authorizeRole.js";
const router = express.Router();

// Post
router.post("/verify-email", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/update-password", resetPassword);
router.post("/change-pass", authorizeRole(["user"]), changePassword);


export default router;
