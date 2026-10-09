const $ = id => document.getElementById(id);
const local = $('local'), remote = $('remote'), cv = $('strip'), fxl = $('fxlive');
const DATE = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
const STAMP = (d => `'${String(d.getFullYear()).slice(2)} ${d.getMonth() + 1} ${d.getDate()}`)(new Date());
const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const P = s => new Path2D(s);
const pick = a => a[Math.floor(Math.random() * a.length)];

/* ================= DATA ================= */
const FILTERS = {
  Asli: '', Lembut: 'contrast(108%) brightness(108%) saturate(110%)', Vintage: 'sepia(35%) contrast(120%) brightness(95%) hue-rotate(-15deg)',
  Noir: 'grayscale(100%) contrast(135%)', Senja: 'saturate(170%) contrast(112%) hue-rotate(12deg)', Korea: 'brightness(115%) contrast(95%) saturate(105%)',
  Dingin: 'hue-rotate(170deg) saturate(80%) brightness(105%)', CCD: 'contrast(125%) saturate(130%) brightness(105%) sepia(12%)',
  Flash: 'brightness(125%) contrast(115%) saturate(90%)', Fade: 'contrast(90%) brightness(112%) saturate(85%) sepia(10%)', Pop: 'saturate(160%) contrast(115%)'
};
const FXS = ['Tanpa', 'Vignette', 'Light Leak', 'VHS', 'Bloom', 'Debu'];
const CAPTIONS = {
  Happy: ['Hari yang seru', 'Good vibes only', 'Bahagia itu sederhana'], Bestie: ['Geng paling solid', 'Partner in crime', 'Bestie forever'],
  Couple: ['Dua hati, satu frame', 'Jauh di mata, dekat di layar', 'Selalu kamu'], Aesthetic: ['Soft hours', 'Golden moments', 'Film diaries'],
  Lucu: ['Muka asli tanpa filter', 'Salah pose tapi sayang', 'Blur dikit gapapa'], Anime: ['Kawaii day', 'Ganbatte!', 'Nyaa~ hari ini'],
  'K-pop': ['Bias wrecker', 'Stan era', 'Comeback stage'], Lebaran: ['Selamat Lebaran', 'Minal Aidin', 'Maaf lahir batin'],
  Ultah: ['Happy Birthday!', 'Make a wish', 'Tambah umur, tambah cuan'], Wisuda: ['Akhirnya lulus!', 'Sarjana muda', 'Toga on'],
  Merdeka: ['Dirgahayu RI', 'Merdeka!', 'Bangga Indonesia']
};
const POSES = ['Senyum lebar!', 'Pose peace ✌️', 'Pura-pura kaget', 'Tatap kamera serius', 'Tertawa lepas', 'Pose hati 🫶', 'Tengok ke samping', 'Kiss face 😘', 'Pipi dicubit', 'Tepuk tangan'];
const LAY = { 'strip-2': [2, 1, '2 foto'], 'strip-3': [3, 1, '3 foto'], 'strip-4': [4, 1, '4 foto'], 'grid-4': [4, 2, '2×2'], 'grid-6': [6, 2, '2×3'] };
const TF = [s => `italic 700 ${s}px "Playfair Display"`, s => `400 ${s}px "Permanent Marker"`, s => `700 ${s}px "Space Mono"`, s => `400 ${s}px Pacifico`];
const THEMES = { scrap: '#e8452c', neon: '#ff4fd8', bubble: '#ff4f98', matcha: '#2f7a52' };

