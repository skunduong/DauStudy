export const PRAISE = "Bạn Đậu giỏi quá";
export const WRONG = "Bạn Đậu chọn sai rồi";

const NAME = /^[\p{Script=Latin}]+(?: [\p{Script=Latin}]+)*$/u;

export function normalizeChildName(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export function isChildName(name: string) {
  return name.length >= 1 && name.length <= 24 && NAME.test(name);
}
