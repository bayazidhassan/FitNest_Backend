import cors from 'cors';
import express from 'express';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFoundRoute from './app/middlewares/notFoundRoute';
import router from './app/routes';

const app = express();

app.use(express.json());
app.use(cors({ origin: ['https://fitnestbd.netlify.app', 'http://localhost:5173'] }));
//credentials: true -> allows browser to send cookies

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('FitNest server is running!');
});

app.use(notFoundRoute);
app.use(globalErrorHandler);

export default app;
