import { TOrder } from './order_interface';

const placeOrderIntoDB = async (payload: TOrder) => {
  console.log(payload);
};

export const orderService = {
  placeOrderIntoDB,
};
