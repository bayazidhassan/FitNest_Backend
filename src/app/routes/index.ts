import express from 'express';
import { productRoutes } from '../modules/products/products_routes';

const router = express.Router();

router.use('/products', productRoutes);

export default router;
