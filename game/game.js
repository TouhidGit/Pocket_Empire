'use strict';
/* =====================================================================
   Pocket Mogul — an idle business tycoon game.
   Tap to hustle, open businesses, trade stocks, buy property, live large,
   then pass your empire to your heir for permanent Legacy Stars.
   ===================================================================== */

// ---------------------------------------------------------------------
// Game content
// ---------------------------------------------------------------------
// Each business, property and luxury item has a photo at img/<kind>/<id>.webp
const BUSINESSES = [
  { id: 'lemon',  name: 'Lemonade Stand',    tag: 'Fresh-squeezed profits',        cost: 15,     income: 0.6 },
  { id: 'taco',   name: 'Taco Truck',        tag: 'Tacos on wheels',               cost: 180,    income: 5 },
  { id: 'coffee', name: 'Coffee Corner',     tag: 'Caffeine is a business model',  cost: 2200,   income: 40 },
  { id: 'wash',   name: 'Car Wash',          tag: 'Shiny cars, shiny cash',        cost: 2.6e4,  income: 300 },
  { id: 'gym',    name: 'Fitness Club',      tag: 'Members pay, rain or shine',    cost: 3.2e5,  income: 2400 },
  { id: 'tech',   name: 'Tech Startup',      tag: 'Disrupting everything',         cost: 4e6,    income: 1.9e4 },
  { id: 'hotel',  name: 'Grand Hotel',       tag: 'Five stars, fifty floors',      cost: 5e7,    income: 1.5e5 },
  { id: 'air',    name: 'Airline',           tag: 'Your name across the sky',      cost: 6.5e8,  income: 1.2e6 },
  { id: 'movie',  name: 'Movie Studio',      tag: 'Blockbusters on demand',        cost: 8.5e9,  income: 9.5e6 },
  { id: 'bank',   name: 'Private Bank',      tag: "Other people's money",          cost: 1.1e11, income: 7.5e7 },
  { id: 'sat',    name: 'Satellite Network', tag: 'Internet for the whole planet', cost: 1.5e12, income: 6e8 },
  { id: 'colony', name: 'Space Colony',      tag: 'Real estate, but in orbit',     cost: 2e13,   income: 4.8e9 },
];
const MILESTONES = [10, 25, 50, 100, 150, 200, 300, 400, 500];
const BIZ_GROWTH = 1.15;

// Boost pictures are img/3d/<id>.webp.
// type: hustle = tap value, biz = one business, allbiz = every business, rent = property rent, all = everything
const UPGRADES = [
  { id: 'shoes',      name: 'Comfy Sneakers',      desc: 'Hustle ×2',            cost: 50,     type: 'hustle', mult: 2 },
  { id: 'flyers',     name: 'Neon Flyers',         desc: 'Lemonade Stand ×3',    cost: 500,    type: 'biz', target: 'lemon', mult: 3 },
  { id: 'social',     name: 'Social Media Page',   desc: 'All businesses ×1.5',  cost: 2500,   type: 'allbiz', mult: 1.5 },
  { id: 'salsa',      name: 'Secret Salsa',        desc: 'Taco Truck ×3',        cost: 6000,   type: 'biz', target: 'taco', mult: 3 },
  { id: 'course',     name: 'Night-School Course', desc: 'Hustle ×3',            cost: 2e4,    type: 'hustle', mult: 3 },
  { id: 'barista',    name: 'Star Barista',        desc: 'Coffee Corner ×3',     cost: 7.5e4,  type: 'biz', target: 'coffee', mult: 3 },
  { id: 'accountant', name: 'Sharp Accountant',    desc: 'Rent income ×2',       cost: 7.5e5,  type: 'rent', mult: 2 },
  { id: 'wax',        name: 'Diamond Wax',         desc: 'Car Wash ×3',          cost: 9e5,    type: 'biz', target: 'wash', mult: 3 },
  { id: 'tv',         name: 'TV Commercial',       desc: 'All businesses ×2',    cost: 3e6,    type: 'allbiz', mult: 2 },
  { id: 'coach',      name: 'Celebrity Coach',     desc: 'Fitness Club ×3',      cost: 1.1e7,  type: 'biz', target: 'gym', mult: 3 },
  { id: 'mba',        name: 'MBA Degree',          desc: 'Hustle ×5',            cost: 5e7,    type: 'hustle', mult: 5 },
  { id: 'ai',         name: 'AI Co-pilot',         desc: 'Tech Startup ×3',      cost: 1.4e8,  type: 'biz', target: 'tech', mult: 3 },
  { id: 'spa',        name: 'Rooftop Spa',         desc: 'Grand Hotel ×3',       cost: 1.7e9,  type: 'biz', target: 'hotel', mult: 3 },
  { id: 'franchise',  name: 'Global Franchise',    desc: 'All businesses ×2',    cost: 5e9,    type: 'allbiz', mult: 2 },
  { id: 'broker',     name: 'Property Broker',     desc: 'Rent income ×3',       cost: 2e10,   type: 'rent', mult: 3 },
  { id: 'routes',     name: 'Global Routes',       desc: 'Airline ×3',           cost: 2.2e10, type: 'biz', target: 'air', mult: 3 },
  { id: 'hit',        name: 'Blockbuster Hit',     desc: 'Movie Studio ×3',      cost: 2.9e11, type: 'biz', target: 'movie', mult: 3 },
  { id: 'vault',      name: 'Gold Vault',          desc: 'Private Bank ×3',      cost: 3.7e12, type: 'biz', target: 'bank', mult: 3 },
  { id: 'brand',      name: 'Iconic Brand',        desc: 'All businesses ×3',    cost: 5e12,   type: 'allbiz', mult: 3 },
  { id: 'uplink',     name: 'Laser Uplink',        desc: 'Satellite Network ×3', cost: 5e13,   type: 'biz', target: 'sat', mult: 3 },
  { id: 'smart',      name: 'Smart Homes',         desc: 'Rent income ×3',       cost: 6e13,   type: 'rent', mult: 3 },
  { id: 'warp',       name: 'Warp Drive',          desc: 'Space Colony ×3',      cost: 7e14,   type: 'biz', target: 'colony', mult: 3 },
  { id: 'mindset',    name: 'Mogul Mindset',       desc: 'ALL income ×2',        cost: 5e15,   type: 'all', mult: 2 },
].sort((a, b) => a.cost - b.cost);

// Logos are img/stock/<sym>.svg
const STOCKS = [
  { sym: 'NVT', name: 'NovaTech',         price: 120, vol: 0.022 },
  { sym: 'GLE', name: 'GreenLeaf Energy', price: 45,  vol: 0.016 },
  { sym: 'BYB', name: 'ByteBank',         price: 210, vol: 0.010 },
  { sym: 'SLM', name: 'Starlane Motors',  price: 80,  vol: 0.028 },
  { sym: 'FZZ', name: 'FizzPop Drinks',   price: 30,  vol: 0.012 },
  { sym: 'MBT', name: 'MoonBit Crypto',   price: 6,   vol: 0.055 },
];
const STOCK_FEE = 0.005;

const PROPERTIES = [
  { id: 'studio', name: 'Tiny Studio',     loc: 'Old Town',           price: 3e4,   rent: 22 },
  { id: 'house',  name: 'Family House',    loc: 'Maple Suburbs',      price: 4e5,   rent: 260 },
  { id: 'apts',   name: 'Apartment Block', loc: 'Riverside',          price: 5e6,   rent: 3000 },
  { id: 'mall',   name: 'Shopping Mall',   loc: 'Central Plaza',      price: 7.5e7, rent: 4.2e4 },
  { id: 'tower',  name: 'Office Tower',    loc: 'Financial District', price: 1.2e9, rent: 6.2e5 },
  { id: 'resort', name: 'Beach Resort',    loc: 'Coral Bay',          price: 2e10,  rent: 9.5e6 },
  { id: 'island', name: 'Private Island',  loc: 'Azure Archipelago',  price: 4e11,  rent: 1.8e8 },
];
const PROP_GROWTH = 1.06;
const PROP_FEE = 0.10;

