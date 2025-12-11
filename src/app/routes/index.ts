import express from 'express';
import { authRoutes } from '../modules/auth/authRoute';
import { orderRoutes } from '../modules/orders/order_route';
import { productRoutes } from '../modules/products/products_routes';
import { userRoutes } from '../modules/users/user_route';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/order', orderRoutes);

export default router;
