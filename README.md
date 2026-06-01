# NIMEKA TV — Anime Streaming Web

Web nonton anime sub indo, powered by Sanka Vollerei API (Otakudesu).

## Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Wouter (routing)
- HLS.js (video streaming)

## Setup Local

```bash
npm install
npm run dev
```

## Deploy ke Vercel (via GitHub)

1. Push repo ini ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project → Import dari GitHub
3. Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Klik Deploy — selesai!

> File `vercel.json` sudah ada, jadi semua route (misalnya `/anime/xxx`, `/watch/xxx`) tidak akan 404.

## API
Menggunakan [Sanka Vollerei API](https://www.sankavollerei.com/anime/) untuk data Otakudesu.