const LUX_CATS = [
  { id: 'garage',  name: 'Garage',     img: 'car' },
  { id: 'home',    name: 'Homes',      img: 'house' },
  { id: 'air',     name: 'Aircraft',   img: 'plane' },
  { id: 'sea',     name: 'Yachts',     img: 'boat' },
  { id: 'collect', name: 'Collection', img: 'gem' },
];
const LUXURY = [
  { id: 'watch',     cat: 'collect', name: 'Gold Watch',        cost: 2.5e3,  rep: 2 },
  { id: 'hatch',     cat: 'garage',  name: 'Used Hatchback',    cost: 8e3,    rep: 2 },
  { id: 'suit',      cat: 'collect', name: 'Tailored Suit',     cost: 2.5e4,  rep: 3 },
  { id: 'sedan',     cat: 'garage',  name: 'Executive Sedan',   cost: 7e4,    rep: 4 },
  { id: 'cottage',   cat: 'home',    name: 'Cozy Cottage',      cost: 2e5,    rep: 5 },
  { id: 'car',       cat: 'garage',  name: 'Sports Car',        cost: 6e5,    rep: 6 },
  { id: 'boat',      cat: 'sea',     name: 'Speedboat',         cost: 1.8e6,  rep: 7 },
  { id: 'villa',     cat: 'home',    name: 'Modern Villa',      cost: 6e6,    rep: 9 },
  { id: 'super',     cat: 'garage',  name: 'Supercar',          cost: 2e7,    rep: 11 },
  { id: 'heli',      cat: 'air',     name: 'Helicopter',        cost: 7e7,    rep: 13 },
  { id: 'sail',      cat: 'sea',     name: 'Sailing Yacht',     cost: 2.5e8,  rep: 15 },
  { id: 'art',       cat: 'collect', name: 'Famous Painting',   cost: 8e8,    rep: 17 },
  { id: 'penthouse', cat: 'home',    name: 'Sky Penthouse',     cost: 3e9,    rep: 20 },
  { id: 'hyper',     cat: 'garage',  name: 'Hypercar',          cost: 1e10,   rep: 23 },
  { id: 'jet',       cat: 'air',     name: 'Private Jet',       cost: 4e10,   rep: 26 },
  { id: 'yacht',     cat: 'sea',     name: 'Superyacht',        cost: 1.5e11, rep: 30 },
  { id: 'mansion',   cat: 'home',    name: 'Beach Mansion',     cost: 6e11,   rep: 34 },
  { id: 'club',      cat: 'collect', name: 'Football Club',     cost: 2.5e12, rep: 40 },
  { id: 'jumbo',     cat: 'air',     name: 'Private Airliner',  cost: 1e13,   rep: 46 },
  { id: 'castle',    cat: 'home',    name: 'Mountain Castle',   cost: 4e13,   rep: 52 },
  { id: 'sub',       cat: 'sea',     name: 'Private Submarine', cost: 1.5e14, rep: 60 },
  { id: 'diamond',   cat: 'collect', name: 'Legendary Diamond', cost: 6e14,   rep: 70 },
  { id: 'rocket',    cat: 'air',     name: 'Personal Rocket',   cost: 2.5e15, rep: 85 },
  { id: 'moon',      cat: 'home',    name: 'Moon Mansion',      cost: 1e16,   rep: 120 },
];

// [net worth needed, title]. The avatar for title i is img/avatar/<i>.svg
const TITLES = [
  [0,    'Broke Dreamer'],
  [1e3,  'Street Hustler'],
  [5e4,  'Small Business Owner'],
  [1e6,  'Millionaire'],
  [1e8,  'Multi-Millionaire'],
  [1e9,  'Billionaire'],
  [1e11, 'Tycoon'],
  [1e12, 'Trillionaire'],
  [1e14, 'Mega Mogul'],
  [1e16, 'Galactic Mogul'],
];

const NEWS_GOOD = [
  '{n} smashes its quarterly earnings!',
  '{n} lands a giant government contract',
  'Analysts rate {n} a STRONG BUY',
  '{n} unveils a game-changing product',
  'A celebrity was spotted loving {n}',
  '{n} expands into 30 new countries',
];
const NEWS_BAD = [
  '{n} CEO quits in a surprise move',
  'Regulators open an investigation into {n}',
  '{n} recalls thousands of products',
  '{n} misses its earnings target',
  'Hackers breach {n} servers',
  'Rumours of a {n} scandal spread online',
];

const GOALS = [
  { text: 'Tap the coin 10 times',                     reward: 25,    check: () => S.run.taps >= 10 },
  { text: 'Open a Lemonade Stand',                     reward: 20,    check: () => lvl('lemon') >= 1 },
  { text: 'Get your Lemonade Stand to Lv 10',          reward: 150,   check: () => lvl('lemon') >= 10 },
  { text: 'Buy your first Boost',                      reward: 200,   check: () => upgCount() >= 1 },
  { text: 'Open a Taco Truck',                         reward: 400,   check: () => lvl('taco') >= 1 },
  { text: 'Buy a Gold Watch in Lifestyle',             reward: 1500,  check: () => !!S.lux.watch },
  { text: 'Open a Coffee Corner',                      reward: 3000,  check: () => lvl('coffee') >= 1 },
  { text: 'Buy shares of any company in Market',       reward: 5000,  check: () => STOCKS.some(d => S.stocks[d.sym].own > 0) },
  { text: 'Buy your first car in Lifestyle',           reward: 8000,  check: () => LUXURY.some(l => l.cat === 'garage' && S.lux[l.id]) },
  { text: 'Earn $100K in this life',                   reward: 2.5e4, check: () => S.runEarned >= 1e5 },
  { text: 'Buy your first property',                   reward: 4e4,   check: () => propCount() >= 1 },
  { text: 'Sell shares for a profit',                  reward: 6e4,   check: () => S.life.profitTrades >= 1 },
  { text: 'Reach $1K per second',                      reward: 3e5,   check: () => C.ips >= 1e3 },
  { text: 'Become a Millionaire (net worth $1M)',      reward: 5e5,   check: () => C.net >= 1e6 },
  { text: 'Buy a home in Lifestyle',                   reward: 1e6,   check: () => LUXURY.some(l => l.cat === 'home' && S.lux[l.id]) },
  { text: 'Get any business to Lv 100',                reward: 5e6,   check: () => BUSINESSES.some(b => lvl(b.id) >= 100) },
  { text: 'Own 10 properties',                         reward: 2e7,   check: () => propCount() >= 10 },
  { text: 'Reach $1M per second',                      reward: 3e8,   check: () => C.ips >= 1e6 },
  { text: 'Become a Billionaire',                      reward: 1e9,   check: () => C.net >= 1e9 },
  { text: 'Pass your empire to an heir (Profile tab)', reward: 1e5,   check: () => S.life.prestiges >= 1 },
  { text: 'Buy a Private Jet',                         reward: 1e10,  check: () => !!S.lux.jet },
  { text: 'Reach $1B per second',                      reward: 3e11,  check: () => C.ips >= 1e9 },
  { text: 'Become a Trillionaire',                     reward: 1e12,  check: () => C.net >= 1e12 },
  { text: 'Own every Lifestyle item',                  reward: 1e16,  check: () => LUXURY.every(l => S.lux[l.id]) },
];

// Random pop-up events. Each returns a modal description, or null if it doesn't fit right now.
// Their pictures are img/3d/<function name>.webp
const EVENTS = [
  function lucky() {
    const amt = Math.max(150, C.ips * 45 + C.tap * 10);
    return {
      img: 'lucky', title: 'Lucky Ticket',
      html: `You found an old lottery ticket in your jacket. It's a winner worth <b class="t-green">${money(amt)}</b>!`,
      buttons: [{ label: 'Cash it in', cls: 'btn-green', fn: () => { earn(amt); SFX.cash(); confetti(24); } }],
    };
  },
  function risky() {
    const stake = S.cash * 0.1;
    if (stake < 200) return null;
    return {
      img: 'risky', title: 'Risky Deal',
      html: `A smooth-talking stranger promises to <b>triple</b> an investment of <b>${money(stake)}</b>. It could be genius… or a scam.`,
      buttons: [
        { label: `Invest ${money(stake)}`, cls: 'btn-gold', fn: () => {
          if (Math.random() < 0.5) { earn(stake * 2); toast('It worked! You tripled your money.', 'good', IMG.i3d('moneybag')); SFX.cash(); confetti(30); }
          else { spend(stake); toast('He vanished with your money…', 'bad', IMG.i3d('money-wings')); SFX.no(); }
        } },
        { label: 'Walk away', cls: 'btn-soft' },
      ],
    };
  },
  function viral() {
    const top = topBusiness();
    if (!top) return null;
    return {
      img: 'viral', title: 'Gone Viral!',
      html: `A video of your <b>${top.name}</b> is all over the internet. Customers are lining up around the block!`,
      buttons: [{ label: 'Ride the wave (×2 income, 90s)', cls: 'btn-green', fn: () => addBoost('Viral', 'fire', 2, 90) }],
    };
  },
  function audit() {
    const fine = S.cash * 0.06;
    if (fine < 100) return null;
    const lawyer = fine * 0.3;
    return {
      img: 'audit', title: 'Tax Audit',
      html: `Auditors found a mistake in your books. The fine is <b class="t-red">${money(fine)}</b>.<br>A lawyer costs ${money(lawyer)} and usually gets fines dropped.`,
      buttons: [
        { label: `Hire a lawyer (${money(lawyer)})`, cls: 'btn-blue', fn: () => {
          spend(lawyer);
          if (Math.random() < 0.7) toast('Your lawyer got the fine dropped!', 'good', IMG.i3d('audit'));
          else { spend(fine); toast('The lawyer lost. You paid the fine too.', 'bad', IMG.i3d('audit')); }
        } },
        { label: `Pay the fine (${money(fine)})`, cls: 'btn-soft', fn: () => spend(fine) },
      ],
    };
  },
  function gala() {
    const gift = S.cash * 0.05;
    if (gift < 100) return null;
    return {
      img: 'gala', title: 'Charity Gala',
      html: "You're invited to the city's biggest charity gala. A generous donation would do wonders for your image.",
      buttons: [
        { label: `Donate ${money(gift)} (×1.5 income, 3 min)`, cls: 'btn-green', fn: () => { spend(gift); addBoost('Good Press', 'gala', 1.5, 180); } },
        { label: 'Stay home', cls: 'btn-soft' },
      ],
    };
  },
  function tip() {
    const d = pick(STOCKS), st = S.stocks[d.sym];
    const real = Math.random() < 0.7;
    st.trend = (real ? 1 : -1) * 0.012 * (d.vol / 0.02);
    st.tt = 12;
    return {
      img: 'tip', title: 'Hot Tip',
      html: `A friend at a big bank whispers: <i>"${d.name} (${d.sym}) is about to take off. You didn't hear it from me."</i><br><span class="tiny muted">Tips are usually right… usually.</span>`,
      buttons: [
        { label: 'Open the Market', cls: 'btn-blue', fn: () => switchTab('market') },
        { label: 'Ignore it', cls: 'btn-soft' },
      ],
    };
  },
  function blackout() {
    if (C.ips < 5) return null;
    const cost = C.ips * 60;
    const buttons = [];
    if (S.cash >= cost) buttons.push({ label: `Rent generators (${money(cost)})`, cls: 'btn-blue', fn: () => { spend(cost); toast('Generators running. Business as usual!', 'good', IMG.i3d('blackout')); } });
    buttons.push({ label: 'Wait it out (×0.5 income, 60s)', cls: 'btn-soft', fn: () => addBoost('Blackout', 'blackout', 0.5, 60) });
    return {
      img: 'blackout', title: 'City Blackout',
      html: 'A power cut hit the whole city! ' + (buttons.length > 1 ? `Rent generators for <b>${money(cost)}</b>, or wait it out at half income for a minute.` : 'Your income is halved for a minute.'),
      buttons,
    };
  },
  function award() {
    const top = topBusiness();
    if (!top) return null;
    return {
      img: 'award', title: 'Business of the Year',
      html: `Your <b>${top.name}</b> just won Business of the Year! Everyone in town wants a piece of it.`,
      buttons: [{ label: 'Celebrate (×3 income, 30s)', cls: 'btn-green', fn: () => { addBoost('Award', 'award', 3, 30); confetti(40); } }],
    };
  },
];

