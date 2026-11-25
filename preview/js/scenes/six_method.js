import {
  W, H, C, F, text, card, pill, icon, p, enter, line, arrow, bracket, underline,
  count, rr, clamp, lerp, easeInOut, vectorStrip, measure,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  trap: at('trap is the budget', 35),
  score: at('same score', 37),
  trillions: at('trillions of tokens', 37),
  comparisons: at('most comparisons', 37),

  lifetime: at('lifetime compute', 38),
  add: at('add up the compute', 38),
  oneTotal: at('one total', 38),
  sameTotal: at('same total', 38),
  removed: at('removed every other difference', 39),

  scratch: at('everything trained from scratch', 40),
  textdata: at('same text data', 40),
  imagedata: at('same image', 40),
  lmdesign: at('same language model design', 40),
  ladder: at('ladder of sizes', 40),
  optimizer: at('same optimizer', 40),
  vit: at('same zero point four', 40),
  images: at('same images', 40),
  res: at('two hundred twenty four', 40),
  tokens: at('two hundred fifty six tokens', 40),

  four: at('four recipes', 41),
  fourth: at('fourth one', 41),
  steal: at('steal', 41),

  exam: at('how do they score', 42),
  instruction: at('instruction tuning', 42),
  sixteen: at('sixteen image tests', 42),
  groups: at('four groups', 42),
  vqa: at('average v q a', 42),
  language: at('twelve language tests', 42),

  runs: at('over two hundred runs', 43),
  three: at('three tests', 43),
  testOne: at('test one', 43),

  money: at('about the money', 44),
  del: at('delete an entire stage', 45),
  question: at('question is simple', 46),
  training: at('training of its own', 46),
  ten: at('ten years', 46),
  onjob: at('learns on the job', 46),
};

// ---------------------------------------------------------------- trap

const trap = {
  id: 'trap',
  title: 'The budget trap',
  start: 318.32,
  end: 344.38,
  draw(ctx, t) {
    const intro = 1 - p(t, q.trap - 0.3, 0.6);
    if (intro > 0) {
      ctx.save();
      ctx.globalAlpha = intro;
      // warning triangle
      ctx.strokeStyle = C.yellow;
      ctx.lineWidth = 4;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(960, 270);
      ctx.lineTo(1075, 470);
      ctx.lineTo(845, 470);
      ctx.closePath();
      ctx.stroke();
      text(ctx, '!', 960, 438, { size: 120, weight: 500, color: C.yellow, align: 'center' });
      text(ctx, 'there is a trap', 960, 590, { size: 46, align: 'center', alpha: p(t, 320.2, 0.6) });
      text(ctx, 'if the test is not fair, the numbers mean nothing', 960, 650, {
        size: 30, color: C.red, align: 'center', alpha: p(t, 324.9, 0.6),
      });
      ctx.restore();
    }

    const lanes = p(t, q.trap - 0.1, 0.8);
    if (lanes <= 0) return;

    ctx.save();
    ctx.globalAlpha = lanes;
    const startX = 760;
    const endX = 1480;

    // Start / finish lines.
    line(ctx, startX, 380, startX, 740, { color: 'rgba(248,248,242,0.28)', width: 2, dash: [6, 7] });
    line(ctx, endX, 380, endX, 740, { color: 'rgba(248,248,242,0.28)', width: 2, dash: [6, 7] });
    text(ctx, 'start', startX, 360, { size: 28, color: C.dim, align: 'center' });
    text(ctx, 'same score', endX + 70, 560, { size: 34, color: C.fg, align: 'left', alpha: p(t, q.score - 0.1, 0.5) });

    // Race bars.
    const barH = 54;
    text(ctx, 'pretrained', 300, 490, { size: 34, color: C.cyan });
    text(ctx, 'from scratch', 300, 650, { size: 34, color: C.green });
    rr(ctx, startX, 460, endX - startX, barH, 10);
    ctx.fillStyle = 'rgba(139,233,253,0.22)';
    ctx.fill();
    rr(ctx, startX, 620, endX - startX, barH, 10);
    ctx.fillStyle = 'rgba(80,250,123,0.22)';
    ctx.fill();

    // Hidden pre-race chunk.
    const hidden = p(t, q.trillions - 0.25, 0.8);
    if (hidden > 0) {
      const wx = lerp(startX, 360, hidden);
      ctx.save();
      rr(ctx, wx, 460, startX - wx, barH, 10);
      ctx.clip();
      ctx.fillStyle = 'rgba(139,233,253,0.055)';
      ctx.fillRect(wx, 460, startX - wx, barH);
      ctx.strokeStyle = 'rgba(139,233,253,0.28)';
      ctx.lineWidth = 1.4;
      for (let xx = wx - barH; xx < startX + barH; xx += 15) {
        line(ctx, xx, 460 + barH, xx + barH, 460, { color: 'rgba(139,233,253,0.28)', width: 1.2, rough: 0 });
      }
      ctx.restore();
      ctx.save();
      rr(ctx, wx, 460, startX - wx, barH, 10);
      ctx.strokeStyle = 'rgba(139,233,253,0.55)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      text(ctx, 'trillions of tokens', (wx + startX) / 2, 430, { size: 32, color: C.cyan, align: 'center', alpha: hidden });
      text(ctx, 'before the race', (wx + startX) / 2, 556, { size: 30, color: C.muted, align: 'center', alpha: hidden });
      // Not counted bracket
      const nc = p(t, q.comparisons - 0.1, 0.6);
      if (nc > 0) {
        ctx.save();
        ctx.globalAlpha = hidden * nc;
        bracket(ctx, wx, startX - 12, 606, { color: C.red, width: 2, progress: nc, tick: 10 });
        text(ctx, 'usually not counted', (wx + startX) / 2, 790, { size: 34, color: C.red, align: 'center' });
        ctx.restore();
      }
    }

    ctx.restore();
  },
};

