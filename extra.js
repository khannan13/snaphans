/* ===== extra.js: aset tambahan Snaphan (stiker, frame, tema) ===== */
(() => {
const ink = '#17150f';
const BOW = 'M50 50C30 20 6 24 8 50C6 76 30 80 50 50C70 80 94 76 92 50C94 24 70 20 50 50Z';
const BFLY = 'M50 50C30 10 0 20 8 50C12 72 36 72 50 56C64 72 88 72 92 50C100 20 70 10 50 50Z';
const TAILS = 'M44 54L28 94L42 88L48 98L54 56Z M56 54L72 94L58 88L52 98L46 56Z';
const SQ = 'M18 10H82Q90 10 90 18V82Q90 90 82 90H18Q10 90 10 82V18Q10 10 18 10Z';
const FLAME = 'M50 4C60 28 84 40 78 68C74 88 60 96 50 96C36 96 22 86 22 68C22 54 34 48 38 36C42 44 44 30 50 4Z';
const BOLT = 'M58 4L18 56h26L38 96l44-56H56z';
const DROP = 'M50 6C30 36 18 52 18 66a32 32 0 0 0 64 0C82 52 70 36 50 6Z';
const GHOST = 'M20 92V45a30 30 0 0 1 60 0V92l-10-8-10 8-10-8-10 8-10-8z';
const CATP = 'M14 30L24 6L40 22Q50 20 60 22L76 6L86 30Q94 50 80 70Q50 94 20 70Q6 50 14 30Z';
const ZZ = 'M6 34L12 38L6 42L12 46L6 50L12 54L6 58L12 62L6 66H94L88 62L94 58L88 54L94 50L88 46L94 42L88 38L94 34Z';
const ell = (p, cx, cy, rx, ry, rot = 0) => { p.moveTo(cx + rx * Math.cos(rot), cy + rx * Math.sin(rot)); p.ellipse(cx, cy, rx, ry, rot, 0, 7); };
const ring = (cx, cy, r) => { const p = new Path2D(); circ(p, cx, cy, r); return p; };
const add = (cat, n, c, p, d, st) => ST.push({ cat, n, c, p, d, st });
const outline = (x, pth) => { x.lineWidth = 2.5; x.strokeStyle = ink; x.stroke(pth); };

/* ---------- pola isian (untuk stiker pola & washi tape) ---------- */
const spots = (x, base, dark) => {
  x.fillStyle = base; x.fillRect(0, 0, 100, 100); const r = rnd(5);
  for (let i = 0; i < 16; i++) { x.save(); x.translate(r() * 100, r() * 100); x.rotate(r() * 3); x.fillStyle = dark; x.beginPath(); x.ellipse(0, 0, 8, 5, 0, 0, 7); x.fill(); x.fillStyle = base; x.beginPath(); x.ellipse(1.5, -.5, 4.2, 2.4, 0, 0, 7); x.fill(); x.restore(); }
};
const cow = x => { x.fillStyle = '#fff'; x.fillRect(0, 0, 100, 100); x.fillStyle = ink; const r = rnd(9); for (let i = 0; i < 7; i++) { x.beginPath(); x.ellipse(r() * 100, r() * 100, 6 + r() * 10, 4 + r() * 8, r() * 3, 0, 7); x.fill(); } };
const gingham = c => x => { x.fillStyle = '#fff'; x.fillRect(0, 0, 100, 100); x.fillStyle = c; for (let i = 0; i < 100; i += 20) { x.fillRect(i, 0, 10, 100); x.fillRect(0, i, 100, 10); } };
const polka = (b, d) => x => { x.fillStyle = b; x.fillRect(0, 0, 100, 100); x.fillStyle = d; for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) { x.beginPath(); x.arc(i * 20 + (j % 2) * 10 + 5, j * 20 + 5, 5, 0, 7); x.fill(); } };
const stripe = (b, d) => x => { x.fillStyle = b; x.fillRect(0, 0, 100, 100); x.fillStyle = d; for (let i = 0; i < 100; i += 16) x.fillRect(i, 0, 8, 100); };
const glitter = b => x => { x.fillStyle = b; x.fillRect(0, 0, 100, 100); const r = rnd(3); for (let i = 0; i < 140; i++) { x.globalAlpha = .35 + r() * .6; x.fillStyle = i % 4 ? '#fff' : '#ffffffaa'; x.fillRect(r() * 100, r() * 100, 2, 2); } x.globalAlpha = 1; };
const PF = {
  leopard: x => spots(x, '#e0a95a', '#3a2410'), leopardPink: x => spots(x, '#ff9ec7', '#8a1f55'), cow,
  ginghamBlue: gingham('#7fb2ff88'), ginghamPink: gingham('#ff7aa488'), polkaBlack: polka('#fff', ink), polkaPink: polka('#ff8fb8', '#fff'),
  stripePink: stripe('#fff', '#ff9ec7'), glitterPink: glitter('#ff9ed2'), glitterBlue: glitter('#8ec5ff')
};
const filled = (pth, pat) => x => { x.save(); x.clip(pth()); pat(x); x.restore(); outline(x, pth()); };

/* ---------- POLA & PRINT (6 bentuk x 10 pola = 60) ---------- */
const SHAPES = {
  heart: () => P(HEART), square: () => P(SQ), star: () => P(STAR), cloud: () => P(CLOUD), circle: () => ring(50, 50, 42),
  flower: () => { const p = new Path2D(); for (let i = 0; i < 6; i++) circ(p, 50 + 24 * Math.cos(i * 1.047), 50 + 24 * Math.sin(i * 1.047), 19); circ(p, 50, 50, 22); return p; }
};
Object.keys(SHAPES).forEach(sk => Object.keys(PF).forEach(pk => add('pola', `pola-${sk}-${pk}`, '#ddd', SHAPES[sk], filled(SHAPES[sk], PF[pk]))));

/* ---------- COQUETTE ---------- */
const BC = { rose: '#ff9ec7', red: '#d62839', white: '#ffffff', black: '#2a2a2a', sky: '#9fc9ff', lilac: '#cdb4ff', cream: '#fff1c9', sage: '#b7d9b0' };
const knot = x => { dot(x, 50, 50, 8, '#00000028'); x.beginPath(); x.arc(50, 50, 8, 0, 7); x.stroke(); };
Object.entries(BC).forEach(([k, c]) => add('coquette', 'bow-' + k, c, () => P(BOW), knot));
Object.entries(BC).slice(0, 6).forEach(([k, c]) => add('coquette', 'rib-' + k, c, () => { const p = P(BOW); p.addPath(P(TAILS)); return p; }, knot));
[['red', '#e3243b'], ['pink', '#ff7aa8'], ['wine', '#7a1030']].forEach(([k, c]) => add('coquette', 'cherry-' + k, c,
  () => { const p = new Path2D(); circ(p, 30, 72, 20); circ(p, 68, 66, 20); return p; },
  x => { x.strokeStyle = '#2a8a3a'; x.lineWidth = 4; x.beginPath(); x.moveTo(30, 52); x.quadraticCurveTo(40, 22, 58, 10); x.moveTo(68, 46); x.quadraticCurveTo(64, 24, 58, 10); x.stroke(); dot(x, 70, 12, 7, '#4cc26a'); dot(x, 24, 66, 4, '#ffffff88'); dot(x, 62, 60, 4, '#ffffff88'); }));
Object.entries({ rose: '#ff9ec7', red: '#d62839', sky: '#bfe0ff', lilac: '#d8c4ff', cream: '#fff1c9', mint: '#bff0d8' }).forEach(([k, c]) =>
  add('coquette', 'hrt-' + k, c, () => P(HEART), x => { x.fillStyle = '#ffffffaa'; x.beginPath(); x.ellipse(32, 36, 7, 4, -.6, 0, 7); x.fill(); }));
const rosePath = () => { const p = new Path2D(); for (let i = 0; i < 7; i++) { const a = i * Math.PI * 2 / 7; circ(p, 50 + 26 * Math.cos(a), 50 + 26 * Math.sin(a), 16); } circ(p, 50, 50, 28); return p; };
Object.entries({ red: '#d62839', pink: '#ff8fb4', peach: '#ffb89a', white: '#fff7f0' }).forEach(([k, c]) =>
  add('coquette', 'rose-' + k, c, rosePath, x => { x.lineWidth = 2.2; x.strokeStyle = ink; x.beginPath(); x.arc(50, 50, 24, .6, 4.6); x.stroke(); x.beginPath(); x.arc(52, 50, 14, 3.5, 7.6); x.stroke(); x.beginPath(); x.arc(50, 52, 6, 0, 5); x.stroke(); }));
Object.entries({ red: '#d4162f', pink: '#ff6f9f', wine: '#8a1030' }).forEach(([k, c]) =>
  add('coquette', 'lips-' + k, c, () => P('M10 52C24 30 40 32 50 40C60 32 76 30 90 52C76 78 24 78 10 52Z'), x => { x.lineWidth = 2.5; x.strokeStyle = ink; x.beginPath(); x.moveTo(14, 52); x.quadraticCurveTo(50, 60, 86, 52); x.stroke(); dot(x, 38, 44, 3, '#ffffff88'); }));
add('coquette', 'pearls', '#fff7ee', () => { const p = new Path2D(); for (let i = 0; i < 7; i++) circ(p, 10 + i * 13, 62 - Math.sin(i / 6 * Math.PI) * 30, 8); return p; },
  x => { for (let i = 0; i < 7; i++) dot(x, 8 + i * 13, 59 - Math.sin(i / 6 * Math.PI) * 30, 2.4, '#fff'); });

/* ---------- Y2K ---------- */
const CH = { silver: ['#ffffff', '#9fb0cc', '#eef3ff', '#6f82a8'], pink: ['#ffffff', '#ff9ccf', '#ffe3f1', '#d6559a'], blue: ['#ffffff', '#7fb2ff', '#e6f0ff', '#3f6fd6'] };
Object.entries(CH).forEach(([ck, st]) => Object.entries({ star: STAR, spark: SPARK, heart: HEART }).forEach(([sk, pth]) =>
  add('y2k', `chr-${sk}-${ck}`, st[1], () => P(pth), x => { const g = x.createLinearGradient(10, 0, 90, 100); st.forEach((c, i) => g.addColorStop(i / 3, c)); x.save(); x.clip(P(pth)); x.fillStyle = g; x.fillRect(0, 0, 100, 100); x.restore(); outline(x, P(pth)); })));
Object.entries({ pink: '#ff9ccf', blue: '#8ec5ff', lilac: '#c9a8ff', orange: '#ffb36b', mint: '#9fe3c8', yellow: '#ffe27a' }).forEach(([k, c]) =>
  add('y2k', 'bfly-' + k, c, () => P(BFLY), x => { dot(x, 28, 40, 5, '#ffffffaa'); dot(x, 72, 40, 5, '#ffffffaa'); dot(x, 30, 62, 4, '#ffffffaa'); dot(x, 70, 62, 4, '#ffffffaa'); x.lineWidth = 3; x.strokeStyle = ink; x.beginPath(); x.moveTo(50, 30); x.lineTo(50, 72); x.stroke(); }));
Object.entries({ white: '#ffffff', yellow: '#ffe27a', pink: '#ff9ccf', blue: '#9fd0ff', lilac: '#cdb4ff' }).forEach(([k, c]) =>
  add('y2k', 'spk-' + k, c, () => { const p = new Path2D(); p.addPath(P(SPARK), new DOMMatrix([.66, 0, 0, .66, 4, 30])); p.addPath(P(SPARK), new DOMMatrix([.36, 0, 0, .36, 56, 2])); p.addPath(P(SPARK), new DOMMatrix([.26, 0, 0, .26, 66, 60])); return p; }));
Object.entries({ orange: ['#ff7a1a', '#ffd23f'], blue: ['#2b7bff', '#9fe0ff'], pink: ['#ff4f98', '#ffd0e8'] }).forEach(([k, [a, b]]) =>
  add('y2k', 'flame-' + k, a, () => P(FLAME), x => { x.save(); x.translate(50, 62); x.scale(.55, .55); x.translate(-50, -55); x.fillStyle = b; x.fill(P(FLAME)); x.restore(); }));
add('y2k', 'bolt-pink', '#ff6fa5', () => P(BOLT)); add('y2k', 'bolt-blue', '#5aa8ff', () => P(BOLT));
add('y2k', 'cd', '#dfe6ff', () => ring(50, 50, 44), x => {
  if (x.createConicGradient) { const g = x.createConicGradient(0, 50, 50); ['#ffb3d9', '#b3e5ff', '#d6ffb3', '#fff2b3', '#e0b3ff', '#ffb3d9'].forEach((c, i) => g.addColorStop(i / 5, c)); x.fillStyle = g; x.beginPath(); x.arc(50, 50, 44, 0, 7); x.fill(); }
  dot(x, 50, 50, 10, '#fff'); x.lineWidth = 2.5; x.strokeStyle = ink; x.beginPath(); x.arc(50, 50, 10, 0, 7); x.stroke(); x.beginPath(); x.arc(50, 50, 44, 0, 7); x.stroke();
});

/* ---------- KAWAII (9 badan x 2 ekspresi) ---------- */
const face = (x, k, y) => {
  x.fillStyle = ink; x.strokeStyle = ink; x.lineWidth = 2.6; x.lineCap = 'round';
  if (k === 'happy') [36, 64].forEach(cx => { x.beginPath(); x.arc(cx, y, 5, 3.5, 5.9); x.stroke(); });
  else { dot(x, 36, y, 4.2, ink); dot(x, 64, y, 4.2, ink); }
  dot(x, 26, y + 8, 5, '#ff7aa855'); dot(x, 74, y + 8, 5, '#ff7aa855');
  x.beginPath(); x.arc(50, y + 6, 5, .2, 2.9); x.stroke();
};
const bear = () => { const p = new Path2D(); circ(p, 50, 56, 34); circ(p, 22, 26, 13); circ(p, 78, 26, 13); return p; };
const bunny = () => { const p = new Path2D(); circ(p, 50, 64, 30); ell(p, 36, 26, 9, 22); ell(p, 64, 26, 9, 22); return p; };
[['cloud', () => P(CLOUD), '#d6ecff', 52], ['heart', () => P(HEART), '#ffb3d1', 46], ['star', () => P(STAR), '#ffe27a', 50], ['drop', () => P(DROP), '#a8e0ff', 64],
 ['blob', () => ring(50, 54, 40), '#d9c2ff', 52], ['ghost', () => P(GHOST), '#ffffff', 48], ['bear', bear, '#e8b98a', 58], ['bunny', bunny, '#ffffff', 64], ['cat', () => P(CATP), '#ffd1a1', 46]
].forEach(([n, p, c, y]) => ['happy', 'dot'].forEach(k => add('kawaii', `kw-${n}-${k}`, c, p, x => face(x, k, y))));

/* ---------- PIXEL ---------- */
const pix = (n, rows, pal) => {
  const w = rows[0].length, h = rows.length, u = 100 / Math.max(w, h), ox = (100 - w * u) / 2, oy = (100 - h * u) / 2;
  const path = () => { const p = new Path2D(); rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== '.') p.rect(ox + i * u, oy + j * u, u, u); })); return p; };
  add('pixel', 'px-' + n, Object.values(pal)[0], path, x => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== '.') { x.fillStyle = pal[ch]; x.fillRect(ox + i * u - .4, oy + j * u - .4, u + .8, u + .8); } })));
};
const HR = ['.RR.RR.', 'RWRRRRR', 'RRRRRRR', '.RRRRR.', '..RRR..', '...R...'];
pix('heart-red', HR, { R: '#e3243b', W: '#fff' }); pix('heart-pink', HR, { R: '#ff7ab8', W: '#fff' }); pix('heart-blue', HR, { R: '#4f8dff', W: '#fff' });
pix('star', ['...Y...', '...Y...', 'YYYYYYY', '.YYYYY.', '..YYY..', '.YY.YY.', '.Y...Y.'], { Y: '#ffd23f' });
pix('smile', ['..YYYY..', '.YYYYYY.', 'YYKYYKYY', 'YYYYYYYY', 'YKYYYYKY', 'YYKKKKYY', '.YYYYYY.', '..YYYY..'], { Y: '#ffd23f', K: ink });
pix('cherry', ['......G.', '.....GG.', '...GG.G.', '..G...G.', '.RR..RR.', 'RRRR.RRR', 'RWRR.RWR', '.RR..RR.'], { R: '#e3243b', G: '#3cb55a', W: '#fff' });
pix('flower', ['.PP.PP.', 'PPPPPPP', 'PPPYPPP', 'PPPPPPP', '.PP.PP.', '...G...', '..GGG..'], { P: '#ff7ab8', Y: '#ffd23f', G: '#3cb55a' });
pix('ghost', ['..WWW..', '.WWWWW.', 'WWKWKWW', 'WWWWWWW', 'WWWWWWW', 'WWWWWWW', 'WW.W.WW', 'W.W.W.W'], { W: '#ffffff', K: ink });
pix('cloud', ['...WWW...', '.WWWWWWW.', 'WWWWWWWWW', 'BBBBBBBBB', '.BBBBBBB.'], { W: '#ffffff', B: '#bfe3ff' });
pix('icecream', ['.PPPP.', 'PPPPPP', 'PPPPPP', 'CCCCCC', '.CCCC.', '.CCCC.', '..CC..', '..CC..', '...C..'], { P: '#ff9ccf', C: '#e8b36b' });

