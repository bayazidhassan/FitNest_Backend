import uploadImageToCloudinary from '../../utils/uploadImageToCloudinary';
import { TProduct } from './products_interface';
import { Product } from './products_model';

const createNewProductIntoDB = async (
  payload: Omit<TProduct, 'images | isDeleted'>,
  buffer?: Buffer,
) => {
  let imageUrls: string[] = [];

  if (buffer) {
    const imageUrl = await uploadImageToCloudinary(`${payload.name}-${payload.category}`, buffer);
    imageUrls.push(imageUrl);
  }

  const newProduct = {
    ...payload,
    images: imageUrls,
  };

  const result = await Product.create(newProduct);
  if (!result) {
    throw new Error('Failed to create new product.');
  }
  return result;
};

const getAllProductsFromDB = async () => {
  const result = await Product.find();
  if (!result.length) {
    throw new Error('Products are not found.');
  }
  return result;
};

const getAProductsFromDB = async (id: string) => {
  const result = await Product.findById(id);
  if (!result) {
    throw new Error('Product is not found.');
  }
  return result;
};

const getFeaturedProductsFromDB = async () => {
  const result = await Product.find().limit(4);
  if (!result.length) {
    throw new Error('Featured products are not found.');
  }
  return result;
};

const getAllCategoriesFromDB = async () => {
  /*
  const result = await Product.distinct('category');
  if (!result.length) {
    throw new Error('No categories found.');
  }
  return result.sort();
  */

  const categories = await Product.aggregate([
    {
      $group: {
        _id: '$category', // distinct category
        image: { $first: '$images' }, // take first product's image
      },
    },
    { $sort: { _id: 1 } },
  ]);

  if (!categories.length) throw new Error('No categories found.');

  // map to a nicer format
  return categories.map((c) => ({
    category: c._id,
    image: c.image?.[0] || null,
  }));
};

const updateAProductIntoDB = async (id: string, payload: Omit<TProduct, 'images'>) => {
  const result = await Product.findByIdAndUpdate(id, payload, { upsert: true });
  if (!result) {
    throw new Error('Failed to update product!');
  }
  return result;
};

export const productService = {
  getAllProductsFromDB,
  getAProductsFromDB,
  getFeaturedProductsFromDB,
  getAllCategoriesFromDB,
  createNewProductIntoDB,
  updateAProductIntoDB,
};
