import bcrypt from 'bcrypt';
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

  return isUserExists;
};

export const authServices = {
  loginUserIntoDB,
};
