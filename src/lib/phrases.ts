const NAME = /^[\p{Script=Latin}]+(?: [\p{Script=Latin}]+)*$/u;

export function normalizeChildName(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export function isChildName(name: string) {
  return name.length >= 1 && name.length <= 24 && NAME.test(name);
}

export function praiseLine(name: string) {
  return `Bạn ${name} giỏi quá`;
}

export function wrongLine(name: string) {
  return `Bạn ${name} chọn sai rồi`;
}

export const thinkingLines = {
  pairs: "Lật hai thẻ giống nhau",
  odd: "Chạm hình không giống",
  next: "Chạm hình tiếp theo",
  shadow: "Chạm bóng giống hình",
  count: "Đếm rồi chạm số",
  colors: "Chạm đúng màu",
  puzzle: "Ghép 4 mảnh",
  size: "Chạm hình to",
  feelings: "Chạm mặt này",
} as const;

const thinkingPromptSet = new Set<string>(Object.values(thinkingLines));

function nameIn(text: string, suffix: string) {
  const prefix = "Bạn ";
  if (!text.startsWith(prefix) || !text.endsWith(suffix)) return null;
  const name = text.slice(prefix.length, text.length - suffix.length);
  if (!isChildName(name)) return null;
  return name;
}

export function isNamedPraise(text: string) {
  return nameIn(text, " giỏi quá") !== null;
}

export function isNamedWrong(text: string) {
  return nameIn(text, " chọn sai rồi") !== null;
}

export function isThinkingPrompt(text: string) {
  return thinkingPromptSet.has(text);
}
