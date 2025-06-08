import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load biến môi trường
dotenv.config();

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu, Vui lòng kiểm tra lại",
      });
    }

    const isMatch = await bcrypt.compare(password, adminPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu, Vui lòng kiểm tra lại",
      });
    }

    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Đăng nhập quản trị viên thành công",
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Có lỗi máy chủ. Vui lòng thử lại!" });
  }
};