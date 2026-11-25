import {
  W, H, C, F, text, card, pill, icon, p, enter, line, arrow, bracket, underline,
  count, rr, clamp, lerp, easeInOut, vectorStrip, measure, drawPhoto, numberedChip,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  visionOnly: at('vision only', 83),
  fortyOne: at('forty point one', 83),
  fortyTwo: at('forty two point three', 83),
  fortyFive: at('forty five point zero', 83),
  belong: at('desk has to belong', 83),
  scales: at('and it scales', 84),
  tracks: at('tracks the encoder', 84),
  pretrained: at('next how most of us work', 85),
  oneSeven: at('one point seven billion', 85),
  trillion: at('trillion text tokens', 85),
  infusion: at('in fusion', 85),
  heavy: at('heavier design', 85),
  sat: at('where it sat', 85),
  speed: at('on to speed', 86),
  ttft: at('time to first token', 87),
  h200: at('h two hundred', 87),
  sixteen: at('sixteen requests', 87),
  faster: at('clearly faster', 87),
  freeFast: at('encoder free is fastest', 87),
  slower: at('three percent slower', 87),
  batching: 986.0,
  measure: at('measure it', 88),
  limits: at('before you go delete', 89),
  sameImages: 1002.5,
  dense: 1014.0,
  smallImages: 1026.7,
  mix: 1033.9,
  fine: at('fine tuning', 94),
  rules: at('four rules', 95),
  rule1: at('stop budgeting', 96),
  rule2: at('parameter budget', 97),
  rule3: at('recognition scores', 98),
  rule4: at('own mix', 99),
  endToEnd: at('end to end', 100),
  paid: at('never the part doing the work', 101),
  secret: 1088.5,
  moe: at('mixture of experts', 103),
  next: at('next video', 104),
};

// ---------------------------------------------------------------- vision-only

