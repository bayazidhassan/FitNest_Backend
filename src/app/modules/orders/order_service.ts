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
  const result = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!result) {
    throw new Error('Failed to update status.');
  }
  return result;
};

export const orderService = {
  placeOrderIntoDB,
  getOrdersByStatusFromDB,
  updateOrderStatusIntoDB,
};