// Profile "Fortune" breakdown
const FORTUNE = [
  { label: 'Cash',        color: '#2F7CF6', val: () => S.cash },
  { label: 'Businesses',  color: '#EE4459', val: () => C.bizVal },
  { label: 'Stocks',      color: '#F59E3B', val: () => C.stockVal },
  { label: 'Real estate', color: '#8B5CF6', val: () => C.propVal },
  { label: 'Lifestyle',   color: '#18B26B', val: () => C.luxVal },
];

const byKey = (arr, key) => { const m = {}; arr.forEach(x => { m[x[key]] = x; }); return m; };
const BIZ = byKey(BUSINESSES, 'id');
const UPG = byKey(UPGRADES, 'id');
const STK = byKey(STOCKS, 'sym');
const PROP = byKey(PROPERTIES, 'id');
const LUX = byKey(LUXURY, 'id');

const IMG = {
  biz: id => `img/biz/${id}.webp`,
  prop: id => `img/prop/${id}.webp`,
  lux: id => `img/lux/${id}.webp`,
  i3d: key => `img/3d/${key}.webp`,
  avatar: i => `img/avatar/${i}.svg`,
  stock: sym => `img/stock/${sym}.svg`,
};

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => Math.floor(rand(a, b + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const isObj = o => !!o && typeof o === 'object' && !Array.isArray(o);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function gauss() {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
const LONG = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion'];
function fmt(n) {
  if (!isFinite(n)) return '∞';
  const neg = n < 0;
  n = Math.abs(n);
  let s;
  if (n < 1000) {
    s = (n < 100 && n % 1 !== 0) ? n.toFixed(n < 10 ? 2 : 1) : String(Math.floor(n));
  } else {
    const i = Math.floor(Math.log10(n) / 3);
    if (i >= SUFFIXES.length) s = n.toExponential(2);
    else {
      const v = n / Math.pow(1000, i);
      s = (v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : String(Math.floor(v))) + SUFFIXES[i];
    }
  }
  return (neg ? '-' : '') + s;
}
const money = n => (n < 0 ? '-$' : '$') + fmt(Math.abs(n));
const signed = n => (n >= 0 ? '+' : '-') + money(Math.abs(n));
const price2 = n => '$' + (n < 1000 ? n.toFixed(2) : fmt(n));

// The big balance: cents below a million, then "1.234 Million" style
function cashHTML(n) {
  if (n < 1e6) return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const i = Math.floor(Math.log10(n) / 3);
  if (i >= LONG.length) return '$' + n.toExponential(3);
  return '$' + (n / Math.pow(1000, i)).toFixed(3) + `<span class="unit">${LONG[i]}</span>`;
}

function fmtTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), r = s % 60;
  if (d) return `${d}d ${h}h`;
  if (h) return `${h}h ${m}m`;
  if (m) return `${m}m ${r}s`;
  return `${r}s`;
}
function fmtClock(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

// Line icons come from icons.js (Tabler). Missing icons render as empty space.
function ico(name, cls) {
  const body = (window.ICONS && window.ICONS[name]) || '';
  return `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}
// Pictures fade to their placeholder background if a file is missing.
function pic(src, cls, alt) {
  return `<img class="${cls || ''}" src="${src}" alt="${esc(alt || '')}" draggable="false" loading="lazy" decoding="async" onerror="this.onerror=null;this.classList.add('broken')">`;
}

// Only touch the DOM when a value actually changes.
function set(el, v) { if (el && el._v !== v) { el._v = v; el.textContent = v; } }
function setHTML(el, v) { if (el && el._h !== v) { el._h = v; el.innerHTML = v; } }
function setCls(el, v) { if (el && el._c !== v) { el._c = v; el.className = v; } }
function setW(el, v) { if (el && el._w !== v) { el._w = v; el.style.width = v; } }
function setSrc(el, v) { if (el && el._s !== v) { el._s = v; el.src = v; } }
function cls(el, c, on) { if (el) el.classList.toggle(c, !!on); }
function fields(root) { const o = {}; $$('[data-f]', root).forEach(x => { o[x.dataset.f] = x; }); return o; }

// ---------------------------------------------------------------------
// State
// ---------------------------------------------------------------------
const SAVE_KEY = 'pocket-mogul-save-v1';
const OFFLINE_CAP = 4 * 3600; // seconds of offline earnings, max
const STREAK_MAX = 40;        // taps in a row for the full ×2 streak

let S = null;   // everything that gets saved
const C = {};   // numbers derived from S, recomputed every tick
const UI = {
  tab: 'biz', bizQty: 1, stockQty: 1, luxCat: 'garage', keys: {}, refs: {}, queue: [],
  caseUntil: 0, chartsDirty: true, streak: 0, lastTap: 0, coins: 0, dailyShown: '',
};
const E = {};   // cached DOM elements

function newState() {
  const now = Date.now();
  const s = {
    v: 2,
    cash: 0,
    runEarned: 0,
    stars: 0,
    goal: 0,
    titleBest: 0,
    biz: {}, upg: {}, lux: {}, props: {}, stocks: {},
    housing: 1, housingHist: [1],
    boosts: [], news: [],
    life: { earned: 0, taps: 0, prestiges: 0, played: 0, bestIps: 0, profitTrades: 0, tradeProfit: 0 },
    run: { taps: 0, start: now },
    daily: { day: '', streak: 0 },
    settings: { sound: true },
    timers: { event: 0, briefcase: 0, news: 0 },
    seenIntro: false,
    saved: now,
  };
  BUSINESSES.forEach(b => { s.biz[b.id] = { lvl: 0, inv: 0 }; });
  PROPERTIES.forEach(p => { s.props[p.id] = 0; });
  STOCKS.forEach(d => { s.stocks[d.sym] = { price: d.price, fair: d.price, hist: [d.price], own: 0, avg: 0, trend: 0, tt: 0 }; });
  return s;
}

function mergeState(saved) {
  const s = newState();
  if (!isObj(saved)) return s;
  Object.keys(s).forEach(k => {
    if (saved[k] === undefined || saved[k] === null) return;
    if (isObj(s[k]) && isObj(saved[k])) Object.assign(s[k], saved[k]);
    else s[k] = saved[k];
  });
  if (!isFinite(s.cash) || s.cash < 0) s.cash = 0;
  s.boosts.forEach(b => { if (!b.img) b.img = 'fire'; }); // saves from v1 had emoji icons
  return s;
}

function saveGame() {
  if (!S) return;
  S.saved = Date.now();
  const data = JSON.stringify(S);
  try { localStorage.setItem(SAVE_KEY, data); } catch (e) { /* storage unavailable */ }
  try { if (window.AndroidBridge) window.AndroidBridge.save(data); } catch (e) { /* not in the app */ }
}
window.saveGame = saveGame;

function loadGame() {
  const found = [];
  try { const a = localStorage.getItem(SAVE_KEY); if (a) found.push(JSON.parse(a)); } catch (e) { /* ignore */ }
  try { if (window.AndroidBridge) { const b = window.AndroidBridge.load(); if (b) found.push(JSON.parse(b)); } } catch (e) { /* ignore */ }
  found.sort((x, y) => (y.saved || 0) - (x.saved || 0));
  return found[0] || null;
}

function wipeSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
  try { if (window.AndroidBridge) window.AndroidBridge.save(''); } catch (e) { /* ignore */ }
}

// ---------------------------------------------------------------------
// Economy
// ---------------------------------------------------------------------
const lvl = id => S.biz[id].lvl;
const upgCount = () => Object.keys(S.upg).filter(k => S.upg[k]).length;
const propCount = () => PROPERTIES.reduce((a, p) => a + S.props[p.id], 0);
const streakMult = () => 1 + UI.streak / STREAK_MAX;

function upgMult(type, target) {
  let m = 1;
  for (const u of UPGRADES) {
    if (S.upg[u.id] && u.type === type && (target === undefined || u.target === target)) m *= u.mult;
  }
  return m;
}
function milestoneMult(l) { let m = 1; for (const x of MILESTONES) if (l >= x) m *= 2; return m; }
function nextMilestone(l) { return MILESTONES.find(x => l < x) || null; }
function prevMilestone(l) { let p = 0; for (const x of MILESTONES) if (l >= x) p = x; return p; }

function bizCost(b, n) {
  const r = BIZ_GROWTH;
  return b.cost * Math.pow(r, lvl(b.id)) * (Math.pow(r, n) - 1) / (r - 1);
}
function bizMaxAffordable(b) {
  const r = BIZ_GROWTH, base = b.cost * Math.pow(r, lvl(b.id));
  let n = Math.floor(Math.log(S.cash * (r - 1) / base + 1) / Math.log(r));
  while (n > 0 && bizCost(b, n) > S.cash) n--;
  return Math.max(0, n);
}
function bizQty(b) { return UI.bizQty === 'max' ? Math.max(1, bizMaxAffordable(b)) : UI.bizQty; }

function propPrice(p) { return p.price * Math.pow(PROP_GROWTH, S.props[p.id]) * S.housing; }
function propSellPrice(p) {
  const n = S.props[p.id];
  return n ? p.price * Math.pow(PROP_GROWTH, n - 1) * S.housing * (1 - PROP_FEE) : 0;
}
function propValue(p) {
  const n = S.props[p.id];
  return n ? p.price * S.housing * (1 - PROP_FEE) * (Math.pow(PROP_GROWTH, n) - 1) / (PROP_GROWTH - 1) : 0;
}

function starsAvailable() { return Math.floor(3 * Math.sqrt(S.runEarned / 1e9)); }
function earnedForStars(n) { return Math.pow(n / 3, 2) * 1e9; }

function topBusiness() {
  let best = null;
  for (const b of BUSINESSES) if (lvl(b.id) > 0 && (!best || C.bizInc[b.id] > C.bizInc[best.id])) best = b;
  return best;
}

function recompute() {
  const now = Date.now();
  S.boosts = S.boosts.filter(b => b.until > now);
  C.rep = LUXURY.reduce((a, l) => a + (S.lux[l.id] ? l.rep : 0), 0);
  let boost = 1;
  S.boosts.forEach(b => { boost *= b.mult; });
  C.gm = (1 + C.rep / 100) * (1 + S.stars * 0.05) * boost * upgMult('all');
  C.allBiz = upgMult('allbiz') * C.gm;
  C.bizInc = {};
  let biz = 0;
  for (const b of BUSINESSES) {
    const l = lvl(b.id);
    const v = l ? b.income * l * milestoneMult(l) * upgMult('biz', b.id) * C.allBiz : 0;
    C.bizInc[b.id] = v;
    biz += v;
  }
  C.rentMult = upgMult('rent') * C.gm;
  const rent = PROPERTIES.reduce((a, p) => a + S.props[p.id] * p.rent * C.rentMult, 0);
  C.bizIps = biz;
  C.rentIps = rent;
  C.ips = biz + rent;
  C.tap = (C.gm + C.ips * 0.04) * upgMult('hustle');
  C.stockVal = STOCKS.reduce((a, d) => a + S.stocks[d.sym].own * S.stocks[d.sym].price, 0);
  C.propVal = PROPERTIES.reduce((a, p) => a + propValue(p), 0);
  C.bizVal = BUSINESSES.reduce((a, b) => a + S.biz[b.id].inv * 0.5, 0);
  C.luxVal = LUXURY.reduce((a, l) => a + (S.lux[l.id] ? l.cost * 0.5 : 0), 0);
  C.net = S.cash + C.stockVal + C.propVal + C.bizVal + C.luxVal;
  let ti = 0;
  TITLES.forEach((t, i) => { if (C.net >= t[0]) ti = i; });
  C.titleIdx = ti;
  C.stars = starsAvailable();
}

function earn(x) {
  if (!(x > 0)) return;
  S.cash += x;
  S.runEarned += x;
  S.life.earned += x;
}
function spend(x) { S.cash = Math.max(0, S.cash - x); }
const canPay = cost => cost <= S.cash * (1 + 1e-9);

function addBoost(name, img, mult, sec) {
  const until = Date.now() + sec * 1000;
  const ex = S.boosts.find(b => b.name === name);
  if (ex) ex.until = Math.max(ex.until, until);
  else S.boosts.push({ name, img, mult, until });
  toast(`${name}: income ×${mult} for ${fmtTime(sec)}`, mult >= 1 ? 'gold' : 'bad', IMG.i3d(img));
}

// ---------------------------------------------------------------------
// Player actions
// ---------------------------------------------------------------------
function hustle(x, y) {
  UI.streak = Math.min(STREAK_MAX, UI.streak + 1);
  UI.lastTap = Date.now();
  const v = C.tap * streakMult();
  earn(v);
  S.run.taps++;
  S.life.taps++;
  floatText('+' + money(v), x + rand(-16, 16), y - 14);
  flyCoin(x, y);
  ripple(E.earnCard, x, y);
  replay(E.hustle, 'pop');
  bump(E.cash);
  SFX.tap();
}

function buyBiz(id) {
  const b = BIZ[id], n = bizQty(b), cost = bizCost(b, n);
  if (!canPay(cost)) return false;
  spend(cost);
  const st = S.biz[id], before = st.lvl;
  st.lvl += n;
  st.inv += cost;
  const hit = MILESTONES.filter(x => before < x && st.lvl >= x);
  if (before === 0) {
    toast(`You opened a ${b.name}! ${b.tag}.`, 'good', IMG.biz(id));
    confetti(30);
  } else if (hit.length) {
    toast(`${b.name} reached Lv ${hit[hit.length - 1]}: income ×${Math.pow(2, hit.length)}!`, 'gold', IMG.biz(id));
  }
  SFX.buy();
  return true;
}

function buyUpg(id) {
  const u = UPG[id];
  if (S.upg[id] || !canPay(u.cost)) return false;
  spend(u.cost);
  S.upg[id] = true;
  toast(`${u.name}: ${u.desc}`, 'gold', IMG.i3d(id));
  SFX.buy();
  return true;
}

function stockBuyQty(d) {
  const unit = S.stocks[d.sym].price * (1 + STOCK_FEE);
  const max = Math.floor(S.cash / unit);
  if (UI.stockQty === 'max') return max;
  if (UI.stockQty === 'pct') return Math.floor(max * 0.25);
  return UI.stockQty;
}
function stockSellQty(d) {
  const own = S.stocks[d.sym].own;
  if (UI.stockQty === 'max') return own;
  if (UI.stockQty === 'pct') return Math.ceil(own * 0.25);
  return Math.min(UI.stockQty, own);
}

function buyStock(sym) {
  const d = STK[sym], st = S.stocks[sym], n = stockBuyQty(d);
  if (n < 1) return false;
  const cost = n * st.price * (1 + STOCK_FEE);
  if (!canPay(cost)) return false;
  spend(cost);
  st.avg = (st.avg * st.own + cost) / (st.own + n);
  st.own += n;
  SFX.buy();
  return true;
}

function sellStock(sym) {
  const d = STK[sym], st = S.stocks[sym], n = stockSellQty(d);
  if (n < 1) return false;
  const got = n * st.price * (1 - STOCK_FEE);
  const profit = got - n * st.avg;
  st.own -= n;
  if (st.own <= 0) { st.own = 0; st.avg = 0; }
  S.cash += got;
  S.life.tradeProfit += profit;
  if (profit > 0) {
    S.runEarned += profit;
    S.life.earned += profit;
    S.life.profitTrades++;
    toast(`Sold ${fmt(n)} ${sym} for a ${money(profit)} profit!`, 'good', IMG.stock(sym));
    SFX.cash();
  } else {
    toast(`Sold ${fmt(n)} ${sym} at a ${money(-profit)} loss`, 'bad', IMG.stock(sym));
    SFX.buy();
  }
  return true;
}

function buyProp(id) {
  const p = PROP[id], cost = propPrice(p);
  if (!canPay(cost)) return false;
  spend(cost);
  S.props[id]++;
  if (S.props[id] === 1) { toast(`You bought your first ${p.name}!`, 'good', IMG.prop(id)); confetti(24); }
  SFX.buy();
  return true;
}

function sellProp(id) {
  const p = PROP[id];
  if (!S.props[id]) return false;
  S.cash += propSellPrice(p);
  S.props[id]--;
  SFX.cash();
  return true;
}

function buyLux(id) {
  const l = LUX[id];
  if (S.lux[id] || !canPay(l.cost)) return false;
  spend(l.cost);
  S.lux[id] = true;
  toast(`${l.name} is yours! +${l.rep} reputation`, 'gold', IMG.lux(id));
  SFX.cash();
  confetti(36);
  return true;
}

function claimGoal() {
  const g = GOALS[S.goal];
  if (!g || !g.check()) return null;
  earn(g.reward);
  S.goal++;
  toast(`Goal complete! +${money(g.reward)}`, 'good', IMG.i3d('target'));
  SFX.cash();
  confetti(24);
  return true;
}

function askPrestige() {
  const gain = starsAvailable();
  if (gain < 1) {
    toast(`Earn ${money(earnedForStars(1) - S.runEarned)} more in this life first`, 'bad', IMG.i3d('hourglass'));
    return false;
  }
  const total = S.stars + gain;
  showModal({
    img: 'baby', title: 'Pass the empire on?',
    html: `Your heir starts over with <b>$0</b>, but inherits <b class="t-gold">${fmt(gain)} Legacy Stars</b>.<br><br>` +
      `Stars: ${fmt(S.stars)} → <b>${fmt(total)}</b> (<b class="t-green">+${fmt(total * 5)}%</b> income forever)<br><br>` +
      '<span class="small muted">Businesses, boosts, shares, properties and lifestyle items are all reset.</span>',
    buttons: [
      { label: `Retire (+${fmt(gain)} stars)`, cls: 'btn-gold', fn: doPrestige },
      { label: 'Not yet', cls: 'btn-soft' },
    ],
  });
  return true;
}

function doPrestige() {
  const gain = starsAvailable();
  if (gain < 1) return;
  const old = S, n = newState();
  n.stars = old.stars + gain;
  n.goal = old.goal;
  n.life = old.life;
  n.life.prestiges++;
  n.daily = old.daily;
  n.settings = old.settings;
  n.seenIntro = true;
  // the stock and housing markets keep running between generations
  STOCKS.forEach(d => {
    const o = old.stocks[d.sym];
    Object.assign(n.stocks[d.sym], { price: o.price, fair: o.fair, hist: o.hist, trend: o.trend, tt: o.tt });
  });
  n.housing = old.housing;
  n.housingHist = old.housingHist;
  n.news = old.news;
  n.timers = old.timers;
  S = n;
  afterReset();
  showModal({
    img: 'crown', title: 'A new generation begins',
    html: `You now have <b class="t-gold">${fmt(S.stars)} Legacy Stars</b>, boosting all income by <b class="t-green">+${fmt(S.stars * 5)}%</b>.<br>Time to build an even bigger empire!`,
    buttons: [{ label: "Let's go!", cls: 'btn-green' }],
  });
  SFX.cash();
  confetti(90);
}

function askReset() {
  showModal({
    img: 'warning', title: 'Reset everything?',
    html: 'This deletes your whole save, including Legacy Stars. It cannot be undone.',
    buttons: [
      { label: 'Yes, delete my save', cls: 'btn-red-o', fn: () => {
        wipeSave();
        S = newState();
        S.seenIntro = true;
        warmUpMarkets();
        afterReset();
        toast('New game started. Good luck!', 'good', IMG.i3d('rocket'));
      } },
      { label: 'Cancel', cls: 'btn-soft' },
    ],
  });
  return true;
}

function afterReset() {
  UI.keys = {};
  recompute();
  saveGame();
  switchTab('biz');
}

function toggleSound() {
  S.settings.sound = !S.settings.sound;
  if (S.settings.sound) SFX.buy();
  return true;
}

function showCredits() {
  const list = window.CREDITS || [];
  const html = list.length
    ? '<p class="small">Photos were cropped and resized for the game. Thank you to everyone who shared their work!</p>' +
      '<div class="credits">' + list.map(c => `<div class="cr"><b>${esc(c.title || c.what || '')}</b>` +
        (c.author ? `<span>${esc(c.author)}</span>` : '') +
        `<span class="tiny muted">${esc(c.license || '')}${c.file ? ' · ' + esc(c.file) : ''}</span>` +
        (c.source ? `<span class="tiny muted">${esc(c.source)}</span>` : '') + '</div>').join('') + '</div>'
    : 'No credits found.';
  showModal({ img: 'star', title: 'Image credits', html, buttons: [{ label: 'Close', cls: 'btn-blue' }] });
  return true;
}

// ---------------------------------------------------------------------
// Markets, news, events, the bonus briefcase, offline earnings, daily bonus
// ---------------------------------------------------------------------
function marketTick() {
  for (const d of STOCKS) {
    const st = S.stocks[d.sym];
    st.fair *= 1.00005; // the economy slowly grows
    let drift = 0.03 * Math.log(st.fair / st.price); // prices drift back toward fair value
    if (st.tt > 0) { drift += st.trend; st.tt--; }
    st.price = Math.max(0.01, st.price * Math.exp(drift + gauss() * d.vol));
    st.hist.push(st.price);
    if (st.hist.length > 60) st.hist.shift();
  }
  S.housing = Math.min(1.8, Math.max(0.6, S.housing * Math.exp(0.006 * Math.log(1 / S.housing) + gauss() * 0.009)));
  S.housingHist.push(S.housing);
  if (S.housingHist.length > 60) S.housingHist.shift();
  UI.chartsDirty = true;
}

function warmUpMarkets() {
  for (let i = 0; i < 59; i++) marketTick();
}

function newsTick(now) {
  if (now < S.timers.news) return;
  S.timers.news = now + rand(35000, 75000);
  const d = pick(STOCKS), st = S.stocks[d.sym];
  const good = Math.random() < 0.55;
  st.trend = (good ? 1 : -1) * rand(0.006, 0.012) * (d.vol / 0.02);
  st.tt = randInt(8, 14);
  const text = pick(good ? NEWS_GOOD : NEWS_BAD).replace('{n}', d.name);
  S.news.unshift({ text, good, sym: d.sym, t: now });
  if (S.news.length > 5) S.news.length = 5;
  if (UI.tab === 'market' || st.own > 0) toast(text, good ? 'good' : 'bad', IMG.i3d(good ? 'chart-up' : 'chart-down'));
}

function eventTick(now) {
  if (now < S.timers.event || modalOpen() || document.hidden) return;
  S.timers.event = now + rand(150000, 300000);
  if (S.life.earned < 1000) { S.timers.event = now + 30000; return; }
  for (let i = 0; i < 6; i++) {
    const ev = pick(EVENTS)();
    if (ev) { showModal(ev); SFX.event(); return; }
  }
}

function briefcaseTick(now) {
  if (UI.caseUntil && now > UI.caseUntil) { E.briefcase.classList.add('hidden'); UI.caseUntil = 0; }
  if (now < S.timers.briefcase || UI.caseUntil || modalOpen() || document.hidden) return;
  S.timers.briefcase = now + rand(70000, 160000);
  if (S.life.earned < 200) return;
  const r = E.main.getBoundingClientRect();
  E.briefcase.style.left = (r.left + rand(16, Math.max(20, r.width - 88))) + 'px';
  E.briefcase.style.top = (r.top + rand(16, Math.max(20, r.height - 88))) + 'px';
  E.briefcase.classList.remove('hidden');
  UI.caseUntil = now + 9000;
}

function openBriefcase(e) {
  e.preventDefault();
  E.briefcase.classList.add('hidden');
  UI.caseUntil = 0;
  if (Math.random() < 0.65) {
    const amt = Math.max(50, C.ips * 60 + C.tap * 15);
    earn(amt);
    floatText('+' + money(amt), e.clientX, e.clientY);
    toast(`Bonus briefcase: ${money(amt)}!`, 'gold', IMG.i3d('briefcase'));
    for (let i = 0; i < 6; i++) setTimeout(() => flyCoin(e.clientX + rand(-20, 20), e.clientY + rand(-20, 20)), i * 60);
  } else {
    addBoost('Lucky Streak', 'lucky', 3, 30);
  }
  SFX.cash();
  recompute();
  render();
}

function grantOffline(sec, popup) {
  recompute();
  const t = Math.min(sec, OFFLINE_CAP);
  const amt = C.ips * t;
  if (amt <= 0) return;
  earn(amt);
  if (!popup) return;
  showModal({
    img: 'moon', title: 'Welcome back!',
    html: `You were away for <b>${fmtTime(sec)}</b>.<br>Your empire earned <b class="t-green">${money(amt)}</b> while you were gone.` +
      (sec > OFFLINE_CAP ? '<br><span class="tiny muted">Offline earnings are capped at 4 hours.</span>' : ''),
    buttons: [{ label: 'Collect', cls: 'btn-green', fn: () => { SFX.cash(); confetti(20); } }],
  });
}

function dayKey(t) {
  const d = new Date(t);
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function checkDaily() {
  const now = Date.now(), today = dayKey(now);
  if (S.daily.day === today || UI.dailyShown === today) return;
  UI.dailyShown = today;
  const streak = S.daily.day === dayKey(now - 864e5) ? S.daily.streak + 1 : 1;
  const step = (streak - 1) % 7 + 1;
  recompute();
  const amt = Math.max(100, C.ips * 120) * Math.min(streak, 7);
  let days = '';
  for (let d = 1; d <= 7; d++) days += `<span class="${d < step ? 'done' : d === step ? 'today' : ''}">${d}</span>`;
  showModal({
    img: 'calendar', title: `Daily bonus · day ${streak}`,
    html: `Come back every day: the bonus grows for 7 days in a row.<div class="days">${days}</div>`,
    buttons: [{ label: `Collect ${money(amt)}`, cls: 'btn-green', fn: () => {
      S.daily = { day: today, streak };
      earn(amt);
      SFX.cash();
      confetti(30);
    } }],
  });
}

// ---------------------------------------------------------------------
// Sound (tiny synth, no audio files needed)
// ---------------------------------------------------------------------
let actx = null;
function tone(freq, dur, type, vol, delay) {
  if (!S || !S.settings.sound) return;
  try {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const t = actx.currentTime + (delay || 0);
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol || 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(actx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch (e) { /* audio not available */ }
}
const SFX = {
  tap: () => tone(520 + UI.streak * 9 + Math.random() * 40, 0.05, 'triangle', 0.035),
  buy: () => { tone(660, 0.07, 'sine', 0.05); tone(990, 0.09, 'sine', 0.05, 0.06); },
  cash: () => { tone(784, 0.08, 'triangle', 0.05); tone(988, 0.08, 'triangle', 0.05, 0.07); tone(1319, 0.14, 'triangle', 0.05, 0.14); },
  no: () => tone(150, 0.14, 'square', 0.025),
  event: () => { tone(440, 0.1, 'sine', 0.05); tone(660, 0.14, 'sine', 0.05, 0.1); },
};

// ---------------------------------------------------------------------
// UI widgets: toasts, modals, effects, charts
// ---------------------------------------------------------------------
function toast(text, kind, img) {
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || '');
  el.innerHTML = (img ? `<img src="${img}" alt="" onerror="this.remove()">` : '') + '<span></span>';
  el.lastChild.textContent = text;
  E.toasts.appendChild(el);
  while (E.toasts.children.length > 3) E.toasts.removeChild(E.toasts.firstChild);
  setTimeout(() => el.classList.add('out'), 2600);
  setTimeout(() => el.remove(), 3000);
}

function floatText(text, x, y) {
  const el = document.createElement('div');
  el.className = 'float';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

// A coin flies from the tap point into the balance card.
function flyCoin(x, y) {
  if (UI.coins > 10) return;
  const r = E.cash.getBoundingClientRect();
  const el = document.createElement('img');
  el.src = IMG.i3d('coin');
  el.className = 'fly-coin';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.setProperty('--tx', (r.left + 24 - x) + 'px');
  el.style.setProperty('--ty', (r.top + r.height / 2 - y) + 'px');
  E.fx.appendChild(el);
  UI.coins++;
  setTimeout(() => { el.remove(); UI.coins--; }, 620);
}

function confetti(n) {
  const colors = ['#2F7CF6', '#18B26B', '#FFC83A', '#EE4459', '#8B5CF6', '#F59E3B'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.className = 'confetti';
    p.style.left = rand(0, 100) + '%';
    p.style.background = pick(colors);
    p.style.setProperty('--dx', rand(-90, 90) + 'px');
    p.style.setProperty('--rot', rand(-720, 720) + 'deg');
    p.style.animationDuration = rand(1.3, 2.3) + 's';
    p.style.animationDelay = rand(0, 0.3) + 's';
    E.fx.appendChild(p);
    setTimeout(() => p.remove(), 2700);
  }
}

function ripple(box, x, y) {
  const r = box.getBoundingClientRect();
  const el = document.createElement('span');
  el.className = 'ripple';
  el.style.left = (x - r.left) + 'px';
  el.style.top = (y - r.top) + 'px';
  box.appendChild(el);
  setTimeout(() => el.remove(), 560);
}

function replay(el, c) {
  el.classList.remove(c);
  void el.offsetWidth;
  el.classList.add(c);
}
function bump(el) {
  el.classList.add('bump');
  clearTimeout(el._bt);
  el._bt = setTimeout(() => el.classList.remove('bump'), 110);
}
const shake = el => replay(el, 'shake');

let modalBack = null; // what the Android back button does while a modal is open
function modalOpen() { return !E.modal.classList.contains('hidden'); }
function showModal(m) {
  if (modalOpen()) { UI.queue.push(m); return; }
  const img = m.imgSrc ? `<img class="m-img round" src="${m.imgSrc}" alt="" onerror="this.classList.add('broken')">`
    : m.img ? `<img class="m-img" src="${IMG.i3d(m.img)}" alt="" onerror="this.remove()">` : '';
  E.modalCard.innerHTML = `${img}<h2>${m.title}</h2><div class="m-body">${m.html}</div><div class="m-btns"></div>`;
  const box = $('.m-btns', E.modalCard);
  m.buttons.forEach(b => {
    const el = document.createElement('button');
    el.className = 'btn wide ' + (b.cls || 'btn-blue');
    el.textContent = b.label;
    el.addEventListener('click', ev => {
      ev.stopPropagation();
      closeModal();
      if (b.fn) b.fn();
      recompute();
      render();
    });
    box.appendChild(el);
  });
  modalBack = m.buttons[m.buttons.length - 1].fn || null;
  E.modal.classList.remove('hidden');
}
function closeModal() {
  E.modal.classList.add('hidden');
  modalBack = null;
  if (UI.queue.length) setTimeout(() => showModal(UI.queue.shift()), 180);
}

// Called by the Android app when the back button is pressed. Return true if handled.
window.handleBack = function () {
  if (modalOpen()) {
    const fn = modalBack;
    closeModal();
    if (fn) fn();
    recompute();
    render();
    return true;
  }
  if (UI.tab !== 'biz') { switchTab('biz'); return true; }
  saveGame();
  return false;
};

function drawSpark(canvas, data, base) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h || data.length < 2) return;
  if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  let min = Math.min.apply(null, data), max = Math.max.apply(null, data);
  if (max - min < 1e-9) { max += 1; min -= 1; }
  const pad = 3;
  const X = i => i / (data.length - 1) * w;
  const Y = v => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
  const up = data[data.length - 1] >= (base === undefined ? data[0] : base);
  ctx.beginPath();
  data.forEach((v, i) => { if (i) ctx.lineTo(X(i), Y(v)); else ctx.moveTo(X(i), Y(v)); });
  ctx.strokeStyle = up ? '#18B26B' : '#EE4459';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, up ? 'rgba(24,178,107,.22)' : 'rgba(238,68,89,.22)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fill();
}

// ---------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------
function switchTab(t) {
  UI.tab = t;
  $$('.tab').forEach(s => s.classList.toggle('active', s.id === 'tab-' + t));
  $$('#nav button').forEach(b => b.classList.toggle('active', b.dataset.tab === t));
  E.main.scrollTop = 0;
  UI.chartsDirty = true;
  render();
}

function render() {
  renderHeader();
  renderGoal();
  renderNav();
  if (UI.tab === 'biz') renderBiz();
  else if (UI.tab === 'market') renderMarket();
  else if (UI.tab === 'prop') renderProp();
  else if (UI.tab === 'life') renderLife();
  else if (UI.tab === 'profile') renderProfile();
}

function renderHeader() {
  const now = Date.now();
  setHTML(E.cash, cashHTML(S.cash));
  set(E.ips, '+' + money(C.ips) + '/s');
  set(E.networth, 'Net worth ' + money(C.net));
  set(E.title, TITLES[C.titleIdx][1]);
  setSrc(E.avatar, IMG.avatar(C.titleIdx));
  set(E.repBadge, fmt(C.rep));
  set(E.starBadge, fmt(S.stars));

  const key = S.boosts.map(b => b.name).join('|');
  if (UI.keys.boosts !== key) {
    UI.keys.boosts = key;
    E.boosts.innerHTML = S.boosts.map(b =>
      `<span class="boost-chip${b.mult < 1 ? ' bad' : ''}">${pic(IMG.i3d(b.img), '', '')}×${b.mult} · <span></span></span>`).join('');
    UI.refs.boostClocks = $$('.boost-chip > span', E.boosts);
  }
  S.boosts.forEach((b, i) => set(UI.refs.boostClocks[i], fmtClock((b.until - now) / 1000)));

  if (C.titleIdx > S.titleBest) {
    S.titleBest = C.titleIdx;
    toast(`You're now a ${TITLES[C.titleIdx][1]}!`, 'gold', IMG.avatar(C.titleIdx));
    SFX.cash();
    if (C.titleIdx >= 3) confetti(60);
  }
}

function renderGoal() {
  const g = GOALS[S.goal];
  cls(E.goal, 'hidden', !g);
  if (!g) return;
  const done = g.check();
  set(E.goalText, g.text);
  set(E.goalReward, (done ? 'Claim ' : '') + money(g.reward));
  cls(E.goal, 'done', done);
}

function visibleUpgrades() {
  return UPGRADES.filter(u => !S.upg[u.id] &&
    (u.type !== 'biz' || lvl(u.target) > 0) &&
    (u.type !== 'rent' || propCount() > 0)).slice(0, 5);
}

function renderNav() {
  cls(E['dot-biz'], 'on', visibleUpgrades().some(u => u.cost <= S.cash));
  cls(E['dot-life'], 'on', LUXURY.some(l => !S.lux[l.id] && l.cost <= S.cash));
  cls(E['dot-profile'], 'on', C.stars >= 1);
}

// ----- Business tab -----
function highestOwned() {
  let hi = -1;
  BUSINESSES.forEach((b, i) => { if (lvl(b.id) > 0) hi = i; });
  return hi;
}

function buildBizList(hi) {
  const full = Math.min(BUSINESSES.length, hi + 2); // owned ones + the next to open
  let html = '';
  for (let i = 0; i < full; i++) {
    const b = BUSINESSES[i];
    html += `<div class="card biz-card" data-id="${b.id}">
      <div class="thumb">${pic(IMG.biz(b.id), '', b.name)}<span class="lvl" data-f="lvl"></span></div>
      <div class="grow">
        <div class="name">${b.name}</div>
        <div class="inc" data-f="inc"></div>
        <div class="ms"><div class="bar"><i data-f="bar"></i></div><span data-f="ms"></span></div>
      </div>
      <button class="btn btn-blue" data-act="biz" data-id="${b.id}" data-f="btn"><small data-f="q"></small><b data-f="cost"></b></button>
    </div>`;
  }
  if (full < BUSINESSES.length) {
    html += `<div class="card biz-card locked">
      <div class="thumb">${pic(IMG.biz(BUSINESSES[full].id), 'blur', '')}<span class="lock">${ico('lock')}</span></div>
      <div class="grow"><div class="name">Next business</div>
        <div class="tiny muted">Open a ${BUSINESSES[full - 1].name} to reveal it</div></div>
    </div>`;
  }
  E.bizList.innerHTML = html;
  UI.refs.biz = $$('.biz-card[data-id]', E.bizList).map(el => ({ b: BIZ[el.dataset.id], f: fields(el) }));
}

function renderBiz() {
  set(E.tapVal, money(C.tap * streakMult()));
  set(E.streakLbl, 'Streak ×' + streakMult().toFixed(2));
  setW(E.streakBar, (UI.streak / STREAK_MAX * 100) + '%');

  const ups = visibleUpgrades();
  const key = ups.map(u => u.id).join(',');
  if (UI.keys.upg !== key) {
    UI.keys.upg = key;
    E.upgrades.innerHTML = ups.length
      ? ups.map((u, i) => `<button class="boost-card" data-act="upg" data-id="${u.id}">
          <span class="b-ico tint-${UPGRADES.indexOf(u) % 6}">${pic(IMG.i3d(u.id), '', '')}</span>
          <b>${u.name}</b><span class="tiny muted">${u.desc}</span>
          <span class="price-pill">${money(u.cost)}</span></button>`).join('')
      : '<div class="empty">No boosts right now. Grow your empire to unlock more!</div>';
    UI.refs.upg = $$('.boost-card', E.upgrades).map(el => ({ el, u: UPG[el.dataset.id] }));
  }
  UI.refs.upg.forEach(r => cls(r.el, 'off', r.u.cost > S.cash));
  set(E.boostNote, upgCount() + ' of ' + UPGRADES.length + ' owned');

  const hi = highestOwned();
  if (UI.keys.biz !== hi) { UI.keys.biz = hi; buildBizList(hi); }
  UI.refs.biz.forEach(r => {
    const b = r.b, l = lvl(b.id), n = bizQty(b), cost = bizCost(b, n);
    const nm = nextMilestone(l), pm = prevMilestone(l);
    set(r.f.lvl, l ? 'Lv ' + l : 'NEW');
    cls(r.f.lvl, 'new', !l);
    set(r.f.inc, l ? money(C.bizInc[b.id]) + ' /s' : b.tag);
    cls(r.f.inc, 'tagline', !l);
    setW(r.f.bar, (nm ? (l - pm) / (nm - pm) * 100 : 100) + '%');
    set(r.f.ms, nm ? `Lv ${nm} ×2` : 'Maxed');
    set(r.f.q, l ? 'Buy ×' + n : 'Open');
    set(r.f.cost, money(cost));
    cls(r.f.btn, 'off', cost > S.cash);
  });
}

// ----- Market tab -----
function buildStocks() {
  E.stockList.innerHTML = STOCKS.map(d => `<div class="card stock-card" data-sym="${d.sym}">
    <div class="row">
      ${pic(IMG.stock(d.sym), 'logo', d.sym)}
      <div class="grow"><div class="name">${d.name}</div><div class="tiny muted" data-f="sub"></div></div>
      <canvas data-f="chart"></canvas>
      <div class="px"><b data-f="price"></b><span class="chg" data-f="chg"></span></div>
    </div>
    <div class="row trade">
      <div class="grow hold" data-f="hold"></div>
      <button class="btn btn-red-o" data-act="sellStock" data-id="${d.sym}" data-f="sell"><small data-f="sq"></small><b data-f="sv"></b></button>
      <button class="btn btn-blue" data-act="buyStock" data-id="${d.sym}" data-f="buy"><small data-f="bq"></small><b data-f="bv"></b></button>
    </div>
  </div>`).join('');
  UI.refs.stocks = $$('.stock-card', E.stockList).map(el => ({ d: STK[el.dataset.sym], f: fields(el) }));
  UI.chartsDirty = true;
}

function renderMarket() {
  const now = Date.now();
  if (!UI.keys.stocks) { UI.keys.stocks = 1; buildStocks(); }
  setHTML(E.news, S.news.length
    ? S.news.map(n => `<div class="news-row"><span class="nw-ico ${n.good ? 'up' : 'down'}">${ico(n.good ? 'up' : 'down')}</span>` +
        `<div class="grow"><div class="small">${esc(n.text)}</div><div class="tiny muted">${fmtTime((now - n.t) / 1000)} ago</div></div></div>`).join('')
    : '<div class="small muted">Waiting for the first headlines…</div>');

  let pl = 0;
  UI.refs.stocks.forEach(r => {
    const st = S.stocks[r.d.sym];
    const ch = (st.price / st.hist[0] - 1) * 100;
    set(r.f.price, price2(st.price));
    set(r.f.chg, (ch >= 0 ? '+' : '−') + Math.abs(ch).toFixed(1) + '%');
    setCls(r.f.chg, 'chg ' + (ch >= 0 ? 'up' : 'down'));
    set(r.f.sub, r.d.sym + (st.own ? ' · you own ' + fmt(st.own) : ''));
    const gain = st.own * (st.price * (1 - STOCK_FEE) - st.avg);
    pl += gain;
    setHTML(r.f.hold, st.own
      ? `Worth <b>${money(st.own * st.price)}</b><br>P/L <b class="${gain >= 0 ? 'up' : 'down'}">${signed(gain)}</b>`
      : 'No shares yet');

    const bq = stockBuyQty(r.d), bn = Math.max(1, bq), bcost = bn * st.price * (1 + STOCK_FEE);
    set(r.f.bq, 'Buy ' + fmt(bn));
    set(r.f.bv, money(bcost));
    cls(r.f.buy, 'off', bq < 1 || bcost > S.cash);

    const sq = stockSellQty(r.d);
    set(r.f.sq, sq ? 'Sell ' + fmt(sq) : 'Sell');
    set(r.f.sv, sq ? money(sq * st.price * (1 - STOCK_FEE)) : '—');
    cls(r.f.sell, 'off', sq < 1);

    if (UI.chartsDirty) drawSpark(r.f.chart, st.hist);
  });
  UI.chartsDirty = false;

  setHTML(E.portfolio,
    `<div class="pf-top"><div><div class="eyebrow">Portfolio value</div><div class="big-num">${money(C.stockVal)}</div></div>` +
    `${pic(IMG.i3d(pl >= 0 ? 'chart-up' : 'chart-down'), '', '')}</div>` +
    `<div class="pf-row"><span>Open profit / loss</span><b class="${pl >= 0 ? 'up' : 'down'}">${signed(pl)}</b></div>` +
    `<div class="pf-row"><span>Trading profit, all time</span><b class="${S.life.tradeProfit >= 0 ? 'up' : 'down'}">${signed(S.life.tradeProfit)}</b></div>`);
}

// ----- Property tab -----
function buildProps() {
  E.propList.innerHTML = PROPERTIES.map(p => `<div class="card photo-card" data-id="${p.id}">
    <div class="photo">${pic(IMG.prop(p.id), '', p.name)}
      <span class="owned-badge" data-f="own"></span>
      <div class="photo-cap"><div class="pc-name">${p.name}</div><div class="pc-loc">${ico('pin')}${p.loc}</div></div>
    </div>
    <div class="pc-body">
      <div class="pc-stats">
        <div>Rent<b class="t-green" data-f="rent"></b></div>
        <div>Pays back in<b data-f="payback"></b></div>
      </div>
      <div class="pc-btns">
        <button class="btn btn-red-o" data-act="sellProp" data-id="${p.id}" data-f="sell"><small>Sell</small><b data-f="sp"></b></button>
        <button class="btn btn-blue" data-act="buyProp" data-id="${p.id}" data-f="buy"><small>Buy</small><b data-f="bp"></b></button>
      </div>
    </div>
  </div>`).join('');
  UI.refs.props = $$('.photo-card', E.propList).map(el => ({ p: PROP[el.dataset.id], f: fields(el) }));
}

function renderProp() {
  if (!UI.keys.props) { UI.keys.props = 1; buildProps(); }
  const idx = S.housing, pct = (idx - 1) * 100;
  set(E.hIdx, (pct >= 0 ? '+' : '−') + Math.abs(pct).toFixed(1) + '%');
  setCls(E.hIdx, 'big-num ' + (pct >= 0 ? 'up' : 'down'));
  const mood = idx > 1.08 ? ['hot', 'Hot market: sell'] : idx < 0.92 ? ['cold', 'Cold market: buy'] : ['', 'Steady prices'];
  set(E.hMood, mood[1]);
  setCls(E.hMood, 'mood ' + mood[0]);
  if (UI.chartsDirty) { drawSpark(E.hChart, S.housingHist, 1); UI.chartsDirty = false; }
  set(E.rentTotal, money(C.rentIps) + '/s');

  UI.refs.props.forEach(r => {
    const p = r.p, n = S.props[p.id], each = p.rent * C.rentMult, cost = propPrice(p);
    set(r.f.own, n ? 'Owned ×' + n : 'For sale');
    cls(r.f.own, 'has', n > 0);
    set(r.f.rent, money(each) + '/s' + (n ? ' ×' + n : ''));
    set(r.f.payback, fmtTime(cost / each));
    set(r.f.bp, money(cost));
    cls(r.f.buy, 'off', cost > S.cash);
    set(r.f.sp, money(propSellPrice(p)));
    cls(r.f.sell, 'hide', !n);
  });
}

// ----- Lifestyle tab -----
function buildLuxCats() {
  E.luxCats.innerHTML = LUX_CATS.map(c =>
    `<button class="chip-btn" data-act="cat" data-id="${c.id}">${pic(IMG.i3d(c.img), '', '')}<span>${c.name}</span><em data-f="n"></em></button>`).join('');
  UI.refs.cats = $$('.chip-btn', E.luxCats).map(el => ({ el, id: el.dataset.id, f: fields(el) }));
}

function buildLux() {
  E.luxList.innerHTML = LUXURY.filter(l => l.cat === UI.luxCat).map(l => `<div class="card lux-card" data-id="${l.id}">
    <div class="photo">${pic(IMG.lux(l.id), '', l.name)}<span class="price-tag">${money(l.cost)}</span><span class="owned-ribbon">${ico('check')}Owned</span></div>
    <div class="lc-body">
      <div class="lc-name">${l.name}</div>
      <div class="lc-rep">+${l.rep} reputation</div>
      <button class="btn btn-blue" data-act="lux" data-id="${l.id}" data-f="btn">Buy</button>
    </div>
  </div>`).join('');
  UI.refs.lux = $$('.lux-card', E.luxList).map(el => ({ el, l: LUX[el.dataset.id], f: fields(el) }));
}

function renderLife() {
  if (!UI.keys.cats) { UI.keys.cats = 1; buildLuxCats(); }
  if (UI.keys.lux !== UI.luxCat) { UI.keys.lux = UI.luxCat; buildLux(); }
  set(E.repVal, fmt(C.rep));
  set(E.repPct, '+' + fmt(C.rep) + '%');
  UI.refs.cats.forEach(r => {
    const items = LUXURY.filter(l => l.cat === r.id);
    set(r.f.n, items.filter(l => S.lux[l.id]).length + '/' + items.length);
    cls(r.el, 'active', r.id === UI.luxCat);
  });
  UI.refs.lux.forEach(r => {
    const owned = !!S.lux[r.l.id];
    cls(r.el, 'owned', owned);
    set(r.f.btn, owned ? 'Owned' : 'Buy');
    setCls(r.f.btn, owned ? 'btn btn-soft' : 'btn btn-blue' + (r.l.cost > S.cash ? ' off' : ''));
  });
}

// ----- Profile tab -----
function buildProfile() {
  E.stackBar.innerHTML = FORTUNE.map(f => `<i style="background:${f.color}"></i>`).join('');
  E.legend.innerHTML = FORTUNE.map(f => `<div class="lg" style="border-left-color:${f.color}">${f.label}<b></b></div>`).join('');
  UI.refs.fbar = $$('i', E.stackBar);
  UI.refs.flg = $$('.lg b', E.legend);
  const stats = [
    ['cash', 'c-blue', 'Earned this life'], ['world', 'c-green', 'Earned all time'],
    ['bolt', 'c-orange', 'Best income'], ['tap', 'c-purple', 'Coin taps'],
    ['chart-bar', 'c-teal', 'Trading profit'], ['users', 'c-red', 'Generation'],
    ['clock', 'c-blue', 'Time played'], ['calendar', 'c-green', 'Daily streak'],
  ];
  E.stats.innerHTML = stats.map(s => `<div class="st"><span class="st-ico ${s[1]}">${ico(s[0])}</span><div>${s[2]}<b></b></div></div>`).join('');
  UI.refs.stats = $$('.st b', E.stats);
}

function renderProfile() {
  if (!UI.keys.profile) { UI.keys.profile = 1; buildProfile(); }
  setSrc(E.heroAvatar, IMG.avatar(C.titleIdx));
  set(E.heroTitle, TITLES[C.titleIdx][1]);
  set(E.heroSub, `Generation #${S.life.prestiges + 1} · ${fmt(S.stars)} Legacy Stars`);
  set(E.fortune, money(C.net));
  const total = Math.max(1e-9, C.net);
  FORTUNE.forEach((f, i) => {
    const v = f.val();
    setW(UI.refs.fbar[i], (v / total * 100) + '%');
    set(UI.refs.flg[i], money(v));
  });

  const g = C.stars;
  set(E.starCount, fmt(S.stars));
  set(E.starGain, '+' + fmt(g));
  set(E.starBonus, '+' + fmt(S.stars * 5) + '%');
  const need = earnedForStars(g + 1) - S.runEarned;
  set(E.starNext, g < 1
    ? `Earn ${money(need)} more in this life so your heir inherits a star.`
    : `Earn ${money(need)} more in this life for another star.`);
  cls(E.btnPrestige, 'off', g < 1);

  const vals = [money(S.runEarned), money(S.life.earned), money(S.life.bestIps) + '/s', fmt(S.life.taps),
    signed(S.life.tradeProfit), '#' + (S.life.prestiges + 1), fmtTime(S.life.played),
    (S.daily.streak || 0) + (S.daily.streak === 1 ? ' day' : ' days')];
  vals.forEach((v, i) => set(UI.refs.stats[i], v));
  cls(E.btnSound, 'on', S.settings.sound);
}

// ---------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------
let lastTick = Date.now(), lastMarket = Date.now(), lastSave = Date.now(), frame = 0;

function tick() {
  const now = Date.now();
  const dt = (now - lastTick) / 1000;
  lastTick = now;
  if (dt < 0) return;
  if (dt > 10) {
    // the app was asleep or in the background
    grantOffline(dt, dt > 120 && !document.hidden);
    lastMarket = now;
  } else {
    recompute();
    earn(C.ips * dt);
    S.life.played += dt;
  }
  if (UI.streak > 0 && now - UI.lastTap > 900) UI.streak = Math.max(0, UI.streak - 1);
  if (C.ips > S.life.bestIps) S.life.bestIps = C.ips;
  if (now - lastMarket >= 2000) { lastMarket = now; marketTick(); }
  newsTick(now);
  eventTick(now);
  briefcaseTick(now);
  if (now - lastSave > 5000) { lastSave = now; saveGame(); }
  if (++frame % 600 === 0) checkDaily(); // catches midnight while playing
  if (frame % 2 === 0) { recompute(); render(); }
}

function onAction(e) {
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const id = t.dataset.id;
  let ok = true;
  switch (t.dataset.act) {
    case 'biz': ok = buyBiz(id); break;
    case 'upg': ok = buyUpg(id); break;
    case 'buyStock': ok = buyStock(id); break;
    case 'sellStock': ok = sellStock(id); break;
    case 'buyProp': ok = buyProp(id); break;
    case 'sellProp': ok = sellProp(id); break;
    case 'lux': ok = S.lux[id] ? null : buyLux(id); break;
    case 'cat': UI.luxCat = id; break;
    case 'claim': ok = claimGoal(); break;
    case 'goto': switchTab(id); break;
    case 'prestige': ok = askPrestige(); break;
    case 'sound': ok = toggleSound(); break;
    case 'credits': ok = showCredits(); break;
    case 'reset': ok = askReset(); break;
  }
  if (ok === false) { shake(t); SFX.no(); }
  recompute();
  render();
}

function bindSeg(seg, onPick) {
  seg.addEventListener('click', e => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    $$('button', seg).forEach(x => x.classList.toggle('active', x === b));
    const q = b.dataset.q;
    onPick(isNaN(+q) ? q : +q);
    render();
  });
}

