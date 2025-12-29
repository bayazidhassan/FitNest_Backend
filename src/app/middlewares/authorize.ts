import { RequestHandler } from 'express';
import { TRole } from '../modules/users/user_interface';

export const authorize = (...roles: TRole[]): RequestHandler => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
