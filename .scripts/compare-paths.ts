/* 对比 segnet 与启发式逐音符位置：找出 segnet 独有的音符（可能漏检或误检） */
import * as ort from 'onnxruntime-web';
import { execSync } from 'node:child_process';
import { loadImage, createCanvas } from '@napi-rs/canvas';

(globalThis as unknown as { self?: unknown }).self = globalThis;

async function renderPage(): Promise<{ width: number; height: number; data: Uint8ClampedArray }> {
  execSync('pdftoppm -png -r 150 -f 1 -l 1 /workspace/public/test.pdf /tmp/cmp-page', { stdio: 'pipe' });
  const image = await loadImage('/tmp/cmp-page-1.png');
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
  const seg = await mod.recognize(request);
  mod.__setSegnetEnabled(false);
  const heu = await mod.recognize(request);
  if (!seg.ok || !heu.ok) {
    console.log('FAIL', seg.ok ? '' : seg.error, heu.ok ? '' : heu.error);
    return;
  }
  const staffs = seg.debug?.staves ?? [];
  // 每根谱表：按 x 排序的音符 (x,k)
  const collect = (debugNotes: Array<{ staffIndex: number; x: number; k: number }>) => {
    const map = new Map<number, Array<{ x: number; k: number }>>();
    for (const n of debugNotes) {
      if (!map.has(n.staffIndex)) map.set(n.staffIndex, []);
      map.get(n.staffIndex)!.push({ x: n.x, k: n.k });
    }
    for (const list of map.values()) list.sort((a, b) => a.x - b.x);
    return map;
  };
  const segNotes = collect(seg.debug?.notes ?? []);
  const heuNotes = collect(heu.debug?.notes ?? []);

  for (const staff of staffs) {
    const s = segNotes.get(staff.index) ?? [];
    const h = heuNotes.get(staff.index) ?? [];
    // 启发式中缺失（segnet 独有）：x 与任何启发式音符 > 1.5sp 才视为新增
    const sp = staff.space;
    const added = s.filter((n) => !h.some((m) => Math.abs(m.x - n.x) < sp * 1.5));
    // segnet 中缺失（启发式独有）
    const missing = h.filter((n) => !s.some((m) => Math.abs(m.x - n.x) < sp * 1.5));
    console.log(`staff ${staff.index}: segnet=${s.length} heuristic=${h.length} segnetOnly=${added.length} heuristicOnly=${missing.length}`);
    if (added.length > 0) console.log('  segnet-only:', added.map((n) => `x${Math.round(n.x)},k${n.k}`).join(' '));
    if (missing.length > 0) console.log('  heuristic-only:', missing.map((n) => `x${Math.round(n.x)},k${n.k}`).join(' '));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
