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

/*
 * Each list runs from easy to hard: short, everyday words a toddler already meets at home
 * come first, longer or less familiar words come last. The first word is also the topic's icon.
 */

const animals: Word[] = [
  { id: "cat", en: "cat", vi: "mèo" },
  { id: "dog", en: "dog", vi: "chó" },
  { id: "duck", en: "duck", vi: "vịt" },
  { id: "fish", en: "fish", vi: "cá" },
  { id: "bird", en: "bird", vi: "chim" },
  { id: "chicken", en: "chicken", vi: "gà" },
  { id: "pig", en: "pig", vi: "heo" },
  { id: "cow", en: "cow", vi: "bò" },
  { id: "frog", en: "frog", vi: "ếch" },
  { id: "monkey", en: "monkey", vi: "khỉ" },
  { id: "rabbit", en: "rabbit", vi: "thỏ" },
  { id: "horse", en: "horse", vi: "ngựa" },
  { id: "elephant", en: "elephant", vi: "voi" },
  { id: "tiger", en: "tiger", vi: "hổ" },
  { id: "turtle", en: "turtle", vi: "rùa" },
  { id: "butterfly", en: "butterfly", vi: "bướm" },
];

const fruits: Word[] = [
  { id: "apple", en: "apple", vi: "táo" },
  { id: "banana", en: "banana", vi: "chuối" },
  { id: "orange-fruit", en: "orange", vi: "cam" },
  { id: "mango", en: "mango", vi: "xoài" },
  { id: "watermelon", en: "watermelon", vi: "dưa hấu" },
  { id: "grapes", en: "grapes", vi: "nho" },
  { id: "lemon", en: "lemon", vi: "chanh" },
  { id: "pineapple", en: "pineapple", vi: "dứa" },
  { id: "strawberry", en: "strawberry", vi: "dâu tây" },
  { id: "papaya", en: "papaya", vi: "đu đủ" },
  { id: "pear", en: "pear", vi: "lê" },
  { id: "avocado", en: "avocado", vi: "bơ" },
  { id: "dragon-fruit", en: "dragon fruit", vi: "thanh long" },
  { id: "rambutan", en: "rambutan", vi: "chôm chôm" },
];

const colors: Word[] = [
  { id: "red", en: "red", vi: "đỏ" },
  { id: "blue", en: "blue", vi: "xanh dương" },
  { id: "yellow", en: "yellow", vi: "vàng" },
  { id: "green", en: "green", vi: "xanh lá" },
  { id: "pink", en: "pink", vi: "hồng" },
  { id: "orange", en: "orange", vi: "cam" },
  { id: "white", en: "white", vi: "trắng" },
  { id: "black", en: "black", vi: "đen" },
  { id: "purple", en: "purple", vi: "tím" },
  { id: "brown", en: "brown", vi: "nâu" },
  { id: "gray", en: "gray", vi: "xám" },
  { id: "light-blue", en: "light blue", vi: "xanh da trời" },
  { id: "gold", en: "gold", vi: "vàng kim" },
  { id: "silver", en: "silver", vi: "bạc" },
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
  { id: "circle", en: "circle", vi: "hình tròn" },
  { id: "square", en: "square", vi: "hình vuông" },
  { id: "triangle", en: "triangle", vi: "hình tam giác" },
  { id: "heart", en: "heart", vi: "hình trái tim" },
  { id: "star", en: "star", vi: "hình ngôi sao" },
  { id: "rectangle", en: "rectangle", vi: "hình chữ nhật" },
  { id: "oval", en: "oval", vi: "hình bầu dục" },
  { id: "diamond", en: "diamond", vi: "hình thoi" },
  { id: "arrow", en: "arrow", vi: "hình mũi tên" },
  { id: "cross", en: "cross", vi: "hình chữ thập" },
  { id: "crescent", en: "crescent", vi: "hình trăng khuyết" },
  { id: "semicircle", en: "semicircle", vi: "hình bán nguyệt" },
  { id: "pentagon", en: "pentagon", vi: "hình ngũ giác" },
  { id: "hexagon", en: "hexagon", vi: "hình lục giác" },
];

