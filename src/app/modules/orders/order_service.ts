import mongoose from 'mongoose';
import { Product } from '../products/products_model';
import { TOrder, TStatus } from './order_interface';
import { Order } from './order_model';

const placeOrderIntoDB = async (payload: TOrder) => {
  const result = await Order.create(payload);

  if (!result) {
    throw new Error('Order is not placed');
  }
  return result;
};

const getOrdersByStatusFromDB = async (status: string) => {
  const result = await Order.find({ status });
  return result;
};

const updateOrderStatusIntoDB = async (id: string, status: TStatus) => {
  if (status === 'confirmed') {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      //find cart Items------------------------------------
      const order = await Order.findById(id).session(session);
      if (!order) {
        throw new Error('Order not found.');
      }
      if (order.status === 'confirmed') {
        throw new Error('Order already confirmed');
      }
      const cartItems = order.cartItems;
      if (cartItems.length === 0) {
        throw new Error('Order has no cart items');
      }

      //check quantity <= stock_quantity----------------------------
      //The bulkWrite-filter will check this condition in the next step, so this loop is technically redundant here.
      //Trade-off:
      //->Loop : slightly less performance, better error message (product name)
      //->No loop : fewer DB calls, maximum performance
      /*
      for (const item of cartItems) {
        const product = await Product.findById(item.product_id).session(session);
        if (!product) {
          throw new Error('Product not found');
        }
        if (item.quantity > product.stock_quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }
      */
      //Better performance-> Instead of looping findById for each product, fetch all products at once: Reduces N DB calls → 1 DB call, Only useful if cart can have many items
      const productIds = cartItems.map((i) => i.product_id);
      const products = await Product.find({ _id: { $in: productIds } }).session(session);
      cartItems.forEach((item) => {
        const product = products.find((p) => p._id.equals(item.product_id));
        if (!product) throw new Error('Product not found');
        if (item.quantity > product.stock_quantity)
          throw new Error(`Insufficient stock for ${product.name}`);
      });

      //all checks passed → now deduct stock----------------------------
      /*
      //not fully optimized
      for (const item of cartItems) {
        await Product.findByIdAndUpdate(
          item.product_id,
          {
            $inc: { stock_quantity: -item.quantity },
          },
          { session },
        );
      }
      */
      /*
      optimize: bulkWrite-> Instead of 10 update calls → 1 call with 10 updates at a time
      But here is a problem also. Right now:
      ->You read stock_quantity
      ->Then later update(deduct) stock_quantity
      ->Between those two steps, another transaction could reduce stock.
      const bulkOps = cartItems.map((item) => ({
        updateOne: {
          filter: { _id: item.product_id },
          update: { $inc: { stock_quantity: -item.quantity } },
        },
      }));
      await Product.bulkWrite(bulkOps, { session });
      */
      //final version -> add checking stock_quantity inside bulkWrite filter, this makes your system race-condition safe.
      const bulkOps = cartItems.map((item) => ({
        updateOne: {
          filter: {
            _id: item.product_id,
            stock_quantity: { $gte: item.quantity },
          },
          update: { $inc: { stock_quantity: -item.quantity } },
        },
      }));
      const bulkResult = await Product.bulkWrite(bulkOps, { session });
      if (bulkResult.modifiedCount !== cartItems.length) {
        throw new Error('One or more products are out of stock! Please retry.');
      }

      //and now update the order status---------------------------------------
      order.status = 'confirmed';
      await order.save({ session });

      await session.commitTransaction();
      return order;
    } catch (err: any) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  } else {
    //non-confirmed status update
    const result = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!result) {
      throw new Error('Failed to update status.');
    }
    return result;
  }
};

export const orderService = {
  placeOrderIntoDB,
  getOrdersByStatusFromDB,
  updateOrderStatusIntoDB,
};
