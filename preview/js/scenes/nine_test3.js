import {
  W, H, C, F, text, card, pill, icon, p, enter, line, arrow, bracket, underline,
  count, rr, clamp, lerp, easeInOut, vectorStrip, measure, drawPhoto, numberedChip, strokePath,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  puzzle: at('puzzle', 70),
  test1: at('test one says', 70),
  waste: at('training is waste', 70),
  test2: at('test two says', 70),
  params: at('vision parameters matter', 70),
  build: at('design you can use', 71),
  separate: at('separate encoder has to finish', 72),
  wait: at('wait', 72),
  room: at('question is about the room', 73),
  sit: at('desk have to sit', 73),
  office: at('main office', 73),
  refresher: at('quick reminder', 74),
  stack: at('stack of layers', 74),
  attention: at('attention', 74),
  ffn: at('feed forward', 74),
  same: at('same weights', 74),
  trick: at('their trick', 75),
  second: at('second set of weights', 75),
  switch: at('light switch', 76),
  mswitch: at('m is the switch', 76),
  empty: at('starts empty', 76),
  textOnly: at('text only inputs', 76),
  name: at('in fusion', 77),
  pointFour: at('zero point four billion', 77),
  pause: at('pause the video', 78),
  floors: at('twenty eight layers', 78),
  four: at('four places', 78),
  thin: at('thin slice', 78),
  spread: at('spread out', 78),
  top8: at('top eight', 78),
  bottom8: at('bottom eight', 78),
  rthin: at('thin slice on every floor', 79),
  rspread: at('spread out', 79),
  rtop: at('top eight', 79),
  rbottom: at('bottom eight', 80),
  r45: at('forty five point zero', 80),
  early: at('early or nothing', 81),
  why: at('why early', 82),
  first8: at('first eight blocks', 82),
};

// ---------------------------------------------------------------- puzzle

