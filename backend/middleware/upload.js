import { createStorage, multer } from "../config/cloudinary.js";

// Middleware upload 1 ảnh (dùng cho avatar người dùng)
const uploadSingleImage = (folder) => {
  const storage = createStorage(folder);
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Chỉ được phép upload file ảnh"), false);
      }
      cb(null, true);
    },
  }).single("image");

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Lỗi khi upload ảnh",
        });
      }
      next();
    });
  };
};

const uploadMultipleImages = (folder, maxCount = 10) => {
  const storage = createStorage(folder);
  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Chỉ được phép upload file ảnh"), false);
      }
      cb(null, true);
    },
  }).array("images", maxCount);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Lỗi khi upload ảnh",
        });
      }
      next();
    });
  };
};

export { uploadSingleImage, uploadMultipleImages };
