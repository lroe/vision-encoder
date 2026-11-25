import {
  W, H, C, F, text, card, pill, icon, p, enter, line, arrow, bracket, underline,
  drawPhoto, drawPatchNumbers, count, rr, clamp, lerp, easeInOut, vectorStrip, vectorRow,
  measure, pathLen, strokePath, easeOutCubic,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  readWords: at('read words', 13),
  lineVec: at('line of vectors', 13),
  list: at('list of numbers', 13),
  cut: at('cut into tokens', 13),
  becomes: at('token becomes one', 13),
  lineVec2: at('line of vectors', 13, 2),
  turn: at('turn a picture', 14),
  same: at('same kind of line', 14),

  pixels: at('grid of pixels', 15),
  three: at('three numbers', 15),
  rgb: at('red green blue', 15),
  fifty: at('fifty thousand', 15),
  oneByOne: at('one by one', 15),
  book: at('long book', 16),
  pages: at('cut it into pages', 16),

  fourteen: at('fourteen pixels', 17),
  across: at('sixteen squares across', 17),
  twofifty: at('two hundred fifty six', 17),
  fiveeighty: at('five hundred eighty eight', 18),

  multiply: at('one simple multiplication', 19),
  textvec: at('same size as a text vector', 19),
  tokens256: at('two hundred fifty six image tokens', 19),
  front: at('in front of the text', 19),
  vlm: at('vision language model', 20),
  whole: at('the whole thing', 20),

  patches: at('call those squares patches', 21),
  embedding: at('patch embedding', 21),
  encoderFree: at('encoder free', 21),
  fuyu: at('fuyu', 21),
};

// ---------------------------------------------------------------- tokens

const TOKENS = ['a', 'bicycle', 'at', 'dusk'];

function tokenPill(ctx, cx, y, word, color, a, t, born) {
  if (a <= 0.001) return;
  const size = 36;
  const w = measure(ctx, word, size, 500, F.display, 0.2) + 42;
  const h = 60;
  ctx.save();
  ctx.globalAlpha = a;
  card(ctx, cx - w / 2, y - h / 2, w, h, {
    fill: 'rgba(139,233,253,0.08)', stroke: 'rgba(139,233,253,0.32)', r: 12,
  });
  text(ctx, word, cx, y + 1, { size, weight: 450, color, align: 'center', baseline: 'middle' });
  ctx.restore();
}

