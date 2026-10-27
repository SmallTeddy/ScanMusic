/* 验证 HOMR segnet ONNX 在 Node 中可运行，并在合成乐谱上检测到符头 */
import * as ort from 'onnxruntime-web';
import { createCanvas } from '@napi-rs/canvas';
import * as fs from 'node:fs';

const MODEL = '/workspace/public/models/segnet.onnx';

// ---------- 合成乐谱图像 ----------
function makeSynthetic(): { data: Uint8ClampedArray; width: number; height: number; noteXs: number[]; noteKs: number[] } {
  const width = 900;
  const height = 900;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#000000';
  const space = 12;
  const noteXs: number[] = [];
  const noteKs: number[] = [];
  for (let staff = 0; staff < 3; staff += 1) {
    const top = 140 + staff * 260;
    for (let line = 0; line < 5; line += 1) {
      ctx.fillRect(60, top + line * space, width - 120, 2);
    }
    // 每行 4 个四分音符：k = -2(下加线) -1 0 1 2 3(上加线附近)
    const ks = [-2, 0, 2, 4];
    ks.forEach((k, i) => {
      const x = 180 + i * 150;
      const y = top + 4 * space - (k * space) / 2;
      // 符头（实心椭圆）
      ctx.beginPath();
      ctx.ellipse(x, y, 7, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      // 符干（向上，右侧）
      ctx.fillRect(x + 4, y - 3.2 * space, 2, 3.2 * space);
      // 加线
      if (k === -2) ctx.fillRect(x - 12, top + 4 * space + space, 24, 1.5);
      if (k === 4) ctx.fillRect(x - 12, top - space, 24, 1.5);
      noteXs.push(x);
      noteKs.push(k);
    });
  }
  const data = ctx.getImageData(0, 0, width, height).data;
  return { data, width, height, noteXs, noteKs };
}

// ---------- segnet 推理（复刻 HOMR inference()） ----------
function extractPatch(gray: Uint8Array, w: number, h: number, y: number, x: number): Float32Array {
  const win = 320;
  const patch = new Float32Array(3 * win * win).fill(255);
  const y0 = Math.max(y, 0);
  const x0 = Math.max(x, 0);
  const y1 = Math.min(y + win, h);
  const x1 = Math.min(x + win, w);
  for (let py = y0; py < y1; py += 1) {
    for (let px = x0; px < x1; px += 1) {
      const v = gray[py * w + px];
      const dy = py - y0;
      const dx = px - x0;
      patch[0 * win * win + dy * win + dx] = v;
      patch[1 * win * win + dy * win + dx] = v;
      patch[2 * win * win + dy * win + dx] = v;
    }
  }
  return patch;
}

async function runSegnet(image: { data: Uint8ClampedArray; width: number; height: number }) {
  const session = await ort.InferenceSession.create(MODEL, { executionProviders: ['cpu'] });
  // 灰度
  const w = image.width;
  const h = image.height;
  const gray = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i += 1) {
    gray[i] = image.data[i * 4] || 255;
  }
  const step = 160;
  const win = 320;
  const labels = new Float32Array(w * h);
  const weight = new Uint16Array(w * h);
  let patchesRun = 0;
  for (let y0 = 0; y0 < Math.max(h, win); y0 += step) {
    const y = Math.min(y0, h - win);
    for (let x0 = 0; x0 < Math.max(w, win); x0 += step) {
      const x = Math.min(x0, w - win);
      const patch = extractPatch(gray, w, h, y, x);
      const input = new ort.Tensor('float32', patch, [1, 3, win, win]);
      const out = await session.run({ input });
      const logits = out[session.outputNames[0]].data as Float32Array;
      const cy = Math.max(0, y);
      const cx = Math.max(0, x);
      const cy1 = Math.min(win, h - y < 0 ? win : h - y);
      const cx1 = Math.min(win, w - x < 0 ? win : w - x);
      for (let py = 0; py < cy1; py += 1) {
        for (let px = 0; px < cx1; px += 1) {
          let best = 0;
          let bestV = -Infinity;
          for (let c = 0; c < 6; c += 1) {
            const v = logits[c * win * win + py * win + px];
            if (v > bestV) {
              bestV = v;
              best = c;
            }
          }
          const idx = (cy + py) * w + (cx + px);
          labels[idx] += best;
          weight[idx] += 1;
        }
      }
      patchesRun += 1;
    }
  }
  // 各类掩码
  const masks: Record<string, Uint8Array> = {};
  for (const c of ['stems_rests', 'notehead', 'clefs_keys', 'staff', 'symbols']) {
    masks[c] = new Uint8Array(w * h);
  }
  for (let i = 0; i < w * h; i += 1) {
    const avg = labels[i] / (weight[i] || 1);
    const c = Math.round(avg);
    if (c === 1) masks.stems_rests[i] = 1;
    else if (c === 2) masks.notehead[i] = 1;
    else if (c === 3) masks.clefs_keys[i] = 1;
    else if (c === 4) masks.staff[i] = 1;
    else if (c === 5) masks.symbols[i] = 1;
  }
  return { masks, w, h, patchesRun };
}

