export type Word = {
  id: string;
  en: string;
  vi: string;
};

export type Category = {
  id: string;
  label: string;
  words: Word[];
};

const animals: Word[] = [
  { id: "cat", en: "cat", vi: "mèo" },
  { id: "dog", en: "dog", vi: "chó" },
  { id: "bird", en: "bird", vi: "chim" },
  { id: "fish", en: "fish", vi: "cá" },
  { id: "duck", en: "duck", vi: "vịt" },
  { id: "cow", en: "cow", vi: "bò" },
  { id: "pig", en: "pig", vi: "heo" },
  { id: "rabbit", en: "rabbit", vi: "thỏ" },
  { id: "frog", en: "frog", vi: "ếch" },
  { id: "horse", en: "horse", vi: "ngựa" },
];

const fruits: Word[] = [
  { id: "apple", en: "apple", vi: "táo" },
  { id: "banana", en: "banana", vi: "chuối" },
  { id: "orange-fruit", en: "orange", vi: "cam" },
  { id: "grapes", en: "grapes", vi: "nho" },
  { id: "watermelon", en: "watermelon", vi: "dưa hấu" },
  { id: "strawberry", en: "strawberry", vi: "dâu tây" },
  { id: "mango", en: "mango", vi: "xoài" },
  { id: "pineapple", en: "pineapple", vi: "dứa" },
  { id: "pear", en: "pear", vi: "lê" },
  { id: "lemon", en: "lemon", vi: "chanh" },
];

const colors: Word[] = [
  { id: "red", en: "red", vi: "đỏ" },
  { id: "blue", en: "blue", vi: "xanh dương" },
  { id: "yellow", en: "yellow", vi: "vàng" },
  { id: "green", en: "green", vi: "xanh lá" },
  { id: "orange", en: "orange", vi: "cam" },
  { id: "purple", en: "purple", vi: "tím" },
  { id: "pink", en: "pink", vi: "hồng" },
  { id: "brown", en: "brown", vi: "nâu" },
  { id: "black", en: "black", vi: "đen" },
  { id: "white", en: "white", vi: "trắng" },
];

/** Flat fields for the color cards. These are paint chips, not photographs. */
export const colorSwatches: Record<string, string> = {
  red: "#e10600",
  blue: "#0057ff",
  yellow: "#ffe100",
  green: "#00a651",
  orange: "#ff6a00",
  purple: "#7a2ea8",
  pink: "#ff4f9a",
  brown: "#8a4b1f",
  black: "#111111",
  white: "#ffffff",
};

const shapes: Word[] = [
  { id: "circle", en: "circle", vi: "hình tròn" },
  { id: "square", en: "square", vi: "hình vuông" },
  { id: "triangle", en: "triangle", vi: "hình tam giác" },
  { id: "star", en: "star", vi: "hình ngôi sao" },
  { id: "heart", en: "heart", vi: "hình trái tim" },
  { id: "rectangle", en: "rectangle", vi: "hình chữ nhật" },
  { id: "oval", en: "oval", vi: "hình bầu dục" },
  { id: "diamond", en: "diamond", vi: "hình thoi" },
];

const objects: Word[] = [
  { id: "bowl", en: "bowl", vi: "bát" },
  { id: "chopsticks", en: "chopsticks", vi: "đũa" },
  { id: "motorbike", en: "motorbike", vi: "xe máy" },
  { id: "fan", en: "fan", vi: "quạt" },
  { id: "sandals", en: "sandals", vi: "dép" },
  { id: "helmet", en: "helmet", vi: "mũ bảo hiểm" },
  { id: "pot", en: "pot", vi: "nồi" },
  { id: "toothbrush", en: "toothbrush", vi: "bàn chải" },
  { id: "backpack", en: "backpack", vi: "cặp" },
  { id: "pillow", en: "pillow", vi: "gối" },
];

const actions: Word[] = [
  { id: "run", en: "run", vi: "chạy" },
  { id: "jump", en: "jump", vi: "nhảy" },
  { id: "eat", en: "eat", vi: "ăn" },
  { id: "sleep", en: "sleep", vi: "ngủ" },
  { id: "clap", en: "clap", vi: "vỗ tay" },
  { id: "drink", en: "drink", vi: "uống" },
  { id: "sit", en: "sit", vi: "ngồi" },
  { id: "walk", en: "walk", vi: "đi" },
];

const body: Word[] = [
  { id: "eye", en: "eye", vi: "mắt" },
  { id: "ear", en: "ear", vi: "tai" },
  { id: "nose", en: "nose", vi: "mũi" },
  { id: "mouth", en: "mouth", vi: "miệng" },
  { id: "hand", en: "hand", vi: "bàn tay" },
  { id: "foot", en: "foot", vi: "bàn chân" },
  { id: "head", en: "head", vi: "đầu" },
  { id: "hair", en: "hair", vi: "tóc" },
  { id: "arm", en: "arm", vi: "cánh tay" },
  { id: "knee", en: "knee", vi: "đầu gối" },
];

export const categories: Category[] = [
  { id: "animals", label: "Động vật", words: animals },
  { id: "fruits", label: "Trái cây", words: fruits },
  { id: "colors", label: "Màu sắc", words: colors },
  { id: "shapes", label: "Hình dạng", words: shapes },
  { id: "objects", label: "Đồ vật", words: objects },
  { id: "actions", label: "Hành động", words: actions },
  { id: "body", label: "Bộ phận cơ thể", words: body },
];

export function categoryById(id: string): Category {
  return categories.find((category) => category.id === id) ?? categories[0];
}