/* ---------- BUNGA ---------- */
const daisy = () => { const p = new Path2D(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; ell(p, 50 + 26 * Math.cos(a), 50 + 26 * Math.sin(a), 17, 8, a); } return p; };
Object.entries({ white: ['#ffffff', '#ffd23f'], pink: ['#ffb3d1', '#ffd23f'], yellow: ['#ffe27a', '#ff9a3d'], blue: ['#a8d4ff', '#ffe27a'], lilac: ['#d4c1ff', '#ffe27a'] }).forEach(([k, [a, b]]) =>
  add('bunga', 'daisy-' + k, a, daisy, x => { dot(x, 50, 50, 11, b); x.beginPath(); x.arc(50, 50, 11, 0, 7); x.stroke(); }));
const TUL = 'M26 14L38 32L50 10L62 32L74 14C82 52 70 76 50 76C30 76 18 52 26 14ZM47 76H53V96H47Z';
Object.entries({ red: '#ff4f6b', pink: '#ff9ccf', yellow: '#ffd23f' }).forEach(([k, c]) =>
  add('bunga', 'tulip-' + k, c, () => P(TUL), x => { x.fillStyle = '#5cc27a'; x.beginPath(); x.ellipse(36, 88, 12, 5, -.5, 0, 7); x.fill(); x.stroke(); }));
