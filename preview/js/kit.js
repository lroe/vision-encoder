// Drawing kit for the Vision Encoder explainer.
// Everything is authored in a 1920 x 1080 coordinate space.

export const W = 1920;
export const H = 1080;

export const C = {
  bg: '#282A36',
  fg: '#F8F8F2',
  muted: '#B8B9C5',
  dim: '#7E8194',
  faint: '#555869',
  line: 'rgba(248,248,242,0.22)',
  lineStrong: 'rgba(248,248,242,0.42)',
  surface: '#313342',
  surface2: '#3A3D4E',
  panel: '#2E3040',
  well: '#1E1F29',
  current: '#44475A',
  deep: '#6272A4',
  red: '#FF5555',
  green: '#50FA7B',
  pink: '#FF79C6',
  purple: '#BD93F9',
  cyan: '#8BE9FD',
  orange: '#FFB86C',
  yellow: '#F1FA8C',
};

export const F = {
  display: "'Space Grotesk', 'Inter', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  hand: "'Caveat', 'Space Grotesk', cursive",
};

export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t) => t * t * t;
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function spring(t) {
  const x = clamp(t);
  return 1 - Math.cos(x * Math.PI * 1.5) * Math.exp(-5.2 * x);
}

// Progress 0..1 from absolute time.
export function p(t, start, dur = 0.5) {
  return easeOutCubic(clamp((t - start) / dur));
}
export function pe(t, start, dur = 0.5) {
  return easeOutExpo(clamp((t - start) / dur));
}
// Fade in, hold, fade out.
export function pin(t, start, end, fin = 0.4, fout = 0.4) {
  const a = p(t, start, fin);
  const b = 1 - p(t, end - fout, fout);
  return Math.min(a, b);
}

// Standard enter: returns alpha + offset.
export function enter(t, start, dur = 0.55, dx = 0, dy = 16) {
  const q = spring(clamp((t - start) / dur));
  const a = p(t, start, dur * 0.72);
  return { a, dx: dx * (1 - q), dy: dy * (1 - q), s: 0.985 + 0.015 * q, q };
}

// Fade out a group.
export function away(t, start, dur = 0.35) {
  return 1 - easeInCubic(clamp((t - start) / dur));
}

export function setFont(ctx, size, weight = 500, family = F.display) {
  ctx.font = `${weight} ${size}px ${family}`;
}

export function measure(ctx, str, size, weight = 500, family = F.display, ls = 0) {
  setFont(ctx, size, weight, family);
  const m = ctx.measureText(str).width;
  return m + Math.max(0, str.length - 1) * ls;
}

