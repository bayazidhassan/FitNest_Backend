import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFoundRoute from './app/middlewares/notFoundRoute';
import router from './app/routes';

const app = express();

app.use(
  cors({ origin: ['https://fitnestbd.netlify.app', 'http://localhost:5173'], credentials: true }),
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('FitNest server is running!');
});

app.use(notFoundRoute);
app.use(globalErrorHandler);

export default app;