function init() {
  $$('[data-ico]').forEach(el => { el.outerHTML = ico(el.dataset.ico); });
  $$('[id]').forEach(el => { E[el.id] = el; });

  const saved = loadGame();
  S = mergeState(saved);
  const now = Date.now();
  S.timers = { event: now + 120000, briefcase: now + 60000, news: now + 15000 };
  if (!saved) warmUpMarkets();
  recompute();

  if (!S.seenIntro) {
    S.seenIntro = true;
    showModal({
      imgSrc: IMG.avatar(0), title: 'Welcome to Pocket Mogul',
      html: "This is you: broke, but with big dreams. Let's change that." +
        '<div class="m-list">' +
        `<div>${pic(IMG.i3d('coin'), '', '')}Tap the coin to earn your first dollars</div>` +
        `<div>${pic(IMG.i3d('bank'), '', '')}Open businesses that earn every second</div>` +
        `<div>${pic(IMG.i3d('chart-up'), '', '')}Trade stocks and buy property</div>` +
        `<div>${pic(IMG.i3d('car'), '', '')}Buy cars, homes and yachts for reputation</div>` +
        `<div>${pic(IMG.i3d('crown'), '', '')}Pass it all to your heir to grow even faster</div>` +
        '</div>',
      buttons: [{ label: "Let's get rich!", cls: 'btn-gold' }],
    });
  } else if (saved) {
    const away = (now - (saved.saved || now)) / 1000;
    if (away > 10) grantOffline(away, away > 60);
  }
  checkDaily();

  E.earnCard.addEventListener('pointerdown', e => { e.preventDefault(); hustle(e.clientX, e.clientY); });
  E.briefcase.addEventListener('pointerdown', openBriefcase);
  document.addEventListener('click', onAction);
  document.addEventListener('contextmenu', e => e.preventDefault());
  $$('#nav button').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
  bindSeg(E.bizQty, q => { UI.bizQty = q; });
  bindSeg(E.stockQty, q => { UI.stockQty = q; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });
  window.addEventListener('pagehide', saveGame);
  window.addEventListener('resize', () => { UI.chartsDirty = true; });

  lastTick = lastMarket = lastSave = Date.now();
  switchTab('biz');
  saveGame();
  setInterval(tick, 100);
}

init();
