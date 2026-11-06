/**
 * 1: everyday words a toddler meets at home. Each topic starts with exactly these.
 * 2 and 3: opened a couple of words at a time as the child gets the earlier ones right.
 */
export type Level = 1 | 2 | 3;

export type Word = {
  id: string;
  en: string;
  vi: string;
  level: Level;
};

export type Category = {
  id: string;
  label: string;
  words: Word[];
};

/*
 * Each list runs from easy to hard, and the level numbers follow that order: words open in the
 * order they appear. Every topic has six level-1 words, so the first board is always full.
 * The first word is also the topic's icon.
 */

const animals: Word[] = [
  { id: "cat", en: "cat", vi: "mèo", level: 1 },
  { id: "dog", en: "dog", vi: "chó", level: 1 },
  { id: "duck", en: "duck", vi: "vịt", level: 1 },
  { id: "fish", en: "fish", vi: "cá", level: 1 },
  { id: "bird", en: "bird", vi: "chim", level: 1 },
  { id: "chicken", en: "chicken", vi: "gà", level: 1 },
  { id: "pig", en: "pig", vi: "heo", level: 2 },
  { id: "cow", en: "cow", vi: "bò", level: 2 },
  { id: "frog", en: "frog", vi: "ếch", level: 2 },
  { id: "monkey", en: "monkey", vi: "khỉ", level: 2 },
  { id: "rabbit", en: "rabbit", vi: "thỏ", level: 2 },
  { id: "horse", en: "horse", vi: "ngựa", level: 3 },
  { id: "elephant", en: "elephant", vi: "voi", level: 3 },
  { id: "tiger", en: "tiger", vi: "hổ", level: 3 },
  { id: "turtle", en: "turtle", vi: "rùa", level: 3 },
  { id: "butterfly", en: "butterfly", vi: "bướm", level: 3 },
];

const fruits: Word[] = [
  { id: "apple", en: "apple", vi: "táo", level: 1 },
  { id: "banana", en: "banana", vi: "chuối", level: 1 },
  { id: "orange-fruit", en: "orange", vi: "cam", level: 1 },
  { id: "mango", en: "mango", vi: "xoài", level: 1 },
  { id: "watermelon", en: "watermelon", vi: "dưa hấu", level: 1 },
  { id: "grapes", en: "grapes", vi: "nho", level: 1 },
  { id: "lemon", en: "lemon", vi: "chanh", level: 2 },
  { id: "pineapple", en: "pineapple", vi: "dứa", level: 2 },
  { id: "strawberry", en: "strawberry", vi: "dâu tây", level: 2 },
  { id: "papaya", en: "papaya", vi: "đu đủ", level: 2 },
  { id: "pear", en: "pear", vi: "lê", level: 3 },
  { id: "avocado", en: "avocado", vi: "bơ", level: 3 },
  { id: "dragon-fruit", en: "dragon fruit", vi: "thanh long", level: 3 },
  { id: "rambutan", en: "rambutan", vi: "chôm chôm", level: 3 },
];

const colors: Word[] = [
  { id: "red", en: "red", vi: "đỏ", level: 1 },
  { id: "blue", en: "blue", vi: "xanh dương", level: 1 },
  { id: "yellow", en: "yellow", vi: "vàng", level: 1 },
  { id: "green", en: "green", vi: "xanh lá", level: 1 },
  { id: "pink", en: "pink", vi: "hồng", level: 1 },
  { id: "orange", en: "orange", vi: "cam", level: 1 },
  { id: "white", en: "white", vi: "trắng", level: 2 },
  { id: "black", en: "black", vi: "đen", level: 2 },
  { id: "purple", en: "purple", vi: "tím", level: 2 },
  { id: "brown", en: "brown", vi: "nâu", level: 2 },
  { id: "gray", en: "gray", vi: "xám", level: 3 },
  { id: "light-blue", en: "light blue", vi: "xanh da trời", level: 3 },
  { id: "gold", en: "gold", vi: "vàng kim", level: 3 },
  { id: "silver", en: "silver", vi: "bạc", level: 3 },
];

/**
 * Fields for the color cards. These are paint chips, not photographs.
 * Gold and silver get a soft metallic sheen; a flat chip of either just reads as mustard or grey.
 */
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
  gray: "#8c8f94",
  "light-blue": "#7fd4ff",
  gold: "linear-gradient(135deg, #fff2a8 0%, #f2c230 30%, #b8860b 62%, #ffe27a 100%)",
  silver: "linear-gradient(135deg, #ffffff 0%, #d5d9df 30%, #8f969f 62%, #eef1f4 100%)",
};

const shapes: Word[] = [
  { id: "circle", en: "circle", vi: "hình tròn", level: 1 },
  { id: "square", en: "square", vi: "hình vuông", level: 1 },
  { id: "triangle", en: "triangle", vi: "hình tam giác", level: 1 },
  { id: "heart", en: "heart", vi: "hình trái tim", level: 1 },
  { id: "star", en: "star", vi: "hình ngôi sao", level: 1 },
  { id: "rectangle", en: "rectangle", vi: "hình chữ nhật", level: 1 },
  { id: "oval", en: "oval", vi: "hình bầu dục", level: 2 },
  { id: "diamond", en: "diamond", vi: "hình thoi", level: 2 },
  { id: "arrow", en: "arrow", vi: "hình mũi tên", level: 2 },
  { id: "cross", en: "cross", vi: "hình chữ thập", level: 2 },
  { id: "crescent", en: "crescent", vi: "hình trăng khuyết", level: 3 },
  { id: "semicircle", en: "semicircle", vi: "hình bán nguyệt", level: 3 },
  { id: "pentagon", en: "pentagon", vi: "hình ngũ giác", level: 3 },
  { id: "hexagon", en: "hexagon", vi: "hình lục giác", level: 3 },
];