/* ================= STIKER ================= */
const circ = (p, x, y, r) => { p.moveTo(x + r, y); p.arc(x, y, r, 0, 7); };
const dot = (x, px, py, r, c) => { x.fillStyle = c; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); };
const HEART = 'M50 90C8 60 6 28 28 20C40 16 48 24 50 32C52 24 60 16 72 20C94 28 92 60 50 90Z';
const SPARK = 'M50 2C54 34 66 46 98 50C66 54 54 66 50 98C46 66 34 54 2 50C34 46 46 34 50 2Z';
const CLOUD = 'M25 72a18 18 0 0 1 2-36a24 24 0 0 1 46 4a17 17 0 0 1 0 32z';
const MOON = 'M70 8A44 44 0 1 0 92 70A36 36 0 1 1 70 8Z';
const STAR = 'M50 6l13 28 31 4-23 21 6 31-27-15-27 15 6-31L6 38l31-4z';
const S = (cat, n, c, p, d) => ({ cat, n, c, p, d });
const DD = (n, c, path) => ({ ...S('doodle', n, c, () => P(path)), st: 1 });
const ST = [
  S('umum', 'heart', '#ff4f7b', () => P(HEART), x => { x.fillStyle = '#fff9'; x.beginPath(); x.ellipse(30, 34, 6, 4, -.6, 0, 7); x.fill(); }),
  S('umum', 'spark', '#ffd84a', () => P(SPARK)),
  S('umum', 'star', '#ffcf3f', () => P(STAR)),
  S('umum', 'flower', '#ff9ccf', () => { const p = new Path2D(); for (let i = 0; i < 6; i++) circ(p, 50 + 25 * Math.cos(i * 1.047), 50 + 25 * Math.sin(i * 1.047), 19); return p; }, x => { dot(x, 50, 50, 12, '#ffd84a'); x.beginPath(); x.arc(50, 50, 12, 0, 7); x.stroke(); }),
  S('umum', 'smile', '#ffe14d', () => { const p = new Path2D(); circ(p, 50, 50, 44); return p; }, x => { dot(x, 36, 42, 5, '#17150f'); dot(x, 64, 42, 5, '#17150f'); x.beginPath(); x.arc(50, 56, 20, .2, 2.94); x.stroke(); }),
  S('umum', 'cloud', '#bfe3ff', () => P(CLOUD)),
  S('umum', 'bolt', '#ffd23f', () => P('M58 4L18 56h26L38 96l44-56H56z')),
  S('umum', 'bow', '#ff7aa8', () => P('M50 50C30 20 6 24 8 50C6 76 30 80 50 50C70 80 94 76 92 50C94 24 70 20 50 50Z'), x => { dot(x, 50, 50, 9, '#ff4f7b'); x.beginPath(); x.arc(50, 50, 9, 0, 7); x.stroke(); }),
  S('umum', 'cat', '#ffb36b', () => P('M14 30L24 6L40 22Q50 20 60 22L76 6L86 30Q94 50 80 70Q50 94 20 70Q6 50 14 30Z'), x => { dot(x, 38, 46, 4.5, '#17150f'); dot(x, 62, 46, 4.5, '#17150f'); dot(x, 50, 56, 4, '#ff4f7b'); }),
  S('anime', 'sakura', '#ffb7d5', () => { const p = new Path2D(); for (let i = 0; i < 5; i++) { const a = i * 1.2566 - 1.5708; circ(p, 50 + 24 * Math.cos(a), 50 + 24 * Math.sin(a), 17); } return p; }, x => dot(x, 50, 50, 7, '#ff6fa5')),
  S('anime', 'onigiri', '#fff', () => P('M50 10Q58 10 90 78Q94 90 80 90H20Q6 90 10 78Q42 10 50 10Z'), x => { x.fillStyle = '#17150f'; x.fillRect(30, 68, 40, 20); dot(x, 40, 48, 3.5, '#17150f'); dot(x, 60, 48, 3.5, '#17150f'); }),
  S('anime', 'kawaii', '#fff3d6', () => { const p = new Path2D(); circ(p, 50, 50, 44); return p; }, x => { x.lineWidth = 3; x.beginPath(); x.arc(34, 50, 7, 3.3, 6.1); x.stroke(); x.beginPath(); x.arc(66, 50, 7, 3.3, 6.1); x.stroke(); dot(x, 22, 62, 7, '#ff9ccf99'); dot(x, 78, 62, 7, '#ff9ccf99'); }),
  S('anime', 'paw', '#ffc4d8', () => { const p = new Path2D(); circ(p, 50, 66, 22); circ(p, 20, 42, 10); circ(p, 38, 22, 10); circ(p, 62, 22, 10); circ(p, 80, 42, 10); return p; }),
  S('kpop', 'note', '#b8a1ff', () => { const p = new Path2D(); circ(p, 34, 76, 14); circ(p, 68, 68, 14); p.rect(42, 14, 8, 62); p.rect(76, 8, 8, 60); p.rect(42, 10, 42, 14); return p; }),
  S('kpop', 'lightstick', '#ff6fa5', () => { const p = new Path2D(); p.addPath(P(HEART), new DOMMatrix([.6, 0, 0, .6, 20, 0])); p.rect(46, 52, 8, 44); return p; }),
  S('kpop', 'crown', '#ffd23f', () => P('M10 80L6 28L32 50L50 14L68 50L94 28L90 80Z'), x => { dot(x, 6, 28, 5, '#ff4f7b'); dot(x, 50, 14, 5, '#ff4f7b'); dot(x, 94, 28, 5, '#ff4f7b'); }),
  S('sekolah', 'pencil', '#ffd23f', () => P('M70 6L94 30L36 88L8 92L12 64Z'), x => { x.fillStyle = '#ff9ccf'; x.beginPath(); x.moveTo(70, 6); x.lineTo(94, 30); x.lineTo(82, 42); x.lineTo(58, 18); x.closePath(); x.fill(); x.stroke(); }),
  S('sekolah', 'book', '#8ec5ff', () => P('M8 20Q30 12 50 24Q70 12 92 20V82Q70 74 50 86Q30 74 8 82Z'), x => { x.beginPath(); x.moveTo(50, 24); x.lineTo(50, 86); x.stroke(); }),
  S('sekolah', 'gradcap', '#2a3a7a', () => { const p = P('M50 14L96 38L50 62L4 38Z'); p.addPath(P('M24 52V72Q50 88 76 72V52L50 66Z')); return p; }, x => { x.strokeStyle = '#ffd23f'; x.lineWidth = 3; x.beginPath(); x.moveTo(90, 40); x.lineTo(90, 70); x.stroke(); dot(x, 90, 74, 5, '#ffd23f'); }),
  S('lebaran', 'crescent', '#ffe9a0', () => P(MOON)),
  S('lebaran', 'starL', '#ffcf3f', () => P(STAR)),
  S('ultah', 'hat', '#ff7ac8', () => P('M50 8L86 90H14Z'), x => { dot(x, 50, 8, 7, '#ffd84a'); dot(x, 38, 60, 5, '#fff'); dot(x, 60, 46, 5, '#8ec5ff'); dot(x, 52, 76, 5, '#ffd84a'); }),
  DD('arrow', '#e8452c', 'M10 70C30 20 60 20 80 40M80 40L62 38M80 40L74 58'),
  DD('squig', '#2b4fd8', 'M5 50Q20 20 35 50T65 50T95 50'),
  DD('wave', '#ff4f98', 'M5 60Q30 40 50 58T95 48'),
  DD('loop', '#17150f', 'M50 12C20 8 6 40 16 66C30 94 76 92 90 60C98 30 70 8 40 20'),
  DD('zig', '#f2a900', 'M5 70L25 30L45 70L65 30L85 70'),
  DD('heartO', '#ff4f7b', HEART),
  DD('starO', '#f2a900', STAR),
  DD('burst', '#17150f', 'M50 10V30M50 70V90M10 50H30M70 50H90M22 22L36 36M64 64L78 78M78 22L64 36M36 64L22 78')
];
const EM = {
  ekspresi: ['😎', '🥹', '🤪', '😍', '🫶', '✌️', '🤟', '💅', '🥰', '🤭', '😜', '🫠', '😭', '🤩', '😈', '🙈'],
  hewan: ['🐱', '🐶', '🐰', '🐻', '🐼', '🦊', '🐥', '🦋', '🐸', '🦄', '🐙', '🐢', '🐷', '🐨', '🐝', '🦖'],
  makanan: ['🍓', '🍒', '🍑', '🧋', '🍩', '🍕', '🍟', '🍦', '🍉', '🍪', '🍙', '☕', '🍔', '🍜', '🍫', '🥐'],
  anime: ['🌸', '🍡', '🍜', '⛩️', '🎐', '🐾', '💫', '🍥', '🎀', '🧸', '🍙', '🌙'],
  kpop: ['🎤', '🎧', '💜', '🪩', '🎶', '💿', '📸', '🔥', '💃', '🕺', '💖', '🖤'],
  sekolah: ['✏️', '📚', '🎒', '📐', '🧮', '📓', '🖍️', '🔬', '🏫', '🧪'],
  lebaran: ['🌙', '🕌', '⭐', '🏮', '🎇', '🍪', '🤲', '🧕', '🐪', '✨', '🥮', '💚'],
  ultah: ['🎂', '🎈', '🎁', '🥳', '🎉', '🍰', '🕯️', '🎊', '🧁', '🍾', '🎶', '🪩'],
  wisuda: ['🎓', '📜', '🏆', '🥇', '🌟', '📚', '💐', '✨', '🎉', '🥂', '💛', '🕊️'],
  alam: ['☀️', '🌈', '☁️', '⚡', '❄️', '🌊', '🔥', '🌻', '🍀', '🌴', '🌙', '🍃'],
  umum: ['💖', '✨', '🎀', '💌', '🫧', '🌟', '💫', '🖤']
};
const STXT = {
  umum: ['pill|slay', 'pill|bff', 'pill|main char', 'pill|y2k', 'pill|cutie', 'tape|POV', 'tape|no cap', 'tape|2026', 'neon|mood', 'bub|hehe', 'bub|bestie!', 'neon|vibes'],
  ekspresi: ['bub|wkwk', 'bub|astaga', 'bub|mager', 'neon|gemes', 'pill|kocak', 'tape|bruh'],
  anime: ['pill|ganbatte', 'pill|kawaii', 'tape|sugoi', 'tape|senpai', 'bub|nya~', 'neon|uwu'],
  kpop: ['pill|bias', 'pill|stan', 'tape|comeback', 'bub|fighting!', 'neon|era', 'tape|OT7'],
  sekolah: ['tape|ulangan', 'pill|bestie kelas', 'bub|lulus!', 'pill|A+', 'tape|jam kosong', 'neon|study'],
  lebaran: ['pill|Idulfitri', 'tape|THR dong', 'bub|maaf ya', 'neon|minal aidin', 'pill|mudik', 'tape|ketupat'],
  ultah: ['neon|HBD!', 'pill|make a wish', 'tape|+1 level', 'bub|yeay!', 'pill|traktir', 'tape|17++'],
  wisuda: ['pill|lulus!', 'tape|S.Pd', 'bub|akhirnya', 'neon|toga on', 'pill|sarjana', 'tape|2026'],
  hewan: ['bub|meow', 'bub|guk!', 'pill|gemoy'], makanan: ['bub|laper', 'pill|yummy', 'tape|jajan', 'neon|boba'], alam: ['neon|sunny', 'pill|healing', 'tape|sore']
};
const CATS = { umum: 'Umum', doodle: 'Doodle', ekspresi: 'Ekspresi', hewan: 'Hewan', makanan: 'Makanan', anime: 'Anime', kpop: 'K-pop', sekolah: 'Sekolah', lebaran: 'Lebaran', ultah: 'Ultah', wisuda: 'Wisuda', alam: 'Alam' };
const PCOL = ['#ff9ccf', '#ffd84a', '#8ec5ff', '#b6f0a8', '#ffb36b', '#d4b8ff'];
const catKeys = c => [...ST.filter(s => s.cat === c).map(s => s.n), ...(EM[c] || []).map(e => 'E:' + e), ...(STXT[c] || []).map(t => 'T:' + t)];

