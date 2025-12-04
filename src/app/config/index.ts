import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  admin_email: process.env.Admin_Email,
  bcrypt_salt: process.env.BCRYPT_SALT,
  cloudinary_cloud_name: process.env.Cloudinary_Cloud_Name,
  cloudinary_api_key: process.env.Cloudinary_Api_Key,
  cloudinary_api_secret: process.env.Cloudinary_Api_Secret,
};
