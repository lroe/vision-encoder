import {
  W, H, C, F, text, card, pill, icon, p, enter, away, line, arrow, bracket, underline,
  drawPhoto, count, rr, clamp, lerp, easeInOut, easeOutCubic, vectorStrip, drawWriter, measure,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  works: at('it works', 22),
  next: at('predict the next word', 22),
  first: at('first layers', 22),
  edge: at('an edge', 22),
  curve: at('a curve', 22),
  bicycle: at('a bicycle', 22),
  lot: at('lot to ask', 23),
  hire: at('hired a specialist', 23),

  attached: at('three things attached', 24),
  team: at('team of writers', 25),
  expert: at('hire a photo expert', 25),
  isExpert: at('that expert is the vision encoder', 26),
  second: at('second neural network', 26),
  vit: at('vision transformer', 26),
  trained: at('trained first', 26),
  names: at('clip and siglip', 26),
  froze: at('froze it', 26),
  learning: at('keep learning', 26),
  never: at('never went away', 26),
};

// ---------------------------------------------------------------- figures

function figure(ctx, x, feetY, s, o = {}) {
  const {
    color = C.fg, lean = 0, alpha = 1, armsUp = 0, hold = 0,
  } = o;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x, feetY);
  ctx.rotate(lean);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4 * s;
  ctx.lineCap = 'round';
  // head
  ctx.beginPath();
  ctx.arc(0, -212 * s, 20 * s, 0, Math.PI * 2);
  ctx.fill();
  // body
  ctx.beginPath();
  ctx.moveTo(0, -190 * s);
  ctx.lineTo(0, -80 * s);
  // legs
  ctx.moveTo(0, -80 * s);
  ctx.lineTo(-22 * s, 0);
  ctx.moveTo(0, -80 * s);
  ctx.lineTo(24 * s, 0);
  // arms
  ctx.moveTo(0, -165 * s);
  ctx.lineTo(28 * s, (-130 + hold * 45) * s);
  ctx.lineTo((56 + armsUp * 28) * s, (-150 - armsUp * 30 + hold * 40) * s);
  ctx.moveTo(0, -160 * s);
  ctx.lineTo(-24 * s, -120 * s);
  ctx.stroke();
  ctx.restore();
}

