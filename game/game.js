'use strict';
/* =====================================================================
   Cash Climb — an idle business tycoon game.
   Tap to hustle, open businesses, trade stocks, buy property, live large,
   then pass your empire to your heir for permanent Legacy Stars.
   Wise play pays: buy the fastest payback, push businesses to their ×2
   milestones and combos, buy stocks when they're undervalued and homes
   when the market is cold, and borrow only for things that pay back.
   ECONOMY.md (project root) explains the numbers.
   The player (name, picture), the header badges and the Profile tab
   live in profile.js, which loads after this file.
   ===================================================================== */

// ---------------------------------------------------------------------
// Game content
// ---------------------------------------------------------------------
// Each business, property and luxury item has a photo at img/<kind>/<id>.webp
const BUSINESSES = [
  { id: 'lemon',  name: 'Lemonade Stand',    tag: 'Fresh-squeezed profits',        cost: 15,      income: 0.6 },
  { id: 'taco',   name: 'Taco Truck',        tag: 'Tacos on wheels',               cost: 180,     income: 5 },
  { id: 'coffee', name: 'Coffee Corner',     tag: 'Caffeine is a business model',  cost: 2200,    income: 40 },
  { id: 'wash',   name: 'Car Wash',          tag: 'Shiny cars, shiny cash',        cost: 3.1e4,   income: 300 },
  { id: 'gym',    name: 'Fitness Club',      tag: 'Members pay, rain or shine',    cost: 6.4e5,   income: 2400 },
  { id: 'tech',   name: 'Tech Startup',      tag: 'Disrupting everything',         cost: 1.3e7,   income: 1.9e4 },
  { id: 'hotel',  name: 'Grand Hotel',       tag: 'Five stars, fifty floors',      cost: 2.7e8,   income: 1.5e5 },
  { id: 'air',    name: 'Airline',           tag: 'Your name across the sky',      cost: 6e9,     income: 1.2e6 },
  { id: 'movie',  name: 'Movie Studio',      tag: 'Blockbusters on demand',        cost: 1.3e11,  income: 9.5e6 },
  { id: 'bank',   name: 'Private Bank',      tag: "Other people's money",          cost: 2.8e12,  income: 7.5e7 },
  { id: 'sat',    name: 'Satellite Network', tag: 'Internet for the whole planet', cost: 6.5e13,  income: 6e8 },
  { id: 'colony', name: 'Space Colony',      tag: 'Real estate, but in orbit',     cost: 1.4e15,  income: 4.8e9 },
];
const MILESTONES = [10, 25, 50, 100, 150, 200, 300, 400, 500]; // each one doubles that business's income
const BIZ_GROWTH = 1.15;

// Combos: when both businesses reach `lvl`, both earn ×mult.
const COMBOS = [
  { id: 'street', name: 'Street Food',      a: 'lemon',  b: 'taco',   lvl: 25, mult: 2 },
  { id: 'drive',  name: 'Drive-Thru',       a: 'coffee', b: 'wash',   lvl: 25, mult: 2 },
  { id: 'fitapp', name: 'Fitness App',      a: 'gym',    b: 'tech',   lvl: 25, mult: 2 },
  { id: 'trips',  name: 'Holiday Packages', a: 'hotel',  b: 'air',    lvl: 25, mult: 2 },
  { id: 'film',   name: 'Film Fund',        a: 'movie',  b: 'bank',   lvl: 25, mult: 2 },
  { id: 'space',  name: 'Space Race',       a: 'sat',    b: 'colony', lvl: 25, mult: 2 },
];

// Boost pictures are img/3d/<id>.webp.
// type: hustle = tap value, biz = one business, allbiz = every business, rent = property rent, all = everything
const UPGRADES = [
  { id: 'shoes',      name: 'Comfy Sneakers',      desc: 'Hustle ×2',            cost: 50,      type: 'hustle', mult: 2 },
  { id: 'flyers',     name: 'Neon Flyers',         desc: 'Lemonade Stand ×3',    cost: 4000,    type: 'biz', target: 'lemon', mult: 3 },
  { id: 'social',     name: 'Social Media Page',   desc: 'All businesses ×1.5',  cost: 1.8e4,   type: 'allbiz', mult: 1.5 },
  { id: 'salsa',      name: 'Secret Salsa',        desc: 'Taco Truck ×3',        cost: 9.5e4,   type: 'biz', target: 'taco', mult: 3 },
  { id: 'course',     name: 'Night-School Course', desc: 'Hustle ×3',            cost: 2.5e5,   type: 'hustle', mult: 3 },
  { id: 'barista',    name: 'Star Barista',        desc: 'Coffee Corner ×3',     cost: 3.1e6,   type: 'biz', target: 'coffee', mult: 3 },
  { id: 'accountant', name: 'Sharp Accountant',    desc: 'Rent income ×2',       cost: 2.9e7,   type: 'rent', mult: 2 },
  { id: 'wax',        name: 'Diamond Wax',         desc: 'Car Wash ×3',          cost: 1.2e8,   type: 'biz', target: 'wash', mult: 3 },
  { id: 'tv',         name: 'TV Commercial',       desc: 'All businesses ×2',    cost: 7.4e8,   type: 'allbiz', mult: 2 },
  { id: 'coach',      name: 'Celebrity Coach',     desc: 'Fitness Club ×3',      cost: 4e9,     type: 'biz', target: 'gym', mult: 3 },
  { id: 'mba',        name: 'MBA Degree',          desc: 'Hustle ×5',            cost: 2.8e10,  type: 'hustle', mult: 5 },
  { id: 'ai',         name: 'AI Co-pilot',         desc: 'Tech Startup ×3',      cost: 1.3e11,  type: 'biz', target: 'tech', mult: 3 },
  { id: 'spa',        name: 'Rooftop Spa',         desc: 'Grand Hotel ×3',       cost: 4.4e12,  type: 'biz', target: 'hotel', mult: 3 },
  { id: 'franchise',  name: 'Global Franchise',    desc: 'All businesses ×2',    cost: 2.4e13,  type: 'allbiz', mult: 2 },
  { id: 'broker',     name: 'Property Broker',     desc: 'Rent income ×3',       cost: 1.7e14,  type: 'rent', mult: 3 },
  { id: 'routes',     name: 'Global Routes',       desc: 'Airline ×3',           cost: 1.7e14,  type: 'biz', target: 'air', mult: 3 },
  { id: 'hit',        name: 'Blockbuster Hit',     desc: 'Movie Studio ×3',      cost: 5.7e15,  type: 'biz', target: 'movie', mult: 3 },
  { id: 'vault',      name: 'Gold Vault',          desc: 'Private Bank ×3',      cost: 1.9e17,  type: 'biz', target: 'bank', mult: 3 },
  { id: 'brand',      name: 'Iconic Brand',        desc: 'All businesses ×3',    cost: 3.8e17,  type: 'allbiz', mult: 3 },
  { id: 'uplink',     name: 'Laser Uplink',        desc: 'Satellite Network ×3', cost: 7e18,    type: 'biz', target: 'sat', mult: 3 },
  { id: 'smart',      name: 'Smart Homes',         desc: 'Rent income ×3',       cost: 1.2e19,  type: 'rent', mult: 3 },
  { id: 'warp',       name: 'Warp Drive',          desc: 'Space Colony ×3',      cost: 3.1e20,  type: 'biz', target: 'colony', mult: 3 },
  { id: 'mindset',    name: 'Mogul Mindset',       desc: 'ALL income ×2',        cost: 6e21,    type: 'all', mult: 2 },
].sort((a, b) => a.cost - b.cost);

// Logos are img/stock/<sym>.svg
// kind: div = pays `div` of its price every minute, growth = fair value climbs over time, crypto = wild swings.
// grow = fair value growth per market tick (2 s), fvol = how much the fair value itself wobbles.
const STOCKS = [
  { sym: 'NVT', name: 'NovaTech',         price: 120, vol: 0.022, kind: 'growth', grow: 6e-5, div: 0 },
  { sym: 'GLE', name: 'GreenLeaf Energy', price: 45,  vol: 0.016, kind: 'div',    grow: 3e-5, div: 0.0015 },
  { sym: 'BYB', name: 'ByteBank',         price: 210, vol: 0.010, kind: 'div',    grow: 3e-5, div: 0.002 },
  { sym: 'SLM', name: 'Starlane Motors',  price: 80,  vol: 0.028, kind: 'growth', grow: 8e-5, div: 0 },
  { sym: 'FZZ', name: 'FizzPop Drinks',   price: 30,  vol: 0.012, kind: 'div',    grow: 2e-5, div: 0.0025 },
  { sym: 'MBT', name: 'MoonBit Crypto',   price: 6,   vol: 0.050, kind: 'crypto', grow: 4e-5, div: 0, fvol: 0.01 },
];
const STOCK_FEE = 0.01;     // per trade
const STOCK_CAP = 120;      // you can hold up to 2 minutes of income in each company
const STOCK_MIN_CAP = 2000; // ...but always at least this much
const REVERT = 0.04;        // how fast a price drifts back to its fair value, per tick
const RATE_GAP = 0.1;       // "Undervalued" / "Overvalued" once the price is 10% off its fair value
const NEWS_TRUTH = 0.8;     // 4 in 5 headlines turn out right

const PROPERTIES = [
  { id: 'studio', name: 'Tiny Studio',     loc: 'Old Town',           price: 3.7e4,   rent: 22 },
  { id: 'house',  name: 'Family House',    loc: 'Maple Suburbs',      price: 8.4e5,   rent: 260 },
  { id: 'apts',   name: 'Apartment Block', loc: 'Riverside',          price: 1.7e7,   rent: 3000 },
  { id: 'mall',   name: 'Shopping Mall',   loc: 'Central Plaza',      price: 4.5e8,   rent: 4.2e4 },
  { id: 'tower',  name: 'Office Tower',    loc: 'Financial District', price: 1.2e10,  rent: 6.2e5 },
  { id: 'resort', name: 'Beach Resort',    loc: 'Coral Bay',          price: 3.6e11,  rent: 9.5e6 },
  { id: 'island', name: 'Private Island',  loc: 'Azure Archipelago',  price: 1.3e13,  rent: 1.8e8 },
];
const PROP_GROWTH = 1.06;
const PROP_FEE = 0.15; // selling fee
const COLD = 0.9, HOT = 1.1; // the housing market is cold below 0.9 and hot above 1.1

// Bank loan, one at a time: borrow up to `share` of your net worth. The `fee` is added up front,
// `rate` interest is added every minute, and `repay` of all income goes to the bank until it's paid back.
const LOAN = { share: 0.25, fee: 0.05, rate: 0.01, repay: 0.25, worth: 1200 }; // worth: a Best deal paying back within 20 min

