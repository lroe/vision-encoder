# Vision Encoder — localhost preview

An 18:33 animated explainer for **“Unbundling Multimodal Vision Encoding”** (arXiv 2611.17334).

Everything is drawn live in the browser on a 1920×1080 canvas. No MP4 was rendered.

## Run it

```bash
node preview/server.mjs
```

Then open **http://localhost:4173/**

Keep the terminal process alive while you watch. If you are running it on another port:

```bash
PORT=5173 node preview/server.mjs
```

## Controls

| Key / control | Action |
| --- | --- |
| Space | play / pause |
| ← → | seek 5 seconds |
| J / L | seek 10 seconds |
| S / B | next / previous scene |
| M | mute |
| F | fullscreen |
| click canvas | play / pause |

The player fades away while playing. Move the mouse to bring it back. For a clean 1080p viewing frame, press **F** and leave the mouse alone for a few seconds.

The chapter ticks on the scrub bar mark the 54 scenes. The small label in the player chrome is navigation only; it is not drawn into the video.

## Stills for review

Add `capture=1` to hide the player, and `t=` in seconds:

```text
http://localhost:4173/preview/?capture=1&t=753.2
http://localhost:4173/preview/?capture=1&t=153&scale=2
```

`scale=2` renders a 3840×2160 still.

## How it is made

- `preview/js/kit.js` — canvas drawing kit: typography, line work, icons, charts, photo mosaic
- `preview/js/scenes/*.js` — 54 timed scenes across the full narration
- `preview/js/data/timeline.js` — generated word-level timings
- `whisper_words.json` — faster-whisper output for the supplied `audio.wav`
- `align.py` — aligns whisper words to the known narration script (similarity ≈ 0.963)

No build step and no npm dependencies. The font files are in `preview/public/fonts/`.

## Timing

Visual cues are looked up from the narration by phrase, e.g. `at('ten trillion')`, so the text and diagrams land on the spoken word rather than on an estimate. Scene boundaries follow the paragraph timings, with short fades through the Dracula background.

Voiceover: `audio.wav` (the provided track). The canvas renders at 60 fps; the transport follows `audio.currentTime` so audio and picture stay locked when seeking.
