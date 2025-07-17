import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { uploadImage } from "./cloudinary.js";
const storage = multer.memoryStorage();
const upload = multer({ storage });


export const uploadFile = (req, res) => {
  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "File upload failed" });
    }
    try {
      const result = await uploadImage(req.file.buffer);
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      res.status(500).json({ error: "Image upload to Cloudinary failed" });
    }
  });
};
export default uploadFile;
