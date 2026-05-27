// api/get-slots.js
// Returns available time slots for the next 7 days, with Google Calendar busy times removed.
// Falls back to all slots if Calendar credentials are missing or the API fails.

const { google } = require('googleapis');

const TIMES = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function parseDurationMins(timeStr) {
  if (!timeStr) return 120;
  const hoursMatch = timeStr.match(/(\d+)\s*(?:–|-)\s*(\d+)\s*hr/i) || timeStr.match(/(\d+)\s*hr/i);
  const minsMatch  = timeStr.match(/(\d+)\s*(?:–|-)\s*(\d+)\s*min/i) || timeStr.match(/(\d+)\s*min/i);
  if (hoursMatch) return parseInt(hoursMatch[2] || hoursMatch[1]) * 60;
  if (minsMatch)  return parseInt(minsMatch[2]  || minsMatch[1]);
  return 120;
}

// Approximate BST detection (clocks go forward last Sun of March, back last Sun of October)
function isLondonBST(date) {
  const m = date.getUTCMonth();
  if (m < 2 || m > 9) return false;
  if (m > 2 && m < 9) return true;
  if (m === 2) return date.getUTCDate() >= 25;
  return date.getUTCDate() < 25;
}

function slotToUTC(date, time) {
  const y  = date.getUTCFullYear();
  const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d  = String(date.getUTCDate()).padStart(2, '0');
  const offset = isLondonBST(date) ? '+01:00' : '+00:00';
  return new Date(`${y}-${mo}-${d}T${time}:00${offset}`);
}

module.exports = async (req, res) => {
  const durationMins = parseDurationMins(req.query.repairTime || '');

  const now = new Date();
  const cutoffMs = now.getTime() + 3 * 60 * 60 * 1000; // 3 hrs from now

  const days = [];
  for (let d = 0; d < 7; d++) {
    const date = new Date(now);
    date.setUTCDate(now.getUTCDate() + d);
    days.push({
      date,
      label: `${DAY_NAMES[date.getUTCDay()]} ${date.getUTCDate()} ${MONTH_NAMES[date.getUTCMonth()]}`,
      isToday: d === 0,
    });
  }

  const fallback = days.map(({ date, label, isToday }) => ({
    label,
    times: TIMES.filter(time => !isToday || slotToUTC(date, time).getTime() >= cutoffMs),
  }));

  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
    return res.status(200).json({ slots: fallback });
  }

  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const timeMin = now.toISOString();
    const lastDay = days[days.length - 1].date;
    const dayAfter = new Date(lastDay);
    dayAfter.setUTCDate(lastDay.getUTCDate() + 1);
    const timeMax = slotToUTC(dayAfter, '00:00').toISOString();

    const fbRes = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: 'Europe/London',
        items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
      },
    });

    const busyPeriods = (fbRes.data.calendars[process.env.GOOGLE_CALENDAR_ID]?.busy || [])
      .map(b => ({ start: new Date(b.start), end: new Date(b.end) }));

    const slots = days.map(({ date, label, isToday }) => {
      const freeTimes = TIMES.filter(time => {
        const slotStart = slotToUTC(date, time);
        if (isToday && slotStart.getTime() < cutoffMs) return false;
        const slotEnd = new Date(slotStart.getTime() + durationMins * 60 * 1000);
        return !busyPeriods.some(b => slotStart < b.end && slotEnd > b.start);
      });
      return { label, times: freeTimes };
    });

    res.status(200).json({ slots });
  } catch (err) {
    console.error('get-slots error:', err.message);
    res.status(200).json({ slots: fallback });
  }
};
