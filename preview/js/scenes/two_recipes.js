import {
  W, H, C, F, text, card, pill, icon, p, enter, line, arrow, bracket, underline,
  drawPhoto, rr, clamp, lerp, easeInOut, numberedChip, measure, vectorStrip,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  broke: at('broke the pattern', 6),
  scratch: at('trained that image part from scratch', 6),
  deleted: at('deleted it', 6),
  recipes: at('three recipes', 6),
  data: at('different data', 7),
  lm: at('different language models', 7),
  compute: at('different compute', 7),
  ten: at('ten things change', 7),
  fixed: at('fixed everything', 8),
  one: at('one thing at a time', 8),
  pay: at('worth paying', 9),
  waste: at('waste', 9),
  spend: at('where to spend', 9),
  sees: at('what does a language model see', 10),
  simpler: at('simpler than you think', 10),
  minute: at('about a minute', 11),
  nothing: at('build it from nothing', 11),
  fuzzy: at('feels fuzzy', 12),
  bottom: at('bottom', 12),
};

// ---------------------------------------------------------------- mini recipe card

function miniRecipe(ctx, x, y, kind, accent, a, t, born) {
  if (a <= 0.001) return;
  const w = 500;
  const h = 420;
  ctx.save();
  ctx.globalAlpha = a;

  card(ctx, x, y, w, h, {
    fill: C.surface,
    stroke: kind === 'pretrained' ? 'rgba(139,233,253,0.24)' : kind === 'scratch' ? 'rgba(80,250,123,0.22)' : 'rgba(255,184,108,0.22)',
    r: 22,
    accent,
    accentW: 3,
  });

  const title = kind === 'pretrained' ? 'pretrained encoder' : kind === 'scratch' ? 'from scratch' : 'encoder-free';
  text(ctx, title, x + 40, y + 66, { size: 40, weight: 500 });

  const mx = x + 40;
  const my = y + 178;
  drawPhoto(ctx, mx, my, 110, { radius: 12, grid: kind === 'encoder-free', gridAlpha: 0.55, slice: kind === 'encoder-free' ? 1 : 0 });

  if (kind === 'encoder-free') {
    // patch tiles
    const px = mx + 150;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        card(ctx, px + i * 30, my + 10 + j * 30, 25, 25, { fill: 'rgba(255,184,108,0.2)', stroke: 'rgba(255,184,108,0.55)', r: 3, lw: 1.3 });
      }
    }
    arrow(ctx, mx + 122, my + 55, px - 8, my + 55, { color: C.muted, width: 2.6, head: 10 });
    arrow(ctx, px + 96, my + 55, x + 352, my + 55, { color: C.muted, width: 2.6, head: 10 });
  } else {
    const ex = mx + 152;
    card(ctx, ex, my + 18, 150, 76, { fill: '#2A3B44', stroke: accent, r: 12, lw: 1.7 });
    text(ctx, 'encoder', ex + 75, my + 64, { size: 30, align: 'center', color: accent });
    arrow(ctx, mx + 122, my + 55, ex - 8, my + 55, { color: C.muted, width: 2.6, head: 10 });
    arrow(ctx, ex + 162, my + 55, x + 352, my + 55, { color: C.muted, width: 2.6, head: 10 });
  }

  card(ctx, x + 358, my + 18, 122, 76, { fill: C.surface2, stroke: 'rgba(248,248,242,0.2)', r: 12 });
  text(ctx, 'LM', x + 419, my + 64, { size: 30, align: 'center', color: C.fg });

  if (kind === 'scratch') {
    ctx.save();
    ctx.strokeStyle = 'rgba(80,250,123,0.45)';
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 7]);
    rr(ctx, mx + 146, my + 8, 338, 96, 16);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  const cap = kind === 'pretrained'
    ? 'trained first'
    : kind === 'scratch'
      ? 'learns with the LM'
      : 'no encoder at all';
  text(ctx, cap, x + 40, y + 348, { size: 32, weight: 400, family: F.body, color: C.muted });

  ctx.restore();
}

