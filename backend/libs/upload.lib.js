import multer from "multer";
import { uploadImage } from "./cloudinary.lib.js";

// Multer config for memory storage (for cloudinary)
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  }
});

// Multer config for local disk storage (optional, if needed)
import path from "path";
import fs from "fs";
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
export const localUpload = multer({ storage: diskStorage });

// Cloudinary upload handler
export const uploadFile = (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "File upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    try {
      // Upload to Cloudinary using buffer
      const result = await uploadImage(req.file.buffer);
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ error: "Image upload to Cloudinary failed" });
    }
  });
};

// Local upload handler (optional, if you want to support local uploads)
export const uploadFileLocal = (req, res) => {
  localUpload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "File upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    // Return local file path
    res.status(200).json({ path: req.file.path });
  });
};

export default uploadFile;