add('bunga', 'sunflower', '#ffc72c', () => { const p = new Path2D(); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ell(p, 50 + 32 * Math.cos(a), 50 + 32 * Math.sin(a), 15, 7, a); } return p; },
  x => { dot(x, 50, 50, 20, '#7a4a1e'); for (let i = 0; i < 10; i++) dot(x, 50 + 10 * Math.cos(i), 50 + 10 * Math.sin(i * 1.3), 2, '#c08a4a'); x.beginPath(); x.arc(50, 50, 20, 0, 7); x.stroke(); });
add('bunga', 'clover', '#4cc26a', () => { const p = new Path2D(); circ(p, 36, 36, 17); circ(p, 64, 36, 17); circ(p, 36, 64, 17); circ(p, 64, 64, 17); return p; },
  x => { x.lineWidth = 2; x.beginPath(); x.moveTo(50, 20); x.lineTo(50, 80); x.moveTo(20, 50); x.lineTo(80, 50); x.stroke(); });
[['green', '#6fd18a'], ['lime', '#b9ee9e']].forEach(([k, c]) => add('bunga', 'leaf-' + k, c, () => P('M12 88C10 40 40 12 90 10C92 56 62 88 12 88Z'), x => { x.lineWidth = 2; x.beginPath(); x.moveTo(14, 86); x.lineTo(80, 20); x.stroke(); }));
[['sakura1', '#ffd0e4'], ['sakura2', '#fff0f6']].forEach(([k, c]) => add('bunga', k, c, () => { const p = new Path2D(); for (let i = 0; i < 5; i++) { const a = i * 1.2566 - 1.5708; circ(p, 50 + 24 * Math.cos(a), 50 + 24 * Math.sin(a), 17); } return p; }, x => dot(x, 50, 50, 7, '#ff6fa5')));

