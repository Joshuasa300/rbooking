export const DEPOSIT_AMOUNT = 35;

export const SCREEN_DISCLAIMER = `Standard screen uses a high-quality LCD or aftermarket OLED panel — great value with excellent clarity for everyday use. Premium screen uses a Soft OLED panel that closely matches your phone's original display, with deeper blacks, more accurate colours, and better brightness. Not sure? Standard is perfect for most people.`;

export const DEPOSIT_POLICY = `If you miss your appointment and don't reschedule within a week, you'll lose your deposit.`;

// ── Top-level categories ─────────────────────────────────────────────────────
export const categories = [
  { id: 'phone',  icon: '📱', name: 'Smartphone',    sub: 'iPhone, Samsung, Google…' },
  { id: 'tablet', icon: '🖥️', name: 'Tablet / iPad', sub: 'iPad, Android tablets' },
  { id: 'laptop', icon: '💻', name: 'Laptop',         sub: 'MacBook, Windows, Chrome' },
];

// ── Devices per category ─────────────────────────────────────────────────────
export const devicesByCat = {
  phone: [
    { id: 'iphone',      icon: 'ti-brand-apple',            name: 'iPhone',      sub: 'All models' },
    { id: 'samsung',     icon: 'ti-device-mobile',          name: 'Samsung',     sub: 'S / Note / A-series' },
    { id: 'google',      icon: 'ti-brand-google',           name: 'Google Pixel', sub: 'Pixel 1 – 9 Pro XL' },
    { id: 'other_phone', icon: 'ti-device-mobile-question', name: 'Other',       sub: 'Sony, OnePlus, Motorola…' },
  ],
  tablet: [
    { id: 'ipad',        icon: 'ti-brand-apple',   name: 'iPad',           sub: 'All iPad, Air & Pro models' },
    { id: 'android_tab', icon: 'ti-device-tablet', name: 'Android tablet', sub: 'Samsung, Lenovo, Huawei…' },
  ],
  laptop: [
    { id: 'macbook',      icon: 'ti-brand-apple',   name: 'MacBook',      sub: 'Air & Pro, all years' },
    { id: 'other_laptop', icon: 'ti-device-laptop', name: 'Other laptop', sub: 'HP, Asus, Lenovo, Dell, Chromebook…' },
  ],
};

const GSM = 'https://fdn2.gsmarena.com/vv';

// ── iPhone & Samsung series ──────────────────────────────────────────────────
export const iphoneSeries = [
  { id: 'std',    name: 'iPhone',                sub: 'Standard lineup',       svgType: 'std',    svgProps: { size: 'std',  top: 'island',     cameras: 'dual'   } },
  { id: 'pro',    name: 'iPhone Pro',            sub: 'Pro lineup',            svgType: 'pro',    svgProps: { size: 'std',  top: 'island',     cameras: 'triple' } },
  { id: 'promax', name: 'iPhone Pro Max',        sub: 'Pro Max lineup',        svgType: 'promax', svgProps: { size: 'max',  top: 'island',     cameras: 'triple' } },
  { id: 'mini',   name: 'iPhone mini / Plus / e',sub: 'mini, Plus & e models', svgType: 'mini',   svgProps: { size: 'mini', top: 'notch',      cameras: 'dual'   } },
];
export const samsungSeries = [
  { id: 's',    name: 'Samsung S-series', sub: 'Flagship range', svgType: 'plus',  img: `${GSM}/pics/samsung/samsung-galaxy-s25-ultra-sm-s938-1.jpg` },
  { id: 'note', name: 'Samsung Note',     sub: 'Note series',    svgType: 'ultra', img: `${GSM}/pics/samsung/samsung-galaxy-note20-ultra-1.jpg` },
  { id: 'a',    name: 'Samsung A-series', sub: 'Mid-range',      svgType: 'std',   img: `${GSM}/bigpic/samsung-galaxy-a52-4g.jpg` },
];

