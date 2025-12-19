import express from 'express';
import { orderController } from './order_controller';

const router = express.Router();

router.post('/placeOrder', orderController.placeOrder);
router.get('/byStatus/:status', orderController.getOrdersByStatus);
router.patch('/updateStatus/:id', orderController.updateOrderStatus);

export const orderRoutes = router;
