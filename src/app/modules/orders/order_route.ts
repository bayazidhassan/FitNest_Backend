import express from 'express';
import { orderController } from './order_controller';

const router = express.Router();

router.post('/placeOrder', orderController.placeOrder);
router.get('/byStatus/:status')

export const orderRoutes = router;
