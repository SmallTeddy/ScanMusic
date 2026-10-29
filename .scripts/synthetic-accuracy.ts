/* 客观准确率测试：用 Bravura 字体绘制已知内容的合成乐谱 → segnet/启发式识别 → 计算音高与时值准确率 */
import * as ort from 'onnxruntime-web';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

(globalThis as unknown as { self?: unknown }).self = globalThis;

GlobalFonts.registerFromPath('/workspace/node_modules/@vexflow-fonts/bravura/bravura.otf', 'Bravura');

const SP = 13.375; // 与 test.pdf 150dpi 一致的谱间距
const TREBLE_CLEF = '\uE050';
const QUARTER_REST = '\uE4E5';
const FLAG_UP = '\uE240';
const FLAG_DOWN = '\uE241';

// 音高 → k（treble，E4=0）；y = staffBottom - k*sp/2
const kOf = (step: string, octave: number) => octave * 7 + 'CDEFGAB'.indexOf(step) - 30;

interface GT {
  x: number;
  k: number;
  type: 1 | 2 | 4 | 8 | 16;
  rest?: boolean;
}

function drawScore(): { width: number; height: number; data: Uint8ClampedArray; gt: GT[] } {
  const width = 940;
  const height = 320;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const staffTop = 120;
  const staffBottom = staffTop + 4 * SP;
  // 五线
  ctx.fillStyle = '#111111';
  for (let i = 0; i < 5; i += 1) {
    const y = staffTop + i * SP;
    ctx.fillRect(30, y - 0.7, width - 60, 1.4);
  }
  // 谱号
  ctx.fillStyle = '#000000';
  ctx.font = '60px Bravura';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(TREBLE_CLEF, 44, staffBottom - 0.5 * SP);
  // 拍号 4/4（用 Bravura 数字文本太麻烦，直接画小矩形示意不影响识别）
  ctx.font = '22px sans-serif';
  ctx.fillText('4', 92, staffTop + 1.35 * SP);
  ctx.fillText('4', 92, staffTop + 3.15 * SP);

  const measureWidth = 190;
  const measures = 4;
  const gt: GT[] = [];

  const head = (x: number, y: number, hollow: boolean) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.35);
    ctx.beginPath();
    ctx.ellipse(0, 0, 0.62 * SP, 0.43 * SP, 0, 0, Math.PI * 2);
    if (hollow) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.4;
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.fillStyle = '#000000';
      ctx.fill();
    }
    ctx.restore();
  };
  const stem = (x: number, yHead: number, up: boolean, tip = 3.2) => {
    const sx = x + (up ? 0.55 * SP : -0.55 * SP);
    const y2 = up ? yHead - tip * SP : yHead + tip * SP;
    ctx.fillStyle = '#000000';
    ctx.fillRect(sx - 0.6, Math.min(yHead, y2), 1.2, Math.abs(y2 - yHead));
    return { sx, yTip: y2 };
  };
  const ledger = (x: number, y: number) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x - 0.9 * SP, y - 0.7, 1.8 * SP, 1.4);
  };
  const addNote = (x: number, pitch: { step: string; octave: number }, type: 1 | 2 | 4 | 8 | 16, extra?: { beamUp?: boolean }) => {
    const k = kOf(pitch.step, pitch.octave);
    const y = staffBottom - (k * SP) / 2;
    if (k % 2 === 0 && Math.abs(k) > 4) {
      // 需要加线（下加线：k<-2? treble 里 k%2==0 且超出谱表）
      for (let kk = -2; kk >= Math.min(k, -2); kk -= 2) ledger(x, staffBottom - (kk * SP) / 2);
    }
    const hollow = type === 1 || type === 2;
    head(x, y, hollow);
    if (type >= 4 || type === 2) {
      // 二分音符（type=2）也有符干；全音符（type=1）没有
      const up = k <= 4 && !extra?.beamUp;
      const { yTip } = stem(x, y, up);
      if (type === 8) {
        if (extra?.beamUp) {
          // 横梁由外部绘制
        } else {
          ctx.font = '46px Bravura';
          ctx.fillStyle = '#000000';
          ctx.fillText(up ? FLAG_UP : FLAG_DOWN, up ? yTip - 8 : yTip - 20, yTip);
        }
      }
    }
    gt.push({ x, k, type });
  };

  // M1：四分 C4 D4 E4 F4
  let x = 130;
  for (const p of [
    { step: 'C', octave: 4 },
    { step: 'D', octave: 4 },
    { step: 'E', octave: 4 },
    { step: 'F', octave: 4 },
  ]) {
    addNote(x, p, 4);
    x += 44;
  }
  // M2：G4 四分、A4 二分、四分休止
  x = 130 + measureWidth;
  addNote(x, { step: 'G', octave: 4 }, 4);
  addNote(x + 44, { step: 'A', octave: 4 }, 2);
  ctx.font = '60px Bravura';
  ctx.fillStyle = '#000000';
  ctx.fillText(QUARTER_REST, x + 128, staffTop + 2 * SP);
  // M3：G4 A4 B4 C5 八分连梁 + D5 二分
  x = 130 + measureWidth * 2;
  const beamY = staffTop - 2.2 * SP; // 连梁高度（符干顶端汇聚处）
  const beamNotes = [
    { step: 'G', octave: 4 },
    { step: 'A', octave: 4 },
    { step: 'B', octave: 4 },
    { step: 'C', octave: 5 },
  ];
  const beamStems: Array<{ sx: number; yTip: number }> = [];
  beamNotes.forEach((p, i) => {
    const k = kOf(p.step, p.octave);
    const y = staffBottom - (k * SP) / 2;
    head(x + i * 24, y, false);
    // 符干从符头延伸到横梁（长度随音高变化，真实乐谱形态）
    const sx = x + i * 24 + 0.55 * SP;
    ctx.fillStyle = '#000000';
    ctx.fillRect(sx - 0.6, beamY, 1.2, y - beamY);
    beamStems.push({ sx, yTip: beamY });
    gt.push({ x: x + i * 24, k, type: 8 });
  });
  // 单横梁（八分）
  ctx.fillStyle = '#000000';
  const beamLeft = beamStems[0].sx - 1;
  const beamRight = beamStems[3].sx + 1;
  ctx.fillRect(beamLeft, beamY - 3.5, beamRight - beamLeft, 3.5);
  addNote(x + 150, { step: 'D', octave: 5 }, 2);
  // M4：全音符 C5（空心，无符干）
  x = 130 + measureWidth * 3;
  addNote(x + 50, { step: 'C', octave: 5 }, 1);

  const img = ctx.getImageData(0, 0, width, height);
  return { width, height, data: new Uint8ClampedArray(img.data), gt };
}

