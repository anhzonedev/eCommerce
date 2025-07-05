import express from "express";
import cros from "cors";
import "dotenv/config";
import connectDB from "./config/mongdb.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bcrypt from "bcrypt";
const app = express();
const port = process.env.PORT || 5000;
connectDB();
app.use(express.json());
app.use(cros());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Đang chạy...");
});

app.listen(port, () => console.log("Server đang chạy dưới port: " + port));

// import dotenv from "dotenv";
// import fs from "fs/promises";
// import path from "path";

// dotenv.config();

// const generateAdminPassword = async () => {
//   const plainPassword = "admin";

//   try {
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

//     const envPath = path.join(process.cwd(), ".env");
//     const envContent = await fs.readFile(envPath, "utf-8");
//     const updatedContent = envContent.replace(
//       /ADMIN_PASSWORD=.*/,
//       `ADMIN_PASSWORD=${hashedPassword}`
//     );
//     await fs.writeFile(envPath, updatedContent);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// generateAdminPassword();
