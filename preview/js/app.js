import { backdrop, vignette, W, H, clamp, easeInOut } from './kit.js';
import scenes from './scenes/index.js';

const params = new URLSearchParams(location.search);
const capture = params.has('capture');
const scaleParam = parseFloat(params.get('scale') || '');
const forcedT = params.has('t') ? Math.max(0, parseFloat(params.get('t'))) : null;

const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d', { alpha: false });
const shell = document.getElementById('shell');
const poster = document.getElementById('poster');
const scrub = document.getElementById('scrub');
const chaptersEl = document.getElementById('chapters');
const timeNow = document.getElementById('timeNow');
const timeTotal = document.getElementById('timeTotal');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const fsBtn = document.getElementById('fsBtn');
const loading = document.getElementById('loading');
const hint = document.getElementById('hint');
const nowLabel = document.getElementById('nowLabel');
const hoverTime = document.getElementById('hoverTime');
const errorEl = document.getElementById('error');

const audio = new Audio();
audio.src = '../audio.wav';
audio.preload = 'auto';

let ready = false;
let playing = false;
let lastWall = performance.now();
let playhead = forcedT ?? 0;
let duration = 1113.6;
let userSeek = false;
let idleTimer = null;
let started = false;
let currentChapter = '';
let dirty = true;
let lastUI = 0;

// ---------------------------------------------------------------- timeline

const ordered = scenes
  .slice()
  .sort((a, b) => a.start - b.start)
  .map((s, i, arr) => ({
    ...s,
    end: s.end ?? (arr[i + 1] ? arr[i + 1].start : duration),
  }));

if (ordered.length) {
  // Fall back gracefully if the final scene is open-ended.
  const last = ordered[ordered.length - 1];
  if (!Number.isFinite(last.end) || last.end <= last.start) last.end = duration;
  duration = Math.max(duration, last.end);
}

function sceneAt(t) {
  let lo = 0;
  let hi = ordered.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const s = ordered[mid];
    if (t < s.start) hi = mid - 1;
    else if (t >= s.end) lo = mid + 1;
    else return mid;
  }
  if (t <= ordered[0].start) return 0;
  return ordered.length - 1;
}

// ---------------------------------------------------------------- render

function fitCanvas() {
  const dpr = scaleParam || Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

function draw(t) {
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  ctx.globalAlpha = 1;
  backdrop(ctx);

  const idx = sceneAt(t);
  const scene = ordered[idx];
  const prev = ordered[idx - 1];
  const fade = 0.24;

  // Fade in from the very start of the cut.
  if (prev && t - scene.start < fade) {
    const q = easeInOut(clamp((t - scene.start) / fade));
    const prevT = Math.min(prev.end - 0.001, Math.max(prev.start, t));
    ctx.save();
    ctx.globalAlpha = 1 - q;
    prev.draw(ctx, prevT, prevT - prev.start, prev);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = q;
    scene.draw(ctx, t, t - scene.start, scene);
    ctx.restore();
  } else {
    ctx.save();
    scene.draw(ctx, t, t - scene.start, scene);
    ctx.restore();
  }

  vignette(ctx);
}

function frame(now) {
  if (playing) {
    const dt = Math.min(0.25, (now - lastWall) / 1000);
    lastWall = now;
    if (!userSeek) {
      if (!audio.paused && audio.readyState >= 2) {
        playhead = audio.currentTime;
      } else {
        playhead += dt;
      }
    }
    if (playhead >= duration) {
      playhead = duration;
      pause();
    }
  }
  if (playing || dirty) {
    draw(playhead);
    dirty = false;
  }
  if (playing || now - lastUI > 120) {
    updateUI();
    lastUI = now;
  }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- transport

function fmt(t) {
  t = Math.max(0, Math.min(duration, t));
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function play() {
  if (!ready) return;
  if (playhead >= duration - 0.05) playhead = 0;
  started = true;
  poster.classList.add('hidden');
  playing = true;
  shell.classList.add('playing');
  lastWall = performance.now();
  hint.classList.add('show');
  setTimeout(() => hint.classList.remove('show'), 5200);
  try {
    audio.currentTime = playhead;
    const pr = audio.play();
    if (pr && pr.catch) pr.catch(() => {});
  } catch {}
  scheduleIdle();
}

function pause() {
  playing = false;
  shell.classList.remove('playing');
  audio.pause();
  shell.classList.remove('idle');
}

function toggle() {
  if (playing) pause();
  else play();
}

function seek(t, opts = {}) {
  playhead = Math.max(0, Math.min(duration, t));
  userSeek = true;
  dirty = true;
  try { audio.currentTime = playhead; } catch {}
  if (opts.fromUI) requestAnimationFrame(() => { userSeek = false; });
  else setTimeout(() => { userSeek = false; }, 60);
  draw(playhead);
  updateUI();
}

function scheduleIdle() {
  clearTimeout(idleTimer);
  shell.classList.remove('idle');
  idleTimer = setTimeout(() => {
    if (playing) shell.classList.add('idle');
  }, 2800);
}

// ---------------------------------------------------------------- UI

function buildChapters() {
  chaptersEl.innerHTML = '';
  ordered.forEach((s) => {
    if (s.start <= 0) return;
    const d = document.createElement('div');
    d.className = 'tick';
    d.style.left = `${(s.start / duration) * 100}%`;
    chaptersEl.appendChild(d);
  });
}

const chapterOf = (s) => s.title || '';

function updateUI() {
  const pct = (playhead / duration) * 100;
  if (!scrub.matches(':active')) scrub.value = String(Math.round(pct * 10));
  scrub.style.setProperty('--fill', `${pct}%`);
  timeNow.textContent = fmt(playhead);
  timeTotal.textContent = fmt(duration);
  const s = ordered[sceneAt(playhead)];
  const title = chapterOf(s);
  if (title !== currentChapter) {
    currentChapter = title;
    nowLabel.textContent = title;
  }
}

playBtn.addEventListener('click', toggle);
muteBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  shell.classList.toggle('muted', audio.muted);
});
fsBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) shell.requestFullscreen?.();
  else document.exitFullscreen?.();
});
document.getElementById('posterPlay').addEventListener('click', play);
poster.addEventListener('click', play);
canvas.addEventListener('click', toggle);

