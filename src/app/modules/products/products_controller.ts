import { Request, RequestHandler, Response } from 'express';
import { productService } from './products_service';

const createNewProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    const result = await productService.createNewProductIntoDB(product);
    res.status(200).json({
      success: true,
      message: 'Product is created successfully.',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create new product!',
      error: (err as Error).message,
    });
  }
};

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

export const productController = {
  createNewProduct,
  getAllProducts,
  getAProducts,
  getFeaturedProducts,
  getAllCategories,
};
