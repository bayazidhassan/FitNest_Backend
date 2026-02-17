import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { TRole } from '../../@types/role';
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

const role: TRole[] = ['admin', 'user'];

const userSchema = new Schema<TUser>(
  {
    name: {
      type: userNameSchema,
      required: [true, 'Name is required.'],
    },
    phone: {
      type: String,
      //required: [true, 'Phone no. is required.'], //for google login
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
      //required: [true, 'Password is required.'], //for google login
      select: false,
    },
    role: {
      type: String,
      //enum: ['admin', 'user'],
      enum: {
        values: role,
        message: 'Role must be user or admin',
      },
      default: 'user',
    },
    refreshTokens: {
      type: [String], //store multiple refresh tokens
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const hashed = await bcrypt.hash(this.password, Number(config.bcrypt_salt));
  this.password = hashed;
});

export const User = model<TUser>('User', userSchema);
