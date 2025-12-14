import express from 'express';
import { upload } from '../../utils/uploadImageToCloudinary';
import { productController } from './products_controller';
const router = express.Router();

router.post('/createNewProduct', upload.single('image'), productController.createNewProduct);

router.get('/', productController.getAllProducts);
router.get('/featuredProducts', productController.getFeaturedProducts);
router.get('/categories', productController.getAllCategories);
router.get('/:id', productController.getAProducts);

export const productRoutes = router;
