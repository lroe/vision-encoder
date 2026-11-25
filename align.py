import json, re, difflib

# ---------- load script ----------
raw = open('voiceover_narration.txt', encoding='utf-8').read().splitlines()
lines = []
for i, ln in enumerate(raw):
    s = ln.strip()
    if not s:
        continue
    lines.append({'n': len(lines) + 1, 'text': s, 'orig_index': i})

# ---------- load whisper ----------
wh = json.load(open('whisper_words.json'))
ww = []
for seg in wh['segments']:
    for w in seg.get('words', []):
        if w['w'].strip():
            ww.append({'w': w['w'].strip(), 'start': w['start'], 'end': w['end']})
print('whisper words:', len(ww))

NUM = {
    '0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five','6':'six','7':'seven','8':'eight','9':'nine',
    '10':'ten','11':'eleven','12':'twelve','13':'thirteen','14':'fourteen','15':'fifteen','16':'sixteen',
    '17':'seventeen','18':'eighteen','19':'nineteen','20':'twenty','24':'twenty four','28':'twenty eight',
    '30':'thirty','40':'forty','50':'fifty','60':'sixty','70':'seventy','80':'eighty','90':'ninety',
    '100':'hundred','200':'two hundred','224':'two hundred twenty four','256':'two hundred fifty six',
    '588':'five hundred eighty eight','292':'two hundred ninety two','1000':'thousand',
}
SPECIAL = {
    'siglip2':'siglip two', 'siglip-2':'siglip two', 'nyu':'n y u', 'metaclip':'meta clip',
    'webssl':'web s s l', 'cappa':'cap pa', 'h200':'h two hundred', 'ffn':'f f n',
    'in-fusion':'in fusion', 'vqa':'v q a', 'moe':'mixture of experts',
}

def norm_tokens(s):
    s = s.lower()
    s = s.replace('’', "'").replace('–', ' ').replace('—', ' ')
    s = re.sub(r'\$', '', s)
    # expand digit tokens
    def repl(m):
        tok = m.group(0)
        return ' ' + NUM.get(tok, tok) + ' '
    s = re.sub(r'\b\d+(?:\.\d+)?\b', repl, s)
    s = re.sub(r"[^a-z0-9']+", ' ', s)
    toks = s.split()
    out = []
    for t in toks:
        out.extend(SPECIAL.get(t, t).split())
    return out

script_words = []
for ln in lines:
    toks = norm_tokens(ln['text'])
    for j, tok in enumerate(toks):
        script_words.append({'w': tok, 'line': ln['n'], 'idx': j})
whisper_words = [{'w': t['w'].lower(), 'start': t['start'], 'end': t['end']} for t in ww]
# normalize whisper tokens similarly (strip punctuation)
for t in whisper_words:
    t['key'] = norm_tokens(t['w'])
# whisper may have tokens like "siglip2" -> "siglip two"; flatten into multiple keys with same time
flat = []
for t in whisper_words:
    for k in t['key']:
        flat.append({'w': k, 'start': t['start'], 'end': t['end']})

a = [t['w'] for t in script_words]
b = [t['w'] for t in flat]
sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
print('similarity:', round(sm.ratio(), 3))

times = [None] * len(a)
for block in sm.get_matching_blocks():
    for k in range(block.size):
        times[block.a + k] = (flat[block.b + k]['start'], flat[block.b + k]['end'])

# Fill missing runs by linear interpolation between anchors.
i = 0
while i < len(times):
    if times[i] is not None:
        i += 1
        continue
    j = i
    while j < len(times) and times[j] is None:
        j += 1
    left = times[i - 1] if i > 0 else None
    right = times[j] if j < len(times) else None
    if left and right:
        t0, t1 = left[1], right[0]
        n = j - i
        span = max(0.001, t1 - t0)
        total_chars = sum(len(a[k]) + 1 for k in range(i, j))
        acc = 0
        for k in range(i, j):
            acc += len(a[k]) + 1
            f = acc / total_chars
            st = t0 + span * (acc - (len(a[k]) + 1)) / total_chars
            en = t0 + span * f
            times[k] = (st, en)
    elif left:
        for k in range(i, j):
            times[k] = (left[1] + (k - i) * 0.08, left[1] + (k - i) * 0.08 + 0.08)
    elif right:
        for k in range(i, j):
            times[k] = (max(0, right[0] - (j - k) * 0.1), max(0, right[0] - (j - k - 1) * 0.1))
    else:
        for k in range(i, j):
            times[k] = (0.0, 0.1)
    i = j

