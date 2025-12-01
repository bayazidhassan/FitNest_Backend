import cors from 'cors';
import express from 'express';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';

const app = express();

app.use(express.json());
app.use(
  cors({ origin: ['https://fitnestbd.netlify.app', 'http://localhost:5173'], credentials: true }),
);

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('FitNest server is running!');
});

app.use(globalErrorHandler)

export default app;
