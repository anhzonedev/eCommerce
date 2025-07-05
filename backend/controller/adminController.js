import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import { cloudinary } from "../config/cloudinary.js";
import Banner from "../models/bannerModel.js";
import Category from "../models/categoryModel.js";
import { addProduct } from "./productController.js";

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

export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      isBlocked = "",
    } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isBlocked) {
      query.isBlocked = isBlocked === "true";
    }

    const users = await User.find(query)
      .select("-password -otp -otpExpiry -emailVerified -pendingEmail")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(query);

    return res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count,
    });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await User.findById(userID).select(
      "-password -otp -otpExpiry -emailVerified -pendingEmail"
    );
    if (!user) {
      return res.json({
        success: false,
        message: "Không tìm thấy người dùng!",
      });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action } = req.body;

    if (!["block", "unblock"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Hành động không hợp lệ. Vui lòng chọn 'block' hoặc 'unblock'",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    user.isBlocked = action === "block";
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Tài khoản đã  ${action === "block" ? "khóa" : "mở khóa"}`,
      data: {
        userId: user._id,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Không được phép xóa tài khoản quản trị viên",
      });
    }

    if (user.avatar) {
      try {
        const publicId = user.avatar
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Lỗi khi xóa ảnh từ Cloudinary:", error.message);
      }
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Xóa tài khoản thành công",
      data: {
        userId: user._id,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const addBanner = async (req, res) => {
  try {
    const { title, subTitle, description } = req.body;
    const image = req.file ? req.file.path : null;
    if (!title || !subTitle || !description || !image) {
      return res.json({
        success: false,
        message:
          "Vui lòng cung cấp đầy đủ tiêu đề, tiêu đề phụ, mô tả và hình ảnh",
      });
    }
    const banner = new Banner({
      title,
      subTitle,
      description,
      image,
    });

    await banner.save();

    return res.json({
      success: true,
      message: "Thêm banner thành công",
      data: {
        bannerId: banner._id,
        title: banner.title,
        subTitle: banner.subTitle,
        description: banner.description,
        image: banner.image,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const dateQuery = {};

    if (startDate || endDate) {
      dateQuery.createdAt = {};

      if (startDate) {
        dateQuery.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        dateQuery.createdAt.$lte = new Date(endDate);
      }
    }

    const banners = await Banner.find(dateQuery)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Banner.countDocuments(dateQuery);

    return res.status(200).json({
      success: true,
      banners,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalBanners: count,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;

    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy",
      });
    }

    if (banner.image) {
      try {
        const publicId = banner.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Lỗi khi xóa ảnh từ Cloudinary:", error.message);
      }
    }

    await Banner.findByIdAndDelete(bannerId);

    return res.status(200).json({
      success: true,
      message: "Xóa banner thành công",
      data: {
        bannerId: banner._id,
      },
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const addParentCategory = async (req, res) => {
  try {
    const { name, description, isFeatured, status } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục là bắt buộc",
      });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Danh mục đã tồn tại",
      });
    }

    const category = new Category({
      name,
      description: description || "",
      image,
      isFeatured: isFeatured === "true",
      status: status || "active",
      createdBy: req.user._id,
      parent: null,
    });

    await category.save();

    return res.status(201).json({
      success: true,
      message: "Thêm danh mục cha thành công",
      data: {
        categoryId: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        isFeatured: category.isFeatured,
        status: category.status,
        createdAt: category.createdAt,
      },
    });
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error.message);
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename);
      } catch (cleanupError) {
        console.error("Lỗi khi xóa ảnh từ Cloudinary:", cleanupError.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const addSubCategory = async (req, res) => {
  try {
    const { name, description, status, parentId } = req.body;

    if (!name || !parentId) {
      return res.status(400).json({
        success: false,
        message: "Tên danh mục và danh mục cha là bắt buộc",
      });
    }

    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục cha",
      });
    }

    const existingCategory = await Category.findOne({ name, parent: parentId });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Danh mục con đã tồn tại trong danh mục cha này",
      });
    }

    const category = new Category({
      name,
      description: description || "",
      status: status || "active",
      createdBy: req.user._id,
      parent: parentId,
    });

    await category.save();

    return res.status(201).json({
      success: true,
      message: "Thêm danh mục con thành công",
      data: {
        categoryId: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        status: category.status,
        parent: {
          _id: parentCategory._id,
          name: parentCategory.name,
          slug: parentCategory.slug,
        },
        createdAt: category.createdAt,
      },
    });
  } catch (error) {
    console.error("Lỗi khi thêm danh mục con:", error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      isFeatured = "",
      parent = "null", // Mặc định là "null" thay vì undefined
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (isFeatured) {
      query.isFeatured = isFeatured === "true";
    }

    // Xử lý parent query
    if (parent === "null") {
      query.parent = null;
    } else if (parent && parent !== "undefined") {
      query.parent = mongoose.Types.ObjectId(parent);
    }

    const categories = await Category.find(query)
      .populate("parent", "name slug")
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        if (!cat.parent) {
          const subCategoryCount = await Category.countDocuments({
            parent: cat._id,
          });
          return { ...cat.toObject(), subCategoryCount };
        }
        return cat.toObject();
      })
    );

    const count = await Category.countDocuments(query);

    return res.status(200).json({
      success: true,
      categories: categoriesWithCount,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCategories: count,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục:", error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const getSubCategoriesByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { search = "", status = "" } = req.query;

    const query = { parent: parentId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const subCategories = await Category.find(query)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      subCategories,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục con:", error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }
    if (!category.parent) {
      const subCategoriesCount = await Category.countDocuments({
        parent: categoryId,
      });

      if (subCategoriesCount > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Không thể xóa danh mục cha khi còn danh mục con. Vui lòng xóa hoặc di chuyển các danh mục con trước.",
        });
      }
    }

    // 3. Kiểm tra xem danh mục có được sử dụng trong sản phẩm không
    // (Giả sử có model Product với trường category)
    // const productsCount = await Product.countDocuments({
    //   category: categoryId
    // });
    // if (productsCount > 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Không thể xóa danh mục đang được sử dụng bởi sản phẩm",
    //   });
    // }

    if (category.image) {
      try {
        const publicId = category.image
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Lỗi khi xóa ảnh từ Cloudinary:", error.message);
      }
    }

    await Category.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Xóa danh mục thành công",
      data: {
        categoryId: category._id,
        name: category.name,
      },
    });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error.message);
    return res.status(500).json({
      success: false,
      message: "Có lỗi máy chủ. Vui lòng thử lại!",
    });
  }
};

export const addProductAdmin = addProduct;
