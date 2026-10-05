import fs from 'node:fs';
import path from 'node:path';

const sampleRate = 48000;
const duration = 40;
const samples = sampleRate * duration;
const channels = 2;
const bytesPerSample = 2;
const dataSize = samples * channels * bytesPerSample;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(channels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * channels * bytesPerSample, 28);
buffer.writeUInt16LE(channels * bytesPerSample, 32);
buffer.writeUInt16LE(bytesPerSample * 8, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

const envelope = (t, start, length, attack = 0.02, release = 0.25) => {
  if (t < start || t > start + length) return 0;
  const p = t - start;
  return Math.min(1, p / attack, (length - p) / release);
};

const kickTimes = [0.4, 1.2, 2.0, 2.8, 4.0, 5.0, 6.3, 7.5, 8.8, 10.2, 12, 14, 16, 18, 20, 22, 24, 26.1, 27.15, 28.2, 30, 32.5, 35, 38];
const lockTimes = [26.15, 27.25, 28.35];

for (let i = 0; i < samples; i++) {
  const t = i / sampleRate;
  const section = Math.floor(t / 10);
  const baseFreq = [48, 54, 44, 40][Math.min(3, section)];
  const pad =
    Math.sin(2 * Math.PI * baseFreq * t) * 0.12 +
    Math.sin(2 * Math.PI * baseFreq * 1.5 * t + 0.8) * 0.055 +
    Math.sin(2 * Math.PI * baseFreq * 2.01 * t + 1.7) * 0.035;
  const shimmer = Math.sin(2 * Math.PI * (320 + 30 * Math.sin(t * 0.3)) * t) * 0.018;
  let pulse = 0;
  for (const kt of kickTimes) {
    const e = envelope(t, kt, 0.38, 0.006, 0.32);
    if (e > 0) pulse += Math.sin(2 * Math.PI * (72 - 35 * (t - kt)) * t) * e * 0.2;
  }
  let metal = 0;
  for (const lt of lockTimes) {
    const e = envelope(t, lt, 0.8, 0.003, 0.75);
    if (e > 0) metal += (Math.sin(2 * Math.PI * 118 * t) + Math.sin(2 * Math.PI * 243 * t) * 0.5) * e * 0.22;
  }
  const rise = t > 36 ? Math.min(1, (t - 36) / 2) : 0;
  const logo = Math.sin(2 * Math.PI * 96 * t) * envelope(t, 37.85, 1.8, 0.03, 1.5) * 0.26;
  const master = t > 39 ? Math.max(0, 1 - (t - 39)) : 1;
  const value = Math.max(-1, Math.min(1, (pad + shimmer * (1 + rise) + pulse + metal + logo) * master));
  const left = Math.round(value * 32767);
  const right = Math.round((value * 0.96 + shimmer * 0.04) * 32767);
  const offset = 44 + i * 4;
  buffer.writeInt16LE(left, offset);
  buffer.writeInt16LE(right, offset + 2);
}

const outDir = path.join(process.cwd(), 'public', 'audio');
fs.mkdirSync(outDir, {recursive: true});
fs.writeFileSync(path.join(outDir, 'xingyan-score.wav'), buffer);
console.log(path.join(outDir, 'xingyan-score.wav'));