const visionOnly = {
  id: 't3-vision-only',
  title: 'A vision-only desk',
  start: 886.58,
  end: 913.64,
  draw(ctx, t) {
    const intro = p(t, q.visionOnly - 0.2, 0.6);
    const b1 = p(t, q.fortyOne - 0.2, 0.6);
    const b2 = p(t, q.fortyTwo - 0.2, 0.6);
    const b3 = p(t, q.fortyFive - 0.2, 0.6);
    const belong = p(t, q.belong - 0.2, 0.6);

    text(ctx, 'third check: must it be vision-only?', W / 2, 200, {
      size: 36, color: C.muted, align: 'center', alpha: intro,
    });
    const bars = [
      { label: 'shared, wider', v: 40.1, y: 320, color: C.muted, a: b1 },
      { label: 'desk for everyone', v: 42.3, y: 440, color: C.muted, a: b2 },
      { label: 'image-only desk', v: 45.0, y: 560, color: C.green, a: b3 },
    ];
    const ghostA = p(t, 887.0, 0.8) * 0.12;
    const bx = 660;
    const bw = 840;
    const scale = bw / 50;
    // refs
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.setLineDash([8, 8]);
    line(ctx, bx + 39 * scale, 290, bx + 39 * scale, 660, { color: C.orange, width: 1.6 });
    line(ctx, bx + 44.4 * scale, 290, bx + 44.4 * scale, 660, { color: C.green, width: 1.6 });
    ctx.setLineDash([]);
    ctx.restore();
    bars.forEach((b) => {
      if (b.a <= 0.001) {
        rr(ctx, bx, b.y, bw, 42, 8);
        ctx.fillStyle = 'rgba(248,248,242,0.1)';
        ctx.globalAlpha = ghostA;
        ctx.fill();
        ctx.globalAlpha = 1;
        text(ctx, b.label, 300, b.y + 30, { size: 30, color: C.muted, alpha: Math.min(0.5, ghostA * 4) });
        return;
      }
      ctx.save();
      ctx.globalAlpha = b.a;
      text(ctx, b.label, 300, b.y + 30, { size: 30, color: C.fg });
      rr(ctx, bx, b.y, bw, 42, 8);
      ctx.fillStyle = 'rgba(248,248,242,0.07)';
      ctx.fill();
      rr(ctx, bx, b.y, b.v * scale * b.a, 42, 8);
      ctx.fillStyle = b.color;
      ctx.fill();
      text(ctx, b.v.toFixed(1), bx + b.v * scale + 18, b.y + 32, { size: 34, weight: 500 });
      ctx.restore();
    });
    // reference labels
    text(ctx, 'encoder-free 39.0', 980, 260, { size: 26, color: C.orange });
    text(ctx, 'scratch 44.4', 1430, 260, { size: 26, color: C.green });

    if (belong > 0) {
      ctx.save();
      ctx.globalAlpha = belong;
      icon(ctx, 'desk', 300, 700, 90, { color: C.purple, width: 2.8 });
      text(ctx, 'the desk has to belong to the image tokens', 960, 760, {
        size: 34, color: C.fg, align: 'center',
      });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- scales

const scales = {
  id: 't3-scales',
  title: 'It scales',
  start: 913.64,
  end: 923.06,
  draw(ctx, t) {
    const a = p(t, q.scales - 0.2, 0.7);
    const track = p(t, q.tracks - 0.2, 0.7);
    ctx.save();
    ctx.globalAlpha = a;
    line(ctx, 340, 700, 1380, 700, { color: 'rgba(248,248,242,0.24)', width: 2 });
    line(ctx, 340, 280, 340, 700, { color: 'rgba(248,248,242,0.24)', width: 2 });
    text(ctx, 'avg VQA', 350, 250, { size: 30, color: C.muted });
    text(ctx, 'model size', 860, 760, { size: 30, color: C.muted, align: 'center' });
    const xs = [420, 640, 1040, 1280];
    const inf = [500, 480, 460, 440];
    const enc = [510, 490, 470, 450];
    const free = [590, 580, 575, 570];
    ctx.globalAlpha = a;
    for (let i = 0; i < 4; i++) {
      text(ctx, ['0.6B', '1.7B', '4B', '6.4B'][i], xs[i], 740, { size: 26, color: C.muted, align: 'center' });
      ctx.fillStyle = C.purple;
      ctx.beginPath(); ctx.arc(xs[i], inf[i], 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.green;
      ctx.beginPath(); ctx.arc(xs[i], enc[i], 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.orange;
      ctx.beginPath(); ctx.arc(xs[i], free[i], 8, 0, Math.PI * 2); ctx.fill();
    }
    line(ctx, 420, 500, 1280, 440, { color: C.purple, width: 2.6 });
    line(ctx, 420, 510, 1280, 450, { color: C.green, width: 2.6 });
    line(ctx, 420, 590, 1280, 570, { color: C.orange, width: 2.6 });
    text(ctx, 'in-fusion', 1310, 445, { size: 28, color: C.purple });
    text(ctx, 'encoder', 1310, 478, { size: 28, color: C.green });
    text(ctx, 'encoder-free', 1310, 585, { size: 28, color: C.orange });
    ctx.restore();

    if (track > 0) {
      text(ctx, 'in-fusion tracks the encoder at every size', W / 2, 860, {
        size: 34, color: C.fg, align: 'center', alpha: track,
      });
      text(ctx, 'encoder-free trails', 1310, 625, { size: 26, color: C.red, alpha: track });
    }
  },
};

// ---------------------------------------------------------------- pretrained LM

const pretrained = {
  id: 't3-pretrained',
  title: 'Starting from a trained LM',
  start: 923.06,
  end: 951.76,
  draw(ctx, t) {
    const setup = p(t, q.pretrained - 0.2, 0.7);
    const inf = p(t, q.infusion - 0.3, 0.7);
    const heavy = p(t, q.heavy - 0.2, 0.7);
    const sat = p(t, q.sat - 0.2, 0.6);

    // Top setup.
    ctx.save();
    ctx.globalAlpha = setup;
    card(ctx, 300, 190, 1320, 150, { fill: C.surface, stroke: 'rgba(189,147,249,0.25)', r: 16 });
    text(ctx, '1.7B language model', 340, 250, { size: 34, color: C.purple });
    text(ctx, 'pretrained on 1 trillion text tokens', 340, 298, { size: 28, color: C.muted });
    arrow(ctx, 1120, 265, 1220, 265, { color: C.muted, width: 3, progress: p(t, 929.5, 0.5), head: 12 });
    pill(ctx, 1380, 265, '+ vision', { size: 30, color: C.bg, bg: C.cyan, padX: 18, padY: 8, align: 'center' });
    ctx.restore();

    // Bars.
    const bars = [
      { label: 'in-fusion', sub: 'copies the bottom 8 floors', v: 0.86, y: 430, color: C.purple, a: inf },
      { label: 'from scratch', sub: 'the encoder reference', v: 0.86, y: 550, color: C.green, a: inf },
      { label: 'full vision copy', sub: '3.5× vision-only parameters', v: 0.74, y: 670, color: C.red, a: heavy },
    ];
    const bx = 560;
    const bw = 780;
    const ghostBars = p(t, 924.0, 0.8) * 0.1;
    bars.forEach((b) => {
      if (b.a <= 0.001) {
        rr(ctx, bx, b.y, bw, 34, 8);
        ctx.fillStyle = 'rgba(248,248,242,0.1)';
        ctx.globalAlpha = ghostBars;
        ctx.fill();
        ctx.globalAlpha = 1;
        text(ctx, b.label, 300, b.y + 22, { size: 30, color: b.color, alpha: 0.3 });
        text(ctx, b.sub, 300, b.y + 56, { size: 24, color: C.muted, alpha: 0.25 });
        return;
      }
      ctx.save();
      ctx.globalAlpha = b.a;
      text(ctx, b.label, 300, b.y + 22, { size: 30, color: b.color });
      text(ctx, b.sub, 300, b.y + 56, { size: 24, color: C.muted });
      rr(ctx, bx, b.y, bw, 34, 8);
      ctx.fillStyle = 'rgba(248,248,242,0.07)';
      ctx.fill();
      rr(ctx, bx, b.y, bw * b.v * b.a, 34, 8);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.restore();
    });
    if (sat > 0) {
      text(ctx, 'same score', 1400, 470, { size: 26, color: C.green, alpha: sat });
      text(ctx, 'behind', 1400, 710, { size: 26, color: C.red, alpha: sat });
      text(ctx, 'more capacity did not help', 960, 840, { size: 34, color: C.fg, align: 'center', alpha: sat });
      text(ctx, 'where it sat did', 960, 890, { size: 34, color: C.green, align: 'center', alpha: sat });
    }
  },
};

// ---------------------------------------------------------------- speed

const speed = {
  id: 'speed',
  title: 'Speed',
  start: 951.76,
  end: 996.6,
  draw(ctx, t) {
    const a = p(t, q.speed - 0.2, 0.7);
    const ttft = p(t, q.ttft - 0.2, 0.6);
    const h200 = p(t, q.h200 - 0.2, 0.5);
    const req = p(t, q.sixteen - 0.2, 0.5);
    const faster = p(t, q.faster - 0.2, 0.6);
    const freeFast = p(t, q.freeFast - 0.2, 0.6);
    const slower = p(t, q.slower - 0.2, 0.6);

    text(ctx, 'time to first token', W / 2, 170, { size: 40, color: C.fg, align: 'center', alpha: ttft });
    text(ctx, 'H200 · 16 requests · 448px image + 256 text tokens', W / 2, 220, {
      size: 28, color: C.muted, align: 'center', alpha: Math.max(h200, req),
    });

    const lanes = [
      { y: 320, label: 'separate encoder', segs: [['request', 170, C.muted], ['encoder', 300, C.cyan], ['backbone', 380, C.purple], ['first token', 190, C.fg]], wait: true, color: C.cyan, a: a },
      { y: 470, label: 'in-fusion', segs: [['request', 170, C.muted], ['early vision layers', 430, C.green], ['backbone', 280, C.purple], ['first token', 190, C.fg]], wait: false, color: C.green, a: a },
      { y: 620, label: 'encoder-free', segs: [['request', 170, C.muted], ['backbone', 500, C.orange], ['first token', 190, C.fg]], wait: false, color: C.orange, a: a },
    ];
    lanes.forEach((lane) => {
      if (lane.a <= 0.001) return;
      ctx.save();
      ctx.globalAlpha = lane.a;
      text(ctx, lane.label, 280, lane.y + 36, { size: 30, color: lane.color, align: 'right' });
      let x = 320;
      lane.segs.forEach(([label, w, color]) => {
        card(ctx, x, lane.y, w, 52, { fill: 'rgba(248,248,242,0.04)', stroke: 'rgba(248,248,242,0.12)', r: 8, lw: 1.2 });
        text(ctx, label, x + w / 2, lane.y + 33, { size: 24, color, align: 'center' });
        x += w;
      });
      if (lane.wait) {
        bracket(ctx, 490, 790, lane.y + 80, { color: C.red, width: 1.8, tick: 8 });
        text(ctx, 'wait for the encoder', 640, lane.y + 116, { size: 26, color: C.red });
      }
      ctx.restore();
    });

    if (faster > 0) {
      text(ctx, 'in-fusion is clearly faster', W / 2, 760, { size: 34, color: C.green, align: 'center', alpha: faster });
    }
    if (freeFast > 0) {
      text(ctx, 'encoder-free is fastest — and loses on quality', W / 2, 810, {
        size: 30, color: C.orange, align: 'center', alpha: freeFast,
      });
    }

    // Training + batching notes.
    if (slower > 0) {
      ctx.save();
      ctx.globalAlpha = slower;
      card(ctx, 250, 860, 660, 110, { fill: C.surface, stroke: 'rgba(255,184,108,0.25)', r: 12 });
      text(ctx, 'training:', 280, 904, { size: 28, color: C.muted });
      text(ctx, 'about 3% slower at 4B', 280, 946, { size: 30, color: C.orange });
      ctx.restore();
    }
    const batch = p(t, q.batching - 0.2, 0.6);
    if (batch > 0) {
      ctx.save();
      ctx.globalAlpha = batch;
      card(ctx, 960, 860, 700, 110, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 12 });
      text(ctx, 'with batching:', 990, 904, { size: 28, color: C.muted });
      text(ctx, 'measure it in your own stack', 990, 946, { size: 30, color: C.fg });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- limits

const limits = {
  id: 'limits',
  title: 'What it does not prove',
  start: 996.6,
  end: 1045.76,
  draw(ctx, t) {
    const intro = p(t, 996.8, 0.7);
    text(ctx, 'before you delete SigLIP', W / 2, 150, { size: 36, color: C.muted, align: 'center', alpha: intro });

    const cards = [
      { cue: q.sameImages, n: '1', title: 'same images as everything else', sub: 'a released encoder with far more data might still help', icon: 'image', color: C.cyan },
      { cue: q.dense, n: '2', title: 'dense models only', sub: 'up to 6.4B · mixtures of experts untested', icon: 'layers', color: C.purple },
      { cue: q.smallImages, n: '3', title: 'small training images', sub: '224 × 224 · higher resolution left for later', icon: 'grid', color: C.orange },
      { cue: q.mix, n: '4', title: 'one data mix', sub: 'tuned on the scratch encoder at 1.7B', icon: 'flask', color: C.yellow },
    ];
    const ghost = p(t, 997.0, 0.8) * 0.2;
    cards.forEach((c, i) => {
      const a = p(t, c.cue - 0.15, 0.6);
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 240 + col * 760;
      const y = 260 + row * 240;
      if (a <= 0.001) {
        card(ctx, x, y, 680, 190, { fill: null, stroke: 'rgba(248,248,242,0.3)', r: 16, alpha: ghost, dash: [8, 10] });
        return;
      }
      ctx.save();
      ctx.globalAlpha = a;
      card(ctx, x, y, 680, 190, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 16 });
      numberedChip(ctx, x + 46, y + 46, Number(c.n), { color: c.color, size: 46 });
      text(ctx, c.title, x + 90, y + 62, { size: 30, color: C.fg });
      text(ctx, c.sub, x + 90, y + 116, { size: 26, color: C.muted, maxWidth: 550 });
      ctx.restore();
    });

    const fine = p(t, q.fine - 0.2, 0.6);
    if (fine > 0) {
      ctx.save();
      ctx.globalAlpha = fine;
      card(ctx, 240, 840, 1440, 130, { fill: 'rgba(80,250,123,0.055)', stroke: 'rgba(80,250,123,0.28)', r: 14 });
      icon(ctx, 'check', 270, 874, 56, { color: C.green, width: 3.2 });
      text(ctx, 'fine-tuning a released model with SigLIP inside?', 350, 890, { size: 30, color: C.fg });
      text(ctx, 'nothing here tells you to rip it out.', 350, 934, { size: 34, color: C.green });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- rules

const rules = {
  id: 'rules',
  title: 'Four rules',
  start: 1045.76,
  end: 1085.32,
  draw(ctx, t) {
    const intro = p(t, 1046.0, 0.6);
    text(ctx, 'four rules', W / 2, 150, { size: 40, color: C.muted, align: 'center', alpha: intro });

    const rows = [
      { cue: q.rule1, n: 1, text: 'skip the separate encoder stage; start images at update one', color: C.cyan },
      { cue: q.rule2, n: 2, text: 'spend the dropped encoder budget on vision-only weights in the first layers', color: C.green },
      { cue: q.rule3, n: 3, text: 'judge encoders on reading text and charts, not recognition scores', color: C.yellow },
      { cue: q.rule4, n: 4, text: 'measure time to first token with your own request mix', color: C.purple },
    ];
    rows.forEach((r, i) => {
      const a = p(t, r.cue - 0.15, 0.6);
      if (a <= 0.001) return;
      const y = 230 + i * 150;
      ctx.save();
      ctx.globalAlpha = a;
      card(ctx, 240, y, 1440, 120, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 14 });
      numberedChip(ctx, 290, y + 60, r.n, { color: r.color, size: 52 });
      text(ctx, r.text, 350, y + 72, { size: 32, color: C.fg });
      ctx.restore();
    });

    const end = p(t, q.endToEnd - 0.2, 0.7);
    if (end > 0) {
      ctx.save();
      ctx.globalAlpha = end;
      card(ctx, 240, 840, 1440, 140, { fill: 'rgba(189,147,249,0.06)', stroke: 'rgba(189,147,249,0.3)', r: 16 });
      icon(ctx, 'layers', 280, 872, 76, { color: C.purple, width: 2.8 });
      text(ctx, 'train the whole thing as one system', 390, 892, { size: 36, color: C.fg });
      text(ctx, 'not a pile of parts built for different goals', 390, 938, { size: 28, color: C.muted });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- close

const close = {
  id: 'close',
  title: 'The next video',
  start: 1085.32,
  end: 1113.6,
  draw(ctx, t) {
    const paid = p(t, q.paid - 0.1, 0.8);
    const secret = p(t, q.secret - 0.2, 0.6);
    const moe = p(t, q.moe - 0.2, 0.8);
    const next = p(t, q.next - 0.2, 0.8);

    if (paid > 0) {
      ctx.save();
      ctx.globalAlpha = paid * (1 - p(t, q.moe - 0.6, 0.7));
      text(ctx, 'the part we were paying for', W / 2, 400, { size: 52, color: C.muted, align: 'center' });
      text(ctx, 'was never the part doing the work', W / 2, 480, { size: 52, color: C.fg, align: 'center' });
      underline(ctx, W / 2 - 430, 510, 860, { color: C.green, width: 4, progress: p(t, 1087.2, 0.7), alpha: 0.8 });
      ctx.restore();
    }

    if (secret > 0) {
      text(ctx, 'one thing left:', W / 2, 610, {
        size: 34, color: C.yellow, align: 'center', alpha: secret * (1 - p(t, q.moe - 0.2, 0.5)),
      });
    }

    if (moe > 0) {
      ctx.save();
      ctx.globalAlpha = moe;
      text(ctx, 'all of it was tested on dense models', W / 2, 220, {
        size: 34, color: C.muted, align: 'center',
      });
      // Router to experts.
      card(ctx, 260, 330, 180, 100, { fill: C.surface, stroke: 'rgba(248,248,242,0.15)', r: 12 });
      text(ctx, 'tokens', 350, 388, { size: 30, align: 'center' });
      text(ctx, 'router', 830, 300, { size: 30, color: C.yellow, align: 'center' });
      const experts = [
        { x: 1020, y: 260, label: 'expert 1', color: C.muted },
        { x: 1400, y: 260, label: 'expert 2', color: C.muted },
        { x: 1020, y: 440, label: 'expert 3', color: C.muted },
        { x: 1400, y: 440, label: 'vision-only', color: C.green, hot: true },
      ];
      line(ctx, 440, 380, 780, 380, { color: C.muted, width: 2 });
      experts.forEach((e, i) => {
        line(ctx, 800, 380, e.x, e.y + 50, { color: e.hot ? C.green : C.muted, width: 1.6, alpha: e.hot ? 1 : 0.4 });
        card(ctx, e.x, e.y, 300, 100, { fill: C.surface, stroke: e.hot ? 'rgba(80,250,123,0.4)' : 'rgba(248,248,242,0.12)', r: 12 });
        text(ctx, e.label, e.x + 150, e.y + 60, { size: 28, color: e.hot ? C.green : C.muted, align: 'center' });
      });
      text(ctx, 'mix the experts and one can host the vision capacity', W / 2, 650, {
        size: 32, color: C.fg, align: 'center',
      });
      text(ctx, 'untested here — the authors leave it for future work', W / 2, 700, {
        size: 28, color: C.muted, align: 'center',
      });
      ctx.restore();
    }

    if (next > 0) {
      ctx.save();
      ctx.globalAlpha = next;
      card(ctx, 460, 760, 1000, 220, { fill: C.surface, stroke: 'rgba(189,147,249,0.4)', r: 20, glow: 20 });
      text(ctx, 'next video', 500, 812, { size: 26, color: C.purple });
      text(ctx, 'How mixture-of-experts routes tokens', 500, 866, { size: 36, color: C.fg });
      text(ctx, 'and where a vision-only expert fits', 500, 914, { size: 28, color: C.muted });
      arrow(ctx, 1360, 870, 1420, 870, { color: C.fg, width: 3, head: 12, progress: next });
      ctx.restore();
    }

    // Citation.
    const cite = p(t, 1108.0, 0.7);
    if (cite > 0) {
      text(ctx, 'arXiv 2611.17334 · Unbundling Multimodal Vision Encoding', W / 2, 1040, {
        size: 24, color: C.dim, align: 'center', alpha: cite,
      });
    }
  },
};

export default [visionOnly, scales, pretrained, speed, limits, rules, close];