scrub.addEventListener('pointerdown', () => { userSeek = true; });
scrub.addEventListener('input', () => {
  seek((Number(scrub.value) / 1000) * duration, { fromUI: true });
});
scrub.addEventListener('change', () => { userSeek = false; });
scrub.addEventListener('mousemove', (e) => {
  const r = scrub.getBoundingClientRect();
  const f = clamp((e.clientX - r.left) / r.width);
  const t = f * duration;
  hoverTime.textContent = fmt(t);
  hoverTime.style.left = `${f * 100}%`;
  hoverTime.classList.add('show');
});
scrub.addEventListener('mouseleave', () => hoverTime.classList.remove('show'));

window.addEventListener('mousemove', () => {
  if (capture) return;
  scheduleIdle();
});
window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement) return;
  if (e.code === 'Space') { e.preventDefault(); toggle(); }
  else if (e.code === 'ArrowRight') { e.preventDefault(); seek(playhead + 5); scheduleIdle(); }
  else if (e.code === 'ArrowLeft') { e.preventDefault(); seek(playhead - 5); scheduleIdle(); }
  else if (e.code === 'KeyL') { seek(playhead + 10); scheduleIdle(); }
  else if (e.code === 'KeyJ') { seek(playhead - 10); scheduleIdle(); }
  else if (e.code === 'KeyM') { muteBtn.click(); scheduleIdle(); }
  else if (e.code === 'KeyF') { fsBtn.click(); }
  else if (e.code === 'KeyS') {
    const s = ordered[sceneAt(playhead)];
    const next = ordered[ordered.indexOf(s) + 1];
    if (next) seek(next.start);
  } else if (e.code === 'KeyB') {
    const s = ordered[sceneAt(playhead)];
    const prev = ordered[ordered.indexOf(s) - 1];
    if (prev) seek(prev.start);
  }
});
document.addEventListener('fullscreenchange', () => {
  fitCanvas();
  dirty = true;
  draw(playhead);
  dirty = false;
});

// ---------------------------------------------------------------- boot

async function boot() {
  try {
    await document.fonts.ready;
  } catch {}

  fitCanvas();
  buildChapters();

  await new Promise((resolve) => {
    const done = () => resolve();
    if (audio.readyState >= 1) return done();
    audio.addEventListener('loadedmetadata', done, { once: true });
    audio.addEventListener('error', done, { once: true });
    setTimeout(done, 6000);
  });
  if (Number.isFinite(audio.duration) && audio.duration > 10) duration = audio.duration;
  buildChapters();

  ready = true;
  loading.classList.add('hidden');
  dirty = true;
  draw(playhead);
  dirty = false;
  updateUI();
  scheduleIdle();

  if (capture) {
    pause();
    poster.classList.add('hidden');
    document.getElementById('ui').style.display = 'none';
    document.getElementById('hint').style.display = 'none';
    draw(playhead);
    dirty = false;
  } else if (forcedT !== null) {
    if (params.has('autoplay')) play();
  }
}

window.__seek = (t) => { pause(); seek(t); };
window.__play = play;
window.__state = () => ({ playhead, duration, playing, ready, scenes: ordered.length });
window.__drawAt = (t) => { draw(t); };
window.__audio = audio;

boot().catch((err) => {
  console.error(err);
  errorEl.hidden = false;
  errorEl.textContent = 'Could not start the preview.\n\n' + (err?.stack || err);
});

requestAnimationFrame(frame);
