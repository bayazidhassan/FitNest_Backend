import catchAsync from '../../utils/catchAsync';
import { orderService } from './order_service';

const placeOrder = catchAsync(async (req, res) => {
  const result = await orderService.placeOrderIntoDB(req.body);

  res.status(200).json({
    success: true,
    message: 'Order is placed successful.',
    data: result,
  });
});

export const orderController = {
  placeOrder,
};
