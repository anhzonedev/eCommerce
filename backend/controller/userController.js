import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";
import fs from "fs";
import { cloudinary } from "../config/cloudinary.js";

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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đủ thông tin!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản không tồn tại. Hãy kiểm tra lại!",
      });
    }

    if (!user.emailVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Email chưa được xác thực. Vui lòng kiểm tra hộp thư email để xác thực!",
      });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message:
          "Tài khoản của bạn đang khóa. Vui lòng liên hệ tổng đài để xử lý!",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userID = req.user.id;

    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    if (req.file) {
      try {
        if (user.avatar) {
          const publicID = user.avatar
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicID);
        }

        user.avatar = req.file.path;
        await user.save();

        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(200).json({
          success: true,
          message: "Tải ảnh đại diện thành công",
          avatar: user.avatar,
        });
      } catch (error) {
        if (fs.existsSync(req.file?.path) && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res
          .status(500)
          .json({ success: false, message: "Lỗi máy chủ khi cập nhật ảnh" });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userID = req.user.id;
    const { username, phone } = req.body;

    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }

    user.username = username || user.username;
    user.phone = phone || user.phone;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: {
        name: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const createAddress = async (req, res) => {
  try {
    const userID = req.user.id;
    const { fullName, phone, ward, district, city, addressLine, note } =
      req.body;
    if (!fullName || !phone || !ward || !district || !city || !addressLine) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin đụa chỉ!",
      });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại!",
      });
    }

    const newAddress = {
      fullName,
      phone,
      ward,
      district,
      city,
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
