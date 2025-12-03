import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../config';
import { TUser, TUserName } from './user_interface';

const userNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
    },
  },
  {
    _id: false,
  },
);

const userSchema = new Schema<TUser>(
  {
    name: {
      type: userNameSchema,
      required: [true, 'Name is required.'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone no. is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
    },
    image: {
      type: String,
      //required: [true, 'Image is required.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const hashed = await bcrypt.hash(this.password, Number(config.bcrypt_salt));
  this.password = hashed;
});

export const User = model<TUser>('User', userSchema);