const tokensScene = {
  id: 'tokens',
  title: 'Tokens and vectors',
  start: 109.48,
  end: 127.7,
  draw(ctx, t) {
    const sentenceA = p(t, 109.6, 0.9) * (1 - p(t, q.cut - 0.2, 0.6));
    const strike = p(t, q.readWords - 0.1, 0.5);
    const zoomShift = easeInOut(p(t, q.list - 0.2, 0.6)) * (1 - p(t, q.cut, 0.5));
    const zoomBase = lerp(602, 360, zoomShift);
    const stripBaseX = lerp(zoomBase, 830, easeInOut(p(t, q.turn - 0.4, 0.9)));
    const stripY = 570;
    const stripW = 86;
    const stripH = 230;
    const gap = 124;
    const zoom = p(t, q.list - 0.15, 0.7) * (1 - p(t, q.cut - 0.1, 0.5));
    const link = p(t, q.cut + 0.2, 0.7);

    // Sentence.
    if (sentenceA > 0) {
      text(ctx, 'a bicycle at dusk', W / 2, 330, {
        size: 80, weight: 450, align: 'center', alpha: sentenceA, color: C.fg, ls: -1,
      });
      if (strike > 0) {
        ctx.save();
        ctx.globalAlpha = sentenceA * 0.9;
        line(ctx, 660, 318, 1260, 318, { color: C.red, width: 4, progress: strike, rough: 0.8 });
        text(ctx, 'not words', W / 2, 388, { size: 32, color: C.red, align: 'center', alpha: strike * 0.9 });
        ctx.restore();
      }
    }

    // Token pills above the vectors.
    const tokenA = p(t, q.cut - 0.1, 0.65) * (1 - p(t, q.turn + 0.3, 0.5));
    TOKENS.forEach((word, i) => {
      const cx = stripBaseX + i * (stripW + gap) + stripW / 2;
      const pa = tokenA * p(t, q.cut + i * 0.08, 0.4);
      tokenPill(ctx, cx, 470, word, C.cyan, pa, t, q.cut);
      if (link > 0 && t < q.turn) {
        arrow(ctx, cx, 502, cx, stripY - 8, {
          color: C.faint, width: 1.8, progress: p(t, q.cut + 0.5 + i * 0.06, 0.45), head: 8,
          alpha: tokenA * 0.9 * (1 - p(t, q.turn, 0.5)),
        });
      }
    });

    // Vector strips.
    TOKENS.forEach((word, i) => {
      const a = p(t, q.lineVec - 0.1 + i * 0.09, 0.65);
      vectorStrip(ctx, stripBaseX + i * (stripW + gap), stripY, stripW, stripH, {
        color: C.cyan, accent: C.fg, alpha: a, seed: i * 9 + 4, cells: 9,
      });
    });

    // Line label.
    const lineA = p(t, q.lineVec2 - 0.2, 0.6);
    if (lineA > 0 && t < q.turn + 0.4) {
      const x1 = stripBaseX;
      const x2 = stripBaseX + 3 * (stripW + gap) + stripW;
      bracket(ctx, x1, x2, stripY + stripH + 32, { color: C.muted, progress: lineA, width: 1.8 });
      text(ctx, 'a line of vectors', (x1 + x2) / 2, stripY + stripH + 82, {
        size: 34, color: C.muted, align: 'center', alpha: lineA,
      });
    }

    // Zoom panel: one vector as a list of numbers.
    if (zoom > 0) {
      const px = 1240;
      const py = 340;
      const pw = 500;
      const ph = 440;
      const slide = (1 - easeOutCubic(clamp((t - (q.list - 0.15)) / 0.7))) * 26;
      ctx.save();
      ctx.globalAlpha = zoom;
      ctx.translate(slide, 0);
      card(ctx, px, py, pw, ph, { fill: '#20222E', stroke: 'rgba(139,233,253,0.28)', r: 18 });
      text(ctx, 'one vector', px + 34, py + 58, { size: 34, color: C.cyan });
      vectorStrip(ctx, px + 34, py + 96, 70, 260, { color: C.cyan, accent: C.fg, seed: 4, cells: 9 });
      const vals = ['+0.24', '-1.31', '+0.87', '+0.09', '-0.62', '+1.44', '-0.18', '+0.33'];
      vals.forEach((v, i) => {
        const a = p(t, q.list + 0.1 + i * 0.04, 0.3);
        text(ctx, v, px + 146, py + 132 + i * 30, {
          size: 30, family: F.body, weight: 450, color: i % 2 ? C.fg : C.muted, alpha: a,
        });
      });
      text(ctx, 'a list of numbers', px + 34, py + 400, { size: 32, color: C.muted });
      ctx.restore();
    }

    // Turn a picture into this line.
    const turnA = p(t, q.turn - 0.2, 0.8);
    if (turnA > 0) {
      const pa = p(t, q.turn, 0.8);
      drawPhoto(ctx, 150, 400, 300, { alpha: pa, radius: 16 });
      text(ctx, 'a picture', 300, 746, { size: 32, color: C.muted, align: 'center', alpha: pa });

      // Move the line label out of the way.
      text(ctx, 'this line?', stripBaseX + 360, 866, {
        size: 36, color: C.yellow, align: 'center', alpha: turnA,
      });
      arrow(ctx, 468, 548, 790, 548, {
        color: C.muted, width: 3, progress: p(t, q.turn + 0.2, 0.6), head: 13, alpha: turnA,
      });
      text(ctx, '?', 650, 528, {
        size: 78, weight: 450, color: C.yellow, align: 'center', alpha: turnA,
      });
    }
  },
};

// ---------------------------------------------------------------- pixels

const pixelPalette = ['#4a2d50', '#5c3558', '#8a4a58', '#c66a55', '#d97a4f', '#f1fa8c', '#33273f', '#3b2b46'];
function pixelColor(i, j) {
  // A tiny sunset scene: sky at top, sun, hills, dark ground.
  const cx = Math.abs(i - 3.4) + Math.abs(j - 2.2);
  if (cx < 1.3) return '#f1fa8c';
  if (j < 2) return i % 2 ? '#4a2d50' : '#573257';
  if (j < 4) return i % 3 ? '#8a4a58' : '#a5545b';
  if (j === 4) return i % 2 ? '#33273f' : '#3d2b42';
  return '#2b2132';
}

