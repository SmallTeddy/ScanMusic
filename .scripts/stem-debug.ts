/* 调试：对 segnet 路径里被判为全体符的候选，打印其周边二值图像与 hasStem 条带密度 */
import * as ort from 'onnxruntime-web';
import { execSync } from 'node:child_process';
import { loadImage, createCanvas } from '@napi-rs/canvas';

(globalThis as unknown as { self?: unknown }).self = globalThis;

async function renderPage(): Promise<{ width: number; height: number; data: Uint8ClampedArray }> {
  execSync('pdftoppm -png -r 150 -f 1 -l 1 /workspace/public/test.pdf /tmp/crop-page', { stdio: 'pipe' });
  const image = await loadImage('/tmp/crop-page-1.png');
  const scale = Math.min(1, 1700 / image.width, 2400 / image.height);
  const width = Math.max(1, Math.floor(image.width * scale));
  const height = Math.max(1, Math.floor(image.height * scale));
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);
  const img = ctx.getImageData(0, 0, width, height);
  return { width, height, data: new Uint8ClampedArray(img.data) };
}

function asciiInk(rgba: Uint8ClampedArray, w: number, h: number, x0: number, y0: number, x1: number, y1: number): void {
  for (let y = y0; y <= y1; y += 1) {
    let row = '';
    for (let x = x0; x <= x1; x += 1) {
      const i = (y * w + x) * 4;
      const r = rgba[i];
      const g = rgba[i + 1];
      const b = rgba[i + 2];
      const a = rgba[i + 3] / 255;
      const lum = (0.299 * r + 0.587 * g + 0.114 * b) * a + 255 * (1 - a);
      row += lum < 160 ? '#' : '.';
    }
    console.log(row);
  }
}

async function main(): Promise<void> {
  const page = await renderPage();
  // 重建灰度/二值（与 worker 一致）
  const scale = Math.min(1, 1700 / page.width, 2400 / page.height); // scale==1 这里
  const session = await ort.InferenceSession.create('/workspace/public/models/segnet.onnx', { executionProviders: ['cpu'] });
  const mod = await import('../src/lib/omr/worker');
  mod.__injectSegnetSession(session);
  const result = await mod.recognize({ width: page.width, height: page.height, data: page.data, debug: true });
  if (!result.ok) {
    console.log('FAIL:', result.error);
    return;
  }
  const notes = result.debug?.notes ?? [];
  const whole = notes.filter((n) => n.type === 1);
  console.log('whole notes by global staffIndex:', [...new Set(whole.map((n) => n.staffIndex))].join(','));
  const sample = whole.slice(0, 3);
  for (const n of sample) {
    const staff = result.debug?.staves?.find((s) => s.index === n.staffIndex);
    if (!staff) continue;
    const sp = staff.space;
    const x = Math.round(n.x);
    const y = Math.round(n.y);
    console.log(`\n=== whole note staff=${n.staffIndex} x=${x} y=${y} k=${n.k} (staff bottom=${staff.bottom}, space=${sp}) ===`);
    asciiInk(page.data, page.width, page.height, x - 12, y - Math.round(sp * 3.2), x + 12, y + Math.round(sp * 1.5));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
