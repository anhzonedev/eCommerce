import express from "express";
import { registerSeller } from "../controller/sellerController.js";
const router = express.Router();

router.post("/register-seller", registerSeller);
export default router;
