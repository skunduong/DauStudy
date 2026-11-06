# Học tiếng Anh

Flashcard game for a toddler learning English. A card shows an English word (and a short Vietnamese meaning for the parent). Six pictures sit underneath. The child taps the picture that matches the word.

Categories: Động vật, Trái cây, Màu sắc, Hình dạng, Đồ vật, Hành động. Animals, fruit, objects, and actions are photos in `public/cards` (Wikimedia Commons; see `public/cards/CREDITS.txt`). Color cards are flat fields of that color, filling the card. Shape cards are one solid shape on a light background. A small 1–6 badge marks the card’s place on the board.

The home screen has three doors: Học tiếng Anh, Phát triển tư duy, and Ôn bài.

Speech comes from Google Translate, through `/api/speech`, because the browser cannot call Translate directly. Học tiếng Anh and Ôn bài speak the English word when a card appears, when **Nghe lại** is pressed, and when Space is pressed. Phát triển tư duy reads its Vietnamese instruction aloud when a game starts, so a child who cannot read still hears what to do. A correct tap plays “Bạn {tên} giỏi quá” and waits until that clip finishes before the next step. A wrong tap plays “Bạn {tên} chọn sai rồi”. Short clips are cached in memory on the server.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

The pictures still work if Google Translate does not answer. The game just stays quiet.
