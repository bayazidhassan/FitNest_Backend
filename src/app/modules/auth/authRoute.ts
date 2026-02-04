import express from 'express';
import { authController } from './authController';

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/refresh_token', authController.refreshAccessToken);
router.post('/logout', authController.logout);
router.post('/google', authController.googleLogin);

export const authRoutes = router;
