import { RequestHandler } from 'express';
import { userServices } from './user_service';

const registerUser: RequestHandler = async (req, res) => {
  try {
    const user = req.body;
    const result = await userServices.registerUserIntoDB(user);
    res.status(200).json({
      success: true,
      message: 'Registration is successful.',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to register!',
      error: (err as Error).message,
    });
  }
};

export const userController = {
  registerUser,
};
