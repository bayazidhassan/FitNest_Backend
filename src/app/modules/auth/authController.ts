import { RequestHandler } from 'express';
import { authServices } from './authService';

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await authServices.loginUserIntoDB(req.body);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const authController = {
  loginUser,
};
