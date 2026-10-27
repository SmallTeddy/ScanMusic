/* 渲染 public/test.pdf 第 1 页，跑 segnet，导出各掩码 PNG 与连通域统计 */
import * as ort from 'onnxruntime-web';
import * as fs from 'node:fs';
import { execSync } from 'node:child_process';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const MODEL = '/workspace/public/models/segnet.onnx';

async function renderPdfPage(): Promise<{ gray: Uint8Array; width: number; height: number }> {
  execSync('pdftoppm -png -r 150 -f 1 -l 1 /workspace/public/test.pdf /tmp/testpage', { stdio: 'pipe' });
  const image = await loadImage('/tmp/testpage-1.png');
  // 与应用一致的缩放上限：≤1700×2400
  const scale = Math.min(1, 1700 / image.width, 2400 / image.height);
  const canvas = createCanvas(Math.max(1, Math.floor(image.width * scale)), Math.max(1, Math.floor(image.height * scale)));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const gray = new Uint8Array(canvas.width * canvas.height);
  for (let i = 0; i < gray.length; i += 1) gray[i] = img.data[i * 4];
  return { gray, width: canvas.width, height: canvas.height };
}

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
      patch[dy * win + dx] = v;
      patch[win * win + dy * win + dx] = v;
      patch[2 * win * win + dy * win + dx] = v;
    }
  }
  return patch;
}

async function main() {
  console.log('step: rendering pdf...');
  const { gray, width: w, height: h } = await renderPdfPage();
  console.log(`page ${w}x${h}`);
  const session = await ort.InferenceSession.create(MODEL, { executionProviders: ['cpu'] });
  const step = 160;
  const win = 320;
  const labels = new Float32Array(w * h);
  const weight = new Uint16Array(w * h);
  let patchesRun = 0;
  const t0 = Date.now();
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
      const cy1 = Math.min(win, h - y);
      const cx1 = Math.min(win, w - x);
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
  console.log(`patches: ${patchesRun}, segnet time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  const masks: Record<string, Uint8Array> = {
    stems_rests: new Uint8Array(w * h),
    notehead: new Uint8Array(w * h),
    clefs_keys: new Uint8Array(w * h),
    staff: new Uint8Array(w * h),
    symbols: new Uint8Array(w * h),
  };
  const classCounts = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < w * h; i += 1) {
    const avg = labels[i] / (weight[i] || 1);
    const c = Math.round(avg);
    classCounts[c] += 1;
    if (c === 1) masks.stems_rests[i] = 1;
    else if (c === 2) masks.notehead[i] = 1;
    else if (c === 3) masks.clefs_keys[i] = 1;
    else if (c === 4) masks.staff[i] = 1;
    else if (c === 5) masks.symbols[i] = 1;
  }
  console.log('class counts bg,stems/rests,notehead,clefs,staff,symbols:', classCounts);

  // 导出掩码 PNG
  const names: Array<[string, Uint8Array]> = [
    ['notehead', masks.notehead],
    ['stems_rests', masks.stems_rests],
    ['staff', masks.staff],
    ['symbols', masks.symbols],
    ['clefs_keys', masks.clefs_keys],
  ];
  for (const [name, mask] of names) {
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < w * h; i += 1) {
      const v = mask[i] ? 0 : 255;
      img.data[i * 4] = v;
      img.data[i * 4 + 1] = v;
      img.data[i * 4 + 2] = v;
      img.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    fs.writeFileSync(`/tmp/mask-${name}.png`, canvas.toBuffer('image/png'));
  }
  console.log('masks written to /tmp/mask-*.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