const pixelsScene = {
  id: 'pixels',
  title: 'Pixels',
  start: 127.7,
  end: 143.1,
  draw(ctx, t) {
    const photoA = p(t, 127.8, 0.9);
    drawPhoto(ctx, 180, 260, 520, { alpha: photoA, radius: 18 });

    // Zoom panel.
    const zoomA = p(t, q.pixels + 0.1, 0.7) * (1 - p(t, q.fifty - 0.1, 0.6));
    if (zoomA > 0) {
      const px = 860;
      const py = 270;
      const pw = 780;
      const ph = 470;
      const n = 6;
      const cell = 66;
      ctx.save();
      ctx.globalAlpha = zoomA;
      card(ctx, px, py, pw, ph, { fill: C.well, stroke: 'rgba(248,248,242,0.18)', r: 20 });
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          ctx.fillStyle = pixelColor(i, j);
          ctx.fillRect(px + 34 + i * cell, py + 34 + j * cell, cell - 2, cell - 2);
        }
      }
      // Highlight one pixel.
      ctx.strokeStyle = C.yellow;
      ctx.lineWidth = 3;
      ctx.strokeRect(px + 34 + 3 * cell - 2, py + 34 + 2 * cell - 2, cell + 2, cell + 2);

      // Channel values.
      const chx = px + 470;
      const chy = py + 66;
      text(ctx, 'one pixel', chx, chy - 10, { size: 32, color: C.muted });
      const chans = [
        ['R', '241', '#ff5555'],
        ['G', '250', '#50fa7b'],
        ['B', '140', '#8be9fd'],
      ];
      chans.forEach((c, i) => {
        const a = p(t, q.rgb - 0.1 + i * 0.1, 0.4);
        const yy = chy + 48 + i * 92;
        ctx.save();
        ctx.globalAlpha = zoomA * a;
        ctx.fillStyle = c[2];
        rr(ctx, chx, yy - 32, 40, 40, 6);
        ctx.fill();
        text(ctx, c[0], chx + 58, yy + 2, { size: 34, color: C.muted });
        text(ctx, c[1], chx + 108, yy + 2, { size: 38, weight: 500 });
        ctx.restore();
      });
      text(ctx, 'three numbers per pixel', px + 34, py + ph - 24, {
        size: 34, color: C.muted, alpha: p(t, q.three - 0.3, 0.5) * (1 - p(t, q.fifty, 0.5)),
      });
      ctx.restore();
    }

    // Fifty thousand pixels.
    const countA = p(t, q.fifty - 0.2, 0.7) * (1 - p(t, q.pages - 0.1, 0.5));
    if (countA > 0) {
      const target = 224 * 224;
      const v = Math.round(target * p(t, q.fifty, 1.2));
      text(ctx, v.toLocaleString('en-US'), 1160, 640, {
        size: 156, weight: 500, align: 'center', alpha: countA, ls: -6,
      });
      text(ctx, 'pixels', 1160, 704, { size: 44, color: C.muted, align: 'center', alpha: countA });
      text(ctx, '224 × 224', 1160, 764, { size: 34, color: C.cyan, align: 'center', alpha: countA * p(t, q.fifty + 0.2, 0.5) });
      const cross = p(t, q.oneByOne - 0.1, 0.5);
      if (cross > 0) {
        text(ctx, 'too many to feed one by one', 1160, 828, { size: 36, color: C.red, align: 'center', alpha: countA * cross });
      }
      // Dense pixel grid on the photo.
      ctx.save();
      ctx.globalAlpha = countA * 0.3;
      const n = 44;
      const cell = 520 / n;
      ctx.strokeStyle = C.fg;
      ctx.lineWidth = 1;
      for (let i = 1; i < n; i++) {
        ctx.beginPath(); ctx.moveTo(180 + i * cell, 260); ctx.lineTo(180 + i * cell, 780); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(180, 260 + i * cell); ctx.lineTo(700, 260 + i * cell); ctx.stroke();
      }
      ctx.restore();
    }

    // The book / pages.
    const pageA = p(t, q.book - 0.2, 0.6);
    if (pageA > 0) {
      const pa = p(t, q.pages, 0.8);
      ctx.save();
      ctx.globalAlpha = pageA * pa;
      // 4x4 pages
      const cell = 520 / 4;
      ctx.strokeStyle = C.bg;
      ctx.lineWidth = 10;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(180 + i * cell, 260); ctx.lineTo(180 + i * cell, 780); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(180, 260 + i * cell); ctx.lineTo(700, 260 + i * cell); ctx.stroke();
      }
      ctx.restore();
      text(ctx, 'cut it into pages', 440, 862, { size: 38, color: C.fg, align: 'center', alpha: pageA * p(t, q.pages + 0.2, 0.5) });
    }
  },
};

