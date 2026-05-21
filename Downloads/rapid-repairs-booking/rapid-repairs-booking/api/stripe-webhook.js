// api/stripe-webhook.js
// Vercel serverless function
// Stripe calls this automatically when a payment succeeds
// This is the most reliable trigger — fires even if the customer closes the browser
//
// Setup in Stripe dashboard:
//   Developers → Webhooks → Add endpoint
//   URL: https://YOUR-VERCEL-URL.vercel.app/api/stripe-webhook
//   Events to listen: payment_intent.succeeded

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify the webhook came from Stripe (not a fake request)
    event = stripe.webhooks.constructEvent(
      req.body,                          // raw body — Vercel passes this as Buffer
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const meta = pi.metadata || {};

    // Call our confirm-booking API internally
    try {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';

      await fetch(`${baseUrl}/api/confirm-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ref:        meta.ref        || `RR-${Date.now()}`,
          device:     meta.device     || 'Unknown device',
          repair:     meta.repair     || 'Unknown repair',
          repairCost: parseInt(meta.repairCost || '0'),
          slotDate:   meta.slotDate   || '',
          slotTime:   meta.slotTime   || '',
          payMode:    meta.payMode    || 'deposit',
          paidAmount: Math.round(pi.amount / 100), // convert pence to £
          customer:   meta.customer   || '',
          phone:      meta.phone      || '',
          email:      meta.email      || '',
          repairTime: meta.repairTime || '',
        }),
      });
    } catch (err) {
      console.error('Failed to trigger confirm-booking:', err);
      // Still return 200 to Stripe — don't want Stripe to retry
    }
  }

  res.status(200).json({ received: true });
};
