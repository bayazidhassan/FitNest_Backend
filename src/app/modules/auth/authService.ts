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
  isUserExists.refreshTokens?.push(refreshToken);
  await isUserExists.save();

  return { token, refreshToken, isUserExists };
};

const refreshAccessTokenIntoDB = async (refreshToken: string) => {
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt_refresh_secret!) as JwtPayload;
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token.');
  }

  const user = await User.findOne({ email: decoded.email, refreshTokens: refreshToken });
  if (!user) {
    throw new AppError(401, 'Refresh token not found.');
  }

  const token = createAccessToken({ email: user.email, role: user.role });
  return { token };
};

const logoutIntoDB = async (refreshToken: string): Promise<void> => {
  //Remove refreshToken from DB
  const result = await User.updateOne(
    { refreshTokens: refreshToken },
    { $pull: { refreshTokens: refreshToken } },
  );
  if (result.modifiedCount === 0) {
    throw new AppError(401, 'Refresh token not found.');
  }
};

export const authServices = {
  loginUserIntoDB,
  refreshAccessTokenIntoDB,
  logoutIntoDB,
};
