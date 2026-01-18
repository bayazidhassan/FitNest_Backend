import express from 'express';
import { ROLES } from '../../@types/role';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { upload } from '../../utils/uploadImageToCloudinary';
import { productController } from './products_controller';
const router = express.Router();

router.post(
  '/createNewProduct',
  authenticate,
  authorize(ROLES.ADMIN),
  upload.array('images', 5),
  productController.createNewProduct,
);

router.get('/', productController.getAllProducts);
router.get('/featuredProducts', productController.getFeaturedProducts);
router.get('/categories', productController.getAllCategories);
router.get('/:id', productController.getAProducts);

router.patch(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  upload.array('images', 5),
  productController.updateAProduct,
);

router.delete('/:id', authenticate, authorize(ROLES.ADMIN), productController.deleteAProduct);

export const productRoutes = router;
