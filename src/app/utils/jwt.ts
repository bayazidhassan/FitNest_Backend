import jwt from 'jsonwebtoken';
import config from '../config';

export const createAccessToken = (payload: object) => {
  return jwt.sign(payload, config.jwt_secret!, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (payload: object) => {
  return jwt.sign(payload, config.jwt_refresh_secret!, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt_secret!);
};