function rrect(x, X, Y, W, H, r) { x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); }
const EC = new Map();
function emo(e) {
  if (EC.has(e)) return EC.get(e);
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.font = '96px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, 64, 70);
  const s = document.createElement('canvas'); s.width = s.height = 128; const y = s.getContext('2d');
  y.drawImage(c, 0, 0); y.globalCompositeOperation = 'source-in'; y.fillStyle = '#fff'; y.fillRect(0, 0, 128, 128);
  const o = { c, s }; EC.set(e, o); return o;
}
function drawText(x, st, t) {
  const c = PCOL[t.length % 6];
  if (st === 'pill') {
    x.font = '700 24px "Space Mono",monospace'; const w = x.measureText(t).width + 30;
    x.beginPath(); rrect(x, 50 - w / 2, 32, w, 36, 18); x.strokeStyle = '#fff'; x.lineWidth = 9; x.stroke(); x.shadowBlur = 0;
    x.fillStyle = c; x.fill(); x.strokeStyle = '#17150f'; x.lineWidth = 2.5; x.stroke(); x.fillStyle = '#17150f'; x.fillText(t, 50, 58);
  } else if (st === 'tape') {
    x.font = '700 22px "Space Mono",monospace'; const w = x.measureText(t).width + 34, X = 50 - w / 2;
    x.fillStyle = c; x.fillRect(X, 34, w, 34);
    x.save(); x.beginPath(); x.rect(X, 34, w, 34); x.clip(); x.strokeStyle = '#fff7'; x.lineWidth = 6;
    for (let k = -34; k < w; k += 14) { x.beginPath(); x.moveTo(X + k, 34); x.lineTo(X + k + 34, 68); x.stroke(); } x.restore();
    x.strokeStyle = '#17150f'; x.lineWidth = 2; x.strokeRect(X, 34, w, 34); x.fillStyle = '#17150f'; x.fillText(t, 50, 58);
  } else if (st === 'bub') {
    x.font = '400 24px "Permanent Marker"'; const w = x.measureText(t).width + 30;
    x.beginPath(); rrect(x, 50 - w / 2, 24, w, 40, 14); x.moveTo(38, 63); x.lineTo(32, 84); x.lineTo(56, 63); x.closePath();
    x.fillStyle = '#fff'; x.fill(); x.shadowBlur = 0; x.lineWidth = 3; x.strokeStyle = '#17150f'; x.stroke(); x.fillStyle = '#17150f'; x.fillText(t, 50, 53);
  } else {
    x.font = '400 30px Pacifico'; x.lineWidth = 8; x.strokeStyle = '#17150f'; x.strokeText(t, 50, 58);
    x.shadowColor = c; x.shadowBlur = 16; x.fillStyle = c; x.fillText(t, 50, 58); x.shadowBlur = 6; x.fillStyle = '#fff'; x.fillText(t, 50, 58);
  }
}
function drawSt(x, s, W, H) {
  x.save(); x.translate(s.x * W, s.y * H); x.rotate(s.r); const k = .9 * s.s; x.scale(k, k); x.translate(-50, -50);
  x.lineJoin = x.lineCap = 'round'; x.shadowColor = '#0004'; x.shadowBlur = 6; x.textAlign = 'center';
  const key = s.k;
  if (key === 'IMG') {
    const im = s.img, sc = 100 / Math.max(im.width, im.height), w = im.width * sc, h = im.height * sc, px = 50 - w / 2, py = 50 - h / 2;
    x.fillStyle = '#fff'; x.beginPath(); rrect(x, px - 5, py - 5, w + 10, h + 10, 8); x.fill(); x.shadowBlur = 0; x.drawImage(im, px, py, w, h);
  } else if (key.startsWith('E:')) {
    const o = emo(key.slice(2));
    for (let a = 0; a < 6.28; a += .52) { x.shadowBlur = a ? 0 : 6; x.drawImage(o.s, 6 * Math.cos(a), 6 * Math.sin(a), 100, 100); }
    x.shadowBlur = 0; x.drawImage(o.c, 0, 0, 100, 100);
  } else if (key.startsWith('T:')) {
    const [st, t] = key.slice(2).split('|'); drawText(x, st, t);
  } else {
    const D = ST.find(d => d.n === key), p = D.p();
    if (D.st) { x.lineWidth = 14; x.strokeStyle = '#fff'; x.stroke(p); x.shadowBlur = 0; x.lineWidth = 6; x.strokeStyle = D.c; x.stroke(p); }
    else { x.lineWidth = 10; x.strokeStyle = '#fff'; x.stroke(p); x.shadowBlur = 0; x.fillStyle = D.c; x.fill(p); x.lineWidth = 2.5; x.strokeStyle = '#17150f'; x.stroke(p); if (D.d) D.d(x); }
  }
  x.restore();
}

