import catchAsync from '../../utils/catchAsync';
import { userServices } from './user_service';

/*
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
*/

const registerUser = catchAsync(async (req, res) => {
  const { firstName, lastName, confirmPassword, ...rest } = req.body;
  const user = {
    name: {
      firstName,
      lastName,
    },
    ...rest,
  };
  const result = await userServices.registerUserIntoDB(user, req.file?.buffer);
  res.status(200).json({
    success: true,
    message: 'Registration is successful.',
    data: result,
  });
});

export const userController = {
  registerUser,
};
