import {
  W, H, C, F, text, wrap, paragraph, card, pill, icon, p, pe, enter, away, line, arrow,
  bracket, leader, underline, drawPhoto, count, rr, clamp, lerp, easeInOut, easeOutCubic,
  numberedChip, pill as pillFn,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  see: at('can see', 1),
  stop: at('stop paying', 1),
  called: at('called the vision encoder', 2),
  siglip: at('siglip two', 2),
  pairs: at('forty billion', 2),
  ten: at('ten trillion', 2),
  models: at('two hundred models', 3),
  sameData: at('same data', 3),
  sameBudget: at('same budget', 3),
  tests: at('three simple tests', 4),
  want: at('say you want to build', 5),
  everyone: at('almost everyone', 5),
  network: at('image network', 5),
  bolt: at('bolt it onto a language model', 5),
  together: at('train the two together', 5),
  defaulted: at('the default', 5),
};

// ---------------------------------------------------------------- hook

const hook = {
  id: 'hook',
  title: 'A part that can see',
  start: 0,
  end: 27.0,
  draw(ctx, t) {
    const drift = Math.sin(t * 0.22) * 5;
    ctx.save();
    ctx.translate(0, drift);

    // Photo: a slow camera push-in from the first frame, then it slides
    // left as the vision module appears.
    const move = easeInOut(clamp((t - (q.called - 0.25)) / 1.1));
    const baseS = lerp(620, 400, move);
    const cam = 1 + 0.055 * easeOutCubic(clamp(t / 6.2));
    const photoS = baseS * cam;
    const centerX = lerp(960, 350, move);
    const centerY = lerp(540, 480, move);
    const photoX = centerX - photoS / 2;
    const photoY = centerY - photoS / 2;
    const photoA = (1 - 0.55 * p(t, q.ten - 0.2, 1.0)) * (1 - p(t, q.models - 0.15, 0.75));
    drawPhoto(ctx, photoX, photoY, photoS, {
      alpha: photoA,
      grid: true,
      gridAlpha: 0.24 * p(t, 2.7, 1.0),
      slice: p(t, 3.1, 1.2),
      highlight: t > 2.6 ? [10, 9] : null,
      dim: 0.12 * p(t, q.ten, 1.0),
    });

    // Autofocus brackets: the camera looks, then locks onto one patch
    // exactly as the narration says "can see".
    const focusA = p(t, 0.08, 0.42) * (1 - p(t, 3.3, 0.4));
    if (focusA > 0.001) {
      const cell = photoS / 16;
      const patchX = photoX + 10 * cell;
      const patchY = photoY + 9 * cell;
      const lock = easeInOut(p(t, 2.48, 0.42));
      const pad = 18;
      const x0 = lerp(photoX + pad, patchX - 4, lock);
      const y0 = lerp(photoY + pad, patchY - 4, lock);
      const x1 = lerp(photoX + photoS - pad, patchX + cell + 4, lock);
      const y1 = lerp(photoY + photoS - pad, patchY + cell + 4, lock);
      const L = lerp(30, 11, lock);
      const pulse = 0.82 + 0.18 * Math.sin(t * 4.2);
      ctx.save();
      ctx.globalAlpha = focusA * pulse;
      ctx.strokeStyle = 'rgba(139,233,253,0.72)';
      ctx.lineWidth = 2.5;
      const corners = [
        [x0, y0, 1, 1], [x1, y0, -1, 1],
        [x0, y1, 1, -1], [x1, y1, -1, -1],
      ];
      for (const [x, y, sx, sy] of corners) {
        ctx.beginPath();
        ctx.moveTo(x, y + sy * L);
        ctx.lineTo(x, y);
        ctx.lineTo(x + sx * L, y);
        ctx.stroke();
      }
      // Lock dot at the centre of the target.
      if (lock > 0.65) {
        ctx.globalAlpha = focusA * ((lock - 0.65) / 0.35) * 0.5;
        ctx.fillStyle = C.cyan;
        ctx.beginPath();
        ctx.arc((x0 + x1) / 2, (y0 + y1) / 2, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // A single quiet scan line, clipped to the photo.
    if (t > 0.7 && t < 1.95) {
      const q = easeInOut(clamp((t - 0.7) / 1.25));
      const sy = photoY + photoS * (0.2 + 0.62 * q);
      ctx.save();
      rr(ctx, photoX, photoY, photoS, photoS, 18);
      ctx.clip();
      line(ctx, photoX + 28, sy, photoX + photoS - 28, sy, {
        color: 'rgba(139,233,253,0.22)', width: 1.6, rough: 0,
        alpha: Math.sin(Math.PI * clamp((t - 0.7) / 1.25)),
      });
      ctx.restore();
    }

    // Patch marker.
    if (t > 2.6 && t < q.ten) {
      const cell = photoS / 16;
      const px = photoX + 10 * cell;
      const py = photoY + 9 * cell;
      const ring = 0.55 + 0.45 * Math.sin(t * 3.1);
      ctx.save();
      ctx.globalAlpha = p(t, 2.7, 0.5) * (1 - p(t, q.called, 0.3));
      ctx.strokeStyle = C.cyan;
      ctx.lineWidth = 3;
      ctx.strokeRect(px - 2, py - 2, cell + 4, cell + 4);
      ctx.globalAlpha *= ring * 0.35;
      ctx.strokeRect(px - 7, py - 7, cell + 14, cell + 14);
      ctx.restore();
    }

    // The vision module.
    if (t > q.called - 0.85) {
      const qq = p(t, q.called - 0.85, 1.0);
      const cell = photoS / 16;
      const fromX = photoX + 10.5 * cell;
      const fromY = photoY + 9.5 * cell;
      const toX = 1250;
      const toY = 400;
      const cx = lerp(fromX, toX, easeInOut(qq));
      const cy = lerp(fromY, toY, easeInOut(qq));
      const size = lerp(cell * 1.5, 250, easeInOut(qq));
      const a = qq * (1 - p(t, q.ten + 0.35, 0.7));

      ctx.save();
      ctx.globalAlpha = a;
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.8);
      card(ctx, cx - size / 2, cy - size / 2, size, size, {
        fill: '#223743', stroke: 'rgba(139,233,253,0.62)', r: 26,
        glow: 26 + 12 * pulse,
      });
      icon(ctx, 'eye', cx - size * 0.33, cy - size * 0.33, size * 0.66, {
        color: C.cyan, width: 3.1,
      });
      // corner ticks
      ctx.strokeStyle = 'rgba(139,233,253,0.45)';
      ctx.lineWidth = 2;
      const d = 10;
      const L = 24;
      const corners = [
        [cx - size / 2 - d, cy - size / 2 - d, 1, 1],
        [cx + size / 2 + d, cy - size / 2 - d, -1, 1],
        [cx - size / 2 - d, cy + size / 2 + d, 1, -1],
        [cx + size / 2 + d, cy + size / 2 + d, -1, -1],
      ];
      for (const [x, y, sx, sy] of corners) {
        ctx.beginPath();
        ctx.moveTo(x, y + sy * L); ctx.lineTo(x, y); ctx.lineTo(x + sx * L, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Label.
    const la = enter(t, q.called + 0.05, 0.55, 0, 12);
    text(ctx, 'vision encoder', 1250, 600, {
      size: 56, weight: 500, color: C.fg, align: 'center',
      alpha: la.a * (1 - p(t, q.ten + 0.35, 0.7)),
    });
    underline(ctx, 1250 - 170, 622, 340, {
      color: C.cyan, width: 3.5, progress: p(t, q.called + 0.5, 0.7),
      alpha: 0.8 * (1 - p(t, q.ten + 0.35, 0.7)),
    });

    // SigLIP card.
    const sa = enter(t, q.siglip - 0.1, 0.5, 0, 10);
    if (t > q.siglip - 0.3) {
      const a = sa.a * (1 - p(t, q.ten, 0.5));
      const label = '40B image–text pairs';
      const labelW = (() => { ctx.save(); ctx.font = `400 34px ${F.body}`; const w = ctx.measureText(label).width; ctx.restore(); return w; })();
      const pillW = (() => { ctx.save(); ctx.font = `500 32px ${F.display}`; const w = ctx.measureText('SigLIP 2').width; ctx.restore(); return w + 32; })();
      const total = pillW + 16 + labelW;
      const x0 = 1250 - total / 2;
      pill(ctx, x0, 682, 'SigLIP 2', { size: 32, color: C.bg, bg: C.cyan, padX: 16, padY: 7, alpha: a });
      text(ctx, label, x0 + pillW + 16, 694, { size: 34, color: C.muted, alpha: a, family: F.body });
    }

    // 10 trillion.
    const ten = enter(t, q.ten - 0.25, 0.8, 0, 24);
    if (t > q.ten - 0.5 && t < q.models + 1.2) {
      ctx.save();
      ctx.globalAlpha = ten.a * (1 - p(t, q.models + 0.1, 0.9));
      ctx.translate(0, 10 * (1 - ten.q));
      text(ctx, '10 trillion', W / 2, 900, {
        size: 172, weight: 500, align: 'center', ls: -6,
      });
      text(ctx, 'image tokens · one component', W / 2, 958, {
        size: 36, color: C.muted, align: 'center', ls: 0.3,
      });
      underline(ctx, W / 2 - 290, 926, 580, {
        color: C.purple, width: 4, progress: p(t, q.ten + 0.8, 0.7), alpha: 0.85,
      });
      ctx.restore();
    }

    // The two hundred models.
    const ma = p(t, q.models - 0.2, 0.9) * (1 - p(t, 26.7, 0.7));
    if (ma > 0) {
      const cols = 20;
      const rows = 10;
      const cell = 20;
      const gap = 10;
      const gw = cols * cell + (cols - 1) * gap;
      const gh = rows * cell + (rows - 1) * gap;
      const gx = W / 2 - gw / 2;
      const gy = 300;
      ctx.save();
      ctx.globalAlpha = ma;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const a = p(t, q.models - 0.2 + idx * 0.006, 0.35);
          if (a <= 0) continue;
          const accent = idx % 37 === 0 ? C.purple : idx % 29 === 0 ? C.cyan : null;
          ctx.globalAlpha = ma * a * (accent ? 0.95 : 0.55);
          ctx.fillStyle = accent || C.current;
          rr(ctx, gx + i * (cell + gap), gy + j * (cell + gap), cell, cell, 3);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    const ca = enter(t, q.models + 0.1, 0.6, 0, 12);
    text(ctx, '200+ models · from scratch', W / 2, 680, {
      size: 52, weight: 500, align: 'center', alpha: ca.a,
    });
    const sd = enter(t, q.sameData - 0.05, 0.5, 0, 8);
    pill(ctx, W / 2 - 175, 762, 'same data', { size: 32, color: C.fg, bg: C.surface2, padX: 18, padY: 9, alpha: sd.a, align: 'center' });
    const sb = enter(t, q.sameBudget - 0.05, 0.5, 0, 8);
    pill(ctx, W / 2 + 175, 762, 'same budget', { size: 32, color: C.fg, bg: C.surface2, padX: 18, padY: 9, alpha: sb.a, align: 'center' });

    ctx.restore();
  },
};

// ---------------------------------------------------------------- three tests + default

const pipeline = {
  id: 'default',
  title: 'The default recipe',
  start: 27.0,
  end: 43.34,
  draw(ctx, t) {
    const intro = 1 - p(t, q.want - 0.3, 0.7);
    if (intro > 0) {
      const cards = [
        { n: 1, icon: 'clock', label: 'training' },
        { n: 2, icon: 'desk', label: 'capacity' },
        { n: 3, icon: 'room', label: 'placement' },
      ];
      cards.forEach((c, i) => {
        const a = enter(t, 27.0 + i * 0.22, 0.55, 0, 18);
        const x = 250 + i * 480;
        const y = 360;
        ctx.save();
        ctx.globalAlpha = a.a * intro;
        card(ctx, x, y, 380, 340, { fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 22 });
        numberedChip(ctx, x + 58, y + 58, c.n, { color: C.purple, size: 50 });
        icon(ctx, c.icon, x + 148, y + 86, 132, { color: C.muted, width: 3.2, alpha: 0.9 });
        text(ctx, c.label, x + 40, y + 285, { size: 38, color: C.muted, alpha: 0.85 });
        ctx.restore();
      });
    }

    const build = p(t, q.want - 0.15, 1.0);
    if (build <= 0) return;

    const base = p(t, q.want + 0.1, 0.8);
    const netA = base * (0.30 + 0.70 * p(t, q.network - 0.35, 0.6));
    const lmA = base * (0.30 + 0.70 * p(t, q.bolt - 0.35, 0.6));
    const ansA = base * (0.30 + 0.70 * p(t, q.bolt + 0.9, 0.6));

    ctx.save();
    ctx.globalAlpha = build;
    ctx.translate(0, 16 * (1 - build));

    // Pipeline nodes.
    const photoA = p(t, q.want, 0.8);
    drawPhoto(ctx, 135, 380, 285, { alpha: photoA, radius: 14 });
    text(ctx, 'a picture', 277, 710, { size: 36, color: C.muted, align: 'center', alpha: base });

    card(ctx, 500, 440, 320, 160, { fill: C.surface, stroke: 'rgba(248,248,242,0.18)', r: 16, accent: C.cyan, accentW: 3, alpha: netA });
    text(ctx, 'image network', 660, 510, { size: 38, align: 'center', alpha: netA });
    pill(ctx, 660, 558, 'already trained', { size: 26, color: C.cyan, bg: 'rgba(139,233,253,0.12)', padX: 13, padY: 5, alpha: netA, align: 'center' });

    card(ctx, 920, 440, 320, 160, { fill: C.surface, stroke: 'rgba(248,248,242,0.18)', r: 16, accent: C.purple, accentW: 3, alpha: lmA });
    text(ctx, 'language model', 1080, 510, { size: 38, align: 'center', alpha: lmA });
    text(ctx, 'reads vectors', 1080, 558, { size: 28, color: C.muted, align: 'center', alpha: lmA });

    // Answer bubble.
    card(ctx, 1330, 425, 360, 190, { fill: C.surface2, stroke: 'rgba(248,248,242,0.18)', r: 22, alpha: ansA });
    text(ctx, '“a bicycle”', 1510, 523, { size: 38, align: 'center', alpha: ansA });
    text(ctx, 'the answer', 1510, 573, { size: 28, color: C.muted, align: 'center', alpha: ansA });

    // Arrows.
    arrow(ctx, 430, 515, 490, 515, { color: C.muted, width: 3, progress: p(t, q.want + 0.6, 0.4), head: 12, alpha: 0.35 + 0.65 * base });
    arrow(ctx, 830, 515, 910, 515, { color: C.muted, width: 3, progress: p(t, q.bolt - 0.25, 0.4), head: 12, alpha: 0.35 + 0.65 * p(t, q.bolt - 0.5, 0.5) });
    arrow(ctx, 1250, 515, 1320, 515, { color: C.muted, width: 3, progress: p(t, q.bolt + 0.6, 0.4), head: 12, alpha: 0.35 + 0.65 * p(t, q.bolt + 0.4, 0.5) });

    // Trained together loop.
    const tog = p(t, q.together - 0.2, 0.7);
    if (tog > 0) {
      ctx.save();
      ctx.globalAlpha *= tog;
      ctx.strokeStyle = C.green;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(655, 610);
      ctx.bezierCurveTo(655, 690, 1090, 690, 1090, 610);
      ctx.stroke();
      ctx.setLineDash([]);
      pill(ctx, 872, 690, 'trained together', { size: 29, color: C.green, bg: 'rgba(80,250,123,0.10)', padX: 14, padY: 6, align: 'center', alpha: 1 });
      ctx.restore();
    }

    // The default label.
    const defA = enter(t, q.defaulted - 0.15, 0.6, 0, 10);
    if (defA.a > 0) {
      text(ctx, 'the default', W / 2, 820, {
        size: 46, weight: 500, align: 'center', alpha: defA.a, color: C.fg,
      });
      underline(ctx, W / 2 - 135, 838, 270, {
        color: C.green, width: 3, progress: p(t, q.defaulted + 0.2, 0.5), alpha: 0.75,
      });
    }

    ctx.restore();
  },
};

export default [hook, pipeline];
