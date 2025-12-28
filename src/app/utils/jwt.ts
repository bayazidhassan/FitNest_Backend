import jwt from 'jsonwebtoken';
import config from '../config';

const JWT_SECRET = config.jwt_secret as string;

export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