export function text(ctx, str, x, y, o = {}) {
  const {
    size = 44, weight = 500, family = F.display, color = C.fg, align = 'left',
    baseline = 'alphabetic', alpha = 1, ls = 0, maxWidth, italic = false,
  } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  setFont(ctx, size, weight, family);
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${ls}px`;
  if (italic) {
    // faux italic for Inter/Space Grotesk
    ctx.translate(x, y);
    ctx.transform(1, 0, -0.16, 1, 0, 0);
    ctx.fillText(str, 0, 0);
  } else if (maxWidth) {
    ctx.fillText(str, x, y, maxWidth);
  } else {
    ctx.fillText(str, x, y);
  }
  ctx.restore();
}

export function wrap(ctx, str, size, maxWidth, weight = 450, family = F.body) {
  setFont(ctx, size, weight, family);
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

export function paragraph(ctx, str, x, y, maxWidth, o = {}) {
  const { size = 40, lh = 1.38, weight = 450, family = F.body, color = C.fg, alpha = 1, align = 'left' } = o;
  const lines = wrap(ctx, str, size, maxWidth, weight, family);
  lines.forEach((line, i) => {
    text(ctx, line, x, y + i * size * lh, { size, weight, family, color, alpha, align });
  });
  return lines.length * size * lh;
}

export function rr(ctx, x, y, w, h, r = 18) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function card(ctx, x, y, w, h, o = {}) {
  const {
    fill = C.surface, stroke = 'rgba(248,248,242,0.13)', lw = 1.6, r = 18,
    alpha = 1, accent = null, accentW = 4, dash = null, rot = 0, glow = 0,
  } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x + w / 2, y + h / 2);
  if (rot) ctx.rotate(rot);
  ctx.translate(-w / 2, -h / 2);
  if (glow > 0) {
    ctx.shadowColor = accent || 'rgba(189,147,249,0.35)';
    ctx.shadowBlur = glow;
  }
  rr(ctx, 0, 0, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    if (dash) ctx.setLineDash(dash);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (accent) {
    ctx.save();
    rr(ctx, 0, 0, w, h, r);
    ctx.clip();
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, w, accentW);
    ctx.restore();
  }
  ctx.restore();
}

export function pill(ctx, x, y, label, o = {}) {
  const {
    size = 34, weight = 500, family = F.display, color = C.fg, bg = C.current,
    padX = 20, padY = 10, alpha = 1, stroke = null, ls = 0.2, h = null,
    align = 'left',
  } = o;
  const tw = measure(ctx, label, size, weight, family, ls);
  const height = h ?? size + padY * 2;
  const width = tw + padX * 2;
  const x0 = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  const y0 = y - height / 2;
  card(ctx, x0, y0, width, height, { fill: bg, stroke, r: height / 2, alpha });
  text(ctx, label, x0 + width / 2, y0 + height / 2 + size * 0.02, {
    size, weight, family, color, align: 'center', baseline: 'middle', alpha, ls,
  });
  return { w: width, h: height, x: x0, y: y0 };
}

// ---- lines ----------------------------------------------------------------

// Deterministic tiny jitter for a hand-inked feel.
function noise1(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x) - 0.5;
}

export function pathLen(pts) {
  let d = 0;
  for (let i = 1; i < pts.length; i++) d += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return d;
}

export function strokePath(ctx, pts, o = {}) {
  const {
    color = C.fg, width = 3, alpha = 1, progress = 1, dash = null, cap = 'round',
    rough = 0.55, close = false, fill = null, join = 'round',
  } = o;
  if (alpha <= 0.001 || progress <= 0 || pts.length < 2) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.lineCap = cap;
  ctx.lineJoin = join;
  ctx.lineWidth = width;

  // Rough pass: offset each segment midpoint a hair.
  const draw = [];
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = pts[i];
    if (i === 0 || i === pts.length - 1 || rough === 0) draw.push([x, y]);
    else draw.push([x + noise1(x * 0.31 + y) * rough, y + noise1(y * 0.27 - x) * rough]);
  }

  const total = pathLen(draw);
  const lim = total * clamp(progress);
  ctx.beginPath();
  let acc = 0;
  let started = false;
  for (let i = 0; i < draw.length; i++) {
    if (i === 0) {
      ctx.moveTo(draw[0][0], draw[0][1]);
      started = true;
      continue;
    }
    const seg = Math.hypot(draw[i][0] - draw[i - 1][0], draw[i][1] - draw[i - 1][1]);
    if (acc + seg >= lim) {
      const f = seg < 1e-5 ? 0 : (lim - acc) / seg;
      ctx.lineTo(lerp(draw[i - 1][0], draw[i][0], f), lerp(draw[i - 1][1], draw[i][1], f));
      break;
    }
    ctx.lineTo(draw[i][0], draw[i][1]);
    acc += seg;
  }
  if (started) {
    if (fill) {
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (dash) ctx.setLineDash(dash);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
  ctx.restore();
}

export function line(ctx, x1, y1, x2, y2, o = {}) {
  strokePath(ctx, [[x1, y1], [x2, y2]], o);
}

export function arrow(ctx, x1, y1, x2, y2, o = {}) {
  const {
    color = C.fg, width = 3, alpha = 1, progress = 1, head = 15, headA = 0.65,
    dashed = false, curve = 0,
  } = o;
  if (alpha <= 0.001 || progress <= 0.001) return;
  const q = easeOutCubic(clamp(progress));
  let mx = (x1 + x2) / 2;
  let my = (y1 + y2) / 2;
  if (curve) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    mx += (-dy / len) * curve;
    my += (dx / len) * curve;
  }
  // approximate arc length
  const l1 = Math.hypot(mx - x1, my - y1);
  const l2 = Math.hypot(x2 - mx, y2 - my);
  const total = l1 + l2;
  const lim = total * q;
  let ex = x2;
  let ey = y2;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  if (lim <= l1) {
    const f = l1 < 1e-5 ? 0 : lim / l1;
    ex = lerp(x1, mx, f);
    ey = lerp(y1, my, f);
    ctx.quadraticCurveTo(lerp(x1, mx, f * 0.55), lerp(y1, my, f * 0.55), ex, ey);
  } else {
    ctx.quadraticCurveTo(mx, my, x2, y2);
    const f = l2 < 1e-5 ? 0 : (lim - l1) / l2;
    ex = lerp(mx, x2, f);
    ey = lerp(my, y2, f);
    // trim end
    if (f < 1) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(mx, my, ex, ey);
    }
  }
  if (dashed) ctx.setLineDash([10, 10]);
  ctx.stroke();
  ctx.setLineDash([]);
  if (q > 0.92 && head > 0) {
    const ang = Math.atan2(ey - my, ex - mx);
    ctx.translate(ex, ey);
    ctx.rotate(ang);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-head, -head * headA);
    ctx.lineTo(-head * 0.72, 0);
    ctx.lineTo(-head, head * headA);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function underline(ctx, x, y, w, o = {}) {
  const { color = C.yellow, width = 5, alpha = 1, progress = 1 } = o;
  if (alpha <= 0.001) return;
  const q = clamp(progress);
  const mid = x + w / 2;
  strokePath(ctx, [[x, y], [mid, y - 2], [x + w, y + 1]], { color, width, alpha, progress: q, rough: 1.1 });
  if (q > 0.5) strokePath(ctx, [[x + 6, y + 5], [mid, y + 4], [x + w - 10, y + 6]], {
    color, width: width * 0.5, alpha: alpha * 0.45 * ((q - 0.5) * 2), progress: (q - 0.5) * 2, rough: 1.4,
  });
}

export function bracket(ctx, x1, x2, y, o = {}) {
  const { color = C.muted, width = 2, alpha = 1, tick = 12, progress = 1 } = o;
  const pts = [[x1, y - tick / 2], [x1, y], [x2, y], [x2, y - tick / 2]];
  strokePath(ctx, pts, { color, width, alpha, progress, rough: 0.4 });
}

export function leader(ctx, x1, y1, x2, y2, o = {}) {
  const { color = C.faint, width = 1.6, alpha = 1, dot = 3, progress = 1 } = o;
  line(ctx, x1, y1, x2, y2, { color, width, alpha: alpha * 0.9, progress, rough: 0.2 });
  if (progress > 0.9) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x1, y1, dot, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ---- icons ----------------------------------------------------------------

// Icon library drawn inside a 100x100 box (origin top-left).
export function icon(ctx, name, x, y, size, o = {}) {
  const {
    color = C.fg, alpha = 1, width = 3.4, progress = 1, fill = null, accent = null,
  } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 100, size / 100);
  ctx.globalAlpha *= alpha;
  const st = (pts, opt = {}) => strokePath(ctx, pts, {
    color, width: width * (100 / size) * (size / 100) * 1, alpha: 1, progress,
    rough: 0.5, ...opt,
  });
  const ball = (cx, cy, r, c = color, a = 1) => {
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  switch (name) {
    case 'eye': {
      // almond
      ctx.beginPath();
      ctx.moveTo(6, 50);
      ctx.quadraticCurveTo(50, 12, 94, 50);
      ctx.quadraticCurveTo(50, 88, 6, 50);
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      st([[6, 50], [50, 14], [94, 50], [50, 86], [6, 50]], { close: false });
      ball(50, 50, 15, accent || color);
      ball(54, 45, 4.5, C.bg, 0.9);
      break;
    }
    case 'image': {
      rr(ctx, 6, 12, 88, 76, 10);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      st([[14, 76], [36, 48], [54, 68], [68, 54], [86, 76]]);
      ball(68, 32, 5.5, accent || color);
      break;
    }
    case 'grid': {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          rr(ctx, 8 + i * 22, 8 + j * 22, 17, 17, 3);
          ctx.strokeStyle = color;
          ctx.lineWidth = width * 0.8;
          ctx.globalAlpha *= 0.9;
          ctx.stroke();
        }
      }
      break;
    }
    case 'text': {
      st([[14, 28], [86, 28]]);
      st([[14, 50], [75, 50]]);
      st([[14, 72], [58, 72]]);
      break;
    }
    case 'brain': {
      // a soft cloud-brain with folds
      st([[30, 78], [20, 66], [22, 52], [14, 40], [26, 30], [40, 32], [48, 20], [62, 24], [70, 32], [84, 34], [88, 48], [82, 60], [84, 74], [70, 80], [58, 76], [46, 84], [34, 80], [30, 78]], { rough: 1.2 });
      st([[38, 44], [46, 52], [40, 62]], { width: width * 0.75, alpha: 0.8 });
      st([[56, 38], [52, 50], [62, 56], [56, 68]], { width: width * 0.75, alpha: 0.8 });
      st([[68, 44], [74, 56], [68, 68]], { width: width * 0.75, alpha: 0.8 });
      break;
    }
    case 'desk': {
      // tabletop + legs + monitor
      st([[10, 58], [90, 58]]);
      st([[20, 58], [16, 92]]);
      st([[80, 58], [84, 92]]);
      st([[58, 58], [58, 38], [86, 38], [86, 58]]);
      st([[64, 46], [70, 51], [64, 56]], { width: width * 0.6 });
      st([[24, 50], [44, 50]], { width: width * 0.7, alpha: 0.5 });
      break;
    }
    case 'room': {
      st([[12, 88], [12, 22], [88, 22], [88, 88]]);
      // door
      st([[58, 88], [58, 42], [80, 42], [80, 88]]);
      ball(74, 66, 2.6, accent || color);
      // little window
      st([[24, 34], [44, 34], [44, 52], [24, 52], [24, 34]], { width: width * 0.7, alpha: 0.6 });
      break;
    }
    case 'layers': {
      for (let k = 0; k < 3; k++) {
        const yy = 26 + k * 20;
        st([[50, yy], [86, yy + 14], [50, yy + 28], [14, yy + 14], [50, yy]], { width: width * 0.9 });
      }
      break;
    }
    case 'stack': {
      st([[24, 12], [76, 12], [76, 88], [24, 88], [24, 12]]);
      for (let k = 1; k < 6; k++) st([[24, 12 + k * 12.6], [76, 12 + k * 12.6]], { width: width * 0.55, alpha: 0.55 });
      break;
    }
    case 'person': {
      ball(50, 26, 12, fill || color);
      st([[50, 38], [50, 68]], { width: width * 1.1 });
      st([[50, 46], [32, 58]]);
      st([[50, 46], [68, 58]]);
      st([[50, 68], [36, 92]]);
      st([[50, 68], [64, 92]]);
      break;
    }
    case 'people': {
      ball(36, 30, 10, fill || color);
      st([[36, 40], [36, 64]], { width: width * 1.05 });
      st([[36, 47], [22, 57]]);
      st([[36, 47], [50, 57]]);
      st([[36, 64], [26, 88]]);
      st([[36, 64], [46, 88]]);
      ball(66, 34, 10, fill || color);
      st([[66, 44], [66, 68]], { width: width * 1.05 });
      st([[66, 51], [52, 61]]);
      st([[66, 51], [80, 61]]);
      st([[66, 68], [56, 92]]);
      st([[66, 68], [76, 92]]);
      break;
    }
    case 'chip': {
      rr(ctx, 22, 22, 56, 56, 6);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      rr(ctx, 38, 38, 24, 24, 3);
      ctx.strokeStyle = accent || color;
      ctx.lineWidth = width * 0.8;
      ctx.stroke();
      for (let k = 0; k < 3; k++) {
        st([[22 + k * 18, 22], [22 + k * 18, 12]], { width: width * 0.7 });
        st([[22 + k * 18, 78], [22 + k * 18, 88]], { width: width * 0.7 });
        st([[22, 22 + k * 18], [12, 22 + k * 18]], { width: width * 0.7 });
        st([[78, 22 + k * 18], [88, 22 + k * 18]], { width: width * 0.7 });
      }
      break;
    }
    case 'lock': {
      rr(ctx, 18, 46, 64, 42, 8);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      st([[34, 46], [34, 30], [42, 18], [58, 18], [66, 30], [66, 46]]);
      ball(50, 66, 5, accent || color);
      break;
    }
    case 'check': {
      st([[18, 52], [40, 74], [82, 26]], { width: width * 1.5, color: accent || color });
      break;
    }
    case 'cross': {
      st([[26, 26], [74, 74]], { color: accent || color });
      st([[74, 26], [26, 74]], { color: accent || color });
      break;
    }
    case 'clock': {
      ctx.beginPath();
      ctx.arc(50, 50, 38, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      st([[50, 50], [50, 28]], { width: width * 1.1 });
      st([[50, 50], [66, 60]], { width: width * 1.1 });
      break;
    }
    case 'bolt': {
      st([[54, 8], [30, 54], [48, 54], [40, 92], [70, 42], [52, 42], [54, 8]], { width: width * 1.1, fill: fill || null });
      break;
    }
    case 'target': {
      ctx.beginPath();
      ctx.arc(50, 50, 38, 0, Math.PI * 2);
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      ctx.beginPath();
      ctx.arc(50, 50, 22, 0, Math.PI * 2);
      ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      ball(50, 50, 7, accent || color);
      break;
    }
    case 'scale': {
      st([[50, 14], [50, 84]]);
      st([[20, 82], [80, 82]]);
      st([[50, 20], [18, 28], [18, 48]]);
      st([[50, 20], [82, 28], [82, 48]]);
      st([[8, 48], [28, 48]], { width: width * 0.9 });
      st([[72, 48], [92, 48]], { width: width * 0.9 });
      break;
    }
    case 'flask': {
      st([[40, 12], [40, 40], [18, 84], [82, 84], [60, 40], [60, 12]]);
      st([[34, 12], [66, 12]]);
      break;
    }
    case 'edge': {
      st([[8, 72], [38, 28], [66, 54], [92, 18]], { width: width * 1.1 });
      break;
    }
    case 'curve': {
      ctx.beginPath();
      ctx.moveTo(8, 64);
      ctx.bezierCurveTo(26, 8, 54, 92, 92, 34);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.stroke();
      break;
    }
    case 'tag': {
      st([[14, 22], [58, 22], [88, 50], [58, 78], [14, 78], [14, 22]], { width: width * 0.95 });
      ball(34, 50, 5.5, accent || color);
      break;
    }
    case 'search': {
      ctx.beginPath(); ctx.arc(44, 44, 27, 0, Math.PI * 2); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      st([[64, 64], [86, 86]], { width: width * 1.1 });
      break;
    }
    default: {
      ctx.beginPath();
      ctx.arc(50, 50, 34, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ---- photo ---------------------------------------------------------------

// A warm little illustrated photograph used throughout the patch story.
export function drawPhoto(ctx, x, y, size, o = {}) {
  const { alpha = 1, grid = false, gridAlpha = 0.34, slice = 0, highlight = null, dim = 0, radius = 18 } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  rr(ctx, x, y, size, size, radius);
  ctx.clip();

  // Dusk sky.
  const sky = ctx.createLinearGradient(0, y, 0, y + size);
  sky.addColorStop(0, '#241a36');
  sky.addColorStop(0.45, '#4a2d50');
  sky.addColorStop(0.7, '#a04a54');
  sky.addColorStop(1, '#d97a4f');
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, size, size);

  // Sun.
  ctx.fillStyle = '#F1FA8C';
  ctx.globalAlpha *= 0.92;
  ctx.beginPath();
  ctx.arc(x + size * 0.66, y + size * 0.42, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = alpha;

  // Distant hills.
  ctx.fillStyle = '#33273f';
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.66);
  ctx.lineTo(x + size * 0.18, y + size * 0.5);
  ctx.lineTo(x + size * 0.35, y + size * 0.62);
  ctx.lineTo(x + size * 0.55, y + size * 0.44);
  ctx.lineTo(x + size * 0.75, y + size * 0.6);
  ctx.lineTo(x + size, y + size * 0.48);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();

  // Ground.
  ctx.fillStyle = '#2b2132';
  ctx.fillRect(x, y + size * 0.75, size, size * 0.25);

  // Bicycle.
  const bx = x + size * 0.5;
  const by = y + size * 0.72;
  const s = size * 0.001;
  const cyc = by - size * 0.13;
  const r = size * 0.12;
  ctx.strokeStyle = '#F8F8F2';
  ctx.lineWidth = Math.max(1.4, size * 0.008);
  ctx.lineCap = 'round';
  // wheels
  for (const off of [-size * 0.2, size * 0.2]) {
    ctx.beginPath();
    ctx.arc(bx + off, cyc + r * 0.55, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // frame
  const w1 = [bx - size * 0.2, cyc + r * 0.55];
  const w2 = [bx + size * 0.2, cyc + r * 0.55];
  const crank = [bx - size * 0.015, cyc + r * 0.62];
  const seat = [bx - size * 0.06, cyc - r * 0.22];
  const bars = [bx + size * 0.13, cyc - r * 0.4];
  ctx.beginPath();
  ctx.moveTo(w1[0], w1[1]); ctx.lineTo(seat[0], seat[1]); ctx.lineTo(crank[0], crank[1]); ctx.lineTo(w1[0], w1[1]);
  ctx.moveTo(crank[0], crank[1]); ctx.lineTo(w2[0], w2[1]); ctx.lineTo(bars[0], bars[1]);
  ctx.moveTo(seat[0], seat[1]); ctx.lineTo(bars[0], bars[1]);
  ctx.stroke();
  // seat + handlebar
  ctx.beginPath();
  ctx.moveTo(seat[0] - size * 0.035, seat[1] - size * 0.01);
  ctx.lineTo(seat[0] + size * 0.03, seat[1] - size * 0.01);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(bars[0] - size * 0.03, bars[1] - size * 0.005);
  ctx.lineTo(bars[0] + size * 0.03, bars[1] + size * 0.005);
  ctx.stroke();

  if (dim > 0) {
    ctx.fillStyle = `rgba(30,31,41,${dim})`;
    ctx.fillRect(x, y, size, size);
  }

  // Vision grid.
  if (grid && gridAlpha > 0) {
    const n = 16;
    const cell = size / n;
    ctx.strokeStyle = `rgba(248,248,242,${gridAlpha * 0.55})`;
    ctx.lineWidth = Math.max(1, size * 0.0018);
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(x + i * cell, y); ctx.lineTo(x + i * cell, y + size); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y + i * cell); ctx.lineTo(x + size, y + i * cell); ctx.stroke();
    }
  }

  // Slice gaps: carve thin dark lanes along every cell boundary.
  if (slice > 0) {
    const n = 16;
    const cell = size / n;
    const gap = Math.min(cell * 0.13, cell * 0.13 * slice * 1.3);
    ctx.strokeStyle = C.bg;
    ctx.lineWidth = gap;
    ctx.beginPath();
    for (let i = 1; i < n; i++) {
      ctx.moveTo(x + i * cell, y);
      ctx.lineTo(x + i * cell, y + size);
      ctx.moveTo(x, y + i * cell);
      ctx.lineTo(x + size, y + i * cell);
    }
    ctx.stroke();
  }

  if (highlight) {
    const n = 16;
    const cell = size / n;
    const [hi, hj] = highlight;
    ctx.fillStyle = 'rgba(189,147,249,0.18)';
    ctx.fillRect(x + hi * cell, y + hj * cell, cell, cell);
    ctx.strokeStyle = C.purple;
    ctx.lineWidth = Math.max(2, size * 0.006);
    ctx.strokeRect(x + hi * cell, y + hj * cell, cell, cell);
  }

  ctx.restore();
}

export function drawPatchNumbers(ctx, x, y, size, o = {}) {
  const { alpha = 1, color = C.fg, progress = 1 } = o;
  if (alpha <= 0.001) return;
  const n = 14;
  const cell = size / n;
  ctx.save();
  ctx.globalAlpha *= alpha;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const q = clamp(progress * 1.6 - (i + j) * 0.045);
      if (q <= 0) continue;
      const v = ((i * 37 + j * 61 + 13) % 7) / 7;
      ctx.globalAlpha = alpha * q * (0.38 + v * 0.62);
      ctx.fillStyle = i < 2 && j < 2 ? C.purple : color;
      const num = Math.floor(v * 255);
      text(ctx, String(num).padStart(2, '0'), x + i * cell + cell / 2, y + j * cell + cell * 0.62, {
        size: cell * 0.42, family: F.body, weight: 600, align: 'center', color: ctx.fillStyle,
      });
    }
  }
  ctx.restore();
}

// ---- people ---------------------------------------------------------------

export function drawWriter(ctx, x, y, s = 1, o = {}) {
  const { color = C.fg, alpha = 1, desk = true, tap = 0 } = o;
  ctx.save();
  ctx.globalAlpha *= alpha;
  // desk
  if (desk) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 54 * s, y + 8 * s);
    ctx.lineTo(x + 54 * s, y + 8 * s);
    ctx.moveTo(x - 42 * s, y + 8 * s);
    ctx.lineTo(x - 46 * s, y + 56 * s);
    ctx.moveTo(x + 42 * s, y + 8 * s);
    ctx.lineTo(x + 46 * s, y + 56 * s);
    ctx.stroke();
    // laptop
    ctx.strokeStyle = C.muted;
    ctx.lineWidth = 2.6 * s;
    ctx.beginPath();
    ctx.moveTo(x + 18 * s, y + 8 * s);
    ctx.lineTo(x + 18 * s, y - 14 * s);
    ctx.lineTo(x + 48 * s, y - 14 * s);
    ctx.lineTo(x + 48 * s, y + 8 * s);
    ctx.stroke();
  }
  // head
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y - 74 * s, 13 * s, 0, Math.PI * 2);
  ctx.fill();
  // body
  ctx.strokeStyle = color;
  ctx.lineWidth = 4 * s;
  ctx.beginPath();
  ctx.moveTo(x, y - 60 * s);
  ctx.lineTo(x, y - 16 * s);
  // arms (typing)
  const wig = Math.sin(tap) * 1.4 * s;
  ctx.moveTo(x, y - 48 * s);
  ctx.lineTo(x - 22 * s, y - 28 * s + wig);
  ctx.lineTo(x - 30 * s, y - 12 * s);
  ctx.moveTo(x, y - 48 * s);
  ctx.lineTo(x + 22 * s, y - 30 * s - wig);
  ctx.lineTo(x + 24 * s, y - 14 * s);
  ctx.stroke();
  ctx.restore();
}

// ---- vectors --------------------------------------------------------------

// One token embedding drawn as a narrow heat-map strip.
export function vectorStrip(ctx, x, y, w, h, o = {}) {
  const { color = C.purple, alpha = 1, seed = 1, cells = 8, gap = 2.2, accent = null } = o;
  if (alpha <= 0.001) return;
  const ch = (h - gap * (cells - 1)) / cells;
  ctx.save();
  ctx.globalAlpha *= alpha;
  for (let k = 0; k < cells; k++) {
    const v = Math.abs(Math.sin((seed * 12.9898 + k * 78.233) * 43758.5453) % 1);
    const a = 0.2 + v * 0.8;
    ctx.globalAlpha = alpha * a;
    ctx.fillStyle = accent && k === (seed % cells) ? accent : color;
    rr(ctx, x, y + k * (ch + gap), w, ch, Math.min(2.5, ch / 2));
    ctx.fill();
  }
  ctx.restore();
}

export function vectorRow(ctx, x, y, n, w, h, o = {}) {
  const { gap = 10, color = C.purple, alpha = 1, seed = 1, accent = C.cyan, stagger = 0, t = 0, at = 0 } = o;
  for (let i = 0; i < n; i++) {
    const a = stagger > 0 ? alpha * clamp((t - at - i * stagger) / 0.3) : alpha;
    vectorStrip(ctx, x + i * (w + gap), y, w, h, {
      color, alpha: a, seed: seed + i * 7, accent,
    });
  }
}

// ---- charts ---------------------------------------------------------------

export function hbar(ctx, x, y, w, h, frac, o = {}) {
  const {
    color = C.cyan, alpha = 1, bg = 'rgba(248,248,242,0.08)', r = 6, label = null,
    value = null, labelSize = 36, valueSize = 40, valueColor = null, baseline = true,
  } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  rr(ctx, x, y, w, h, r);
  ctx.fillStyle = bg;
  ctx.fill();
  const ww = Math.max(h, w * clamp(frac));
  rr(ctx, x, y, ww, h, r);
  ctx.fillStyle = color;
  ctx.fill();
  if (label) {
    text(ctx, label, x - 18, y + h / 2 + 1, { size: labelSize, align: 'right', baseline: 'middle', color: C.fg });
  }
  if (value !== null) {
    text(ctx, value, x + ww + 16, y + h / 2 + 1, { size: valueSize, weight: 600, baseline: 'middle', color: valueColor || color });
  }
  if (baseline) {
    ctx.strokeStyle = 'rgba(248,248,242,0.22)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 1, y - 6);
    ctx.lineTo(x - 1, y + h + 6);
    ctx.stroke();
  }
  ctx.restore();
}

export function count(ctx, value, o = {}) {
  const {
    x = 0, y = 0, size = 150, weight = 500, color = C.fg, decimals = 0, alpha = 1,
    suffix = '', prefix = '', align = 'left', family = F.display, ls = -2,
  } = o;
  const str = prefix + Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }) + suffix;
  text(ctx, str, x, y, { size, weight, family, color, alpha, align, ls });
}

// ---- layouts --------------------------------------------------------------

export function centerColumn(ctx, label, y, size = 40, color = C.muted) {
  text(ctx, label, W / 2, y, { size, color, align: 'center' });
}

export function numberedChip(ctx, x, y, n, o = {}) {
  const { color = C.purple, size = 46, alpha = 1, filled = false } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  if (filled) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.stroke();
  }
  text(ctx, String(n), x, y + 1, {
    size: size * 0.48, weight: 600, align: 'center', baseline: 'middle',
    color: filled ? C.bg : color,
  });
  ctx.restore();
}

export function testChip(ctx, x, y, n, label, o = {}) {
  const { color = C.yellow, alpha = 1, active = 0 } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  pill(ctx, x, y, `${n}`, { size: 28, weight: 700, color: C.bg, bg: color, padX: 15, padY: 7, alpha });
  text(ctx, label, x + 62, y + 1, { size: 40, color: C.fg, alpha, baseline: 'middle' });
  ctx.restore();
}

export function keyValue(ctx, x, y, k, v, o = {}) {
  const { kc = C.muted, vc = C.fg, size = 36, gap = 16, align = 'left' } = o;
  if (align === 'right') {
    text(ctx, v, x, y, { size: size + 4, weight: 600, color: vc, align: 'right' });
    text(ctx, k, x, y + size * 1.15, { size, color: kc, align: 'right' });
  } else {
    text(ctx, k, x, y, { size, color: kc });
    text(ctx, v, x, y + size * 1.3, { size: size + 6, weight: 600, color: vc });
  }
}

export function progressLine(ctx, x, y, w, value, o = {}) {
  const { color = C.purple, alpha = 1, h = 6, bg = 'rgba(248,248,242,0.1)' } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  rr(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = bg;
  ctx.fill();
  rr(ctx, x, y, w * clamp(value), h, h / 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

// ---- equation -------------------------------------------------------------

export function equation(ctx, x, y, o = {}) {
  const {
    size = 76, color = C.fg, alpha = 1, t = 0, ts = {},
  } = o;
  // h' = h + F(h) + m × dF(h)
  const parts = [
    { id: 'lhs', s: 'h′', c: C.fg, dx: 0 },
    { id: 'eq1', s: ' = ', c: C.muted, dx: 0 },
    { id: 'h', s: 'h', c: C.fg, dx: 0 },
    { id: 'plus1', s: ' + ', c: C.muted, dx: 0 },
    { id: 'F', s: 'F', c: C.cyan, dx: 0 },
    { id: 'h2', s: '(h)', c: C.fg, dx: 0 },
    { id: 'plus2', s: ' + ', c: C.muted, dx: 0 },
    { id: 'm', s: 'm', c: C.yellow, dx: 0 },
    { id: 'dot', s: ' · ', c: C.muted, dx: 0 },
    { id: 'dF', s: 'dF', c: C.green, dx: 0 },
    { id: 'h3', s: '(h)', c: C.fg, dx: 0 },
  ];
  let cx = x;
  ctx.save();
  ctx.globalAlpha *= alpha;
  for (const part of parts) {
    const q = ts[part.id] ?? 1;
    if (q <= 0) continue;
    setFont(ctx, size, 450, F.display);
    const w = ctx.measureText(part.s).width;
    text(ctx, part.s, cx, y, { size, weight: 450, color: part.c, alpha: q, ls: 0 });
    cx += w;
  }
  ctx.restore();
  return cx - x;
}

export function brace(ctx, x1, x2, y, o = {}) {
  const { color = C.muted, alpha = 1, width = 2, depth = 10, progress = 1, label = null, labelSize = 30, labelColor = null } = o;
  const mid = (x1 + x2) / 2;
  strokePath(ctx, [[x1, y], [x1, y + depth], [mid, y + depth], [x2, y + depth], [x2, y]], {
    color, width, alpha, progress, rough: 0.3,
  });
  strokePath(ctx, [[mid, y + depth], [mid, y + depth * 1.7]], { color, width, alpha, progress, rough: 0.3 });
  if (label) text(ctx, label, mid, y + depth * 1.7 + labelSize * 1.05, {
    size: labelSize, color: labelColor || color, align: 'center', alpha,
  });
}

// ---- texture --------------------------------------------------------------

let grainCanvas = null;
export function makeGrain() {
  const c = document.createElement('canvas');
  c.width = 360;
  c.height = 360;
  const g = c.getContext('2d');
  const img = g.createImageData(c.width, c.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = Math.random() * 22;
  }
  g.putImageData(img, 0, 0);
  grainCanvas = c;
  return c;
}

export function drawGrain(ctx, alpha = 0.5) {
  if (!grainCanvas) makeGrain();
  const pat = ctx.createPattern(grainCanvas, 'repeat');
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

let bgCache = null;

function buildBg() {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = C.bg;
  g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W / 2, H * 0.44, H * 0.1, W / 2, H / 2, H * 0.95);
  glow.addColorStop(0, 'rgba(255,255,255,0.028)');
  glow.addColorStop(0.5, 'rgba(255,255,255,0.008)');
  glow.addColorStop(1, 'rgba(0,0,0,0.20)');
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);
  if (!grainCanvas) makeGrain();
  const pat = g.createPattern(grainCanvas, 'repeat');
  g.globalAlpha = 0.22;
  g.fillStyle = pat;
  g.fillRect(0, 0, W, H);
  g.globalAlpha = 1;
  const vig = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.8);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.28)');
  g.fillStyle = vig;
  g.fillRect(0, 0, W, H);
  bgCache = c;
}

export function backdrop(ctx) {
  if (!bgCache) buildBg();
  ctx.drawImage(bgCache, 0, 0, W, H);
}

// The vignette is baked into the backdrop so the compositor does not pay for
// a full-screen radial gradient every frame.
export function vignette() {}