function taskBox(ctx, x, y, w, h, label, iconName, color, a, tilt = 0) {
  if (a <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= a;
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(tilt);
  ctx.translate(-w / 2, -h / 2);
  card(ctx, 0, 0, w, h, { fill: C.surface, stroke: 'rgba(248,248,242,0.2)', r: 12 });
  icon(ctx, iconName, 14, h / 2 - 24, 48, { color, width: 2.6 });
  text(ctx, label, 72, h / 2 + 1, { size: 32, color: C.fg, baseline: 'middle' });
  ctx.restore();
}

// ---------------------------------------------------------------- burden

const burden = {
  id: 'burden',
  title: 'Too much to ask',
  start: 185.74,
  end: 208.16,
  draw(ctx, t) {
    const arms = 0.15;
    const load = p(t, q.edge - 0.3, 0.6);
    const lean = -0.03 - 0.07 * load;
    const shake = t > q.lot ? Math.sin(t * 9) * 1.4 * p(t, q.lot, 0.3) * (1 - p(t, q.hire, 0.5)) : 0;
    const hire = easeInOut(p(t, q.hire - 0.2, 1.1));

    ctx.save();
    ctx.translate(shake, 0);

    // LM figure.
    figure(ctx, 760, 860, 1.45, { lean, armsUp: 0, hold: 0.4 });
    text(ctx, 'language model', 760, 936, { size: 38, color: C.fg, align: 'center' });

    // Next-word box (stays with the LM).
    taskBox(ctx, 830, 660, 300, 86, 'next word', 'text', C.cyan, p(t, q.works, 0.6));
    text(ctx, 'its original job', 980, 616, { size: 30, color: C.muted, align: 'center', alpha: p(t, q.next - 0.2, 0.5) });

    // Piling tasks. They live in the first layers: show them as weight blocks.
    const boxes = [
      { cue: q.edge, label: 'edge?', icon: 'edge', y: 560, color: C.yellow },
      { cue: q.curve, label: 'curve?', icon: 'curve', y: 470, color: C.orange },
      { cue: q.bicycle, label: 'bicycle?', icon: 'image', y: 380, color: C.pink },
    ];
    boxes.forEach((b, i) => {
      const a = p(t, b.cue - 0.2, 0.55);
      // Fly to the specialist after the hire.
      const fx = lerp(830, 1160 + i * 30, hire);
      const fy = lerp(b.y, 450 + i * 86, hire);
      taskBox(ctx, fx, fy, 300, 86, b.label, b.icon, b.color, a, (i - 1) * 0.012 + hire * 0.05);
    });

    // Weight meter / strain.
    const strain = p(t, q.edge, 0.6) * 0.2 + p(t, q.curve, 0.5) * 0.3 + p(t, q.bicycle, 0.5) * 0.35;
    const strainNow = strain * (1 - 0.85 * hire);
    if (strainNow > 0) {
      const mx = 620;
      const my = 420;
      const mh = 250;
      ctx.save();
      ctx.globalAlpha = clamp(strainNow);
      ctx.strokeStyle = 'rgba(248,248,242,0.22)';
      ctx.lineWidth = 2;
      rr(ctx, mx, my, 34, mh, 8);
      ctx.stroke();
      rr(ctx, mx + 4, my + mh - (mh - 8) * clamp(strainNow), 26, (mh - 8) * clamp(strainNow), 6);
      ctx.fillStyle = strainNow > 0.8 ? C.red : C.orange;
      ctx.fill();
      text(ctx, 'load', mx + 17, my - 22, { size: 28, color: C.muted, align: 'center' });
      ctx.restore();
    }

    // "A lot to ask" bracket.
    const lot = p(t, q.lot - 0.2, 0.6) * (1 - p(t, q.hire + 0.2, 0.6));
    if (lot > 0) {
      ctx.save();
      ctx.globalAlpha = lot;
      bracket(ctx, 620, 1210, 330, { color: C.red, width: 2, progress: lot, tick: 10 });
      text(ctx, 'all of this, one set of weights', 915, 286, { size: 38, color: C.red, align: 'center' });
      ctx.restore();
    }

    // The specialist arrives.
    const sp = p(t, q.hire - 0.1, 0.7);
    if (sp > 0) {
      const sx = 1560;
      figure(ctx, sx, 860, 1.4, { color: C.fg, alpha: sp, lean: 0 });
      text(ctx, 'vision encoder', sx, 936, { size: 38, align: 'center', alpha: sp });
      const ph = p(t, q.hire + 0.3, 0.6);
      drawPhoto(ctx, sx - 230, 570, 120, { alpha: sp * ph, radius: 10 });
      // A small "hired" tag.
      pill(ctx, sx + 150, 780, 'hired', { size: 30, color: C.bg, bg: C.green, padX: 16, padY: 7, alpha: sp * p(t, q.hire + 0.5, 0.5), align: 'center' });
    }

    ctx.restore();
  },
};

// ---------------------------------------------------------------- the team

const teamScene = {
  id: 'team',
  title: 'The writers and the expert',
  start: 208.16,
  end: 218.64,
  draw(ctx, t) {
    const zoomOut = easeInOut(p(t, q.team - 0.5, 1.4));
    const zoom = lerp(1.85, 1.0, zoomOut);
    const camX = lerp(480, 960, zoomOut);
    const camY = lerp(620, 570, zoomOut);

    // Room brightness.
    const roomA = lerp(0.25, 1, zoomOut);

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-camX, -camY);

    // Room floor + back wall.
    ctx.save();
    ctx.globalAlpha = roomA;
    line(ctx, 80, 820, 1840, 820, { color: 'rgba(248,248,242,0.32)', width: 3, rough: 0.4 });
    line(ctx, 120, 340, 1800, 340, { color: 'rgba(248,248,242,0.10)', width: 2, rough: 0.6 });
    // window
    rr(ctx, 1490, 400, 250, 190, 8);
    ctx.strokeStyle = 'rgba(248,248,242,0.14)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(1615, 400); ctx.lineTo(1615, 590);
    ctx.moveTo(1490, 495); ctx.lineTo(1740, 495);
    ctx.stroke();
    ctx.restore();

    // Desks + writers.
    const writers = [1120, 1360, 1600];
    writers.forEach((x, i) => {
      drawWriter(ctx, x, 780, 1.0, {
        color: C.fg, alpha: roomA * p(t, q.team - 0.2 + i * 0.15, 0.6),
        tap: t * 2.4 + i,
      });
    });
    text(ctx, 'writers', 1360, 880, { size: 36, color: C.muted, align: 'center', alpha: roomA * p(t, q.team + 0.2, 0.5) });

    // The photo expert at the empty desk.
    const exA = 1;
    const exColor = C.cyan;
    drawWriter(ctx, 460, 780, 1.0, {
      color: exColor, alpha: exA, tap: 0, desk: false,
    });
    // Desk under the expert.
    ctx.save();
    ctx.globalAlpha = exA;
    ctx.strokeStyle = exColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(405, 792); ctx.lineTo(515, 792);
    ctx.moveTo(418, 792); ctx.lineTo(414, 840);
    ctx.moveTo(502, 792); ctx.lineTo(506, 840);
    ctx.stroke();
    // Photo in hand.
    drawPhoto(ctx, 500, 690, 86, { radius: 8, alpha: exA });
    ctx.restore();
    text(ctx, 'photo expert', 460, 880, { size: 34, color: C.cyan, align: 'center', alpha: exA });
    const hired = p(t, q.expert + 0.1, 0.5);
    if (hired > 0) {
      pill(ctx, 620, 720, 'hired', { size: 28, color: C.bg, bg: C.green, padX: 14, padY: 6, alpha: hired * roomA });
    }

    // Three gifts hovering over the expert.
    const gA = p(t, q.attached + 0.1, 0.7) * (1 - 0.25 * zoomOut);
    const gifts = [
      { x: 350, y: 590, icon: 'brain', color: C.cyan },
      { x: 460, y: 545, icon: 'desk', color: C.green },
      { x: 570, y: 590, icon: 'room', color: C.purple },
    ];
    gifts.forEach((g, i) => {
      const a = gA * p(t, q.attached + i * 0.25, 0.6);
      ctx.save();
      ctx.globalAlpha = a;
      card(ctx, g.x - 42, g.y - 42, 84, 84, { fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 18 });
      icon(ctx, g.icon, g.x - 25, g.y - 25, 50, { color: g.color, width: 3 });
      ctx.restore();
    });
    const tg = p(t, q.attached + 0.5, 0.6) * (1 - zoomOut * 0.4);
    text(ctx, 'three things attached', 460, 470, { size: 36, color: C.fg, align: 'center', alpha: tg });

    ctx.restore();
  },
};

