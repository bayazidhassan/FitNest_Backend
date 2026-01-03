import express from 'express';
import { paymentController } from './payment_controller';

const router = express.Router();

router.post('/create_checkout_session', paymentController.createCheckoutSession);

export const paymentRoutes = router;
