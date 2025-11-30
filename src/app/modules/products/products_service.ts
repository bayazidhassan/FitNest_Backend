import { TProduct } from './products_interface';
import { Product } from './products_model';

const createNewProductIntoDB = async (payload: TProduct) => {
  const result = await Product.create(payload);
  if (!result) {
    throw new Error('Failed to create new product!');
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

export const productService = {
  createNewProductIntoDB,
  getAllProductsFromDB,
  getAProductsFromDB,
  getFeaturedProductsFromDB,
  getAllCategoriesFromDB,
};
