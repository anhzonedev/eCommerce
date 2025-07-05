import express from "express";
import {
  addBanner,
  addParentCategory,
  addProductAdmin,
  addSubCategory,
  adminLogin,
  deleteBanner,
  deleteCategory,
  deleteUser,
  getAllBanners,
  getAllCategories,
  getAllUsers,
  getSubCategoriesByParent,
  getUserDetails,
  toggleBlockUser,
} from "../controller/adminController.js";
import authorizeRole from "../middleware/authorizeRole.js";
import {
  uploadMultipleImages,
  uploadSingleImage,
} from "../middleware/upload.js";
const router = express.Router();

// GET
router.get("/users", authorizeRole(["admin"]), getAllUsers);
router.get("/users/:userID", authorizeRole(["admin"]), getUserDetails);
router.get("/banners", authorizeRole(["admin"]), getAllBanners);
router.get("/categories", authorizeRole(["admin"]), getAllCategories);
router.get(
  "/categories/sub/:parentId",
  authorizeRole(["admin"]),
  getSubCategoriesByParent
);

//POSST
router.post("/login", adminLogin);
router.post("/users/:userId/block", authorizeRole(["admin"]), toggleBlockUser);
router.post(
  "/banner",
  authorizeRole(["admin"]),
  uploadSingleImage("banners"),
  addBanner
);
router.post(
  "/category",
  authorizeRole(["admin"]),
  uploadSingleImage("categories"),
  addParentCategory
);
router.post("/category/sub", authorizeRole(["admin"]), addSubCategory);
router.post(
  "/products",
  authorizeRole(["admin"]),
  uploadMultipleImages("products", 10),
  addProductAdmin
);

//DELETE
router.delete("/users/:userId", authorizeRole(["admin"]), deleteUser);
router.delete("/banners/:bannerId", authorizeRole(["admin"]), deleteBanner);
router.delete(
  "/categories/:categoryId",
  authorizeRole(["admin"]),
  deleteCategory
);

export default router;