/* ================= FRAME ================= */
const F = (n, cat, a, b, fg, p, c, w) => ({ n, cat, a, b, fg, p, c, w });
const FR = [
  F('Putih Polos', 'Trendy', '#ffffff', 0, '#1e1b17', 0, 0, 0), F('Y2K Chrome', 'Trendy', '#dfe6f5', '#9fb3e8', '#27325c', 'stars', '#ffffffcc', 0),
  F('Coquette', 'Trendy', '#ffd6e4', 0, '#9c2a56', 'hearts', '#ff9fbe', 1), F('Matcha Gingham', 'Trendy', '#e6f1d8', 0, '#2d4a22', 'gingham', '#9cc27a77', 0),
  F('Holo Pastel', 'Trendy', '#ffd1f0', '#c9f0ff', '#4a2f6b', 'dots', '#ffffffaa', 0), F('Sunset', 'Trendy', '#ffb36b', '#ff5f8f', '#ffffff', 'dots', '#ffffff66', 1),
  F('Sky Blue', 'Trendy', '#bfe3ff', '#f4fbff', '#1d4f91', 'clouds', '#ffffffdd', 0), F('Lilac Dream', 'Trendy', '#e3d4ff', '#ffd9f1', '#4b2d8a', 'sparkle', '#ffffffcc', 1),
  F('Butter Polka', 'Trendy', '#fff0a8', 0, '#7a5200', 'polka', '#ffffff99', 1), F('Strawberry Milk', 'Trendy', '#ffd3df', 0, '#a01e4a', 'polka', '#ffffffaa', 1),
  F('Baby Plaid', 'Trendy', '#e6f0ff', 0, '#27458f', 'plaid', '#7aa6f066', 0), F('Pink Plaid', 'Trendy', '#ffe4ec', 0, '#8c1d45', 'plaid', '#ff7aa466', 1),
  F('Film Roll', 'Retro', '#141414', 0, '#f3e6c4', 'film', 0, 1), F('Notebook', 'Retro', '#fffdf2', 0, '#2b3a67', 'grid', '#9ab6e866', 0),
  F('Kraft', 'Retro', '#d9b98c', 0, '#3a2612', 'grid', '#0000001a', 1), F('Checker', 'Retro', '#ffffff', 0, '#111111', 'checker', '#111111', 0),
  F('Cherry Gingham', 'Retro', '#fff4f0', 0, '#b3122b', 'gingham', '#e3243b55', 1), F('Koran Lama', 'Retro', '#efe6d2', 0, '#2a2a2a', 'news', '#00000033', 1),
  F('Diner', 'Retro', '#fff6e6', 0, '#b3122b', 'checker', '#e3243b', 1), F('Pixel Arcade', 'Retro', '#1a1033', 0, '#7dfcff', 'pixel', '#ff4fd866', 0),
  F('Tiket Bioskop', 'Retro', '#e84a3a', 0, '#fff3d0', 'ticket', '#ffffff55', 1),
  F('Lebaran Hijau', 'Spesial', '#0f5c42', '#0a3d2c', '#ffe29a', 'moon', '#ffe29a88', 1), F('Ketupat', 'Spesial', '#fff4d6', 0, '#0f5c42', 'diamond', '#2f8a5e55', 1),
  F('Ramadan Night', 'Spesial', '#0b1b3a', '#1b3b73', '#ffe29a', 'moon', '#ffe29aaa', 0), F('Ulang Tahun', 'Spesial', '#fff0f6', 0, '#c2185b', 'confetti', 0, 1),
  F('Party Night', 'Spesial', '#2b1d5c', '#5a2d8a', '#ffffff', 'confetti', 0, 0), F('Wisuda Navy', 'Spesial', '#14213d', '#1f3566', '#f4d58d', 'stars', '#f4d58d99', 0),
  F('Wisuda Gold', 'Spesial', '#f7ecd0', 0, '#3b2a10', 'stripes', '#d9b45a55', 1), F('Merdeka', 'Spesial', '#d62828', 0, '#ffffff', 'polka', '#ffffff55', 1),
  F('Valentine', 'Spesial', '#ffd0d8', 0, '#b0123e', 'hearts', '#ff4f7baa', 1), F('Sakura Spring', 'Spesial', '#ffe8f0', '#ffd0e2', '#8a2a52', 'sakura', '#ff9fc0cc', 1),
  F('Midnight Star', 'Gelap', '#12163a', '#2a2466', '#ffe9a0', 'stars', '#ffe9a0cc', 0), F('Neon Idol', 'Gelap', '#0d0b1f', '#2a0f4a', '#ff9de6', 'grid', '#ff5fd266', 0),
  F('Cyber Grid', 'Gelap', '#050d0a', 0, '#6bff9a', 'grid', '#6bff9a44', 0), F('Galaxy', 'Gelap', '#1a0b3d', '#5a1d8f', '#ffd9ff', 'bokeh', '#ff9de666', 0),
  F('Noir', 'Gelap', '#0e0e0e', 0, '#f2f2f2', 'stripes', '#ffffff10', 0),
  F('Ocean Wave', 'Alam', '#bfe9f5', '#6cc3e0', '#0b4a66', 'waves', '#ffffff88', 0), F('Bubble Pop', 'Alam', '#c8f1ff', '#e6d4ff', '#33407a', 'bubbles', '#ffffffaa', 0),
  F('Rainbow', 'Alam', '#fff8ee', 0, '#5b3a8e', 'rainbow', 0, 1), F('Daisy Field', 'Alam', '#e9f7d8', '#c9eba8', '#2c5a1f', 'flowers', '#ffffffee', 1),
  F('Zig Zag', 'Alam', '#fff1c9', 0, '#8a3b00', 'zigzag', '#ff8a3d55', 1),
  { n: 'Gambarmu', cat: 'Milikmu', a: '#ffffff', fg: '#1e1b17', custom: true, w: 0 }, { n: 'Warna Bebas', cat: 'Milikmu', a: '#ffb3c7', fg: '#1e1b17', pick: true, w: 1 }
];
const fidx = name => FR.findIndex(f => f.n === name);
let customBg = null;
function drawFrame(x, W, H, f) {
  if (f.custom && customBg) { const s = Math.max(W / customBg.width, H / customBg.height), w = customBg.width * s, h = customBg.height * s; x.drawImage(customBg, (W - w) / 2, (H - h) / 2, w, h); return; }
  let g = null; if (f.b) { g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, f.a); g.addColorStop(1, f.b); }
  x.fillStyle = g || f.a; x.fillRect(0, 0, W, H);
  const c = f.c || '#0002', r = rnd(11), p = f.p; x.fillStyle = x.strokeStyle = c; x.lineWidth = 1;
  const loop = (sx, sy, fn) => { for (let j = 0, row = 0; j < H + sy; j += sy, row++) for (let i = (row % 2) * sx / 2; i < W + sx; i += sx) fn(i, j); };
  const circle = (i, j, rad) => { x.beginPath(); x.arc(i, j, rad, 0, 7); x.fill(); };
  if (p === 'dots') loop(28, 28, (i, j) => circle(i, j, 3.5));
  if (p === 'polka') loop(60, 60, (i, j) => circle(i, j, 13));
  if (p === 'gingham') { for (let i = 0; i < W; i += 40) x.fillRect(i, 0, 20, H); for (let j = 0; j < H; j += 40) x.fillRect(0, j, W, 20); }
  if (p === 'plaid') { for (let i = 0; i < W; i += 60) x.fillRect(i, 0, 26, H); for (let j = 0; j < H; j += 60) x.fillRect(0, j, W, 26); x.lineWidth = 2; for (let i = 40; i < W; i += 60) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); } }
  if (p === 'grid') { for (let i = 0; i < W; i += 24) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, H); x.stroke(); } for (let j = 0; j < H; j += 24) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j); x.stroke(); } }
  if (p === 'checker') for (let i = 0; i * 30 < W; i++) for (let j = 0; j * 30 < H; j++) if ((i + j) % 2) x.fillRect(i * 30, j * 30, 30, 30);
  if (['stars', 'hearts', 'clouds', 'moon', 'sparkle'].includes(p)) {
    const a = P(SPARK), b = P(p === 'hearts' ? HEART : p === 'clouds' ? CLOUD : MOON), cnt = p === 'sparkle' ? 80 : 46;
    for (let i = 0; i < cnt; i++) { x.save(); x.translate(r() * W, r() * H); const s = p === 'sparkle' ? .06 + r() * .1 : .12 + r() * .22; x.scale(s, s); x.fill(p === 'stars' || p === 'sparkle' || i % 3 === 0 ? a : b); x.restore(); }
  }
  if (p === 'diamond') loop(44, 44, (i, j) => { x.beginPath(); x.moveTo(i, j - 14); x.lineTo(i + 14, j); x.lineTo(i, j + 14); x.lineTo(i - 14, j); x.closePath(); x.fill(); });
  if (p === 'stripes') { x.lineWidth = 14; for (let k = -H; k < W; k += 40) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + H, H); x.stroke(); } }
  if (p === 'confetti') { const cl = ['#ff6fa5', '#ffd84a', '#8ec5ff', '#b6f0a8', '#d4b8ff', '#ffb36b']; for (let i = 0; i < 90; i++) { x.save(); x.translate(r() * W, r() * H); x.rotate(r() * 6); x.fillStyle = cl[i % 6]; x.fillRect(-6, -2.5, 12, 5); x.restore(); } }
  if (p === 'film') { x.fillStyle = f.fg; for (let j = 10; j < H; j += 34) { x.beginPath(); rrect(x, 8, j, 14, 20, 4); rrect(x, W - 22, j, 14, 20, 4); x.fill(); } }
  if (p === 'news') for (let j = 12; j < H; j += 14) for (let k = 0; k < 3; k++) x.fillRect(12 + k * (W / 3), j, (W / 3 - 24) * (.5 + r() * .5), 5);
  if (p === 'pixel') for (let i = 0; i < W; i += 24) for (let j = 0; j < H; j += 24) if (r() < .18) x.fillRect(i, j, 12, 12);
  if (p === 'ticket') { x.lineWidth = 3; x.setLineDash([8, 6]); x.strokeRect(14, 14, W - 28, H - 28); x.setLineDash([]); for (let j = 20; j < H; j += 26) { circle(0, j, 9); circle(W, j, 9); } }
  if (p === 'sakura') for (let i = 0; i < 60; i++) { x.save(); x.translate(r() * W, r() * H); x.rotate(r() * 6); x.beginPath(); x.ellipse(0, 0, 11, 5, 0, 0, 7); x.fill(); x.restore(); }
  if (p === 'bokeh') for (let i = 0; i < 40; i++) circle(r() * W, r() * H, 10 + r() * 35);
  if (p === 'waves') { x.lineWidth = 4; for (let j = 20; j < H; j += 36) { x.beginPath(); x.moveTo(0, j); for (let i = 0; i <= W; i += 8) x.lineTo(i, j + Math.sin(i / 22 + j) * 8); x.stroke(); } }
  if (p === 'bubbles') for (let i = 0; i < 36; i++) { const rad = 8 + r() * 26, X = r() * W, Y = r() * H; x.lineWidth = 3; x.beginPath(); x.arc(X, Y, rad, 0, 7); x.stroke(); x.fillStyle = '#ffffff33'; circle(X, Y, rad); x.fillStyle = c; }
  if (p === 'rainbow') { const cl = ['#ff6b6b', '#ffb347', '#ffe66d', '#7bd88f', '#6bb5ff', '#b28dff']; x.globalAlpha = .4; x.lineWidth = 22; let i = 0; for (let k = -H; k < W; k += 22) { x.strokeStyle = cl[i++ % 6]; x.beginPath(); x.moveTo(k, 0); x.lineTo(k + H, H); x.stroke(); } x.globalAlpha = 1; }
  if (p === 'flowers') for (let i = 0; i < 36; i++) { x.save(); x.translate(r() * W, r() * H); x.rotate(r() * 6); const s = .6 + r() * .6; x.scale(s, s); x.fillStyle = c; for (let k = 0; k < 8; k++) { x.rotate(.785); x.beginPath(); x.ellipse(12, 0, 10, 4.5, 0, 0, 7); x.fill(); } circle(0, 0, 6); x.fillStyle = '#ffd84a'; circle(0, 0, 5); x.restore(); }
  if (p === 'zigzag') { x.lineWidth = 5; for (let j = 24; j < H; j += 44) { x.beginPath(); x.moveTo(0, j); for (let i = 0, k = 0; i <= W; i += 20, k++) x.lineTo(i, j + (k % 2 ? 10 : -10)); x.stroke(); } }
}
function miniStrip(c, f, w = 140) {
  const W = 468, H = 1102; c.width = w; c.height = Math.round(w * H / W); const x = c.getContext('2d'); x.scale(w / W, w / W); drawFrame(x, W, H, f);
  for (let i = 0; i < 3; i++) { x.fillStyle = '#0003'; x.fillRect(34, 96 + i * 316, 400, 300); x.strokeStyle = '#fff'; x.lineWidth = 6; x.strokeRect(34, 96 + i * 316, 400, 300); }
}

