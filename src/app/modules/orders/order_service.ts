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
      throw new Error('Order has no cart items.');
    }

    //Fast-exit: improve performance
    if (order.status !== fromStatus) {
      throw new Error(`Order status has already changed. Current status: ${order.status}.`);
    }
    const allowedTransitions: Record<TStatus, readonly TStatus[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: [],
      cancelled: [],
      returned: [],
    };
    if (!allowedTransitions[fromStatus]?.includes(toStatus)) {
      throw new Error(`Invalid status change from ${fromStatus} to ${toStatus}`);
    }
    if (order.isAlreadyPaid && ['confirmed', 'cancelled', 'returned'].includes(toStatus)) {
      throw new Error(`Paid order can't be ${toStatus}.`);
    }

    if (toStatus === 'confirmed') {
      //====================== CONFIRM ORDER ======================
      //check quantity <= stock_quantity----------------------------
      /*
      The bulkWrite-filter will check this condition in the next step, so this loop is technically redundant here.
      Trade-off: ->Loop : slightly less performance, better error message. ->bulkWrite : fewer DB calls, maximum performance
      */
      for (const item of cartItems) {
        const product = await Product.findById(item.product_id).session(session);
        if (!product) {
          throw new Error('Product not found.');
        }
        if (item.quantity > product.stock_quantity) {
          throw new Error(`Insufficient stock for ${product.name}.`);
        }
      }

      //all checks passed → now deduct stock----------------------------
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
      if (bulkResult.matchedCount !== cartItems.length) {
        throw new Error('One or more products are out of stock! Please retry.');
      }
    }

    //====================== CANCEL / RETURN ORDER ======================
    if (toStatus === 'cancelled' || toStatus === 'returned') {
      const restockAbleStatuses: TStatus[] = ['confirmed', 'processing', 'shipped']; //restock only if stock was already deducted
      if (restockAbleStatuses.includes(order.status)) {
        const bulkOps = cartItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product_id },
            update: { $inc: { stock_quantity: item.quantity } },
          },
        }));
        await Product.bulkWrite(bulkOps, { session });
      }
    }

    //====================== UPDATE ORDER STATUS ======================
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: id, status: fromStatus, __v: order.__v },
      { status: toStatus, $inc: { __v: 1 } },
      { new: true, session },
    );
    if (!updatedOrder) {
      throw new Error(
        `Unable to update status. Current status: ${order.status}. It may have already been modified by another admin.`,
      );
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

const orderStatsService = async () => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const formattedStats: Record<string, number> = {
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0, //cancelled + returned
  };

  stats.forEach((item) => {
    formattedStats.totalOrders += item.count;

    switch (item._id) {
      case 'pending':
        formattedStats.pendingOrders = item.count;
        break;
      case 'confirmed':
        formattedStats.confirmedOrders = item.count;
        break;
      case 'processing':
        formattedStats.processingOrders = item.count;
        break;
      case 'shipped':
        formattedStats.shippedOrders = item.count;
        break;
      case 'delivered':
        formattedStats.deliveredOrders = item.count;
        break;
      case 'cancelled':
      case 'returned': //combine returned into cancelled
        formattedStats.cancelledOrders += item.count;
        break;
    }
  });

  return formattedStats;
};

export const orderService = {
  placeOrderIntoDB,
  getOrdersByStatusFromDB,
  updateOrderStatusIntoDB,
  orderStatsService,
};
