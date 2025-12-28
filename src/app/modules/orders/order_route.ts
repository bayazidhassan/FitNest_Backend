import express from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { orderController } from './order_controller';

const router = express.Router();

router.post('/placeOrder', orderController.placeOrder);
router.get(
  '/byStatus/:status',
  authenticate,
  authorize('admin'),
  orderController.getOrdersByStatus,
);
router.patch(
  '/updateStatus/:id',
  authenticate,
  authorize('admin'),
  orderController.updateOrderStatus,
);

export const orderRoutes = router;
