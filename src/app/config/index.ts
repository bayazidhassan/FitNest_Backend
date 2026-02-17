import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  client_url: process.env.CLIENT_URL,
  server_url: process.env.SERVER_URL,
  admin_email: process.env.Admin_Email,
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  bcrypt_salt: process.env.BCRYPT_SALT,
  cloudinary_cloud_name: process.env.Cloudinary_Cloud_Name,
  cloudinary_api_key: process.env.Cloudinary_Api_Key,
  cloudinary_api_secret: process.env.Cloudinary_Api_Secret,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_app_email: process.env.APP_EMAIL,
  google_app_password: process.env.APP_PASSWORD,
  jwt_email_secret: process.env.JWT_EMAIL_SECRET,
};