// ---------------------------------------------------------------- patches

const patchesScene = {
  id: 'patches',
  title: 'Patches',
  start: 143.1,
  end: 157.46,
  draw(ctx, t) {
    const photoA = p(t, 143.2, 0.8);
    const slice = p(t, 143.6, 1.1);
    const zoomA = p(t, 150.9, 0.9);
    drawPhoto(ctx, 150, 250, 520, {
      alpha: photoA, radius: 16, grid: true, gridAlpha: 0.32, slice,
      highlight: [9, 7],
    });

    // 16 x 16 brackets.
    const bA = p(t, q.across - 0.3, 0.6);
    if (bA > 0) {
      bracket(ctx, 150, 670, 812, { color: C.muted, progress: bA, width: 1.6 });
      text(ctx, '16 across · 16 down', 410, 858, { size: 32, color: C.muted, align: 'center', alpha: bA });
    }

    // Count 256.
    const countA = p(t, q.twofifty - 0.2, 0.7);
    if (countA > 0) {
      text(ctx, '256', 1470, 380, { size: 124, weight: 500, color: C.fg, alpha: countA, ls: -4 });
      text(ctx, 'squares', 1470, 430, { size: 38, color: C.muted, alpha: countA });
    }

    // 14 px patch marker.
    const mA = p(t, q.fourteen - 0.1, 0.6) * (1 - p(t, q.fiveeighty - 1.5, 0.5));
    if (mA > 0) {
      const cell = 520 / 16;
      const px = 150 + 9 * cell;
      const py = 250 + 7 * cell;
      ctx.save();
      ctx.globalAlpha = mA;
      ctx.strokeStyle = C.purple;
      ctx.lineWidth = 3;
      ctx.strokeRect(px, py, cell, cell);
      // dimension ticks
      ctx.strokeStyle = C.muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, py - 18); ctx.lineTo(px + cell, py - 18);
      ctx.moveTo(px, py - 24); ctx.lineTo(px, py - 12);
      ctx.moveTo(px + cell, py - 24); ctx.lineTo(px + cell, py - 12);
      ctx.stroke();
      text(ctx, '14 px', px + cell / 2, py - 32, { size: 26, color: C.muted, align: 'center' });
      ctx.restore();
    }

    // Zoomed patch panel.
    if (zoomA > 0) {
      const px = 880;
      const py = 230;
      const pw = 500;
      const ph = 500;
      ctx.save();
      ctx.globalAlpha = zoomA;
      // card backing
      card(ctx, px, py, pw, ph, { fill: C.well, stroke: 'rgba(189,147,249,0.3)', r: 18 });
      // clipped zoom of the photo patch
      ctx.save();
      rr(ctx, px, py, pw, ph, 18);
      ctx.clip();
      const zoom = 14;
      const photoSize = 520;
      const cellPhoto = photoSize / 16;
      const patchX = 150 + 9 * cellPhoto;
      const patchY = 250 + 7 * cellPhoto;
      drawPhoto(ctx, px - (patchX - 150) * zoom, py - (patchY - 250) * zoom, photoSize * zoom, { radius: 0 });
      // 14x14 grid overlay
      const n = 14;
      const c = pw / n;
      ctx.strokeStyle = 'rgba(40,42,54,0.65)';
      ctx.lineWidth = 2;
      for (let i = 1; i < n; i++) {
        ctx.beginPath(); ctx.moveTo(px + i * c, py); ctx.lineTo(px + i * c, py + ph); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px, py + i * c); ctx.lineTo(px + pw, py + i * c); ctx.stroke();
      }
      ctx.restore();

      text(ctx, 'one patch', px, py + ph + 48, { size: 34, color: C.muted });
      ctx.restore();
    }

    // Big 588 count, right margin.
    const bigA = p(t, q.fiveeighty - 0.1, 0.6) * (1 - p(t, 157.3, 0.5));
    if (bigA > 0) {
      text(ctx, '588', 1470, 660, { size: 132, weight: 500, color: C.purple, alpha: bigA, ls: -4 });
      text(ctx, 'numbers per patch', 1470, 710, { size: 34, color: C.muted, alpha: bigA });
      text(ctx, '14 × 14 × 3', 1470, 764, { size: 30, color: C.fg, alpha: bigA * 0.8 });
    }
  },
};

