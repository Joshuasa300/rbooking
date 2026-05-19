// api/confirm-booking.js
// Vercel serverless function
// Called after Stripe payment succeeds — sends SMS + email confirmations + Google Calendar event
//
// Required environment variables in Vercel dashboard:
//   TWILIO_ACCOUNT_SID   — from console.twilio.com
//   TWILIO_AUTH_TOKEN    — from console.twilio.com
//   TWILIO_SMS_FROM      — alphanumeric sender ID e.g. RapidRepairs (or Twilio number +447...)
//   SHOP_PHONE           — your mobile number e.g. 07730719347
//   RESEND_API_KEY       — from resend.com
//   RESEND_FROM          — verified sender e.g. bookings@rapidrepairsldn.com
//   SHOP_EMAIL           — email to receive new booking alerts e.g. joshuasa300@gmail.com
//   GOOGLE_CLIENT_EMAIL  — from Google service account JSON
//   GOOGLE_PRIVATE_KEY   — from Google service account JSON (include \n line breaks)
//   GOOGLE_CALENDAR_ID   — your calendar ID from Google Calendar settings

const twilio = require('twilio');
const { Resend } = require('resend');
const { google } = require('googleapis');

// ── SMS helper ─────────────────────────────────────────────────────────────
async function sendSMS(to, body) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const toFormatted = `+44${to.replace(/^0/, '').replace(/\s/g, '')}`;
  return client.messages.create({
    from: process.env.TWILIO_SMS_FROM,
    to: toFormatted,
    body,
  });
}

// ── Email helper ────────────────────────────────────────────────────────────
async function sendEmail({ to, subject, html }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({
    from: process.env.RESEND_FROM,
    to,
    subject,
    html,
  });
}

