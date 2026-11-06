# Học tiếng Anh

The app has three doors: **Học tiếng Anh** (hear a word, tap the right picture), **Phát triển tư duy** (nine thinking games) and **Ôn bài** (go through a topic's words one card at a time, then play them). Parents type the child's name once; praise and the wrong-answer line use it.

Topics: Động vật (32), Trái cây (14), Màu sắc (14), Hình dạng (14), Đồ vật (28), Hành động (15), Bộ phận cơ thể (14), Nghề nghiệp (10), Xe cộ (10), Thời tiết (14).

### Levels

Every word in `src/lib/words.ts` has a level, and each list runs from easy to hard:

1. First words: things a Vietnamese toddler sees every day, short to say, easy to tell apart on a board of six. Each topic has exactly six.
2. Still everyday, but longer or less frequent.
3. Farther from home life, or easy to mix up with a level-1 word.
4. Big topics only (animals, objects): zoo and sea animals, less common household things.

The choice follows early-vocabulary data (Wordbank / MacArthur-Bates CDI: dog, duck, ball, cup and banana are among the first English words) and the Cambridge Pre A1 Starters word list for the later levels.

Words open a few at a time (`src/lib/progress.ts`). A topic starts with its level-1 words. When the child taps the right picture on the first try in 6 of the last 8 rounds, the next 2 words open. A word that just opened is asked in the next round or two, next to pictures the child already knows, and missed words come back more often. Crossing into a new level shows **Lên cấp 2!** instead of **Đúng rồi!**. Topic buttons show a small staircase (one step per level) and how many words are open. Ôn bài walks through the open words only. The thinking games use level 1–2 words. Progress is saved per topic in the browser, like the stars.

### Pictures

Animals, fruit, objects and actions are photos in `public/cards` (Wikimedia Commons; see `public/cards/CREDITS-*.txt`). Body cards are original cartoons. Jobs and vehicles are illustrations from the new UI. Color cards are fields of that color; gold and silver have a soft metallic sheen. Shape cards are one solid shape on a light background. Weather cards are clay-style cartoon scenes drawn as inline SVG in `src/components/weather.tsx`. A small 1–6 badge marks the card's place on the board.

Speech comes from Google Translate, through `/api/speech`, because the browser cannot call Translate directly. A round speaks the English word when it starts, when **Nghe lại** is pressed, and when Space is pressed. A correct tap plays "Bạn <name> giỏi quá"; a wrong tap plays "Bạn <name> chọn sai rồi", shakes that card, and stays on the same round. Short clips are cached in memory on the server.

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
