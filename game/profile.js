'use strict';
/* =====================================================================
   Cash Climb: the player (name, picture), the header badges and their
   info pop-ups, the first-launch intro, the profile editor and the
   Profile tab with its Me / Assets / Collection sub-tabs.
   Loads after game.js and uses its state (S, C, UI, E) and helpers.
   game.js calls renderPlayer(), renderProfile(), showIntro(), playerPic()
   and profileAction(). Everything else stays inside this closure, so no
   name here can clash with game.js.
   ===================================================================== */
(function () {

const AVATARS = 24;      // img/avatar/0.svg … 23.svg
const AUTO_LOOKS = 10;   // 0–9: the same climber, dressed richer for each title
const NAME_MAX = 16;
const PHOTO_PX = 256;    // an uploaded photo becomes a square JPEG this size
const PHOTO_MAX = 25e6;  // bytes; bigger files are refused
const PHOTO_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/;
const SUBTABS = ['me', 'assets', 'collection'];

// Extra line icons (Tabler, MIT), only added where icons.js has none
const MORE_ICONS = {
  pencil: '<path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"/><path d="M13.5 6.5l4 4"/>',
  camera: '<path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"/><path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>',
  trash: '<path d="M4 7l16 0"/><path d="M10 11l0 6"/><path d="M14 11l0 6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>',
};
window.ICONS = window.ICONS || {};
Object.keys(MORE_ICONS).forEach(k => { if (!window.ICONS[k]) window.ICONS[k] = MORE_ICONS[k]; });

// Profile > Me "Fortune" bar. b = assetBook()
const FORTUNE = [
  { label: 'Cash',        color: '#2F7CF6', val: () => S.cash },
  { label: 'Businesses',  color: '#EE4459', val: b => sumOf(b.businesses) },
  { label: 'Stocks',      color: '#F59E3B', val: b => sumOf(b.stocks) },
  { label: 'Real estate', color: '#8B5CF6', val: b => sumOf(b.properties) },
  { label: 'Lifestyle',   color: '#18B26B', val: b => sumOf(b.lifestyle) },
];

// Profile > Assets sections. list + attr find the item's card on its own tab.
const KINDS = [
  { key: 'businesses', name: 'Businesses',  img: 'briefcase', color: '#EE4459', tab: 'biz',    list: '#bizList',   attr: 'data-id',  empty: 'No businesses yet', go: 'Open one' },
  { key: 'properties', name: 'Real estate', img: 'house',     color: '#8B5CF6', tab: 'prop',   list: '#propList',  attr: 'data-id',  empty: 'No property yet',   go: 'Buy one' },
  { key: 'stocks',     name: 'Stocks',      img: 'chart-up',  color: '#F59E3B', tab: 'market', list: '#stockList', attr: 'data-sym', empty: 'No shares yet',     go: 'Trade' },
];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------
const num = v => (typeof v === 'number' && isFinite(v) ? v : 0);
const sumOf = (list, k) => (list || []).reduce((a, x) => a + num(x[k || 'value']), 0);
const pct = x => { const r = Math.round(x * 10) / 10; return (Math.abs(r) >= 1000 ? fmt(r) : String(r)) + '%'; }; // 5.0000001 → "5%"
const plusPct = m => '+' + pct(Math.max(0, (m - 1) * 100)); // income multiplier → "+12%"
const byId = id => document.getElementById(id);
const cssq = v => (window.CSS && CSS.escape ? CSS.escape(v) : String(v));
const sfx = k => { try { if (SFX[k]) SFX[k](); } catch (e) { /* no sound */ } };
// A photo with the collection's 3D icon behind it (shows while loading or if the photo is missing)
const photo = (src, alt, fb) => `<span class="p-pics">${pic(IMG.i3d(fb), 'p-fb', '')}${pic(src, 'p-img', alt)}</span>`;
const li = (img, text) => `<div>${pic(IMG.i3d(img), '', '')}<span>${text}</span></div>`;
const boxes = list => '<div class="pi-boxes">' +
  list.map(b => `<div><span>${b[0]}</span><b class="${b[2] || ''}"${b[3] ? ` id="${b[3]}"` : ''}>${b[1]}</b></div>`).join('') + '</div>';

let bookErr = false;
// assetBook() from game.js, with every list guaranteed to exist
function getBook() {
  let b = null;
  try { b = assetBook(); } catch (e) { if (!bookErr) { bookErr = true; console.error('assetBook()', e); } }
  b = b && typeof b === 'object' ? b : {};
  ['businesses', 'properties', 'stocks', 'lifestyle'].forEach(k => { if (!Array.isArray(b[k])) b[k] = []; });
  if (!b.lifestyle.length) {
    b.lifestyle = LUXURY.map(l => ({ id: l.id, cat: l.cat, name: l.name, img: IMG.lux(l.id), owned: !!S.lux[l.id], cost: l.cost, rep: l.rep, value: 0 }));
  }
  return b;
}
const debtOf = b => Math.max(0, num(b.debt));
const catOf = id => LUX_CATS.find(c => c.id === id) || { id, name: 'More', img: 'gem' };
// Collections in LUX_CATS order, plus any category game.js forgot to list
function catsOf(items) {
  const out = LUX_CATS.filter(c => items.some(x => x.cat === c.id));
  items.forEach(x => { if (!out.some(c => c.id === x.cat)) out.push(catOf(x.cat)); });
  return out;
}

// Scroll the main area to an element (below the sticky sub-tabs) and make it glow
function scrollToEl(el, center) {
  const m = E.main, r = el.getBoundingClientRect(), mr = m.getBoundingClientRect();
  const seg = byId('pSegWrap');
  const head = center ? (mr.height - r.height) / 2 : (seg && seg.offsetHeight ? seg.offsetHeight : 0) + 6;
  const top = Math.max(0, m.scrollTop + r.top - mr.top - Math.max(8, head));
  try { m.scrollTo({ top, behavior: 'smooth' }); } catch (e) { m.scrollTop = top; }
}
function flash(el) {
  el.classList.remove('p-flash');
  void el.offsetWidth;
  el.classList.add('p-flash');
  clearTimeout(el._pf);
  el._pf = setTimeout(() => el.classList.remove('p-flash'), 1700);
}

// ---------------------------------------------------------------------
// The player: S.profile = { name: string, avatar: number|null, photo: data URL|'' }
// ---------------------------------------------------------------------
function prof() {
  if (!S.profile || typeof S.profile !== 'object' || Array.isArray(S.profile)) S.profile = {};
  return S.profile;
}
const okAvatar = a => typeof a === 'number' && a % 1 === 0 && a >= 0 && a < AVATARS;
let memo = ['', false];
function okPhoto(s) {
  if (typeof s !== 'string' || !s) return false;
  if (memo[0] !== s) memo = [s, s.length < 3e6 && PHOTO_RE.test(s)];
  return memo[1];
}
const autoLook = () => Math.max(0, Math.min(AUTO_LOOKS - 1, C.titleIdx | 0));
const titleName = () => (TITLES[C.titleIdx | 0] || TITLES[0])[1];
const playerName = () => { const n = prof().name; return typeof n === 'string' ? n : ''; };

// The picture shown for the player everywhere (header, profile, toasts).
// Until the player picks a look, it follows the wealth title.
function playerPic() {
  const p = prof();
  if (okPhoto(p.photo)) return p.photo;
  return IMG.avatar(okAvatar(p.avatar) ? p.avatar : autoLook());
}

function cleanName(s) {
  s = String(s || '').replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2066-\u2069]/g, '').replace(/\s+/g, ' ').trim();
  return Array.from(s).slice(0, NAME_MAX).join('').trim();
}

