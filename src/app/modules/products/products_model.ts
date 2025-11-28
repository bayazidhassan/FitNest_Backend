import { model, Schema } from 'mongoose';
import { TProduct } from './products_interface';

const productSchema = new Schema<TProduct>({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required.'],
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
  },
  category: {
    type: String,
    required: [true, 'Category is required.'],
  },
  stock_quantity: {
    type: Number,
    required: [true, 'Quantity is required.'],
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required.'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

productSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

export const Product = model<TProduct>('Product', productSchema);