for i, w in enumerate(script_words):
    w['start'], w['end'] = round(times[i][0], 3), round(times[i][1], 3)

# Group back into lines
line_out = []
for ln in lines:
    ws = [w for w in script_words if w['line'] == ln['n']]
    st = ws[0]['start'] if ws else 0
    en = ws[-1]['end'] if ws else 0
    line_out.append({'n': ln['n'], 'text': ln['text'], 'start': round(st, 3), 'end': round(en, 3), 'words': ws})

print('\nLINE TIMINGS')
for ln in line_out:
    print(f"{ln['n']:3d}  {ln['start']:7.2f}  {ln['end']:7.2f}  {ln['text'][:70]}")

# Write JS data
def jsstr(s):
    return json.dumps(s, ensure_ascii=False)
with open('preview/js/data/timeline.js', 'w', encoding='utf-8') as f:
    f.write('// Generated from faster-whisper word timings + the known narration script.\n')
    f.write('export const LINES = [\n')
    for ln in line_out:
        ws = ', '.join('{w:%s,s:%.3f,e:%.3f}' % (jsstr(w['w']), w['start'], w['end']) for w in ln['words'])
        f.write('  {n:%d,text:%s,start:%.3f,end:%.3f,words:[%s]},\n' % (ln['n'], jsstr(ln['text']), ln['start'], ln['end'], ws))
    f.write('];\n\n')
    f.write('export const WORD_ROWS = LINES.flatMap(l => l.words.map(w => ({...w, line:l.n})));\n\n')
    f.write('''export const DURATION = %s;

const byLine = new Map(LINES.map(l => [l.n, l]));

export function line(n) { return byLine.get(n); }
export function start(n) { const l = byLine.get(n); return l ? l.start : 0; }
export function end(n) { const l = byLine.get(n); return l ? l.end : 0; }
export function lineText(n) { const l = byLine.get(n); return l ? l.text : ''; }

// Find a phrase in the aligned script. Returns the start time of its first word.
export function at(phrase, fromLine = 0, occurrence = 1) {
  const q = phrase.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').trim().split(/\\s+/).filter(Boolean);
  let found = 0;
  for (let i = 0; i < WORD_ROWS.length; i++) {
    const row = WORD_ROWS[i];
    if (row.line < fromLine) continue;
    let ok = true;
    for (let j = 0; j < q.length; j++) {
      if (!WORD_ROWS[i + j] || WORD_ROWS[i + j].w !== q[j]) { ok = false; break; }
    }
    if (ok) {
      found++;
      if (found === occurrence) return row.s;
    }
  }
  if (fromLine > 0) return at(phrase, 0, occurrence);
  return 0;
}

export function atEnd(phrase, fromLine = 0, occurrence = 1) {
  const q = phrase.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').trim().split(/\\s+/).filter(Boolean);
  let found = 0;
  for (let i = 0; i < WORD_ROWS.length; i++) {
    const row = WORD_ROWS[i];
    if (row.line < fromLine) continue;
    let ok = true;
    for (let j = 0; j < q.length; j++) {
      if (!WORD_ROWS[i + j] || WORD_ROWS[i + j].w !== q[j]) { ok = false; break; }
    }
    if (ok) {
      found++;
      if (found === occurrence) return WORD_ROWS[i + q.length - 1].e;
    }
  }
  return 0;
}
''' % round(wh['dur'], 3))

print('\nwrote preview/js/data/timeline.js')