function summarize(notes: Array<{ x: number; k: number; type: number; rest: boolean }>, gt: GT[], tag: string): void {
  const ordered = [...notes].sort((a, b) => a.x - b.x);
  const expected = gt.filter((g) => !g.rest).length;
  let pitchHit = 0;
  let rhythmHit = 0;
  let bothHit = 0;
  let i = 0;
  const gts = [...gt].sort((a, b) => a.x - b.x);
  for (const g of gts) {
    // 找 x 最近的非休止识别音符
    let best: (typeof ordered)[number] | null = null;
    let bestD = Infinity;
    for (const n of ordered) {
      const d = Math.abs(n.x - g.x);
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    if (!best || bestD > 30) continue;
    i += 1;
    if (best.k === g.k) pitchHit += 1;
    if (best.type === g.type) rhythmHit += 1;
    if (best.k === g.k && best.type === g.type) bothHit += 1;
  }
  const total = Math.max(1, expected);
  console.log(`[${tag}] expectedNotes=${expected} recognizedNotes=${ordered.length}`);
  console.log(`[${tag}] pitchAccuracy=${(pitchHit / total * 100).toFixed(1)}% (${pitchHit}/${total})`);
  console.log(`[${tag}] rhythmAccuracy=${(rhythmHit / total * 100).toFixed(1)}% (${rhythmHit}/${total})`);
  console.log(`[${tag}] bothAccuracy=${(bothHit / total * 100).toFixed(1)}% (${bothHit}/${total})`);
  console.log(
    `[${tag}] recognized:`,
    ordered.map((n) => (n.rest ? 'R' : `k${n.k},t${n.type}`)).join(' '),
  );
  console.log(
    `[${tag}] expected:  `,
    gts.map((g) => (g.rest ? 'R' : `k${g.k},t${g.type}`)).join(' '),
  );
}

async function main(): Promise<void> {
  const { width, height, data, gt } = drawScore();
  console.log(`canvas ${width}x${height}`);
  const session = await ort.InferenceSession.create('/workspace/public/models/segnet.onnx', { executionProviders: ['cpu'] });
  const mod = await import('../src/lib/omr/worker');
  mod.__injectSegnetSession(session);
  const request = { width, height, data, debug: true };
  const t0 = Date.now();
  const seg = await mod.recognize(request);
  console.log(`[segnet] time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  if (!seg.ok) {
    console.log('[segnet] FAIL:', seg.error);
  } else {
    const notes = seg.debug?.notes.map((n) => ({ x: n.x, k: n.k, type: n.type, rest: false })) ?? [];
    summarize(notes, gt, 'segnet');
  }

  mod.__setSegnetEnabled(false);
  const heu = await mod.recognize(request);
  if (!heu.ok) {
    console.log('[heuristic] FAIL:', heu.error);
  } else {
    const notes = heu.debug?.notes.map((n) => ({ x: n.x, k: n.k, type: n.type, rest: false })) ?? [];
    summarize(notes, gt, 'heuristic');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
