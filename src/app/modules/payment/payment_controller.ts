import Stripe from 'stripe';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { stripe } from '../../utils/stripe';
import { paymentService } from './payment_service';

const createCheckoutSession = catchAsync(async (req, res) => {
  const session = await paymentService.createCheckoutSession(req.body);
  res.status(200).json({
    success: true,
    url: session.url,
  });
});

const stripeWebhook = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, config.stripe_webhook_secret!);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) return;
      await paymentService.createOrderFromWebhook(orderId, 'confirmed', true);
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) return;
      await paymentService.createOrderFromWebhook(orderId, 'cancelled', false);
    }
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler failed:', err);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
});

export const paymentController = {
  createCheckoutSession,
  stripeWebhook,
};
