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

    const paymentIntent = await stripe.paymentIntents.create({
      amount,        // in pence, e.g. 3500 = £35
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        device: metadata.device || '',
        repair: metadata.repair || '',
        slot:   metadata.slot   || '',
        name:   metadata.name   || '',
        phone:  metadata.phone  || '',
        email:  metadata.email  || '',
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};