/* ================= STATE ================= */
let stream, peer, face = 'user', mirror = true, sound = true, timer = 5, layout = 'strip-3', n = 3, frame = fidx('Y2K Chrome'), font = 0, mode = 'solo', joinPending = null;
let shots = [], imgs = [], idx = 0, preset = '', fxName = 'Tanpa', stickers = [], sel = -1, drag = null, gallery = [], coach = false, auto = false, busy = false, tmp = null, ac;
let cat = 'umum', frCat = 'Semua', grain = null, shape = 'box', pen = false, penCol = '#17150f', penW = 6, strokes = [], cur = null;

/* ================= TEMA APLIKASI & DEKOR ================= */
function setTheme(k) { document.body.dataset.theme = k; try { localStorage.setItem('snaphan-theme', k); } catch (e) {} }
document.querySelectorAll('.themes').forEach(box => Object.entries(THEMES).forEach(([k, c]) => {
  const d = document.createElement('button'); d.className = 'tdot'; d.style.background = c; d.title = k; d.onclick = () => setTheme(k); box.appendChild(d);
}));
try { const t = localStorage.getItem('snaphan-theme'); if (t && THEMES[t]) setTheme(t); } catch (e) {}
document.querySelectorAll('.bulbs').forEach(b => { for (let i = 0; i < 12; i++) b.appendChild(document.createElement('i')); });

/* ================= NAVIGASI ================= */
function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id)); scrollTo(0, 0); }
function theme() { const f = FR[frame]; document.documentElement.style.setProperty('--fa', f.custom || f.a === '#ffffff' ? '#f6d860' : f.a); }
$('btn-solo').onclick = () => { mode = 'solo'; show('setup'); };
$('btn-ldr').onclick = () => { mode = 'ldr'; show('setup'); };
$('btn-join-home').onclick = () => { const c = $('join-home').value.trim(); if (!/^\d{4}$/.test(c)) return alert('Masukkan kode 4 angka dari temanmu.'); mode = 'ldr'; joinPending = c; enterBooth(); };
$('back-home').onclick = () => show('home');
$('back-setup').onclick = () => show('setup');
$('go').onclick = () => enterBooth();
function enterBooth() { $('room-box').hidden = mode !== 'ldr'; show('booth'); theme(); render(); drawFxLive(); if (!stream) startCam(); else if (joinPending) { doJoin(joinPending); joinPending = null; } }

/* ================= SETUP ================= */
Object.entries(LAY).forEach(([k, v]) => {
  const b = document.createElement('button'); b.className = 'lay' + (k === layout ? ' on' : '');
  b.innerHTML = `<div class="mini" style="grid-template-columns:repeat(${v[1]},1fr)">${'<i></i>'.repeat(v[0])}</div>${v[2]}`;
  b.onclick = () => { [...$('lay-cards').children].forEach(z => z.classList.remove('on')); b.classList.add('on'); if (k !== layout) { layout = k; n = v[0]; resetSlots(); } };
  $('lay-cards').appendChild(b);
});
['Semua', 'Trendy', 'Retro', 'Spesial', 'Gelap', 'Alam', 'Milikmu'].forEach((k, i) => {
  const b = document.createElement('button'); b.textContent = k; if (!i) b.className = 'on';
  b.onclick = () => { frCat = k; $('fr-cats').querySelectorAll('button').forEach(z => z.classList.toggle('on', z === b)); buildFrames(); }; $('fr-cats').appendChild(b);
});
function buildFrames() {
  $('frames').innerHTML = '';
  FR.forEach((f, i) => {
    if (frCat !== 'Semua' && f.cat !== frCat) return;
    const b = document.createElement('button'), c = document.createElement('canvas'); b.className = 'fr' + (i === frame ? ' on' : '');
    miniStrip(c, f, 110); b.appendChild(c); b.append(f.n);
    b.onclick = () => { if (f.custom && !customBg) return $('f-frame').click(); setFrame(i); }; $('frames').appendChild(b);
  });
}
function setFrame(i) { frame = i; theme(); buildFrames(); render(); }
const loadFile = (file, cb) => { if (!file) return; const im = new Image(); im.onload = () => cb(im); im.src = URL.createObjectURL(file); };
$('btn-upframe').onclick = () => $('f-frame').click();
$('f-frame').onchange = e => { loadFile(e.target.files[0], im => { customBg = im; setFrame(fidx('Gambarmu')); }); e.target.value = ''; };
$('c-pick').oninput = e => {
  const i = fidx('Warna Bebas'), v = e.target.value, l = parseInt(v.slice(1, 3), 16) * .3 + parseInt(v.slice(3, 5), 16) * .59 + parseInt(v.slice(5), 16) * .11;
  FR[i].a = v; FR[i].fg = l > 140 ? '#1e1b17' : '#ffffff'; setFrame(i);
};
function surprise() {
  setFrame(pick(FR.map((f, i) => i).filter(i => !FR[i].custom && !FR[i].pick)));
  font = Math.floor(Math.random() * 4); document.querySelectorAll('#fonts button').forEach((b, i) => b.classList.toggle('on', i === font));
  $('t-title').value = pick(CAPTIONS[pick(Object.keys(CAPTIONS))]);
  shape = pick(['box', 'round', 'pola', 'tilt']); document.querySelectorAll('#shapes button').forEach(b => b.classList.toggle('on', b.dataset.v === shape)); render();
}
$('btn-rand').onclick = surprise; $('btn-rand2').onclick = surprise;
['Y2K Chrome', 'Lebaran Hijau', 'Strawberry Milk'].forEach(nm => { const c = document.createElement('canvas'); miniStrip(c, FR[fidx(nm)], 200); $('collage').appendChild(c); });
$('chips').innerHTML = [FR.length + ' frame', Object.keys(CATS).reduce((a, k) => a + catKeys(k).length, 0) + '+ stiker', 'gambar bebas', 'efek film', 'room LDR'].map(t => `<span>${t}</span>`).join('');

