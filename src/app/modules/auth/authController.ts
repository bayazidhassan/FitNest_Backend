import { RequestHandler } from 'express';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { authServices } from './authService';

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await authServices.loginUserIntoDB(req.body);
    const { token, refreshToken, isUserExists: user } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.node_env === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token,
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies || {};
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token.' });
  }

  const token = await authServices.refreshTokenIntoDB(refreshToken);
  res.status(200).json({
    success: true,
    message: 'Access token is retrieved successfully.',
    data: { token },
  });
});

export const authController = {
  loginUser,
  refreshToken,
};
