import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../error/AppError';
import { sendToEmail } from '../../utils/sendToEmail';
import uploadImageToCloudinary from '../../utils/uploadImageToCloudinary';
import { TUser } from './user_interface';
import { User } from './user_model';

const registerUserIntoDB = async (payload: TUser, buffer?: Buffer) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(400, 'User already exists!');
  }

  let imageUrl: string | undefined;
  if (buffer) {
    imageUrl = await uploadImageToCloudinary(payload.email, buffer);
  }
  if (payload.email === config.admin_email) {
    payload.role = 'admin';
  }
  const userInfo = { ...payload, image: imageUrl, isVerified: false };
  const user = await User.create(userInfo);
  if (!user) {
    throw new AppError(400, 'Failed to register!');
  }

  //create email verification token
  const emailToken = jwt.sign({ email: user.email }, config.jwt_email_secret as string, {
    expiresIn: '1h',
  });

  const verificationLink = `${config.server_url}/api/v1/user/verify_email/${emailToken}`;
  const subject = 'Verify Your Email.';
  const htmlMessage = `
      <h3>Welcome to FitNest</h3>
      <p>Please verify your email within 1 hour: <a href="${verificationLink}">Verify Email</a></p>
    `;

  //send to email
  await sendToEmail(user.email, subject, htmlMessage);

  return user;
};

const verifyEmail = async (token: string) => {
  const decoded = jwt.verify(token, config.jwt_email_secret as string) as JwtPayload;

  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new AppError(400, 'Invalid token.');
  }
  if (user.isVerified) {
    throw new AppError(400, 'Email already verified.');
  }

  user.isVerified = true;
  await user.save();

  return user;
};

export const userServices = {
  registerUserIntoDB,
  verifyEmail,
};
