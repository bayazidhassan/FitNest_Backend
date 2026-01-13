import { TCartItem, TOrderInfo } from '../../@types/orderInfo';
import config from '../../config';
import { stripe } from '../../utils/stripe';
import { Order } from '../orders/order_model';

const createCheckoutSession = async (orderInfo: TOrderInfo) => {
  //at first save the order into db(status: pending), after successful payment-> status: confirmed, isAlreadyPaid: true
  //otherwise cancel the order
  const order = await Order.create(orderInfo);

  const { cartItems } = orderInfo;
  const line_items = cartItems.map((item: TCartItem) => ({
    price_data: {
      currency: 'bdt',
      unit_amount: item.price * 100,
      product_data: { name: item.name },
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url:
      config.node_env === 'production'
        ? `${config.client_url}/checkout/successOrder?session_id={CHECKOUT_SESSION_ID}`
        : 'http://localhost:5173/checkout/successOrder?session_id={CHECKOUT_SESSION_ID}',
    cancel_url:
      config.node_env === 'production'
        ? `${config.client_url}/checkout`
        : 'http://localhost:5173/checkout',
    metadata: { orderId: order._id.toString() },
  });

  return session;
};

const createOrderFromWebhook = async (orderId: string, status: string, isAlreadyPaid: boolean) => {
  await Order.findByIdAndUpdate(orderId, {
    status: status,
    isAlreadyPaid: isAlreadyPaid,
  });
};

export const getOrderIdByStripeSession = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session.metadata?.orderId) {
    throw new Error('Order ID not found in Stripe metadata.');
  }
  const orderId = session.metadata.orderId;
  return orderId;
};

export const paymentService = {
  createCheckoutSession,
  createOrderFromWebhook,
  getOrderIdByStripeSession,
};
