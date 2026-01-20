import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import { productService } from './products_service';

const createNewProduct = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[];
  const imageBuffers = files?.map((file) => file.buffer);

  const result = await productService.createNewProductIntoDB(req.body, imageBuffers);
  res.status(200).json({
    success: true,
    message: 'New product created successfully!',
    data: result,
  });
});

const getAllProducts: RequestHandler = async (req, res) => {
  try {
    const result = await productService.getAllProductsFromDB();
    res.status(200).json({
      success: true,
      message: 'Products are retrieved successfully.',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieved products!',
      error: (err as Error).message,
    });
  }
};

const getAProducts: RequestHandler = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productService.getAProductsFromDB(id);
    res.status(200).json({
      success: true,
      message: 'Product is retrieved successfully.',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieved product!',
      error: (err as Error).message,
    });
  }
};

const getProductsBySearch = catchAsync(async (req, res) => {
  const searchText = req.query.searchText as string;
  const result = await productService.getProductsBySearchFromDB(searchText);

  res.status(200).json({
    success: true,
    message: 'Searched products are retrieved successfully.',
    data: result,
  });
});

const getFeaturedProducts: RequestHandler = async (req, res) => {
  try {
    const result = await productService.getFeaturedProductsFromDB();
    res.status(200).json({
      success: true,
      message: 'Featured products are retrieved successfully.',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieved featured products!',
      error: (err as Error).message,
    });
  }
};

const getAllCategories: RequestHandler = async (req, res) => {
  try {
    const result = await productService.getAllCategoriesFromDB();
    res.status(200).json({
      success: true,
      message: 'Categories are retrieved successfully.',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieved categories!',
      error: (err as Error).message,
    });
  }
};

export const updateAProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  const removedImages = req.body.removedImages ? req.body.removedImages : [];

  const result = await productService.updateAProductIntoDB(id, req.body, files, removedImages);
  res.status(200).json({
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

const deleteAProduct = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await productService.deleteAProductFromDB(id);
  res.status(200).json({
    success: true,
    message: 'Product is deleted successfully!',
    data: result,
  });
});

export const productController = {
  getAllProducts,
  getAProducts,
  getProductsBySearch,
  getFeaturedProducts,
  getAllCategories,
  createNewProduct,
  updateAProduct,
  deleteAProduct,
};
