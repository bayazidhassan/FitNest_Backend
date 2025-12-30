import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../modules/users/user_model';
import config from '../config';

export const authenticate: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt_secret!) as JwtPayload;
  } catch {
    return res.status(401).json({ message: 'Invalid token!' });
  }

  //check user exists / not blocked
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    return res.status(401).json({ message: 'User is not found.' });
  }

  req.user = decoded;
  next();
};
