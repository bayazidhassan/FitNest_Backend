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
  if (status === 'cancelled') {
    //newest first
    const result = await Order.find({
      status: { $in: ['cancelled', 'returned'] },
    }).sort({ createdAt: -1 });
    return result;
  } else {
    //newest first
    const result = await Order.find({ status }).sort({ createdAt: -1 });
    return result;
  }
};

//const updateOrderStatusIntoDB = async (id: string, status: TStatus) => {
//for -> when an admin clicks a button, you only update the order if it is still in the expected status.
const updateOrderStatusIntoDB = async (id: string, fromStatus: TStatus, toStatus: TStatus) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //find cart Items------------------------------------
    const order = await Order.findById(id).session(session);
    if (!order) {
      throw new Error('Order not found.');
    }
    const cartItems = order.cartItems;
    if (cartItems.length === 0) {
      throw new Error('Order has no cart items');
    }

    //====================== CONFIRM ORDER ======================
    if (toStatus === 'confirmed') {
      if (order.status === 'confirmed') {
        throw new Error('Order already confirmed');
      }

      //check quantity <= stock_quantity----------------------------
      //The bulkWrite-filter will check this condition in the next step, so this loop is technically redundant here.
      //Trade-off:
      //->Loop : slightly less performance, better error message (product name)
      //->No loop : fewer DB calls, maximum performance
      for (const item of cartItems) {
        const product = await Product.findById(item.product_id).session(session);
        if (!product) {
          throw new Error('Product not found');
        }
        if (item.quantity > product.stock_quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }
      /*
      //Better performance than above loop-> Instead of looping findById for each product fetch all products at once. Reduces N DB calls → 1 DB call. Only useful if cart can have many items.
      const productIds = cartItems.map((i) => i.product_id);
      const products = await Product.find({ _id: { $in: productIds } }).session(session);
      cartItems.forEach((item) => {
        const product = products.find((p) => p._id.equals(item.product_id));
        if (!product) throw new Error('Product not found');
        if (item.quantity > product.stock_quantity)
          throw new Error(`Insufficient stock for ${product.name}`);
      });
      */

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
      //if (bulkResult.modifiedCount !== cartItems.length) {
      //better than modifiedCount
      if (bulkResult.matchedCount !== cartItems.length) {
        throw new Error('One or more products are out of stock! Please retry.');
      }

      //and now update the order status---------------------------------------
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: id, status: fromStatus },
        { status: 'confirmed' },
        { new: true, session },
      );
      if (!updatedOrder) {
        throw new Error('Order was already confirmed or cancelled by another admin.');
      }

      await session.commitTransaction();
      return updatedOrder;
    }

    //====================== CANCEL / RETURN ORDER ======================
    const terminalStatuses: TStatus[] = ['delivered', 'cancelled', 'returned'];
    if (toStatus === 'cancelled' || toStatus === 'returned') {
      //no cancel / return allowed from delivered, cancelled or returned
      if (terminalStatuses.includes(order.status)) {
        throw new Error('This order cannot be cancelled or returned.');
      }

      //restock only if stock was already deducted
      //confirmed, processing, shipped → restock
      const restockAbleStatuses: TStatus[] = ['confirmed', 'processing', 'shipped'];

      if (restockAbleStatuses.includes(order.status)) {
        //bulk restock---------------------------------------
        const bulkOps = cartItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product_id },
            update: { $inc: { stock_quantity: item.quantity } },
          },
        }));

        await Product.bulkWrite(bulkOps, { session });
      }

      //update order status---------------------------------------
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: id, status: fromStatus },
        { status: toStatus },
        { new: true, session },
      );
      if (!updatedOrder) {
        throw new Error('Order was already updated by another admin.');
      }

      await session.commitTransaction();
      return updatedOrder;
    }

    //====================== OTHER STATUS UPDATES ======================
    //non-confirmed status update
    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: id, status: fromStatus },
      { status: toStatus },
      { new: true, session },
    );
    if (!updatedOrder) {
      throw new Error('Order was already updated by another admin.');
    }

    await session.commitTransaction();
    return updatedOrder;
  } catch (err: any) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

export const orderService = {
  placeOrderIntoDB,
  getOrdersByStatusFromDB,
  updateOrderStatusIntoDB,
};