/* ---------- LANGIT ---------- */
add('langit', 'rainbow', '#ff9ccf', () => P('M6 74A44 44 0 0 1 94 74H72A22 22 0 0 0 28 74Z'), x => { ['#ff6b6b', '#ffb347', '#ffe66d', '#7bd88f', '#6bb5ff'].forEach((c, i) => { x.lineWidth = 4.6; x.strokeStyle = c; x.beginPath(); x.arc(50, 74, 41 - i * 4.4, Math.PI, 0); x.stroke(); }); });
Object.entries({ blue: '#bfe3ff', pink: '#ffd1e8', white: '#ffffff', lilac: '#e3d4ff' }).forEach(([k, c]) => add('langit', 'cloud-' + k, c, () => P(CLOUD), x => { x.fillStyle = '#ffffffaa'; x.beginPath(); x.ellipse(36, 48, 8, 4, -.4, 0, 7); x.fill(); }));
Object.entries({ yellow: '#ffe27a', lilac: '#d4c1ff', cream: '#fff6e0' }).forEach(([k, c]) => add('langit', 'moon-' + k, c, () => P(MOON)));
Object.entries({ yellow: '#ffe27a', pink: '#ff9ccf', blue: '#9fd0ff', lilac: '#cdb4ff' }).forEach(([k, c]) => add('langit', 'star-' + k, c, () => P(STAR)));
add('langit', 'sun', '#ffd23f', () => { const p = ring(50, 50, 24); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; p.moveTo(50 + 30 * Math.cos(a - .18), 50 + 30 * Math.sin(a - .18)); p.lineTo(50 + 46 * Math.cos(a), 50 + 46 * Math.sin(a)); p.lineTo(50 + 30 * Math.cos(a + .18), 50 + 30 * Math.sin(a + .18)); p.closePath(); } return p; },
  x => { dot(x, 43, 48, 2.6, ink); dot(x, 57, 48, 2.6, ink); x.lineWidth = 2; x.beginPath(); x.arc(50, 54, 5, .2, 2.9); x.stroke(); });
