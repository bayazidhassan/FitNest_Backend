import express from 'express';
import { ROLES } from '../../@types/role';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { orderController } from './order_controller';

const router = express.Router();

router.post('/placeOrder', authenticate, authorize(ROLES.USER), orderController.placeOrder);
router.get(
  '/byStatus/:status',
  authenticate,
  authorize(ROLES.ADMIN),
  orderController.getOrdersByStatus,
);
router.patch(
  '/updateStatus/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  orderController.updateOrderStatus,
);

export const orderRoutes = router;
