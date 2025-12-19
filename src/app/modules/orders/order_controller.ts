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

const getOrdersByStatus = catchAsync(async (req, res) => {
  const result = await orderService.getOrdersByStatusFromDB(req.params.status);
  res.status(200).json({
    success: true,
    message: `All ${req.params.status} orders are retrieved successfully.`,
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const result = await orderService.updateOrderStatusIntoDB(req.params.id, req.body.status);
  res.status(200).json({
    success: true,
    message: 'Status is updated successfully.',
    data: result,
  });
});

export const orderController = {
  placeOrder,
  getOrdersByStatus,
  updateOrderStatus,
};
