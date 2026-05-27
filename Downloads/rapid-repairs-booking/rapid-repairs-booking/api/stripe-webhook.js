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
const processBooking = require('./confirm-booking');

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
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

    await processBooking({
      ref:        meta.ref        || `RR-${Date.now()}`,
      device:     meta.device     || 'Unknown device',
      repair:     meta.repair     || 'Unknown repair',
      repairCost: parseInt(meta.repairCost || '0'),
      slotDate:   meta.slotDate   || '',
      slotTime:   meta.slotTime   || '',
      payMode:    meta.payMode    || 'deposit',
      paidAmount: Math.round(pi.amount / 100),
      customer:   meta.customer   || '',
      phone:      meta.phone      || '',
      email:      meta.email      || '',
      repairTime: meta.repairTime || '',
    }).catch(err => console.error('processBooking failed:', err));
  }

  res.status(200).json({ received: true });
}

handler.config = { api: { bodyParser: false } };
module.exports = handler;