// ── Models per series ────────────────────────────────────────────────────────
export const iphoneModels = {
  std: [
    { name: 'iPhone 16',  year: '2024', svgProps: { size: 'std',  top: 'island',     cameras: 'dual'   } },
    { name: 'iPhone 15',  year: '2023', svgProps: { size: 'std',  top: 'island',     cameras: 'dual'   } },
    { name: 'iPhone 14',      year: '2022', svgProps: { size: 'std',  top: 'notch',      cameras: 'dual'   } },
    { name: 'iPhone SE (2022)', year: '2022', svgProps: { size: 'std',  top: 'home',       cameras: 'single' } },
    { name: 'iPhone 13',      year: '2021', svgProps: { size: 'std',  top: 'notch',      cameras: 'dual'   } },
    { name: 'iPhone 12',      year: '2020', svgProps: { size: 'std',  top: 'notch',      cameras: 'dual'   } },
    { name: 'iPhone SE (2020)', year: '2020', svgProps: { size: 'std',  top: 'home',       cameras: 'single' } },
    { name: 'iPhone 11',      year: '2019', svgProps: { size: 'std',  top: 'notch-wide', cameras: 'dual'   } },
    { name: 'iPhone XS',  year: '2018', svgProps: { size: 'std',  top: 'notch-wide', cameras: 'dual'   } },
    { name: 'iPhone XR',  year: '2018', svgProps: { size: 'plus', top: 'notch-wide', cameras: 'single' } },
    { name: 'iPhone X',   year: '2017', svgProps: { size: 'std',  top: 'notch-wide', cameras: 'dual'   } },
    { name: 'iPhone 8',   year: '2017', svgProps: { size: 'std',  top: 'home',       cameras: 'single' } },
    { name: 'iPhone 7',   year: '2016', svgProps: { size: 'std',  top: 'home',       cameras: 'single' } },
    { name: 'iPhone 6s',  year: '2015', svgProps: { size: 'std',  top: 'home',       cameras: 'single' } },
    { name: 'iPhone 6',   year: '2014', svgProps: { size: 'std',  top: 'home',       cameras: 'single' } },
  ],
  pro: [
    { name: 'iPhone 16 Pro', year: '2024', svgProps: { size: 'std', top: 'island',     cameras: 'triple' } },
    { name: 'iPhone 15 Pro', year: '2023', svgProps: { size: 'std', top: 'island',     cameras: 'triple' } },
    { name: 'iPhone 14 Pro', year: '2022', svgProps: { size: 'std', top: 'island',     cameras: 'triple' } },
    { name: 'iPhone 13 Pro', year: '2021', svgProps: { size: 'std', top: 'notch',      cameras: 'triple' } },
    { name: 'iPhone 12 Pro', year: '2020', svgProps: { size: 'std', top: 'notch',      cameras: 'triple' } },
    { name: 'iPhone 11 Pro', year: '2019', svgProps: { size: 'std', top: 'notch-wide', cameras: 'triple' } },
  ],
  promax: [
    { name: 'iPhone 16 Pro Max', year: '2024', svgProps: { size: 'max', top: 'island',     cameras: 'triple' } },
    { name: 'iPhone 15 Pro Max', year: '2023', svgProps: { size: 'max', top: 'island',     cameras: 'triple' } },
    { name: 'iPhone 14 Pro Max', year: '2022', svgProps: { size: 'max', top: 'island',     cameras: 'triple' } },
    { name: 'iPhone 13 Pro Max', year: '2021', svgProps: { size: 'max', top: 'notch',      cameras: 'triple' } },
    { name: 'iPhone 12 Pro Max', year: '2020', svgProps: { size: 'max', top: 'notch',      cameras: 'triple' } },
    { name: 'iPhone 11 Pro Max', year: '2019', svgProps: { size: 'max', top: 'notch-wide', cameras: 'triple' } },
    { name: 'iPhone XS Max',     year: '2018', svgProps: { size: 'max', top: 'notch-wide', cameras: 'dual'   } },
  ],
  mini: [
    { name: 'iPhone 16 Plus',  year: '2024', svgType: 'plus', svgProps: { size: 'plus', top: 'island', cameras: 'dual'   } },
    { name: 'iPhone 16e',      year: '2025', svgType: 'std',  svgProps: { size: 'std',  top: 'notch',  cameras: 'single' } },
    { name: 'iPhone 15 Plus',  year: '2023', svgType: 'plus', svgProps: { size: 'plus', top: 'island', cameras: 'dual'   } },
    { name: 'iPhone 14 Plus',  year: '2022', svgType: 'plus', svgProps: { size: 'plus', top: 'notch',  cameras: 'dual'   } },
    { name: 'iPhone 13 mini',  year: '2021', svgType: 'mini', svgProps: { size: 'mini', top: 'notch',  cameras: 'dual'   } },
    { name: 'iPhone 12 mini',  year: '2020', svgType: 'mini', svgProps: { size: 'mini', top: 'notch',  cameras: 'dual'   } },
    { name: 'iPhone 8+',       year: '2017', svgType: 'plus', svgProps: { size: 'plus', top: 'home',   cameras: 'dual'   } },
    { name: 'iPhone 7+',       year: '2016', svgType: 'plus', svgProps: { size: 'plus', top: 'home',   cameras: 'dual'   } },
    { name: 'iPhone 6s+',      year: '2015', svgType: 'plus', svgProps: { size: 'plus', top: 'home',   cameras: 'single' } },
    { name: 'iPhone 6+',       year: '2014', svgType: 'plus', svgProps: { size: 'plus', top: 'home',   cameras: 'single' } },
  ],
};
export const samsungModels = {
  s: [
    { name: 'S25 Ultra', year: '2025', svgType: 'ultra', img: `${GSM}/pics/samsung/samsung-galaxy-s25-ultra-sm-s938-1.jpg`,    imgFb: `${GSM}/bigpic/samsung-galaxy-s25-ultra-sm-s938.jpg` },
    { name: 'S25 Plus',  year: '2025', svgType: 'plus',  img: `${GSM}/pics/samsung/samsung-galaxy-s25-plus-sm-s936-1.jpg`,     imgFb: `${GSM}/bigpic/samsung-galaxy-s25-plus-sm-s936.jpg` },
    { name: 'S25',       year: '2025', svgType: 'std',   img: `${GSM}/pics/samsung/samsung-galaxy-s25-sm-s931-1.jpg`,           imgFb: `${GSM}/bigpic/samsung-galaxy-s25-sm-s931.jpg` },
    { name: 'S24 Ultra', year: '2024', svgType: 'ultra', img: `${GSM}/pics/samsung/samsung-galaxy-s24-ultra-5g-sm-s928-1.jpg`, imgFb: `${GSM}/bigpic/samsung-galaxy-s24-ultra-5g-sm-s928-stylus.jpg` },
    { name: 'S24 Plus',  year: '2024', svgType: 'plus',  img: `${GSM}/pics/samsung/samsung-galaxy-s24-plus-5g-sm-s926-1.jpg`, imgFb: `${GSM}/bigpic/samsung-galaxy-s24-plus-5g-sm-s926.jpg` },
    { name: 'S24',       year: '2024', svgType: 'std',   img: `${GSM}/pics/samsung/samsung-galaxy-s24-5g-sm-s921-1.jpg`,       imgFb: `${GSM}/bigpic/samsung-galaxy-s24-5g-sm-s921.jpg` },
    { name: 'S24 FE',    year: '2024', svgType: 'std',   img: `${GSM}/pics/samsung/samsung-galaxy-s24-fe-1.jpg`,               imgFb: `${GSM}/bigpic/samsung-galaxy-s24-fe-r1.jpg` },
    { name: 'S23 Ultra', year: '2023', svgType: 'ultra', img: `${GSM}/pics/samsung/samsung-galaxy-s23-ultra-5g-1.jpg`,         imgFb: `${GSM}/bigpic/samsung-galaxy-s23-ultra-5g.jpg` },
    { name: 'S23 Plus',  year: '2023', svgType: 'plus',  img: `${GSM}/pics/samsung/samsung-galaxy-s23-plus-5g-1.jpg`,          imgFb: `${GSM}/bigpic/samsung-galaxy-s23-plus-5g.jpg` },
    { name: 'S23',       year: '2023', svgType: 'std',   img: `${GSM}/pics/samsung/samsung-galaxy-s23-5g-1.jpg`,               imgFb: `${GSM}/bigpic/samsung-galaxy-s23-5g.jpg` },
    { name: 'S23 FE',    year: '2023', svgType: 'std',   img: `${GSM}/pics/samsung/samsung-galaxy-s23-fe-1.jpg`,               imgFb: `${GSM}/bigpic/samsung-galaxy-s23-fe.jpg` },
    { name: 'S22 Ultra', year: '2022', svgType: 'ultra', img: `${GSM}/pics/samsung/samsung-galaxy-s22-ultra-5g-1.jpg`,         imgFb: `${GSM}/bigpic/samsung-galaxy-s22-ultra-5g.jpg` },
    { name: 'S22 Plus',  year: '2022', svgType: 'plus',  img: `${GSM}/pics/samsung/samsung-galaxy-s22-plus-5g-1.jpg`,          imgFb: `${GSM}/bigpic/samsung-galaxy-s22-plus-5g.jpg` },
    { name: 'S22',       year: '2022', svgType: 'std',   img: `${GSM}/pics/samsung/samsung-galaxy-s22-5g-1.jpg`,               imgFb: `${GSM}/bigpic/samsung-galaxy-s22-5g.jpg` },
    { name: 'S21 Ultra', year: '2021', svgType: 'ultra', img: `${GSM}/pics/samsung/samsung-galaxy-s21-ultra-5g-1.jpg`,         imgFb: `${GSM}/bigpic/samsung-galaxy-s21-ultra-5g.jpg` },
    { name: 'S21 Plus',  year: '2021', svgType: 'plus',  img: `${GSM}/pics/samsung/samsung-galaxy-s21-plus-5g-1.jpg`,          imgFb: `${GSM}/bigpic/samsung-galaxy-s21-plus-5g.jpg` },
    { name: 'S21',       year: '2021', svgType: 'std',   img: `${GSM}/pics/samsung/samsung-galaxy-s21-5g-1.jpg`,               imgFb: `${GSM}/bigpic/samsung-galaxy-s21-5g.jpg` },
    { name: 'S20 Ultra', year: '2020', svgType: 'ultra', img: `${GSM}/bigpic/samsung-galaxy-s20-ultra-.jpg`,                 imgFb: `${GSM}/bigpic/samsung-galaxy-s20-ultra-.jpg` },
    { name: 'S20 Plus',  year: '2020', svgType: 'plus',  img: `${GSM}/pics/samsung/samsung-galaxy-s20-plus-1.jpg`,             imgFb: `${GSM}/bigpic/samsung-galaxy-s20-plus.jpg` },
    { name: 'S20',       year: '2020', svgType: 'std',   img: `${GSM}/pics/samsung/samsung-galaxy-s20-1.jpg`,                  imgFb: `${GSM}/pics/samsung/samsung-galaxy-s20-1.jpg` },
    { name: 'S20 FE',    year: '2020', svgType: 'std',   img: `${GSM}/pics/samsung/samsung-galaxy-s20-fe-5g-1.jpg`,            imgFb: `${GSM}/bigpic/samsung-galaxy-s20-fe-5g.jpg` },
  ],
  note: [
    { name: 'Note 20 Ultra', year: '2020', svgType: 'ultra', img: `${GSM}/pics/samsung/samsung-galaxy-note20-ultra-1.jpg` },
    { name: 'Note 20',       year: '2020', svgType: 'plus',  img: `${GSM}/pics/samsung/samsung-galaxy-note20-1.jpg` },
    { name: 'Note 10 Plus',  year: '2019', svgType: 'ultra', img: `${GSM}/bigpic/samsung-galaxy-note10-plus-.jpg` },
    { name: 'Note 10',       year: '2019', svgType: 'plus',  img: `${GSM}/bigpic/samsung-galaxy-note10-.jpg` },
    { name: 'Note 9',        year: '2018', svgType: 'plus',  img: `${GSM}/pics/samsung/samsung-galaxy-note9-1.jpg` },
    { name: 'Note 8',        year: '2017', svgType: 'plus',  img: `${GSM}/bigpic/samsung-galaxy-note8.jpg` },
  ],
  a: [
    { name: 'A52',  year: '2021', svgType: 'std',  img: `${GSM}/bigpic/samsung-galaxy-a52-4g.jpg`,                   imgFb: `${GSM}/bigpic/samsung-galaxy-a52-4g.jpg` },
    { name: 'A51',  year: '2020', svgType: 'std',  img: `${GSM}/pics/samsung/samsung-galaxy-a51-sm-a515-1.jpg`,      imgFb: `${GSM}/bigpic/samsung-galaxy-a51-sm-a515.jpg` },
    { name: 'A71',  year: '2020', svgType: 'plus', img: `${GSM}/pics/samsung/samsung-galaxy-a71-1.jpg`,              imgFb: `${GSM}/bigpic/samsung-galaxy-a71.jpg` },
    { name: 'A41',  year: '2020', svgType: 'std',  img: `${GSM}/pics/samsung/samsung-galaxy-a41-1.jpg`,              imgFb: `${GSM}/bigpic/samsung-galaxy-a41.jpg` },
    { name: 'A50',  year: '2019', svgType: 'std',  img: `${GSM}/pics/samsung/samsung-galaxy-a50s-1.jpg`,             imgFb: `${GSM}/bigpic/samsung-galaxy-a50s.jpg` },
    { name: 'A70',  year: '2019', svgType: 'plus', img: `${GSM}/pics/samsung/samsung-galaxy-a70-1.jpg`,              imgFb: `${GSM}/bigpic/samsung-galaxy-a70.jpg` },
    { name: 'A40',  year: '2019', svgType: 'std',  img: `${GSM}/pics/samsung/samsung-galaxy-a40-1.jpg`,              imgFb: `${GSM}/bigpic/samsung-galaxy-a40.jpg` },
    { name: 'A21s', year: '2020', svgType: 'std',  img: `${GSM}/pics/samsung/samsung-galaxy-a21s-1.jpg`,             imgFb: `${GSM}/bigpic/samsung-galaxy-a21s.jpg` },
    { name: 'A32',  year: '2021', svgType: 'std',  img: `${GSM}/pics/samsung/samsung-galaxy-a32-5g-1.jpg`,           imgFb: `${GSM}/bigpic/samsung-galaxy-a32-5g.jpg` },
    { name: 'A42',  year: '2020', svgType: 'std',  img: `${GSM}/pics/samsung/samsung-galaxy-a42-5g-1.jpg`,           imgFb: `${GSM}/bigpic/samsung-galaxy-a42-5g.jpg` },
    { name: 'A20e', year: '2019', svgType: 'std',  img: `${GSM}/pics/samsung/samsung-galaxy-a20e-1.jpg`,             imgFb: `${GSM}/bigpic/samsung-galaxy-a20e.jpg` },
    { name: 'A10',  year: '2019', svgType: 'std',  img: `${GSM}/pics/samsung/samsung-galaxy-a10-1.jpg`,              imgFb: `${GSM}/bigpic/samsung-galaxy-a10.jpg` },
  ],
};

