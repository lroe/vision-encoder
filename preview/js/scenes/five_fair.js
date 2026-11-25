import {
  W, H, C, F, text, card, pill, icon, p, enter, line, arrow, bracket, underline,
  drawPhoto, count, rr, clamp, lerp, easeInOut, vectorStrip, measure,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  brings: at('look at what that hire brings', 27),
  package: at('three things in one package', 27),
  one: at('one', 28),
  prior: at('visual prior', 28),
  two: at('two', 29),
  capacity: at('dedicated vision capacity', 29),
  three: at('three', 30),
  placement: at('pre fusion placement', 30),
  fusion: at('fusion is the moment', 30),
  before: at('before that moment', 30),

  all3: at('pretrained encoder has all three', 31),
  deskRoom: at('from scratch has the desk', 31),
  none: at('encoder free model has none', 31),

  expensive: at('first one is the expensive', 32),
  ten: at('ten trillion', 32),
  textTokens: at('text tokens', 32),

  work: at('which one does the work', 33),
  fair: at('fair fight', 34),
  believable: at('makes the rest believable', 34),
};

function giftIcon(ctx, name, x, y, color, a) {
  icon(ctx, name, x - 70, y - 70, 140, { color, width: 3.1, alpha: a });
}

function giftCard(ctx, x, y, key, a, t) {
  if (a <= 0.001) return;
  const w = 480;
  const h = 470;
  const color = key === 'prior' ? C.cyan : key === 'capacity' ? C.green : C.purple;
  const title = key === 'prior' ? 'visual prior' : key === 'capacity' ? 'dedicated' : 'pre-fusion';
  const title2 = key === 'capacity' ? 'vision capacity' : key === 'placement' ? 'placement' : '';
  const sub = key === 'prior' ? 'learned before your team' : key === 'capacity' ? 'only image tokens sit here' : 'finishes before fusion';

  card(ctx, x, y, w, h, {
    fill: C.surface, stroke: key === 'ghost' ? 'rgba(248,248,242,0.18)' : `${color}66`,
    r: 22, accent: color, accentW: 3, alpha: a, dash: a < 0.2 ? [9, 10] : null,
  });
  giftIcon(ctx, key === 'prior' ? 'brain' : key === 'capacity' ? 'desk' : 'room', x + w / 2, y + 128, color, a);
  text(ctx, title, x + 40, y + 310, { size: 38, color: C.fg, alpha: a });
  if (title2) text(ctx, title2, x + 40, y + 356, { size: 38, color: C.fg, alpha: a });
  text(ctx, sub, x + 40, y + (title2 ? 408 : 362), { size: 30, color: C.muted, alpha: a });

  // per-card detail
  if (key === 'prior') {
    const d = 0.2 + 0.8 * p(t, q.prior - 0.2, 0.6);
    for (let i = 0; i < 5; i++) {
      ctx.save();
      ctx.globalAlpha = a * d;
      ctx.fillStyle = i === 4 ? C.cyan : 'rgba(248,248,242,0.28)';
      ctx.beginPath();
      ctx.arc(x + 46 + i * 32, y + 426, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    text(ctx, 'years of other work', x + 40, y + 462, { size: 28, color: C.dim, alpha: a * d });
  } else if (key === 'capacity') {
    const d = p(t, q.capacity - 0.2, 0.6);
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.globalAlpha = a * d;
      ctx.fillStyle = i === 0 ? C.purple : i === 1 ? C.cyan : '#6E5B8A';
      rr(ctx, x + 42 + i * 34, y + 426, 24, 24, 4);
      ctx.fill();
      ctx.restore();
    }
    text(ctx, 'image only', x + 160, y + 446, { size: 28, color: C.dim, alpha: a * d });
  } else {
    const d = p(t, q.placement - 0.2, 0.6);
    ctx.save();
    ctx.globalAlpha = a * d;
    line(ctx, x + 420, y + 430, x + 442, y + 430, { color: C.yellow, width: 2, dash: [5, 5] });
    line(ctx, x + 230, y + 430, x + 420, y + 430, { color: 'rgba(248,248,242,0.18)', width: 1.5 });
    ctx.restore();
  }
}

// ---------------------------------------------------------------- three gifts

const gifts = {
  id: 'gifts',
  title: 'Three things attached',
  start: 249.44,
  end: 284.76,
  draw(ctx, t) {
    const pack = p(t, 249.7, 0.7);
    const a1 = p(t, q.one - 0.1, 0.65);
    const a2 = p(t, q.two - 0.1, 0.65);
    const a3 = p(t, q.three - 0.1, 0.65);
    const fade = 1 - 0.86 * p(t, q.fusion - 0.2, 0.8);

    // Ghost outlines before each reveal.
    const ghosts = [
      { x: 180, key: 'prior', a: a1 },
      { x: 720, key: 'capacity', a: a2 },
      { x: 1260, key: 'placement', a: a3 },
    ];
    ghosts.forEach((g, i) => {
      if (g.a <= 0.01 && pack > 0) {
        card(ctx, g.x, 250, 480, 470, {
          fill: null, stroke: 'rgba(248,248,242,0.13)', r: 22, alpha: pack * (i === 0 ? 0.8 : 0.5), dash: [9, 10],
        });
        giftIcon(ctx, i === 0 ? 'brain' : i === 1 ? 'desk' : 'room', g.x + 240, 378,
          i === 0 ? C.cyan : i === 1 ? C.green : C.purple, pack * (i === 0 ? 0.6 : 0.3));
      } else {
        giftCard(ctx, g.x, 250, g.key, g.a * fade, t);
      }
    });

    // Package label.
    const pA = p(t, q.package - 0.2, 0.6) * (1 - p(t, q.one + 1.0, 0.6));
    if (pA > 0) {
      text(ctx, 'one package', W / 2, 200, { size: 34, color: C.muted, align: 'center', alpha: pA });
    }

    // The fusion strip.
    const fus = p(t, q.fusion - 0.1, 0.8);
    if (fus > 0) {
      ctx.save();
      ctx.globalAlpha = fus;
      // image tokens
      text(ctx, 'image tokens', 250, 806, { size: 30, color: C.purple });
      for (let i = 0; i < 3; i++) {
        vectorStrip(ctx, 250 + i * 46, 826, 32, 82, { color: C.purple, accent: C.cyan, seed: i * 4 + 2, cells: 6 });
      }
      // room
      card(ctx, 570, 800, 280, 140, { fill: C.surface, stroke: 'rgba(189,147,249,0.4)', r: 14 });
      icon(ctx, 'room', 590, 812, 100, { color: C.purple, width: 2.8 });
      text(ctx, 'expert, first', 780, 888, { size: 30, color: C.fg, align: 'center' });
      // text tokens
      text(ctx, 'text tokens', 250, 958, { size: 30, color: C.cyan });
      for (let i = 0; i < 3; i++) {
        vectorStrip(ctx, 250 + i * 46, 972, 32, 66, { color: C.cyan, accent: C.fg, seed: i * 3 + 1, cells: 5 });
      }
      // gate
      line(ctx, 1180, 752, 1180, 1040, { color: C.yellow, width: 2.5, dash: [8, 7] });
      text(ctx, 'fusion', 1180, 726, { size: 34, color: C.yellow, align: 'center' });
      arrow(ctx, 400, 867, 560, 867, { color: C.muted, width: 2.6, progress: p(t, q.fusion + 0.3, 0.6), head: 11 });
      arrow(ctx, 860, 867, 1160, 867, { color: C.muted, width: 2.6, progress: p(t, q.fusion + 0.45, 0.6), head: 11 });
      arrow(ctx, 400, 1005, 1160, 1005, { color: C.muted, width: 2.6, progress: p(t, q.fusion + 0.6, 0.6), head: 11 });
      // after
      card(ctx, 1240, 830, 400, 120, { fill: 'rgba(80,250,123,0.06)', stroke: 'rgba(80,250,123,0.3)', r: 14 });
      text(ctx, 'after fusion', 1440, 900, { size: 32, color: C.green, align: 'center' });
      bracket(ctx, 570, 850, 782, { color: C.purple, width: 1.6, tick: 8 });
      text(ctx, 'pre-fusion', 710, 752, { size: 30, color: C.purple, align: 'center' });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- table

const tableScene = {
  id: 'table',
  title: 'Who has what',
  start: 284.76,
  end: 294.5,
  draw(ctx, t) {
    const rows = [
      { cue: q.all3, name: 'pretrained', color: C.cyan, vals: [true, true, true] },
      { cue: q.deskRoom, name: 'from scratch', color: C.green, vals: [false, true, true] },
      { cue: q.none, name: 'encoder-free', color: C.orange, vals: [false, false, false] },
    ];
    const cols = [
      { x: 880, icon: 'brain', label: 'prior' },
      { x: 1110, icon: 'desk', label: 'desk' },
      { x: 1340, icon: 'room', label: 'room' },
    ];
    // Header.
    cols.forEach((c, i) => {
      const a = p(t, 285.0 + i * 0.1, 0.6);
      card(ctx, c.x - 86, 270, 172, 150, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 14, alpha: a });
      icon(ctx, c.icon, c.x - 34, 292, 68, { color: [C.cyan, C.green, C.purple][i], width: 2.8, alpha: a });
      text(ctx, c.label, c.x, 404, { size: 30, color: C.muted, align: 'center', alpha: a });
    });

    rows.forEach((r, ri) => {
      const a = p(t, r.cue - 0.1, 0.7);
      const y = 460 + ri * 130;
      card(ctx, 340, y, 1160, 104, {
        fill: ri === 0 ? 'rgba(139,233,253,0.055)' : C.surface,
        stroke: ri === 0 ? 'rgba(139,233,253,0.24)' : 'rgba(248,248,242,0.12)',
        r: 14, alpha: a,
      });
      text(ctx, r.name, 390, y + 64, { size: 34, color: r.color, alpha: a });
      r.vals.forEach((v, ci) => {
        const qq = p(t, r.cue + 0.15 + ci * 0.08, 0.4);
        icon(ctx, v ? 'check' : 'cross', cols[ci].x - 34, y + 24, 56, {
          color: v ? C.green : C.red, width: 3.2, alpha: a * qq,
        });
      });
    });

    const note = p(t, 292.0, 0.6);
    text(ctx, 'three gifts · one package', W / 2, 930, { size: 34, color: C.muted, align: 'center', alpha: note });
  },
};

// ---------------------------------------------------------------- cost

const costScene = {
  id: 'cost',
  title: 'The expensive one',
  start: 294.5,
  end: 305.42,
  draw(ctx, t) {
    const intro = p(t, 294.6, 0.7) * (1 - p(t, q.ten - 0.2, 0.6));
    if (intro > 0) {
      icon(ctx, 'brain', 880, 300, 180, { color: C.cyan, width: 3.2, alpha: intro });
      pill(ctx, 960, 530, 'the expensive one', { size: 34, color: C.bg, bg: C.red, padX: 18, padY: 8, alpha: intro, align: 'center' });
    }

    const ten = p(t, q.ten - 0.2, 0.8);
    if (ten > 0) {
      const n = Math.round(10 * p(t, q.ten, 0.8));
      text(ctx, `${n} trillion`, W / 2, 400, {
        size: 168, weight: 500, align: 'center', alpha: ten, ls: -6,
      });
      text(ctx, 'image tokens · SigLIP 2', W / 2, 460, {
        size: 36, color: C.muted, align: 'center', alpha: ten,
      });
      underline(ctx, W / 2 - 270, 426, 540, { color: C.purple, width: 4, progress: p(t, q.ten + 0.6, 0.7), alpha: 0.85 });

      // Scale comparison.
      const bars = p(t, q.textTokens - 0.2, 0.8);
      if (bars > 0) {
        const bx = 500;
        const bw = 1020;
        const by = 650;
        text(ctx, 'image tokens', bx, by - 14, { size: 32, color: C.muted });
        rr(ctx, bx, by, bw, 36, 18);
        ctx.fillStyle = 'rgba(248,248,242,0.08)';
        ctx.fill();
        rr(ctx, bx, by, bw * bars, 36, 18);
        ctx.fillStyle = C.cyan;
        ctx.fill();
        text(ctx, '10T', bx + bw + 20, by + 30, { size: 34, weight: 500, color: C.cyan, alpha: bars });

        text(ctx, 'text tokens', bx, by + 110, { size: 32, color: C.muted });
        rr(ctx, bx, by + 124, bw, 36, 18);
        ctx.fillStyle = 'rgba(248,248,242,0.08)';
        ctx.fill();
        rr(ctx, bx, by + 124, bw * 0.86 * bars, 36, 18);
        ctx.fillStyle = C.purple;
        ctx.fill();
        text(ctx, 'trillions', bx + bw + 20, by + 154, { size: 34, weight: 500, color: C.purple, alpha: bars });

        text(ctx, 'the same scale', 960, 930, { size: 34, color: C.muted, align: 'center', alpha: bars });
      }
    }
  },
};

// ---------------------------------------------------------------- question / fair fight

const questionScene = {
  id: 'question',
  title: 'The fair fight',
  start: 305.42,
  end: 318.32,
  draw(ctx, t) {
    const fair = p(t, q.fair - 0.3, 1.0);
    const iconsA = 1 - fair;
    const work = p(t, q.work - 0.1, 0.6);

    // The three gifts, as a question.
    if (iconsA > 0) {
      const gifts = [
        { x: 700, icon: 'brain', color: C.cyan, label: 'prior' },
        { x: 960, icon: 'desk', color: C.green, label: 'desk' },
        { x: 1220, icon: 'room', color: C.purple, label: 'room' },
      ];
      gifts.forEach((g, i) => {
        const a = p(t, 305.6 + i * 0.12, 0.5) * iconsA;
        icon(ctx, g.icon, g.x - 55, 400, 110, { color: g.color, width: 2.8, alpha: a });
        text(ctx, g.label, g.x, 560, { size: 30, color: C.muted, align: 'center', alpha: a });
      });
      text(ctx, '?', W / 2, 340, { size: 110, weight: 500, color: C.yellow, align: 'center', alpha: work * iconsA });
      text(ctx, 'which one does the work?', W / 2, 690, {
        size: 42, color: C.fg, align: 'center', alpha: p(t, q.work, 0.5) * iconsA,
      });
    }

    // Fair fight scale.
    if (fair > 0) {
      ctx.save();
      ctx.globalAlpha = fair;
      const pivotX = 960;
      const beamY = 430;
      const tilt = lerp(-0.035, 0, p(t, q.believable - 0.2, 0.8));
      ctx.translate(pivotX, beamY);
      ctx.rotate(tilt);
      line(ctx, -350, 0, 350, 0, { color: C.fg, width: 4 });
      line(ctx, -350, 0, -350, 94, { color: C.muted, width: 2 });
      line(ctx, 350, 0, 350, 94, { color: C.muted, width: 2 });
      // pans
      for (const s of [-1, 1]) {
        const px = s * 350;
        card(ctx, px - 120, 96, 240, 116, { fill: C.surface, stroke: s < 0 ? 'rgba(139,233,253,0.35)' : 'rgba(80,250,123,0.35)', r: 12 });
        text(ctx, s < 0 ? 'pretrained' : 'from scratch', px, 157, { size: 30, align: 'center' });
        text(ctx, s < 0 ? 'all three' : 'desk + room', px, 192, { size: 26, color: C.muted, align: 'center' });
      }
      ctx.restore();

      line(ctx, 960, 430, 960, 800, { color: C.fg, width: 4, alpha: fair });
      line(ctx, 860, 800, 1060, 800, { color: C.fg, width: 4, alpha: fair });
      text(ctx, 'fair fight', W / 2, 290, { size: 46, align: 'center', alpha: fair });
      text(ctx, 'same budget · same data · same everything', W / 2, 862, {
        size: 32, color: C.muted, align: 'center', alpha: p(t, q.fair + 0.5, 0.6),
      });

    }
  },
};

export default [gifts, tableScene, costScene, questionScene];