/* ================= KAMERA ================= */
function startCam() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return alert('Kamera butuh HTTPS atau localhost. Buka lewat Live Server atau hosting.');
  if (stream) stream.getTracks().forEach(t => t.stop());
  navigator.mediaDevices.getUserMedia({ video: { facingMode: face, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
    .then(s => { stream = s; local.srcObject = s; if (joinPending) { doJoin(joinPending); joinPending = null; } })
    .catch(() => alert('Izinkan akses kamera dulu ya, lalu muat ulang halaman.'));
}
function setMirror(v) { mirror = v; $('c-mirror').checked = v; local.classList.toggle('mir', v); remote.classList.toggle('mir', v); }
setMirror(true);
$('btn-flip').onclick = () => { face = face === 'user' ? 'environment' : 'user'; setMirror(face === 'user'); startCam(); };

/* ================= UI HELPER ================= */
function tabs(group, prefix) {
  const btns = document.querySelectorAll(`.tabs[data-group=${group}] button`);
  btns.forEach(b => b.onclick = () => { btns.forEach(z => z.classList.remove('on')); b.classList.add('on'); document.querySelectorAll(group === 'cam' ? '.pane' : '.dpane').forEach(p => p.classList.remove('on')); $(prefix + b.dataset.t).classList.add('on'); });
}
tabs('cam', 'p-'); tabs('des', 'd-');
function single(box, cb) { box.querySelectorAll('button').forEach(b => b.onclick = () => { box.querySelectorAll('button').forEach(z => z.classList.remove('on')); b.classList.add('on'); cb(b); }); }
function beep(f = 700, d = .1) {
  if (!sound) return;
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; o.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(.15, ac.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d); o.start(); o.stop(ac.currentTime + d); } catch (e) {}
}

/* ================= FILTER, EFEK, SMART ================= */
Object.keys(FILTERS).forEach((k, i) => { const b = document.createElement('button'); b.textContent = k; if (!i) b.className = 'on'; $('filters').appendChild(b); });
single($('filters'), b => { preset = FILTERS[b.textContent]; applyFilter(); });
FXS.forEach((k, i) => { const b = document.createElement('button'); b.textContent = k; if (!i) b.className = 'on'; $('fxs').appendChild(b); });
single($('fxs'), b => { fxName = b.textContent; drawFxLive(); });
function fx(x, w, h, k, live) {
  x.save();
  if (k === 'Vignette') { const g = x.createRadialGradient(w / 2, h / 2, h * .35, w / 2, h / 2, h * .85); g.addColorStop(0, '#0000'); g.addColorStop(1, '#000a'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
  if (k === 'Light Leak') {
    x.globalCompositeOperation = 'screen'; let g = x.createLinearGradient(0, 0, w * .5, 0); g.addColorStop(0, '#ff7a3dcc'); g.addColorStop(1, '#ff7a3d00'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    g = x.createRadialGradient(w, 0, 0, w, 0, h * .8); g.addColorStop(0, '#ff4fd8aa'); g.addColorStop(1, '#ff4fd800'); x.fillStyle = g; x.fillRect(0, 0, w, h);
  }
  if (k === 'VHS') {
    x.fillStyle = '#0003'; for (let y = 0; y < h; y += 4) x.fillRect(0, y, w, 2);
    x.font = '700 22px "Space Mono",monospace'; x.fillStyle = '#ff3b3b'; x.fillText('● REC', 18, 34);
    x.fillStyle = '#fff'; x.shadowColor = '#000'; x.shadowBlur = 3; x.fillText('PLAY ▶', 18, h - 18); x.textAlign = 'right'; x.fillText(STAMP, w - 18, h - 18);
  }
  if (k === 'Bloom' && !live) { x.globalCompositeOperation = 'screen'; x.globalAlpha = .4; x.filter = 'blur(12px)'; x.drawImage(x.canvas, 0, 0); }
  if (k === 'Debu') {
    const r = rnd(5); x.fillStyle = '#fff9'; for (let i = 0; i < 70; i++) { x.beginPath(); x.arc(r() * w, r() * h, r() * 2.2, 0, 7); x.fill(); }
    x.strokeStyle = '#fff5'; for (let i = 0; i < 6; i++) { const X = r() * w; x.beginPath(); x.moveTo(X, 0); x.lineTo(X + r() * 8 - 4, h); x.stroke(); }
  }
  x.restore();
}
function drawFxLive() { fxl.width = 640; fxl.height = 480; fx(fxl.getContext('2d'), 640, 480, fxName, true); }
const toneStr = () => `brightness(${$('s-b').value}%) contrast(${$('s-c').value}%) saturate(${$('s-s').value}%)`;
const curFilter = () => (preset + ' ' + toneStr()).trim();
function applyFilter() { local.style.filter = remote.style.filter = curFilter(); }
['s-b', 's-c', 's-s'].forEach(i => $(i).oninput = applyFilter);
single($('timers'), b => timer = +b.dataset.v);
$('c-mirror').onchange = e => setMirror(e.target.checked);
$('c-sound').onchange = e => sound = e.target.checked;
$('btn-enhance').onclick = () => {
  if (!local.videoWidth) return;
  const c = document.createElement('canvas'); c.width = 64; c.height = 48; const x = c.getContext('2d'); x.drawImage(local, 0, 0, 64, 48);
  const d = x.getImageData(0, 0, 64, 48).data; let sum = 0, lo = 255, hi = 0;
  for (let i = 0; i < d.length; i += 4) { const l = .299 * d[i] + .587 * d[i + 1] + .114 * d[i + 2]; sum += l; lo = Math.min(lo, l); hi = Math.max(hi, l); }
  const avg = sum / (d.length / 4), b = Math.round(Math.min(150, Math.max(70, 100 + (125 - avg) * .6))), ct = Math.round(Math.min(140, Math.max(90, 100 + (170 - (hi - lo)) * .25)));
  $('s-b').value = b; $('s-c').value = ct; $('s-s').value = 108; applyFilter();
  $('smart-msg').textContent = `Analisis: ${avg < 90 ? 'agak gelap, terang dinaikkan' : avg > 170 ? 'terlalu terang, diturunkan' : 'cahaya sudah bagus, disetel halus'} (terang ${b}%, kontras ${ct}%).`;
};
$('btn-coach').onclick = e => { coach = !coach; e.currentTarget.classList.toggle('on', coach); $('smart-msg').textContent = coach ? 'Pose Coach aktif.' : 'Pose Coach mati.'; };
$('btn-auto').onclick = e => { auto = !auto; e.currentTarget.classList.toggle('on', auto); $('smart-msg').textContent = auto ? 'Mode otomatis aktif: tekan Jepret sekali.' : 'Mode otomatis mati.'; };
$('btn-aiframe').onclick = () => {
  const got = imgs.filter(Boolean); if (!got.length) return ($('smart-msg').textContent = 'Ambil foto dulu ya.');
  const c = document.createElement('canvas'); c.width = c.height = 1; const x = c.getContext('2d'); let r = 0, b = 0;
  got.forEach(im => { x.drawImage(im, 0, 0, 1, 1); const p = x.getImageData(0, 0, 1, 1).data; r += p[0]; b += p[2]; });
  const warm = r > b ? 1 : 0; setFrame(pick(FR.map((f, i) => i).filter(i => !FR[i].custom && !FR[i].pick && FR[i].w === warm && i !== frame)));
  $('smart-msg').textContent = `Fotomu bernuansa ${warm ? 'hangat' : 'dingin'}, dipilihkan frame "${FR[frame].n}".`;
};

/* ================= TEKS, STIKER, GAYA, GAMBAR ================= */
single($('fonts'), b => { font = +b.dataset.v; render(); });
single($('shapes'), b => { shape = b.dataset.v; render(); });
['t-title', 't-foot'].forEach(i => $(i).oninput = () => render());
['c-date', 'c-stamp', 'c-grain'].forEach(i => $(i).onchange = () => render());
Object.keys(CAPTIONS).forEach(k => { const b = document.createElement('button'); b.textContent = k; $('vibes').appendChild(b); });
$('vibes').onclick = e => { if (e.target.tagName !== 'BUTTON') return; $('t-title').value = pick(CAPTIONS[e.target.textContent]); render(); };
Object.entries(CATS).forEach(([k, v], i) => { const b = document.createElement('button'); b.textContent = v; b.dataset.v = k; if (!i) b.className = 'on'; $('st-cats').appendChild(b); });
single($('st-cats'), b => { cat = b.dataset.v; buildStickers(); });
function select(i) { sel = i; if (i >= 0) { $('s-size').value = stickers[i].s * 100; $('s-rot').value = Math.round(stickers[i].r * 180 / Math.PI); } render(); }
function addSticker(o) { stickers.push(o); select(stickers.length - 1); }
function buildStickers() {
  const g = $('stickers'); g.innerHTML = '';
  const up = document.createElement('button'); up.className = 'up'; up.textContent = '+ foto'; up.onclick = () => $('f-stk').click(); g.appendChild(up);
  catKeys(cat).forEach(k => {
    const b = document.createElement('button'), c = document.createElement('canvas'); c.width = c.height = 56;
    drawSt(c.getContext('2d'), { k, x: .5, y: .5, r: 0, s: k.startsWith('T:') ? .36 : .55 }, 56, 56); b.appendChild(c);
    b.onclick = () => addSticker({ k, x: .3 + Math.random() * .4, y: .3 + Math.random() * .4, r: (Math.random() - .5) * .5, s: 1 }); g.appendChild(b);
  });
}
$('f-stk').onchange = e => { loadFile(e.target.files[0], im => addSticker({ k: 'IMG', img: im, x: .5, y: .5, r: 0, s: 1.3 })); e.target.value = ''; };
$('s-size').oninput = e => { if (sel >= 0) { stickers[sel].s = e.target.value / 100; render(); } };
$('s-rot').oninput = e => { if (sel >= 0) { stickers[sel].r = e.target.value * Math.PI / 180; render(); } };
$('btn-dup').onclick = () => { if (sel >= 0) { const o = { ...stickers[sel], x: Math.min(.95, stickers[sel].x + .06), y: Math.min(.95, stickers[sel].y + .05) }; addSticker(o); } };
$('btn-delsel').onclick = () => { if (sel >= 0) { stickers.splice(sel, 1); sel = -1; render(); } };
$('btn-clear').onclick = () => { stickers = []; sel = -1; render(); };
function autoCats(f) {
  const nm = f.n;
  if (/Lebaran|Ketupat|Ramadan/.test(nm)) return ['lebaran', 'alam'];
  if (/Ulang|Party/.test(nm)) return ['ultah', 'ekspresi'];
  if (/Wisuda/.test(nm)) return ['wisuda', 'sekolah'];
  if (/Merdeka/.test(nm)) return ['umum', 'ekspresi'];
  return { Trendy: ['umum', 'ekspresi', 'makanan'], Retro: ['doodle', 'umum', 'hewan'], Gelap: ['kpop', 'umum', 'doodle'], Alam: ['alam', 'hewan', 'makanan'], Spesial: ['umum', 'ekspresi'] }[f.cat] || ['umum'];
}
$('btn-deco').onclick = () => {
  const keys = autoCats(FR[frame]).flatMap(catKeys);
  for (let i = 0; i < 7; i++) stickers.push({ k: pick(keys), x: i % 2 ? .08 + Math.random() * .12 : .8 + Math.random() * .12, y: .1 + Math.random() * .8, r: (Math.random() - .5) * .8, s: .9 + Math.random() * .5 });
  select(stickers.length - 1);
};
const PENC = ['#17150f', '#ffffff', '#e8452c', '#ff6fa5', '#f6d860', '#2b4fd8', '#35c27a', '#8a5cff'];
PENC.forEach(c => { const b = document.createElement('button'); b.className = 'sw' + (c === penCol ? ' on' : ''); b.style.background = c; b.onclick = () => { penCol = c; $('pen-cols').querySelectorAll('.sw').forEach(z => z.classList.toggle('on', z === b)); }; $('pen-cols').appendChild(b); });
$('btn-pen').onclick = e => { pen = !pen; e.currentTarget.classList.toggle('on', pen); e.currentTarget.textContent = pen ? '✎ Mode gambar: HIDUP' : '✎ Mode gambar: mati'; cv.style.cursor = pen ? 'crosshair' : 'pointer'; if (pen) select(-1); };
$('s-pen').oninput = e => penW = +e.target.value;
$('btn-undo').onclick = () => { strokes.pop(); render(); };
$('btn-clearpen').onclick = () => { strokes = []; render(); };
$('btn-restart').onclick = () => { if (confirm('Hapus semua foto di strip ini dan mulai ulang?')) resetSlots(); };

/* ================= RENDER STRIP ================= */
function geo() {
  const [cnt, cols] = LAY[layout], pw = 400, ph = 300, pol = shape === 'pola' || shape === 'tilt', g = pol ? 48 : 16, pd = pol ? 46 : 34, top = pol ? 104 : 96, rows = Math.ceil(cnt / cols);
  return { W: cols * pw + (cols - 1) * g + pd * 2, H: top + rows * ph + (rows - 1) * g + 74 + (pol ? 20 : 0), cols, pol,
    R: [...Array(cnt)].map((_, i) => ({ x: pd + (i % cols) * (pw + g), y: top + Math.floor(i / cols) * (ph + g), w: pw, h: ph })) };
}
const slotPath = (x, r) => { x.beginPath(); shape === 'round' ? rrect(x, r.x, r.y, r.w, r.h, 18) : x.rect(r.x, r.y, r.w, r.h); };
function drawSlot(x, r, i, f, G) {
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2; x.save(); x.translate(cx, cy);
  if (shape === 'tilt') x.rotate([-2.4, 1.8, -1.2, 2.5, -1.8, 1.4][i % 6] * Math.PI / 180);
  x.translate(-cx, -cy);
  if (G.pol) { x.save(); x.shadowColor = '#0005'; x.shadowBlur = 14; x.shadowOffsetY = 5; x.fillStyle = '#fff'; x.fillRect(r.x - 12, r.y - 12, r.w + 24, r.h + 46); x.restore(); }
  x.save(); slotPath(x, r); x.clip();
  if (imgs[i]) {
    x.drawImage(imgs[i], r.x, r.y, r.w, r.h);
    if ($('c-stamp').checked) { x.font = '700 18px "Space Mono",monospace'; x.textAlign = 'right'; x.fillStyle = '#ff8a1f'; x.shadowColor = '#0009'; x.shadowBlur = 3; x.fillText(STAMP, r.x + r.w - 12, r.y + r.h - 12); }
  } else { x.fillStyle = '#0002'; x.fillRect(r.x, r.y, r.w, r.h); x.fillStyle = '#0006'; x.font = '800 44px "Bricolage Grotesque",sans-serif'; x.textAlign = 'center'; x.fillText(i + 1, cx, cy + 15); }
  x.restore();
  if (!G.pol && f.p !== 'film') { slotPath(x, r); x.lineWidth = 6; x.strokeStyle = '#fff'; x.stroke(); }
  if (shape === 'tilt') { x.save(); x.translate(cx, r.y - 10); x.rotate(i % 2 ? .06 : -.06); x.fillStyle = '#f6d860bb'; x.fillRect(-42, -13, 84, 26); x.restore(); }
  x.restore();
}
function pill(x, text, cx, y, h, f) { const w = x.measureText(text).width + 36; x.fillStyle = f.custom ? '#ffffffd9' : f.a; x.beginPath(); rrect(x, cx - w / 2, y, w, h, h / 2); x.fill(); }
function getGrain(x) {
  if (!grain) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), d = g.createImageData(128, 128);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); grain = c; }
  return x.createPattern(grain, 'repeat');
}
function render(c = cv, sc = 1) {
  const G = geo(), x = c.getContext('2d'), f = FR[frame];
  c.width = G.W * sc; c.height = G.H * sc; if (c === cv) c.style.maxWidth = (G.cols === 1 ? 240 : 360) + 'px';
  x.scale(sc, sc); drawFrame(x, G.W, G.H, f);
  G.R.forEach((r, i) => drawSlot(x, r, i, f, G));
  if ($('c-grain').checked) { x.save(); x.globalAlpha = .09; x.fillStyle = getGrain(x); x.fillRect(0, 0, G.W, G.H); x.restore(); }
  x.textAlign = 'center'; const t = $('t-title').value || ' '; let fs = 36; x.font = TF[font](fs);
  while (x.measureText(t).width > G.W - 100 && fs > 14) { fs -= 2; x.font = TF[font](fs); }
  pill(x, t, G.W / 2, 22, 58, f); x.fillStyle = f.fg; x.fillText(t, G.W / 2, 64);
  x.font = '700 15px "Space Mono",monospace'; const t2 = ($('c-date').checked ? DATE + '  ·  ' : '') + $('t-foot').value;
  pill(x, t2, G.W / 2, G.H - 52, 32, f); x.fillStyle = f.fg; x.fillText(t2, G.W / 2, G.H - 31);
  stickers.forEach(s => drawSt(x, s, G.W, G.H));
  x.lineCap = x.lineJoin = 'round';
  strokes.forEach(s => { x.strokeStyle = s.c; x.lineWidth = s.w; x.beginPath(); s.p.forEach((q, i) => i ? x.lineTo(q[0] * G.W, q[1] * G.H) : x.moveTo(q[0] * G.W, q[1] * G.H)); x.stroke(); });
  if (c === cv && sel >= 0 && stickers[sel]) { const s = stickers[sel], h = s.s * 50; x.save(); x.translate(s.x * G.W, s.y * G.H); x.rotate(s.r); x.setLineDash([6, 4]); x.strokeStyle = '#e8452c'; x.lineWidth = 2; x.strokeRect(-h, -h, h * 2, h * 2); x.restore(); }
}
const rel = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
cv.onpointerdown = e => {
  const [px, py] = rel(e), G = geo();
  if (pen) { cur = { c: penCol, w: penW, p: [[px, py], [px, py]] }; strokes.push(cur); cv.setPointerCapture(e.pointerId); render(); return; }
  for (let i = stickers.length - 1; i >= 0; i--) { const s = stickers[i]; if (Math.hypot((px - s.x) * G.W, (py - s.y) * G.H) < s.s * 50) { drag = i; cv.setPointerCapture(e.pointerId); select(i); return; } }
  if (sel >= 0) select(-1);
  const j = G.R.findIndex(r => px * G.W >= r.x && px * G.W <= r.x + r.w && py * G.H >= r.y && py * G.H <= r.y + r.h);
  if (j >= 0 && imgs[j] && !busy && stream) { idx = j; shoot(); }
};
cv.onpointermove = e => {
  const [px, py] = rel(e);
  if (cur) { cur.p.push([px, py]); render(); return; }
  if (drag === null) return; stickers[drag].x = Math.min(1, Math.max(0, px)); stickers[drag].y = Math.min(1, Math.max(0, py)); render();
};
cv.onpointerup = cv.onpointercancel = () => { drag = null; cur = null; };

function label() {
  $('btn-shoot').textContent = idx >= n ? 'Selesai ✓ · ketuk untuk sesi baru' : `Jepret · pose ${idx + 1}/${n}`;
  const t = $('thumbs'); t.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const b = document.createElement('button'); b.className = 'th' + (shots[i] ? ' full' : '') + (i === idx ? ' next' : '');
    b.innerHTML = shots[i] ? `<img src="${shots[i]}"><span>Ganti</span>` : `<em>${i + 1}</em>`;
    b.onclick = () => { if (shots[i] && !busy && stream) { idx = i; shoot(); } }; t.appendChild(b);
  }
}
function resetSlots() { shots = new Array(n).fill(null); imgs = new Array(n).fill(null); idx = 0; $('btn-dl').disabled = true; label(); render(); }

