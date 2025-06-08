import express from "express";
import {
  createAddress,
  deleteAddress,
  getAddress,
  loginUser,
  registerUser,
  updateAddress,
  updateAvatar,
  updateProfile,
} from "../controller/userController.js";
import authorizeRole from "../middleware/authorizeRole.js";
import { uploadSingleImage } from "../middleware/upload.js";
const router = express.Router();

//GET
router.get("/address", authorizeRole(["user"]), getAddress);

// Post
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/address", authorizeRole(["user"]), createAddress);

//PUT
router.put(
  "/update-avatar",
  authorizeRole(["user"]),
  uploadSingleImage("avatars"),
  updateAvatar
);
router.put("/update-profile", authorizeRole(["user"]), updateProfile);
router.put("/address/:id", authorizeRole(["user"]), updateAddress);

//DELETE
router.delete("/address/:id", authorizeRole(["user"]), deleteAddress);

export default router;