const objects: Word[] = [
  { id: "bowl", en: "bowl", vi: "bát", level: 1 },
  { id: "ball", en: "ball", vi: "quả bóng", level: 1 },
  { id: "cup", en: "cup", vi: "cốc", level: 1 },
  { id: "chair", en: "chair", vi: "ghế", level: 1 },
  { id: "car", en: "car", vi: "ô tô", level: 1 },
  { id: "book", en: "book", vi: "quyển sách", level: 1 },
  { id: "fan", en: "fan", vi: "quạt", level: 2 },
  { id: "motorbike", en: "motorbike", vi: "xe máy", level: 2 },
  { id: "toothbrush", en: "toothbrush", vi: "bàn chải", level: 2 },
  { id: "pillow", en: "pillow", vi: "gối", level: 2 },
  { id: "sandals", en: "sandals", vi: "dép", level: 2 },
  { id: "backpack", en: "backpack", vi: "cặp", level: 3 },
  { id: "pot", en: "pot", vi: "nồi", level: 3 },
  { id: "chopsticks", en: "chopsticks", vi: "đũa", level: 3 },
  { id: "helmet", en: "helmet", vi: "mũ bảo hiểm", level: 3 },
];

const actions: Word[] = [
  { id: "run", en: "run", vi: "chạy", level: 1 },
  { id: "eat", en: "eat", vi: "ăn", level: 1 },
  { id: "drink", en: "drink", vi: "uống", level: 1 },
  { id: "sleep", en: "sleep", vi: "ngủ", level: 1 },
  { id: "walk", en: "walk", vi: "đi", level: 1 },
  { id: "jump", en: "jump", vi: "nhảy", level: 1 },
  { id: "sit", en: "sit", vi: "ngồi", level: 2 },
  { id: "clap", en: "clap", vi: "vỗ tay", level: 2 },
  { id: "laugh", en: "laugh", vi: "cười", level: 2 },
  { id: "hug", en: "hug", vi: "ôm", level: 2 },
  { id: "wave", en: "wave", vi: "vẫy tay", level: 2 },
  { id: "wash", en: "wash", vi: "rửa tay", level: 3 },
  { id: "swim", en: "swim", vi: "bơi", level: 3 },
  { id: "read", en: "read", vi: "đọc sách", level: 3 },
  { id: "draw", en: "draw", vi: "vẽ", level: 3 },
];

const body: Word[] = [
  { id: "eye", en: "eye", vi: "mắt", level: 1 },
  { id: "nose", en: "nose", vi: "mũi", level: 1 },
  { id: "mouth", en: "mouth", vi: "miệng", level: 1 },
  { id: "ear", en: "ear", vi: "tai", level: 1 },
  { id: "hand", en: "hand", vi: "bàn tay", level: 1 },
  { id: "foot", en: "foot", vi: "bàn chân", level: 1 },
  { id: "head", en: "head", vi: "đầu", level: 2 },
  { id: "hair", en: "hair", vi: "tóc", level: 2 },
  { id: "tummy", en: "tummy", vi: "bụng", level: 2 },
  { id: "tooth", en: "tooth", vi: "răng", level: 2 },
  { id: "arm", en: "arm", vi: "cánh tay", level: 3 },
  { id: "finger", en: "finger", vi: "ngón tay", level: 3 },
  { id: "knee", en: "knee", vi: "đầu gối", level: 3 },
  { id: "tongue", en: "tongue", vi: "lưỡi", level: 3 },
];

const weather: Word[] = [
  { id: "sunny", en: "sunny", vi: "trời nắng", level: 1 },
  { id: "rainy", en: "rainy", vi: "trời mưa", level: 1 },
  { id: "cloudy", en: "cloudy", vi: "nhiều mây", level: 1 },
  { id: "hot", en: "hot", vi: "trời nóng", level: 1 },
  { id: "cold", en: "cold", vi: "trời lạnh", level: 1 },
  { id: "windy", en: "windy", vi: "có gió", level: 1 },
  { id: "night", en: "night", vi: "ban đêm", level: 2 },
  { id: "rainbow", en: "rainbow", vi: "cầu vồng", level: 2 },
  { id: "snowy", en: "snowy", vi: "có tuyết", level: 2 },
  { id: "puddle", en: "puddle", vi: "vũng nước", level: 2 },
  { id: "stormy", en: "stormy", vi: "có bão", level: 3 },
  { id: "sunset", en: "sunset", vi: "hoàng hôn", level: 3 },
  { id: "foggy", en: "foggy", vi: "sương mù", level: 3 },
  { id: "tornado", en: "tornado", vi: "lốc xoáy", level: 3 },
];

export const categories: Category[] = [
  { id: "animals", label: "Động vật", words: animals },
  { id: "fruits", label: "Trái cây", words: fruits },
  { id: "colors", label: "Màu sắc", words: colors },
  { id: "shapes", label: "Hình dạng", words: shapes },
  { id: "objects", label: "Đồ vật", words: objects },
  { id: "actions", label: "Hành động", words: actions },
  { id: "body", label: "Bộ phận cơ thể", words: body },
  { id: "weather", label: "Thời tiết", words: weather },
];

export function categoryById(id: string): Category {
  return categories.find((category) => category.id === id) ?? categories[0];
}
