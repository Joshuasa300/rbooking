// api/create-payment-intent.js
// Vercel serverless function — handles Stripe PaymentIntent creation
// Deploy this alongside the React app on Vercel

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'gbp', metadata = {} } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Create or reuse a Stripe Customer so name/email appear in the dashboard
    let customerId;
    if (metadata.email) {
      const existing = await stripe.customers.list({ email: metadata.email, limit: 1 });
      if (existing.data.length > 0) {
        customerId = existing.data[0].id;
        if (metadata.customer && existing.data[0].name !== metadata.customer) {
          await stripe.customers.update(customerId, { name: metadata.customer, phone: metadata.phone || undefined });
        }
      } else {
        const created = await stripe.customers.create({
          email: metadata.email,
          name:  metadata.customer || '',
          phone: metadata.phone   || undefined,
        });
        customerId = created.id;
      }
    }

    const description = [
      metadata.device,
      metadata.repair,
      metadata.customer,
      metadata.slotDate && metadata.slotTime ? `${metadata.slotDate} at ${metadata.slotTime}` : '',
    ].filter(Boolean).join(' — ');

    const paymentIntent = await stripe.paymentIntents.create({
      amount,        // in pence, e.g. 3500 = £35
      currency,
      automatic_payment_methods: { enabled: true },
      customer:    customerId,
      description,
      metadata: Object.fromEntries(
        Object.entries(metadata).map(([k, v]) => [k, String(v ?? '')])
      ),
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};
