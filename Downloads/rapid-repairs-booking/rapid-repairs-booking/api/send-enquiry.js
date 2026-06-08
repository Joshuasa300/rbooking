// api/send-enquiry.js
// Handles quote requests and general enquiries (no fixed price repairs).
// Sends email + SMS to the shop, and an acknowledgement email to the customer.
//
// Same env vars as confirm-booking.js:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_FROM, SHOP_PHONE
//   RESEND_API_KEY, RESEND_FROM, SHOP_EMAIL

const twilio = require('twilio');
const { Resend } = require('resend');

function normaliseUKPhone(raw) {
  let n = raw.replace(/[\s\-().]/g, '');
  if (n.startsWith('+44'))       n = n.slice(3);
  else if (n.startsWith('0044')) n = n.slice(4);
  else if (n.startsWith('44') && n.length >= 12) n = n.slice(2);
  else if (n.startsWith('0'))    n = n.slice(1);
  return `+44${n}`;
}

async function sendSMS(to, body) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return client.messages.create({ from: process.env.TWILIO_SMS_FROM, to: normaliseUKPhone(to), body });
}

async function sendEmail({ to, subject, html }) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  return resend.emails.send({ from: process.env.RESEND_FROM, to, subject, html });
}

function shopEmailHTML({ ref, customer, phone, email, device, repairType, brand, issue }) {
  const rows = [
    ['Customer', customer],
    ['Phone',    phone],
    ['Email',    email],
    ['Device',   device],
    repairType ? ['Repair type', repairType] : null,
    brand      ? ['Brand / model', brand]   : null,
    ['Issue',    issue],
    ['Ref',      ref],
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:24px;background:#f5f5f4">
  <table style="max-width:500px;background:#fff;border-radius:10px;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.08)">
    <tr><td>
      <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#111">💬 New enquiry / quote request</p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background:#f9f9f8;border-radius:8px;padding:16px">
        ${rows.map(([label, val]) => `
        <tr>
          <td style="padding:5px 0;font-size:14px;color:#888;width:130px;vertical-align:top">${label}</td>
          <td style="padding:5px 0;font-size:14px;font-weight:600;color:#111">${val}</td>
        </tr>`).join('')}
      </table>
      <p style="margin:16px 0 0;font-size:13px;color:#999">Reply to this email or call/SMS the customer directly to send your quote.</p>
    </td></tr>
  </table>
</body>
</html>`;
}

function customerEmailHTML({ ref, customer, device, repairType, brand, issue }) {
  const firstName = customer.split(' ')[0];
  const deviceLine = [device, repairType].filter(Boolean).join(' — ');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
        <tr>
          <td style="background:#111;padding:24px 32px">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:#fff;border-radius:8px;width:40px;height:40px;text-align:center;vertical-align:middle">
                <span style="font-size:18px;font-weight:700;color:#111">RR</span>
              </td>
              <td style="padding-left:12px">
                <div style="color:#fff;font-size:18px;font-weight:700;line-height:1.2">Rapid Repairs</div>
                <div style="color:#999;font-size:13px">Finchley · N12</div>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111">Enquiry received ✓</p>
            <p style="margin:0 0 24px;font-size:15px;color:#666">Hi ${firstName}, we've got your enquiry and will get back to you within 20 minutes with a price.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f8;border-radius:8px;padding:20px;margin-bottom:24px">
              <tr><td style="padding:6px 0;font-size:14px;color:#888;width:130px">Device</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111">${deviceLine || device}</td></tr>
              ${brand ? `<tr><td style="padding:6px 0;font-size:14px;color:#888">Brand / model</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111">${brand}</td></tr>` : ''}
              <tr><td style="padding:6px 0;font-size:14px;color:#888;vertical-align:top">Issue</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111">${issue}</td></tr>
              <tr><td style="padding:6px 0;font-size:14px;color:#888">Reference</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#111">${ref}</td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-radius:8px;padding:16px;margin-bottom:24px">
              <tr>
                <td style="font-size:14px;color:#166534;line-height:1.6">
                  <strong>📍 Where to find us</strong><br>
                  193 Summers Lane, Finchley, N12 0LA<br>
                  <span style="opacity:.8">Nearest stations: Arnos Grove · Finchley Central</span>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#999;line-height:1.6">
              90-day warranty on all repairs · No fix, no fee<br>
              Questions? Reply to this email or call us directly.
            </p>
          </td>
        </tr>
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

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { ref, customer, phone, email, device, repairType, brand, issue } = req.body;
  if (!customer || !phone || !email || !issue) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const shopSMS = [
    `New enquiry — Rapid Repairs`,
    `${customer} | ${phone}`,
    device ? `Device: ${device}${repairType ? ` (${repairType})` : ''}` : '',
    brand  ? `Model: ${brand}` : '',
    `Issue: ${issue.slice(0, 100)}`,
    `Ref: ${ref}`,
  ].filter(Boolean).join('\n');

  try {
    await Promise.all([
      sendSMS(process.env.SHOP_PHONE, shopSMS).catch(e => console.error('Shop SMS failed:', e.message)),
      sendEmail({
        to: process.env.SHOP_EMAIL,
        subject: `New enquiry: ${customer} — ${device || 'device'}`,
        html: shopEmailHTML({ ref, customer, phone, email, device, repairType, brand, issue }),
      }).catch(e => console.error('Shop email failed:', e.message)),
      sendEmail({
        to: email,
        subject: `Enquiry received — Rapid Repairs (${ref})`,
        html: customerEmailHTML({ ref, customer, device, repairType, brand, issue }),
      }).catch(e => console.error('Customer email failed:', e.message)),
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Send enquiry error:', err);
    res.status(200).json({ success: false, error: err.message });
  }
};
