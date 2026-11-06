const QUIET = 0.055;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let source: AudioBufferSourceNode | null = null;
let muted = false;

export function setMusicMuted(next: boolean) {
  muted = next;
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.linearRampToValueAtTime(next ? 0 : QUIET, now + 0.08);
}

function tone(data: Float32Array, sampleRate: number, start: number, duration: number, freq: number, amp: number) {
  const from = Math.floor(start * sampleRate);
  const to = Math.min(data.length, Math.floor((start + duration) * sampleRate));
  for (let i = from; i < to; i += 1) {
    const t = (i - from) / sampleRate;
    const attack = Math.min(1, t / 0.04);
    const env = attack * Math.exp(-t / (duration * 0.62));
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.82 + Math.sin(2 * Math.PI * freq * 2 * t) * 0.12;
    data[i] += sample * env * amp;
  }
}

function renderLoop(audio: AudioContext) {
  const seconds = 8;
  const buffer = audio.createBuffer(1, Math.floor(audio.sampleRate * seconds), audio.sampleRate);
  const data = buffer.getChannelData(0);
  const sampleRate = audio.sampleRate;
  for (let i = 0; i < data.length; i += 1) {
    const t = i / sampleRate;
    const hum = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.25 * t);
    data[i] += Math.sin(2 * Math.PI * 130.81 * t) * 0.045 * hum;
    data[i] += Math.sin(2 * Math.PI * 196.0 * t) * 0.03 * hum;
  }
  const notes = [329.63, 392, 440, 392, 329.63, 293.66, 261.63, 293.66, 329.63, 392, 523.25, 392];
  notes.forEach((freq, index) => {
    tone(data, sampleRate, index * (seconds / notes.length), 0.7, freq, 0.22);
  });
  let peak = 0;
  for (let i = 0; i < data.length; i += 1) peak = Math.max(peak, Math.abs(data[i]));
  if (peak > 0.9) {
    const scale = 0.9 / peak;
    for (let i = 0; i < data.length; i += 1) data[i] *= scale;
  }
  return buffer;
}

export function startMusic() {
  if (typeof window === "undefined" || muted) return;
  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const audio = ctx ?? new AudioCtx();
  ctx = audio;
  if (!master) {
    master = audio.createGain();
    master.gain.value = 0;
    master.connect(audio.destination);
  }
  void audio.resume();
  if (!source) {
    const node = audio.createBufferSource();
    node.buffer = renderLoop(audio);
    node.loop = true;
    node.connect(master);
    node.start();
    source = node;
  }
  const now = audio.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.linearRampToValueAtTime(QUIET, now + 0.25);
}