// ---------------------------------------------------------------- lifetime compute

const lifetime = {
  id: 'lifetime',
  title: 'Lifetime compute',
  start: 344.38,
  end: 360.96,
  draw(ctx, t) {
    const start = p(t, 344.5, 0.7);
    const stack = p(t, q.add - 0.2, 0.8);
    const total = p(t, q.oneTotal - 0.1, 0.6);
    const same = p(t, q.sameTotal - 0.2, 0.7);

    // Segment legend.
    const segs = [
      { key: 'language', label: 'language pretraining', color: C.muted, w: 0.46, cue: 346.5 },
      { key: 'encoder', label: 'encoder pretraining', color: C.cyan, w: 0.24, cue: 350.8 },
      { key: 'multi', label: 'multimodal training', color: C.purple, w: 0.30, cue: 354.2 },
    ];
    const bx = 340;
    const bw = 1240;
    const by = 320;
    const bh = 70;

    const gA = p(t, 344.6, 0.7) * 0.12;
    if (gA > 0) {
      rr(ctx, bx, by, bw, bh, 10);
      ctx.fillStyle = C.fg;
      ctx.globalAlpha = gA;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.save();
    ctx.globalAlpha = start;

    text(ctx, 'add every stage', bx, 270, { size: 34, color: C.muted, alpha: p(t, q.add - 0.4, 0.5) });
    // Full stacked bar.
    let x = bx;
    segs.forEach((s, i) => {
      const a = p(t, s.cue, 0.6);
      if (a <= 0) return;
      const w = bw * s.w;
      rr(ctx, x, by, w * stack, bh, i === 0 ? 10 : 0);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = start * a * 0.8;
      ctx.fill();
      ctx.globalAlpha = start;
      text(ctx, s.label, x + 14, by + 42, { size: 26, color: C.bg, alpha: a * (w > 260 ? 1 : 0) });
      x += w;
    });
    // Total line.
    if (total > 0) {
      line(ctx, bx + bw * total, by - 24, bx + bw * total, by + bh + 24, { color: C.fg, width: 3, progress: total });
      text(ctx, 'one total', bx + bw, by + bh + 66, { size: 34, color: C.fg, align: 'right', alpha: total });
    }

    // Three recipes with the same total.
    const recipes = [
      { label: 'pretrained', color: C.cyan, parts: [0.46, 0.24, 0.30], y: 560 },
      { label: 'from scratch', color: C.green, parts: [0.55, 0.10, 0.35], y: 660 },
      { label: 'encoder-free', color: C.orange, parts: [0.60, 0.00, 0.40], y: 760 },
    ];
    recipes.forEach((r, ri) => {
      const a = p(t, q.sameTotal - 0.4 + ri * 0.15, 0.6) * same;
      if (a <= 0) return;
      text(ctx, r.label, bx - 24, r.y + 22, { size: 32, color: r.color, align: 'right', alpha: a });
      let xx = bx;
      ctx.save();
      ctx.globalAlpha = a;
      r.parts.forEach((pt, i) => {
        const w = bw * pt;
        if (w <= 0) return;
        rr(ctx, xx, r.y, w, 28, i === 0 ? 6 : 0);
        ctx.fillStyle = [C.muted, C.cyan, C.purple][i];
        ctx.globalAlpha = a * (i === 0 ? 0.28 : 0.8);
        ctx.fill();
        xx += w;
      });
      rr(ctx, bx, r.y, bw, 28, 6);
      ctx.strokeStyle = 'rgba(248,248,242,0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      text(ctx, 'same total', bx + bw, r.y + 58, { size: 28, color: C.muted, align: 'right', alpha: a });
    });

    // Differences removed.
    const rem = p(t, q.removed - 0.2, 0.6);
    if (rem > 0) {
      ctx.save();
      ctx.globalAlpha = rem;
      icon(ctx, 'check', 260, 864, 50, { color: C.green, width: 3.2 });
      text(ctx, 'everything else: fixed', 330, 902, { size: 34, color: C.green });
      ctx.restore();
    }

    ctx.restore();
  },
};

// ---------------------------------------------------------------- equalized checklist

const equalized = {
  id: 'equalized',
  title: 'One variable at a time',
  start: 360.96,
  end: 387.16,
  draw(ctx, t) {
    const cards = [
      { cue: q.scratch, label: 'from scratch', sub: 'even the language model' },
      { cue: q.textdata, label: 'same text data', sub: 'same text corpus' },
      { cue: q.imagedata, label: 'same image data', sub: 'same photos and captions' },
      { cue: q.lmdesign, label: 'same LM design', sub: 'Qwen 3 style transformer' },
      { cue: q.optimizer, label: 'same optimizer', sub: 'identical training recipe' },
      { cue: q.vit, label: 'same 0.4B ViT', sub: 'vision transformer, when present' },
      { cue: q.res, label: '224 × 224 images', sub: 'small training images' },
      { cue: q.tokens, label: '256 tokens each', sub: 'same image token count' },
    ];
    const ghost = p(t, 360.9, 0.7) * 0.13;
    cards.forEach((c, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 240 + col * 700;
      const y = 200 + row * 170;
      const a = p(t, c.cue - 0.15, 0.55);
      if (a <= 0.001) {
        card(ctx, x, y, 640, 140, {
          fill: null, stroke: 'rgba(248,248,242,0.3)', r: 14, alpha: ghost, dash: [8, 10],
        });
        return;
      }
      ctx.save();
      ctx.globalAlpha = a;
      card(ctx, x, y, 640, 140, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 14 });
      icon(ctx, 'check', x + 28, y + 42, 52, { color: C.green, width: 3.2 });
      text(ctx, c.label, x + 104, y + 64, { size: 34, color: C.fg });
      text(ctx, c.sub, x + 104, y + 104, { size: 28, color: C.muted });
      ctx.restore();
    });

    // Size ladder.
    const lad = p(t, q.ladder - 0.2, 0.6);
    if (lad > 0) {
      text(ctx, 'sizes', 240, 936, { size: 30, color: C.muted, alpha: lad });
      const sizes = ['0.6B', '1.7B', '4B', '6.4B'];
      sizes.forEach((s, i) => {
        const a = lad * p(t, q.ladder + i * 0.12, 0.4);
        pill(ctx, 360 + i * 150, 922, s, { size: 30, color: C.fg, bg: C.surface2, padX: 18, padY: 7, alpha: a, align: 'center' });
      });
      underline(ctx, 240, 962, 700, { color: C.purple, width: 3, progress: lad, alpha: 0.7 });
    }
  },
};

