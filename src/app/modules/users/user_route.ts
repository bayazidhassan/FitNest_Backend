import express from 'express';
import { userController } from './user_controller';
const router = express.Router();

router.post('/register', userController.registerUser);

export const userRoutes = router;
