// api/_sheets-log.js
// Appends a row per booking / enquiry to a Google Sheet so every submission is recorded,
// along with whether each SMS, email and calendar event actually went through.
// (The leading underscore stops Vercel turning this file into its own endpoint.)
//
// Required environment variables:
//   GOOGLE_SHEET_ID      — the long ID in the sheet's URL: docs.google.com/spreadsheets/d/<ID>/edit
//   GOOGLE_CLIENT_EMAIL  — same service account as the calendar
//   GOOGLE_PRIVATE_KEY   — same service account as the calendar
// The sheet must be shared with GOOGLE_CLIENT_EMAIL as an Editor, and the Google Sheets API
// must be enabled in the same Google Cloud project as the Calendar API.
// If GOOGLE_SHEET_ID is not set, logging is skipped and bookings work as before.

const { google } = require('googleapis');

const TABS = {
  Bookings: [
    'Logged at', 'Ref', 'Customer', 'Phone', 'Email', 'Device', 'Repair',
    'Total £', 'Payment', 'Paid £', 'Slot date', 'Slot time',
    'Customer SMS', 'Shop SMS', 'Customer email', 'Shop email', 'Calendar',
  ],
  Enquiries: [
    'Logged at', 'Ref', 'Type', 'Customer', 'Phone', 'Email', 'Device', 'Repair type',
    'Brand / model', 'Issue', 'Shop SMS', 'Shop email', 'Customer email',
  ],
};

let sheetsClient = null;
const readyTabs = new Set();

function getClient() {
  if (sheetsClient) return sheetsClient;
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

// Creates the tab and its header row the first time it's used.
async function ensureTab(sheets, spreadsheetId, tab) {
  if (readyTabs.has(tab)) return;
  const meta = await sheets.spreadsheets.get({ spreadsheetId, fields: 'sheets.properties.title' });
  const exists = (meta.data.sheets || []).some(s => s.properties.title === tab);
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: tab, gridProperties: { frozenRowCount: 1 } } } }] },
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tab}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [TABS[tab]] },
    });
  }
  readyTabs.add(tab);
}

// Turns Promise.allSettled results into readable sheet cells.
function outcome(result) {
  if (!result) return '';
  return result.status === 'fulfilled' ? 'Sent' : `FAILED: ${result.reason?.message || result.reason}`.slice(0, 200);
}

function londonNow() {
  return new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' });
}

async function appendRow(tab, row) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) return;
  const sheets = getClient();
  await ensureTab(sheets, spreadsheetId, tab);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A1`,
    // RAW keeps phone numbers' leading 0 and stops customer text being run as a formula
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
}

async function logBooking(b, results) {
  const [customerSMS, shopSMS, customerEmail, shopEmail, calendar] = results;
  const payment = b.payMode === 'deposit' ? 'Deposit' : b.payMode === 'full' ? 'Paid in full' : 'Pay on collection';
  return appendRow('Bookings', [
    londonNow(), b.ref, b.customer, b.phone, b.email, b.device, b.repair,
    Number(b.repairCost) || 0, payment, Number(b.paidAmount) || 0, b.slotDate, b.slotTime,
    outcome(customerSMS), outcome(shopSMS), outcome(customerEmail), outcome(shopEmail), outcome(calendar),
  ]);
}

async function logEnquiry(e, results) {
  const [shopSMS, shopEmail, customerEmail] = results;
  const type = String(e.ref || '').startsWith('RR-Q') ? 'Quote request' : 'Enquiry';
  return appendRow('Enquiries', [
    londonNow(), e.ref, type, e.customer, e.phone, e.email, e.device || '', e.repairType || '',
    e.brand || '', e.issue || '', outcome(shopSMS), outcome(shopEmail), outcome(customerEmail),
  ]);
}

module.exports = { logBooking, logEnquiry };