// ---------------------------------------------------------------- scene: three recipes

const recipes = {
  id: 'recipes',
  title: 'Three recipes',
  start: 43.34,
  end: 59.18,
  draw(ctx, t) {
    const slide = easeInOut(p(t, q.broke - 0.1, 0.9));
    const x1 = lerp(710, 180, slide);

    // The default card starts centered and slides left.
    miniRecipe(ctx, x1, 300, 'pretrained', C.cyan, p(t, 43.34, 0.7), t, q.broke);

    // Two alternatives fade in, first as empty shells, then filled.
    const shell = p(t, q.broke + 0.2, 0.7);
    if (shell > 0) {
      for (let i = 0; i < 2; i++) {
        const cue = i === 0 ? q.scratch : q.deleted;
        const a = shell * p(t, cue - 0.4, 0.7);
        if (a > 0.02) {
          if (i === 0) miniRecipe(ctx, 710, 300, 'scratch', C.green, a, t, q.scratch);
          else miniRecipe(ctx, 1240, 300, 'encoder-free', C.orange, a, t, q.deleted);
        } else {
          const px = i === 0 ? 710 : 1240;
          card(ctx, px, 300, 500, 420, {
            fill: null, stroke: 'rgba(248,248,242,0.14)', r: 22, dash: [9, 11], alpha: shell * (i === 0 ? 0.55 : 0.3),
          });
          text(ctx, String(i + 2), px + 250, 535, {
            size: 86, weight: 500, color: C.dim, align: 'center', alpha: shell * (i === 0 ? 0.25 : 0.14),
          });
        }
      }
    }

    // A quiet ground line ties the three cards together.
    const gl = p(t, q.recipes - 0.3, 0.8);
    if (gl > 0) {
      ctx.save();
      ctx.globalAlpha = 0.5 * gl;
      line(ctx, 190, 790, 1730, 790, { color: C.line, width: 1.5, progress: gl });
      ctx.restore();
    }

    // The three-stories caption.
    const st = enter(t, q.recipes + 0.2, 0.6, 0, 10);
    text(ctx, 'three answers to the same question', W / 2, 856, {
      size: 34, color: C.muted, align: 'center', alpha: st.a,
    });
  },
};

// ---------------------------------------------------------------- scene: confounds -> one variable

