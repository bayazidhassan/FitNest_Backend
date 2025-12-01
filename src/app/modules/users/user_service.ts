import { TUser } from './user_interface';
import { User } from './user_model';

const registerUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  if (!result) {
    throw new Error('Failed to register.');
  }
  return result;
};

export const userServices = {
  registerUserIntoDB,
};
