/**
 * Levels, easiest first. Each topic starts with its six level-1 words; the rest open a couple at a
 * time as the child gets the earlier ones right (see src/lib/progress.ts).
 *
 * 1: first words. Things a Vietnamese toddler sees and hears every day, short to say, and easy to
 *    tell apart on a board of six. Wordbank / MacArthur-Bates CDI data puts words like dog, duck,
 *    ball, cup and banana among the earliest English words children learn.
 * 2: still everyday, but longer to say or less frequent (horse, toothbrush, pineapple).
 * 3: farther from home life or easy to mix up with a level-1 word (lion, avocado, gray).
 * 4: the big topics only. Zoo and sea animals and less common household things, roughly the
 *    Cambridge Pre A1 Starters range.
 */
export type Level = 1 | 2 | 3 | 4;

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
  { id: "rabbit", en: "rabbit", vi: "thỏ", level: 2 },
  { id: "monkey", en: "monkey", vi: "khỉ", level: 2 },
  { id: "horse", en: "horse", vi: "ngựa", level: 2 },
  { id: "mouse", en: "mouse", vi: "chuột", level: 2 },
  { id: "bee", en: "bee", vi: "con ong", level: 2 },
  { id: "elephant", en: "elephant", vi: "voi", level: 3 },
  { id: "tiger", en: "tiger", vi: "hổ", level: 3 },
  { id: "lion", en: "lion", vi: "sư tử", level: 3 },
  { id: "bear", en: "bear", vi: "gấu", level: 3 },
  { id: "turtle", en: "turtle", vi: "rùa", level: 3 },
  { id: "butterfly", en: "butterfly", vi: "bướm", level: 3 },
  { id: "buffalo", en: "buffalo", vi: "trâu", level: 3 },
  { id: "goat", en: "goat", vi: "dê", level: 3 },
  { id: "snake", en: "snake", vi: "rắn", level: 3 },
  { id: "crab", en: "crab", vi: "cua", level: 3 },
  { id: "giraffe", en: "giraffe", vi: "hươu cao cổ", level: 4 },
  { id: "zebra", en: "zebra", vi: "ngựa vằn", level: 4 },
  { id: "crocodile", en: "crocodile", vi: "cá sấu", level: 4 },
  { id: "owl", en: "owl", vi: "cú mèo", level: 4 },
  { id: "penguin", en: "penguin", vi: "chim cánh cụt", level: 4 },
  { id: "dolphin", en: "dolphin", vi: "cá heo", level: 4 },
  { id: "sheep", en: "sheep", vi: "cừu", level: 4 },
  { id: "snail", en: "snail", vi: "ốc sên", level: 4 },
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
 * One solid color per color card. The thinking games also paint shapes with these, so every value
 * stays a plain hex color.
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
  gold: "#d4a017",
  silver: "#b9bec6",
};

/** A metallic sheen laid over the flat chip; flat gold and silver read as mustard and gray. */
export const colorSheen: Record<string, string> = {
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
  { id: "ball", en: "ball", vi: "quả bóng", level: 1 },
  { id: "cup", en: "cup", vi: "cốc", level: 1 },
  { id: "bowl", en: "bowl", vi: "bát", level: 1 },
  { id: "spoon", en: "spoon", vi: "thìa", level: 1 },
  { id: "book", en: "book", vi: "quyển sách", level: 1 },
  { id: "chair", en: "chair", vi: "ghế", level: 1 },
  { id: "table", en: "table", vi: "cái bàn", level: 2 },
  { id: "door", en: "door", vi: "cửa", level: 2 },
  { id: "pillow", en: "pillow", vi: "gối", level: 2 },
  { id: "fan", en: "fan", vi: "quạt", level: 2 },
  { id: "toothbrush", en: "toothbrush", vi: "bàn chải", level: 2 },
  { id: "phone", en: "phone", vi: "điện thoại", level: 2 },
  { id: "teddy-bear", en: "teddy bear", vi: "gấu bông", level: 2 },
  { id: "clock", en: "clock", vi: "đồng hồ", level: 3 },
  { id: "television", en: "television", vi: "ti vi", level: 3 },
  { id: "lamp", en: "lamp", vi: "đèn", level: 3 },
  { id: "towel", en: "towel", vi: "khăn tắm", level: 3 },
  { id: "comb", en: "comb", vi: "lược", level: 3 },
  { id: "glasses", en: "glasses", vi: "kính", level: 3 },
  { id: "sandals", en: "sandals", vi: "dép", level: 3 },
  { id: "backpack", en: "backpack", vi: "cặp", level: 3 },
  { id: "pot", en: "pot", vi: "nồi", level: 4 },
  { id: "chopsticks", en: "chopsticks", vi: "đũa", level: 4 },
  { id: "helmet", en: "helmet", vi: "mũ bảo hiểm", level: 4 },
  { id: "kite", en: "kite", vi: "cái diều", level: 4 },
  { id: "bucket", en: "bucket", vi: "cái xô", level: 4 },
  { id: "broom", en: "broom", vi: "cái chổi", level: 4 },
  { id: "pencil", en: "pencil", vi: "bút chì", level: 4 },
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

const jobs: Word[] = [
  { id: "doctor", en: "doctor", vi: "bác sĩ", level: 1 },
  { id: "teacher", en: "teacher", vi: "giáo viên", level: 1 },
  { id: "police", en: "police", vi: "cảnh sát", level: 1 },
  { id: "cook", en: "cook", vi: "đầu bếp", level: 1 },
  { id: "farmer", en: "farmer", vi: "nông dân", level: 1 },
  { id: "driver", en: "driver", vi: "tài xế", level: 1 },
  { id: "nurse", en: "nurse", vi: "y tá", level: 2 },
  { id: "firefighter", en: "firefighter", vi: "lính cứu hỏa", level: 2 },
  { id: "pilot", en: "pilot", vi: "phi công", level: 2 },
  { id: "singer", en: "singer", vi: "ca sĩ", level: 2 },
];

const vehicles: Word[] = [
  { id: "car", en: "car", vi: "ô tô", level: 1 },
  { id: "bus", en: "bus", vi: "xe buýt", level: 1 },
  { id: "motorbike-cartoon", en: "motorbike", vi: "xe máy", level: 1 },
  { id: "bicycle", en: "bicycle", vi: "xe đạp", level: 1 },
  { id: "plane", en: "plane", vi: "máy bay", level: 1 },
  { id: "boat", en: "boat", vi: "thuyền", level: 1 },
  { id: "train", en: "train", vi: "tàu hỏa", level: 2 },
  { id: "truck", en: "truck", vi: "xe tải", level: 2 },
  { id: "ambulance", en: "ambulance", vi: "xe cứu thương", level: 2 },
  { id: "firetruck", en: "firetruck", vi: "xe cứu hỏa", level: 2 },
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
  { id: "jobs", label: "Nghề nghiệp", words: jobs },
  { id: "vehicles", label: "Xe cộ", words: vehicles },
  { id: "weather", label: "Thời tiết", words: weather },
];

export function categoryById(id: string): Category {
  return categories.find((category) => category.id === id) ?? categories[0];
}
