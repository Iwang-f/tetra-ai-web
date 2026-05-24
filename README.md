# TETRA — AI Video Production Studio

Source code untuk situs **[tetra-ai-web.vercel.app](https://tetra-ai-web.vercel.app)**.

TETRA adalah studio produksi video AI di Indonesia — fokus pada iklan sinematik dengan turnaround cepat, AI-native pipeline.

## Stack

- Static HTML/CSS/JS (no framework)
- Deploy: Vercel (auto-deploy dari branch `main`)

## File utama

- `index.html` — landing page
- `styles.css` — semua styling, mobile breakpoints 768px & 480px
- `script.js` — theme toggle, hamburger menu, hero reveal, counters
- `privacy.html`, `terms.html` — legal pages

## Edit via HP

1. Buka repo ini di browser HP → tap file → ✏️ Edit → Commit
2. Atau buka `github.dev/Iwang-f/tetra-ai-web` (VS Code di browser)
3. Push otomatis trigger Vercel re-deploy

## Local dev

Buka `index.html` di browser, atau:

```bash
npx serve .
```
