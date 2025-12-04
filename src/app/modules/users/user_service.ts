import config from '../../config';
import uploadImageToCloudinary from '../../utils/uploadImageToCloudinary';
import { TUser } from './user_interface';
import { User } from './user_model';

const registerUserIntoDB = async (payload: TUser, buffer?: Buffer) => {
  let imageUrl: string | undefined;

  if (buffer) {
    imageUrl = await uploadImageToCloudinary(payload.email, buffer);
  }

  if (payload.email === config.admin_email) {
    payload.role = 'admin';
  }

  const newUser = { ...payload, image: imageUrl };

  const result = await User.create(newUser);
  if (!result) {
    throw new Error('Failed to register.');
  }
  return result;
};

export const userServices = {
  registerUserIntoDB,
};