// ---------------------------------------------------------------- embedding

const embedScene = {
  id: 'embedding',
  title: 'One multiply',
  start: 157.46,
  end: 167.34,
  draw(ctx, t) {
    const mA = p(t, 157.6, 0.8);
    const mul = p(t, q.multiply - 0.2, 0.7);
    const vec = p(t, q.textvec - 0.1, 0.7);
    const grid = p(t, 162.4, 0.7);

    // Patch card: the front-wheel patch, zoomed.
    const cardX = 200;
    const cardY = 300;
    const cardS = 300;
    card(ctx, cardX, cardY, cardS, cardS, { fill: C.well, stroke: 'rgba(189,147,249,0.3)', r: 16, alpha: mA });
    ctx.save();
    ctx.globalAlpha = mA;
    rr(ctx, cardX, cardY, cardS, cardS, 16);
    ctx.clip();
    const photoSize = 520;
    const cellPhoto = photoSize / 16;
    const patchX = 150 + 9 * cellPhoto;
    const patchY = 250 + 7 * cellPhoto;
    const z = cardS / cellPhoto;
    drawPhoto(ctx, cardX - (patchX - 150) * z, cardY - (patchY - 250) * z, photoSize * z, { radius: 0 });
    ctx.strokeStyle = 'rgba(40,42,54,0.55)';
    ctx.lineWidth = 1.6;
    for (let i = 1; i < 14; i++) {
      ctx.beginPath(); ctx.moveTo(cardX + i * cardS / 14, cardY); ctx.lineTo(cardX + i * cardS / 14, cardY + cardS); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cardX, cardY + i * cardS / 14); ctx.lineTo(cardX + cardS, cardY + i * cardS / 14); ctx.stroke();
    }
    ctx.restore();
    text(ctx, 'one patch', cardX + cardS / 2, 650, { size: 34, color: C.muted, align: 'center', alpha: mA });
    text(ctx, '588 numbers', cardX + cardS / 2, 688, { size: 28, color: C.dim, align: 'center', alpha: mA });

    // Matrix.
    if (mul > 0) {
      const mx = 600;
      const my = 330;
      const mw = 340;
      const mh = 260;
      ctx.save();
      ctx.globalAlpha = mul;
      card(ctx, mx, my, mw, mh, { fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 18 });
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 5; j++) {
          ctx.fillStyle = (i + j) % 3 === 0 ? C.cyan : 'rgba(248,248,242,0.32)';
          ctx.beginPath();
          ctx.arc(mx + 48 + i * 41, my + 55 + j * 35, 5.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      text(ctx, 'one matrix multiply', mx + mw / 2, my + mh + 58, { size: 34, color: C.fg, align: 'center' });
      ctx.restore();
      arrow(ctx, cardX + cardS + 12, 450, mx - 10, 450, {
        color: C.muted, width: 3, progress: p(t, q.multiply - 0.1, 0.5), head: 12, alpha: mul,
      });

      // Vector output.
      if (vec > 0) {
        const vx = 1040;
        ctx.save();
        ctx.globalAlpha = vec;
        card(ctx, vx, 300, 280, 300, { fill: C.surface, stroke: 'rgba(139,233,253,0.3)', r: 18 });
        vectorStrip(ctx, vx + 90, 330, 80, 240, { color: C.cyan, accent: C.fg, seed: 4, cells: 9 });
        text(ctx, 'a vector', vx + 140, 650, { size: 34, color: C.muted, align: 'center' });
        ctx.restore();
        arrow(ctx, 950, 450, vx - 10, 450, {
          color: C.muted, width: 3, progress: p(t, q.textvec - 0.3, 0.5), head: 12, alpha: vec,
        });
      }
    }

    // 256 token grid.
    if (grid > 0) {
      const gx = 1380;
      const gy = 280;
      const n = 16;
      const cell = 20;
      const gap = 4;
      ctx.save();
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          const idx = j * n + i;
          const a = grid * p(t, 162.4 + idx * 0.004, 0.3);
          if (a <= 0) continue;
          ctx.globalAlpha = a * 0.9;
          ctx.fillStyle = (idx * 7) % 11 === 0 ? C.cyan : (idx * 3) % 7 === 0 ? C.purple : '#6E5B8A';
          rr(ctx, gx + i * (cell + gap), gy + j * (cell + gap), cell, cell, 2.5);
          ctx.fill();
        }
      }
      ctx.restore();
      text(ctx, '256 image tokens', gx + 190, 720, { size: 34, color: C.muted, align: 'center', alpha: grid });
      arrow(ctx, 1330, 450, gx - 12, 450, {
        color: C.muted, width: 2.6, progress: p(t, 163.5, 0.4), head: 11, alpha: grid * 0.9,
      });
      text(ctx, '× 256', 1355, 420, { size: 30, color: C.dim, align: 'center', alpha: grid });
    }
  },
};

