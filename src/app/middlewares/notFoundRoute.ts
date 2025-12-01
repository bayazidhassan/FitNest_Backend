import { RequestHandler } from 'express';

const notFoundRoute: RequestHandler = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
export default notFoundRoute;
