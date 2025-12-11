import { Schema, model } from 'mongoose';
import { TCartItems, TOrder } from './order_interface';

const cartItemSchema = new Schema<TCartItems>(
  {
    image: { type: String, required: [true, 'Image is required.'] },
    name: { type: String, required: [true, 'Product name is required.'] },
    price: { type: Number, required: [true, 'Price is required.'] },
    product_id: { type: String, required: [true, 'Product ID is required.'] },
    quantity: { type: Number, required: [true, 'Quantity is required.'] },
    stock_quantity: { type: Number, required: [true, 'Stock quantity is required.'] },
  },
  { _id: false },
);

const orderSchema = new Schema<TOrder>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
    },
    street_address: {
      type: String,
      required: [true, 'Street address is required.'],
    },
    upazila: {
      type: String,
      required: [true, 'Upazila is required.'],
    },
    district: {
      type: String,
      required: [true, 'District is required.'],
    },
    comment: {
      type: String,
    },
    cartItems: {
      type: [cartItemSchema],
      required: [true, 'At least one cart item is required.'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required.'],
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model<TOrder>('Order', orderSchema);
