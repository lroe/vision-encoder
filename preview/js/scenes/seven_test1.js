import {
  W, H, C, F, text, card, pill, icon, p, enter, line, arrow, bracket, underline,
  count, rr, clamp, lerp, easeInOut, vectorStrip, measure, drawPhoto,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  setup: at('they pretrained encoders four ways', 47),
  meta: at('meta clip', 47),
  webssl: at('web s s l', 47),
  captions: at('captioning ones', 47),
  sameCompute: at('same pretraining compute', 47),
  compare: at('compared all of them', 47),

  budget: at('one point seven billion', 48),
  small: at('small slice', 48),
  fifteen: at('fifteen percent', 48),
  tie: at('a tie', 48),
  sixty: at('a tie', 48) + 1.35,
  nothing: at('did nothing', 48),

  free: at('make it free', 49),
  locked: at('locked the multimodal training', 50),
  six: at('six times more compute', 50),
  acc1: at('eighty point four', 50),
  acc2: at('eighty four point four', 50),
  questions: at('image questions', 50),
  highest: at('shortest pretraining', 50),
  matched: at('scratch encoder matched', 50),
  better: at('better image classifier', 51),
  noBetter: at('no better', 51),

  lowrec: at('web s s l had the lowest', 52),
  bestq: at('best question score', 52),
  why: at('why', 53),
  diffq: at('different question', 53),
  charts: at('read this chart', 53),

  pretrainedLM: 550.5,
  scratchFeatures: at('from scratch encoder learns', 54),
  freeMeta: 568.0,
  behind: 569.8,
  textCharts: 571.2,

  lateStart: 574.2,
  quarter: at('quarter of the way', 55),
  score425: at('forty two point five', 55),
  score35: at('thirty five', 55),
  firstUpdate: at('first update', 55),

  recap: at('test one says', 56),
  fire: at('fire the whole specialist', 56),
  deleteEncoder: at('delete the encoder', 56),
  turns: at('paper turns', 57),
};

// ---------------------------------------------------------------- four ways

