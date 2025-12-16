import express from 'express';
import { upload } from '../../utils/uploadImageToCloudinary';
import { productController } from './products_controller';
const router = express.Router();

//router.post('/createNewProduct', upload.single('image'), productController.createNewProduct);
router.post('/createNewProduct', upload.array('images',5), productController.createNewProduct);

router.get('/', productController.getAllProducts);
router.get('/featuredProducts', productController.getFeaturedProducts);
router.get('/categories', productController.getAllCategories);
router.get('/:id', productController.getAProducts);

router.patch('/:id', productController.updateAProduct);

export const productRoutes = router;