// ---------- 简单连通域 ----------
function connectedComponents(mask: Uint8Array, w: number, h: number): Array<{ x0: number; y0: number; x1: number; y1: number; area: number; cx: number; cy: number }> {
  const visited = new Uint8Array(w * h);
  const comps: Array<{ x0: number; y0: number; x1: number; y1: number; area: number; cx: number; cy: number }> = [];
  for (let i = 0; i < w * h; i += 1) {
    if (!mask[i] || visited[i]) continue;
    const stack = [i];
    visited[i] = 1;
    let area = 0;
    let sx = 0;
    let sy = 0;
    let minX = w;
    let maxX = 0;
    let minY = h;
    let maxY = 0;
    while (stack.length) {
      const p = stack.pop()!;
      const x = p % w;
      const y = (p - x) / w;
      area += 1;
      sx += x;
      sy += y;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const np = ny * w + nx;
        if (mask[np] && !visited[np]) {
          visited[np] = 1;
          stack.push(np);
        }
      }
    }
    comps.push({ x0: minX, y0: minY, x1: maxX, y1: maxY, area, cx: sx / area, cy: sy / area });
  }
  return comps;
}

async function main() {
  const synth = makeSynthetic();
  const t0 = Date.now();
  const { masks, w, h, patchesRun } = await runSegnet(synth);
  console.log(`patches: ${patchesRun}, time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  const heads = connectedComponents(masks.notehead, w, h).filter((c) => c.area > 30);
  console.log(`notehead comps: ${heads.length}`);
  let hit = 0;
  for (let i = 0; i < synth.noteXs.length; i += 1) {
    const x = synth.noteXs[i];
    const k = synth.noteKs[i];
    const y = 140 + Math.floor(i / 4) * 260 + 4 * 12 - (k * 12) / 2;
    const found = heads.some((c) => Math.abs(c.cx - x) < 15 && Math.abs(c.cy - y) < 15);
    if (found) hit += 1;
  }
  console.log(`notehead hit ${hit}/${synth.noteXs.length}`);
  // 打印每个音符区域的候选
  for (let i = 0; i < synth.noteXs.length; i += 1) {
    const x = synth.noteXs[i];
    const k = synth.noteKs[i];
    const y = 140 + Math.floor(i / 4) * 260 + 4 * 12 - (k * 12) / 2;
    const near = heads
      .filter((c) => Math.abs(c.cx - x) < 25)
      .map((c) => `(cx=${c.cx.toFixed(0)},cy=${c.cy.toFixed(0)},exp=${y},area=${c.area})`);
    if (near.length) console.log(`note ${i} k=${k} expY=${y}: ${near.join(' ')}`);
  }
  console.log('symbols comps(beam/flag):', connectedComponents(masks.symbols, w, h).filter((c) => c.area > 20).length);
  console.log('staff comps:', connectedComponents(masks.staff, w, h).filter((c) => c.area > 50).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