// ---------------------------------------------------------------- four recipes

const recipes = {
  id: 'four',
  title: 'Four recipes',
  start: 387.16,
  end: 395.62,
  draw(ctx, t) {
    const items = [
      { label: 'pretrained', icon: 'brain', color: C.cyan, cue: q.four - 0.1 },
      { label: 'from scratch', icon: 'image', color: C.green, cue: q.four + 0.3 },
      { label: 'encoder-free', icon: 'grid', color: C.orange, cue: q.four + 0.7 },
      { label: '?', icon: 'lock', color: C.purple, cue: q.fourth - 0.1, locked: true },
    ];
    items.forEach((it, i) => {
      const a = p(t, it.cue, 0.6);
      if (a <= 0.001) return;
      const x = 180 + i * 400;
      const y = 330;
      card(ctx, x, y, 360, 380, {
        fill: C.surface, stroke: it.locked ? 'rgba(189,147,249,0.4)' : `${it.color}55`,
        r: 20, accent: it.color, accentW: 3, alpha: a,
        glow: it.locked ? 18 * p(t, q.steal - 0.2, 0.6) : 0,
      });
      icon(ctx, it.icon, x + 120, y + 76, 120, { color: it.color, width: 3, alpha: a });
      text(ctx, it.label, x + 30, y + 300, { size: 36, color: C.fg, alpha: a });
      if (it.locked) {
        text(ctx, 'saved for later', x + 30, y + 344, { size: 28, color: C.purple, alpha: a });
      }
    });
    const steal = p(t, q.steal - 0.2, 0.5);
    text(ctx, 'the one you will want', W / 2, 840, {
      size: 38, color: C.purple, align: 'center', alpha: steal,
    });
  },
};

