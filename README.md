# Học tiếng Anh

Flashcard game for a toddler learning English. A card shows an English word (and a short Vietnamese meaning for the parent). Six pictures sit underneath. The child taps the picture that matches the word.

Categories: Động vật, Trái cây, Màu sắc, Hình dạng, Đồ vật, Hành động. Animals, fruit, objects, and actions are photos in `public/cards` (Wikimedia Commons; see `public/cards/CREDITS.txt`). Color cards are flat fields of that color, filling the card. Shape cards are one solid shape on a light background. Weather cards (Thời tiết) are cartoon scenes drawn as inline SVG in `src/components/weather.tsx`. A small 1–6 badge marks the card’s place on the board.

Speech comes from Google Translate, through `/api/speech`, because the browser cannot call Translate directly. A round speaks the English word (`tl=en`) when it starts, when **Nghe lại** is pressed, and when Space is pressed on the play screen. A correct tap plays “Bạn Đậu giỏi quá” (`tl=vi`) with “Đúng rồi!”. A wrong tap plays “Bạn Đậu chọn sai rồi” (`tl=vi`), shakes that card, and stays on the same round. Short clips are cached in memory on the server.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

The pictures still work if Google Translate does not answer. The game just stays quiet.

## Deploy (Cloudflare Pages)

The live site is the Pages project `hoccungbinhminh` (https://hoccungbinhminh.pages.dev). It runs the full Next.js server through [OpenNext](https://opennext.js.org/cloudflare), so `/api/speech` keeps working. It is not a static export. Wrangler needs Node 22+.

```bash
npx wrangler login
CF_BUILD=1 CI=1 npm run deploy
```

`npm run build:cf` builds into `.open-next/`, bundles the worker into `.open-next/assets/_worker.js/`, and writes `_routes.json` so static files skip the worker. `npm run preview:cf` serves that build locally.
