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

const totalUser = catchAsync(async (req, res) => {
  const result = await userServices.totalUserFromDB();

  res.status(200).json({
    success: true,
    message: 'Total user count successfully.',
    data: result,
  });
});

export const userController = {
  registerUser,
  verifyEmail,
  totalUser,
};
