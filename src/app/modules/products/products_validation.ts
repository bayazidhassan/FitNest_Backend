import * as z from 'zod/v4';

const createNewProductValidation = z.object({
  name: z.string({
    error: (ctx) =>
      ctx.input === undefined ? 'Product name is required.' : 'Product name must be a string.',
  }),
  price: z.number({
    error: (ctx) => (ctx.input === undefined ? 'Price is required.' : 'Price must be a number.'),
  }),
  description: z.string({
    error: (ctx) =>
      ctx.input === undefined ? 'Description is required.' : 'Description must be a string.',
  }),
  category: z.string({
    error: (ctx) =>
      ctx.input === undefined ? 'Category is required.' : 'Category must be a string.',
  }),
  stock_quantity: z.number({
    error: (ctx) =>
      ctx.input === undefined ? 'Stock quantity is required.' : 'Stock quantity must be a number.',
  }),
  images: z
    .array(
      z.string({
        error: (ctx) =>
          ctx.input === undefined ? 'Images are required.' : 'Images must be valid string.',
      }),
    )
    .nonempty('At least one image is required.'),
});


export const productValidation = {
  createNewProductValidation,
};