const confounds = {
  id: 'confounds',
  title: 'One variable at a time',
  start: 59.18,
  end: 76.52,
  draw(ctx, t) {
    const cols = [
      { x: 600, color: C.cyan, name: 'pretrained', vals: [0.82, 0.32, 0.63] },
      { x: 980, color: C.green, name: 'from scratch', vals: [0.44, 0.68, 0.29] },
      { x: 1360, color: C.orange, name: 'encoder-free', vals: [0.22, 0.54, 0.88] },
    ];
    const rows = ['data', 'language model', 'compute'];
    const lock = easeInOut(p(t, q.fixed - 0.25, 1.0));
    const focus = p(t, q.one - 0.2, 0.7);
    const top = 268;

    // Model headers.
    cols.forEach((c, i) => {
      const a = p(t, 59.18 + i * 0.12, 0.5) * (1 - 0.35 * focus);
      text(ctx, c.name, c.x, 214, { size: 36, color: c.color, align: 'center', alpha: a });
    });

    // Rows of knobs.
    rows.forEach((row, ri) => {
      const y = top + ri * 172;
      const rel = ri === 0 ? q.data : ri === 1 ? q.lm : q.compute;
      const ra = p(t, rel - 0.25, 0.45);
      const rowFocus = t > q.data && t < q.ten + 0.7 && rel === q.data ? 1 : t > q.lm && t < q.ten + 0.7 && rel === q.lm ? 1 : 0;
      text(ctx, row, 430, y + 7, {
        size: 38, weight: 450, color: rowFocus ? C.fg : C.muted, align: 'right', alpha: 0.9,
      });

      cols.forEach((c, ci) => {
        const trkA = p(t, 59.2 + ri * 0.1, 0.5);
        const x0 = c.x - 120;
        const w = 240;
        rr(ctx, x0, y - 4, w, 8, 4);
        ctx.fillStyle = 'rgba(248,248,242,0.08)';
        ctx.globalAlpha = trkA * 0.9;
        ctx.fill();
        ctx.globalAlpha = 1;

        const original = c.vals[ri];
        const locked = 0.5;
        let v = lerp(original, locked, lock);
        let wobble = 0;
        if (t > q.ten - 0.2 && t < q.fixed) {
          wobble = Math.sin(t * 11 + ci * 2.1 + ri) * 0.045 * p(t, q.ten - 0.2, 0.3) * (1 - p(t, q.fixed, 0.4));
        }
        v = clamp(v + wobble);
        const kx = x0 + v * w;
        ctx.save();
        ctx.globalAlpha = trkA;
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.arc(kx, y, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = trkA * 0.25;
        ctx.beginPath();
        ctx.arc(kx, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    });

    // "Everything differs" note.
    const dA = p(t, q.data - 0.2, 0.6) * (1 - p(t, q.fixed, 0.5));
    if (dA > 0) {
      ctx.save();
      ctx.globalAlpha = dA;
      const bx = 470;
      bracket(ctx, bx, 1620, 742, { color: C.red, width: 2, progress: p(t, q.ten - 0.3, 0.7), tick: 12 });
      text(ctx, 'everything differs', 1045, 792, { size: 36, color: C.red, align: 'center' });
      ctx.restore();
    }

    // Locked check.
    const lk = p(t, q.fixed + 0.25, 0.55) * (1 - p(t, q.one + 2.2, 0.5));
    if (lk > 0) {
      ctx.save();
      ctx.globalAlpha = lk;
      const cx = 570;
      card(ctx, cx, 760, 520, 96, { fill: 'rgba(80,250,123,0.08)', stroke: 'rgba(80,250,123,0.3)', r: 16 });
      icon(ctx, 'check', cx + 26, 778, 58, { color: C.green, width: 3.4 });
      text(ctx, 'fixed everything else', cx + 104, 820, { size: 38, color: C.fg });
      ctx.restore();
    }

    // One highlighted variable.
    const oA = p(t, q.one - 0.1, 0.6);
    if (oA > 0) {
      ctx.save();
      ctx.globalAlpha = oA;
      const y = 900;
      text(ctx, 'one thing changed', 520, y + 8, { size: 36, color: C.muted, align: 'right' });
      rr(ctx, 545, y - 5, 660, 10, 5);
      ctx.fillStyle = 'rgba(248,248,242,0.1)';
      ctx.fill();
      const kx = 545 + 0.72 * 660;
      ctx.fillStyle = C.purple;
      ctx.beginPath();
      ctx.arc(kx, y, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = oA * 0.22;
      ctx.beginPath();
      ctx.arc(kx, y, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- scene: promise

const promise = {
  id: 'promise',
  title: 'What you will know',
  start: 76.52,
  end: 84.88,
  draw(ctx, t) {
    const rows = [
      { cue: q.pay, icon: 'tag', color: C.cyan, label: 'worth paying for' },
      { cue: q.waste, icon: 'cross', color: C.red, label: 'waste' },
      { cue: q.spend, icon: 'target', color: C.green, label: 'where to spend' },
    ];
    const ghost = p(t, 76.8, 0.8) * 0.16;
    rows.forEach((r, i) => {
      if (t < r.cue - 0.15) {
        card(ctx, 520, 340 + i * 190, 880, 130, {
          fill: null, stroke: 'rgba(248,248,242,0.32)', r: 16, alpha: ghost, dash: [8, 10],
        });
        icon(ctx, r.icon, 548, 368 + i * 190, 74, { color: r.color, width: 3.2, alpha: ghost * 3 });
        text(ctx, r.label, 660, 418 + i * 190, { size: 50, weight: 450, color: C.fg, alpha: ghost * 2.4 });
      }
    });
    rows.forEach((r, i) => {
      const e = enter(t, r.cue - 0.15, 0.55, 0, 10);
      const y = 340 + i * 190;
      ctx.save();
      ctx.globalAlpha = e.a;
      card(ctx, 520, y, 880, 130, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 16 });
      icon(ctx, r.icon, 548, y + 28, 74, { color: r.color, width: 3.2, alpha: 0.9 });
      text(ctx, r.label, 660, y + 78, { size: 50, weight: 450, color: C.fg });
      text(ctx, '?', 1335, y + 84, { size: 58, weight: 450, color: r.color, align: 'center', alpha: 0.9 });
      ctx.restore();
    });

    const end = enter(t, 83.9, 0.6, 0, 8);
    text(ctx, 'three answers, one paper', W / 2, 930, {
      size: 34, color: C.muted, align: 'center', alpha: end.a,
    });
  },
};

// ---------------------------------------------------------------- scene: start at the bottom

const bottom = {
  id: 'bottom',
  title: 'Start at the bottom',
  start: 84.88,
  end: 109.48,
  draw(ctx, t) {
    const reveal = p(t, q.simpler - 0.2, 0.9);
    const photoA = p(t, 85.0, 0.8) * (1 - 0.45 * reveal);
    drawPhoto(ctx, 250, 340, 320, { alpha: photoA, radius: 18 });
    text(ctx, 'a picture', 410, 706, { size: 36, color: C.muted, align: 'center', alpha: photoA });

    // The model's world.
    const ma = p(t, 85.4, 0.8);
    card(ctx, 650, 320, 1070, 400, {
      fill: C.surface,
      stroke: reveal > 0 ? 'rgba(189,147,249,0.42)' : 'rgba(248,248,242,0.16)',
      r: 24, alpha: ma,
    });
    text(ctx, 'language model', 692, 382, { size: 36, color: C.muted, alpha: ma * (0.9 - 0.5 * reveal) });
    text(ctx, '?', 1185, 565, { size: 108, weight: 500, color: C.purple, align: 'center', alpha: ma * (1 - reveal) });

    arrow(ctx, 528, 500, 640, 500, { color: C.muted, width: 3, progress: p(t, 85.8, 0.6), head: 13, alpha: ma });

    if (reveal > 0) {
      const n = 14;
      const w = 26;
      const gap = 12;
      const x0 = 1185 - (n * w + (n - 1) * gap) / 2;
      for (let i = 0; i < n; i++) {
        const a = reveal * p(t, q.simpler + i * 0.055, 0.35);
        vectorStrip(ctx, x0 + i * (w + gap), 468, w, 118, {
          color: C.purple, accent: C.cyan, alpha: a * 0.95, seed: i * 5 + 3,
        });
      }
      text(ctx, 'a line of vectors', 1185, 642, { size: 32, color: C.muted, align: 'center', alpha: reveal });
    }

    // One minute.
    const minA = p(t, q.minute - 0.2, 0.5) * (1 - p(t, q.fuzzy, 0.5));
    if (minA > 0) {
      pill(ctx, 1185, 770, 'about a minute', { size: 30, color: C.cyan, bg: 'rgba(139,233,253,0.1)', padX: 16, padY: 8, alpha: minA, align: 'center' });
    }

    // Baseline for "start at the bottom".
    const base = p(t, q.bottom - 0.4, 0.8);
    if (base > 0) {
      line(ctx, 560, 860, 1500, 860, { color: C.lineStrong, width: 2.5, progress: base });
      text(ctx, 'start here', 1030, 900, { size: 30, color: C.muted, align: 'center', alpha: base });
    }
  },
};

export default [recipes, confounds, promise, bottom];
