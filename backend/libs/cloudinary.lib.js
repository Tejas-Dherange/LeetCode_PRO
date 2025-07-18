import cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Accepts either a file path or a buffer
export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    // If file is a buffer, use upload_stream
    if (Buffer.isBuffer(file)) {
      const stream = cloudinaryV2.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file);
    } else {
      // If file is a path, use normal upload
      cloudinaryV2.uploader.upload(file, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    }
  });
};