// Lifestyle collections. The chip picture is img/3d/<img>.webp
const LUX_CATS = [
  { id: 'garage',  name: 'Garage',     img: 'car' },
  { id: 'home',    name: 'Homes',      img: 'house' },
  { id: 'style',   name: 'Style',      img: 'handbag' },
  { id: 'air',     name: 'Aircraft',   img: 'plane' },
  { id: 'sea',     name: 'Yachts',     img: 'boat' },
  { id: 'collect', name: 'Collection', img: 'gem' },
];
const LUXURY = [
  { id: 'sneakers',  cat: 'style',   name: 'Hype Sneakers',       cost: 1000,    rep: 1 },
  { id: 'watch',     cat: 'style',   name: 'Gold Watch',          cost: 2500,    rep: 2 },
  { id: 'bike',      cat: 'garage',  name: 'Motorbike',           cost: 4000,    rep: 2 },
  { id: 'shades',    cat: 'style',   name: 'Designer Shades',     cost: 6000,    rep: 2 },
  { id: 'hatch',     cat: 'garage',  name: 'Used Hatchback',      cost: 8000,    rep: 2 },
  { id: 'loafers',   cat: 'style',   name: 'Leather Loafers',     cost: 1.8e4,   rep: 3 },
  { id: 'suit',      cat: 'style',   name: 'Tailored Suit',       cost: 3.6e4,   rep: 3 },
  { id: 'ev',        cat: 'garage',  name: 'Electric Car',        cost: 5.8e4,   rep: 3 },
  { id: 'jetski',    cat: 'sea',     name: 'Jet Ski',             cost: 9.5e4,   rep: 3 },
  { id: 'sedan',     cat: 'garage',  name: 'Executive Sedan',     cost: 1.5e5,   rep: 4 },
  { id: 'loft',      cat: 'home',    name: 'City Loft',           cost: 3.2e5,   rep: 4 },
  { id: 'guitar',    cat: 'collect', name: 'Vintage Guitar',      cost: 4.9e5,   rep: 4 },
  { id: 'cottage',   cat: 'home',    name: 'Cozy Cottage',        cost: 6.6e5,   rep: 5 },
  { id: 'muscle',    cat: 'garage',  name: 'Muscle Car',          cost: 9.1e5,   rep: 5 },
  { id: 'bag',       cat: 'style',   name: 'Designer Handbag',    cost: 1.2e6,   rep: 5 },
  { id: 'suv',       cat: 'garage',  name: 'Luxury SUV',          cost: 1.7e6,   rep: 5 },
  { id: 'car',       cat: 'garage',  name: 'Sports Car',          cost: 3.1e6,   rep: 6 },
  { id: 'bungalow',  cat: 'home',    name: 'Garden Bungalow',     cost: 6.3e6,   rep: 6 },
  { id: 'chain',     cat: 'style',   name: 'Gold Chain',          cost: 9.1e6,   rep: 6 },
  { id: 'boat',      cat: 'sea',     name: 'Speedboat',           cost: 1.4e7,   rep: 7 },
  { id: 'classic',   cat: 'garage',  name: 'Classic Convertible', cost: 2.9e7,   rep: 7 },
  { id: 'balloon',   cat: 'air',     name: 'Hot-Air Balloon',     cost: 4.4e7,   rep: 8 },
  { id: 'villa',     cat: 'home',    name: 'Modern Villa',        cost: 7.8e7,   rep: 9 },
  { id: 'limo',      cat: 'garage',  name: 'Stretch Limo',        cost: 1.2e8,   rep: 9 },
  { id: 'ring',      cat: 'style',   name: 'Diamond Ring',        cost: 2e8,     rep: 10 },
  { id: 'super',     cat: 'garage',  name: 'Supercar',            cost: 4.2e8,   rep: 11 },
  { id: 'plane',     cat: 'air',     name: 'Propeller Plane',     cost: 7.4e8,   rep: 11 },
  { id: 'lake',      cat: 'home',    name: 'Lake House',          cost: 1.3e9,   rep: 12 },
  { id: 'heli',      cat: 'air',     name: 'Helicopter',          cost: 2.4e9,   rep: 13 },
  { id: 'catamaran', cat: 'sea',     name: 'Catamaran',           cost: 5.1e9,   rep: 14 },
  { id: 'horse',     cat: 'collect', name: 'Racehorse',           cost: 7.7e9,   rep: 14 },
  { id: 'sail',      cat: 'sea',     name: 'Sailing Yacht',       cost: 1.4e10,  rep: 15 },
  { id: 'art',       cat: 'collect', name: 'Famous Painting',     cost: 7.3e10,  rep: 17 },
  { id: 'seaplane',  cat: 'air',     name: 'Seaplane',            cost: 1.8e11,  rep: 18 },
  { id: 'race',      cat: 'garage',  name: 'Race Car',            cost: 2.6e11,  rep: 19 },
  { id: 'penthouse', cat: 'home',    name: 'Sky Penthouse',       cost: 4.7e11,  rep: 20 },
  { id: 'hyper',     cat: 'garage',  name: 'Hypercar',            cost: 2.5e12,  rep: 23 },
  { id: 'chalet',    cat: 'home',    name: 'Ski Chalet',          cost: 7.6e12,  rep: 25 },
  { id: 'jet',       cat: 'air',     name: 'Private Jet',         cost: 1.7e13,  rep: 26 },
  { id: 'fossil',    cat: 'collect', name: 'Dinosaur Skeleton',   cost: 4.6e13,  rep: 28 },
  { id: 'yacht',     cat: 'sea',     name: 'Superyacht',          cost: 1.1e14,  rep: 30 },
  { id: 'mansion',   cat: 'home',    name: 'Beach Mansion',       cost: 7.8e14,  rep: 34 },
  { id: 'club',      cat: 'collect', name: 'Football Club',       cost: 5.7e15,  rep: 40 },
  { id: 'jumbo',     cat: 'air',     name: 'Private Airliner',    cost: 4e16,    rep: 46 },
  { id: 'castle',    cat: 'home',    name: 'Mountain Castle',     cost: 2.8e17,  rep: 52 },
  { id: 'sub',       cat: 'sea',     name: 'Private Submarine',   cost: 1.8e18,  rep: 60 },
  { id: 'diamond',   cat: 'collect', name: 'Legendary Diamond',   cost: 1.2e19,  rep: 70 },
  { id: 'rocket',    cat: 'air',     name: 'Personal Rocket',     cost: 9.1e19,  rep: 85 },
  { id: 'moon',      cat: 'home',    name: 'Moon Mansion',        cost: 6.3e20,  rep: 120 },
];
const SMART_LUX = 600; // a luxury that pays for itself within 10 minutes is a "Smart buy"

// [net worth needed, title]. The player picks their own picture in profile.js.
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
const PITCHES = ['a food-delivery app', 'a solar-panel startup', 'a robot barista', 'a sneaker brand',
  'a pet-tech gadget', 'a VR arcade chain', 'a vertical farm', 'a drone courier service'];

// The path to riches: each step teaches one wise move. tab = where "Show me" goes.
const GOALS = [
  { text: 'Tap the coin 20 times',          reward: 30,    tab: 'biz',    tip: 'Tap fast to build a streak: up to ×2 cash per tap.', check: () => S.life.taps >= 20 },
  { text: 'Open a Lemonade Stand',          reward: 25,    tab: 'biz',    tip: 'Businesses earn every second, even while you are away.', check: () => lvl('lemon') >= 1 },
  { text: 'Buy your first Boost',           reward: 50,    tab: 'biz',    tip: 'Boosts multiply income. Comfy Sneakers doubles every tap.', check: () => upgCount() >= 1 },
  { text: 'Lemonade Stand to Lv 10',        reward: 100,   tab: 'biz',    tip: 'Lv 10, 25, 50, 100… each one doubles that business.', check: () => lvl('lemon') >= 10 },
  { text: 'Open a Taco Truck',              reward: 200,   tab: 'biz',    tip: 'Each new business earns far more per level.', check: () => lvl('taco') >= 1 },
  { text: 'Buy a "Best deal"',              reward: 400,   tab: 'biz',    tip: 'The green Best deal badge marks what pays for itself fastest.', check: () => S.life.bestBuys >= 1 },
  { text: 'Open a Coffee Corner',           reward: 1000,  tab: 'biz',    tip: 'The clock on a buy button = how fast it pays for itself.', check: () => lvl('coffee') >= 1 },
  { text: 'Hit a ×2 level with "Next ×2"',  reward: 2000,  tab: 'biz',    tip: 'Next ×2 buys exactly the levels you need for the next doubling.', check: () => S.life.nextHits >= 1 },
  { text: 'Reach $1K per second',           reward: 5000,  tab: 'biz',    tip: 'Keep buying the Best deal and income snowballs.', check: () => C.ips >= 1e3 },
  { text: 'Unlock the Street Food combo',   reward: 8000,  tab: 'biz',    tip: 'Lemonade Stand and Taco Truck both at Lv 25: both earn ×2.', check: () => comboOn(COMBOS[0]) },
  { text: 'Open a Car Wash',                reward: 2e4,   tab: 'biz',    tip: 'Open new businesses when their clock beats the old ones.', check: () => lvl('wash') >= 1 },
  { text: 'Buy an Undervalued stock',       reward: 3e4,   tab: 'market', tip: 'Undervalued = below its fair value (dashed line). It tends to rise.', check: () => S.life.underBuys >= 1 },
  { text: 'Sell shares for a profit',       reward: 5e4,   tab: 'market', tip: 'Sell when the price is back above the dashed line.', check: () => S.life.profitTrades >= 1 },
  { text: 'Buy a "Smart buy" luxury',       reward: 8e4,   tab: 'life',   tip: 'Smart buy = its reputation pays the price back within 10 minutes.', check: () => S.life.smartLux >= 1 },
  { text: 'Become a Millionaire',           reward: 1.5e5, tab: 'biz',    tip: 'Net worth counts cash, shares, homes and half of what you invested.', check: () => C.net >= 1e6 },
  { text: 'Buy property in a Cold market',  reward: 3e5,   tab: 'prop',   tip: 'Cold market = same rent for a lower price. Wait for blue.', check: () => S.life.coldBuys >= 1 },
  { text: 'Open a Fitness Club',            reward: 5e5,   tab: 'biz',    tip: 'Five businesses are on show. The next one appears as you grow.', check: () => lvl('gym') >= 1 },
  { text: 'Take a bank loan and repay it',  reward: 1e6,   tab: 'market', tip: 'Borrow only for a Best deal you can almost afford. Interest adds up every minute.', check: () => S.life.loansRepaid >= 1 },
  { text: 'Buy the dip in a market crash',  reward: 2e6,   tab: 'market', tip: 'A crash puts every share on sale for 2 minutes. Buy, then sell after the rebound.', check: () => S.life.dipBuys >= 1 },
  { text: 'Reach $1M per second',           reward: 1e7,   tab: 'biz',    tip: 'Combos and ×2 levels are the biggest jumps.', check: () => C.ips >= 1e6 },
  { text: 'Become a Billionaire',           reward: 5e7,   tab: 'biz',    tip: 'Rich fast = always the fastest payback, never random buys.', check: () => C.net >= 1e9 },
  { text: 'Unlock 3 combos',                reward: 1e8,   tab: 'biz',    tip: 'Push both partners to Lv 25 together.', check: () => C.combos >= 3 },
  { text: 'Own 10 properties',              reward: 3e8,   tab: 'prop',   tip: 'Rent keeps paying forever. Each extra unit costs 6% more.', check: () => propCount() >= 10 },
  { text: 'Get any business to Lv 100',     reward: 1e9,   tab: 'biz',    tip: 'Lv 100 is the fourth doubling.', check: () => BUSINESSES.some(b => lvl(b.id) >= 100) },
  { text: 'Reach $1B per second',           reward: 3e10,  tab: 'biz',    tip: 'Buy boosts the moment their clock is the best.', check: () => C.ips >= 1e9 },
  { text: 'Become a Trillionaire',          reward: 1e11,  tab: 'biz',    tip: 'Now check the heir card in your Profile.', check: () => C.net >= 1e12 },
  { text: 'Retire at a Good time',          reward: 1e5,   tab: 'profile', tip: 'Retire when the heir advice is green: your heir earns ×1.5 or more, forever.', check: () => S.life.wiseRetire >= 1 },
  { text: 'Buy a Private Jet',              reward: 1e12,  tab: 'life',   tip: 'Big luxuries become Smart buys once your income is big.', check: () => !!S.lux.jet },
  { text: 'Unlock all 6 combos',            reward: 1e13,  tab: 'biz',    tip: 'Satellite Network + Space Colony is the last combo.', check: () => C.combos >= COMBOS.length },
  { text: 'Own every Lifestyle item',       reward: 1e19,  tab: 'life',   tip: 'The whole collection: +924% income.', check: () => LUXURY.every(l => S.lux[l.id]) },
];

