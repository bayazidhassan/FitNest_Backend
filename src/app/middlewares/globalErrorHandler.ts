import { NextFunction, Request, Response } from 'express';
import config from '../config';
import AppError from '../error/AppError';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //set default values
  let statusCode: number = 500;
  let message: string = 'Something went wrong!';

  if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
  } else if (err instanceof Error) {
    message = err?.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: config.node_env === 'development' ? err.stack : undefined,
  });
};
