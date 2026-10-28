/* 诊断脚本：渲染 test.pdf → worker.recognize()（segnet 路径，debug:true）→ 导出逐音符/休止符/谱表细节 */
import * as ort from 'onnxruntime-web';
import { execSync } from 'node:child_process';
import { loadImage, createCanvas } from '@napi-rs/canvas';

const MODEL = '/workspace/public/models/segnet.onnx';

(globalThis as unknown as { self?: unknown }).self = globalThis;

async function renderPage(): Promise<{ width: number; height: number; data: Uint8ClampedArray }> {
  execSync('pdftoppm -png -r 150 -f 1 -l 1 /workspace/public/test.pdf /tmp/diag-omr-page', { stdio: 'pipe' });
  const image = await loadImage('/tmp/diag-omr-page-1.png');
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
  console.log(`page ${page.width}x${page.height}`);
  const session = await ort.InferenceSession.create(MODEL, { executionProviders: ['cpu'] });
  const mod = await import('../src/lib/omr/worker');
  mod.__injectSegnetSession(session);
  const t0 = Date.now();
  const res = await mod.recognize({ width: page.width, height: page.height, data: page.data, debug: true });
  console.log(`time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  if (!res.ok) {
    console.log('FAIL:', res.error);
    return;
  }
  console.log('stats:', JSON.stringify(res.stats));
  const d = res.debug!;
  console.log('--- staves ---');
  for (const s of d.staves) {
    console.log(`staff#${s.index} sys=${s.systemIndex} clef=${s.clef} top=${s.top} bottom=${s.bottom} left=${s.left} right=${s.right} space=${s.space.toFixed(2)}`);
  }
  console.log('--- barlines (systemIndex, x) ---');
  for (const b of d.barlines) console.log(`  sys=${b.systemIndex} x=${b.x}`);
  const byStaff = new Map<number, typeof d.notes>();
  for (const n of d.notes) {
    if (!byStaff.has(n.staffIndex)) byStaff.set(n.staffIndex, []);
    byStaff.get(n.staffIndex)!.push(n);
  }
  for (const [staffIndex, notes] of [...byStaff.entries()].sort((a, b) => a[0] - b[0])) {
    notes.sort((a, b) => a.x - b.x);
    console.log(`--- staff#${staffIndex} notes (${notes.length}) ---`);
    for (const n of notes) {
      console.log(
        `x=${n.x.toFixed(1)} y=${n.y.toFixed(1)} k=${n.k} type=${n.type} dot=${n.dot} filled=${n.filled} stem=${n.stem} beamed=${n.beamed}`,
      );
    }
  }
  const rests = d.rests.slice().sort((a, b) => a.staffIndex - b.staffIndex || a.x - b.x);
  console.log(`--- rests (${rests.length}) ---`);
  for (const r of rests) console.log(`staff#${r.staffIndex} x=${r.x.toFixed(1)} y=${r.y.toFixed(1)} type=${r.type}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