let ready = false;
function setup() {
  if (ready) return;
  ready = true;
  // One hidden file picker for "Upload photo" (a <label for="pFile"> opens it)
  const f = document.createElement('input');
  f.type = 'file';
  f.accept = 'image/*';
  f.id = 'pFile';
  f.className = 'p-file';
  f.tabIndex = -1;
  f.setAttribute('aria-hidden', 'true');
  f.addEventListener('change', onPhotoPicked);
  document.body.appendChild(f);
  // Enter in the editor's name field just closes the keyboard
  E.modalCard.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.id === 'peName') { e.preventDefault(); e.target.blur(); }
  });
}

// ----- Header -----
function renderPlayer() {
  setup();
  const name = playerName(), title = titleName();
  set(E.whoName, name || title);
  set(E.title, name ? title + ' ·' : 'Net worth');
  set(E.networth, money(C.net));
  setSrc(E.avatar, playerPic());
  set(E.repBadge, fmt(C.rep));
  set(E.starBadge, fmt(S.stars));
  if (live && modalOpen()) live();
}

// ---------------------------------------------------------------------
// First launch: welcome, then a skippable "pick your name and look"
// ---------------------------------------------------------------------
function showIntro() {
  setup();
  showModal({
    title: '',
    html: '<div class="p-logo"><img src="img/logo.svg" alt="Cash Climb" onload="this.parentNode.classList.add(\'ok\')" onerror="this.remove()"></div>' +
      '<div class="p-h2">Welcome to Cash Climb</div><p class="pe-intro">Start broke. Climb to the top.</p>' +
      '<div class="m-list">' + li('coin', 'Tap the coin for your first dollars') + li('bank', 'Open businesses that earn every second') +
      li('chart-up', 'Trade stocks and buy property') + li('car', 'Buy cars, homes and yachts for reputation') +
      li('star', 'Pass it all to your heir for Legacy Stars') + '</div>',
    buttons: [{ label: "Let's get rich!", cls: 'btn-gold', fn: () => openEditor(true) }],
  });
}

// ---------------------------------------------------------------------
// Profile editor: name, a look (avatar) or an own photo
// ---------------------------------------------------------------------
const PE = { open: false, avatar: null, upload: '', usePhoto: false }; // the unsaved draft

function draftPic() { return PE.usePhoto && PE.upload ? PE.upload : IMG.avatar(PE.avatar === null ? autoLook() : PE.avatar); }

