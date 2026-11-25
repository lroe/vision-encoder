import {
  W, H, C, F, text, card, pill, icon, p, enter, line, arrow, bracket, underline,
  count, rr, clamp, lerp, easeInOut, vectorStrip, measure, drawPhoto,
} from '../kit.js';
import { at, start as lineStart, end as lineEnd } from '../data/timeline.js';

const q = {
  design: at('change how you design', 58),
  drop: at('drop the encoder', 59),
  mattered: at('only part that mattered', 59),
  question: at('question', 60),
  desk: at('desk that only image tokens', 60),
  sameBudget: at('same budget', 61),
  sameData: at('same data', 61),
  lost: at('encoder free lost', 62),
  overall: at('image benchmarks', 62),
  textCharts: at('text and charts', 62),
  language: at('language scores', 62),
  objection: at('obvious objection', 63),
  pointFour: at('zero point four billion', 63),
  extra: at('same extra parameters', 64),
  wider: at('wider layers', 64),
  deeper: at('deeper layers', 64),
  both: at('both', 64),
  flat: at('stayed flat', 64),
  langUp: at('language score went up', 64),
  sameParams: at('same parameters', 65),
  worth: at('worth much more', 65),
  another: at('another objection', 66),
  multiply: at('one multiplication', 66),
  twoLayer: at('two layer', 66),
  fourLayer: at('four layer', 66),
  neither: at('neither came close', 66),
  bigger: at('bigger images', 66),
  caught: at('caught up', 66),
  grow: at('models grow', 67),
  sizes: at('five sizes', 67),
  threeX: at('three times the compute', 67),
  real: at('real world', 68),
  inkling: at('inkling', 68),
  encoder: at('vision encoder', 68),
  note: at('one more note', 69),
  lr: at('learning rate', 69),
  blended: at('blended', 69),
};

// ---------------------------------------------------------------- test two intro

const intro = {
  id: 't2-intro',
  title: 'Test two: the desk',
  start: 602.36,
  end: 625.72,
  draw(ctx, t) {
    const design = p(t, q.design - 0.2, 0.6);
    const drop = p(t, q.drop - 0.2, 0.8);
    const matter = p(t, q.mattered - 0.2, 0.6);
    const question = p(t, q.question - 0.1, 0.7);
    const cards = p(t, 618.0, 0.8);

    // Number 2 badge.
    text(ctx, '2', 260, 260, { size: 120, weight: 500, color: C.cyan });
    text(ctx, 'the test that changes design', 380, 245, {
      size: 40, color: C.muted, alpha: design,
    });

    // Pipeline.
    const stages = [
      { label: 'patches', x: 300, color: C.orange },
      { label: 'encoder', x: 760, color: C.cyan },
      { label: 'language model', x: 1220, color: C.purple },
    ];
    stages.forEach((s, i) => {
      const a = p(t, 602.8 + i * 0.15, 0.6);
      const gone = i === 1 ? drop : 0;
      ctx.save();
      ctx.globalAlpha = a * (1 - 0.8 * gone);
      card(ctx, s.x, 350, 360, 150, { fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 14 });
      text(ctx, s.label, s.x + 180, 438, { size: 34, color: s.color, align: 'center' });
      ctx.restore();
    });
    arrow(ctx, 670, 425, 750, 425, { color: C.muted, width: 2.6, progress: p(t, 603.2, 0.4), head: 10 });
    arrow(ctx, 1130, 425, 1210, 425, { color: C.muted, width: 2.6, progress: p(t, 603.4, 0.4), head: 10 });

    if (drop > 0) {
      ctx.save();
      ctx.globalAlpha = drop;
      line(ctx, 720, 330, 1160, 520, { color: C.red, width: 3, progress: drop });
      pill(ctx, 940, 560, 'saved compute', { size: 28, color: C.green, bg: 'rgba(80,250,123,0.08)', padX: 14, padY: 6, alpha: drop, align: 'center' });
      ctx.restore();
    }
    if (matter > 0) {
      text(ctx, 'but maybe the only part that mattered', W / 2, 610, {
        size: 34, color: C.red, align: 'center', alpha: matter,
      });
    }

    if (question > 0) {
      ctx.save();
      ctx.globalAlpha = question;
      text(ctx, 'does a model need a desk', W / 2, 690, { size: 44, align: 'center' });
      text(ctx, 'that only image tokens use?', W / 2, 744, { size: 44, color: C.yellow, align: 'center' });
      icon(ctx, 'desk', 1460, 665, 80, { color: C.yellow, width: 2.8, alpha: question });
      ctx.restore();
    }

    if (cards > 0) {
      const items = [
        { x: 260, label: 'encoder-free', color: C.orange, icon: 'grid' },
        { x: 1000, label: 'from scratch', color: C.green, icon: 'image' },
      ];
      items.forEach((it, i) => {
        const a = cards * p(t, 618.0 + i * 0.25, 0.6);
        ctx.save();
        ctx.globalAlpha = a;
        card(ctx, it.x, 790, 600, 140, { fill: C.surface, stroke: `${it.color}55`, r: 14, accent: it.color, accentW: 3 });
        icon(ctx, it.icon, it.x + 30, 812, 80, { color: it.color, width: 2.8 });
        text(ctx, it.label, it.x + 140, 846, { size: 34, color: C.fg });
        text(ctx, 'same budget · same data · 1.7B / 4B', it.x + 140, 888, { size: 28, color: C.muted });
        ctx.restore();
      });
    }
  },
};