// ── Per-model repair pricing ─────────────────────────────────────────────────
export const modelRepairs = {
  // iPhone Standard
  'iPhone 16':        [{ name: 'Screen – Standard', sub: 'LCD/aftermarket OLED', time: '1–2 hrs', price: 189 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 250 }, { name: 'Battery replacement', time: '1–2 hrs', price: null, quote: true }, { name: 'Back glass repair', time: '60–90 min', price: 139 }, { name: 'Camera glass', time: '45–60 min', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 15':        [{ name: 'Screen – Standard', time: '1–2 hrs', price: 119 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 225 }, { name: 'Battery replacement', time: '1–2 hrs', price: 99 }, { name: 'Back glass repair', time: '60–90 min', price: 99 }, { name: 'Camera glass', time: '45–60 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 14':        [{ name: 'Screen – Standard', time: '1–2 hrs', price: 109 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 209 }, { name: 'Battery replacement', time: '1–2 hrs', price: 75 }, { name: 'Charging port repair', time: '2–3 hrs', price: 85 }, { name: 'Back glass repair', time: '60–90 min', price: 99 }, { name: 'Camera glass', time: '45–60 min', price: 59 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 13':        [{ name: 'Screen – Standard', time: '1–2 hrs', price: 99 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 209 }, { name: 'Battery replacement', time: '1–2 hrs', price: 75 }, { name: 'Charging port repair', time: '2–3 hrs', price: 85 }, { name: 'Back glass repair', time: '60–90 min', price: 99 }, { name: 'Camera glass', time: '45–60 min', price: 59 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 12':        [{ name: 'Screen – Standard', time: '1–2 hrs', price: 79 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 160 }, { name: 'Battery replacement', time: '1–2 hrs', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 75 }, { name: 'Back glass repair', time: '60–90 min', price: 89 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 11':        [{ name: 'Screen replacement', time: '1–2 hrs', price: 69 }, { name: 'Battery replacement', time: '1–2 hrs', price: 60 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Back glass repair', time: '60–90 min', price: 89 }, { name: 'Camera glass', time: '45–60 min', price: 49 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone XR':        [{ name: 'Screen replacement', time: '1–2 hrs', price: 65 }, { name: 'Battery replacement', time: '1–2 hrs', price: 55 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone X':         [{ name: 'Screen – Standard', time: '1–2 hrs', price: 65 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 120 }, { name: 'Battery replacement', time: '1–2 hrs', price: 55 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 8':         [{ name: 'Screen replacement', time: '1–2 hrs', price: 50 }, { name: 'Battery replacement', time: '1–2 hrs', price: 45 }, { name: 'Charging port repair', time: '2–3 hrs', price: 55 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 7':         [{ name: 'Screen replacement', time: '1–2 hrs', price: 45 }, { name: 'Battery replacement', time: '1–2 hrs', price: 45 }, { name: 'Charging port repair', time: '2–3 hrs', price: 49 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 6s':        [{ name: 'Screen replacement', time: '1–2 hrs', price: 39 }, { name: 'Battery replacement', time: '1–2 hrs', price: 39 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 6s+':       [{ name: 'Screen replacement', time: '1–2 hrs', price: 45 }, { name: 'Battery replacement', time: '1–2 hrs', price: 45 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 6+':        [{ name: 'Screen replacement', time: '1–2 hrs', price: 45 }, { name: 'Battery replacement', time: '1–2 hrs', price: 45 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 6':         [{ name: 'Screen replacement', time: '1–2 hrs', price: 39 }, { name: 'Battery replacement', time: '1–2 hrs', price: 39 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone SE (2022)': [{ name: 'Screen replacement', time: '1–2 hrs', price: 55 }, { name: 'Battery replacement', time: '1–2 hrs', price: 49 }, { name: 'Charging port repair', time: '2–3 hrs', price: 55 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone SE (2020)': [{ name: 'Screen replacement', time: '1–2 hrs', price: 49 }, { name: 'Battery replacement', time: '1–2 hrs', price: 45 }, { name: 'Charging port repair', time: '2–3 hrs', price: 55 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  // iPhone Pro
  'iPhone 16 Pro':    [{ name: 'Screen – Standard', sub: 'LCD/aftermarket OLED', time: '1–2 hrs', price: 229 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 279 }, { name: 'Battery replacement', time: '1–2 hrs', price: null, quote: true }, { name: 'Charging port repair', time: '2–3 hrs', price: 85 }, { name: 'Back glass repair', time: '60–90 min', price: 159 }, { name: 'Camera glass', time: '45–60 min', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 15 Pro':    [{ name: 'Screen – Standard', time: '1–2 hrs', price: 159 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 245 }, { name: 'Battery replacement', time: '1–2 hrs', price: 109 }, { name: 'Back glass repair', time: '60–90 min', price: 119 }, { name: 'Camera glass', time: '45–60 min', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 14 Pro':    [{ name: 'Screen – Standard', time: '1–2 hrs', price: 139 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 239 }, { name: 'Battery replacement', time: '1–2 hrs', price: 85 }, { name: 'Charging port repair', time: '2–3 hrs', price: 85 }, { name: 'Back glass repair', time: '60–90 min', price: 109 }, { name: 'Camera glass', time: '45–60 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 13 Pro':    [{ name: 'Screen – Standard', time: '1–2 hrs', price: 115 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 219 }, { name: 'Battery replacement', time: '1–2 hrs', price: 75 }, { name: 'Charging port repair', time: '2–3 hrs', price: 85 }, { name: 'Back glass repair', time: '60–90 min', price: 109 }, { name: 'Camera glass', time: '45–60 min', price: 59 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 12 Pro':    [{ name: 'Screen – Standard', time: '1–2 hrs', price: 79 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 160 }, { name: 'Battery replacement', time: '1–2 hrs', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 75 }, { name: 'Back glass repair', time: '60–90 min', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 11 Pro':    [{ name: 'Screen – Standard', time: '1–2 hrs', price: 79 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 145 }, { name: 'Battery replacement', time: '1–2 hrs', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Back glass repair', time: '60–90 min', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone XS':        [{ name: 'Screen – Standard', time: '1–2 hrs', price: 69 }, { name: 'Battery replacement', time: '1–2 hrs', price: 55 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  // iPhone Pro Max
  'iPhone 16 Pro Max':[{ name: 'Screen – Standard', sub: 'LCD/aftermarket OLED', time: '1–2 hrs', price: 269 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 315 }, { name: 'Battery replacement', time: '1–2 hrs', price: null, quote: true }, { name: 'Charging port repair', time: '2–3 hrs', price: 99 }, { name: 'Back glass repair', time: '60–90 min', price: 159 }, { name: 'Camera glass', time: '45–60 min', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 15 Pro Max':[{ name: 'Screen – Standard', time: '1–2 hrs', price: 169 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 279 }, { name: 'Battery replacement', time: '1–2 hrs', price: 109 }, { name: 'Back glass repair', time: '60–90 min', price: 119 }, { name: 'Camera glass', time: '45–60 min', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 14 Pro Max':[{ name: 'Screen – Standard', time: '1–2 hrs', price: 139 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 249 }, { name: 'Battery replacement', time: '1–2 hrs', price: 85 }, { name: 'Charging port repair', time: '2–3 hrs', price: 99 }, { name: 'Back glass repair', time: '60–90 min', price: 119 }, { name: 'Camera glass', time: '45–60 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 13 Pro Max':[{ name: 'Screen – Standard', time: '1–2 hrs', price: 129 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 239 }, { name: 'Battery replacement', time: '1–2 hrs', price: 85 }, { name: 'Charging port repair', time: '2–3 hrs', price: 85 }, { name: 'Back glass repair', time: '60–90 min', price: 119 }, { name: 'Camera glass', time: '45–60 min', price: 59 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 12 Pro Max':[{ name: 'Screen – Standard', time: '1–2 hrs', price: 109 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 179 }, { name: 'Battery replacement', time: '1–2 hrs', price: 69 }, { name: 'Charging port repair', time: '2–3 hrs', price: 79 }, { name: 'Back glass repair', time: '60–90 min', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 11 Pro Max':[{ name: 'Screen – Standard', time: '1–2 hrs', price: 79 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 150 }, { name: 'Battery replacement', time: '1–2 hrs', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Back glass repair', time: '60–90 min', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone XS Max':    [{ name: 'Screen – Standard', time: '1–2 hrs', price: 69 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 130 }, { name: 'Battery replacement', time: '1–2 hrs', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  // iPhone mini
  'iPhone 16 Plus':   [{ name: 'Screen – Standard', sub: 'LCD/aftermarket OLED', time: '1–2 hrs', price: 229 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 279 }, { name: 'Battery replacement', time: '1–2 hrs', price: null, quote: true }, { name: 'Charging port repair', time: '2–3 hrs', price: 85 }, { name: 'Back glass repair', time: '60–90 min', price: 159 }, { name: 'Camera glass', time: '45–60 min', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 16e':       [{ name: 'Screen – Standard', sub: 'LCD/aftermarket OLED', time: '1–2 hrs', price: 169 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 199 }, { name: 'Battery replacement', time: '1–2 hrs', price: null, quote: true }, { name: 'Back glass repair', time: '60–90 min', price: 139 }, { name: 'Camera glass', time: '45–60 min', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 15 Plus':   [{ name: 'Screen – Standard', sub: 'LCD/aftermarket OLED', time: '1–2 hrs', price: 139 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 245 }, { name: 'Battery replacement', time: '1–2 hrs', price: 109 }, { name: 'Back glass repair', time: '60–90 min', price: 119 }, { name: 'Camera glass', time: '45–60 min', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 14 Plus':   [{ name: 'Screen – Standard', sub: 'LCD/aftermarket OLED', time: '1–2 hrs', price: 129 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 219 }, { name: 'Battery replacement', time: '1–2 hrs', price: 85 }, { name: 'Charging port repair', time: '2–3 hrs', price: 85 }, { name: 'Back glass repair', time: '60–90 min', price: 119 }, { name: 'Camera glass', time: '45–60 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 13 mini':   [{ name: 'Screen – Standard', time: '1–2 hrs', price: 125 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 199 }, { name: 'Battery replacement', time: '1–2 hrs', price: 75 }, { name: 'Charging port repair', time: '2–3 hrs', price: 70 }, { name: 'Back glass repair', time: '60–90 min', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 12 mini':   [{ name: 'Screen – Standard', time: '1–2 hrs', price: 109 }, { name: 'Screen – Premium', sub: 'Soft OLED', time: '1–2 hrs', price: 165 }, { name: 'Battery replacement', time: '1–2 hrs', price: 69 }, { name: 'Charging port repair', time: '2–3 hrs', price: 75 }, { name: 'Back glass repair', time: '60–90 min', price: 89 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 8+':        [{ name: 'Screen replacement', time: '1–2 hrs', price: 50 }, { name: 'Battery replacement', time: '1–2 hrs', price: 49 }, { name: 'Charging port repair', time: '2–3 hrs', price: 55 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'iPhone 7+':        [{ name: 'Screen replacement', time: '1–2 hrs', price: 45 }, { name: 'Battery replacement', time: '1–2 hrs', price: 49 }, { name: 'Charging port repair', time: '2–3 hrs', price: 49 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  // Samsung S-series
  'S25 Ultra':  [{ name: 'Screen replacement', time: '45–75 min', price: 299 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S25 Plus':   [{ name: 'Screen replacement', time: '45–75 min', price: 289 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 89 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S25':        [{ name: 'Screen replacement', time: '45–75 min', price: 269 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S24 Ultra':  [{ name: 'Screen replacement', time: '45–75 min', price: 325 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S24 Plus':   [{ name: 'Screen replacement', time: '45–75 min', price: 250 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 89 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S24':        [{ name: 'Screen replacement', time: '45–75 min', price: 250 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S24 FE':     [{ name: 'Screen replacement', time: '45–75 min', price: 230 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S23 Ultra':  [{ name: 'Screen replacement', time: '45–75 min', price: 325 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 99 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S23 Plus':   [{ name: 'Screen replacement', time: '45–75 min', price: 269 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 89 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S23':        [{ name: 'Screen replacement', time: '45–75 min', price: 259 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 79 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S23 FE':     [{ name: 'Screen replacement', time: '45–75 min', price: 225 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S22 Ultra':  [{ name: 'Screen replacement', time: '45–75 min', price: 299 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 79 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S22 Plus':   [{ name: 'Screen replacement', time: '45–75 min', price: 230 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 79 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S22':        [{ name: 'Screen replacement', time: '45–75 min', price: 230 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S21 Ultra':  [{ name: 'Screen replacement', time: '45–75 min', price: 279 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 79 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S21 Plus':   [{ name: 'Screen replacement', time: '45–75 min', price: 245 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 79 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S21':        [{ name: 'Screen replacement', time: '45–75 min', price: 245 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S20 Ultra':  [{ name: 'Screen replacement', time: '45–75 min', price: 279 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S20 Plus':   [{ name: 'Screen replacement', time: '45–75 min', price: 245 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S20':        [{ name: 'Screen replacement', time: '45–75 min', price: 245 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'S20 FE':     [{ name: 'Screen replacement', time: '45–75 min', price: 199 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  // Samsung Note
  'Note 20 Ultra': [{ name: 'Screen replacement', time: '45–75 min', price: 279 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 75 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'Note 20':       [{ name: 'Screen replacement', time: '45–75 min', price: 255 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'Note 10 Plus':  [{ name: 'Screen replacement', time: '45–75 min', price: 285 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'Note 10':       [{ name: 'Screen replacement', time: '45–75 min', price: 210 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'Note 9':        [{ name: 'Screen replacement', time: '45–75 min', price: 279 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'Note 8':        [{ name: 'Screen replacement', time: '45–75 min', price: 220 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  // Samsung A-series (all quote-based for model specifics or use generic)
  'A52': [{ name: 'Screen replacement', time: '45–75 min', price: 155 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A51': [{ name: 'Screen replacement', time: '45–75 min', price: 145 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A71': [{ name: 'Screen replacement', time: '45–75 min', price: 145 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Charging port repair', time: '2–3 hrs', price: 69 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A41': [{ name: 'Screen replacement', time: '45–75 min', price: 155 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A50': [{ name: 'Screen replacement', time: '45–75 min', price: 140 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A70': [{ name: 'Screen replacement', time: '45–75 min', price: 140 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A40': [{ name: 'Screen replacement', time: '45–75 min', price: 130 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A21s':[{ name: 'Screen replacement', time: '45–75 min', price: 125 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A32': [{ name: 'Screen replacement', time: '45–75 min', price: 99 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A42': [{ name: 'Screen replacement', time: '45–75 min', price: 99 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A20e':[{ name: 'Screen replacement', time: '45–75 min', price: 105 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
  'A10': [{ name: 'Screen replacement', time: '45–75 min', price: 115 }, { name: 'Battery replacement', time: '30 min', price: 65 }, { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true }],
};

// ── Per-model Pixel repairs ──────────────────────────────────────────────────
const px = (orig, oled, batt) => [
  { name: 'Screen – Original', sub: 'OEM-matched panel',          time: '45–60 min', price: orig },
  ...(oled ? [{ name: 'Screen – OLED', sub: 'High-quality aftermarket OLED · fingerprint sensor may not work after install', time: '45–60 min', price: oled }] : []),
  { name: 'Battery replacement',                                    time: '2–3 hrs',   price: batt },
  { name: 'Motherboard / water damage',                             time: '4–7 days',  price: null, quote: true },
];

export const pixelRepairs = {
  'Pixel 9 Pro XL': px(279, 249, 119),
  'Pixel 9 Pro':    px(249, 209, 119),
  'Pixel 9':        px(215, 189, 109),
  'Pixel 8 Pro':    px(225, 189,  99),
  'Pixel 8a':       px(199, 169,  89),
  'Pixel 8':        px(199, 169,  89),
  'Pixel 7 Pro':    px(199, 139,  89),
  'Pixel 7a':       px(179, 149,  89),
  'Pixel 7':        px(179, 139,  89),
  'Pixel 6 Pro':    px(199, 139,  79),
  'Pixel 6a':       px(189, 139,  79),
  'Pixel 6':        px(179, 139,  69),
  'Pixel 5a':       px(190, 175,  69),
  'Pixel 5':        px(190, 175,  69),
  'Pixel 4a 5G':    px(199, null, 69),
  'Pixel 4a':       px(170, null, 69),
  'Pixel 4 XL':     px(190, null, 69),
  'Pixel 4':        px(180, 165,  69),
  'Pixel 3a':       px(149, null, 69),
  'Pixel 3':        px(149, null, 69),
  'Pixel 2 XL':     px(139, null, 69),
  'Pixel 2':        px(139, null, 69),
};

// ── Fallback repairs for non-model-picker devices ────────────────────────────
export const genericRepairs = {
  google: [
    { name: 'Screen – Original', sub: 'OEM-matched panel', time: '45–60 min', price: null, priceStr: 'From £139', hasModels: true, models: [
      { model: 'Pixel 9 Pro XL', price: 279 }, { model: 'Pixel 9 Pro', price: 249 }, { model: 'Pixel 9', price: 215 },
      { model: 'Pixel 8 Pro', price: 225 }, { model: 'Pixel 8 / 8a', price: 199 }, { model: 'Pixel 7 Pro', price: 199 },
      { model: 'Pixel 7 / 7a', price: 179 }, { model: 'Pixel 6 Pro', price: 199 }, { model: 'Pixel 6', price: 179 },
      { model: 'Pixel 6a', price: 189 }, { model: 'Pixel 5 / 5a', price: 190 }, { model: 'Pixel 4 / 4 XL', price: 190 },
      { model: 'Pixel 4a / 4a 5G', price: 199 }, { model: 'Pixel 3 range', price: 149 }, { model: 'Pixel 2 / XL / 1', price: 139 },
    ]},
    { name: 'Screen – OLED', sub: 'Aftermarket OLED panel · fingerprint sensor may not work after install', time: '45–60 min', price: null, priceStr: 'From £139', hasModels: true, models: [
      { model: 'Pixel 9 Pro XL', price: 249 }, { model: 'Pixel 9 Pro', price: 209 }, { model: 'Pixel 9', price: 189 },
      { model: 'Pixel 8 Pro', price: 189 }, { model: 'Pixel 8 / 8a', price: 169 }, { model: 'Pixel 7 Pro', price: 139 },
      { model: 'Pixel 7 / 7a', price: 149 }, { model: 'Pixel 6 Pro', price: 139 }, { model: 'Pixel 6', price: 139 },
      { model: 'Pixel 6a', price: 139 }, { model: 'Pixel 5 / 5a', price: 175 }, { model: 'Pixel 4', price: 165 },
    ]},
    { name: 'Battery replacement', time: '2–3 hrs', price: null, priceStr: 'From £69', hasModels: true, models: [
      { model: 'Pixel 9 Pro / 9 Pro XL', price: 119 }, { model: 'Pixel 9 / 9a', price: 109 }, { model: 'Pixel 8 Pro', price: 99 },
      { model: 'Pixel 8 / 8a', price: 89 }, { model: 'Pixel 7 Pro / 7 / 7a', price: 89 }, { model: 'Pixel 6 Pro / 6a', price: 79 },
      { model: 'Pixel 6', price: 69 }, { model: 'Pixel 5 and older', price: 69 },
    ]},
    { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true },
  ],
  other_phone: [
    { name: 'Screen replacement', time: 'Varies', price: null, quote: true },
    { name: 'Battery replacement', time: 'Varies', price: null, quote: true },
    { name: 'Charging port repair', time: 'Varies', price: null, quote: true },
    { name: 'General diagnostic', time: '1–2 hrs', price: 25 },
  ],
  ipad: [
    { name: 'Screen replacement', time: '60–90 min', price: null, priceStr: 'From £99', hasModels: true, models: [
      { model: 'iPad 5th / 6th gen', price: 99 }, { model: 'iPad 7th / 8th / 9th gen', price: 119 }, { model: 'iPad 10th gen', price: 119 },
      { model: 'iPad Air 3rd gen', price: 189 }, { model: 'iPad Air 4th / 5th gen', price: 225 },
      { model: 'iPad Pro 11" (3rd gen)', price: 275 }, { model: 'iPad Pro 12.9" (3rd gen)', price: 329 },
      { model: 'iPad Pro 11" (4th gen)', price: 299 }, { model: 'iPad Pro 12.9" (4th gen)', price: 329 },
    ]},
    { name: 'Battery replacement', time: '45–60 min', price: null, priceStr: 'From £99', hasModels: true, models: [
      { model: 'iPad 3rd / 4th gen', price: 99 }, { model: 'iPad 5th / 6th gen', price: 99 }, { model: 'iPad 7th / 8th / 9th gen', price: 115 },
      { model: 'iPad 10th gen', price: 149 }, { model: 'iPad Air 1st / 2nd gen', price: 99 }, { model: 'iPad Air 3rd gen', price: 119 },
      { model: 'iPad Air 4th / 5th gen', price: 129 }, { model: 'iPad Pro 11" / 12.9" 1st–2nd gen', price: 119 },
      { model: 'iPad Pro 3rd gen', price: 129 }, { model: 'iPad Pro 4th gen', price: 139 }, { model: 'iPad Pro 12.9" 5th gen', price: 139 },
    ]},
    { name: 'Motherboard / water damage', time: '4–7 days', price: null, quote: true },
  ],
  android_tab: [
    { name: 'Screen replacement', time: 'Varies', price: null, quote: true },
    { name: 'Battery replacement', time: 'Varies', price: null, quote: true },
    { name: 'General diagnostic', time: '1–2 hrs', price: 25 },
  ],
  macbook: [
    { name: 'Screen replacement', time: '2–4 hrs', price: null, priceStr: 'From £349', quote: true },
    { name: 'Battery replacement', time: '1–2 hrs', price: null, priceStr: 'From £119', quote: true },
    { name: 'Keyboard replacement', time: '2–3 hrs', price: null, quote: true },
    { name: 'Water damage diagnostic', time: '1–2 days', price: null, quote: true },
    { name: 'Motherboard / water damage', time: '1–5 days', price: null, quote: true },
  ],
  other_laptop: [
    { name: 'Screen replacement', time: '1–3 hrs', price: null, priceStr: '£110–£239', quote: true },
    { name: 'Battery replacement', time: '1–2 hrs', price: null, priceStr: 'From £119', quote: true },
    { name: 'Keyboard replacement', time: '1–2 hrs', price: null, quote: true },
    { name: 'Motherboard / water damage', time: '1–5 days', price: null, quote: true },
  ],
};

// ── Time slot generator ──────────────────────────────────────────────────────
export function getAvailableSlots() {
  const slots = [];
  const now = new Date();
  const times = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  for (let d = 0; d < 7; d++) {
    const date = new Date(now);
    date.setDate(now.getDate() + d + 1);
    slots.push({
      label: `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`,
      times,
    });
  }
  return slots;
}