function openEditor(intro) {
  setup();
  const p = prof();
  PE.open = true;
  PE.avatar = okAvatar(p.avatar) ? p.avatar : null;
  PE.upload = okPhoto(p.photo) ? p.photo : '';
  PE.usePhoto = !!PE.upload;
  let tiles = `<button class="pe-av pe-tag${PE.upload ? '' : ' hide'}" data-act="pAva" data-id="photo" id="pePhotoTile" aria-label="Your photo"><img ${PE.upload ? `src="${PE.upload}"` : ''} alt=""><em>Photo</em></button>` +
    `<button class="pe-av pe-tag" data-act="pAva" data-id="auto" aria-label="Changes with your title"><img src="${IMG.avatar(autoLook())}" alt=""><em>Auto</em></button>`;
  for (let i = 0; i < AVATARS; i++) {
    tiles += `<button class="pe-av" data-act="pAva" data-id="${i}" aria-label="Look ${i + 1}"><img src="${IMG.avatar(i)}" alt="" onerror="this.parentNode.classList.add('hide')"></button>`;
  }
  const done = () => { PE.open = false; };
  showModal({
    title: intro ? "Who's climbing?" : 'Edit profile',
    html: '<div class="pe">' +
      (intro ? '<p class="pe-intro">Pick a name and a look. You can change them later in Profile.</p>' : '') +
      `<div class="pe-top"><span class="pe-prev" id="pePrev"><img src="${draftPic()}" alt=""></span>
        <div class="pe-btns">
          <label class="btn btn-blue mini" for="pFile">${ico('camera')}Upload photo</label>
          <button class="btn btn-red-o mini${PE.upload ? '' : ' hide'}" data-act="pNoPhoto" id="peNoPhoto">${ico('trash')}Remove photo</button>
        </div></div>
      <input class="pe-name" id="peName" type="text" maxlength="${NAME_MAX}" placeholder="Your name" value="${esc(playerName())}" autocomplete="off" autocapitalize="words" spellcheck="false" enterkeyhint="done">
      <div class="pe-grid" id="peGrid">${tiles}</div></div>`,
    buttons: [
      { label: intro ? 'Start climbing' : 'Save', cls: 'btn-green', fn: () => { done(); saveEditor(intro); } },
      { label: intro ? 'Skip for now' : 'Cancel', cls: 'btn-soft', fn: done },
    ],
  });
  drawDraft();
}

function drawDraft() {
  const prev = byId('pePrev'), grid = byId('peGrid');
  if (!prev || !grid) return;
  setSrc($('img', prev), draftPic());
  cls(byId('peNoPhoto'), 'hide', !PE.upload);
  const pt = byId('pePhotoTile');
  cls(pt, 'hide', !PE.upload);
  if (PE.upload) setSrc($('img', pt), PE.upload);
  $$('.pe-av', grid).forEach(b => {
    const id = b.dataset.id;
    cls(b, 'on', id === 'photo' ? PE.usePhoto : !PE.usePhoto && (id === 'auto' ? PE.avatar === null : +id === PE.avatar));
  });
}

function pickAvatar(id) {
  if (!PE.open || !byId('peGrid')) return null;
  if (id === 'photo') PE.usePhoto = !!PE.upload;
  else {
    PE.usePhoto = false;
    PE.avatar = id === 'auto' ? null : Math.max(0, Math.min(AVATARS - 1, parseInt(id, 10) || 0));
  }
  drawDraft();
  sfx('tap');
  return true;
}

function dropPhoto() {
  if (!PE.open) return null;
  PE.upload = '';
  PE.usePhoto = false;
  drawDraft();
  return true;
}

function onPhotoPicked(e) {
  const input = e.target, file = input.files && input.files[0];
  input.value = ''; // so picking the same file again still fires "change"
  if (!file || !PE.open) return;
  const prev = byId('pePrev');
  cls(prev, 'busy', true);
  photoFromFile(file, (err, url) => {
    cls(prev, 'busy', false);
    if (err) { toast(err, 'bad', IMG.i3d('warning')); sfx('no'); return; }
    if (!PE.open) return; // the editor was closed meanwhile
    PE.upload = url;
    PE.usePhoto = true;
    drawDraft();
    sfx('buy');
  });
}

