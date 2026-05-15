# Rapid Repairs Booking Widget — Setup Guide

## What this does when someone books and pays

1. **You get a WhatsApp** on 07730719347 — device, repair, slot, customer name + number, deposit or full pay
2. **Customer gets a WhatsApp** — confirmation with your address, slot time, ref, balance due
3. **Google Calendar event** appears automatically — colour-coded (yellow = deposit, green = paid in full), 2hr slot, all details in the notes
4. **Stripe logs the payment** — visible at dashboard.stripe.com, with payouts to your bank every 2 days

---

## Step 1 — Deploy to Vercel

```bash
npm install -g vercel
cd rapid-repairs-booking
npm install
vercel
```

Vercel gives you a URL like `https://rapid-repairs-booking.vercel.app` — copy it.

---

## Step 2 — Add your Stripe publishable key

Open `src/App.jsx` line 14. Replace the test key with your live key from stripe.com → Developers → API keys:

```js
const stripePromise = loadStripe('pk_live_XXXXXXXXXXXXXXXXXXXX');
```

Redeploy: `vercel --prod`

---

## Step 3 — Set up Twilio WhatsApp

1. Sign up at **console.twilio.com** (free, includes £15 credit)
2. Go to **Messaging → Try it out → Send a WhatsApp message**
3. Follow the sandbox setup — WhatsApp the activation code FROM your shop number (07730719347) to activate it
4. Note down: Account SID, Auth Token, WhatsApp From number (e.g. `+14155238886`)

> Sandbox mode requires each recipient to opt in once. Fine for testing. When you go live, upgrade to a Twilio WhatsApp Business number (~£1/month) — customers receive messages with no opt-in needed.

---

## Step 4 — Set up Google Calendar (service account)

This lets the widget write events to your calendar automatically.

1. Go to **console.cloud.google.com** → create a project called "Rapid Repairs"
2. **APIs & Services → Enable APIs** → search "Google Calendar API" → Enable it
3. **APIs & Services → Credentials → Create Credentials → Service Account**
   - Name it "rapid-repairs-calendar", click through
4. Click the service account → **Keys → Add Key → JSON** → download the file
5. From the downloaded JSON, you need: `client_email` and `private_key`
6. **Share your calendar with the service account:**
   - Google Calendar → your calendar → three dots → Settings and sharing
   - Share with specific people → add the `client_email`
   - Permission: **Make changes to events**
   - Copy the **Calendar ID** shown on that settings page (usually your Gmail)

---

## Step 5 — Add environment variables to Vercel

Vercel project → Settings → Environment Variables. Add all of these:

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | From stripe.com → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | From stripe.com → Developers → Webhooks (step 6) |
| `TWILIO_ACCOUNT_SID` | From console.twilio.com |
| `TWILIO_AUTH_TOKEN` | From console.twilio.com |
| `TWILIO_WHATSAPP_FROM` | `whatsapp:+14155238886` (sandbox) or your live number |
| `SHOP_WHATSAPP` | `whatsapp:+447730719347` |
| `GOOGLE_CLIENT_EMAIL` | `client_email` from the JSON file |
| `GOOGLE_PRIVATE_KEY` | `private_key` from the JSON file (paste the full thing) |
| `GOOGLE_CALENDAR_ID` | Your Gmail or calendar ID from step 4 |

Redeploy after adding: `vercel --prod`

---

## Step 6 — Set up Stripe webhook

This is the trigger — without it, nothing fires when someone pays.

1. stripe.com → **Developers → Webhooks → Add endpoint**
2. URL: `https://YOUR-VERCEL-URL.vercel.app/api/stripe-webhook`
3. Event: `payment_intent.succeeded`
4. Copy the **Signing secret** (`whsec_...`) → add to Vercel as `STRIPE_WEBHOOK_SECRET`
5. Redeploy: `vercel --prod`

---

## Step 7 — Embed in Wix

1. Wix editor → your booking page → **Add Elements → Embed → Embed a Website**
2. Paste: `https://YOUR-VERCEL-URL.vercel.app`
3. Set height to **750px** minimum
4. Publish

---

## Blocking off times and dates

The widget shows available time slots based on the hours set in `src/data.js` (currently demo slots). To block time:

**Simple:** Create an all-day event in your Google Calendar. The slots still show — customers can technically book, but you'll see the clash on your calendar.

**Recommended upgrade:** Add a `/api/get-slots` endpoint that reads your Google Calendar busy times and only returns free slots. Then blocking in Google Calendar automatically removes those slots from the widget. Ask Claude to build this when you're ready — it's about 1 extra hour of work.

---

## What you see when someone books

**WhatsApp on your phone:**
```
🔔 New booking — Rapid Repairs

📱 Device: iPhone 16 Pro
🔧 Repair: Screen – Premium
📅 Slot: Mon 19 May at 14:00
👤 Customer: Marcus Johnson
📞 Phone: 07712345678
📧 Email: marcus@email.com
💳 Deposit paid: £35 — balance of £244 to collect
🔖 Ref: RR-82741
```

**Google Calendar:** Event at the slot time, 2 hours long.
- 🟡 Yellow = deposit paid (collect balance on arrival)
- 🟢 Green = paid in full (nothing to collect)

**Stripe dashboard:** Every payment with amount, customer, and timestamp. Issue refunds from here too.

---

## Monthly costs

| | 50 bookings | 100 bookings |
|---|---|---|
| Vercel | Free | Free |
| Twilio WhatsApp | ~£2.50 | ~£5 |
| Stripe fees | ~£2 | ~£4 |
| Google Calendar | Free | Free |
| **Total** | **~£4.50** | **~£9** |

