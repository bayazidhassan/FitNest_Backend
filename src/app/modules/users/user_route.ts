import express from 'express';
import { userController } from './user_controller';
import { upload } from '../../utils/uploadImageToCloudinary';
const router = express.Router();

router.post('/registration', upload.single('image'), userController.registerUser);

export const userRoutes = router;
