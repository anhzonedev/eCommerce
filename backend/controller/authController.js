import bcrypt from "bcrypt";
import dotenv from "dotenv";
import validator from "validator";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";

// Load biến môi trường
dotenv.config();

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email và OTP không được để trống!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Mã OTP không đúng. Vui lòng kiểm tra lại!",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Mã OTP đã hết hạn" });
    }

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Xác thực Email thành công, hãy đăng nhập tài khoản.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email không đúng định dạng" });
    }

    const user = await User.findOne({ email });
    if (user) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      user.otp = otp;
      user.otpExpiry = Date.now() + 10 * 60 * 100;
      await user.save();

      await sendEmail({
        to: email,
        subject: "Mã xác nhận email quên mật khẩu:",
        html: otpEmailTemplate(otp),
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Mã OTP đã được gửi về Email của bạn" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đủ thông tin!" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email không đúng định dạng" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tại" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công. Hãy đăng nhập lại",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "không để trống mật khẩu!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Tài khoản không tồn tài!" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không đúng!" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới không được trùng với mật khẩu cũ!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ. Vui lòng thử lại sau",
    });
  }
};