function customerEmailHTML(booking) {
  const { customer, device, repair, slotDate, slotTime, ref, payMode, paidAmount, repairCost } = booking;
  const firstName = customer.split(' ')[0];
  const balanceDue = repairCost - paidAmount;
  const payLine = payMode === 'deposit'
    ? `£${paidAmount} deposit paid — please bring £${balanceDue} on the day`
    : `£${paidAmount} paid in full — nothing more to pay`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
        <!-- Header -->
        <tr>
          <td style="background:#111;padding:24px 32px">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#fff;border-radius:8px;width:40px;height:40px;text-align:center;vertical-align:middle">
                  <span style="font-size:18px;font-weight:700;color:#111">RR</span>
                </td>
                <td style="padding-left:12px">
                  <div style="color:#fff;font-size:18px;font-weight:700;line-height:1.2">Rapid Repairs</div>
                  <div style="color:#999;font-size:13px">Finchley · N12</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111">Booking confirmed ✓</p>
            <p style="margin:0 0 24px;font-size:15px;color:#666">Hi ${firstName}, your repair is booked. See you soon!</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f8;border-radius:8px;padding:20px;margin-bottom:24px">
              <tr><td style="padding:6px 0;font-size:14px;color:#888;width:130px">Device</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111">${device}</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#888">Repair</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111">${repair}</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#888">Date &amp; time</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111">${slotDate} at ${slotTime}</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#888">Reference</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111">${ref}</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#888">Payment</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111">${payLine}</td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:8px;padding:16px;margin-bottom:24px">
              <tr>
                <td style="font-size:14px;color:#166534;line-height:1.6">
                  <strong>📍 Where to find us</strong><br>
                  193 Summers Lane, Finchley, N12 0LA<br>
                  <span style="color:#166534;opacity:.8">Nearest stations: Arnos Grove · Finchley Central</span>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#999;line-height:1.6">
              90-day warranty on all repairs · No fix, no fee<br>
              Questions? Reply to this email or call us directly.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #f0f0f0">
            <p style="margin:0;font-size:12px;color:#bbb;text-align:center">
              Rapid Repairs · 193 Summers Lane, London N12 0LA · rapidrepairsldn.com
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function shopEmailHTML(booking) {
  const { customer, device, repair, slotDate, slotTime, ref, payMode, paidAmount, repairCost, phone, email } = booking;
  const balanceDue = repairCost - paidAmount;
  const payLine = payMode === 'deposit'
    ? `£${paidAmount} deposit — £${balanceDue} to collect`
    : `£${paidAmount} paid in full`;

  return `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:24px;background:#f5f5f4">
  <table style="max-width:480px;background:#fff;border-radius:10px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.08)">
    <tr><td>
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111">🔔 New booking</p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background:#f9f9f8;border-radius:8px;padding:16px">
        <tr><td style="padding:5px 0;font-size:14px;color:#888;width:120px">Customer</td><td style="padding:5px 0;font-size:14px;font-weight:600;color:#111">${customer}</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#888">Phone</td><td style="padding:5px 0;font-size:14px;font-weight:600;color:#111">${phone}</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#888">Email</td><td style="padding:5px 0;font-size:14px;font-weight:600;color:#111">${email}</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#888">Device</td><td style="padding:5px 0;font-size:14px;font-weight:600;color:#111">${device}</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#888">Repair</td><td style="padding:5px 0;font-size:14px;font-weight:600;color:#111">${repair}</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#888">Slot</td><td style="padding:5px 0;font-size:14px;font-weight:600;color:#111">${slotDate} at ${slotTime}</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#888">Payment</td><td style="padding:5px 0;font-size:14px;font-weight:600;color:#111">${payLine}</td></tr>
        <tr><td style="padding:5px 0;font-size:14px;color:#888">Ref</td><td style="padding:5px 0;font-size:14px;font-weight:600;color:#111">${ref}</td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Google Calendar helper ─────────────────────────────────────────────────
async function createCalendarEvent(booking) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const calendar = google.calendar({ version: 'v3', auth });
  const { slotDate, slotTime, device, repair, customer, phone, email, payMode, paidAmount, repairCost, ref } = booking;

  const year = new Date().getFullYear();
  const startDate = new Date(`${slotDate} ${year} ${slotTime}`);
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
      start: { dateTime: startDate.toISOString(), timeZone: 'Europe/London' },
      end:   { dateTime: endDate.toISOString(),   timeZone: 'Europe/London' },
      colorId: payMode === 'deposit' ? '5' : '2',
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
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      ref, device, repair, repairCost, slotDate, slotTime,
      payMode, paidAmount, customer, phone, email,
    } = req.body;

    if (!device || !repair || !phone || !customer) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const balanceDue = repairCost - paidAmount;
    const firstName = customer.split(' ')[0];

    const customerSMS = [
      `Hi ${firstName}, your repair is booked at Rapid Repairs!`,
      ``,
      `Device: ${device}`,
      `Repair: ${repair}`,
      `Slot: ${slotDate} at ${slotTime}`,
      `Ref: ${ref}`,
      ``,
      payMode === 'deposit'
        ? `Deposit of £${paidAmount} received. Bring £${balanceDue} on the day.`
        : `Fully paid - nothing more to pay.`,
      ``,
      `193 Summers Lane, Finchley N12 0LA`,
    ].join('\n');

    const shopSMS = [
      `New booking - Rapid Repairs`,
      `${customer} | ${phone}`,
      `${device} - ${repair}`,
      `${slotDate} at ${slotTime}`,
      payMode === 'deposit' ? `£${paidAmount} deposit, £${balanceDue} to collect` : `£${paidAmount} paid in full`,
      `Ref: ${ref}`,
    ].join('\n');

    const booking = { ref, device, repair, repairCost, slotDate, slotTime, payMode, paidAmount, customer, phone, email };

    await Promise.all([
      // SMS to customer
      sendSMS(phone, customerSMS).catch(e => console.error('Customer SMS failed:', e.message)),
      // SMS to shop
      sendSMS(process.env.SHOP_PHONE, shopSMS).catch(e => console.error('Shop SMS failed:', e.message)),
      // Email to customer
      sendEmail({
        to: email,
        subject: `Booking confirmed — ${device} repair (${ref})`,
        html: customerEmailHTML(booking),
      }).catch(e => console.error('Customer email failed:', e.message)),
      // Email to shop
      sendEmail({
        to: process.env.SHOP_EMAIL,
        subject: `New booking: ${customer} — ${device} ${slotDate} at ${slotTime}`,
        html: shopEmailHTML(booking),
      }).catch(e => console.error('Shop email failed:', e.message)),
      // Google Calendar
      createCalendarEvent(booking).catch(e => console.error('Calendar failed:', e.message)),
    ]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(200).json({ success: false, error: error.message });
  }
};
