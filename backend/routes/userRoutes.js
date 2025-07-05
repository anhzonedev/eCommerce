import express from "express";
import {
  createAddress,
  deleteAddress,
  getAddress,
  getPublicBanners,
  loginUser,
  registerUser,
  updateAddress,
} from "../controller/userController.js";
import authorizeRole from "../middleware/authorizeRole.js";
const router = express.Router();

//GET
router.get("/address", authorizeRole(["user"]), getAddress);
router.get("/banners", getPublicBanners);
// Post
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/address", authorizeRole(["user"]), createAddress);

//PUT


router.put("/address/:id", authorizeRole(["user"]), updateAddress);

//DELETE
router.delete("/address/:id", authorizeRole(["user"]), deleteAddress);

export default router;