const objects: Word[] = [
  { id: "bowl", en: "bowl", vi: "bát" },
  { id: "ball", en: "ball", vi: "quả bóng" },
  { id: "cup", en: "cup", vi: "cốc" },
  { id: "chair", en: "chair", vi: "ghế" },
  { id: "car", en: "car", vi: "ô tô" },
  { id: "book", en: "book", vi: "quyển sách" },
  { id: "fan", en: "fan", vi: "quạt" },
  { id: "motorbike", en: "motorbike", vi: "xe máy" },
  { id: "toothbrush", en: "toothbrush", vi: "bàn chải" },
  { id: "pillow", en: "pillow", vi: "gối" },
  { id: "sandals", en: "sandals", vi: "dép" },
  { id: "backpack", en: "backpack", vi: "cặp" },
  { id: "pot", en: "pot", vi: "nồi" },
  { id: "chopsticks", en: "chopsticks", vi: "đũa" },
  { id: "helmet", en: "helmet", vi: "mũ bảo hiểm" },
];

const actions: Word[] = [
  { id: "run", en: "run", vi: "chạy" },
  { id: "eat", en: "eat", vi: "ăn" },
  { id: "drink", en: "drink", vi: "uống" },
  { id: "sleep", en: "sleep", vi: "ngủ" },
  { id: "walk", en: "walk", vi: "đi" },
  { id: "jump", en: "jump", vi: "nhảy" },
  { id: "sit", en: "sit", vi: "ngồi" },
  { id: "clap", en: "clap", vi: "vỗ tay" },
  { id: "laugh", en: "laugh", vi: "cười" },
  { id: "hug", en: "hug", vi: "ôm" },
  { id: "wave", en: "wave", vi: "vẫy tay" },
  { id: "wash", en: "wash", vi: "rửa tay" },
  { id: "swim", en: "swim", vi: "bơi" },
  { id: "read", en: "read", vi: "đọc sách" },
  { id: "draw", en: "draw", vi: "vẽ" },
];

const body: Word[] = [
  { id: "eye", en: "eye", vi: "mắt" },
  { id: "nose", en: "nose", vi: "mũi" },
  { id: "mouth", en: "mouth", vi: "miệng" },
  { id: "ear", en: "ear", vi: "tai" },
  { id: "hand", en: "hand", vi: "bàn tay" },
  { id: "foot", en: "foot", vi: "bàn chân" },
  { id: "head", en: "head", vi: "đầu" },
  { id: "hair", en: "hair", vi: "tóc" },
  { id: "tummy", en: "tummy", vi: "bụng" },
  { id: "tooth", en: "tooth", vi: "răng" },
  { id: "arm", en: "arm", vi: "cánh tay" },
  { id: "finger", en: "finger", vi: "ngón tay" },
  { id: "knee", en: "knee", vi: "đầu gối" },
  { id: "tongue", en: "tongue", vi: "lưỡi" },
];

const weather: Word[] = [
  { id: "sunny", en: "sunny", vi: "trời nắng" },
  { id: "rainy", en: "rainy", vi: "trời mưa" },
  { id: "cloudy", en: "cloudy", vi: "nhiều mây" },
  { id: "hot", en: "hot", vi: "trời nóng" },
  { id: "cold", en: "cold", vi: "trời lạnh" },
  { id: "windy", en: "windy", vi: "có gió" },
  { id: "night", en: "night", vi: "ban đêm" },
  { id: "rainbow", en: "rainbow", vi: "cầu vồng" },
  { id: "snowy", en: "snowy", vi: "có tuyết" },
  { id: "puddle", en: "puddle", vi: "vũng nước" },
  { id: "stormy", en: "stormy", vi: "có bão" },
  { id: "sunset", en: "sunset", vi: "hoàng hôn" },
  { id: "foggy", en: "foggy", vi: "sương mù" },
  { id: "tornado", en: "tornado", vi: "lốc xoáy" },
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
