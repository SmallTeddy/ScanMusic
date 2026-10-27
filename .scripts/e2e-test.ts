/* 端到端验证：pdftoppm 渲染 test.pdf 第 1 页 → worker.recognize()（segnet 路径）→ 打印统计；
 * 再关闭 segnet 跑启发式路径对比。 */
import * as ort from 'onnxruntime-web';
import { execSync } from 'node:child_process';
import { loadImage, createCanvas } from '@napi-rs/canvas';

const MODEL = '/workspace/public/models/segnet.onnx';

(globalThis as unknown as { self?: unknown }).self = globalThis;

async function renderPage(): Promise<{ width: number; height: number; data: Uint8ClampedArray }> {
  execSync('pdftoppm -png -r 150 -f 1 -l 1 /workspace/public/test.pdf /tmp/e2e-page', { stdio: 'pipe' });
  const image = await loadImage('/tmp/e2e-page-1.png');
  const scale = Math.min(1, 1700 / image.width, 2400 / image.height);
  const width = Math.max(1, Math.floor(image.width * scale));
  const height = Math.max(1, Math.floor(image.height * scale));
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, width, height);
  const img = ctx.getImageData(0, 0, width, height);
  return { width, height, data: new Uint8ClampedArray(img.data) };
}

function pitchLabel(p: { step: string; octave: number; alter?: number }): string {
  return `${p.step}${p.alter && p.alter > 0 ? '#' : p.alter && p.alter < 0 ? 'b' : ''}${p.octave}`;
}

function summarize(result: Awaited<ReturnType<typeof import('../src/lib/omr/worker').recognize>>, tag: string): void {
  if (!result.ok) {
    console.log(`[${tag}] FAIL: ${result.error}`);
    return;
  }
  const { stats, score } = result;
  const noteCounts = { 1: 0, 2: 0, 4: 0, 8: 0, 16: 0 };
  let rests = 0;
  const pitches: string[] = [];
  for (const part of score.parts) {
    for (const staff of part.staves) {
      for (const measure of staff.measures) {
        for (const note of measure.notes) {
          if (note.rest) rests += 1;
          else {
            noteCounts[note.type] += 1;
            if (pitches.length < 40) for (const p of note.pitches) pitches.push(`${pitchLabel(p)}@${part.name}`);
          }
        }
      }
    }
  }
  console.log(`[${tag}] staves=${stats.staves} measures=${stats.measures} notes=${stats.notes}`);
  console.log(`[${tag}] type dist (whole/half/quarter/8th/16th): ${JSON.stringify(noteCounts)} rests=${rests}`);
  console.log(`[${tag}] sample pitches: ${pitches.join(', ')}`);
}

async function main(): Promise<void> {
  console.log('step: rendering pdf...');
  const page = await renderPage();
  console.log(`page ${page.width}x${page.height}`);
  const session = await ort.InferenceSession.create(MODEL, { executionProviders: ['cpu'] });
  const mod = await import('../src/lib/omr/worker');
  mod.__injectSegnetSession(session);

  const request = { width: page.width, height: page.height, data: page.data, debug: true };
  let t0 = Date.now();
  const segnetResult = await mod.recognize(request);
  console.log(`[segnet] total time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  summarize(segnetResult, 'segnet');

  mod.__setSegnetEnabled(false);
  t0 = Date.now();
  const heuristicResult = await mod.recognize(request);
  console.log(`[heuristic] total time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  summarize(heuristicResult, 'heuristic');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
