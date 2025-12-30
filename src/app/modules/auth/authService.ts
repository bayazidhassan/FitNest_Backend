import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../error/AppError';
import { createAccessToken, createRefreshToken } from '../../utils/jwt';
import { User } from '../users/user_model';
import { TLoginInfo } from './authInterface';

const loginUserIntoDB = async (payload: TLoginInfo) => {
  const { email, password } = payload;

  //is user exists or not
  const isUserExists = await User.findOne({ email }).select('+password');
  if (!isUserExists) {
    throw new Error('User is not found.');
  }

  const isPasswordMatched = await bcrypt.compare(password, isUserExists.password);
  if (!isPasswordMatched) {
    throw new Error('Password does not match.');
  }

  //for access token
  const token = createAccessToken({ email: isUserExists.email, role: isUserExists.role });
  //for refresh token
  const refreshToken = createRefreshToken({ email: isUserExists.email, role: isUserExists.role });

  //Save refresh token in DB
  isUserExists.refreshToken!.push(refreshToken);
  await isUserExists.save();

  return { token, refreshToken, isUserExists };
};

const refreshTokenIntoDB = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret!) as JwtPayload;

  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    throw new AppError(401, 'User is not found.');
  }

  const token = createAccessToken({ email: user.email, role: user.role });
  return {token};
};

export const authServices = {
  loginUserIntoDB,
  refreshTokenIntoDB,
};
