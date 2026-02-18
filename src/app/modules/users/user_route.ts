import express from 'express';
import { upload } from '../../utils/uploadImageToCloudinary';
import { userController } from './user_controller';
const router = express.Router();

router.post('/registration', upload.single('image'), userController.registerUser);
router.get('/totalUser', userController.totalUser);
router.get('/verify_email/:token', userController.verifyEmail);

export const userRoutes = router;
