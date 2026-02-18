import { RequestHandler } from 'express';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { authServices } from './authService';

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await authServices.loginUserIntoDB(req.body);
    const { accessToken, refreshToken, isUserExists: user } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.node_env === 'production',
      sameSite: config.node_env === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token: accessToken,
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

const refreshAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token.' });
  }
  const result = await authServices.refreshAccessTokenIntoDB(refreshToken);
  res.status(200).json({
    success: true,
    message: 'Access token is retrieved successfully.',
    data: result,
  });
});

const logout: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    //fire-and-forget (no await)
    authServices.logoutIntoDB(refreshToken).catch(() => {});
  }
  //clear cookie immediately
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.node_env === 'production',
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
  });
  return res.status(204).end();
};

const googleLogin: RequestHandler = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new Error('Google token is required.');
    }

    const { accessToken, refreshToken, user } = await authServices.googleLogin(token);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.node_env === 'production',
      sameSite: config.node_env === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Logged in with Google successfully.',
      data: { token: accessToken, user },
    });
  } catch (err) {
    next(err);
  }
};

export const authController = {
  loginUser,
  refreshAccessToken,
  logout,
  googleLogin,
};