/* ================= PEMOTRETAN ================= */
function countdown(s) {
  return new Promise(res => {
    let c = s; $('countdown').textContent = c; beep();
    if (coach) { $('coach').hidden = false; $('coach').textContent = pick(POSES); }
    const t = setInterval(() => { c--; if (c > 0) { $('countdown').textContent = c; beep(); } else { clearInterval(t); $('countdown').textContent = ''; $('coach').hidden = true; res(); } }, 1000);
  });
}
function cover(ctx, v, x, y, w, h, m = mirror) {
  const vw = v.videoWidth || v.naturalWidth, vh = v.videoHeight || v.naturalHeight; if (!vw) return;
  const s = Math.max(w / vw, h / vh), sw = w / s, sh = h / s, sx = (vw - sw) / 2, sy = (vh - sh) / 2;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  if (m) { ctx.translate(x + w, y); ctx.scale(-1, 1); ctx.drawImage(v, sx, sy, sw, sh, 0, 0, w, h); } else ctx.drawImage(v, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}
function grab() {
  const c = $('cv'), x = c.getContext('2d'), ldr = !$('remote-box').hidden; c.width = 640; c.height = 480; x.filter = curFilter();
  if (ldr) { cover(x, local, 0, 0, 320, 480); cover(x, remote, 320, 0, 320, 480); } else cover(x, local, 0, 0, 640, 480);
  x.filter = 'none'; fx(x, 640, 480, fxName, false); return c.toDataURL('image/jpeg', .92);
}
async function shoot() {
  if (busy) return; if (!stream) return alert('Kamera belum aktif. Izinkan akses kamera lalu muat ulang.');
  busy = true; if (idx >= n) resetSlots();
  do {
    $('btn-shoot').textContent = `Bersiap… pose ${idx + 1}/${n}`;
    await countdown(timer); $('flash').classList.add('on'); setTimeout(() => $('flash').classList.remove('on'), 150); beep(1200, .2); tmp = grab();
    if (auto || !$('c-ask').checked) {
      const k = idx + 1; accept();
      if (auto) await new Promise(r => setTimeout(r, 600));
      else { $('coach').textContent = `Pose ${k} masuk strip ✓ (tidak cocok? ketuk fotonya untuk ganti)`; $('coach').hidden = false; setTimeout(() => $('coach').hidden = true, 3000); }
    } else { $('rv-num').textContent = idx + 1; $('rv-img').src = tmp; $('review').hidden = false; break; }
  } while (auto && idx < n);
  busy = false; label();
}
function accept() {
  const im = new Image(); im.onload = render; im.src = tmp; shots[idx] = tmp; imgs[idx] = im;
  const next = shots.findIndex(s => !s); if (next === -1) { idx = n; $('btn-dl').disabled = false; } else idx = next; label();
}
$('btn-shoot').onclick = shoot;
$('btn-accept').onclick = () => { $('review').hidden = true; accept(); busy = false; };
$('btn-retake').onclick = () => { $('review').hidden = true; busy = false; shoot(); };
$('btn-upphoto').onclick = () => $('f-photo').click();
$('f-photo').onchange = async e => {
  for (const file of e.target.files) {
    if (idx >= n) { alert('Semua slot sudah terisi. Ketuk salah satu foto untuk menggantinya.'); break; }
    await new Promise(res => loadFile(file, im => { const c = $('cv'), x = c.getContext('2d'); c.width = 640; c.height = 480; cover(x, im, 0, 0, 640, 480, false); tmp = c.toDataURL('image/jpeg', .92); accept(); res(); }));
  }
  e.target.value = '';
};
document.addEventListener('keydown', e => { if (e.code === 'Space' && $('booth').classList.contains('on') && !/INPUT|TEXTAREA|BUTTON/.test(e.target.tagName)) { e.preventDefault(); shoot(); } });

/* ================= UNDUH, BAGIKAN, CETAK, GALERI ================= */
function exportCanvas() { const c = document.createElement('canvas'), k = sel; sel = -1; render(c, 2); sel = k; return c; }
$('btn-dl').onclick = () => { const url = exportCanvas().toDataURL('image/png'); gallery.push(url); $('g-count').textContent = gallery.length; const a = document.createElement('a'); a.download = 'snaphan.png'; a.href = url; a.click(); };
$('btn-share').onclick = () => exportCanvas().toBlob(async b => {
  const file = new File([b], 'snaphan.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: 'Snaphan' }); } catch (e) {} } else alert('Browser ini belum mendukung Bagikan. Pakai tombol Unduh dulu ya.');
});
$('btn-print').onclick = () => { const w = window.open(''); if (!w) return alert('Pop-up diblokir. Izinkan pop-up untuk mencetak.'); w.document.write(`<img src="${exportCanvas().toDataURL()}" style="width:100%" onload="print()">`); };
$('btn-gallery').onclick = () => { $('g-grid').innerHTML = gallery.length ? '' : '<p>Belum ada strip tersimpan.</p>'; gallery.forEach(u => { const i = document.createElement('img'); i.src = u; $('g-grid').appendChild(i); }); $('modal').hidden = false; };
$('btn-close').onclick = () => $('modal').hidden = true;

/* ================= ROOM (kode 4 angka) ================= */
const showRemote = s => { remote.srcObject = s; $('remote-box').hidden = false; $('room-msg').textContent = 'Terhubung ✓'; };
function makeRoom(tries = 0) {
  if (typeof Peer === 'undefined') return alert('Room butuh internet (PeerJS gagal dimuat). Cek koneksi lalu muat ulang.');
  if (!stream) return alert('Nyalakan kamera dulu sebelum membuat room.');
  if (peer) peer.destroy(); const code = String(Math.floor(1000 + Math.random() * 9000)); $('room-msg').textContent = 'Membuat room…';
  peer = new Peer('snaphan-' + code);
  peer.on('open', () => { $('my-code').textContent = code; $('room-code').hidden = false; $('btn-room').hidden = true; $('room-msg').textContent = 'Tunggu pasangan gabung'; });
  peer.on('error', e => { if (e.type === 'unavailable-id' && tries < 5) return makeRoom(tries + 1); $('room-msg').textContent = ''; alert('Room gagal dibuat (' + e.type + '), coba lagi.'); });
  peer.on('call', call => { call.answer(stream); call.on('stream', showRemote); });
}
function doJoin(code) {
  if (typeof Peer === 'undefined') return alert('Room butuh internet (PeerJS gagal dimuat).');
  if (!stream) return alert('Nyalakan kamera dulu.'); if (peer) peer.destroy(); $('room-msg').textContent = 'Menghubungkan…'; peer = new Peer();
  peer.on('open', () => { const call = peer.call('snaphan-' + code, stream); call.on('stream', showRemote); });
  peer.on('error', () => { $('room-msg').textContent = ''; alert('Room tidak ditemukan. Cek lagi kodenya.'); });
}
$('btn-room').onclick = () => makeRoom();
$('btn-join').onclick = () => { const c = $('join-code').value.trim(); if (!/^\d{4}$/.test(c)) return alert('Masukkan kode 4 angka dari temanmu.'); doJoin(c); };

/* ================= INIT ================= */
buildFrames(); buildStickers(); resetSlots(); theme(); drawFxLive();
Promise.all(TF.map(f => document.fonts.load(f(20)))).then(() => { render(); buildStickers(); });