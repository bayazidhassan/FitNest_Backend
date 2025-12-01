import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const uploadImageToCloudinary = async (imageTitle: string, buffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: imageTitle },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      },
    );

    uploadStream.end(buffer);
  });
};

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export default uploadImageToCloudinary;
