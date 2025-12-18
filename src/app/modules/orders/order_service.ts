import { TOrder } from './order_interface';
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
  if (!result.length) {
    throw new Error(`${status} orders are not found.`);
  }
  return result;
};

export const orderService = {
  placeOrderIntoDB,
  getOrdersByStatusFromDB,
};
