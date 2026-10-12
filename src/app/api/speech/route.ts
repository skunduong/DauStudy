import { NextRequest } from "next/server";
import { PRAISE, WRONG } from "@/lib/phrases";
import { categories } from "@/lib/words";

const englishWords = new Set(categories.flatMap((category) => category.words.map((word) => word.en)));

const cache = new Map<string, Uint8Array>();
const pending = new Map<string, Promise<Uint8Array>>();

const browserHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Referer: "https://translate.google.com/",
};

function allowed(lang: string, text: string) {
  if (lang === "en") return englishWords.has(text);
  if (lang === "vi") return text === PRAISE || text === WRONG;
  return false;
}

function endpoint(kind: "primary" | "fallback", lang: string, text: string) {
  const query = new URLSearchParams({
    ie: "UTF-8",
    client: kind === "primary" ? "tw-ob" : "gtx",
    tl: lang,
    q: text,
  });
  const host = kind === "primary" ? "https://translate.google.com/translate_tts" : "https://translate.googleapis.com/translate_tts";
  return `${host}?${query.toString()}`;
}

async function fetchClip(lang: string, text: string) {
  let failure = "no response";
  for (const kind of ["primary", "fallback"] as const) {
    const response = await fetch(endpoint(kind, lang, text), {
      headers: browserHeaders,
      cache: "no-store",
    });
    const type = response.headers.get("content-type") ?? "";
    if (response.ok && type.includes("audio")) {
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > 200) return bytes;
      failure = `short audio from ${kind}`;
      continue;
    }
    failure = `${kind} returned ${response.status}`;
  }
  throw new Error(failure);
}

async function loadClip(lang: string, text: string) {
  const key = `${lang}:${text}`;
  const cached = cache.get(key);
  if (cached) return { bytes: cached, hit: true };
  const existing = pending.get(key);
  if (existing) return { bytes: await existing, hit: true };

  const job = fetchClip(lang, text)
    .then((bytes) => {
      cache.set(key, bytes);
      if (cache.size > 64) {
        const oldest = cache.keys().next().value;
        if (oldest) cache.delete(oldest);
      }
      return bytes;
    })
    .finally(() => {
      pending.delete(key);
    });
  pending.set(key, job);
  return { bytes: await job, hit: false };
}

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") ?? "";
  const text = request.nextUrl.searchParams.get("q") ?? "";
  if (!allowed(lang, text)) {
    return Response.json({ error: "unsupported clip" }, { status: 400 });
  }

  try {
    const { bytes, hit } = await loadClip(lang, text);
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, max-age=86400",
        "X-Speech-Cache": hit ? "hit" : "miss",
      },
    });
  } catch {
    return Response.json({ error: "speech unavailable" }, { status: 502 });
  }
}
