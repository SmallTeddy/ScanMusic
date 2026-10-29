/* 打印 test.pdf 第 1 页各谱表位置 + 裁剪 staff 3 的 x170-200 区域检查 clef 误检 */
import * as ort from 'onnxruntime-web';
import { execSync } from 'node:child_process';
import { loadImage, createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';

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

async function main(): Promise<void> {
  const page = await renderPage();
  const session = await ort.InferenceSession.create('/workspace/public/models/segnet.onnx', { executionProviders: ['cpu'] });
  const mod = await import('../src/lib/omr/worker');
  mod.__injectSegnetSession(session);
  const request = { width: page.width, height: page.height, data: page.data, debug: true };
  const result = await mod.recognize(request);
  if (!result.ok) {
    console.log('FAIL', result.error);
    return;
  }
  const staffs = result.debug?.staves ?? [];
  for (const s of staffs) {
    console.log(`staff ${s.index}: top=${s.top.toFixed(1)} bottom=${s.bottom.toFixed(1)} left=${s.left.toFixed(1)} right=${s.right.toFixed(1)} space=${s.space.toFixed(2)}`);
  }
  // 裁 staff 2 的 x320-560 区域（疑似连梁八分音符组）——直接用已缩放的 working 图像
  const s2 = staffs[2];
  if (s2) {
    const X0 = 320;
    const Y0 = Math.round(s2.top) - 20;
    const W = 260;
    const H = Math.round(s2.bottom - s2.top) + 40;
    const region = createCanvas(W, H);
    const rctx = region.getContext('2d');
    const src = createCanvas(page.width, page.height);
    const sctx = src.getContext('2d');
    const img = sctx.createImageData(page.width, page.height);
    img.data.set(page.data);
    sctx.putImageData(img, 0, 0);
    rctx.drawImage(src, X0, Y0, W, H, 0, 0, W, H);
    writeFileSync('/tmp/staff2-beams.png', region.toBuffer('image/png'));
    console.log(`saved staff2-beams crop ${W}x${H}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
