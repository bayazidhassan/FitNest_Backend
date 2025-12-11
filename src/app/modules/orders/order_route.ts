import express from 'express';
import { orderController } from './order_controller';

const router = express.Router();

router.post('/placeOrder', orderController.placeOrder);

export const orderRoutes = router;
