import { cloudinary } from "../config/cloudinary.js";
import Category from "../models/categoryModel.js";
import Product from "../models/ProductModel.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      parentCategory,
      category,
      attributes,
      variations,
    } = req.body;

    if (!name || !parentCategory || !category) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp tên sản phẩm, danh mục cha và danh mục con",
      });
    }

    const parentCat = await Category.findById(parentCategory);
    if (!parentCat) {
      return res.status(404).json({
        success: false,
        message: "Danh mục cha không tồn tại",
      });
    }

    const subCat = await Category.findOne({
      _id: category,
      parent: parentCategory,
    });
    if (!subCat) {
      return res.status(404).json({
        success: false,
        message:
          "Danh mục con không tồn tại hoặc không thuộc danh mục cha đã chọn",
      });
    }
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm với tên này đã tồn tại",
      });
    }
    let parsedAttributes = [];
    let parsedVariations = [];

    try {
      if (attributes) {
        parsedAttributes = JSON.parse(attributes);
      }
      if (variations) {
        parsedVariations = JSON.parse(variations);
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Định dạng thuộc tính hoặc biến thể không hợp lệ",
      });
    }

    if (!parsedVariations || parsedVariations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm phải có ít nhất một biến thể",
      });
    }

    for (const variant of parsedVariations) {
      if (!variant.price || variant.price < 0) {
        return res.status(400).json({
          success: false,
          message: "Giá của biến thể phải là số dương",
        });
      }
      if (variant.stock === undefined || variant.stock < 0) {
        return res.status(400).json({
          success: false,
          message: "Số lượng tồn kho của biến thể phải là số không âm",
        });
      }
    }

    // Tạo sản phẩm mới
    const product = new Product({
      name,
      description: description || "",
      parentCategory,
      category,
      images: req.files ? req.files.map((file) => file.path) : [],
      attributes: parsedAttributes,
      variations: parsedVariations,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      data: {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        parentCategory: {
          _id: parentCat._id,
          name: parentCat.name,
          slug: parentCat.slug,
        },
        category: {
          _id: subCat._id,
          name: subCat.name,
          slug: subCat.slug,
        },
        images: product.images,
        variations: product.variations,
      },
    });
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm:", error.message);
    if (req.files && req.files.length > 0) {
      try {
        await Promise.all(
          req.files.map(async (file) => {
            const publicId = file.path
              .split("/")
              .slice(-2)
              .join("/")
              .split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          })
        );
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
