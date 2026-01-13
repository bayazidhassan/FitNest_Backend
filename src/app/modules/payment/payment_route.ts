import express from 'express';
import { paymentController } from './payment_controller';

const router = express.Router();

router.post('/create_checkout_session', paymentController.createCheckoutSession);
router.get('/getOrderId_BySession/:sessionId', paymentController.getOrderIdByStripeSession);

export const paymentRoutes = router;