Object.entries({ saturn: ['#ffb36b', '#ffe2b3'], blue: ['#8ec5ff', '#d6ecff'], pink: ['#ff9ccf', '#ffd6ea'] }).forEach(([k, [a, b]]) =>
  add('langit', 'planet-' + k, a, () => { const p = ring(50, 50, 24); ell(p, 50, 50, 44, 12, -.4); return p; }, x => { x.lineWidth = 5; x.strokeStyle = b; x.beginPath(); x.ellipse(50, 50, 44, 12, -.4, 0, 7); x.stroke(); }));
add('langit', 'snow', '#8ec5ff', () => P('M50 8V92M14 29L86 71M14 71L86 29'), null, 1);
[['blue', '#8ec5ff'], ['pink', '#ff9ccf']].forEach(([k, c]) => add('langit', 'drop-' + k, c, () => P(DROP), x => { x.fillStyle = '#ffffffaa'; x.beginPath(); x.ellipse(38, 62, 5, 9, .4, 0, 7); x.fill(); }));
add('langit', 'comet', '#ffd84a', () => { const p = new Path2D(); p.addPath(P(STAR), new DOMMatrix([.55, 0, 0, .55, 40, 4])); p.moveTo(46, 26); p.lineTo(6, 94); p.lineTo(52, 42); p.closePath(); return p; });

/* ---------- TAPE & LABEL ---------- */
['ginghamBlue', 'ginghamPink', 'polkaBlack', 'polkaPink', 'stripePink', 'leopardPink', 'glitterBlue', 'cow'].forEach(k => add('tape', 'washi-' + k, '#ddd', () => P(ZZ), filled(() => P(ZZ), PF[k])));
[['silver', '#9aa5b8'], ['pink', '#ff6fa5']].forEach(([k, c]) => add('tape', 'clip-' + k, c, () => P('M34 30V68a16 16 0 0 0 32 0V28a10 10 0 0 0-20 0V64'), null, 1));
[['cream', '#fff7e8'], ['pink', '#ffe0ec']].forEach(([k, c]) => add('tape', 'stamp-' + k, c, () => P('M12 12H88V88H12Z'), x => { x.setLineDash([4, 3]); x.strokeStyle = ink; x.lineWidth = 2; x.strokeRect(20, 20, 60, 60); x.setLineDash([]); x.save(); x.translate(32, 30); x.scale(.36, .36); x.fillStyle = '#e3243b'; x.fill(P(HEART)); x.restore(); }));
[['kraft', '#e8c48a'], ['pink', '#ffb3d1'], ['mint', '#bff0d8']].forEach(([k, c]) => add('tape', 'tag-' + k, c, () => P('M14 30H70L90 50L70 70H14Z'), x => { dot(x, 72, 50, 4, '#fff'); x.beginPath(); x.arc(72, 50, 4, 0, 7); x.stroke(); }));
[['yellow', '#fff27a'], ['pink', '#ffc4dd'], ['blue', '#bfe3ff']].forEach(([k, c]) => add('tape', 'note-' + k, c, () => P('M12 12H88V88H12Z'), x => { x.strokeStyle = '#17150f55'; x.lineWidth = 2; [34, 50, 66].forEach(y => { x.beginPath(); x.moveTo(22, y); x.lineTo(78, y); x.stroke(); }); x.fillStyle = '#0002'; x.beginPath(); x.moveTo(88, 88); x.lineTo(66, 88); x.lineTo(88, 66); x.fill(); }));
[['red', '#ff7a6b'], ['yellow', '#ffe27a']].forEach(([k, c]) => add('tape', 'ticket-' + k, c, () => P('M8 28H92V44a6 6 0 0 0 0 12V72H8V56a6 6 0 0 0 0-12Z'), x => { x.setLineDash([3, 3]); x.lineWidth = 2; x.beginPath(); x.moveTo(70, 30); x.lineTo(70, 70); x.stroke(); x.setLineDash([]); }));
[['white', '#ffffff'], ['pink', '#ffd1e8'], ['yellow', '#fff3a0']].forEach(([k, c]) => add('tape', 'bubble-' + k, c, () => P('M14 18H86Q94 18 94 26V58Q94 66 86 66H44L24 86V66H14Q6 66 6 58V26Q6 18 14 18Z'), x => { [32, 50, 68].forEach(cx => dot(x, cx, 42, 3.5, ink)); }));
add('tape', 'polaroid', '#ffffff', () => P('M16 8H84V92H16Z'), x => { x.fillStyle = '#cfd9ff'; x.fillRect(22, 14, 56, 56); dot(x, 40, 34, 6, '#ffd23f'); x.fillStyle = '#9fb6ff'; x.beginPath(); x.moveTo(22, 70); x.lineTo(46, 44); x.lineTo(78, 70); x.fill(); });
add('tape', 'film', '#222222', () => P('M8 26H92V74H8Z'), x => { for (let i = 0; i < 8; i++) { x.fillStyle = '#fff'; x.fillRect(12 + i * 10.5, 29, 5, 4); x.fillRect(12 + i * 10.5, 67, 5, 4); } for (let i = 0; i < 3; i++) { x.fillStyle = '#cfd9ff'; x.fillRect(12 + i * 27, 37, 24, 26); } });