// ---------------------------------------------------------------- exam

const exam = {
  id: 'exam',
  title: 'How they score',
  start: 395.62,
  end: 421.74,
  draw(ctx, t) {
    const ex = p(t, q.exam - 0.2, 0.6);
    const inst = p(t, q.instruction - 0.2, 0.6);
    const six = p(t, q.sixteen - 0.2, 0.7);
    const groups = p(t, q.groups - 0.2, 0.7);
    const vqa = p(t, q.vqa - 0.2, 0.8);
    const lang = p(t, q.language - 0.2, 0.7);

    if (inst > 0) {
      card(ctx, 520, 120, 880, 100, { fill: 'rgba(139,233,253,0.06)', stroke: 'rgba(139,233,253,0.25)', r: 14, alpha: inst });
      icon(ctx, 'check', 540, 144, 52, { color: C.cyan, width: 3.2, alpha: inst });
      text(ctx, 'short course: follow instructions about images', 612, 178, { size: 30, color: C.fg, alpha: inst });
    }

    const groupData = [
      { label: 'general questions', color: C.cyan },
      { label: 'knowledge', color: C.orange },
      { label: 'text and charts', color: C.yellow },
      { label: 'counting · depth', color: C.purple },
    ];
    const examGhost = p(t, 396.0, 0.8) * 0.12;
    groupData.forEach((g, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 220 + col * 420;
      const y = 300 + row * 220;
      const a = six * p(t, 403.9 + i * 0.1, 0.5);
      if (a <= 0.001) {
        card(ctx, x, y, 380, 180, { fill: null, stroke: 'rgba(248,248,242,0.3)', r: 14, alpha: examGhost, dash: [8, 10] });
        return;
      }
      ctx.save();
      ctx.globalAlpha = a;
      card(ctx, x, y, 380, 180, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 14 });
      text(ctx, g.label, x + 24, y + 46, { size: 30, color: g.color });
      for (let k = 0; k < 4; k++) {
        const da = p(t, 403.9 + i * 0.1 + k * 0.07, 0.3);
        ctx.globalAlpha = a * da;
        ctx.fillStyle = g.color;
        ctx.beginPath();
        ctx.arc(x + 38 + k * 34, y + 92, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      text(ctx, '4 tests', x + 24, y + 146, { size: 26, color: C.muted });
      ctx.restore();
    });

    if (groups > 0) {
      bracket(ctx, 220, 1020, 800, { color: C.muted, progress: groups, width: 1.6 });
      text(ctx, '16 image tests · 4 groups', 620, 850, { size: 30, color: C.muted, align: 'center', alpha: groups });
    }

    // Grade card.
    if (vqa > 0) {
      ctx.save();
      ctx.globalAlpha = vqa;
      card(ctx, 1240, 300, 500, 420, { fill: '#20222E', stroke: 'rgba(189,147,249,0.3)', r: 20 });
      text(ctx, 'average VQA', 1490, 400, { size: 38, color: C.purple, align: 'center' });
      text(ctx, 'one grade', 1490, 470, { size: 64, weight: 500, align: 'center' });
      text(ctx, 'visual question answering', 1490, 530, { size: 26, color: C.muted, align: 'center' });
      text(ctx, '16 tests → 1 number', 1490, 636, { size: 30, color: C.muted, align: 'center' });
      ctx.restore();
    }

    // Language tests.
    if (lang > 0) {
      ctx.save();
      ctx.globalAlpha = lang;
      text(ctx, '12 language tests', 220, 940, { size: 32, color: C.cyan });
      for (let i = 0; i < 12; i++) {
        const a = p(t, q.language + i * 0.05, 0.3);
        ctx.globalAlpha = lang * a;
        ctx.fillStyle = C.cyan;
        ctx.beginPath();
        ctx.arc(250 + i * 48, 980, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      text(ctx, 'to check the model still reads', 900, 990, { size: 28, color: C.muted, alpha: lang });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- two hundred runs

const runs = {
  id: 'runs',
  title: 'Two hundred runs',
  start: 421.74,
  end: 429.66,
  draw(ctx, t) {
    const grid = p(t, q.runs - 0.2, 0.8);
    const tests = p(t, q.three - 0.2, 0.7);
    const one = p(t, q.testOne - 0.2, 0.6);

    if (grid > 0) {
      const cols = 20;
      const rows = 10;
      const cell = 18;
      const gap = 10;
      const gw = cols * cell + (cols - 1) * gap;
      const gx = W / 2 - gw / 2;
      const gy = 260;
      ctx.save();
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const idx = j * cols + i;
          const a = grid * p(t, 421.9 + idx * 0.003, 0.25);
          if (a <= 0) continue;
          ctx.globalAlpha = a * 0.8;
          ctx.fillStyle = idx % 17 === 0 ? C.cyan : idx % 23 === 0 ? C.purple : C.current;
          rr(ctx, gx + i * (cell + gap), gy + j * (cell + gap), cell, cell, 3);
          ctx.fill();
        }
      }
      ctx.restore();
      text(ctx, '200+ training runs', W / 2, 650, { size: 36, color: C.muted, align: 'center', alpha: grid });
    }

    if (tests > 0) {
      const items = [
        { n: 1, label: 'training', color: C.yellow },
        { n: 2, label: 'capacity', color: C.cyan },
        { n: 3, label: 'placement', color: C.purple },
      ];
      items.forEach((it, i) => {
        const a = tests * p(t, q.three + i * 0.12, 0.5);
        const x = 420 + i * 380;
        const y = 700;
        ctx.save();
        ctx.globalAlpha = a;
        card(ctx, x, y, 340, 190, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 14 });
        text(ctx, String(it.n), x + 32, y + 64, { size: 48, color: it.color });
        text(ctx, it.label, x + 90, y + 60, { size: 32, color: C.muted });
        if (it.n === 1) underline(ctx, x + 28, y + 92, 150, { color: C.yellow, width: 3, progress: one, alpha: 0.8 });
        ctx.restore();
      });
    }
  },
};

// ---------------------------------------------------------------- test one question

const testOne = {
  id: 'test-one-q',
  title: 'Test one: the training',
  start: 429.66,
  end: 450.38,
  draw(ctx, t) {
    const money = p(t, q.money - 0.15, 0.6);
    const del = p(t, q.del - 0.2, 0.7);
    const question = p(t, q.question - 0.2, 0.7);
    const ten = p(t, q.ten - 0.2, 0.6);

    // Three-stage pipeline.
    const stageY = 330;
    const stages = [
      { label: 'language', color: C.muted, x: 300 },
      { label: 'encoder', color: C.cyan, x: 760 },
      { label: 'multimodal', color: C.purple, x: 1220 },
    ];
    stages.forEach((s, i) => {
      const a = p(t, 430.0 + i * 0.12, 0.5) * (1 - 0.65 * question);
      card(ctx, s.x, stageY, 360, 150, { fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 14, alpha: a });
      text(ctx, s.label, s.x + 180, stageY + 90, { size: 34, color: s.color, align: 'center', alpha: a });
    });
    arrow(ctx, 670, stageY + 75, 750, stageY + 75, { color: C.muted, width: 2.6, progress: p(t, 430.4, 0.4), head: 10 });
    arrow(ctx, 1130, stageY + 75, 1210, stageY + 75, { color: C.muted, width: 2.6, progress: p(t, 430.6, 0.4), head: 10 });

    if (money > 0) {
      text(ctx, 'test one is about the money', W / 2, 220, { size: 36, color: C.yellow, align: 'center', alpha: money * (1 - question) });
    }
    if (del > 0) {
      ctx.save();
      ctx.globalAlpha = del * (1 - 0.7 * question);
      // Cut the encoder stage.
      ctx.strokeStyle = C.red;
      ctx.lineWidth = 4;
      ctx.setLineDash([9, 8]);
      ctx.strokeRect(760, stageY - 12, 360, 174);
      ctx.setLineDash([]);
      line(ctx, 730, stageY + 35, 1150, stageY + 150, { color: C.red, width: 3, progress: del });
      pill(ctx, 940, 545, 'delete this stage?', { size: 28, color: C.red, bg: 'rgba(255,85,85,0.08)', padX: 16, padY: 7, alpha: del, align: 'center' });
      ctx.restore();
    }

    // The question.
    if (question > 0) {
      ctx.save();
      ctx.globalAlpha = question;
      text(ctx, 'does the vision encoder need', W / 2, 640, { size: 46, color: C.fg, align: 'center' });
      text(ctx, 'training of its own?', W / 2, 700, { size: 46, color: C.yellow, align: 'center' });
      underline(ctx, W / 2 - 220, 718, 440, { color: C.yellow, width: 3, progress: p(t, q.training, 0.5) });
      ctx.restore();
    }

    // Experience vs on the job.
    if (ten > 0) {
      const panels = [
        { x: 300, icon: 'clock', label: '10 years first', color: C.cyan },
        { x: 1040, icon: 'people', label: 'learns on the job', color: C.green },
      ];
      panels.forEach((pn, i) => {
        const a = p(t, q.ten + i * 0.4, 0.6);
        ctx.save();
        ctx.globalAlpha = a;
        card(ctx, pn.x, 760, 580, 190, { fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 16 });
        icon(ctx, pn.icon, pn.x + 34, 792, 100, { color: pn.color, width: 2.8 });
        text(ctx, pn.label, pn.x + 170, 852, { size: 36, color: C.fg });
        text(ctx, 'which one wins?', pn.x + 170, 898, { size: 28, color: C.muted });
        ctx.restore();
      });
    }
  },
};

export default [trap, lifetime, equalized, recipes, exam, runs, testOne];
