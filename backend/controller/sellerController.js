import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";
import { loginAccount } from "./authController.js";

dotenv.config();

export const registerSeller = async (req, res) => {
  try {
    const {
      username,
      phone,
      email,
      shopName,
      addressSeller,
      addressShop,
      country,
      password,
    } = req.body;
    if (
      !username ||
      !phone ||
      !email ||
      !shopName ||
      !addressSeller ||
      !addressShop ||
      !country ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Bạn không được để trống thông tin!",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không đúng định dạng. Vui lòng kiểm tra lại!",
      });
    }
    const existingEmail = await User.find({ email });
    if (!existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email đã đưuọc đăng ký. Vui lòng thử emnail khác!",
      });
    }
    const exitstingPhone = await User.find({ phone });
    if (!exitstingPhone) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại đã được đăng ký. Vui lòng thử số khác!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newSeller = new User({
      username,
      phone,
      email,
      shopName,
      addressSeller,
      addressShop,
      country,
      password: hashedPassword,
      role: "seller",
      emailVerified: true,
    });
    await newSeller.save();

    return res.status(200).json({
      success: true,
      message:
        "Đăng ký tài khoản người bán thành công! Vui lòng đăng nhập để tiếp tục.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const loginSeller = loginAccount;
