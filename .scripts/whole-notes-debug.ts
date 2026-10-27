/* 调试：打印 segnet 路径识别出的全体符（type=1）候选位置，判断是否合理 */
import * as ort from 'onnxruntime-web';
import { execSync } from 'node:child_process';
import { loadImage, createCanvas } from '@napi-rs/canvas';

(globalThis as unknown as { self?: unknown }).self = globalThis;

async function renderPage(): Promise<{ width: number; height: number; data: Uint8ClampedArray }> {
  execSync('pdftoppm -png -r 150 -f 1 -l 1 /workspace/public/test.pdf /tmp/dbg-page', { stdio: 'pipe' });
  const image = await loadImage('/tmp/dbg-page-1.png');
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
  const result = await mod.recognize({ width: page.width, height: page.height, data: page.data, debug: true });
  if (!result.ok) {
    console.log('FAIL:', result.error);
    return;
  }
  const whole: Array<{ staff: number; measure: number; k: number }> = [];
  const statsByMeasure = new Map<string, number>();
  result.score.parts.forEach((part, pi) => {
    part.staves.forEach((staff, si) => {
      staff.measures.forEach((measure, mi) => {
        for (const note of measure.notes) {
          if (!note.rest && note.type === 1) {
            whole.push({ staff: si, measure: mi, k: (note.pitches[0]?.octave ?? 0) });
            const key = `staff${si}.m${mi}`;
            statsByMeasure.set(key, (statsByMeasure.get(key) ?? 0) + 1);
          }
        }
      });
    });
  });
  console.log('whole-note clusters by staff.measure (count):');
  console.log([...statsByMeasure.entries()].map(([k, v]) => `${k}=${v}`).join(' '));
  console.log('total whole notes:', whole.length);
  console.log('debug candidates total:', result.debug?.rawCandidates.length ?? 0);
  const notes = result.debug?.notes ?? [];
  const wholeNotes = notes.filter((n) => n.type === 1);
  console.log('whole notes positions (x, k) sample:', wholeNotes.slice(0, 60).map((n) => `${Math.round(n.x)},${n.k}`).join(' '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
