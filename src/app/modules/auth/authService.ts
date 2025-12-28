import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';
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

  //for jwt token
  const token = generateToken({ email: isUserExists.email, role: isUserExists.role });

  return { token, isUserExists };
};

export const authServices = {
  loginUserIntoDB,
};
