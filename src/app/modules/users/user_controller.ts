import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { userServices } from './user_service';

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

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify.',
    data: result,
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.params;

  const result = await userServices.verifyEmail(token);

  res.redirect(`${config.client_url}/login`);
});

export const userController = {
  registerUser,
  verifyEmail,
};
