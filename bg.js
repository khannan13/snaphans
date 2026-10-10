/* ===== bg.js: latar virtual di BELAKANG orang (tirai merah, panggung, studio, dll) ===== */
(() => {
const V = '0.1.1675465747', BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@${V}/`;
let kind = 'none', seg = null, segP = null, working = false, last = 0, customImg = null, customN = 0;
const cache = {};
const vbg = document.createElement('canvas'); vbg.id = 'vbg'; vbg.width = 640; vbg.height = 360; vbg.videoWidth = 640; vbg.videoHeight = 360;
local.parentElement.insertBefore(vbg, local.nextSibling);
const active = () => kind !== 'none' && vbg.style.display === 'block';

/* ---------- gambar latar (semua digambar lewat kode) ---------- */
const velvet = (x, w, h, [R, G, B], folds) => {
  for (let i = 0; i < w; i++) {
    const t = i / w, f = .5 + .5 * Math.sin(t * Math.PI * 2 * folds + .9 * Math.sin(t * Math.PI * 6 + 1)), s = .28 + .72 * Math.pow(f, 1.3);
    x.fillStyle = `rgb(${R * s | 0},${G * s | 0},${B * s | 0})`; x.fillRect(i, 0, 1.6, h);
  }
  const g = x.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.25, 'rgba(0,0,0,0)'); g.addColorStop(.8, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.4)');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
};
const rod = (x, w, h) => {
  const rh = h * .05, g = x.createLinearGradient(0, 0, 0, rh);
  g.addColorStop(0, '#6b5a4a'); g.addColorStop(.35, '#2a1c14'); g.addColorStop(1, '#0d0806');
  x.fillStyle = g; x.fillRect(0, 0, w, rh);
  x.fillStyle = '#1a110c'; for (let i = 14; i < w; i += 56) x.fillRect(i, rh * .3, 12, rh * 1.5);
};
const disco = (x, cx, cy, r) => {
  x.save(); x.strokeStyle = '#9a9aa4'; x.lineWidth = 2; x.beginPath(); x.moveTo(cx, 0); x.lineTo(cx, cy - r); x.stroke();
  x.beginPath(); x.arc(cx, cy, r, 0, 7); x.clip();
  const g = x.createRadialGradient(cx - r * .35, cy - r * .35, r * .1, cx, cy, r); g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#aab0bb'); g.addColorStop(1, '#3c3f48');
  x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2);
  const q = Math.max(5, r / 6), rr = rnd(4);
  for (let j = -r; j < r; j += q) for (let i = -r; i < r; i += q) { const l = rr(); x.fillStyle = l > .55 ? `rgba(255,255,255,${.12 + l * .3})` : `rgba(40,44,60,${.2 + l * .3})`; x.fillRect(cx + i + 1, cy + j + 1, q - 2, q - 2); }
  x.restore(); x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
};
const vignette = (x, w, h, a) => { const g = x.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, h * .95); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); x.fillStyle = g; x.fillRect(0, 0, w, h); };
const BG = {
  red: { n: 'Tirai Merah', draw: (x, w, h) => { velvet(x, w, h, [150, 22, 38], 7); rod(x, w, h); disco(x, w * .17, h * .22, h * .085); } },
  blue: { n: 'Tirai Biru', draw: (x, w, h) => { velvet(x, w, h, [28, 52, 140], 7); rod(x, w, h); disco(x, w * .83, h * .22, h * .085); } },
  black: { n: 'Panggung', draw: (x, w, h) => { velvet(x, w, h, [60, 48, 70], 6); const s = x.createRadialGradient(w / 2, 0, 0, w / 2, 0, h * .9); s.addColorStop(0, 'rgba(255,214,140,.5)'); s.addColorStop(1, 'rgba(255,214,140,0)'); x.fillStyle = s; x.fillRect(0, 0, w, h); rod(x, w, h); } },
  studio: { n: 'Studio', draw: (x, w, h) => { const g = x.createRadialGradient(w / 2, h * .45, h * .1, w / 2, h * .5, h * .95); g.addColorStop(0, '#ececf0'); g.addColorStop(1, '#7a7a88'); x.fillStyle = g; x.fillRect(0, 0, w, h); } },
  brick: { n: 'Batu Bata', draw: (x, w, h) => { const r = rnd(8), bh = h / 14, bw = w / 9; x.fillStyle = '#cfc6b8'; x.fillRect(0, 0, w, h); for (let j = 0; j < 15; j++) for (let i = -1; i < 10; i++) { x.fillStyle = `rgb(${125 + r() * 45 | 0},${52 + r() * 25 | 0},${42 + r() * 18 | 0})`; x.fillRect(i * bw + (j % 2 ? bw / 2 : 0) + 2, j * bh + 2, bw - 4, bh - 4); } vignette(x, w, h, .5); } },
  neon: { n: 'Neon', draw: (x, w, h) => { const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#12061f'); g.addColorStop(1, '#2a0f4a'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.lineWidth = Math.max(4, w / 120); x.lineCap = 'round'; [['#ff4fd8', w * .8, h * .3, h * .15], ['#35e0ff', w * .2, h * .65, h * .12]].forEach(([c, a, b, rd]) => { x.strokeStyle = c; x.shadowColor = c; x.shadowBlur = 24; x.beginPath(); x.arc(a, b, rd, 0, 7); x.stroke(); });
    x.strokeStyle = '#ffe14d'; x.shadowColor = '#ffe14d'; x.beginPath(); x.moveTo(w * .1, h * .12); x.lineTo(w * .45, h * .12); x.stroke(); x.shadowBlur = 0; } },
  cream: { n: 'Krem Pastel', draw: (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#fff3ec'); g.addColorStop(1, '#ffd9e6'); x.fillStyle = g; x.fillRect(0, 0, w, h); const r = rnd(6); x.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 40; i++) { x.beginPath(); x.arc(r() * w, r() * h, 2 + r() * 5, 0, 7); x.fill(); } } }
};
function bgFor(w, h) {
  const key = kind + w + 'x' + h + (kind === 'custom' ? customN : '');
  if (cache[key]) return cache[key];
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  if (kind === 'custom' && customImg) { const s = Math.max(w / customImg.width, h / customImg.height); x.drawImage(customImg, (w - customImg.width * s) / 2, (h - customImg.height * s) / 2, customImg.width * s, customImg.height * s); }
  else (BG[kind] || BG.red).draw(x, w, h);
  return (cache[key] = c);
}

/* ---------- pemisah orang (MediaPipe Selfie Segmentation) ---------- */
function onRes(r) {
  const vw = 640, vh = Math.round(640 * local.videoHeight / local.videoWidth) || 360;
  if (vbg.width !== vw || vbg.height !== vh) { vbg.width = vw; vbg.height = vh; vbg.videoWidth = vw; vbg.videoHeight = vh; }
  if (kind === 'none') return;
  const x = vbg.getContext('2d');
  x.save(); x.clearRect(0, 0, vw, vh);
  x.filter = 'blur(2px)'; x.drawImage(r.segmentationMask, 0, 0, vw, vh); x.filter = 'none';
  x.globalCompositeOperation = 'source-in'; x.drawImage(r.image, 0, 0, vw, vh);
  x.globalCompositeOperation = 'destination-over'; x.drawImage(bgFor(vw, vh), 0, 0, vw, vh);
  x.restore(); vbg.style.display = 'block';
}
function loadSeg() {
  if (segP) return segP;
  segP = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = BASE + 'selfie_segmentation.js'; s.crossOrigin = 'anonymous';
    s.onload = res; s.onerror = () => rej(new Error('tidak bisa mengunduh model dari internet')); document.head.appendChild(s);
  }).then(async () => {
    const m = new window.SelfieSegmentation({ locateFile: f => BASE + f });
    m.setOptions({ modelSelection: 1 }); m.onResults(onRes); await m.initialize(); seg = m;
  });
  segP.catch(() => { segP = null; });
  return segP;
}
function loop(ts) {
  requestAnimationFrame(loop);
  if (kind === 'none' || !seg || working || !local.videoWidth || document.hidden || !$('booth').classList.contains('on') || ts - last < 66) return;
  last = ts; working = true;
  seg.send({ image: local }).catch(() => {}).then(() => { working = false; });
}
requestAnimationFrame(loop);

/* ---------- sambungkan ke script.js: foto, Live Photo, mirror, filter ---------- */
const _cover = cover;
cover = function (ctx, v, x, y, w, h, m) { return _cover(ctx, (v === local && active()) ? vbg : v, x, y, w, h, m === undefined ? mirror : m); };
const _sm = setMirror;
setMirror = function (v) { _sm(v); vbg.classList.toggle('mir', v); };
const _af = applyFilter;
applyFilter = function () { _af(); vbg.style.filter = local.style.filter; };
vbg.classList.toggle('mir', mirror); vbg.style.filter = local.style.filter;

/* ---------- UI: pilihan latar di bawah kamera ---------- */
const box = $('bgs'), st = t => { $('bg-state').textContent = t; };
const mark = k => box.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
async function setBg(k) {
  mark(k);
  if (k === 'none') { kind = 'none'; vbg.style.display = 'none'; st(''); return; }
  if (!stream) { mark('none'); return alert('Nyalakan kamera dulu ya.'); }
  if (!seg) {
    st('Memuat model AI (butuh internet, ±5 detik)…');
    try { await loadSeg(); } catch (e) { mark('none'); kind = 'none'; vbg.style.display = 'none'; st('Gagal memuat'); return alert('Latar virtual gagal dimuat: ' + e.message + '. Cek internet lalu coba lagi.'); }
  }
  kind = k; vbg.style.display = 'none'; st('Latar aktif ✓');
}
[['none', 'Tanpa'], ...Object.entries(BG).map(([k, v]) => [k, v.n])].forEach(([k, n]) => {
  const b = document.createElement('button'); b.textContent = n; b.dataset.k = k; if (k === 'none') b.className = 'on'; b.onclick = () => setBg(k); box.appendChild(b);
});
const up = document.createElement('button'); up.textContent = '+ Unggah'; up.dataset.k = 'custom'; up.onclick = () => $('f-bg').click(); box.appendChild(up);
$('f-bg').onchange = e => { const f = e.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { customImg = im; customN++; setBg('custom'); }; im.src = URL.createObjectURL(f); e.target.value = ''; };
})();