// Random pop-up events. Each returns a modal description, or null if it doesn't fit right now.
// Their pictures are img/3d/<function name>.webp. Odds are always shown, so a wise player can do the math.
const EVENTS = [
  function lucky() {
    const amt = Math.max(150, C.ips * 45 + C.tap * 10);
    return {
      img: 'lucky', title: 'Lucky Ticket',
      html: `You found an old lottery ticket in your jacket. It's a winner worth <b class="t-green">${money(amt)}</b>!`,
      buttons: [{ label: 'Cash it in', cls: 'btn-green', fn: () => { earn(amt); SFX.cash(); confetti(24); } }],
    };
  },
  // An investment pitch: only good odds are worth it, and only with part of your cash.
  function risky() {
    const cash = S.cash;
    if (cash < 500) return null;
    const p = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.7]), m = pick([1.5, 2, 2.5]), ev = p * m - 1; // about −10% on average
    return {
      img: 'risky', title: 'Investment Pitch',
      html: `A founder wants backing for <b>${pick(PITCHES)}</b>. Win and you get your stake back ×${m}; lose and it's gone.` +
        odds([[`Win ${pct(p)}`, ''], [`Pays ×${m}`, ''], [`Expected ${pctS(ev)}`, ev > 0 ? 'good' : 'bad']]),
      buttons: [
        { label: `Invest 10% (${money(cash * 0.1)})`, cls: 'btn-blue', fn: () => pitch(cash * 0.1, p, m) },
        { label: `Invest 30% (${money(cash * 0.3)})`, cls: 'btn-gold', fn: () => pitch(cash * 0.3, p, m) },
        { label: 'Pass', cls: 'btn-soft' },
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
    const fee = fine * pick([0.25, 0.4, 0.6]), win = pick([0.5, 0.65, 0.8]), avg = fee + (1 - win) * fine;
    return {
      img: 'audit', title: 'Tax Audit',
      html: `Auditors found a mistake in your books. The fine is <b class="t-red">${money(fine)}</b>. A lawyer costs ${money(fee)} and might get it dropped.` +
        odds([[`Lawyer wins ${pct(win)}`, ''], [`Lawyer, on average ${money(avg)}`, avg < fine ? 'good' : 'bad']]),
      buttons: [
        { label: `Hire a lawyer (${money(fee)})`, cls: 'btn-blue', fn: () => {
          spend(fee);
          if (Math.random() < win) toast('Your lawyer got the fine dropped!', 'good', IMG.i3d('audit'));
          else { spend(fine); toast('The lawyer lost. You paid the fine too.', 'bad', IMG.i3d('audit')); }
        } },
        { label: `Pay the fine (${money(fine)})`, cls: 'btn-soft', fn: () => spend(fine) },
      ],
    };
  },
  function gala() {
    const gift = S.cash * 0.05;
    if (gift < 100) return null;
    const gain = C.ips * 0.5 * 180;
    return {
      img: 'gala', title: 'Charity Gala',
      html: "You're invited to the city's biggest charity gala. A generous donation would do wonders for your image." +
        odds([[`Costs ${money(gift)}`, ''], ['×1.5 income, 3 min', ''], [`Earns ≈ ${money(gain)}`, gain > gift ? 'good' : 'bad']]),
      buttons: [
        { label: `Donate ${money(gift)}`, cls: 'btn-green', fn: () => { spend(gift); addBoost('Good Press', 'gala', 1.5, 180); } },
        { label: 'Stay home', cls: 'btn-soft' },
      ],
    };
  },
  function tip() {
    const d = pick(STOCKS), st = S.stocks[d.sym];
    newsMove(st, 1, rand(0.08, 0.14) * Math.sqrt(d.vol / 0.02), Math.random() < 0.7);
    return {
      img: 'tip', title: 'Hot Tip',
      html: `A friend at a big bank whispers: <i>"${d.name} (${d.sym}) is about to take off. You didn't hear it from me."</i>` +
        odds([['Right 7 times in 10', '']]),
      buttons: [
        { label: 'Open the Market', cls: 'btn-blue', fn: () => switchTab('market') },
        { label: 'Ignore it', cls: 'btn-soft' },
      ],
    };
  },
  function blackout() {
    if (C.ips < 5) return null;
    const cost = C.baseIps * pick([15, 25, 40]), loss = C.ips * 30;
    const buttons = [];
    if (S.cash >= cost) buttons.push({ label: `Rent generators (${money(cost)})`, cls: 'btn-blue', fn: () => { spend(cost); toast('Generators running. Business as usual!', 'good', IMG.i3d('blackout')); } });
    buttons.push({ label: 'Wait it out (×0.5 income, 60s)', cls: 'btn-soft', fn: () => addBoost('Blackout', 'blackout', 0.5, 60) });
    return {
      img: 'blackout', title: 'City Blackout',
      html: 'A power cut hit the whole city! Your income halves for a minute unless you rent generators.' +
        odds(buttons.length > 1 ? [[`Generators ${money(cost)}`, cost < loss ? 'good' : 'bad'], [`Waiting loses ≈ ${money(loss)}`, cost < loss ? 'bad' : 'good']]
          : [[`Waiting loses ≈ ${money(loss)}`, 'bad']]),
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
  // A discounted property: only worth it if you kept some cash at hand.
  function key() {
    const off = pick([0.2, 0.3, 0.4]);
    const p = PROPERTIES.filter(x => propPrice(x) * (1 - off) <= S.cash).pop();
    if (!p) return null;
    const price = propPrice(p) * (1 - off), pay = price / propGain(p);
    return {
      img: 'key', title: 'Flash Sale',
      html: `A seller in ${p.loc} must sell a <b>${p.name}</b> today, cheap.` +
        odds([[`${pctS(-off)} price`, 'good'], [`Pays back in ${fmtShort(pay)}`, payCls(pay)], [`Rent ${money(propGain(p))}/s`, '']]),
      buttons: [
        { label: `Buy it for ${money(price)}`, cls: 'btn-green', fn: () => {
          if (!canPay(price)) { toast('Not enough cash anymore', 'bad', IMG.prop(p.id)); return; }
          spend(price);
          S.props[p.id]++;
          toast(`You got a ${p.name} for ${money(price)}!`, 'good', IMG.prop(p.id));
          SFX.buy();
        } },
        { label: 'Pass', cls: 'btn-soft' },
      ],
    };
  },
];

const byKey = (arr, key) => { const m = {}; arr.forEach(x => { m[x[key]] = x; }); return m; };
const BIZ = byKey(BUSINESSES, 'id');
const UPG = byKey(UPGRADES, 'id');
const STK = byKey(STOCKS, 'sym');
const PROP = byKey(PROPERTIES, 'id');
const LUX = byKey(LUXURY, 'id');
const COMBO = byKey(COMBOS, 'id');
const COMBO_OF = {}; // business id -> its combo
COMBOS.forEach(c => { COMBO_OF[c.a] = c; COMBO_OF[c.b] = c; });
const partnerOf = (c, id) => (c.a === id ? c.b : c.a);

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
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const isObj = o => !!o && typeof o === 'object' && !Array.isArray(o);
const num = (x, d) => (typeof x === 'number' && isFinite(x) ? x : d);
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
const pct = p => Math.round(p * 100) + '%';
const pctS = x => (x >= 0 ? '+' : '−') + Math.round(Math.abs(x) * 100) + '%';

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
// Short durations for paybacks: 45s, 12m, 3h 20m, 4d
function fmtShort(sec) {
  if (!isFinite(sec) || sec < 0) return '—';
  const s = Math.max(1, Math.round(sec));
  if (s < 60) return s + 's';
  if (s < 3600) return Math.floor(s / 60) + 'm';
  if (s < 86400) { const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return h + 'h' + (m ? ' ' + m + 'm' : ''); }
  return s < 3.15e7 ? Math.floor(s / 86400) + 'd' : '1y+';
}
function fmtClock(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}
// Green for a quick payback, orange for so-so, red for slow
const payCls = sec => (sec <= SMART_LUX ? 'good' : sec <= 3600 ? 'mid' : 'bad');
const odds = list => `<div class="odds">${list.map(o => `<span class="odd ${o[1]}">${o[0]}</span>`).join('')}</div>`;

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
const SAVE_KEY = 'pocket-mogul-save-v1'; // kept from the old name so existing saves still load
const SAVE_V = 3;
const OFFLINE_CAP = 4 * 3600; // seconds of offline earnings, max
const STREAK_MAX = 40;        // taps in a row for the full ×2 streak
const TAP_IPS = 0.005;        // each tap also earns this share of your income per second
const REP_BONUS = 0.01;       // income bonus per reputation point
const STAR_BONUS = 0.05;      // income bonus per Legacy Star

let S = null;   // everything that gets saved
const C = {};   // numbers derived from S, recomputed every tick
const UI = {
  tab: 'biz', bizQty: 1, stockQty: 1, luxCat: 'garage', keys: {}, refs: {}, queue: [],
  caseUntil: 0, chartsDirty: true, streak: 0, lastTap: 0, coins: 0, dailyShown: '',
  tapRate: 0, tapN: 0, best: '',
};
const E = {};   // cached DOM elements

function newState() {
  const now = Date.now();
  const s = {
    v: SAVE_V,
    cash: 0,
    runEarned: 0,
    stars: 0,
    goal: 0,
    titleBest: 0,
    debt: 0, loan0: 0, // what you owe the bank (fee and interest included), and what you owed at the start
    biz: {}, upg: {}, lux: {}, props: {}, stocks: {}, combos: {},
    housing: 1, housingHist: [1],
    hp: 0, hper: 300, hamp: 0.18, // housing cycle: phase (0-1), length in ticks, swing
    market: { kind: '', until: 0 }, // a market-wide crash or boom
    boosts: [], news: [],
    life: {
      earned: 0, taps: 0, prestiges: 0, played: 0, bestIps: 0, profitTrades: 0, tradeProfit: 0,
      bestBuys: 0, underBuys: 0, dipBuys: 0, coldBuys: 0, smartLux: 0, loans: 0, loansRepaid: 0, nextHits: 0, wiseRetire: 0,
    },
    run: { taps: 0, start: now },
    daily: { day: '', streak: 0 },
    settings: { sound: true },
    profile: {}, // the player's name and picture, managed by profile.js
    timers: { event: 0, briefcase: 0, news: 0, crash: 0 },
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
  const fresh = newState();
  Object.keys(s).forEach(k => {
    if (saved[k] === undefined || saved[k] === null) return;
    if (isObj(s[k]) && isObj(saved[k])) Object.assign(s[k], saved[k]);
    else s[k] = saved[k];
  });
  // per-item records keep their saved values and get any fields added since
  BUSINESSES.forEach(b => {
    const o = Object.assign(fresh.biz[b.id], isObj(s.biz[b.id]) ? s.biz[b.id] : {});
    o.lvl = Math.max(0, Math.floor(num(o.lvl, 0)));
    o.inv = Math.max(0, num(o.inv, 0));
    s.biz[b.id] = o;
  });
  STOCKS.forEach(d => {
    const o = Object.assign(fresh.stocks[d.sym], isObj(s.stocks[d.sym]) ? s.stocks[d.sym] : {});
    o.price = Math.max(0.01, num(o.price, d.price));
    o.fair = Math.max(0.01, num(o.fair, o.price));
    o.own = Math.max(0, Math.floor(num(o.own, 0)));
    o.avg = Math.max(0, num(o.avg, 0));
    if (!Array.isArray(o.hist) || !o.hist.length) o.hist = [o.price];
    s.stocks[d.sym] = o;
  });
  PROPERTIES.forEach(p => { s.props[p.id] = Math.max(0, Math.floor(num(s.props[p.id], 0))); });
  ['cash', 'runEarned', 'stars', 'debt', 'loan0'].forEach(k => { s[k] = Math.max(0, num(s[k], 0)); });
  s.housing = clamp(num(s.housing, 1), 0.6, 1.8);
  if (!Array.isArray(s.housingHist) || !s.housingHist.length) s.housingHist = [s.housing];
  if (!Array.isArray(s.boosts)) s.boosts = [];
  if (!Array.isArray(s.news)) s.news = [];
  s.boosts.forEach(b => { if (!b.img) b.img = 'fire'; }); // saves from v1 had emoji icons
  if (num(saved.v, 1) < 3) s.goalScan = true; // the goals were rewritten in v3: skip the ones already done
  s.v = SAVE_V;
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
const tapStreak = () => (UI.tapRate >= 1.2 ? 2 : 1); // steady tapping keeps the streak near ×2

function upgMult(type, target) {
  let m = 1;
  for (const u of UPGRADES) {
    if (S.upg[u.id] && u.type === type && (target === undefined || u.target === target)) m *= u.mult;
  }
  return m;
}
function repMult(rep) { return 1 + rep * REP_BONUS; }
function starMult(stars) { return 1 + stars * STAR_BONUS; }
function milestoneMult(l) { let m = 1; for (const x of MILESTONES) if (l >= x) m *= 2; return m; }
function nextMilestone(l) { return MILESTONES.find(x => l < x) || null; }
function prevMilestone(l) { let p = 0; for (const x of MILESTONES) if (l >= x) p = x; return p; }
function comboOn(c) { return lvl(c.a) >= c.lvl && lvl(c.b) >= c.lvl; }
function comboMult(id) { const c = COMBO_OF[id]; return c && comboOn(c) ? c.mult : 1; }

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
// How many levels the Business tab's buy buttons buy: ×1, ×10, up to the next ×2 milestone, or max
function bizQty(b) {
  if (UI.bizQty === 'max') return Math.max(1, bizMaxAffordable(b));
  if (UI.bizQty === 'next') { const l = lvl(b.id), nm = nextMilestone(l); return nm ? nm - l : 1; }
  return UI.bizQty;
}
function bizIncAt(b, l, combo) { return l ? b.income * l * milestoneMult(l) * C.bizMul[b.id] * combo : 0; }
// Extra income per second from n more levels of b, milestones and combos included
function bizGain(b, n) {
  const l = lvl(b.id) + n, c = COMBO_OF[b.id];
  const on = !!c && l >= c.lvl && lvl(partnerOf(c, b.id)) >= c.lvl;
  let g = bizIncAt(b, l, on ? c.mult : 1) - C.bizInc[b.id];
  if (on && !comboOn(c)) g += C.bizInc[partnerOf(c, b.id)] * (c.mult - 1);
  return g;
}
function upgGain(u) {
  switch (u.type) {
    case 'hustle': return C.tap * (u.mult - 1) * UI.tapRate * tapStreak(); // only pays if you actually tap
    case 'biz': return C.bizInc[u.target] * (u.mult - 1);
    case 'allbiz': return C.bizIps * (u.mult - 1);
    case 'rent': return C.rentIps * (u.mult - 1);
    default: return (C.bizIps + C.rentIps) * (u.mult - 1);
  }
}
function propGain(p) { return p.rent * C.rentMult; }
// What a luxury's reputation is worth in income right now
function luxGain(l) { return (C.bizIps + C.rentIps) * l.rep * REP_BONUS / repMult(C.rep); }
// Seconds until a purchase has paid for itself, counting the wait to afford it. Lowest = "Best deal".
function dealScore(cost, gain) {
  return gain > 0 ? cost / gain + Math.max(0, cost - S.cash) / Math.max(C.earnRate, 1e-9) : Infinity;
}

function propPrice(p) { return p.price * Math.pow(PROP_GROWTH, S.props[p.id]) * S.housing; }
function propSellPrice(p) {
  const n = S.props[p.id];
  return n ? p.price * Math.pow(PROP_GROWTH, n - 1) * S.housing * (1 - PROP_FEE) : 0;
}
function propValue(p) {
  const n = S.props[p.id];
  return n ? p.price * S.housing * (1 - PROP_FEE) * (Math.pow(PROP_GROWTH, n) - 1) / (PROP_GROWTH - 1) : 0;
}
function propPaid(p) { // what those units would cost at a steady market (no fee)
  const n = S.props[p.id];
  return p.price * (Math.pow(PROP_GROWTH, n) - 1) / (PROP_GROWTH - 1);
}

const stockGap = st => st.price / st.fair - 1; // below 0 = cheaper than it's worth
const rating = st => { const g = stockGap(st); return g <= -RATE_GAP ? 'under' : g >= RATE_GAP ? 'over' : 'fair'; };
function stockCap() { return Math.max(STOCK_MIN_CAP, C.baseIps * STOCK_CAP); }
const marketMood = () => (S.market.until > Date.now() ? S.market.kind : '');

function loanLimit() { return C.net * LOAN.share; }
function loanRoom() { return S.debt > 0 ? 0 : loanLimit() / (1 + LOAN.fee); } // cash you can borrow now
// Seconds until the loan is paid off from income, interest included
function payoffTime() {
  const r = LOAN.rate / 60, R = C.ips * LOAN.repay;
  return r * S.debt >= R ? Infinity : -Math.log(1 - r * S.debt / R) / r;
}

// Legacy Stars for what you earned in this life: 3 at $1B, 30 at $1T, 300 at $1Qa (cube root, so the snowball stays fair)
function starsAvailable() { return Math.floor(3 * Math.cbrt(S.runEarned / 1e9) + 1e-9); }
function earnedForStars(n) { return Math.pow(n / 3, 3) * 1e9; }
// Is now a good time to retire? x = how much richer every future generation gets
function heirAdvice() {
  const gain = starsAvailable(), x = starMult(S.stars + gain) / starMult(S.stars);
  const v = gain < 1 ? '' : x >= 2 ? 'great' : x >= 1.5 ? 'good' : 'early';
  return { gain, x, verdict: v, label: { great: 'Great time', good: 'Good time', early: 'Too early', '': 'No stars yet' }[v] };
}

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
  C.boost = boost;
  C.gm = repMult(C.rep) * starMult(S.stars) * boost * upgMult('all');
  C.allBiz = upgMult('allbiz') * C.gm;
  C.bizInc = {};
  C.bizMul = {};
  let biz = 0;
  for (const b of BUSINESSES) {
    C.bizMul[b.id] = upgMult('biz', b.id) * C.allBiz;
    const v = bizIncAt(b, lvl(b.id), comboMult(b.id));
    C.bizInc[b.id] = v;
    biz += v;
  }
  C.rentMult = upgMult('rent') * C.gm;
  const rent = PROPERTIES.reduce((a, p) => a + S.props[p.id] * p.rent * C.rentMult, 0);
  C.divIps = STOCKS.reduce((a, d) => a + S.stocks[d.sym].own * S.stocks[d.sym].price * d.div / 60, 0);
  C.bizIps = biz;
  C.rentIps = rent;
  C.ips = biz + rent + C.divIps;
  C.baseIps = (biz + rent) / boost; // without short-lived boosts: sets the loan and trading limits
  C.tap = (C.gm + C.ips * TAP_IPS) * upgMult('hustle');
  C.earnRate = C.ips + C.tap * UI.tapRate * tapStreak();
  C.combos = COMBOS.filter(comboOn).length;
  C.stockVal = STOCKS.reduce((a, d) => a + S.stocks[d.sym].own * S.stocks[d.sym].price, 0);
  C.propVal = PROPERTIES.reduce((a, p) => a + propValue(p), 0);
  C.bizVal = BUSINESSES.reduce((a, b) => a + S.biz[b.id].inv * 0.5, 0);
  C.luxVal = LUXURY.reduce((a, l) => a + (S.lux[l.id] ? l.cost * 0.5 : 0), 0);
  C.debt = S.debt;
  C.net = Math.max(0, S.cash + C.stockVal + C.propVal + C.bizVal + C.luxVal - C.debt);
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

// Passive income; part of it pays off the loan.
function collect(amt) {
  if (!(amt > 0)) return;
  earn(amt);
  if (S.debt > 0) payDebt(amt * LOAN.repay);
}
function accrue(dt) { if (S.debt > 0) S.debt *= 1 + LOAN.rate * dt / 60; } // loan interest
function payDebt(x) {
  x = Math.min(x, S.debt, S.cash);
  if (!(x > 0)) return 0;
  S.cash -= x;
  S.debt -= x;
  if (S.debt < 0.01) {
    S.debt = 0;
    S.life.loansRepaid++;
    toast('Loan paid off! Your full income is back.', 'good', IMG.i3d('bank'));
  }
  return x;
}

function addBoost(name, img, mult, sec) {
  const until = Date.now() + sec * 1000;
  const ex = S.boosts.find(b => b.name === name);
  if (ex) ex.until = Math.max(ex.until, until);
  else S.boosts.push({ name, img, mult, until });
  toast(`${name}: income ×${mult} for ${fmtTime(sec)}`, mult >= 1 ? 'gold' : 'bad', IMG.i3d(img));
}

// One step of the economy: income, loan, markets. The sim in _pm_assets/sim calls this too.
let marketAcc = 0;
function econStep(dt, now) {
  recompute();
  accrue(dt);
  collect(C.ips * dt);
  S.life.played += dt;
  if (C.ips > S.life.bestIps) S.life.bestIps = C.ips;
  marketAcc += dt;
  while (marketAcc >= 2) { marketAcc -= 2; marketTick(); }
  newsTick(now);
  crashTick(now);
}

// ---------------------------------------------------------------------
// Player actions
// ---------------------------------------------------------------------
function hustle(x, y) {
  UI.streak = Math.min(STREAK_MAX, UI.streak + 1);
  UI.lastTap = Date.now();
  UI.tapN++;
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
  if (UI.best === 'biz:' + id) S.life.bestBuys++;
  spend(cost);
  const st = S.biz[id], before = st.lvl;
  st.lvl += n;
  st.inv += cost;
  const hit = MILESTONES.filter(x => before < x && st.lvl >= x);
  if (hit.length && UI.bizQty === 'next') S.life.nextHits++;
  if (before === 0) {
    toast(`You opened a ${b.name}! ${b.tag}.`, 'good', IMG.biz(id));
    confetti(30);
  } else if (hit.length) {
    toast(`${b.name} reached Lv ${hit[hit.length - 1]}: income ×${Math.pow(2, hit.length)}!`, 'gold', IMG.biz(id));
  }
  comboCheck();
  SFX.buy();
  return true;
}

function comboCheck() {
  COMBOS.forEach(c => {
    if (S.combos[c.id] || !comboOn(c)) return;
    S.combos[c.id] = true;
    toast(`${c.name} combo! ${BIZ[c.a].name} + ${BIZ[c.b].name} earn ×${c.mult}`, 'gold', IMG.i3d('link'));
    confetti(50);
  });
}

function buyUpg(id) {
  const u = UPG[id];
  if (S.upg[id] || !canPay(u.cost)) return false;
  if (UI.best === 'upg:' + id) S.life.bestBuys++;
  spend(u.cost);
  S.upg[id] = true;
  toast(`${u.name}: ${u.desc}`, 'gold', IMG.i3d(id));
  SFX.buy();
  return true;
}

// Shares you could buy right now: limited by cash and the per-company trading limit
function stockMaxBuy(d) {
  const st = S.stocks[d.sym], unit = st.price * (1 + STOCK_FEE);
  const room = Math.max(0, stockCap() - st.own * st.price) / st.price;
  return Math.max(0, Math.floor(Math.min(S.cash / unit, room)));
}
function stockBuyQty(d) {
  const max = stockMaxBuy(d);
  if (UI.stockQty === 'max') return max;
  if (UI.stockQty === 'pct') return Math.floor(max * 0.25);
  return Math.min(UI.stockQty, max);
}
function stockSellQty(d) {
  const own = S.stocks[d.sym].own;
  if (UI.stockQty === 'max') return own;
  if (UI.stockQty === 'pct') return Math.ceil(own * 0.25);
  return Math.min(UI.stockQty, own);
}

function buyStock(sym) {
  const d = STK[sym], st = S.stocks[sym], n = stockBuyQty(d);
  if (n < 1) {
    if (stockMaxBuy(d) < 1 && S.cash >= st.price * (1 + STOCK_FEE)) toast(`Trading limit: up to ${money(stockCap())} per company. It grows with your income.`, 'bad', IMG.stock(sym));
    return false;
  }
  const cost = n * st.price * (1 + STOCK_FEE);
  if (!canPay(cost)) return false;
  spend(cost);
  st.avg = (st.avg * st.own + cost) / (st.own + n);
  st.own += n;
  if (rating(st) === 'under') S.life.underBuys++;
  if (marketMood() === 'crash') S.life.dipBuys++;
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
  if (S.housing <= COLD) S.life.coldBuys++;
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
  const smart = l.cost / luxGain(l) <= SMART_LUX;
  spend(l.cost);
  S.lux[id] = true;
  if (smart) S.life.smartLux++;
  toast(`${l.name} is yours! +${l.rep} reputation`, 'gold', IMG.lux(id));
  SFX.cash();
  confetti(36);
  return true;
}

// Borrow a share (0-1) of what the bank will still lend you
function takeLoan(frac) {
  const amt = Math.floor(loanRoom() * Math.min(1, Math.max(0, frac)));
  if (amt < 1) {
    toast(S.debt > 0 ? 'One loan at a time: pay this one back first' : 'The bank lends up to a quarter of your net worth', 'bad', IMG.i3d('bank'));
    return false;
  }
  S.debt += amt * (1 + LOAN.fee);
  S.loan0 = S.debt;
  S.cash += amt; // borrowed, not earned: it doesn't count toward Legacy Stars
  S.life.loans++;
  toast(`Borrowed ${money(amt)}. You owe ${money(S.debt)} + ${pct(LOAN.rate)} a minute until it's paid back.`, 'gold', IMG.i3d('bank'));
  SFX.cash();
  return true;
}
function repayLoan() {
  if (!(S.debt > 0) || S.cash < 0.01) return false;
  payDebt(S.cash);
  SFX.buy();
  return true;
}

function pitch(stake, p, m) {
  stake = Math.min(stake, S.cash);
  if (!(stake > 0)) return;
  if (Math.random() < p) {
    earn(stake * (m - 1));
    toast(`The pitch paid off: +${money(stake * (m - 1))}!`, 'good', IMG.i3d('moneybag'));
    SFX.cash();
    confetti(30);
  } else {
    spend(stake);
    toast(`The startup flopped. You lost ${money(stake)}.`, 'bad', IMG.i3d('money-wings'));
    SFX.no();
  }
}

// A fixed prize, or 10 seconds of income for players who are far ahead (big enough to matter, too small to snowball)
function goalReward(g) { return Math.max(g.reward, (C.baseIps || 0) * 10); }
function claimGoal() {
  const g = GOALS[S.goal];
  if (!g || !g.check()) return null;
  const amt = goalReward(g);
  earn(amt);
  S.goal++;
  toast(`Goal complete! +${money(amt)}`, 'good', IMG.i3d('target'));
  SFX.cash();
  confetti(24);
  return true;
}

// Tapping a goal that isn't done yet explains the move and offers to show where it's done
function goalTip() {
  const g = GOALS[S.goal];
  if (!g) return null;
  showModal({
    img: 'target', title: `Step ${S.goal + 1} of ${GOALS.length}`,
    html: `<b>${g.text}</b><br>${g.tip}` + odds([[`Reward ${money(goalReward(g))}`, 'good']]),
    buttons: [
      { label: 'Show me', cls: 'btn-blue', fn: () => { if (UI.tab !== g.tab) switchTab(g.tab); } },
      { label: 'OK', cls: 'btn-soft' },
    ],
  });
  return true;
}

function askPrestige() {
  const gain = starsAvailable();
  if (gain < 1) {
    toast(`Earn ${money(earnedForStars(1) - S.runEarned)} more in this life first`, 'bad', IMG.i3d('hourglass'));
    return false;
  }
  const total = S.stars + gain, a = heirAdvice();
  showModal({
    img: 'baby', title: 'Pass the empire on?',
    html: `Your heir starts over with <b>$0</b>, but inherits <b class="t-gold">${fmt(gain)} Legacy Stars</b>.<br><br>` +
      `Stars: ${fmt(S.stars)} → <b>${fmt(total)}</b> (<b class="t-green">+${fmt((starMult(total) - 1) * 100)}%</b> income forever)` +
      odds([[`Heir earns ×${a.x.toFixed(2)}`, ''], [a.label, a.verdict === 'great' ? 'good' : a.verdict === 'good' ? 'mid' : 'bad']]) +
      '<span class="small muted">Businesses, boosts, shares, properties, lifestyle items and loans are all reset. Retiring pays most once your heir would earn ×2 or more.</span>',
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
  const old = S, n = newState(), wise = heirAdvice().verdict;
  n.stars = old.stars + gain;
  n.goal = old.goal;
  n.life = old.life;
  n.life.prestiges++;
  if (wise === 'good' || wise === 'great') n.life.wiseRetire++;
  n.daily = old.daily;
  n.settings = old.settings;
  n.profile = old.profile;
  n.seenIntro = true;
  // the stock and housing markets keep running between generations
  STOCKS.forEach(d => {
    const o = old.stocks[d.sym];
    Object.assign(n.stocks[d.sym], { price: o.price, fair: o.fair, hist: o.hist, trend: o.trend, tt: o.tt });
  });
  ['housing', 'housingHist', 'hp', 'hper', 'hamp', 'market', 'news', 'timers'].forEach(k => { n[k] = old[k]; });
  S = n;
  afterReset();
  showModal({
    img: 'star', title: 'A new generation begins',
    html: `You now have <b class="t-gold">${fmt(S.stars)} Legacy Stars</b>, boosting all income by <b class="t-green">+${fmt((starMult(S.stars) - 1) * 100)}%</b>.<br>Time to build an even bigger empire!`,
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
        const profile = S.profile; // your name and picture survive a reset
        wipeSave();
        S = newState();
        S.profile = profile;
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

// Everything the player owns, for Profile > Assets in profile.js.
// profile.js relies on these field names, so keep them when the economy changes.
function assetBook() {
  return {
    businesses: BUSINESSES.filter(b => lvl(b.id) > 0).map(b => ({
      id: b.id, name: b.name, img: IMG.biz(b.id), level: lvl(b.id),
      income: C.bizInc[b.id], invested: S.biz[b.id].inv, value: S.biz[b.id].inv * 0.5,
      combo: COMBO_OF[b.id] && comboOn(COMBO_OF[b.id]) ? COMBO_OF[b.id].name : '',
    })),
    properties: PROPERTIES.filter(p => S.props[p.id] > 0).map(p => ({
      id: p.id, name: p.name, loc: p.loc, img: IMG.prop(p.id), count: S.props[p.id],
      income: S.props[p.id] * p.rent * C.rentMult, value: propValue(p), paid: propPaid(p),
    })),
    stocks: STOCKS.filter(d => S.stocks[d.sym].own > 0).map(d => {
      const st = S.stocks[d.sym];
      return { id: d.sym, name: d.name, img: IMG.stock(d.sym), shares: st.own, value: st.own * st.price, paid: st.own * st.avg,
        income: st.own * st.price * d.div / 60 };
    }),
    lifestyle: LUXURY.map(l => ({
      id: l.id, cat: l.cat, name: l.name, img: IMG.lux(l.id), owned: !!S.lux[l.id],
      cost: l.cost, rep: l.rep, value: S.lux[l.id] ? l.cost * 0.5 : 0,
    })),
    debt: S.debt,
  };
}

// ---------------------------------------------------------------------
// Markets, news, events, the bonus briefcase, offline earnings, daily bonus
// ---------------------------------------------------------------------
// Prices wander around a fair value and drift back to it, so "Undervalued" shares tend to rise.
function marketTick() {
  for (const d of STOCKS) {
    const st = S.stocks[d.sym];
    st.fair *= Math.exp(d.grow + (d.fvol ? gauss() * d.fvol : 0));
    let drift = REVERT * Math.log(st.fair / st.price);
    if (st.tt > 0) { drift += st.trend; st.tt--; }
    st.price = Math.max(0.01, st.price * Math.exp(drift + gauss() * d.vol));
    st.hist.push(st.price);
    if (st.hist.length > 60) st.hist.shift();
  }
  // Housing runs in slow waves (8-14 min): cold, warming, hot, cooling.
  S.hp += 1 / S.hper;
  if (S.hp >= 1) { S.hp -= 1; S.hper = randInt(240, 420); S.hamp = rand(0.14, 0.25); }
  S.housing = clamp(S.housing * Math.exp(0.08 * Math.log(housingTarget(0) / S.housing) + gauss() * 0.005), 0.6, 1.8);
  S.housingHist.push(S.housing);
  if (S.housingHist.length > 60) S.housingHist.shift();
  UI.chartsDirty = true;
}
function housingTarget(ahead) { return 1 + S.hamp * Math.sin(2 * Math.PI * (S.hp + ahead / S.hper)); }
const housingRising = () => housingTarget(12) > S.housing;

function warmUpMarkets() {
  S.hp = Math.random();
  S.housing = housingTarget(0);
  S.housingHist = [S.housing];
  for (let i = 0; i < 59; i++) marketTick();
}

function addNews(n) {
  S.news.unshift(n);
  if (S.news.length > 5) S.news.length = 5;
}
// Real news moves the fair value for good. A false alarm shoves the price the other way for a while.
function newsMove(st, dir, size, real) {
  if (real) st.fair *= Math.exp(dir * size);
  st.trend = (real ? dir : -dir) * size / 6;
  st.tt = 6;
}
function newsTick(now) {
  if (now < S.timers.news) return;
  S.timers.news = now + rand(35000, 70000);
  const d = pick(STOCKS), st = S.stocks[d.sym];
  const good = Math.random() < 0.55;
  newsMove(st, good ? 1 : -1, rand(0.06, 0.14) * Math.sqrt(d.vol / 0.02), Math.random() < NEWS_TRUTH);
  const text = pick(good ? NEWS_GOOD : NEWS_BAD).replace('{n}', d.name);
  addNews({ text, good, sym: d.sym, t: now });
  if (UI.tab === 'market' || st.own > 0) toast(text, good ? 'good' : 'bad', IMG.i3d(good ? 'chart-up' : 'chart-down'));
}
// Every 8-15 minutes the whole market crashes (buy the dip!) or booms (take profits).
function crashTick(now) {
  if (now < S.timers.crash) return;
  S.timers.crash = now + rand(8, 15) * 60000;
  if (S.life.earned < 2e4) return;
  const crash = Math.random() < 0.6, size = rand(0.18, 0.3);
  STOCKS.forEach(d => {
    const st = S.stocks[d.sym];
    st.trend = (crash ? -1 : 1) * size * Math.sqrt(d.vol / 0.02) / 5;
    st.tt = 5;
  });
  S.market = { kind: crash ? 'crash' : 'boom', until: now + 120000 };
  addNews({ text: crash ? 'MARKET CRASH! Investors panic-sell everything' : 'BULL RUN! Every stock is soaring', good: !crash, sym: '', t: now });
  toast(crash ? 'Market crash! Shares are on sale: buy the dip' : 'Bull run! Shares are overpriced: take profits',
    crash ? 'bad' : 'good', IMG.i3d(crash ? 'chart-down' : 'rocket'));
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
  const owed = S.debt;
  for (let left = t; left > 0; left -= 60) { const d = Math.min(60, left); accrue(d); collect(C.ips * d); } // minute by minute for the loan
  if (!popup) return;
  const paid = owed - S.debt;
  showModal({
    img: 'moon', title: 'Welcome back!',
    html: `You were away for <b>${fmtTime(sec)}</b>.<br>Your empire earned <b class="t-green">${money(amt)}</b> while you were gone.` +
      (paid > 0 ? `<br><span class="small muted">${money(paid)} of it paid off your loan.</span>` : '') +
      (sec > OFFLINE_CAP ? '<br><span class="tiny muted">Offline earnings are capped at 4 hours.</span>' : ''),
    buttons: [{ label: 'Collect', cls: 'btn-green', fn: () => { SFX.cash(); confetti(20); } }],
  });
}

// Once, for players coming from an older version
function showWhatsNew() {
  const li = (img, t) => `<div>${pic(IMG.i3d(img), '', '')}<span>${t}</span></div>`;
  showModal({
    img: 'sparkles', title: "What's new in Cash Climb",
    html: 'Wise moves now make you rich much faster. Everything you own is still yours.' +
      '<div class="m-list">' +
      li('camera', '<b>Your profile</b>: tap your picture to pick a name, a look or your own photo') +
      li('link', `<b>Combos</b>: two partner businesses at Lv 25 both earn ×2. You have <b>${C.combos}</b> already!`) +
      li('target', '<b>Best deal</b> badges and payback clocks show what to buy first') +
      li('chart-up', 'Stocks show <b>Undervalued</b> or <b>Overvalued</b>; crashes put shares on sale') +
      li('house', 'Housing moves in waves: buy property when it\'s <b>Cold</b>') +
      li('bank', 'The bank lends against your net worth, one loan at a time') +
      li('crown', '<b>Smart buy</b> marks luxuries that pay for themselves fast') +
      '</div><span class="tiny muted">New purchases cost more and taps earn less than before; combos make up for it.</span>',
    buttons: [{ label: 'Show me', cls: 'btn-gold' }],
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

// A small line chart. base decides green/red; ref draws a dashed line (fair value, or the 100% mark).
function drawSpark(canvas, data, base, ref) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h || data.length < 2) return;
  if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  let min = Math.min.apply(null, data), max = Math.max.apply(null, data);
  if (ref !== undefined) { min = Math.min(min, ref); max = Math.max(max, ref); }
  if (max - min < 1e-9) { max += 1; min -= 1; }
  const pad = 3;
  const X = i => i / (data.length - 1) * w;
  const Y = v => pad + (1 - (v - min) / (max - min)) * (h - pad * 2);
  const up = data[data.length - 1] >= (base === undefined ? data[0] : base);
  if (ref !== undefined) {
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(0, Y(ref));
    ctx.lineTo(w, Y(ref));
    ctx.strokeStyle = 'rgba(139, 146, 166, .9)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
  }
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
  renderPlayer(); // profile.js: avatar, name, title, badges

  const key = S.boosts.map(b => b.name).join('|') + (S.debt > 0 ? '|debt' : '');
  if (UI.keys.boosts !== key) {
    UI.keys.boosts = key;
    E.boosts.innerHTML = S.boosts.map(b =>
      `<span class="boost-chip${b.mult < 1 ? ' bad' : ''}">${pic(IMG.i3d(b.img), '', '')}×${b.mult} · <span></span></span>`).join('') +
      (S.debt > 0 ? `<button class="boost-chip debt" data-act="goto" data-id="market">${pic(IMG.i3d('bank'), '', '')}<span></span></button>` : '');
    UI.refs.boostClocks = $$('.boost-chip:not(.debt) > span', E.boosts);
    UI.refs.debtChip = $('.boost-chip.debt > span', E.boosts);
  }
  S.boosts.forEach((b, i) => set(UI.refs.boostClocks[i], fmtClock((b.until - now) / 1000)));
  if (S.debt > 0) set(UI.refs.debtChip, 'Loan ' + money(S.debt));

  if (C.titleIdx > S.titleBest) {
    S.titleBest = C.titleIdx;
    toast(`You're now a ${TITLES[C.titleIdx][1]}!`, 'gold', playerPic());
    SFX.cash();
    if (C.titleIdx >= 3) confetti(60);
  }
}

function renderGoal() {
  const g = GOALS[S.goal];
  cls(E.goal, 'hidden', !g);
  if (!g) return;
  const done = g.check();
  set(E.goalStep, `Step ${S.goal + 1}/${GOALS.length}`);
  set(E.goalText, g.text);
  set(E.goalReward, (done ? 'Claim ' : '') + money(goalReward(g)));
  cls(E.goal, 'done', done);
}

function visibleUpgrades() {
  return UPGRADES.filter(u => !S.upg[u.id] &&
    (u.type !== 'biz' || lvl(u.target) > 0) &&
    (u.type !== 'rent' || propCount() > 0)).slice(0, 5);
}

function renderNav() {
  cls(E['dot-biz'], 'on', visibleUpgrades().some(u => u.cost <= S.cash));
  cls(E['dot-market'], 'on', marketMood() === 'crash');
  cls(E['dot-prop'], 'on', S.housing <= COLD && PROPERTIES.some(p => propPrice(p) <= S.cash));
  cls(E['dot-life'], 'on', LUXURY.some(l => !S.lux[l.id] && l.cost <= S.cash && l.cost / luxGain(l) <= SMART_LUX));
  cls(E['dot-profile'], 'on', heirAdvice().verdict === 'great');
}

// ----- Business tab -----
function highestOwned() {
  let hi = -1;
  BUSINESSES.forEach((b, i) => { if (lvl(b.id) > 0) hi = i; });
  return hi;
}
// The first five businesses are always on show, then two beyond the best one you own.
function bizShown() { return Math.min(BUSINESSES.length, Math.max(5, highestOwned() + 3)); }

// "Best deal" on the Business tab (buy buttons as set by ×1/×10/Next/Max, and boosts): the purchase that
// pays for itself soonest, counting the wait to afford it. If that one is out of reach, anything you can
// afford now that pays back before you could buy it comes first.
function bestDeal() {
  const list = [];
  BUSINESSES.slice(0, bizShown()).forEach(b => { const n = bizQty(b); list.push({ key: 'biz:' + b.id, cost: bizCost(b, n), gain: bizGain(b, n) }); });
  visibleUpgrades().forEach(u => list.push({ key: 'upg:' + u.id, cost: u.cost, gain: upgGain(u) }));
  let best = null, bs = Infinity;
  list.forEach(o => { o.pay = o.gain > 0 ? o.cost / o.gain : Infinity; const s = dealScore(o.cost, o.gain); if (s < bs) { bs = s; best = o; } });
  if (best && !canPay(best.cost)) {
    const wait = (best.cost - S.cash) / Math.max(C.earnRate, 1e-9);
    const now = list.filter(o => canPay(o.cost) && o.pay < wait).sort((x, y) => x.pay - y.pay)[0];
    if (now) best = now;
  }
  UI.best = best ? best.key : '';
  UI.bestPay = best ? best.pay : Infinity;
  UI.bestCost = best ? best.cost : 0;
  return UI.best;
}

function buildBizList(shown) {
  let html = '';
  for (let i = 0; i < shown; i++) {
    const b = BUSINESSES[i], c = COMBO_OF[b.id], mate = c && BIZ[partnerOf(c, b.id)];
    html += `<div class="card biz-card" data-id="${b.id}">
      <span class="deal-badge">${ico('bolt')}Best deal</span>
      <div class="thumb">${pic(IMG.biz(b.id), '', b.name)}<span class="lvl" data-f="lvl"></span></div>
      <div class="grow">
        <div class="name">${b.name}</div>
        <div class="inc-row"><span class="inc" data-f="inc"></span>${mate ? `<span class="combo-pill" data-f="combo">${pic(IMG.i3d('link'), 'cp-link', '')}${pic(IMG.biz(mate.id), 'cp-mate', mate.name)}<em data-f="cv"></em></span>` : ''}</div>
        <div class="ms"><div class="bar"><i data-f="bar"></i></div><span data-f="ms"></span></div>
      </div>
      <button class="btn btn-blue buy3" data-act="biz" data-id="${b.id}" data-f="btn"><small data-f="q"></small><b data-f="cost"></b><span class="pay" data-f="pay"></span></button>
    </div>`;
  }
  if (shown < BUSINESSES.length) {
    html += `<div class="card biz-card locked">
      <div class="thumb">${pic(IMG.biz(BUSINESSES[shown].id), 'blur', '')}<span class="lock">${ico('lock')}</span></div>
      <div class="grow"><div class="name">Next business</div>
        <div class="tiny muted">Open a ${BUSINESSES[shown - 2].name} to reveal it</div></div>
    </div>`;
  }
  E.bizList.innerHTML = html;
  UI.refs.biz = $$('.biz-card[data-id]', E.bizList).map(el => ({ el, b: BIZ[el.dataset.id], f: fields(el) }));
  // combos whose businesses are both on show
  E.comboList.innerHTML = COMBOS.filter(c => BUSINESSES.indexOf(BIZ[c.b]) < shown).map(c => `<div class="combo-card" data-id="${c.id}">
    <div class="cc-pics">${pic(IMG.biz(c.a), '', '')}${pic(IMG.biz(c.b), '', '')}<span class="cc-x">×${c.mult}</span></div>
    <b>${c.name}</b><span class="tiny muted" data-f="need">Both Lv ${c.lvl}</span>
    <div class="bar"><i data-f="bar"></i></div>
  </div>`).join('');
  UI.refs.combos = $$('.combo-card', E.comboList).map(el => ({ el, c: COMBO[el.dataset.id], f: fields(el) }));
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
      ? ups.map(u => `<button class="boost-card" data-act="upg" data-id="${u.id}">
          <span class="deal-badge">${ico('bolt')}Best</span>
          <span class="b-ico tint-${UPGRADES.indexOf(u) % 6}">${pic(IMG.i3d(u.id), '', '')}</span>
          <b>${u.name}</b><span class="tiny muted">${u.desc}</span>
          <span class="b-pay" data-f="pay"></span>
          <span class="price-pill">${money(u.cost)}</span></button>`).join('')
      : '<div class="empty">No boosts right now. Grow your empire to unlock more!</div>';
    UI.refs.upg = $$('.boost-card', E.upgrades).map(el => ({ el, u: UPG[el.dataset.id], f: fields(el) }));
  }
  set(E.boostNote, upgCount() + ' of ' + UPGRADES.length + ' owned');

  const shown = bizShown();
  if (UI.keys.biz !== shown) { UI.keys.biz = shown; buildBizList(shown); }
  const best = bestDeal();

  UI.refs.upg.forEach(r => {
    const g = upgGain(r.u), pay = g > 0 ? r.u.cost / g : Infinity;
    cls(r.el, 'off', r.u.cost > S.cash);
    cls(r.el, 'best', best === 'upg:' + r.u.id);
    setHTML(r.f.pay, isFinite(pay) ? `${ico('clock')}${fmtShort(pay)}` : r.u.type === 'hustle' ? `${ico('tap')}Tap to use` : '');
    setCls(r.f.pay, 'b-pay ' + (isFinite(pay) ? payCls(pay) : ''));
  });

  UI.refs.biz.forEach(r => {
    const b = r.b, l = lvl(b.id), n = bizQty(b), cost = bizCost(b, n), g = bizGain(b, n);
    const nm = nextMilestone(l), pm = prevMilestone(l), c = COMBO_OF[b.id];
    set(r.f.lvl, l ? 'Lv ' + l : 'NEW');
    cls(r.f.lvl, 'new', !l);
    set(r.f.inc, l ? money(C.bizInc[b.id]) + ' /s' : b.tag);
    cls(r.f.inc, 'tagline', !l);
    setW(r.f.bar, (nm ? (l - pm) / (nm - pm) * 100 : 100) + '%');
    set(r.f.ms, nm ? `Lv ${nm} ×2` : 'Maxed');
    set(r.f.q, l ? (UI.bizQty === 'next' && nm ? '→ Lv ' + nm : 'Buy ×' + n) : (n > 1 ? 'Open → Lv ' + n : 'Open'));
    set(r.f.cost, money(cost));
    setHTML(r.f.pay, g > 0 ? ico('clock') + fmtShort(cost / g) : '');
    cls(r.f.btn, 'off', cost > S.cash);
    cls(r.el, 'best', best === 'biz:' + b.id);
    if (c && r.f.combo) {
      const on = comboOn(c);
      cls(r.f.combo, 'on', on);
      set(r.f.cv, on ? '×' + c.mult : 'Lv ' + c.lvl);
    }
  });

  UI.refs.combos.forEach(r => {
    const c = r.c, on = comboOn(c);
    setW(r.f.bar, ((Math.min(lvl(c.a), c.lvl) + Math.min(lvl(c.b), c.lvl)) / (2 * c.lvl) * 100) + '%');
    set(r.f.need, on ? `Active: both ×${c.mult}` : `Lv ${Math.min(lvl(c.a), c.lvl)}/${c.lvl} + ${Math.min(lvl(c.b), c.lvl)}/${c.lvl}`);
    cls(r.el, 'on', on);
  });
  set(E.comboNote, C.combos + ' of ' + COMBOS.length + ' active');
}

// ----- Market tab -----
function buildStocks() {
  E.stockList.innerHTML = STOCKS.map(d => `<div class="card stock-card" data-sym="${d.sym}">
    <div class="row">
      ${pic(IMG.stock(d.sym), 'logo', d.sym)}
      <div class="grow"><div class="name">${d.name}</div><span class="kind k-${d.kind}">${d.kind === 'div' ? `Dividend ${Math.round(d.div * 6000)}%/h` : d.kind === 'growth' ? 'Growth' : 'Crypto'}</span></div>
      <canvas data-f="chart"></canvas>
      <div class="px"><b data-f="price"></b><span class="chg" data-f="chg"></span></div>
    </div>
    <div class="row trade">
      <div class="grow hold"><span class="rating" data-f="rate"></span><span data-f="hold"></span></div>
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
        `<div class="grow"><div class="small${n.sym ? '' : ' b'}">${esc(n.text)}</div><div class="tiny muted">${n.sym ? n.sym + ' · ' : ''}${fmtTime((now - n.t) / 1000)} ago</div></div></div>`).join('')
    : '<div class="small muted">Waiting for the first headlines…</div>');

  let pl = 0;
  UI.refs.stocks.forEach(r => {
    const st = S.stocks[r.d.sym];
    const ch = (st.price / st.hist[0] - 1) * 100, gap = stockGap(st), rt = rating(st);
    set(r.f.price, price2(st.price));
    set(r.f.chg, (ch >= 0 ? '+' : '−') + Math.abs(ch).toFixed(1) + '%');
    setCls(r.f.chg, 'chg ' + (ch >= 0 ? 'up' : 'down'));
    set(r.f.rate, rt === 'under' ? 'Undervalued ' + pctS(gap) : rt === 'over' ? 'Overvalued ' + pctS(gap) : 'Fair price');
    setCls(r.f.rate, 'rating ' + rt);
    const gain = st.own * (st.price * (1 - STOCK_FEE) - st.avg);
    pl += gain;
    setHTML(r.f.hold, st.own
      ? `${fmt(st.own)} shares · <b class="${gain >= 0 ? 'up' : 'down'}">${signed(gain)}</b>`
      : 'No shares yet');

    const bq = stockBuyQty(r.d), capped = stockMaxBuy(r.d) < 1 && S.cash >= st.price * (1 + STOCK_FEE);
    const bn = Math.max(1, bq), bcost = bn * st.price * (1 + STOCK_FEE);
    set(r.f.bq, capped ? 'At limit' : 'Buy ' + fmt(bn));
    set(r.f.bv, money(bcost));
    cls(r.f.buy, 'off', bq < 1 || bcost > S.cash);

    const sq = stockSellQty(r.d);
    set(r.f.sq, sq ? 'Sell ' + fmt(sq) : 'Sell');
    set(r.f.sv, sq ? money(sq * st.price * (1 - STOCK_FEE)) : '—');
    cls(r.f.sell, 'off', sq < 1);

    if (UI.chartsDirty) drawSpark(r.f.chart, st.hist, undefined, st.fair);
  });
  UI.chartsDirty = false;

  const mood = marketMood();
  setHTML(E.portfolio,
    `<div class="pf-top"><div><div class="eyebrow">Portfolio value</div><div class="big-num">${money(C.stockVal)}</div></div>` +
    (mood ? `<span class="mkt-mood ${mood}">${ico(mood === 'crash' ? 'down' : 'up')}${mood === 'crash' ? 'Crash: buy the dip' : 'Boom: take profits'}</span>`
      : pic(IMG.i3d(pl >= 0 ? 'chart-up' : 'chart-down'), '', '')) + '</div>' +
    `<div class="pf-row"><span>Open profit / loss</span><b class="${pl >= 0 ? 'up' : 'down'}">${signed(pl)}</b></div>` +
    `<div class="pf-row"><span>Dividends</span><b class="up">+${money(C.divIps)}/s</b></div>` +
    `<div class="pf-row"><span>Limit per company</span><b>${money(stockCap())}</b></div>` +
    `<div class="pf-row"><span>Trading profit, all time</span><b class="${S.life.tradeProfit >= 0 ? 'up' : 'down'}">${signed(S.life.tradeProfit)}</b></div>`);

  // bank: one loan at a time, worth it only to grab a fast-paying Best deal now
  const room = loanRoom(), owe = S.debt > 0;
  bestDeal();
  const need = UI.bestCost - S.cash, worth = !owe && need > 0 && need <= room && UI.bestPay <= LOAN.worth;
  set(E.debtVal, owe ? money(S.debt) : 'No loan');
  cls(E.debtVal, 't-red', owe);
  setHTML(E.loanTip, owe ? `${ico('up')}${pct(LOAN.rate)}/min` : worth ? `${ico('check')}Worth it` : '');
  setCls(E.loanTip, 'loan-tip ' + (owe ? 'bad' : worth ? 'good' : ''));
  set(E.debtSub, owe ? `Interest +${money(S.debt * LOAN.rate)}/min · paid off in ${fmtShort(payoffTime())} from ${pct(LOAN.repay)} of income`
    : worth ? `Best deal pays back in ${fmtShort(UI.bestPay)}: borrow ${money(need)} to buy it now`
      : `Lends ¼ of your net worth · ${pct(LOAN.fee)} fee · ${pct(LOAN.rate)} interest a minute`);
  setW(E.loanBar, (owe && S.loan0 > 0 ? Math.min(100, S.debt / S.loan0 * 100) : 0) + '%');
  set(E.loanLimit, owe ? pct(Math.max(0, 1 - S.debt / Math.max(S.loan0, S.debt))) + ' repaid' : 'Limit ' + money(room));
  set(E.loan25, money(Math.floor(room * 0.25)));
  set(E.loanMax, money(Math.floor(room)));
  cls(E.btnLoan25, 'off', room * 0.25 < 1);
  cls(E.btnLoanMax, 'off', room < 1);
  set(E.repayVal, owe ? money(Math.min(S.debt, S.cash)) : '—');
  cls(E.btnRepay, 'off', !owe || S.cash < 0.01);
}

// ----- Property tab -----
function buildProps() {
  E.propList.innerHTML = PROPERTIES.map(p => `<div class="card photo-card" data-id="${p.id}">
    <div class="photo">${pic(IMG.prop(p.id), '', p.name)}
      <span class="owned-badge" data-f="own"></span>
      <span class="price-vs" data-f="vs"></span>
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
  const idx = S.housing, pct0 = (idx - 1) * 100, rising = housingRising();
  set(E.hIdx, (pct0 >= 0 ? '+' : '−') + Math.abs(pct0).toFixed(1) + '%');
  setCls(E.hIdx, 'big-num ' + (pct0 >= 0 ? 'up' : 'down'));
  const mood = idx <= COLD ? ['cold', 'Cold: buy'] : idx >= HOT ? ['hot', 'Hot: sell'] : rising ? ['', 'Warming up'] : ['', 'Cooling down'];
  setHTML(E.hMood, ico(rising ? 'arrow-up' : 'arrow-down') + mood[1]);
  setCls(E.hMood, 'mood ' + mood[0]);
  if (UI.chartsDirty) { drawSpark(E.hChart, S.housingHist, 1, 1); UI.chartsDirty = false; }
  set(E.rentTotal, money(C.rentIps) + '/s');

  UI.refs.props.forEach(r => {
    const p = r.p, n = S.props[p.id], each = propGain(p), cost = propPrice(p), pay = cost / each;
    set(r.f.own, n ? 'Owned ×' + n : 'For sale');
    cls(r.f.own, 'has', n > 0);
    const vs = idx - 1;
    set(r.f.vs, Math.abs(vs) < 0.03 ? '' : pctS(vs) + (vs < 0 ? ' cheap' : ' pricey'));
    setCls(r.f.vs, 'price-vs ' + (vs < 0 ? 'cheap' : 'pricey') + (Math.abs(vs) < 0.03 ? ' hide' : ''));
    set(r.f.rent, money(each) + '/s' + (n ? ' ×' + n : ''));
    set(r.f.payback, fmtShort(pay));
    setCls(r.f.payback, payCls(pay) === 'bad' ? '' : 't-' + (payCls(pay) === 'good' ? 'green' : 'gold'));
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
    <div class="photo">${pic(IMG.lux(l.id), '', l.name)}<span class="price-tag">${money(l.cost)}</span><span class="owned-ribbon">${ico('check')}Owned</span><span class="lux-flag" data-f="flag"></span></div>
    <div class="lc-body">
      <div class="lc-name">${l.name}</div>
      <div class="lc-rep">${pic(IMG.i3d('crown'), '', '')}+${l.rep}<span class="lc-worth" data-f="worth"></span></div>
      <button class="btn btn-blue" data-act="lux" data-id="${l.id}" data-f="btn"><small data-f="pay"></small><b data-f="bl">Buy</b></button>
    </div>
  </div>`).join('');
  UI.refs.lux = $$('.lux-card', E.luxList).map(el => ({ el, l: LUX[el.dataset.id], f: fields(el) }));
}

function renderLife() {
  if (!UI.keys.cats) { UI.keys.cats = 1; buildLuxCats(); }
  if (UI.keys.lux !== UI.luxCat) { UI.keys.lux = UI.luxCat; buildLux(); }
  set(E.repVal, fmt(C.rep));
  set(E.repPct, '+' + fmt((repMult(C.rep) - 1) * 100) + '%');
  set(E.repPoint, money((C.bizIps + C.rentIps) * REP_BONUS / repMult(C.rep)) + '/s');
  UI.refs.cats.forEach(r => {
    const items = LUXURY.filter(l => l.cat === r.id);
    set(r.f.n, items.filter(l => S.lux[l.id]).length + '/' + items.length);
    cls(r.el, 'active', r.id === UI.luxCat);
  });
  UI.refs.lux.forEach(r => {
    const owned = !!S.lux[r.l.id], g = luxGain(r.l), pay = g > 0 ? r.l.cost / g : Infinity;
    cls(r.el, 'owned', owned);
    set(r.f.worth, owned ? '' : ' · +' + money(g) + '/s');
    set(r.f.flag, owned ? '' : pay <= SMART_LUX ? 'Smart buy' : pay > 3600 ? 'Too early' : '');
    setCls(r.f.flag, 'lux-flag ' + (owned ? '' : pay <= SMART_LUX ? 'good' : pay > 3600 ? 'bad' : ''));
    setHTML(r.f.pay, owned ? '' : ico('clock') + fmtShort(pay));
    cls(r.f.pay, 'hide', owned);
    set(r.f.bl, owned ? 'Owned' : 'Buy');
    setCls(r.f.btn, owned ? 'btn btn-soft' : 'btn btn-blue' + (r.l.cost > S.cash ? ' off' : ''));
  });
}

// The Profile tab is drawn by renderProfile() in profile.js.

// ---------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------
let lastTick = Date.now(), lastSave = Date.now(), frame = 0;

function tick() {
  const now = Date.now();
  const dt = (now - lastTick) / 1000;
  lastTick = now;
  if (dt < 0) return;
  if (dt > 10) grantOffline(dt, dt > 120 && !document.hidden); // the app was asleep or in the background
  else econStep(dt, now);
  // taps per second, smoothed: tells hustle boosts how much they'd earn you
  UI.tapRate += (UI.tapN / Math.max(dt, 0.05) - UI.tapRate) * (1 - Math.exp(-Math.min(dt, 10) / 15));
  UI.tapN = 0;
  if (UI.streak > 0 && now - UI.lastTap > 900) UI.streak = Math.max(0, UI.streak - 1);
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
    case 'loan': ok = takeLoan(+id); break;
    case 'repay': ok = repayLoan(); break;
    case 'cat': UI.luxCat = id; break;
    case 'claim': ok = claimGoal() || goalTip(); break;
    case 'goto': switchTab(id); break;
    case 'prestige': ok = askPrestige(); break;
    case 'reset': ok = askReset(); break;
    default: ok = profileAction(t.dataset.act, id, t); // profile.js handles its own buttons
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
  S.timers = { event: now + 120000, briefcase: now + 60000, news: now + 15000, crash: now + rand(6, 10) * 60000 };
  if (!saved) warmUpMarkets();
  recompute();
  let upgraded = false;
  if (S.goalScan) { // a save from before 3.0: skip the new goals that are already done
    delete S.goalScan;
    S.goal = 0;
    while (S.goal < GOALS.length && GOALS[S.goal].check()) S.goal++;
    COMBOS.forEach(c => { if (comboOn(c)) S.combos[c.id] = true; }); // no burst of combo toasts later
    upgraded = true;
  }

  if (!S.seenIntro) {
    S.seenIntro = true;
    showIntro(); // profile.js
  } else if (saved) {
    const away = (now - (saved.saved || now)) / 1000;
    if (away > 10) grantOffline(away, away > 60);
  }
  checkDaily();
  if (upgraded) showWhatsNew();

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

  lastTick = lastSave = Date.now();
  switchTab('biz');
  saveGame();
  setInterval(tick, 100);
}

// profile.js loads after this file, so start once every script has run.
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
