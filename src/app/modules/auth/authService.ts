import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../error/AppError';
import { createAccessToken, createRefreshToken } from '../../utils/jwt';
import { User } from '../users/user_model';
import { TLoginInfo } from './authInterface';

const client = new OAuth2Client(config.google_client_id);

const loginUserIntoDB = async (payload: TLoginInfo) => {
  const { email, password } = payload;

  //is user exists or not
  const isUserExists = await User.findOne({ email }).select('+password');
  if (!isUserExists) {
    throw new Error('Invalid Email or Password!');
  }
  //check email is verified or not
  if (!isUserExists.isVerified) {
    throw new AppError(403, 'Please verify your email first.');
  }

  const isPasswordMatched = await bcrypt.compare(password, isUserExists.password);
  if (!isPasswordMatched) {
    throw new Error('Invalid Email or Password!');
  }

  //generate JWT tokens
  const accessToken = createAccessToken({ email: isUserExists.email, role: isUserExists.role });
  const refreshToken = createRefreshToken({ email: isUserExists.email, role: isUserExists.role });

  //save refresh token in DB
  isUserExists.refreshTokens?.push(refreshToken);
  await isUserExists.save();

  return { accessToken, refreshToken, isUserExists };
};

const refreshAccessTokenIntoDB = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, config.jwt_refresh_secret as string) as JwtPayload;

  const user = await User.findOne({ email: decoded.email, refreshTokens: refreshToken });
  if (!user) {
    throw new AppError(401, 'Refresh token not found.');
  }

  const token = createAccessToken({ email: user.email, role: user.role });
  return { token };
};

const logoutIntoDB = async (refreshToken: string): Promise<void> => {
  //remove refreshToken from DB
  await User.updateOne({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } });
};

const googleLogin = async (token: string) => {
  //verify token with Google
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.google_client_id,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid Google token.');
  }
  const { email, name, picture } = payload;
  const [firstName, ...lastName] = (name || '').split(' ');

  //check if user exists
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: {
        firstName: firstName || '',
        lastName: lastName.join(' ') || '',
      },
      email,
      role: 'user',
      image: picture,
      isVerified: true,
    });
  }

  //generate JWT tokens
  const accessToken = createAccessToken({ email: user.email, role: user.role });
  const refreshToken = createRefreshToken({ email: user.email, role: user.role });

  //save refresh token
  user.refreshTokens?.push(refreshToken);
  await user.save();

  return { accessToken, refreshToken, user };
};

export const authServices = {
  loginUserIntoDB,
  refreshAccessTokenIntoDB,
  logoutIntoDB,
  googleLogin,
};
