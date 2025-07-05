import express from "express";
import {
  changePassword,
  forgotPassword,
  getPublicParentCategories,
  resetPassword,
  updateAvatar,
  updateProfile,
  verifyOtp,
} from "../controller/authController.js";
import authorizeRole from "../middleware/authorizeRole.js";
import { uploadSingleImage } from "../middleware/upload.js";
const router = express.Router();


//GET
router.get("/public/parent-categories", getPublicParentCategories);

// Post
router.post("/verify-email", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/update-password", resetPassword);
router.post("/change-pass", authorizeRole(["user", "seller"]), changePassword);

//PUT
router.put(
  "/update-avatar",
  authorizeRole(["user", "seller"]),
  uploadSingleImage("avatars"),
  updateAvatar
);

router.put("/update-profile", authorizeRole(["user", "seller"]), updateProfile);


export default router;
