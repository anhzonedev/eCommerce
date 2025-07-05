import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import { otpEmailTemplate } from "../utils/emailTemplates.js";
import fs from "fs";
import { cloudinary } from "../config/cloudinary.js";
import Category from "../models/categoryModel.js";

// Load biến môi trường
dotenv.config();

export const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đủ thông tin!" });
    }

    const account = await User.findOne({ email });
    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản không tồn tại. Hãy kiểm tra lại!",
      });
    }

    if (!account.emailVerified) {
      return res.status(400).json({
        success: false,
        message:
          "Email chưa được xác thực. Vui lòng kiểm tra hộp thư email để xác thực!",
      });
    }

    if (account.isBlocked) {
      return res.status(400).json({
        success: false,
        message:
          "Tài khoản của bạn đang khóa. Vui lòng liên hệ tổng đài để xử lý!",
      });
    }
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    }

    const token = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Chuẩn bị dữ liệu trả về tùy theo role
    let userData = {
      id: account._id,
      name: account.username,
      email: account.email,
      phone: account.phone,
      avatar: account.avatar,
      role: account.role,
    };

    if (account.role === "seller") {
      userData = {
        ...userData,
        addressSeller: account.addressSeller,
        addressShop: account.addressShop,
        country: account.country,
        shopName: account.shopName,
      };
    }

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      account: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

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

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã bị khóa, hãy liên hệ tổng đài để hỗ trợ!",
      });
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

export const updateAvatar = async (req, res) => {
  try {
    const userID = req.user.id;

    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã bị khóa, hãy liên hệ tổng đài để hỗ trợ!",
      });
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

        return res.status(200).json({
          success: true,
          message: "Tải ảnh đại diện thành công",
          account: {
            avatar: user.avatar,
          },
        });
      } catch (error) {
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

    if (user.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Tài khoản đã bị khóa, hãy liên hệ tổng đài để hỗ trợ!",
      });
    }

    user.username = username || user.username;
    user.phone = phone || user.phone;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      account: {
        name: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

export const getPublicParentCategories = async (req, res) => {
  try {
    const parentCategories = await Category.find({
      parent: null,
      status: 'active'
    }).select('_id name slug image isFeatured').lean();

    const categoriesWithSubCount = await Promise.all(
      parentCategories.map(async (category) => {
        const subCategoryCount = await Category.countDocuments({
          parent: category._id,
          status: 'active'
        });

        return {
          ...category,
          subCategoryCount,
          hasSubCategories: subCategoryCount > 0
        };
      })
    );

    const sortedCategories = categoriesWithSubCount.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });

    return res.status(200).json({
      success: true,
      categories: sortedCategories
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục cha:", error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!"
    });
  }
};