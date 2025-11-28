import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { productController } from './products_controller';
import { productValidation } from './products_validation';
const router = express.Router();

router.post(
  '/createNewProduct',
  validateRequest(productValidation.createNewProductValidation),
  productController.createNewProduct,
);

router.get('/', productController.getAllProducts);
router.get('/featuredProducts', productController.getFeaturedProducts);
router.get('/:id', productController.getAProducts);


export const productRoutes = router;
