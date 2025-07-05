import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";
import { loginAccount } from "./authController.js";
import Banner from "../models/bannerModel.js";

dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    if (!username || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng không bỏ trống thông tin!",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email không đúng định dạng. Vui lòng kiểm tra lại!",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email đã được đăng ký. Hãy nhập Email khác",
      });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại đã được đăng ký. Hãy nhập số khác",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      role: "user",
      emailVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.otp = otp;
    newUser.otpExpiry = Date.now() + 10 * 60 * 1000;

    await newUser.save();

    await sendEmail({
      to: email,
      subject: "Mã xác nhận email của bạn:",
      html: otpEmailTemplate(otp),
    });

    return res.status(200).json({
      success: true,
      message:
        "Mã OTP đã được gửi tới Email của bạn, Hãy kiểm tra Email để xác thực tài khoản",
    });
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};
export const loginUser = loginAccount;

export const createAddress = async (req, res) => {
  try {
    const userID = req.user.id;
    const { fullName, phone, province, ward, district, addressLine, note } = req.body;

    if (!fullName || !phone || !province || !ward || !district || !addressLine) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin địa chỉ!",
      });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại!",
      });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã bị khóa, hãy liên hệ tổng đài để hỗ trợ!",
      });
    }

    const newAddress = {
      fullName,
      phone,
      province,
      ward,
      district,
      addressLine,
      note: note || "",
    };
    user.address.push(newAddress);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Thêm địa chỉ thành công",
      address: user.address,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản!" });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã bị khóa, hãy liên hệ tổng đài để hỗ trợ!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lấy địa chỉ thành công.",
      address: user.address,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userID = req.user.id;
    const addressID = req.params.id;
    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản!" });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã bị khóa, hãy liên hệ tổng đài để hỗ trợ!",
      });
    }
    const addressIndex = user.address.findIndex(
      (addr) => addr._id.toString() === addressID
    );
    if (addressIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa chỉ!" });
    }
    user.address.splice(addressIndex, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Xóa địa chỉ thành công",
      address: user.address,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userID = req.user.id;
    const addressID = req.params.id;
    const { fullName, phone, ward, district, city, addressLine, note } =
      req.body;

    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản!" });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã bị khóa, hãy liên hệ tổng đài để hỗ trợ!",
      });
    }

    const addr = user.address.id(addressID);
    if (!addr) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa chỉ!" });
    }
    addr.fullName = fullName || addr.fullName;
    addr.phone = phone || addr.phone;
    addr.ward = ward || addr.ward;
    addr.district = district || addr.district;
    addr.city = city || addr.city;
    addr.addressLine = addressLine || addr.addressLine;
    addr.note = note || addr.note;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật địa chỉ thành công",
      address: user.address,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getPublicBanners = async (req, res) => {
  try {
    const banners = await Banner.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    return res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};