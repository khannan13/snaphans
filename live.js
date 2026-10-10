/* ===== live.js: Live Photo + latar bilik (tirai, studio, retro, neon) ===== */
(() => {
const BOOTH = {
  red: { n: 'Tirai Merah', k: 'curtain', c1: '#a3243a', c2: '#6e1422' },
  blue: { n: 'Tirai Biru', k: 'curtain', c1: '#2f56c9', c2: '#1a2f7a' },
  green: { n: 'Tirai Hijau', k: 'curtain', c1: '#1f7a52', c2: '#0f4630' },
  studio: { n: 'Studio', k: 'studio' },
  retro: { n: 'Retro Mall', k: 'retro' },
  neon: { n: 'Neon', k: 'neon' }
};
let backdrop = 'none', liveOn = false, videoExport = false, phase = 0;
let clips = [], ring = [], pool = [], rec = null, pendingSlot = null;
const hasClips = () => clips.some(c => c && c.length);

/* ---------- latar bilik: digambar di kamera live DAN di hasil foto ---------- */
const bulbs = (x, w, y, n) => {
  x.save(); x.shadowColor = '#ffd36b'; x.shadowBlur = 10; x.fillStyle = '#ffe9a8';
  for (let i = 0; i < n; i++) { x.beginPath(); x.arc((i + .5) * w / n, y, Math.max(2.5, w / 110), 0, 7); x.fill(); }
  x.restore();
};
function drawBooth(x, w, h) {
  const s = BOOTH[backdrop]; if (!s) return;
  x.save();
  if (s.k === 'curtain') {
    const sw = w * .16;
    [0, 1].forEach(side => {
      x.save(); if (side) { x.translate(w, 0); x.scale(-1, 1); }
      const p = new Path2D(); p.moveTo(0, 0); p.lineTo(sw * 1.25, 0);
      p.bezierCurveTo(sw * .95, h * .3, sw * .55, h * .5, sw * .7, h * .72); p.quadraticCurveTo(sw * .9, h * .9, sw * 1.1, h); p.lineTo(0, h); p.closePath();
      x.clip(p);
      const g = x.createLinearGradient(0, 0, sw * 1.25, 0); g.addColorStop(0, s.c2); g.addColorStop(.6, s.c1); g.addColorStop(1, s.c2);
      x.fillStyle = g; x.fillRect(0, 0, sw * 1.3, h);
      const n = 9, pw = sw * 1.3 / n;
      for (let i = 0; i < n; i++) { x.fillStyle = i % 2 ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.1)'; x.fillRect(i * pw, 0, pw, h); }
      x.restore();
    });
    const vh = h * .08, m = Math.round(w / 40);
    x.fillStyle = s.c1; x.fillRect(0, 0, w, vh);
    for (let i = 0; i < m; i++) { x.beginPath(); x.arc((i + .5) * w / m, vh, w / m / 2, 0, Math.PI); x.fill(); }
    x.fillStyle = 'rgba(0,0,0,.18)';
    for (let i = 0; i < m; i += 2) { x.beginPath(); x.arc((i + .5) * w / m, vh, w / m / 2, 0, Math.PI); x.fill(); }
    x.strokeStyle = '#f2c14e'; x.lineWidth = Math.max(2, w / 160); x.beginPath(); x.moveTo(0, vh * .75); x.lineTo(w, vh * .75); x.stroke();
    bulbs(x, w, vh * .38, 14);
  } else if (s.k === 'studio') {
    [0, 1].forEach(side => {
      x.save(); if (side) { x.translate(w, 0); x.scale(-1, 1); }
      const g = x.createLinearGradient(0, 0, w * .14, 0); g.addColorStop(0, 'rgba(25,25,35,.6)'); g.addColorStop(1, 'rgba(25,25,35,0)');
      x.fillStyle = g; x.fillRect(0, 0, w * .14, h); x.restore();
    });
    [.25, .75].forEach(c => {
      const r = x.createRadialGradient(w * c, 0, 0, w * c, 0, h * .75); r.addColorStop(0, 'rgba(255,255,255,.38)'); r.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = r; x.fillRect(0, 0, w, h);
    });
    x.fillStyle = '#1d1d24'; x.fillRect(0, 0, w, h * .035);
    x.fillStyle = '#ffffff'; [.25, .75].forEach(c => x.fillRect(w * c - w * .04, h * .035, w * .08, h * .012));
  } else if (s.k === 'retro') {
    const pw = w * .07;
    [0, w - pw].forEach(X => { x.fillStyle = '#8a5a34'; x.fillRect(X, 0, pw, h); x.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < pw; i += pw / 4) x.fillRect(X + i, 0, 2, h); });
    x.fillStyle = '#2a2230'; x.fillRect(0, 0, w, h * .07); bulbs(x, w, h * .035, 16);
    const q = h * .06; for (let i = 0; i * q < w; i++) { x.fillStyle = i % 2 ? '#17150f' : '#ffffff'; x.fillRect(i * q, h - q, q, q); }
  } else {
    x.fillStyle = 'rgba(10,6,24,.35)'; x.fillRect(0, 0, w * .06, h); x.fillRect(w * .94, 0, w * .06, h);
    x.lineWidth = Math.max(3, w / 130); x.lineCap = 'round';
    [['#ff4fd8', w * .035, h * .06, w * .035, h * .94], ['#35e0ff', w * .965, h * .06, w * .965, h * .94], ['#ffe14d', w * .08, h * .035, w * .92, h * .035], ['#ff4fd8', w * .08, h * .965, w * .92, h * .965]]
      .forEach(([c, a, b, d, e]) => { x.strokeStyle = c; x.shadowColor = c; x.shadowBlur = 18; x.beginPath(); x.moveTo(a, b); x.lineTo(d, e); x.stroke(); });
  }
  x.restore();
}
const _fx = fx;
fx = function (x, w, h, k, live) { _fx(x, w, h, k, live); drawBooth(x, w, h); };

/* ---------- Live Photo: rekam ±1,2 detik sebelum dan sesudah jepretan ---------- */
function snap() {
  const c = pool.pop() || document.createElement('canvas'); c.width = 320; c.height = 240;
  const x = c.getContext('2d'), ldr = !$('remote-box').hidden;
  x.filter = curFilter();
  if (ldr) { cover(x, local, 0, 0, 160, 240); cover(x, remote, 160, 0, 160, 240); } else cover(x, local, 0, 0, 320, 240);
  x.filter = 'none'; fx(x, 320, 240, fxName, false);
  return c;
}
setInterval(() => {
  if (!liveOn) { ring.length = 0; return; }
  if (!stream || !local.videoWidth || document.hidden || !$('booth').classList.contains('on')) return;
  const f = snap();
  if (rec) {
    rec.after.push(f);
    if (rec.after.length >= 12) { clips[rec.slot] = rec.before.concat(rec.after); rec = null; }
  } else { ring.push(f); if (ring.length > 12) pool.push(ring.shift()); }
}, 100);

const _grab = grab;
grab = function () {
  const d = _grab();
  if (liveOn) { pendingSlot = idx; rec = { slot: idx, before: ring.splice(0), after: [] }; }
  return d;
};
const _acc = accept;
accept = function () { if (pendingSlot !== idx) delete clips[idx]; pendingSlot = null; _acc.apply(this, arguments); };
const _rs = resetSlots;
resetSlots = function () { clips = []; rec = null; pendingSlot = null; _rs(); };

/* ---------- render: foto di strip bergerak (dan tidak error saat dipanggil dari onload) ---------- */
const _render = render;
render = function (c, sc) {
  if (!c || !c.getContext) c = cv;
  sc = sc || 1;
  if (!(((c === cv && liveOn) || videoExport) && hasClips())) return _render(c, sc);
  const saved = imgs.slice();
  clips.forEach((cl, i) => { if (cl && cl.length && saved[i]) imgs[i] = cl[phase % cl.length]; });
  try { _render(c, sc); } finally { saved.forEach((v, i) => { imgs[i] = v; }); }
};
setInterval(() => {
  if (!liveOn || !hasClips() || document.hidden || !$('booth').classList.contains('on')) return;
  phase++; render();
}, 100);

/* ---------- unduh video ---------- */
async function exportLive() {
  if (!hasClips()) return alert('Belum ada Live Photo. Nyalakan Live Photo di tab Bilik, lalu jepret dulu ya.');
  if (!window.MediaRecorder) return alert('Browser ini belum mendukung rekam video.');
  const mt = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t));
  if (!mt) return alert('Format video belum didukung di browser ini.');
  const btn = $('btn-dlive'), old = btn.textContent; btn.disabled = true; btn.textContent = 'Membuat video…';
  try {
    const c = document.createElement('canvas'); videoExport = true; phase = 0; render(c, 1);
    const mr = new MediaRecorder(c.captureStream(10), { mimeType: mt, videoBitsPerSecond: 4000000 }), parts = [];
    mr.ondataavailable = e => { if (e.data && e.data.size) parts.push(e.data); };
    const done = new Promise(r => { mr.onstop = r; });
    mr.start();
    const N = clips.reduce((m, cl) => Math.max(m, cl ? cl.length : 0), 0) * 2;
    for (let i = 0; i < N; i++) { phase = i; render(c, 1); await new Promise(r => setTimeout(r, 100)); }
    mr.stop(); await done;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(parts, { type: mt.split(';')[0] }));
    a.download = 'snaphan-live.' + (mt.includes('mp4') ? 'mp4' : 'webm'); a.click();
  } catch (e) { alert('Gagal membuat video: ' + e.message); }
  videoExport = false; phase = 0; btn.disabled = false; btn.textContent = old; render();
}
$('btn-dlive').onclick = exportLive;

/* ---------- UI tab Bilik ---------- */
const bl = $('booths');
[['none', 'Tanpa'], ...Object.entries(BOOTH).map(([k, v]) => [k, v.n])].forEach(([k, n], i) => {
  const b = document.createElement('button'); b.textContent = n; if (!i) b.className = 'on';
  b.onclick = () => { backdrop = k; bl.querySelectorAll('button').forEach(z => z.classList.toggle('on', z === b)); drawFxLive(); };
  bl.appendChild(b);
});
liveOn = (navigator.hardwareConcurrency || 4) >= 4; $('c-live').checked = liveOn;
$('c-live').onchange = e => { liveOn = e.target.checked; if (!liveOn) { ring.length = 0; render(); } };
})();