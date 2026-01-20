import uploadImageToCloudinary from '../../utils/uploadImageToCloudinary';
import { TProduct } from './products_interface';
import { Product } from './products_model';

const createNewProductIntoDB = async (
  payload: Omit<TProduct, 'images' | 'isDeleted'>,
  buffers?: Buffer[],
) => {
  let imageUrls: string[] = [];

  if (buffers && buffers.length > 0) {
    imageUrls = await Promise.all(
      buffers.map((buffer, index) =>
        uploadImageToCloudinary(`${payload.name}-${index + 1}`, buffer),
      ),
    );
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

const getProductsBySearchFromDB = async (searchText: string) => {
  const result = await Product.find({
    $or: [
      { name: { $regex: searchText, $options: 'i' } },
      { category: { $regex: searchText, $options: 'i' } },
    ],
  });
  // if (!result.length) {
  //   throw new Error('Products are not found.');
  // }
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

const updateAProductIntoDB = async (
  id: string,
  payload: Partial<Omit<TProduct, 'images' | 'isDeleted'>>,
  files?: Express.Multer.File[],
  removedImages: string[] = [],
) => {
  const product = await Product.findById(id);
  if (!product) throw new Error('Product not found');

  // Remove images
  if (removedImages.length) {
    product.images = product.images.filter((img) => !removedImages.includes(img));
  }

  //Add new images
  if (files && files.length > 0) {
    const startIndex = product.images.length + 1;
    const newImageUrls = await Promise.all(
      files.map((file, index) => {
        const name = payload.name ?? product.name; // fallback to existing name
        const category = payload.category ?? product.category; // fallback to existing category
        return uploadImageToCloudinary(`${name}-${category}-${startIndex + index}`, file.buffer);
      }),
    );

    product.images.push(...newImageUrls);
  }

  // Update other fields
  const { name, price, category, stock_quantity, description } = payload;
  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;
  if (stock_quantity !== undefined) product.stock_quantity = stock_quantity;
  if (description !== undefined) product.description = description;

  const updatedProduct = await product.save();
  return updatedProduct;
};

const deleteAProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  if (!result) {
    throw new Error('Failed to delete');
  }
  return result;
};

export const productService = {
  getAllProductsFromDB,
  getAProductsFromDB,
  getProductsBySearchFromDB,
  getFeaturedProductsFromDB,
  getAllCategoriesFromDB,
  createNewProductIntoDB,
  updateAProductIntoDB,
  deleteAProductFromDB,
};