// A picked image file → a small square JPEG data URL (centre crop). cb(errorText, url)
function photoFromFile(file, cb) {
  if (!file || typeof file.size !== 'number') return cb('No picture was picked');
  if (file.type && !/^image\//i.test(file.type)) return cb('That file is not a picture');
  if (file.size > PHOTO_MAX) return cb('That picture is too big (max 25 MB)');
  const rd = new FileReader();
  rd.onerror = () => cb("Couldn't read that picture");
  rd.onload = () => {
    const im = new Image();
    im.onerror = () => cb("Can't open that picture type. Try a JPG or PNG.");
    im.onload = () => {
      let url = '';
      try {
        const w = im.naturalWidth, h = im.naturalHeight, s = Math.min(w, h);
        if (s > 0) {
          const cv = document.createElement('canvas');
          cv.width = cv.height = PHOTO_PX;
          const g = cv.getContext('2d');
          g.fillStyle = '#fff'; // transparent pictures get a white background
          g.fillRect(0, 0, PHOTO_PX, PHOTO_PX);
          g.imageSmoothingEnabled = true;
          g.imageSmoothingQuality = 'high';
          g.drawImage(im, (w - s) / 2, (h - s) / 2, s, s, 0, 0, PHOTO_PX, PHOTO_PX);
          url = cv.toDataURL('image/jpeg', 0.85);
        }
      } catch (err) { /* out of memory or a tainted canvas */ }
      if (PHOTO_RE.test(url)) cb(null, url);
      else cb("Couldn't use that picture");
    };
    im.src = rd.result;
  };
  try { rd.readAsDataURL(file); } catch (err) { cb("Couldn't read that picture"); }
}

function saveEditor(intro) {
  const p = prof(), inp = byId('peName');
  const name = cleanName(inp ? inp.value : p.name);
  p.name = name;
  p.avatar = PE.avatar;
  p.photo = PE.usePhoto && okPhoto(PE.upload) ? PE.upload : '';
  saveGame();
  toast(name ? (intro ? `Welcome, ${name}!` : `Looking sharp, ${name}!`) : 'Profile saved', 'good', playerPic());
  sfx('cash');
  if (intro) confetti(30);
}

// ---------------------------------------------------------------------
// Info pop-ups for the crown (reputation) and star (Legacy Stars) badges
// ---------------------------------------------------------------------
let live = null; // keeps the numbers of an open pop-up ticking (called from renderPlayer)

function liveNeed(cost) {
  setW(byId('piBar'), Math.min(100, S.cash / cost * 100) + '%');
  const n = byId('piNeed'), can = S.cash >= cost;
  set(n, can ? 'You can buy it now!' : money(cost - S.cash) + ' to go');
  cls(n, 't-green', can);
}

function showRepInfo() {
  const items = getBook().lifestyle, own = items.filter(x => x.owned).length;
  const next = items.filter(x => !x.owned).sort((a, b) => a.cost - b.cost)[0];
  const per = (repMult(C.rep + 1) - repMult(C.rep)) * 100;
  let html = '<div class="pi"><p class="pi-lead">Lifestyle items earn reputation, and reputation boosts all your income.</p>' +
    boxes([['Points', fmt(C.rep), 't-gold'], ['Income', plusPct(repMult(C.rep)), 't-green'], ['Items', own + '/' + items.length]]) +
    '<div class="m-list">' + li('car', 'Buy cars, homes, yachts and more') + li('chart-up', `+${pct(per)} income per point`) +
    li('baby', 'Resets when you pass the empire on') + '</div>';
  if (next) {
    const gain = (repMult(C.rep + next.rep) - repMult(C.rep)) * 100;
    html += `<div class="pi-next"><div class="eyebrow">Next step</div>
      <div class="pi-item"><span class="pi-th">${photo(next.img, next.name, catOf(next.cat).img)}</span>
        <div class="grow"><b>${esc(next.name)}</b><span><span class="t-gold">+${fmt(next.rep)} rep</span> · <span class="t-green">+${pct(gain)}</span></span></div>
        <b class="pi-price">${money(next.cost)}</b></div>
      <div class="bar"><i id="piBar"></i></div><div class="pi-need" id="piNeed"></div></div>`;
  } else {
    html += `<div class="pi-next pi-done">${pic(IMG.i3d('award'), 'pi-ico', '')}<b>You own every lifestyle item!</b></div>`;
  }
  showModal({
    img: 'crown', title: 'Reputation', html: html + '</div>',
    buttons: [
      next ? { label: 'Shop Lifestyle', cls: 'btn-gold', fn: () => openLife(next.cat, next.id) }
        : { label: 'See my collection', cls: 'btn-gold', fn: () => openSub('collection') },
      { label: 'Close', cls: 'btn-soft' },
    ],
  });
  live = next ? () => liveNeed(next.cost) : null;
  if (live) live();
}

function liveStar() {
  const g = starsAvailable(), a = earnedForStars(g), b = earnedForStars(g + 1);
  const p = b > a ? (S.runEarned - a) / (b - a) : 1;
  setW(byId('piBar'), Math.max(0, Math.min(1, p)) * 100 + '%');
  set(byId('piNeed'), money(Math.max(0, b - S.runEarned)) + ' more to earn');
  set(byId('piHeir'), '+' + fmt(g));
  set(byId('piTitle'), g ? `Heir gets +${fmt(g)} → +${fmt(g + 1)}` : 'Your first star');
  set(byId('piSub'), 'Earned this life ' + money(S.runEarned));
  cls(byId('piHeir'), 't-gold', g > 0);
}

function showStarInfo() {
  const per = (starMult(S.stars + 1) - starMult(S.stars)) * 100;
  const html = '<div class="pi"><p class="pi-lead">Pass your empire to an heir to earn Legacy Stars. Stars are never lost.</p>' +
    boxes([['Stars', fmt(S.stars), 't-gold'], ['Income', plusPct(starMult(S.stars)), 't-green'], ['Heir gets', '+0', '', 'piHeir']]) +
    '<div class="m-list">' + li('baby', 'Retire in Profile to pass it on') + li('star', `+${pct(per)} income per star, forever`) +
    li('moneybag', 'Earn more in one life for more stars') + '</div>' +
    `<div class="pi-next"><div class="eyebrow">Next star</div>
      <div class="pi-item">${pic(IMG.i3d('star'), 'pi-ico', '')}<div class="grow"><b id="piTitle"></b><span class="muted" id="piSub"></span></div></div>
      <div class="bar gold"><i id="piBar"></i></div><div class="pi-need" id="piNeed"></div></div></div>`;
  showModal({
    img: 'star', title: 'Legacy Stars', html,
    buttons: [{ label: 'Open heir card', cls: 'btn-gold', fn: openHeir }, { label: 'Close', cls: 'btn-soft' }],
  });
  live = liveStar;
  live();
}

// ---------------------------------------------------------------------
// Navigation helpers
// ---------------------------------------------------------------------
function setSub(t) {
  if (SUBTABS.indexOf(t) < 0) return false;
  if (UI.pTab !== t) { UI.pTab = t; E.main.scrollTop = 0; }
  return true;
}
function openSub(t) {
  setSub(t);
  if (UI.tab !== 'profile') switchTab('profile');
  else { E.main.scrollTop = 0; render(); }
}
function openHeir() {
  openSub('me');
  const el = byId('heirCard');
  if (el) { scrollToEl(el, true); flash(el); }
}
// Lifestyle tab on a category, scrolled to one item
function openLife(cat, id) {
  if (LUX_CATS.some(c => c.id === cat)) UI.luxCat = cat;
  switchTab('life');
  const el = id && document.querySelector(`#luxList [data-id="${cssq(id)}"]`);
  if (el) { scrollToEl(el, true); flash(el); }
}
// "biz:lemon" → the Business tab, scrolled to the Lemonade Stand
function openAsset(id) {
  const i = String(id).indexOf(':'), k = KINDS.find(x => x.tab === String(id).slice(0, i));
  if (!k) return false;
  switchTab(k.tab);
  const el = document.querySelector(`${k.list} [${k.attr}="${cssq(String(id).slice(i + 1))}"]`);
  if (el) { scrollToEl(el, true); flash(el); }
  return true;
}
function jumpTo(id) {
  const el = byId(id);
  if (!el) return false;
  scrollToEl(el, false);
  flash(el);
  return true;
}

// ----- Buttons with data-act that game.js doesn't handle itself -----
// Return false to shake the button (not allowed), anything else for OK.
function profileAction(act, id, el) {
  switch (act) {
    case 'sound': return toggleSound();
    case 'credits': return showCredits();
    case 'pMe': openSub('me'); return true;            // header picture / name
    case 'pTab': return setSub(id);                    // Me / Assets / Collection
    case 'pEdit': openEditor(false); return true;
    case 'pAva': return pickAvatar(id);                // editor: a look, "auto" or "photo"
    case 'pNoPhoto': return dropPhoto();
    case 'pRep': showRepInfo(); return true;           // crown badge
    case 'pStar': showStarInfo(); return true;         // star badge
    case 'pItem': return showItem(id);                 // a lifestyle item in Collection
    case 'pJump': return jumpTo(id);                   // scroll to a section of the tab
    case 'pOpen': return openAsset(id);                // an asset row → its own tab
  }
  return null;
}

function toggleSound() {
  S.settings.sound = !S.settings.sound;
  if (S.settings.sound) sfx('buy');
  return true;
}

function showCredits() {
  const list = window.CREDITS || [];
  const html = list.length
    ? '<p class="small">Photos were cropped and resized for the game; a few were also rotated or had their background extended at the edges. Thank you to everyone who shared their work!</p>' +
      '<div class="credits">' + list.map(c => `<div class="cr"><b>${esc(c.title || c.what || '')}</b>` +
        (c.author ? `<span>${esc(c.author)}</span>` : '') +
        `<span class="tiny muted">${esc(c.license || '')}${c.file ? ' · ' + esc(c.file) : ''}</span>` +
        (c.source ? `<span class="tiny muted">${esc(c.source)}</span>` : '') + '</div>').join('') + '</div>'
    : 'No credits found.';
  showModal({ img: 'camera', title: 'Image credits', html, buttons: [{ label: 'Close', cls: 'btn-blue' }] });
  return true;
}

// ---------------------------------------------------------------------
// Profile tab
// ---------------------------------------------------------------------
function buildProfile() {
  E.stackBar.innerHTML = FORTUNE.map(f => `<i style="background:${f.color}"></i>`).join('');
  E.legend.innerHTML = FORTUNE.map(f => `<div class="lg" style="border-left-color:${f.color}">${f.label}<b></b></div>`).join('') +
    '<div class="lg neg hide">Loans<b></b></div>';
  UI.refs.fbar = $$('i', E.stackBar);
  UI.refs.flg = $$('.lg b', E.legend);
  UI.refs.fdebt = $('.lg.neg', E.legend);
  const stats = [
    ['cash', 'c-blue', 'Earned this life'], ['world', 'c-green', 'Earned all time'],
    ['bolt', 'c-orange', 'Best income'], ['tap', 'c-purple', 'Coin taps'],
    ['chart-bar', 'c-teal', 'Trading profit'], ['users', 'c-red', 'Generation'],
    ['clock', 'c-blue', 'Time played'], ['calendar', 'c-green', 'Daily streak'],
  ];
  E.stats.innerHTML = stats.map(s => `<div class="st"><span class="st-ico ${s[1]}">${ico(s[0])}</span><div>${s[2]}<b></b></div></div>`).join('');
  UI.refs.stats = $$('.st b', E.stats);
  UI.refs.pSeg = $$('button', E.pSeg);
}

function renderProfile() {
  if (!UI.keys.profile) { UI.keys.profile = 1; buildProfile(); }
  const tab = SUBTABS.indexOf(UI.pTab) >= 0 ? UI.pTab : 'me';
  UI.refs.pSeg.forEach(b => cls(b, 'active', b.dataset.id === tab));
  cls(E.pMe, 'hide', tab !== 'me');
  cls(E.pAssets, 'hide', tab !== 'assets');
  cls(E.pCollect, 'hide', tab !== 'collection');
  setSrc(E.pSegPic, playerPic());
  const book = getBook();
  if (tab === 'me') renderMe(book);
  else if (tab === 'assets') renderAssets(book);
  else renderCollection(book);
}

// ----- Me: hero, fortune, heir, statistics, settings -----
function renderMe(book) {
  const name = playerName(), title = titleName();
  setSrc(E.heroAvatar, playerPic());
  set(E.heroName, name || title);
  set(E.heroTitle, title);
  cls(E.heroTitle, 'hide', !name);
  set(E.heroRep, fmt(C.rep));
  set(E.heroStars, fmt(S.stars));
  set(E.heroGen, 'Gen ' + fmt(num(S.life.prestiges) + 1));

  set(E.fortune, money(C.net));
  const parts = FORTUNE.map(f => num(f.val(book)));
  const total = Math.max(1e-9, parts.reduce((a, v) => a + Math.max(0, v), 0));
  parts.forEach((v, i) => {
    setW(UI.refs.fbar[i], (Math.max(0, v) / total * 100) + '%');
    set(UI.refs.flg[i], money(v));
  });
  const debt = debtOf(book);
  cls(UI.refs.fdebt, 'hide', !debt);
  set(UI.refs.flg[FORTUNE.length], money(-debt));

  const g = starsAvailable(), a = earnedForStars(g), b = earnedForStars(g + 1);
  set(E.starCount, fmt(S.stars));
  set(E.starGain, '+' + fmt(g));
  set(E.starBonus, plusPct(starMult(S.stars)));
  set(E.starPer, '+' + pct((starMult(S.stars + 1) - starMult(S.stars)) * 100));
  setW(E.starBar, (b > a ? Math.max(0, Math.min(1, (S.runEarned - a) / (b - a))) * 100 : 100) + '%');
  set(E.starNext, money(Math.max(0, b - S.runEarned)) + (g < 1 ? ' to your first star' : ' to the next star'));
  cls(E.btnPrestige, 'off', g < 1);
  const adv = heirAdvice(); // game.js: is now a good time to retire?
  set(E.heirAdv, adv.label);
  setCls(E.heirAdv, 'h-adv ' + (adv.verdict || 'hide'));

  const L = S.life, streak = S.daily.streak || 0;
  const vals = [money(S.runEarned), money(L.earned), money(L.bestIps) + '/s', fmt(L.taps),
    signed(L.tradeProfit), '#' + (L.prestiges + 1), fmtTime(L.played), streak + (streak === 1 ? ' day' : ' days')];
  vals.forEach((v, i) => set(UI.refs.stats[i], v));
  cls(E.btnSound, 'on', S.settings.sound);
}

// ----- Assets: businesses, real estate and stocks -----
function assetRow(k, a) {
  const logo = k.key === 'stocks';
  return `<button class="pa-row" data-act="pOpen" data-id="${k.tab}:${esc(a.id)}">` +
    `<span class="pa-th${logo ? ' logo' : ''}">${pic(a.img, '', a.name)}${logo ? '' : '<em data-f="tag"></em>'}</span>` +
    `<span class="pa-mid"><b>${esc(a.name)}</b><span><span class="t-green" data-f="inc"></span><span data-f="note"></span></span></span>` +
    '<span class="pa-val"><b data-f="val"></b><span data-f="pl"></span></span></button>';
}

function buildAssets(book) {
  const debt = debtOf(book);
  let h = `<div class="card pa-sum">
    <div class="pa-top"><div class="grow"><div class="eyebrow">Assets value</div><div class="big-num" data-f="tot"></div></div>${pic(IMG.i3d('moneybag'), 'pa-ico', '')}</div>
    <div class="pa-chips"><span class="pa-chip">${ico('up')}<b data-f="ips"></b></span>` +
    (debt ? `<span class="pa-chip neg">${ico('credit')}<b data-f="debt"></b></span>` : '') + `</div>
    <div class="stack-bar pa-bar">${KINDS.map(k => `<i style="background:${k.color}"></i>`).join('')}</div>
    <div class="pa-split">${KINDS.map(k => `<button data-act="pJump" data-id="pa-${k.tab}" style="--c:${k.color}"><span>${k.name}</span><b data-f="v-${k.key}"></b><em data-f="n-${k.key}"></em></button>`).join('')}</div>
  </div>`;
  KINDS.forEach(k => {
    const list = book[k.key];
    h += `<div class="card pa-sec" id="pa-${k.tab}"><div class="pa-head">${pic(IMG.i3d(k.img), '', '')}<h3>${k.name}</h3>` +
      '<span class="pa-tot"><b data-f="tv"></b><span class="t-green" data-f="ti"></span></span></div>' +
      (list.length ? list.map(a => assetRow(k, a)).join('')
        : `<div class="pa-empty"><span>${k.empty}</span><button class="btn btn-blue mini" data-act="goto" data-id="${k.tab}">${k.go}</button></div>`) +
      '</div>';
  });
  E.pAssets.innerHTML = h;
  UI.refs.pAs = {
    f: fields($('.pa-sum', E.pAssets)),
    bar: $$('.pa-bar i', E.pAssets),
    secs: KINDS.map(k => {
      const el = byId('pa-' + k.tab);
      return { f: fields($('.pa-head', el)), rows: $$('.pa-row', el).map(r => fields(r)) };
    }),
  };
}

// P/L chip, or a muted note when the profit isn't known
function plCell(el, pl, base, note) {
  if (pl === null) { setCls(el, 'pa-note'); set(el, note || ''); return; }
  setCls(el, 'pl ' + (pl >= 0 ? 'up' : 'down'));
  set(el, signed(pl) + (base > 0 ? ` (${pl < 0 ? '-' : '+'}${pct(Math.abs(pl / base * 100))})` : ''));
}

function fillRow(k, a, f) {
  set(f.val, money(num(a.value)));
  if (k.key === 'businesses') {
    set(f.tag, 'Lv ' + fmt(num(a.level)));
    set(f.inc, '+' + money(num(a.income)) + '/s');
    plCell(f.pl, null, 0, 'Paid ' + money(num(a.invested)));
  } else if (k.key === 'properties') {
    const paid = typeof a.paid === 'number' && a.paid > 0 ? a.paid : 0;
    set(f.tag, '×' + fmt(num(a.count)));
    set(f.inc, '+' + money(num(a.income)) + '/s');
    set(f.note, a.loc ? ' · ' + a.loc : '');
    plCell(f.pl, paid ? num(a.value) - paid : null, paid, '');
  } else {
    set(f.note, fmt(num(a.shares)) + ' shares');
    plCell(f.pl, num(a.value) - num(a.paid), num(a.paid));
  }
}

function renderAssets(book) {
  const key = KINDS.map(k => book[k.key].map(a => a.id).join(',')).join('|') + (debtOf(book) ? '|debt' : '');
  if (UI.keys.pAssets !== key) { UI.keys.pAssets = key; buildAssets(book); }
  const R = UI.refs.pAs, vals = KINDS.map(k => sumOf(book[k.key])), tot = vals.reduce((a, v) => a + v, 0);
  set(R.f.tot, money(tot));
  set(R.f.ips, '+' + money(C.ips) + '/s');
  set(R.f.debt, money(-debtOf(book)) + ' loans');
  KINDS.forEach((k, i) => {
    const list = book[k.key], s = R.secs[i], inc = sumOf(list, 'income');
    setW(R.bar[i], (tot > 0 ? vals[i] / tot * 100 : 0) + '%');
    set(R.f['v-' + k.key], money(vals[i]));
    set(R.f['n-' + k.key], list.length + (k.key === 'stocks' ? ' held' : ' owned'));
    set(s.f.tv, money(vals[i]));
    set(s.f.ti, inc > 0 ? '+' + money(inc) + '/s' : '');
    list.forEach((a, j) => { if (s.rows[j]) fillRow(k, a, s.rows[j]); });
  });
}

// ----- Collection: lifestyle items curated by LUX_CATS -----
function tile(it, c) {
  return `<button class="pc-tile ${it.owned ? 'own' : 'lock'}" data-act="pItem" data-id="${esc(it.id)}">` +
    `<span class="pc-ph">${photo(it.img, it.name, c.img)}<span class="pc-badge">${ico(it.owned ? 'check' : 'lock')}</span></span>` +
    `<span class="pc-nm">${esc(it.name)}</span><span class="pc-pr">${it.owned ? '+' + fmt(it.rep) + ' rep' : money(it.cost)}</span></button>`;
}

function buildCollection(items) {
  const cats = catsOf(items);
  const counts = cats.map(c => {
    const list = items.filter(x => x.cat === c.id);
    return { c, list, n: list.filter(x => x.owned).length };
  });
  let h = `<div class="card pc-sum">
    <div class="pa-top"><div class="grow"><div class="eyebrow">Collection</div><div class="big-num"><span data-f="own"></span><small> / ${items.length} items</small></div></div>${pic(IMG.i3d('award'), 'pa-ico', '')}</div>
    <div class="bar"><i data-f="bar"></i></div>
    <div class="pa-split">
      <button data-act="pRep" style="--c:var(--gold)"><span>Reputation</span><b data-f="rep"></b></button>
      <div style="--c:var(--green)"><span>Income</span><b data-f="inc"></b></div>
      <div style="--c:#B79CFF"><span>Value</span><b data-f="val"></b></div>
    </div>
    <div class="pc-cats">${counts.map(x => `<button class="pc-cat${x.n === x.list.length ? ' done' : ''}" data-act="pJump" data-id="pc-${x.c.id}" aria-label="${esc(x.c.name)}">` +
      `${pic(IMG.i3d(x.c.img), '', '')}<em>${x.n}/${x.list.length}</em></button>`).join('')}</div>
  </div>`;
  counts.forEach(x => {
    const done = x.n === x.list.length;
    h += `<div class="card pc-col${done ? ' done' : ''}" id="pc-${x.c.id}">
      <div class="pc-head">${pic(IMG.i3d(x.c.img), 'pc-hico', '')}
        <div class="grow"><b>${esc(x.c.name)}</b><div class="bar${done ? ' gold' : ''}"><i style="width:${x.n / x.list.length * 100}%"></i></div></div>
        <span class="pc-n">${done ? ico('check') + 'Complete' : x.n + '/' + x.list.length}</span></div>
      <div class="pc-grid">${x.list.map(it => tile(it, x.c)).join('')}</div></div>`;
  });
  E.pCollect.innerHTML = h;
  UI.refs.pCol = {
    f: fields($('.pc-sum', E.pCollect)),
    locked: $$('.pc-tile.lock', E.pCollect).map(el => ({ el, it: items.find(x => x.id === el.dataset.id) })),
  };
}

function renderCollection(book) {
  const items = book.lifestyle;
  const key = items.map(x => x.id + (x.owned ? '+' : '-')).join('');
  if (UI.keys.pCol !== key) { UI.keys.pCol = key; buildCollection(items); }
  const R = UI.refs.pCol, own = items.filter(x => x.owned).length;
  set(R.f.own, String(own));
  setW(R.f.bar, (own / Math.max(1, items.length) * 100) + '%');
  set(R.f.rep, '+' + fmt(C.rep));
  set(R.f.inc, plusPct(repMult(C.rep)));
  set(R.f.val, money(sumOf(items)));
  R.locked.forEach(r => cls(r.el, 'can', !!r.it && r.it.cost <= S.cash));
}

// A lifestyle item close up
function showItem(id) {
  const it = getBook().lifestyle.find(x => x.id === id);
  if (!it) return false;
  const c = catOf(it.cat);
  const gain = it.owned ? (repMult(C.rep) - repMult(C.rep - it.rep)) * 100 : (repMult(C.rep + it.rep) - repMult(C.rep)) * 100;
  let html = `<div class="pd"><div class="pd-ph${it.owned ? '' : ' lock'}">${photo(it.img, it.name, c.img)}` +
    `<span class="pd-tag${it.owned ? ' own' : ''}">${ico(it.owned ? 'check' : 'lock')}${it.owned ? 'Owned' : 'Not owned'}</span></div>` +
    `<div class="pd-name">${esc(it.name)}</div><div class="pd-cat">${pic(IMG.i3d(c.img), '', '')}${esc(c.name)}</div>` +
    boxes(it.owned
      ? [['Paid', money(num(it.cost))], ['Worth now', money(num(it.value))], ['Reputation', '+' + fmt(num(it.rep)), 't-gold']]
      : [['Price', money(num(it.cost))], ['Reputation', '+' + fmt(num(it.rep)), 't-gold'], ['Income', '+' + pct(gain), 't-green']]);
  html += it.owned ? `<div class="pi-need t-green">+${pct(gain)} to all your income</div></div>`
    : '<div class="bar"><i id="piBar"></i></div><div class="pi-need" id="piNeed"></div></div>';
  showModal({
    title: '', html,
    buttons: it.owned ? [{ label: 'Close', cls: 'btn-blue' }]
      : [{ label: 'Get it in Lifestyle', cls: 'btn-blue', fn: () => openLife(it.cat, it.id) }, { label: 'Close', cls: 'btn-soft' }],
  });
  live = it.owned ? null : () => liveNeed(num(it.cost));
  if (live) live();
  return true;
}

// game.js calls these
Object.assign(window, { renderPlayer, renderProfile, showIntro, playerPic, profileAction });
// for testing from the console
window.PlayerProfile = { photoFromFile, openEditor, showRepInfo, showStarInfo, showItem, cleanName };

})();