const setup = {
  id: 't1-setup',
  title: 'Four ways to pretrain',
  start: 450.38,
  end: 474.7,
  draw(ctx, t) {
    const methods = [
      { name: 'MetaCLIP', cue: q.meta, color: C.cyan, kind: 'match', caption: 'match image ↔ caption' },
      { name: 'WebSSL', cue: q.webssl, color: C.green, kind: 'alone', caption: 'images alone' },
      { name: 'Cap', cue: q.captions, color: C.purple, kind: 'write', caption: 'write the caption' },
      { name: 'CapPa', cue: q.captions + 0.6, color: C.orange, kind: 'write2', caption: 'write the caption' },
    ];
    const setupGhost = p(t, 450.8, 0.8) * 0.26;
    methods.forEach((m, i) => {
      const a = p(t, m.cue - 0.2, 0.6);
      const x = 150 + i * 405;
      const y = 240;
      if (a <= 0.001) {
        card(ctx, x, y, 380, 400, { fill: C.surface, stroke: 'rgba(248,248,242,0.4)', r: 20, alpha: setupGhost, dash: [8, 10] });
        return;
      }
      ctx.save();
      ctx.globalAlpha = a;
      card(ctx, x, y, 380, 400, { fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, accent: m.color, accentW: 3 });
      text(ctx, m.name, x + 34, y + 66, { size: 40, weight: 500, color: m.color });
      // image card
      drawPhoto(ctx, x + 34, y + 110, 120, { radius: 10, alpha: 0.9 });
      // caption card
      card(ctx, x + 226, y + 122, 120, 96, { fill: C.surface2, stroke: 'rgba(248,248,242,0.16)', r: 8 });
      for (let k = 0; k < 3; k++) {
        line(ctx, x + 242, y + 152 + k * 22, x + 326 - k * 22, y + 152 + k * 22, { color: 'rgba(248,248,242,0.32)', width: 3, rough: 0 });
      }
      if (m.kind === 'match') {
        arrow(ctx, x + 160, y + 148, x + 218, y + 148, { color: C.muted, width: 2.2, head: 8 });
        arrow(ctx, x + 218, y + 188, x + 160, y + 188, { color: C.muted, width: 2.2, head: 8 });
      } else if (m.kind === 'alone') {
        icon(ctx, 'cross', x + 260, y + 250, 44, { color: C.red, width: 3 });
        text(ctx, 'no captions', x + 286, y + 278, { size: 24, color: C.red, align: 'center' });
      } else {
        arrow(ctx, x + 160, y + 164, x + 218, y + 164, { color: C.muted, width: 2.2, head: 8 });
      }
      text(ctx, m.caption, x + 34, y + 300, { size: 28, color: C.muted });
      // same compute bar
      const sc = p(t, q.sameCompute - 0.2, 0.6);
      if (sc > 0) {
        text(ctx, 'same compute', x + 34, y + 352, { size: 26, color: C.dim, alpha: sc });
        rr(ctx, x + 180, y + 334, 160, 6, 3);
        ctx.fillStyle = 'rgba(248,248,242,0.1)';
        ctx.fill();
        rr(ctx, x + 180, y + 334, 160 * sc, 6, 3);
        ctx.fillStyle = m.color;
        ctx.fill();
      }
      ctx.restore();
    });

    const comp = p(t, q.compare - 0.2, 0.7);
    if (comp > 0) {
      ctx.save();
      ctx.globalAlpha = comp;
      text(ctx, 'compared with one encoder trained from scratch', W / 2, 760, {
        size: 32, color: C.muted, align: 'center',
      });
      pill(ctx, 960, 830, 'from scratch', { size: 32, color: C.bg, bg: C.green, padX: 18, padY: 8, align: 'center' });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- budget result

const budget = {
  id: 't1-budget',
  title: 'Test one: budget share',
  start: 474.7,
  end: 493.18,
  draw(ctx, t) {
    const axis = p(t, 474.8, 0.6);
    const small = p(t, q.small - 0.2, 0.6);
    const tieA = p(t, q.tie - 0.4, 0.6);
    const drop = p(t, q.sixty - 0.2, 0.7);
    const result = p(t, q.nothing - 0.2, 0.6);

    // Chart frame.
    if (axis > 0) {
      ctx.save();
      ctx.globalAlpha = axis;
      line(ctx, 420, 760, 1500, 760, { color: 'rgba(248,248,242,0.28)', width: 2 });
      line(ctx, 420, 300, 420, 760, { color: 'rgba(248,248,242,0.28)', width: 2 });
      text(ctx, 'avg VQA score', 430, 270, { size: 30, color: C.muted });
      text(ctx, 'share of budget spent on encoder pretraining', 960, 830, { size: 30, color: C.muted, align: 'center' });
      text(ctx, '1.7B model', 430, 340, { size: 28, color: C.muted });
      [['7.4%', 600], ['15%', 720], ['60%', 1280]].forEach(([lab, x]) => {
        text(ctx, lab, x, 806, { size: 30, color: C.muted, align: 'center' });
        line(ctx, x, 756, x, 770, { color: C.muted, width: 1.5 });
      });
      ctx.restore();
    }

    // From-scratch reference line.
    if (small > 0) {
      ctx.save();
      ctx.globalAlpha = small;
      ctx.setLineDash([10, 10]);
      line(ctx, 500, 520, 1440, 520, { color: C.green, width: 2.4 });
      ctx.setLineDash([]);
      text(ctx, 'from scratch', 1460, 528, { size: 30, color: C.green });
      ctx.restore();
    }

    // Pretrained line.
    const flatLine = p(t, q.fifteen - 0.2, 0.6);
    if (flatLine > 0) {
      ctx.save();
      ctx.globalAlpha = flatLine;
      line(ctx, 600, 520, 720, 520, { color: C.cyan, width: 3 });
      if (drop > 0) {
        line(ctx, 720, 520, 1280, 650, { color: C.cyan, width: 3, progress: drop });
      }
      ctx.fillStyle = C.cyan;
      for (const [x, y] of [[600, 520], [720, 520]]) {
        ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
      }
      if (drop > 0) {
        ctx.beginPath(); ctx.arc(1280, 650, 11, 0, Math.PI * 2); ctx.fill();
      }
      text(ctx, 'pretrained encoder', 600, 470, { size: 30, color: C.cyan });
      ctx.restore();
    }

    if (tieA > 0) {
      const a = p(t, q.tie, 0.5);
      text(ctx, 'a tie', 660, 600, { size: 44, color: C.fg, alpha: a });
      bracket(ctx, 590, 730, 560, { color: C.cyan, width: 1.6, progress: a, tick: 8 });
    }
    if (drop > 0) {
      text(ctx, 'below', 1280, 610, { size: 40, color: C.red, align: 'center', alpha: drop });
    }
    if (result > 0) {
      text(ctx, 'pretraining did nothing — or it hurt', W / 2, 920, {
        size: 34, color: C.fg, align: 'center', alpha: result,
      });
    }
  },
};

// ---------------------------------------------------------------- free pretraining

const free = {
  id: 't1-free',
  title: 'Free pretraining',
  start: 493.18,
  end: 525.9,
  draw(ctx, t) {
    const panel = p(t, 493.4, 0.8);
    const freeA = p(t, q.free - 0.2, 0.5);
    const six = p(t, q.six - 0.2, 0.6);
    const acc1 = p(t, q.acc1 - 0.2, 0.5);
    const acc2 = p(t, q.acc2 - 0.2, 0.5);
    const qA = p(t, q.questions - 0.2, 0.6);
    const highest = p(t, q.highest - 0.2, 0.6);
    const better = p(t, q.better - 0.2, 0.6);
    const noBetter = p(t, q.noBetter - 0.2, 0.6);

    // Panels.
    ctx.save();
    ctx.globalAlpha = panel;
    card(ctx, 170, 260, 720, 400, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 20 });
    text(ctx, 'image recognition', 210, 320, { size: 34, color: C.cyan });
    text(ctx, 'ImageNet probe', 210, 360, { size: 26, color: C.muted, alpha: acc1 });

    card(ctx, 1030, 260, 720, 400, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 20 });
    text(ctx, 'image questions', 1070, 320, { size: 34, color: C.purple });
    text(ctx, 'VQA score', 1070, 360, { size: 26, color: C.muted, alpha: qA });
    ctx.restore();

    // Free tag.
    if (freeA > 0) {
      pill(ctx, 960, 210, 'pretraining not counted', {
        size: 30, color: C.bg, bg: C.green, padX: 18, padY: 7, alpha: freeA, align: 'center',
      });
    }

    // Ghost structure for the empty panels.
    const ghost = p(t, 494.0, 0.8) * 0.08;
    if (ghost > 0) {
      ctx.save();
      ctx.globalAlpha = ghost;
      const base = 600;
      const maxH = 190;
      rr(ctx, 300, base - maxH * 0.804, 100, maxH * 0.804, 8);
      ctx.fillStyle = C.fg;
      ctx.fill();
      rr(ctx, 470, base - maxH * 0.844, 100, maxH * 0.844, 8);
      ctx.fill();
      line(ctx, 1120, 430, 1600, 450, { color: C.purple, width: 2.5 });
      ctx.restore();
    }

    // Recognition bars.
    if (acc1 > 0) {
      const base = 600;
      const maxH = 190;
      const b1 = maxH * (80.4 / 100);
      const b2 = maxH * (84.4 / 100);
      ctx.save();
      ctx.globalAlpha = acc1;
      rr(ctx, 300, base - b1, 100, b1, 8);
      ctx.fillStyle = 'rgba(139,233,253,0.28)';
      ctx.fill();
      text(ctx, '80.4%', 350, base - b1 - 22, { size: 36, color: C.fg, align: 'center' });
      ctx.restore();
      if (acc2 > 0) {
        ctx.save();
        ctx.globalAlpha = acc2;
        rr(ctx, 470, base - b2, 100, b2, 8);
        ctx.fillStyle = C.cyan;
        ctx.fill();
        text(ctx, '84.4%', 520, base - b2 - 22, { size: 36, color: C.fg, align: 'center' });
        arrow(ctx, 430, base - b1 - 60, 490, base - b2 - 60, { color: C.green, width: 2.4, head: 9, progress: acc2 });
        ctx.restore();
      }
      text(ctx, 'short', 350, 638, { size: 28, color: C.muted, align: 'center' });
      text(ctx, '6× longer', 620, 638, { size: 28, color: C.muted, align: 'center' });
    }

    // VQA line.
    if (qA > 0) {
      const pts = [[1120, 430], [1270, 430], [1430, 438], [1600, 450]];
      ctx.save();
      ctx.globalAlpha = qA;
      line(ctx, 1120, 500, 1640, 500, { color: 'rgba(248,248,242,0.2)', width: 1.5 });
      for (let i = 1; i < pts.length; i++) {
        line(ctx, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], { color: C.purple, width: 3 });
      }
      pts.forEach(([x, y], i) => {
        ctx.fillStyle = C.purple;
        ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
      });
      text(ctx, 'highest here', 1180, 410, { size: 28, color: C.purple, align: 'center', alpha: highest });
      text(ctx, 'short', 1120, 530, { size: 26, color: C.muted, align: 'center' });
      text(ctx, '6×', 1600, 530, { size: 26, color: C.muted, align: 'center' });
      ctx.restore();
    }

    // Punchline.
    if (better > 0) {
      ctx.save();
      ctx.globalAlpha = better;
      icon(ctx, 'check', 340, 748, 54, { color: C.green, width: 3.2 });
      text(ctx, 'a better image classifier', 410, 786, { size: 36, color: C.fg });
      ctx.restore();
    }
    if (noBetter > 0) {
      ctx.save();
      ctx.globalAlpha = noBetter;
      icon(ctx, 'cross', 1010, 748, 54, { color: C.red, width: 3.2 });
      text(ctx, 'no better at questions', 1080, 786, { size: 36, color: C.fg });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- webssl / different question

const webssl = {
  id: 't1-webssl',
  title: 'A different question',
  start: 525.9,
  end: 550.02,
  draw(ctx, t) {
    const chart = p(t, 526.1, 0.7);
    const low = p(t, q.lowrec - 0.2, 0.6);
    const best = p(t, q.bestq - 0.2, 0.6);
    const why = p(t, q.why - 0.2, 0.6);
    const diff = p(t, q.diffq - 0.2, 0.6);

    if (chart > 0) {
      ctx.save();
      ctx.globalAlpha = chart;
      text(ctx, 'recognition', 360, 260, { size: 30, color: C.muted, align: 'center' });
      text(ctx, 'image questions', 1560, 260, { size: 30, color: C.muted, align: 'center' });
      line(ctx, 560, 300, 560, 650, { color: 'rgba(248,248,242,0.15)', width: 1.5 });
      line(ctx, 1360, 300, 1360, 650, { color: 'rgba(248,248,242,0.15)', width: 1.5 });

      // other encoders, neutral.
      const others = [360, 440, 520];
      others.forEach((y, i) => {
        line(ctx, 560, y + 80, 1360, y + 80, { color: 'rgba(248,248,242,0.14)', width: 2 });
        ctx.fillStyle = 'rgba(248,248,242,0.35)';
        ctx.beginPath(); ctx.arc(560, y + 80, 7, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(1360, y + 80, 7, 0, Math.PI * 2); ctx.fill();
      });
      text(ctx, 'other encoders', 960, 455, { size: 26, color: C.dim, align: 'center' });
      // WebSSL line.
      const y1 = 610;
      const y2 = 350;
      line(ctx, 560, y1, 1360, y2, { color: C.green, width: 3.4, progress: p(t, 527.0, 0.7) });
      ctx.fillStyle = C.green;
      ctx.beginPath(); ctx.arc(560, y1, 11, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(1360, y2, 11, 0, Math.PI * 2); ctx.fill();
      text(ctx, 'WebSSL', 430, y1 + 8, { size: 32, color: C.green, align: 'center' });
      text(ctx, 'lowest', 430, y1 + 46, { size: 26, color: C.red, align: 'center', alpha: low });
      text(ctx, 'best', 1490, y2 + 8, { size: 32, color: C.green, align: 'center', alpha: best });
      ctx.restore();
    }

    if (why > 0) {
      text(ctx, 'why?', 960, 700, { size: 44, color: C.yellow, align: 'center', alpha: why });
    }

    if (diff > 0) {
      ctx.save();
      ctx.globalAlpha = diff;
      card(ctx, 180, 760, 720, 190, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 16 });
      text(ctx, 'pretraining asks', 210, 802, { size: 28, color: C.muted });
      text(ctx, 'what is in this image?', 210, 852, { size: 32, color: C.cyan });
      text(ctx, 'which caption matches?', 210, 894, { size: 32, color: C.cyan });
      card(ctx, 980, 760, 760, 190, { fill: C.surface, stroke: 'rgba(189,147,249,0.24)', r: 16 });
      text(ctx, 'your model must', 1010, 802, { size: 28, color: C.muted });
      text(ctx, 'read charts · find small text', 1010, 852, { size: 30, color: C.purple });
      text(ctx, 'count objects', 1010, 892, { size: 30, color: C.purple });
      text(ctx, 'different questions', 1010, 930, { size: 26, color: C.muted });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- pretrained LM

const pretrainedLM = {
  id: 't1-pretrained-lm',
  title: 'Starting from a trained LM',
  start: 550.02,
  end: 574.14,
  draw(ctx, t) {
    const lm = p(t, q.pretrainedLM - 0.2, 0.7);
    const enc = p(t, 553.4, 0.7);
    const bars = p(t, 558.0, 0.8);
    const behind = p(t, q.behind - 0.2, 0.6);
    const charts = p(t, q.textCharts - 0.2, 0.6);

    // Pretrained LM.
    card(ctx, 660, 220, 600, 180, { fill: C.surface, stroke: 'rgba(189,147,249,0.3)', r: 18, alpha: lm });
    text(ctx, 'pretrained language model', 960, 290, { size: 38, color: C.purple, align: 'center', alpha: lm });
    text(ctx, 'already leans on text', 960, 336, { size: 28, color: C.muted, align: 'center', alpha: lm });
    pill(ctx, 960, 380, 'frozen first', { size: 24, color: C.muted, bg: 'rgba(248,248,242,0.06)', padX: 12, padY: 5, alpha: lm, align: 'center' });

    // Two encoders.
    const lanes = [
      { label: 'MetaCLIP, free', color: C.cyan, y: 600, frac: 0.58, tag: 'behind' },
      { label: 'from scratch', color: C.green, y: 720, frac: 0.82, tag: 'ahead' },
    ];
    const laneGhost = p(t, 551.0, 0.8) * 0.22;
    lanes.forEach((l, i) => {
      ctx.save();
      ctx.globalAlpha = Math.max(laneGhost, enc);
      text(ctx, l.label, 260, l.y + 22, { size: 32, color: l.color, alpha: Math.max(laneGhost * 3, enc) });
      rr(ctx, 560, l.y, 840, 44, 10);
      ctx.fillStyle = 'rgba(248,248,242,0.07)';
      ctx.fill();
      if (enc > 0) {
        rr(ctx, 560, l.y, 840 * l.frac * bars, 44, 10);
        ctx.fillStyle = l.color;
        ctx.globalAlpha = enc;
        ctx.fill();
      }
      ctx.restore();
      if (enc > 0) {
        text(ctx, l.tag, 1440, l.y + 22, {
          size: 30, color: l.tag === 'behind' ? C.red : C.green, alpha: behind,
        });
      }
    });

    if (behind > 0) {
      text(ctx, 'falls behind on text, charts, vision-heavy questions', W / 2, 900, {
        size: 34, color: C.red, align: 'center', alpha: behind * (1 - 0.3 * charts),
      });
    }
  },
};

// ---------------------------------------------------------------- late vision

const late = {
  id: 't1-late',
  title: 'Start images at update one',
  start: 574.14,
  end: 590.62,
  draw(ctx, t) {
    const tl = p(t, 574.4, 0.7);
    const quarter = p(t, q.quarter - 0.2, 0.7);
    const s425 = p(t, q.score425 - 0.2, 0.6);
    const s35 = p(t, q.score35 - 0.2, 0.6);
    const first = p(t, q.firstUpdate - 0.2, 0.6);

    // Timeline.
    ctx.save();
    ctx.globalAlpha = tl;
    line(ctx, 320, 350, 1600, 350, { color: 'rgba(248,248,242,0.24)', width: 3 });
    for (let i = 0; i <= 4; i++) {
      line(ctx, 320 + i * 320, 342, 320 + i * 320, 358, { color: 'rgba(248,248,242,0.3)', width: 2 });
    }
    text(ctx, 'training', 960, 390, { size: 28, color: C.muted, align: 'center' });
    text(ctx, 'update 1', 340, 320, { size: 28, color: C.green });
    text(ctx, '25%', 1120, 320, { size: 28, color: C.red, align: 'center', alpha: quarter });
    // image marker at 25%
    if (quarter > 0) {
      line(ctx, 1120, 320, 1120, 350, { color: C.red, width: 3, progress: quarter });
      icon(ctx, 'image', 1050, 270, 60, { color: C.red, alpha: quarter, width: 2.6 });
    }
    if (first > 0) {
      line(ctx, 340, 320, 340, 350, { color: C.green, width: 3, progress: first });
      icon(ctx, 'bolt', 275, 265, 55, { color: C.green, alpha: first, width: 2.6 });
    }
    ctx.restore();

    // Score cards.
    const cardGhost = p(t, 574.5, 0.7) * 0.1;
    const cards = [
      { x: 300, y: 520, label: 'start at update 1', value: 42.5, color: C.green, a: s425 },
      { x: 1080, y: 520, label: 'start at 25%', value: 35.0, color: C.red, a: s35 },
    ];
    cards.forEach((c) => {
      const a = Math.max(cardGhost, c.a);
      ctx.save();
      ctx.globalAlpha = a;
      card(ctx, c.x, c.y, 560, 230, { fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 18 });
      text(ctx, c.label, c.x + 32, c.y + 60, { size: 34, color: C.muted });
      text(ctx, c.value.toFixed(1), c.x + 32, c.y + 164, { size: 96, weight: 500, color: c.color });
      text(ctx, 'avg VQA', c.x + 300, c.y + 164, { size: 30, color: C.muted });
      ctx.restore();
    });

    if (first > 0) {
      arrow(ctx, 760, 690, 880, 690, { color: C.green, width: 3, progress: first, head: 12 });
      text(ctx, 'if you want it to see,', W / 2, 860, { size: 38, color: C.fg, align: 'center', alpha: first });
      text(ctx, 'start images at update one', W / 2, 914, { size: 40, color: C.green, align: 'center', alpha: first });
    }
  },
};

// ---------------------------------------------------------------- recap

const recap = {
  id: 't1-recap',
  title: 'Fire the specialist?',
  start: 590.62,
  end: 602.36,
  draw(ctx, t) {
    const a = p(t, 590.8, 0.7);
    const fire = p(t, q.fire - 0.2, 0.8);
    const del = p(t, q.deleteEncoder - 0.2, 0.8);
    const turn = p(t, q.turns - 0.1, 0.7);

    const stages = [
      { label: 'patches', x: 220, color: C.orange },
      { label: 'encoder', x: 760, color: C.cyan },
      { label: 'language model', x: 1300, color: C.purple },
    ];
    ctx.save();
    ctx.globalAlpha = a;
    stages.forEach((s, i) => {
      card(ctx, s.x, 380, 380, 160, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 16,
        alpha: 1 - (i === 1 ? 0.9 * fire : 0),
        dash: i === 1 && del > 0 ? [9, 9] : null,
      });
      text(ctx, s.label, s.x + 190, 468, {
        size: 34, color: s.color, align: 'center', alpha: 1 - (i === 1 ? 0.9 * fire : 0),
      });
    });
    arrow(ctx, 610, 460, 750, 460, { color: C.muted, width: 2.6, progress: p(t, 591.2, 0.4), head: 10 });
    arrow(ctx, 1150, 460, 1290, 460, { color: C.muted, width: 2.6, progress: p(t, 591.4, 0.4), head: 10 });
    // bypass arrow after delete
    if (del > 0) {
      arrow(ctx, 610, 620, 1290, 620, { color: C.orange, width: 2.6, progress: del, head: 10, curve: 55 });
      text(ctx, 'no encoder', 950, 700, { size: 30, color: C.orange, align: 'center', alpha: del });
    }
    ctx.restore();

    if (a > 0) {
      text(ctx, 'test one says: you can fire the training', W / 2, 260, {
        size: 36, color: C.green, align: 'center', alpha: p(t, q.recap - 0.1, 0.6) * (1 - 0.4 * fire),
      });
    }
    if (fire > 0) {
      text(ctx, 'so fire the whole specialist?', W / 2, 740, {
        size: 40, color: C.fg, align: 'center', alpha: fire,
      });
    }
    if (turn > 0) {
      ctx.save();
      ctx.globalAlpha = turn;
      line(ctx, 160, 820, 1760, 820, { color: C.purple, width: 2, progress: turn });
      text(ctx, 'that is where the paper turns', W / 2, 890, {
        size: 36, color: C.purple, align: 'center',
      });
      ctx.restore();
    }
  },
};

export default [setup, budget, free, webssl, pretrainedLM, late, recap];
