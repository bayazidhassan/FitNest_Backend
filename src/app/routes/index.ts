import express from 'express';
import { productRoutes } from '../modules/products/products_routes';
import { userRoutes } from '../modules/users/user_route';

const router = express.Router();

router.use('/products', productRoutes);
router.use('/user', userRoutes);

export default router;
