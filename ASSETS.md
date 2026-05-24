# TETRA — Asset Drop-In Spec

Status: site uses a cinematic dark-editorial design. **Until an approved hero showreel is available, the hero intentionally uses a warm gold gradient** so there are no broken or misleading media requests. Add the approved assets below, then re-enable the hero `<video>` block in `index.html`.

---

## 1. Hero showreel loop (highest impact)

**Recommended asset locations:**
```
public/hero/
├── poster.webp           ~80 KB     1920×1080 first frame
├── loop.av1.mp4          ~600 KB    AV1, no audio
├── loop.h265.mp4         ~900 KB    H.265 (hvc1), no audio
└── loop.webm             ~1.2 MB    VP9, no audio
```

**Source video pick:** clip a 6–8 sec segment from `Klout × Enhanced` (most cinematic). Pick a moment with motion — slow camera move beats a static shot.

**ffmpeg encode commands** (run after exporting a master `hero-master.mp4` at 1920×1080, no audio):

```bash
# Poster (first frame as WebP)
ffmpeg -i hero-master.mp4 -vframes 1 -c:v libwebp -quality 78 public/hero/poster.webp

# AV1 (best compression, modern browsers)
ffmpeg -i hero-master.mp4 -an -c:v libsvtav1 -crf 36 -preset 6 -movflags +faststart public/hero/loop.av1.mp4

# H.265 / HEVC (Safari, iOS)
ffmpeg -i hero-master.mp4 -an -c:v libx265 -crf 28 -tag:v hvc1 -preset slow -movflags +faststart public/hero/loop.h265.mp4

# WebM / VP9 (fallback)
ffmpeg -i hero-master.mp4 -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 public/hero/loop.webm
```

When re-enabled, keep the hero video desktop-only and use the poster for small screens so mobile cost stays low.

---

## 2. Portfolio videos (replace Google Drive iframes)

Currently the four portfolio pieces show lightweight designed covers and load Google Drive embeds only after the visitor presses Play. This avoids blank embeds and unnecessary third-party loading. Drop in self-hosted versions when convenient:

```
public/videos/
├── klout-featured.mp4 + .webm + klout-poster.webp
├── rova.mp4           + .webm + rova-poster.webp
├── chocodot.mp4       + .webm + chocodot-poster.webp
└── patriot.mp4        + .webm + patriot-poster.webp
```

Spec per file: ≤ 4 MB MP4, ≤ 60 KB WebP poster. After encoding, replace each `.video-embed` click-to-load implementation with `<video poster="..." preload="none" controls>` plus `<source>` tags, or preserve the covers and mount the local video after Play.

---

## 3. Client logos (optional polish)

The brand strip currently shows wordmarks (typeset names). For more premium feel, drop in greyscale SVG logos:

```
public/logos/klout.svg, rova.svg, chocodot.svg, patriot.svg, enhanced.svg, transmigrasi.svg
```

Each ~3 KB. The CSS will need a tiny update to swap `<span class="brand-mark">` for `<img class="brand-mark" src="..." alt="...">`.

---

## 4. Self-hosted fonts (later perf win)

Currently Inter + Instrument Serif load from Google Fonts (acceptable — under 90 KB total with `display=swap`). To shave another ~150 ms on first paint, download once:

```
public/fonts/
├── Inter-Variable.woff2          (rsms.me/inter — single file, ~110 KB)
├── InstrumentSerif-Regular.woff2 (fonts.google.com download)
└── InstrumentSerif-Italic.woff2
```

Then replace the `<link>` tags in `index.html` with an `@font-face` block in `styles.css` and `preload` Inter Variable.

---

## Order of operations (recommended)

1. **Hero loop** — biggest visual lift, drop-in is plug-and-play.
2. Self-hosted portfolio videos — escape Drive throttling.
3. Client SVG logos — refinement.
4. Self-hosted fonts — last 10% perf.