// ---------------------------------------------------------------- expert, technically

const expertScene = {
  id: 'expert',
  title: 'Inside the vision encoder',
  start: 218.64,
  end: 249.44,
  draw(ctx, t) {
    const flow = p(t, q.isExpert, 0.8);
    const second = p(t, q.second - 0.1, 0.6);
    const vit = p(t, q.vit - 0.2, 0.7);
    const tl = p(t, q.trained - 0.2, 0.7);
    const names = p(t, q.names - 0.1, 0.6);
    const froze = p(t, q.froze - 0.1, 0.55);
    const learn = p(t, q.learning - 0.15, 0.6);
    const never = p(t, q.never - 0.1, 0.5);

    // Flow.
    ctx.save();
    ctx.globalAlpha = flow;

    drawPhoto(ctx, 150, 270, 220, { radius: 12, grid: true, gridAlpha: 0.4, slice: 0.5 });
    text(ctx, 'patches', 260, 530, { size: 30, color: C.muted, align: 'center' });

    // Encoder stack.
    const ex = 450;
    const ey = 230;
    const ew = 340;
    const eh = 390;
    card(ctx, ex, ey, ew, eh, {
      fill: '#20303A', stroke: 'rgba(139,233,253,0.4)', r: 20,
    });
    for (let i = 0; i < 4; i++) {
      card(ctx, ex + 30, ey + 34 + i * 80, ew - 60, 58, {
        fill: 'rgba(139,233,253,0.09)', stroke: 'rgba(139,233,253,0.25)', r: 10, lw: 1.2,
      });
      for (let k = 0; k < 4; k++) {
        ctx.fillStyle = 'rgba(139,233,253,0.35)';
        ctx.beginPath();
        ctx.arc(ex + 88 + k * 48, ey + 63 + i * 80, 3.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    pill(ctx, ex + ew / 2, ey - 38, 'vision encoder', {
      size: 28, color: C.bg, bg: C.cyan, padX: 16, padY: 7, alpha: flow, align: 'center',
    });
    text(ctx, 'vision transformer', ex + ew / 2, 654, { size: 36, color: C.cyan, align: 'center', alpha: vit });
    text(ctx, 'a second network', ex + ew / 2, 692, { size: 30, color: C.muted, align: 'center', alpha: second });

    arrow(ctx, 378, 380, ex - 12, 380, { color: C.muted, width: 3, progress: p(t, q.isExpert + 0.3, 0.5), head: 12 });
    arrow(ctx, 800, 380, 838, 380, { color: C.muted, width: 3, progress: p(t, q.isExpert + 0.6, 0.5), head: 12 });

    // Better image tokens.
    for (let i = 0; i < 6; i++) {
      const a = p(t, q.isExpert + 0.7 + i * 0.05, 0.4);
      vectorStrip(ctx, 850 + i * 56, 310, 42, 150, { color: C.purple, accent: C.cyan, alpha: a, seed: i * 3 + 2, cells: 8 });
    }
    text(ctx, 'better image tokens', 1000, 510, { size: 32, color: C.purple, align: 'center', alpha: p(t, at('better image tokens', 26) - 0.2, 0.5) });

    // LM box.
    card(ctx, 1210, 250, 400, 280, { fill: C.surface, stroke: 'rgba(189,147,249,0.3)', r: 20 });
    text(ctx, 'language model', 1410, 385, { size: 36, align: 'center' });
    icon(ctx, 'layers', 1350, 420, 100, { color: C.purple, width: 2.8 });
    arrow(ctx, 1178, 380, 1198, 380, { color: C.muted, width: 3, progress: p(t, q.isExpert + 0.8, 0.4), head: 11 });

    ctx.restore();

    // Timeline (ghost first, then filled).
    const tx = 300;
    const ty = 770;
    const tw = 480;
    const th = 100;
    if (tl > 0) {
      ctx.save();
      ctx.globalAlpha = tl;
      card(ctx, tx, ty, tw, th, { fill: '#20303A', stroke: 'rgba(139,233,253,0.45)', r: 14 });
      text(ctx, '1 · encoder pretraining', tx + 30, ty + 62, { size: 30, color: C.cyan });
      text(ctx, 'images + captions', tx + 30, ty + 138, { size: 30, color: C.muted, alpha: p(t, q.trained + 0.2, 0.5) });

      card(ctx, tx + tw + 70, ty, tw, th, { fill: C.surface2, stroke: 'rgba(189,147,249,0.3)', r: 14, alpha: 0.85 });
      text(ctx, '2 · multimodal training', tx + tw + 100, ty + 62, { size: 30, color: C.purple });
      text(ctx, 'image + text together', tx + tw + 100, ty + 138, { size: 30, color: C.muted });

      arrow(ctx, tx + tw + 10, ty + th / 2, tx + tw + 60, ty + th / 2, {
        color: C.muted, width: 3, progress: p(t, q.trained + 0.3, 0.5), head: 10,
      });

      // CLIP / SigLIP tags.
      const nameA = names;
      if (nameA > 0) {
        pill(ctx, tx + 30, ty + 192, 'CLIP', { size: 30, color: C.fg, bg: 'rgba(248,248,242,0.08)', padX: 14, padY: 6, alpha: nameA });
        pill(ctx, tx + 158, ty + 192, 'SigLIP', { size: 30, color: C.fg, bg: 'rgba(248,248,242,0.08)', padX: 14, padY: 6, alpha: nameA });
      }

      // Freeze / learn.
      if (froze > 0) {
        ctx.save();
        ctx.globalAlpha = froze * (1 - learn);
        icon(ctx, 'lock', tx + tw - 78, ty - 62, 52, { color: C.orange, width: 3 });
        text(ctx, 'frozen', tx + tw - 52, ty - 14, { size: 30, color: C.orange, align: 'center' });
        ctx.restore();
      }
      if (learn > 0) {
        ctx.save();
        ctx.globalAlpha = learn;
        icon(ctx, 'check', tx + tw - 78, ty - 62, 52, { color: C.green, width: 3 });
        text(ctx, 'keeps learning', tx + tw - 52, ty - 14, { size: 30, color: C.green, align: 'center' });
        ctx.restore();
      }

      // "Never went away" underline.
      if (never > 0) {
        underline(ctx, tx + 24, ty + th + 10, 340, { color: C.green, width: 3, progress: never, alpha: 0.9 });
      }
      ctx.restore();
    } else {
      // Ghost scaffold.
      const ga = p(t, 220.0, 0.8) * 0.16;
      if (ga > 0) {
        card(ctx, tx, ty, tw, th, { fill: null, stroke: 'rgba(139,233,253,0.4)', r: 14, alpha: ga, dash: [8, 10] });
        card(ctx, tx + tw + 70, ty, tw, th, { fill: null, stroke: 'rgba(189,147,249,0.4)', r: 14, alpha: ga, dash: [8, 10] });
      }
    }
  },
};

export default [burden, teamScene, expertScene];
