// api/confirm-booking.js
// Vercel serverless function
// Called after Stripe payment succeeds — sends WhatsApp notifications + creates Google Calendar event
//
// Required environment variables in Vercel dashboard:
//   STRIPE_SECRET_KEY         — from stripe.com/dashboard
//   STRIPE_WEBHOOK_SECRET     — from stripe webhooks (optional but recommended)
//   TWILIO_ACCOUNT_SID        — from console.twilio.com
//   TWILIO_AUTH_TOKEN         — from console.twilio.com
//   TWILIO_WHATSAPP_FROM      — Twilio WhatsApp sandbox/number e.g. whatsapp:+14155238886
//   SHOP_WHATSAPP             — whatsapp:+447730719347
//   GOOGLE_CLIENT_EMAIL       — from Google service account JSON
//   GOOGLE_PRIVATE_KEY        — from Google service account JSON (include \n line breaks)
//   GOOGLE_CALENDAR_ID        — your calendar ID from Google Calendar settings (usually your gmail)

const twilio = require('twilio');
const { google } = require('googleapis');

// ── Twilio WhatsApp helper ─────────────────────────────────────────────────
async function sendWhatsApp(to, body) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  return client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to,
    body,
  });
}

// ── Google Calendar helper ─────────────────────────────────────────────────
async function createCalendarEvent(booking) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  // Parse slot — format is "Mon 19 May at 14:00"
  // We'll build a proper start/end from the slot date + time
  const { slotDate, slotTime, device, repair, customer, phone, email, payMode, paidAmount, repairCost, ref } = booking;

  // Build ISO datetime — slotDate like "Mon 19 May", slotTime like "14:00"
  const year = new Date().getFullYear();
  const startStr = `${slotDate} ${year} ${slotTime}`;
  const startDate = new Date(startStr);
  // Default repair duration: 2 hours
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const balanceDue = repairCost - paidAmount;
  const payLabel = payMode === 'deposit'
    ? `£${paidAmount} deposit paid — £${balanceDue} to collect`
    : `£${paidAmount} paid in full`;

  await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: {
      summary: `🔧 ${device} — ${repair} (${customer})`,
      description: [
        `📱 Device: ${device}`,
        `🔧 Repair: ${repair}`,
        `👤 Customer: ${customer}`,
        `📞 Phone: ${phone}`,
        `📧 Email: ${email}`,
        `💳 Payment: ${payLabel}`,
        `🔖 Ref: ${ref}`,
        ``,
        `📍 193 Summers Lane, N12 0LA`,
      ].join('\n'),
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Europe/London',
      },
      colorId: payMode === 'deposit' ? '5' : '2', // banana=deposit, sage=paid in full
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    },
  });
}

// ── Main handler ───────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      ref,
      device,
      repair,
      repairCost,
      slotDate,
      slotTime,
      payMode,       // 'deposit' | 'full'
      paidAmount,
      customer,      // full name
      phone,         // customer phone e.g. 07700900000
      email,
    } = req.body;

    if (!device || !repair || !phone || !customer) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const balanceDue = repairCost - paidAmount;
    const payLabel = payMode === 'deposit'
      ? `💳 *Deposit paid:* £${paidAmount} — balance of £${balanceDue} to collect on arrival`
      : `💳 *Paid in full:* £${paidAmount}`;

    const shopMsg = [
      `🔔 *New booking — Rapid Repairs*`,
      ``,
      `📱 *Device:* ${device}`,
      `🔧 *Repair:* ${repair}`,
      `📅 *Slot:* ${slotDate} at ${slotTime}`,
      `👤 *Customer:* ${customer}`,
      `📞 *Phone:* ${phone}`,
      `📧 *Email:* ${email}`,
      `${payLabel}`,
      `🔖 *Ref:* ${ref}`,
    ].join('\n');

    const customerMsg = [
      `Hi ${customer.split(' ')[0]}! 👋`,
      ``,
      `Your repair is booked with *Rapid Repairs*.`,
      ``,
      `📱 *Device:* ${device}`,
      `🔧 *Repair:* ${repair}`,
      `📅 *Slot:* ${slotDate} at ${slotTime}`,
      `🔖 *Ref:* ${ref}`,
      ``,
      `📍 *Where to find us:*`,
      `193 Summers Lane, Finchley, N12 0LA`,
      `(Nearest: Arnos Grove / Finchley Central)`,
      ``,
      payMode === 'deposit'
        ? `💳 Deposit of £${paidAmount} received. Please bring £${balanceDue} on the day.`
        : `💳 Fully paid — nothing more to pay.`,
      ``,
      `See you soon! Any questions, just reply to this message. 😊`,
    ].join('\n');

    // Run all three in parallel — WhatsApp to shop, WhatsApp to customer, Calendar event
    const customerWANumber = `whatsapp:+44${phone.replace(/^0/, '').replace(/\s/g, '')}`;

    await Promise.all([
      sendWhatsApp(process.env.SHOP_WHATSAPP, shopMsg),
      sendWhatsApp(customerWANumber, customerMsg),
      createCalendarEvent({ ref, device, repair, repairCost, slotDate, slotTime, payMode, paidAmount, customer, phone, email }),
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Confirm booking error:', error);
    // Still return 200 so the frontend doesn't show an error to customer
    // Log the error for debugging in Vercel dashboard
    res.status(200).json({ success: false, error: error.message });
  }
};