// ---------------------------------------------------------------- VLM + terms

const vlmScene = {
  id: 'vlm',
  title: 'A vision-language model',
  start: 167.34,
  end: 173.78,
  draw(ctx, t) {
    const build = p(t, 167.4, 1.0);
    const vlm = p(t, q.vlm - 0.2, 0.7);

    // Image token grid.
    const gx = 260;
    const gy = 300;
    const n = 16;
    const cell = 20;
    const gap = 4;
    ctx.save();
    ctx.globalAlpha = build;
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const idx = j * n + i;
        const a = p(t, 167.4 + idx * 0.0025, 0.3);
        ctx.globalAlpha = a * 0.9;
        ctx.fillStyle = (idx * 7) % 11 === 0 ? C.cyan : (idx * 3) % 7 === 0 ? C.purple : '#6E5B8A';
        rr(ctx, gx + i * (cell + gap), gy + j * (cell + gap), cell, cell, 2.5);
        ctx.fill();
      }
    }
    ctx.restore();
    text(ctx, '256 image tokens', gx + 192, 710, { size: 32, color: C.muted, align: 'center', alpha: build });

    // Text tokens.
    const tx = 760;
    const ty = 430;
    for (let i = 0; i < 4; i++) {
      const a = build * p(t, 167.4 + 0.25 + i * 0.08, 0.4);
      vectorStrip(ctx, tx + i * 58, ty - 80, 38, 160, { color: C.cyan, accent: C.fg, alpha: a, seed: i * 5 + 2, cells: 8 });
    }
    text(ctx, 'text tokens', tx + 116, 590, { size: 32, color: C.muted, align: 'center', alpha: build });

    // LM box.
    const lm = 1110;
    card(ctx, lm, 340, 360, 300, { fill: C.surface, stroke: 'rgba(189,147,249,0.32)', r: 20, alpha: build });
    icon(ctx, 'layers', lm + 120, 380, 110, { color: C.purple, width: 2.8, alpha: build });
    text(ctx, 'language model', lm + 180, 540, { size: 34, align: 'center', alpha: build });
    text(ctx, 'reads them like words', lm + 180, 582, { size: 28, color: C.muted, align: 'center', alpha: build });

    arrow(ctx, 660, 520, 730, 520, { color: C.muted, width: 2.6, progress: p(t, 167.8, 0.5), head: 11, alpha: build });
    arrow(ctx, 950, 520, 1090, 520, { color: C.muted, width: 2.6, progress: p(t, 168.1, 0.5), head: 11, alpha: build });

    // VLM bracket.
    if (vlm > 0) {
      ctx.save();
      ctx.globalAlpha = vlm;
      bracket(ctx, 260, 1470, 780, { color: C.purple, width: 2, progress: p(t, q.vlm - 0.1, 0.7), tick: 12 });
      text(ctx, 'a vision-language model', 865, 838, { size: 42, color: C.fg, align: 'center' });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- terms recap

const termsScene = {
  id: 'terms',
  title: 'Patches, embeddings, encoder-free',
  start: 173.78,
  end: 185.74,
  draw(ctx, t) {
    const build = p(t, 173.9, 0.8);
    const t1 = p(t, q.patches - 0.1, 0.5);
    const t2 = p(t, q.embedding - 0.15, 0.5);
    const t3 = p(t, q.encoderFree - 0.1, 0.6);
    const fuyu = p(t, q.fuyu + 0.1, 0.6);

    ctx.save();
    ctx.globalAlpha = build;

    // Photo.
    drawPhoto(ctx, 120, 300, 280, { radius: 14, grid: true, gridAlpha: 0.45, slice: 0.6 });
    text(ctx, 'patches', 260, 632, { size: 34, color: t1 > 0 ? C.purple : C.muted, align: 'center', alpha: t1 });
    text(ctx, '14 × 14 pixels', 260, 668, { size: 30, color: C.dim, align: 'center', alpha: t1 * 0.9 });

    // Matrix multiply.
    card(ctx, 500, 330, 260, 230, { fill: C.surface, stroke: 'rgba(139,233,253,0.28)', r: 16 });
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        ctx.fillStyle = (i + j) % 3 === 0 ? C.cyan : 'rgba(248,248,242,0.3)';
        ctx.beginPath();
        ctx.arc(548 + i * 33, 378 + j * 33, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    text(ctx, '×', 738, 452, { size: 42, color: C.cyan, align: 'center' });
    text(ctx, 'patch embedding', 630, 632, { size: 34, color: t2 > 0 ? C.cyan : C.muted, align: 'center', alpha: t2 });
    text(ctx, 'one multiply', 630, 668, { size: 30, color: C.dim, align: 'center', alpha: t2 * 0.9 });

    arrow(ctx, 410, 450, 490, 450, { color: C.muted, width: 2.6, progress: p(t, 174.2, 0.5), head: 10, alpha: build });
    arrow(ctx, 770, 450, 810, 450, { color: C.muted, width: 2.6, progress: p(t, 174.5, 0.5), head: 10, alpha: build });

    // Token grid.
    const gx = 820;
    const gy = 300;
    const n = 16;
    const cell = 15;
    const gap = 3;
    ctx.save();
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const idx = j * n + i;
        const a = build * p(t, 174.0 + idx * 0.002, 0.3);
        ctx.globalAlpha = a * 0.9;
        ctx.fillStyle = (idx * 7) % 11 === 0 ? C.cyan : (idx * 3) % 7 === 0 ? C.purple : '#6E5B8A';
        rr(ctx, gx + i * (cell + gap), gy + j * (cell + gap), cell, cell, 2);
        ctx.fill();
      }
    }
    ctx.restore();
    text(ctx, '256 tokens', gx + 143, 632, { size: 34, color: C.purple, align: 'center', alpha: build });
    text(ctx, 'one per patch', gx + 143, 668, { size: 30, color: C.dim, align: 'center', alpha: build * 0.9 });

    arrow(ctx, 1120, 450, 1200, 450, { color: C.muted, width: 2.6, progress: p(t, 174.8, 0.5), head: 10, alpha: build });

    // LM box.
    card(ctx, 1220, 320, 340, 260, { fill: C.surface, stroke: 'rgba(189,147,249,0.3)', r: 18 });
    icon(ctx, 'layers', 1310, 356, 90, { color: C.purple, width: 2.8, alpha: build });
    text(ctx, 'language model', 1390, 508, { size: 34, align: 'center', alpha: build });
    text(ctx, 'reads tokens', 1390, 548, { size: 26, color: C.muted, align: 'center', alpha: build });

    ctx.restore();

    // Encoder-free callout.
    if (t3 > 0) {
      ctx.save();
      ctx.globalAlpha = t3;
      text(ctx, 'encoder-free', 700, 772, { size: 60, weight: 500, color: C.orange });
      text(ctx, 'nothing sits in front of the language model', 700, 818, { size: 30, color: C.muted });
      ctx.restore();
    }

    // Fuyu card.
    if (fuyu > 0) {
      ctx.save();
      ctx.globalAlpha = fuyu;
      card(ctx, 1400, 762, 460, 138, { fill: C.surface2, stroke: 'rgba(248,248,242,0.14)', r: 14 });
      text(ctx, 'Fuyu', 1430, 816, { size: 38, weight: 600, color: C.orange });
      text(ctx, 'Adept · 2023', 1430, 856, { size: 26, color: C.muted });
      text(ctx, 'built this way', 1700, 822, { size: 30, color: C.fg, align: 'center' });
      ctx.restore();
    }
  },
};

export default [tokensScene, pixelsScene, patchesScene, embedScene, vlmScene, termsScene];