// ---------------------------------------------------------------- test two results

const results = {
  id: 't2-results',
  title: 'Encoder-free lost',
  start: 625.72,
  end: 644.24,
  draw(ctx, t) {
    const lost = p(t, q.lost - 0.2, 0.6);
    const g1 = p(t, q.overall - 0.2, 0.7);
    const g2 = p(t, q.textCharts - 0.2, 0.7);
    const g3 = p(t, q.language - 0.2, 0.7);

    text(ctx, 'encoder-free lost', W / 2, 180, { size: 46, color: C.orange, align: 'center', alpha: lost });

    const base = 780;
    const maxH = 380;
    const scale = maxH / 50;
    const groups = [
      { x: 420, label: 'overall image score', a: g1, values: [44.4, 39.0], labels: ['44.4', '39.0'] },
      { x: 900, label: 'text + charts', a: g2, values: [38.2, 25.2], labels: ['38.2', '25.2'] },
      { x: 1380, label: 'language', a: g3, values: [40.0, 40.0], labels: ['≈', '≈'] },
    ];
    const ghost = p(t, 626.2, 0.8) * 0.08;
    groups.forEach((g) => {
      if (g.a <= 0.001) {
        const bw = 100;
        const gap = 40;
        [0, 1].forEach((i) => {
          const x = g.x - bw - gap / 2 + i * (bw + gap);
          rr(ctx, x, base - 320, bw, 320, 8);
          ctx.fillStyle = i === 0 ? C.green : C.orange;
          ctx.globalAlpha = ghost;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        text(ctx, g.label, g.x, 840, { size: 30, color: C.muted, align: 'center', alpha: ghost * 4 });
        return;
      }
      ctx.save();
      ctx.globalAlpha = g.a;
      text(ctx, g.label, g.x, 840, { size: 30, color: C.muted, align: 'center' });
      const bw = 100;
      const gap = 40;
      g.values.forEach((v, i) => {
        const h = v * scale * g.a;
        const x = g.x - bw - gap / 2 + i * (bw + gap);
        const color = i === 0 ? C.green : C.orange;
        rr(ctx, x, base - h, bw, h, 8);
        ctx.fillStyle = color;
        ctx.fill();
        text(ctx, g.labels[i], x + bw / 2, base - h - 20, {
          size: 38, weight: 500, color: C.fg, align: 'center',
        });
      });
      ctx.restore();
    });

    // Legend.
    const leg = p(t, 626.0, 0.6);
    text(ctx, 'from scratch', 680, 260, { size: 30, color: C.green, alpha: leg });
    text(ctx, 'encoder-free', 900, 260, { size: 30, color: C.orange, alpha: leg });
    text(ctx, 'language stays about the same', 1380, 900, {
      size: 30, color: C.muted, align: 'center', alpha: g3,
    });
  },
};

// ---------------------------------------------------------------- parameters

const params = {
  id: 't2-params',
  title: 'Same parameters, different place',
  start: 644.24,
  end: 666.44,
  draw(ctx, t) {
    const bars = p(t, q.extra - 0.2, 0.8);
    const wider = p(t, q.wider - 0.2, 0.5);
    const deeper = p(t, q.deeper - 0.2, 0.5);
    const both = p(t, q.both - 0.2, 0.5);
    const moved = p(t, q.sameParams - 0.2, 1.0);
    const worth = p(t, q.worth - 0.2, 0.6);

    // Bars.
    const base = 760;
    const maxH = 360;
    const scale = maxH / 50;
    const items = [
      { label: 'encoder-free', v: 39.0, a: p(t, 645.4, 0.6), color: C.orange },
      { label: 'wider', v: 38.6, a: wider, color: C.orange },
      { label: 'deeper', v: 38.7, a: deeper, color: C.orange },
      { label: 'both', v: 38.8, a: both, color: C.orange },
    ];
    const bx = 250;
    items.forEach((it, i) => {
      if (it.a <= 0.001) return;
      const x = bx + i * 170;
      const h = it.v * scale * it.a;
      ctx.save();
      ctx.globalAlpha = it.a * bars;
      rr(ctx, x, base - h, 90, h, 8);
      ctx.fillStyle = it.color;
      ctx.fill();
      text(ctx, it.v.toFixed(1), x + 45, base - h - 16, { size: 34, weight: 500, align: 'center' });
      text(ctx, it.label, x + 45, base + 38, { size: 28, color: C.muted, align: 'center' });
      ctx.restore();
    });
    // Scratch reference line.
    if (bars > 0) {
      ctx.save();
      ctx.globalAlpha = bars;
      ctx.setLineDash([10, 10]);
      line(ctx, 200, base - 44.4 * scale, 1000, base - 44.4 * scale, { color: C.green, width: 2 });
      ctx.setLineDash([]);
      text(ctx, 'scratch 44.4', 640, base - 44.4 * scale - 14, { size: 28, color: C.green });
      ctx.restore();
    }

    if (t > q.flat - 0.2) {
      text(ctx, 'image score stays flat', 620, 900, { size: 34, color: C.fg, align: 'center', alpha: p(t, q.flat - 0.2, 0.6) });
    }

    // Right panel: the 0.4B block moves.
    const px = 1170;
    const py = 330;
    card(ctx, px, py, 620, 300, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 18, alpha: p(t, 644.8, 0.7) });
    text(ctx, '0.4B parameters', px + 30, py + 60, { size: 34, color: C.cyan, alpha: p(t, 644.8, 0.7) });
    const blockX = lerp(px + 40, px + 400, moved);
    const blockY = lerp(py + 110, py + 190, moved);
    ctx.save();
    ctx.globalAlpha = p(t, 644.8, 0.7);
    for (let i = 0; i < 4; i++) {
      rr(ctx, blockX, blockY + i * 26, 140, 20, 4);
      ctx.fillStyle = i === 3 ? C.purple : C.cyan;
      ctx.globalAlpha = 0.7;
      ctx.fill();
    }
    ctx.restore();
    text(ctx, moved > 0.5 ? 'vision desk' : 'shared backbone', px + 310, py + 280, {
      size: 30, color: moved > 0.5 ? C.purple : C.muted, align: 'center',
    });
    if (worth > 0) {
      ctx.save();
      ctx.globalAlpha = worth;
      text(ctx, 'same count,', px + 490, py + 120, { size: 34, color: C.fg, align: 'right' });
      text(ctx, 'worth more', px + 490, py + 164, { size: 38, color: C.green, align: 'right' });
      icon(ctx, 'check', px + 510, py + 190, 56, { color: C.green, width: 3.2 });
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- patch embedding

const embed = {
  id: 't2-embed',
  title: 'Richer patch embeddings',
  start: 666.44,
  end: 686.08,
  draw(ctx, t) {
    const obj = p(t, q.another - 0.2, 0.6);
    const base = p(t, q.multiply - 0.2, 0.6);
    const two = p(t, q.twoLayer - 0.2, 0.6);
    const four = p(t, q.fourLayer - 0.2, 0.6);
    const neither = p(t, q.neither - 0.2, 0.6);
    const bigger = p(t, q.bigger - 0.2, 0.7);
    const caught = p(t, q.caught - 0.2, 0.6);

    const chartBase = 760;
    const scale = 360 / 50;
    const bars = [
      { label: 'one multiply', v: 39.0, a: base, color: C.orange },
      { label: 'two layers', v: 40.5, a: two, color: C.orange },
      { label: 'four layers', v: 35.9, a: four, color: C.orange },
    ];
    const embedGhost = p(t, 666.6, 0.7) * 0.12;
    bars.forEach((b, i) => {
      const x = 290 + i * 220;
      if (b.a <= 0.001) {
        rr(ctx, x, chartBase - 300, 120, 300, 8);
        ctx.fillStyle = C.orange;
        ctx.globalAlpha = embedGhost;
        ctx.fill();
        ctx.globalAlpha = 1;
        text(ctx, b.label, x + 60, chartBase + 40, { size: 30, color: C.muted, align: 'center', alpha: 0.35 });
        return;
      }
      const h = b.v * scale * b.a;
      ctx.save();
      ctx.globalAlpha = b.a;
      rr(ctx, x, chartBase - h, 120, h, 8);
      ctx.fillStyle = b.color;
      ctx.fill();
      text(ctx, b.v.toFixed(1), x + 60, chartBase - h - 18, { size: 36, weight: 500, align: 'center' });
      text(ctx, b.label, x + 60, chartBase + 40, { size: 30, color: C.muted, align: 'center' });
      ctx.restore();
    });
    if (base > 0) {
      ctx.save();
      ctx.globalAlpha = base;
      ctx.setLineDash([10, 10]);
      line(ctx, 220, chartBase - 44.4 * scale, 1000, chartBase - 44.4 * scale, { color: C.green, width: 2 });
      ctx.setLineDash([]);
      text(ctx, 'scratch 44.4', 680, chartBase - 44.4 * scale - 14, { size: 28, color: C.green });
      ctx.restore();
    }
    if (neither > 0) {
      text(ctx, 'not close at this image size', 620, 900, { size: 32, color: C.red, align: 'center', alpha: neither });
    }

    // Bigger image panel.
    const px = 1130;
    if (bigger > 0) {
      ctx.save();
      ctx.globalAlpha = bigger;
      card(ctx, px, 280, 620, 470, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 18 });
      text(ctx, 'bigger image', px + 30, 336, { size: 34, color: C.fg });
      text(ctx, 'squeezed into 256 tokens', px + 30, 374, { size: 28, color: C.muted });
      drawPhoto(ctx, px + 40, 400, 220, { radius: 10, grid: true, gridAlpha: 0.4, slice: 0.4 });
      // four-layer network
      card(ctx, px + 300, 410, 260, 180, { fill: C.well, stroke: 'rgba(139,233,253,0.3)', r: 12 });
      for (let i = 0; i < 4; i++) {
        card(ctx, px + 320, 426 + i * 38, 220, 24, { fill: 'rgba(139,233,253,0.09)', stroke: 'rgba(139,233,253,0.22)', r: 5, lw: 1 });
      }
      text(ctx, '4 layers', px + 430, 618, { size: 28, color: C.cyan, align: 'center' });
      if (caught > 0) {
        text(ctx, 'catches up', px + 310, 686, { size: 34, color: C.green, alpha: caught });
        icon(ctx, 'check', px + 470, 660, 52, { color: C.green, width: 3.2, alpha: caught });
      }
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- scaling + inkling

const scaling = {
  id: 't2-scaling',
  title: 'It scales',
  start: 686.08,
  end: 710.14,
  draw(ctx, t) {
    const chart = p(t, q.grow - 0.2, 0.7);
    const sizes = p(t, q.sizes - 0.2, 0.6);
    const three = p(t, q.threeX - 0.2, 0.6);
    const real = p(t, q.real - 0.2, 0.8);

    // Chart.
    ctx.save();
    ctx.globalAlpha = chart;
    line(ctx, 260, 700, 1200, 700, { color: 'rgba(248,248,242,0.25)', width: 2 });
    line(ctx, 260, 300, 260, 700, { color: 'rgba(248,248,242,0.25)', width: 2 });
    text(ctx, 'compute needed to match', 270, 270, { size: 30, color: C.muted });

    const xs = [360, 520, 800, 1060];
    const encYs = [560, 540, 510, 480];
    const freeYs = [440, 400, 360, 320];
    for (let i = 1; i < xs.length; i++) {
      line(ctx, xs[i - 1], encYs[i - 1], xs[i], encYs[i], { color: C.green, width: 3 });
      line(ctx, xs[i - 1], freeYs[i - 1], xs[i], freeYs[i], { color: C.orange, width: 3 });
    }
    xs.forEach((x, i) => {
      const a = sizes * p(t, 687.5 + i * 0.15, 0.4);
      text(ctx, ['0.6B', '1.7B', '4B', '6.4B'][i], x, 740, { size: 28, color: C.muted, align: 'center', alpha: a });
      ctx.globalAlpha = chart * a;
      ctx.fillStyle = C.green;
      ctx.beginPath(); ctx.arc(x, encYs[i], 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.orange;
      ctx.beginPath(); ctx.arc(x, freeYs[i], 8, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = chart;
    text(ctx, 'encoder', 1100, 488, { size: 30, color: C.green });
    text(ctx, 'encoder-free', 1100, 328, { size: 30, color: C.orange });
    if (three > 0) {
      ctx.save();
      ctx.globalAlpha = three;
      line(ctx, 500, 420, 500, 530, { color: C.yellow, width: 2, dash: [6, 6] });
      text(ctx, '≈ 3× compute', 560, 482, { size: 32, color: C.yellow });
      ctx.restore();
    }
    ctx.restore();

    // Inkling cards.
    if (real > 0) {
      const cards = [
        { x: 300, name: 'Inkling', sub: 'encoder-free', color: C.orange },
        { x: 1120, name: 'Inkling 2 Small', sub: '292M vision encoder', color: C.green },
      ];
      cards.forEach((c, i) => {
        const a = real * p(t, q.real + i * 0.3, 0.6);
        ctx.save();
        ctx.globalAlpha = a;
        card(ctx, c.x, 800, 560, 170, { fill: C.surface, stroke: `${c.color}55`, r: 16, accent: c.color, accentW: 3 });
        text(ctx, c.name, c.x + 32, 858, { size: 38, color: c.color });
        text(ctx, c.sub, c.x + 32, 906, { size: 30, color: C.muted });
        text(ctx, 'Thinking Machines', c.x + 32, 944, { size: 24, color: C.dim });
        ctx.restore();
      });
      arrow(ctx, 880, 885, 1100, 885, { color: C.muted, width: 3, progress: p(t, q.real + 0.4, 0.6), head: 12 });
      const enc = p(t, q.encoder - 0.1, 0.5);
      text(ctx, 'they added an encoder', 960, 1010, { size: 30, color: C.fg, align: 'center', alpha: enc });
    }
  },
};

// ---------------------------------------------------------------- earlier study

const study = {
  id: 't2-study',
  title: 'The earlier study',
  start: 710.14,
  end: 730.66,
  draw(ctx, t) {
    const note = p(t, q.note - 0.2, 0.7);
    const lr = p(t, q.lr - 0.2, 0.6);
    const blend = p(t, q.blended - 0.2, 0.6);

    card(ctx, 240, 300, 620, 360, { fill: C.surface, stroke: 'rgba(248,248,242,0.12)', r: 18, alpha: note });
    text(ctx, 'an earlier scaling study', 280, 370, { size: 36, color: C.fg, alpha: note });
    text(ctx, 'said encoder-free can match', 280, 430, { size: 30, color: C.muted, alpha: note });
    text(ctx, 'this paper disagrees', 280, 510, { size: 38, color: C.red, alpha: p(t, 716.0, 0.6) });
    if (lr <= 0.001) {
      card(ctx, 980, 300, 700, 160, { fill: null, stroke: 'rgba(255,184,108,0.25)', r: 14, alpha: 0.25, dash: [8, 10] });
      icon(ctx, 'curve', 1010, 332, 80, { color: C.orange, width: 2.8, alpha: 0.18 });
      text(ctx, 'trained too gently', 1120, 372, { size: 32, color: C.fg, alpha: 0.22 });
    }
    if (blend <= 0.001) {
      card(ctx, 980, 500, 700, 160, { fill: null, stroke: 'rgba(189,147,249,0.25)', r: 14, alpha: 0.25, dash: [8, 10] });
      text(ctx, 'blended scores', 1120, 578, { size: 32, color: C.fg, alpha: 0.22 });
    }

    if (lr > 0) {
      ctx.save();
      ctx.globalAlpha = lr;
      card(ctx, 980, 300, 700, 160, { fill: C.surface, stroke: 'rgba(255,184,108,0.28)', r: 14 });
      icon(ctx, 'curve', 1010, 332, 80, { color: C.orange, width: 2.8 });
      text(ctx, 'trained too gently', 1120, 372, { size: 32, color: C.fg });
      text(ctx, 'learning rate was too low', 1120, 414, { size: 28, color: C.muted });
      ctx.restore();
    }
    if (blend > 0) {
      ctx.save();
      ctx.globalAlpha = blend;
      card(ctx, 980, 500, 700, 160, { fill: C.surface, stroke: 'rgba(189,147,249,0.28)', r: 14 });
      // three colors merged into one
      [C.cyan, C.yellow, C.orange].forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.globalAlpha = blend * 0.55;
        rr(ctx, 1012 + i * 40, 550, 32, 56, 5);
        ctx.fill();
      });
      ctx.globalAlpha = blend;
      arrow(ctx, 1140, 578, 1210, 578, { color: C.muted, width: 2.4, head: 10 });
      rr(ctx, 1230, 550, 42, 56, 5);
      ctx.fillStyle = C.muted;
      ctx.fill();
      text(ctx, 'blended scores hide vision', 1300, 578, { size: 30, color: C.fg });
      ctx.restore();
    }

    text(ctx, 'two choices in the setup', 960, 720, { size: 32, color: C.muted, align: 'center', alpha: note });
  },
};

export default [intro, results, params, embed, scaling, study];