/* ---------- stiker milikmu (opsional): isi daftar ini dengan file PNG ---------- */
const MY_STICKERS = []; // contoh: ['stiker/bunga.png', 'stiker/logo.png']
MY_STICKERS.forEach((src, i) => {
  const im = new Image(); im.onload = () => { buildStickers(); render(); }; im.src = src;
  add('milikku', 'my' + i, '#fff', () => new Path2D(), x => { if (!im.naturalWidth) return; const s = 100 / Math.max(im.naturalWidth, im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s; x.drawImage(im, 50 - w / 2, 50 - h / 2, w, h); });
});

/* ---------- teks stiker kategori baru ---------- */
Object.assign(STXT, {
  coquette: ['pill|dear diary', 'tape|soft girl', 'bub|so pretty', 'neon|bow era', 'pill|girly pop', 'tape|fairycore'],
  y2k: ['neon|y2k', 'pill|cyber', 'tape|2000s', 'bub|it girl', 'neon|baby', 'pill|retro'],
  kawaii: ['bub|uwu', 'pill|gemes', 'bub|hehe~', 'tape|cutie pie'],
  langit: ['neon|dreamy', 'pill|good night', 'tape|sunny', 'bub|hello!'],
  bunga: ['pill|spring', 'tape|bloom', 'bub|petal', 'neon|fresh'],
  tape: ['tape|memo', 'pill|note', 'bub|psst', 'tape|diary'],
  pixel: ['pill|player 1', 'tape|game on', 'neon|level up', 'bub|insert coin']
});
const NC = Object.assign(MY_STICKERS.length ? { milikku: 'Milikku' } : {}, { coquette: 'Coquette', y2k: 'Y2K', pola: 'Pola & Print', kawaii: 'Kawaii', bunga: 'Bunga', langit: 'Langit', pixel: 'Pixel', tape: 'Tape & Label' });
const oldCats = { ...CATS }; Object.keys(CATS).forEach(k => delete CATS[k]); Object.assign(CATS, NC, oldCats);

/* ---------- FRAME BARU: pola & border ---------- */
const HB = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
const tile = (W, H, sx, sy, fn) => { for (let j = 0, k = 0; j < H + sy; j += sy, k++) for (let i = (k % 2) * sx / 2; i < W + sx; i += sx) fn(i, j); };
const PAT = {
  leopard: (x, W, H, c, f) => { const r = rnd(5); for (let i = 0; i < 90; i++) { x.save(); x.translate(r() * W, r() * H); x.rotate(r() * 3); x.fillStyle = c; x.beginPath(); x.ellipse(0, 0, 15, 9, 0, 0, 7); x.fill(); x.fillStyle = f.a; x.beginPath(); x.ellipse(3, -1, 8, 4.5, 0, 0, 7); x.fill(); x.restore(); } },
  bows: (x, W, H, c) => { const b = P(BOW); x.fillStyle = c; tile(W, H, 64, 62, (i, j) => { x.save(); x.translate(i, j); x.scale(.3, .3); x.translate(-50, -50); x.fill(b); x.restore(); }); },
  cherry: (x, W, H, c) => tile(W, H, 70, 66, (i, j) => { x.fillStyle = c; x.beginPath(); x.arc(i - 8, j + 6, 8, 0, 7); x.fill(); x.beginPath(); x.arc(i + 8, j + 4, 8, 0, 7); x.fill(); x.strokeStyle = '#3a9a55'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(i - 8, j - 2); x.quadraticCurveTo(i, j - 18, i + 4, j - 22); x.moveTo(i + 8, j - 4); x.quadraticCurveTo(i + 6, j - 14, i + 4, j - 22); x.stroke(); }),
  stripeV: (x, W, H, c) => { x.fillStyle = c; for (let i = 0; i < W; i += 44) x.fillRect(i, 0, 22, H); },
  halftone: (x, W, H, c) => { x.fillStyle = c; for (let j = 0, k = 0; j < H; j += 26, k++) for (let i = (k % 2) * 13; i < W; i += 26) { x.beginPath(); x.arc(i, j, 1 + (j / H) * 8, 0, 7); x.fill(); } },
  sunburst: (x, W, H, c) => { x.fillStyle = c; const cx = W / 2, cy = H * .45, R = Math.max(W, H), n = 28; for (let i = 0; i < n; i++) { x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, R, i * 2 * Math.PI / n, (i * 2 + 1) * Math.PI / n); x.closePath(); x.fill(); } },
  memphis: (x, W, H) => { const r = rnd(3), cl = ['#ff6fa5', '#2b4fd8', '#ffd23f', '#35c27a', '#17150f']; for (let i = 0; i < 46; i++) { x.save(); x.translate(r() * W, r() * H); x.rotate(r() * 6); x.fillStyle = x.strokeStyle = cl[i % 5]; x.lineWidth = 4; const t = i % 4;
      if (t === 0) { x.beginPath(); x.arc(0, 0, 9, 0, 7); x.stroke(); } else if (t === 1) { x.beginPath(); x.moveTo(-10, 8); x.lineTo(10, 8); x.lineTo(0, -10); x.closePath(); x.fill(); } else if (t === 2) { x.beginPath(); x.moveTo(-16, 0); x.quadraticCurveTo(-8, -10, 0, 0); x.quadraticCurveTo(8, 10, 16, 0); x.stroke(); } else { x.fillRect(-9, -2, 18, 4); x.fillRect(-2, -9, 4, 18); } x.restore(); } },
  smileys: (x, W, H, c) => tile(W, H, 76, 70, (i, j) => { x.fillStyle = c; x.beginPath(); x.arc(i, j, 20, 0, 7); x.fill(); x.fillStyle = ink; x.beginPath(); x.arc(i - 7, j - 4, 2.6, 0, 7); x.fill(); x.beginPath(); x.arc(i + 7, j - 4, 2.6, 0, 7); x.fill(); x.strokeStyle = ink; x.lineWidth = 2.4; x.beginPath(); x.arc(i, j + 2, 9, .2, 2.9); x.stroke(); }),
  lines: (x, W, H, c) => { x.strokeStyle = c; x.lineWidth = 2; for (let j = 60; j < H; j += 34) { x.beginPath(); x.moveTo(0, j); x.lineTo(W, j); x.stroke(); } x.strokeStyle = '#ff7a8a88'; x.beginPath(); x.moveTo(24, 0); x.lineTo(24, H); x.stroke(); },
  glitter: (x, W, H, c) => { const r = rnd(2); for (let i = 0; i < 520; i++) { x.globalAlpha = .3 + r() * .6; x.fillStyle = i % 5 ? '#fff' : '#ffffffcc'; x.fillRect(r() * W, r() * H, 2 + r() * 2, 2 + r() * 2); } x.globalAlpha = 1; const s = P(SPARK); x.fillStyle = '#fff'; for (let i = 0; i < 26; i++) { x.save(); x.translate(r() * W, r() * H); x.scale(.07 + r() * .08, .07 + r() * .08); x.fill(s); x.restore(); } },
  pxhearts: (x, W, H, c) => { x.fillStyle = c; tile(W, H, 60, 58, (i, j) => HB.forEach((row, y) => [...row].forEach((ch, k) => { if (ch === '#') x.fillRect(i + k * 5 - 17, j + y * 5 - 15, 5, 5); }))); }
};
const BORD = {
  scallop: (x, W, H, c) => { x.fillStyle = c; for (let i = 0; i <= W; i += 24) [0, H].forEach(y => { x.beginPath(); x.arc(i, y, 13, 0, 7); x.fill(); }); for (let j = 0; j <= H; j += 24) [0, W].forEach(X => { x.beginPath(); x.arc(X, j, 13, 0, 7); x.fill(); }); },
  double: (x, W, H, c) => { x.strokeStyle = c; x.lineWidth = 3; x.strokeRect(9, 9, W - 18, H - 18); x.lineWidth = 1.5; x.strokeRect(16, 16, W - 32, H - 32); },
  dash: (x, W, H, c) => { x.strokeStyle = c; x.lineWidth = 3; x.setLineDash([10, 7]); x.strokeRect(12, 12, W - 24, H - 24); x.setLineDash([]); },
  corners: (x, W, H, c) => { x.fillStyle = c; const s = P(SPARK); [[22, 22], [W - 22, 22], [22, H - 22], [W - 22, H - 22]].forEach(([a, b]) => { x.save(); x.translate(a, b); x.scale(.28, .28); x.translate(-50, -50); x.fill(s); x.restore(); }); },
  tape: (x, W, H, c) => { x.fillStyle = c; [[30, 14, -.6], [W - 30, 14, .6], [30, H - 14, .6], [W - 30, H - 14, -.6]].forEach(([a, b, r]) => { x.save(); x.translate(a, b); x.rotate(r); x.globalAlpha = .85; x.fillRect(-34, -11, 68, 22); x.restore(); }); }
};
const _df = drawFrame;
drawFrame = function (x, W, H, f) {
  _df(x, W, H, f); if (f.custom && customBg) return;
  if (PAT[f.p]) { x.save(); x.fillStyle = x.strokeStyle = f.c || '#0002'; PAT[f.p](x, W, H, f.c || '#0002', f); x.restore(); }
  if (f.bd && BORD[f.bd]) { x.save(); BORD[f.bd](x, W, H, f.bc || '#fff'); x.restore(); }
};
const G = (n, cat, a, b, fg, p, c, w, bd, bc) => ({ ...F(n, cat, a, b, fg, p, c, w), bd, bc });
const NEWFR = [
  G('Coquette Bows', 'Coquette', '#ffe3ec', 0, '#a8325e', 'bows', '#ff9ec7aa', 1, 'scallop', '#fff'),
  G('Cherry Picnic', 'Coquette', '#fff6f1', 0, '#b3122b', 'cherry', '#e3243b', 1, 'dash', '#e3243b'),
  G('Lace Cream', 'Coquette', '#fbf3e6', 0, '#6b4a3a', 'dots', '#d9c3a8', 0, 'scallop', '#f1e1c9'),
  G('Ballet Pink', 'Coquette', '#ffd9e6', '#fff0f6', '#8c2a55', 'sparkle', '#ffffffcc', 1, 'double', '#ffffffd0'),
  G('Red Ribbon', 'Coquette', '#b3122b', '#7f0d1f', '#ffe3e3', 'bows', '#ffffff55', 1, 'dash', '#ffffff'),
  G('Chrome Dream', 'Y2K', '#cfe0ff', '#f3d9ff', '#2b3a77', 'sparkle', '#ffffffdd', 0, 'double', '#ffffff'),
  G('Leopard Pink', 'Y2K', '#ff9ec7', 0, '#5a123a', 'leopard', '#8a1f55', 1, 'tape', '#fff'),
  G('Leopard Gold', 'Y2K', '#e8b765', 0, '#2f1d0a', 'leopard', '#3a2410', 1, 'double', '#3a2410'),
  G('Cyber Candy', 'Y2K', '#1b1442', '#3b1d7a', '#ffd9ff', 'halftone', '#ff4fd8', 0, 'dash', '#35e0ff'),
  G('Glitter Bomb', 'Y2K', '#ffb0d8', '#ff7ac0', '#ffffff', 'glitter', 0, 1, 'scallop', '#ffffff88'),
  G('Baby Blue Y2K', 'Y2K', '#cfe8ff', '#e8f4ff', '#2a5fa8', 'pxhearts', '#ffffffee', 0, 'corners', '#fff'),
  G('Candy Stripes', 'Pop', '#ffffff', 0, '#c2185b', 'stripeV', '#ff9ec7', 1, 'double', '#c2185b'),
  G('Retro Sunburst', 'Pop', '#ffd36b', 0, '#6b1f00', 'sunburst', '#ff9a3d', 1, 'double', '#6b1f00'),
  G('Memphis Fun', 'Pop', '#fff3c4', 0, '#2b2a6b', 'memphis', 0, 1, 'dash', '#2b2a6b'),
  G('Smiley Day', 'Pop', '#ffe14d', 0, '#17150f', 'smileys', '#fff3a0', 1, 'double', '#17150f'),
  G('Comic Dots', 'Pop', '#fff7d6', 0, '#b3122b', 'halftone', '#e8452c88', 1, 'dash', '#17150f'),
  G('Pixel Love', 'Pop', '#ffd1e8', 0, '#8a1f55', 'pxhearts', '#ff6fa5', 1, 'corners', '#fff'),
  G('Sage Daisy', 'Aesthetic', '#dfe9cf', 0, '#2d4a22', 'flowers', '#ffffffee', 1, 'scallop', '#fff'),
  G('Sunflower', 'Aesthetic', '#ffe9a0', 0, '#6b4a00', 'flowers', '#ffb703', 1, 'dash', '#6b4a00'),
  G('Cloud Nine', 'Aesthetic', '#bfe3ff', '#ffffff', '#1d4f91', 'clouds', '#ffffffdd', 0, 'scallop', '#fff'),
  G('Starry Night', 'Aesthetic', '#0b1d4a', '#2a1b5c', '#ffe9a0', 'sparkle', '#ffe9a0cc', 0, 'double', '#ffe9a0'),
  G('Lilac Notes', 'Aesthetic', '#efe7ff', 0, '#4b2d8a', 'lines', '#b9a3f0', 1, 'tape', '#d6c8ff'),
  G('Mint Gelato', 'Aesthetic', '#c9f2e3', '#ffe0ef', '#1f6b52', 'dots', '#ffffffbb', 1, 'scallop', '#fff')
];
FR.splice(FR.length - 2, 0, ...NEWFR);
const _ac = autoCats;
autoCats = f => ({ Coquette: ['coquette', 'kawaii', 'bunga'], Y2K: ['y2k', 'langit', 'pola'], Pop: ['pola', 'tape', 'ekspresi'], Aesthetic: ['bunga', 'langit', 'kawaii'] })[f.cat] || _ac(f);

/* ---------- bangun ulang daftar kategori & grid ---------- */
$('st-cats').innerHTML = '';
Object.entries(CATS).forEach(([k, v], i) => { const b = document.createElement('button'); b.textContent = v; b.dataset.v = k; if (!i) b.className = 'on'; $('st-cats').appendChild(b); });
cat = Object.keys(CATS)[0]; single($('st-cats'), b => { cat = b.dataset.v; buildStickers(); }); buildStickers();
$('fr-cats').innerHTML = '';
['Semua', ...new Set(FR.map(f => f.cat))].forEach((k, i) => {
  const b = document.createElement('button'); b.textContent = k; if (!i) b.className = 'on';
  b.onclick = () => { frCat = k; $('fr-cats').querySelectorAll('button').forEach(z => z.classList.toggle('on', z === b)); buildFrames(); };
  $('fr-cats').appendChild(b);
});
frCat = 'Semua'; buildFrames();
$('chips').innerHTML = [FR.length + ' frame', Object.keys(CATS).reduce((a, k) => a + catKeys(k).length, 0) + '+ stiker', 'gambar bebas', 'efek film', 'room LDR'].map(t => `<span>${t}</span>`).join('');
})();