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

export const productService = {
  createNewProductIntoDB,
  getAllProductsFromDB,
  getAProductsFromDB,
};
