import express from 'express';
import router from './app/routes';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('FitNest server is running!');
});

export default app;