const puzzle = {
  id: 't3-puzzle',
  title: 'The puzzle',
  start: 730.66,
  end: 748.1,
  draw(ctx, t) {
    const a1 = p(t, q.test1, 0.6);
    const a2 = p(t, q.test2 - 0.1, 0.6);
    const a3 = p(t, q.build - 0.2, 0.7);

    const items = [
      { y: 300, title: 'test 1 · training', value: 'the training can go', color: C.green, a: a1, icon: 'check' },
      { y: 500, title: 'test 2 · capacity', value: 'the vision parameters matter', color: C.orange, a: a2, icon: 'desk' },
    ];
    items.forEach((it) => {
      if (it.a <= 0.001) return;
      ctx.save();
      ctx.globalAlpha = it.a;
      card(ctx, 280, it.y, 760, 150, { fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 16, accent: it.color, accentW: 3 });
      icon(ctx, it.icon, 312, it.y + 40, 70, { color: it.color, width: 2.8 });
      text(ctx, it.title, 410, it.y + 62, { size: 28, color: C.muted });
      text(ctx, it.value, 410, it.y + 110, { size: 34, color: C.fg });
      ctx.restore();
    });

    const qa = p(t, 730.9, 0.6);
    text(ctx, '?', 1370, 510, { size: 160, weight: 500, color: C.yellow, align: 'center', alpha: qa });
    text(ctx, 'does the desk have to be separate?', 1370, 600, {
      size: 32, color: C.muted, align: 'center', alpha: qa,
    });

    if (a3 > 0) {
      ctx.save();
      ctx.globalAlpha = a3;
      card(ctx, 1080, 700, 560, 170, { fill: 'rgba(189,147,249,0.06)', stroke: 'rgba(189,147,249,0.4)', r: 16, accent: C.purple, accentW: 3 });
      numberedChip(ctx, 1120, 750, 3, { color: C.purple, size: 50 });
      text(ctx, 'test 3 · placement', 1180, 748, { size: 30, color: C.purple });
      text(ctx, 'the one you can build on', 1180, 800, { size: 34, color: C.fg });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- the wait / room

const room = {
  id: 't3-room',
  title: 'The separate room',
  start: 748.1,
  end: 762.74,
  draw(ctx, t) {
    const tl = p(t, 748.5, 0.7);
    const wait = p(t, q.wait - 0.2, 0.6);
    const rooms = p(t, q.room - 0.2, 0.8);
    const move = easeInOut(p(t, q.office - 0.5, 1.2));

    // Request timeline.
    ctx.save();
    ctx.globalAlpha = tl;
    const stages = [
      { x: 220, w: 230, label: 'request', color: C.muted },
      { x: 540, w: 320, label: 'separate encoder', color: C.cyan },
      { x: 950, w: 330, label: 'language model', color: C.purple },
      { x: 1370, w: 260, label: 'first token', color: C.fg },
    ];
    stages.forEach((s) => {
      card(ctx, s.x, 240, s.w, 110, { fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 12 });
      text(ctx, s.label, s.x + s.w / 2, 305, { size: 30, color: s.color, align: 'center' });
    });
    arrow(ctx, 450, 295, 530, 295, { color: C.muted, width: 2.4, head: 9 });
    arrow(ctx, 860, 295, 940, 295, { color: C.muted, width: 2.4, head: 9 });
    arrow(ctx, 1280, 295, 1360, 295, { color: C.muted, width: 2.4, head: 9 });
    if (wait > 0) {
      bracket(ctx, 540, 860, 380, { color: C.red, width: 2, progress: wait, tick: 10 });
      text(ctx, 'you wait here', 700, 440, { size: 34, color: C.red, align: 'center', alpha: wait });
    }
    ctx.restore();

    // Two rooms.
    if (rooms > 0) {
      ctx.save();
      ctx.globalAlpha = rooms;
      // separate room
      card(ctx, 300, 560, 520, 300, { fill: C.well, stroke: 'rgba(248,248,242,0.18)', r: 12, alpha: 1 - 0.55 * move });
      text(ctx, 'separate room', 560, 900, { size: 30, color: C.muted, align: 'center', alpha: 1 - 0.55 * move });
      icon(ctx, 'desk', 440, 650, 180, { color: C.cyan, width: 3, alpha: 1 - move });
      // main office
      card(ctx, 1040, 560, 640, 300, { fill: C.well, stroke: 'rgba(189,147,249,0.3)', r: 12 });
      icon(ctx, 'people', 1090, 680, 110, { color: C.purple, width: 2.8 });
      icon(ctx, 'desk', 1350 + 210 * (1 - move), 650, 170, { color: C.green, width: 3, alpha: 0.4 + 0.6 * move });
      text(ctx, 'main office', 1360, 900, { size: 30, color: C.purple, align: 'center' });
      text(ctx, 'writers', 1160, 900, { size: 28, color: C.muted, align: 'center' });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- inside a layer

const layer = {
  id: 't3-layer',
  title: 'Attention and FFN',
  start: 762.74,
  end: 781.96,
  draw(ctx, t) {
    const stack = p(t, q.stack - 0.2, 0.7);
    const att = p(t, q.attention - 0.2, 0.6);
    const ff = p(t, q.ffn - 0.2, 0.6);
    const same = p(t, q.same - 0.2, 0.6);

    ctx.save();
    ctx.globalAlpha = stack;
    for (let k = 0; k < 3; k++) {
      const y = 260 + k * 170;
      card(ctx, 500, y, 920, 140, { fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 16 });
      // attention block
      card(ctx, 540, y + 24, 380, 92, {
        fill: 'rgba(139,233,253,0.07)', stroke: 'rgba(139,233,253,0.3)', r: 10,
        alpha: att > 0 ? 0.6 + 0.4 * att : 0.6,
      });
      text(ctx, 'attention', 730, y + 80, { size: 30, color: C.cyan, align: 'center' });
      // FFN block
      card(ctx, 980, y + 24, 380, 92, {
        fill: 'rgba(189,147,249,0.07)', stroke: 'rgba(189,147,249,0.3)', r: 10,
        alpha: ff > 0 ? 0.6 + 0.4 * ff : 0.6,
      });
      text(ctx, 'FFN', 1170, y + 80, { size: 30, color: C.purple, align: 'center' });
      if (k < 2) text(ctx, '↓', 960, y + 165, { size: 28, color: C.dim, align: 'center' });
    }
    // token strips entering.
    for (let i = 0; i < 3; i++) {
      vectorStrip(ctx, 350 + i * 40, 300, 26, 62, { color: C.cyan, accent: C.fg, seed: i * 4 + 1, cells: 5, alpha: 0.9 });
      vectorStrip(ctx, 350 + i * 40, 390, 26, 62, { color: C.purple, accent: C.cyan, seed: i * 5 + 2, cells: 5, alpha: 0.9 });
    }
    text(ctx, 'text', 350, 290, { size: 26, color: C.cyan });
    text(ctx, 'image', 350, 380, { size: 26, color: C.purple });
    ctx.restore();

    if (same > 0) {
      text(ctx, 'both go through the same FFN weights', 960, 930, {
        size: 34, color: C.fg, align: 'center', alpha: same,
      });
    }
  },
};

// ---------------------------------------------------------------- in-fusion

const infusion = {
  id: 't3-infusion',
  title: 'In-fusion',
  start: 781.96,
  end: 821.14,
  draw(ctx, t) {
    const trick = p(t, q.trick - 0.2, 0.7);
    const second = p(t, q.second - 0.2, 0.7);
    const eq = p(t, q.switch - 0.2, 0.7);
    const m = p(t, q.mswitch - 0.2, 0.6);
    const empty = p(t, q.empty - 0.2, 0.6);
    const textOnly = p(t, q.textOnly - 0.2, 0.6);
    const slide = easeInOut(p(t, q.trick - 0.2, 1.2));

    // Main office layer.
    card(ctx, 500, 200, 960, 380, { fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20 });
    text(ctx, 'one layer', 540, 250, { size: 30, color: C.muted });

    // Shared FFN.
    card(ctx, 620, 290, 300, 150, { fill: 'rgba(189,147,249,0.07)', stroke: 'rgba(189,147,249,0.3)', r: 12 });
    text(ctx, 'shared FFN', 770, 375, { size: 30, color: C.purple, align: 'center' });

    // Extra desk.
    const dx = lerp(260, 1000, slide);
    const dy = lerp(470, 290, slide);
    card(ctx, dx, dy, 300, 150, {
      fill: 'rgba(80,250,123,0.065)', stroke: 'rgba(80,250,123,0.35)', r: 12,
      alpha: 0.4 + 0.6 * trick, glow: 14 * trick,
    });
    text(ctx, 'vision-only FFN', dx + 150, dy + 85, { size: 28, color: C.green, align: 'center', alpha: 0.4 + 0.6 * trick });
    if (trick > 0) {
      icon(ctx, 'desk', 210, 430, 110, { color: C.green, width: 2.8, alpha: 1 - slide });
    }

    // Tokens.
    vectorStrip(ctx, 540, 300, 36, 64, { color: C.purple, accent: C.cyan, seed: 3, cells: 6 });
    vectorStrip(ctx, 540, 380, 36, 64, { color: C.cyan, accent: C.fg, seed: 7, cells: 6 });
    text(ctx, 'image', 500, 296, { size: 26, color: C.purple, align: 'right' });
    text(ctx, 'text', 500, 376, { size: 26, color: C.cyan, align: 'right' });
    arrow(ctx, 590, 340, 615, 340, { color: C.muted, width: 2.2, head: 8 });
    arrow(ctx, 590, 410, 615, 410, { color: C.muted, width: 2.2, head: 8 });

    if (second > 0) {
      arrow(ctx, 925, 330, 995, 330, { color: C.green, width: 2.4, head: 9, progress: second });
      // Text bypasses the extra desk.
      ctx.save();
      ctx.globalAlpha = second;
      strokePath(ctx, [[925, 410], [950, 480], [1320, 480]], { color: C.cyan, width: 2, dash: [7, 7] });
      text(ctx, 'text skips the extra desk', 1135, 522, { size: 24, color: C.cyan, align: 'center' });
      ctx.restore();
    }

    // Equation.
    if (eq > 0) {
      ctx.save();
      ctx.globalAlpha = eq;
      text(ctx, 'for an image token:', 520, 660, { size: 28, color: C.muted });
      // Custom equation layout.
      let x = 520;
      const y = 735;
      const parts = [
        { s: "h′", c: C.fg }, { s: ' = ', c: C.muted }, { s: 'h', c: C.fg },
        { s: ' + ', c: C.muted }, { s: 'F', c: C.cyan }, { s: '(h)', c: C.fg },
        { s: ' + ', c: C.muted }, { s: 'm', c: C.yellow }, { s: ' · ', c: C.muted },
        { s: 'dF', c: C.green }, { s: '(h)', c: C.fg },
      ];
      parts.forEach((pt) => {
        setFontEq(ctx, 62);
        const w = ctx.measureText(pt.s).width;
        text(ctx, pt.s, x, y, { size: 62, color: pt.c, weight: 450 });
        x += w;
      });
      // labels
      text(ctx, 'F  shared FFN', 520, 805, { size: 28, color: C.cyan });
      text(ctx, 'dF  vision-only', 790, 805, { size: 28, color: C.green });
      text(ctx, 'm  1 image · 0 text', 1060, 805, { size: 28, color: C.yellow });
      ctx.restore();
    }

    // Switch.
    if (m > 0) {
      ctx.save();
      ctx.globalAlpha = m;
      card(ctx, 1440, 660, 300, 140, { fill: C.well, stroke: 'rgba(241,250,140,0.3)', r: 14 });
      text(ctx, 'switch', 1590, 700, { size: 26, color: C.muted, align: 'center' });
      const on = 0.5 + 0.5 * Math.sin((t - q.mswitch) * 2.2);
      rr(ctx, 1480, 720, 100, 50, 25);
      ctx.fillStyle = on > 0.5 ? C.green : C.current;
      ctx.fill();
      ctx.fillStyle = C.fg;
      ctx.beginPath(); ctx.arc(on > 0.5 ? 1555 : 1505, 745, 19, 0, Math.PI * 2); ctx.fill();
      text(ctx, on > 0.5 ? '1' : '0', 1680, 758, { size: 54, weight: 500, color: on > 0.5 ? C.green : C.red, align: 'center' });
      ctx.restore();
    }

    if (empty > 0) {
      text(ctx, 'starts at zero: step 1 is unchanged', 500, 880, { size: 28, color: C.muted, alpha: empty });
    }
    if (textOnly > 0) {
      text(ctx, 'text tokens skip the extra desk', 500, 920, { size: 28, color: C.cyan, alpha: textOnly });
    }
  },
};

function setFontEq(ctx, size) {
  ctx.font = `450 ${size}px ${F.display}`;
}

// ---------------------------------------------------------------- details

const details = {
  id: 't3-details',
  title: 'In-fusion',
  start: 821.14,
  end: 839.34,
  draw(ctx, t) {
    const name = p(t, q.name - 0.2, 0.8);
    const noNet = p(t, 825.0, 0.6);
    const pf = p(t, q.pointFour - 0.2, 0.6);
    const zero = p(t, 836.0, 0.6);

    text(ctx, 'in-fusion', 960, 210, { size: 72, weight: 500, color: C.green, align: 'center', alpha: name });
    text(ctx, 'the desk moves inside', 960, 260, { size: 32, color: C.muted, align: 'center', alpha: name });

    // Office diagram.
    card(ctx, 280, 340, 620, 420, { fill: C.well, stroke: 'rgba(80,250,123,0.28)', r: 18, alpha: name });
    icon(ctx, 'people', 330, 390, 160, { color: C.purple, width: 3, alpha: name });
    icon(ctx, 'desk', 540, 370, 220, { color: C.green, width: 3, alpha: name });
    text(ctx, 'writers', 410, 660, { size: 30, color: C.muted, align: 'center', alpha: name });
    text(ctx, 'vision desk', 650, 660, { size: 32, color: C.green, align: 'center', alpha: name });
    line(ctx, 320, 600, 860, 600, { color: 'rgba(248,248,242,0.22)', width: 2, alpha: name });

    const checks = [
      { y: 360, t: 'no separate network', s: 'nothing runs before the model', a: noNet, icon: 'check', color: C.green },
      { y: 480, t: '0.4B vision-only parameters', s: 'same budget as the encoder', a: pf, icon: 'desk', color: C.green },
      { y: 600, t: 'starts at zero', s: 'step one behaves like the plain model', a: zero, icon: 'check', color: C.green },
    ];
    checks.forEach((c) => {
      if (c.a <= 0.001) return;
      ctx.save();
      ctx.globalAlpha = c.a;
      icon(ctx, c.icon, 1030, c.y - 20, 52, { color: c.color, width: 3.1 });
      text(ctx, c.t, 1100, c.y + 12, { size: 32, color: C.fg });
      text(ctx, c.s, 1100, c.y + 54, { size: 26, color: C.muted });
      ctx.restore();
    });
  },
};

// ---------------------------------------------------------------- floors

function floorStrip(ctx, x, y, w, h, hot, color, a) {
  const n = 28;
  const rh = h / n;
  for (let i = 0; i < n; i++) {
    const on = hot.includes(i);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = on ? color : 'rgba(248,248,242,0.1)';
    if (on) {
      rr(ctx, x, y + (n - 1 - i) * rh, w, rh - 1.5, 2);
      ctx.fill();
    } else {
      ctx.fillRect(x, y + (n - 1 - i) * rh, w, rh - 1.5);
    }
    ctx.restore();
  }
}

const floors = {
  id: 't3-floors',
  title: 'Where does the desk go?',
  start: 839.34,
  end: 854.86,
  draw(ctx, t) {
    const b = p(t, 839.5, 0.9);
    const opts = p(t, q.four - 0.2, 0.8);
    const pause = p(t, 848.6, 0.6);

    // Building.
    if (b > 0) {
      ctx.save();
      ctx.globalAlpha = b;
      card(ctx, 300, 160, 460, 760, { fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 10 });
      for (let i = 0; i < 28; i++) {
        const y = 174 + (27 - i) * 26.3;
        line(ctx, 320, y, 740, y, { color: 'rgba(248,248,242,0.1)', width: 1.2 });
        if (i % 7 === 0 || i === 27) {
          text(ctx, String(i + 1), 270, y + 16, { size: 22, color: C.dim, align: 'right' });
        }
      }
      drawPhoto(ctx, 320, 820, 90, { radius: 6, alpha: b });
      text(ctx, 'raw pixels in on floor 1', 470, 880, { size: 26, color: C.muted, alpha: b });
      ctx.restore();
    }

    // Options.
    if (opts > 0) {
      const options = [
        { x: 980, y: 240, label: 'every floor', hot: Array.from({ length: 28 }, (_, i) => i), color: C.cyan },
        { x: 1380, y: 240, label: '8 spread', hot: [2, 5, 8, 11, 14, 17, 20, 23], color: C.cyan },
        { x: 980, y: 560, label: 'top 8', hot: Array.from({ length: 8 }, (_, i) => 20 + i), color: C.cyan },
        { x: 1380, y: 560, label: 'bottom 8', hot: Array.from({ length: 8 }, (_, i) => i), color: C.green },
      ];
      options.forEach((o, i) => {
        const a = opts * p(t, q.four - 0.1 + i * 0.12, 0.6);
        if (a <= 0.001) return;
        const hi = p(t, [q.thin, q.spread, q.top8, q.bottom8][i] - 0.1, 0.4);
        ctx.save();
        ctx.globalAlpha = a;
        card(ctx, o.x, o.y, 340, 260, {
          fill: C.surface, stroke: hi > 0 ? `${o.color}66` : 'rgba(248,248,242,0.12)', r: 14,
        });
        floorStrip(ctx, o.x + 26, o.y + 28, 58, 196, o.hot, o.color, a);
        text(ctx, o.label, o.x + 104, o.y + 70, { size: 30, color: hi > 0 ? o.color : C.fg });
        text(ctx, '28 layers', o.x + 104, o.y + 112, { size: 26, color: C.muted });
        ctx.restore();
      });
    }

    if (pause > 0) {
      text(ctx, '?', 870, 700, { size: 96, weight: 500, color: C.yellow, align: 'center', alpha: pause });
      text(ctx, 'pick one', 870, 760, { size: 32, color: C.muted, align: 'center', alpha: pause });
      // 5 second ring
      const left = clamp(1 - (t - 848.6) / 5);
      ctx.save();
      ctx.globalAlpha = pause;
      ctx.strokeStyle = 'rgba(248,248,242,0.18)';
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(870, 840, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = C.yellow;
      ctx.beginPath(); ctx.arc(870, 840, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * left); ctx.stroke();
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- floor results

const results = {
  id: 't3-results',
  title: 'Early or nothing',
  start: 854.86,
  end: 874.22,
  draw(ctx, t) {
    const bars = [
      { label: 'thin slice, every floor', v: 39.4, cue: q.rthin, color: C.muted },
      { label: '8 floors, spread', v: 37.6, cue: q.rspread, color: C.muted },
      { label: 'top eight', v: 35.1, cue: q.rtop, color: C.muted },
      { label: 'bottom eight', v: 45.0, cue: q.rbottom, color: C.green },
    ];
    const bx = 650;
    const bw = 900;
    const scale = bw / 50;
    const refs = [
      { v: 39.0, label: 'encoder-free 39.0', color: C.orange },
      { v: 44.4, label: 'scratch 44.4', color: C.green },
    ];
    refs.forEach((r, i) => {
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.setLineDash([8, 9]);
      line(ctx, bx + r.v * scale, 250, bx + r.v * scale, 760, { color: r.color, width: 1.8 });
      ctx.setLineDash([]);
      ctx.restore();
      const lx = i === 0 ? 1060 : 1450;
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.setLineDash([7, 7]);
      line(ctx, lx, 205, lx + 34, 205, { color: r.color, width: 2 });
      ctx.setLineDash([]);
      text(ctx, r.label, lx + 46, 215, { size: 26, color: r.color });
      ctx.restore();
    });
    bars.forEach((bar, i) => {
      const a = p(t, bar.cue - 0.15, 0.7);
      if (a <= 0.001) return;
      const y = 300 + i * 115;
      text(ctx, bar.label, 300, y + 28, { size: 30, color: C.fg, alpha: a });
      rr(ctx, bx, y, bw, 40, 8);
      ctx.fillStyle = 'rgba(248,248,242,0.07)';
      ctx.fill();
      rr(ctx, bx, y, bar.v * scale * a, 40, 8);
      ctx.fillStyle = bar.color;
      ctx.fill();
      text(ctx, bar.v.toFixed(1), bx + bar.v * scale + 18, y + 30, { size: 34, weight: 500, color: C.fg, alpha: a });
    });
    const e = p(t, q.early - 0.1, 0.6);
    text(ctx, 'early, or nothing', W / 2, 880, { size: 52, color: q.early ? C.green : C.fg, align: 'center', alpha: e });
  },
};

// ---------------------------------------------------------------- why early

const why = {
  id: 't3-why',
  title: 'Why early',
  start: 874.22,
  end: 886.58,
  draw(ctx, t) {
    const a = p(t, 874.4, 0.7);
    const first = p(t, q.first8 - 0.2, 0.7);
    ctx.save();
    ctx.globalAlpha = a;
    // 28 floor strip
    card(ctx, 340, 220, 260, 700, { fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 10 });
    for (let i = 0; i < 28; i++) {
      const y = 232 + (27 - i) * 24.4;
      const hot = i < 8;
      ctx.fillStyle = hot ? (first > 0 ? 'rgba(80,250,123,0.55)' : 'rgba(80,250,123,0.25)') : 'rgba(248,248,242,0.08)';
      rr(ctx, 360, y, 220, 21, 3);
      ctx.fill();
    }
    text(ctx, 'first 8 floors · closest to pixels', 470, 968, { size: 28, color: C.green, align: 'center', alpha: first });
    drawPhoto(ctx, 660, 760, 150, { radius: 10, alpha: a });
    text(ctx, 'raw pixels', 735, 940, { size: 26, color: C.muted, align: 'center', alpha: a });

    // change chart
    const cx = 900;
    const cy = 600;
    const cw = 760;
    const ch = 300;
    line(ctx, cx, cy, cx + cw, cy, { color: 'rgba(248,248,242,0.25)', width: 2 });
    line(ctx, cx, cy - ch, cx, cy, { color: 'rgba(248,248,242,0.25)', width: 2 });
    text(ctx, 'how much image tokens change', cx, cy - ch - 24, { size: 30, color: C.muted });
    for (let i = 0; i < 28; i++) {
      const x = cx + 20 + i * 26;
      const v = i < 8 ? 0.85 - i * 0.05 : 0.18 + (i % 3) * 0.02;
      const h = ch * v;
      rr(ctx, x, cy - h, 18, h, 4);
      ctx.fillStyle = i < 8 ? C.green : 'rgba(248,248,242,0.18)';
      ctx.fill();
    }
    text(ctx, 'layers 1–8', 960, 700, { size: 30, color: C.green, align: 'center' });
    text(ctx, 'image tokens are closest to raw pixels here', 1120, 790, {
      size: 30, color: C.fg, align: 'center', alpha: first,
    });
    ctx.restore();
  },
};

export default [puzzle, room, layer, infusion, details, floors, results, why];
