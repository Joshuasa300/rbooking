// Normalise a UK phone number to E.164 (+447...). Returns undefined if invalid.
export function toE164UK(raw) {
  if (!raw) return undefined;
  let p = String(raw).replace(/[^\d+]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  else if (p.startsWith('0')) p = '+44' + p.slice(1);
  else if (p.startsWith('44')) p = '+' + p;
  else if (/^7\d{9}$/.test(p)) p = '+44' + p;
  return /^\+\d{10,15}$/.test(p) ? p : undefined;
}

// Hand customer details to GTM for Google Ads enhanced conversions.
// Always set both keys so values from an earlier booking in the same session are cleared.
export function pushEnhancedConversionData({ email, phone }) {
  window.dataLayer = window.dataLayer || [];
  const e = typeof email === 'string' ? email.trim().toLowerCase() : '';
  window.dataLayer.push({
    customer_email: e || undefined,
    customer_phone: toE164UK(phone),
  });
}
