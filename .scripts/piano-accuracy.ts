/* 钢琴谱（双系统 × 双谱表）准确率测试：
 * 渲染真实钢琴谱版面（Bravura 字体）：高音+低音谱表、b♭ 调号、4/4 拍号、
 * 四分/八分连梁/十六分双梁/附点/二分/全音符、四分/八分休止符、加线、低音谱表音高。
 * 跑 segnet + 启发式两条路径，逐谱表计算音高/节奏/综合准确率（最近 x 匹配 ≤30px）。 */
import * as ort from 'onnxruntime-web';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';

(globalThis as unknown as { self?: unknown }).self = globalThis;

GlobalFonts.registerFromPath('/workspace/node_modules/@vexflow-fonts/bravura/bravura.otf', 'Bravura');

const SP = 13.375;
const GLYPH_TREBLE = '\uE050';
const GLYPH_BASS = '\uE062';
const GLYPH_FLAT = '\uE260';
const GLYPH_TIME_4 = '\uE084';

const STEP_IDX = 'CDEFGAB';
const diatonic = (step: string, octave: number) => octave * 7 + STEP_IDX.indexOf(step);
const trebleK = (step: string, octave: number) => diatonic(step, octave) - 30; // E4 底线 = 0
const bassK = (step: string, octave: number) => diatonic(step, octave) - 18; // G2 底线 = 0

type Type = 1 | 2 | 4 | 8 | 16;
interface Pitch {
  step: string;
  octave: number;
}

interface GT {
  staffIndex: number;
  x: number;
  k: number;
  type: Type;
  dot: boolean;
  rest: boolean;
}

interface StaffCtx {
  top: number;
  bottom: number;
  clef: 'treble' | 'bass';
  staffIndex: number;
}

const yOf = (staff: StaffCtx, k: number) => staff.bottom - (k * SP) / 2;
const kOfPitch = (staff: StaffCtx, p: Pitch) => (staff.clef === 'treble' ? trebleK(p.step, p.octave) : bassK(p.step, p.octave));

interface Renderer {
  ctx: CanvasRenderingContext2D;
  gt: GT[];
  staffIndex: number;
}

function ledgerLine(ctx: CanvasRenderingContext2D, staff: StaffCtx, x: number, k: number): void {
  ctx.fillStyle = '#000000';
  ctx.fillRect(x - 0.9 * SP, yOf(staff, k) - 0.7, 1.8 * SP, 1.4);
}

/** 为谱表外的音符画加线：k<=-2 每 2 级一条，k>=10 每 2 级一条 */
function drawLedgers(ctx: CanvasRenderingContext2D, staff: StaffCtx, x: number, k: number): void {
  if (k <= -2) for (let kk = k; kk <= -2; kk += 2) ledgerLine(ctx, staff, x, kk);
  if (k >= 10) for (let kk = 10; kk <= k; kk += 2) ledgerLine(ctx, staff, x, kk);
}

function head(ctx: CanvasRenderingContext2D, x: number, y: number, hollow: boolean): void {
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
}

function stem(ctx: CanvasRenderingContext2D, x: number, yHead: number, up: boolean, tip: number): { sx: number; yTip: number } {
  const sx = x + (up ? 0.55 * SP : -0.55 * SP);
  const y2 = up ? yHead - tip * SP : yHead + tip * SP;
  ctx.fillStyle = '#000000';
  ctx.fillRect(sx - 0.6, Math.min(yHead, y2), 1.2, Math.abs(y2 - yHead));
  return { sx, yTip: y2 };
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x, y, 0.2 * SP, 0, Math.PI * 2);
  ctx.fill();
}

interface NoteSpec {
  kind: 'note';
  p: Pitch;
  type: Type;
  dot?: boolean;
  beam?: number; // 连梁组号
}
interface RestSpec {
  kind: 'rest';
  type: 4 | 8 | 16;
}
type Ev = NoteSpec | RestSpec;

function addGT(renderer: Renderer, staff: StaffCtx, x: number, ev: Ev): void {
  if (ev.kind === 'note') {
    renderer.gt.push({ staffIndex: staff.staffIndex, x, k: kOfPitch(staff, ev.p), type: ev.type, dot: !!ev.dot, rest: false });
  } else {
    renderer.gt.push({ staffIndex: staff.staffIndex, x, k: 0, type: ev.type, dot: false, rest: true });
  }
}

/** 手工绘制休止符（Bravura 的 rest8/rest16 字形过矮小，直接画真实形状）：
 * 四分：粗 z 字形；八分：斜杠带 + 顶部钩 + 底部钩；十六分：再多一个底部钩。
 * 形状保证任意竖直列贯穿时墨迹总高度 ≥1.5sp（满足 tallRestScore 的 span 约束）。 */
function drawRest(ctx: CanvasRenderingContext2D, staff: StaffCtx, x: number, type: 4 | 8 | 16): void {
  const ym = staff.top + 2.5 * SP;
  ctx.fillStyle = '#000000';
  if (type === 4) {
    ctx.lineWidth = 0.5 * SP;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 0.55 * SP, ym - 1.0 * SP);
    ctx.lineTo(x + 0.55 * SP, ym - 0.95 * SP);
    ctx.lineTo(x - 0.55 * SP, ym + 0.95 * SP);
    ctx.lineTo(x + 0.55 * SP, ym + 1.0 * SP);
    ctx.stroke();
    return;
  }
  // 斜杠带（左上高、右下低）
  ctx.save();
  ctx.translate(x, ym + 0.15 * SP);
  ctx.rotate(-0.92);
  ctx.fillRect(-0.95 * SP, -0.3 * SP, 1.9 * SP, 0.6 * SP);
  ctx.restore();
  // 顶部钩（靠左，高于斜杠顶）
  ctx.beginPath();
  ctx.arc(x - 0.15 * SP, ym - 0.75 * SP, 0.28 * SP, 0, Math.PI * 2);
  ctx.fill();
  // 底部钩（右）
  ctx.beginPath();
  ctx.arc(x + 0.4 * SP, ym + 0.85 * SP, 0.24 * SP, 0, Math.PI * 2);
  ctx.fill();
  if (type === 16) {
    ctx.beginPath();
    ctx.arc(x + 0.05 * SP, ym + 1.15 * SP, 0.24 * SP, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** 绘制一个小节；events 的 x 为小节内相对坐标（ox 字段） */
function drawMeasure(renderer: Renderer, staff: StaffCtx, x0: number, events: Ev[]): void {
  const { ctx } = renderer;
  // 画加线（先画，避免盖住符头）
  for (let i = 0; i < events.length; i += 1) {
    const ev = events[i];
    if (ev.kind === 'note') {
      const x = x0 + (ev as NoteSpec & { ox: number }).ox;
      const k = kOfPitch(staff, ev.p);
      drawLedgers(ctx, staff, x, k);
    }
  }
  // 画符头与符干
  const beamStems = new Map<number, Array<{ sx: number; yTip: number; x: number; k: number; type: 8 | 16 }>>();
  for (let i = 0; i < events.length; i += 1) {
    const ev = events[i];
    if (ev.kind === 'rest') {
      const x = x0 + (ev as RestSpec & { ox: number }).ox;
      drawRest(ctx, staff, x, ev.type);
      continue;
    }
    const spec = ev as NoteSpec & { ox: number };
    const x = x0 + spec.ox;
    const k = kOfPitch(staff, spec.p);
    const y = yOf(staff, k);
    const hollow = spec.type === 1 || spec.type === 2;
    head(ctx, x, y, hollow);
    if (spec.beam !== undefined) {
      beamStems.set(spec.beam, beamStems.get(spec.beam) ?? []);
      beamStems.get(spec.beam)!.push({ sx: 0, yTip: 0, x, k, type: spec.type });
    } else if (spec.type === 2 || spec.type === 4 || spec.type === 8 || spec.type === 16) {
      const up = k <= 4;
      stem(ctx, x, y, up, 3.2);
    }
  }
  // 画连梁：组内方向一致，梁在谱表外 2.2sp；符干需延伸到最外梁（双梁+7px）
  for (const [beamId, notes] of beamStems) {
    const meanK = notes.reduce((sum, n) => sum + n.k, 0) / notes.length;
    const up = meanK <= 4;
    const beamY = up ? staff.top - 2.2 * SP : staff.bottom + 2.2 * SP;
    const first = notes[0];
    const last = notes[notes.length - 1];
    const levels = first.type === 16 ? 2 : 1;
    // 梁厚 3.5px，双梁间距 = 梁厚（真实乐谱两梁之间有间隙，避免粘连成一块粗梁）
    const gap = up ? -7 : 7;
    const topBeamY = beamY + (levels - 1) * gap;
    const stemsOfGroup: Array<{ sx: number; yTip: number }> = [];
    for (const n of notes) {
      const y = yOf(staff, n.k);
      const s = stem(ctx, n.x, y, up, up ? (y - topBeamY) / SP : (topBeamY - y) / SP);
      stemsOfGroup.push(s);
    }
    for (let level = 0; level < levels; level += 1) {
      const ly = beamY + level * gap;
      ctx.fillStyle = '#000000';
      ctx.fillRect(Math.min(...stemsOfGroup.map((s) => s.sx)) - 1, ly - 3.5, Math.abs(last.x - first.x) + 2, 3.5);
    }
  }
  // 画附点与拍号数字（附点画在符头右侧 ~1sp 处）
  for (let i = 0; i < events.length; i += 1) {
    const ev = events[i];
    if (ev.kind === 'note' && ev.dot) {
      const spec = ev as NoteSpec & { ox: number };
      const x = x0 + spec.ox;
      const k = kOfPitch(staff, spec.p);
      // 音符在线上（k 偶数）时附点画在上方间隙（dy=-0.5sp），在间里时画在同一间
      const dotY = yOf(staff, k) + (k % 2 === 0 ? -0.5 : 0) * SP;
      dot(ctx, x + 1.05 * SP, dotY);
    }
  }
  // GT 记录
  for (let i = 0; i < events.length; i += 1) {
    const ev = events[i];
    const x = x0 + (ev as { ox: number }).ox;
    addGT(renderer, staff, x, ev);
  }
}

function beamNote(ox: number, p: Pitch, type: 8 | 16, beam: number): NoteSpec & { ox: number } {
  return { kind: 'note', p, type, beam, ox };
}
function singleNote(ox: number, p: Pitch, type: Type, dot = false): NoteSpec & { ox: number } {
  return { kind: 'note', p, type, dot, ox };
}
function rest(ox: number, type: 4 | 8 | 16): RestSpec & { ox: number } {
  return { kind: 'rest', type, ox };
}

function drawStaffLine(ctx: CanvasRenderingContext2D, staff: StaffCtx, left: number, right: number): void {
  ctx.fillStyle = '#111111';
  for (let i = 0; i < 5; i += 1) {
    const y = staff.top + i * SP;
    ctx.fillRect(left, y - 0.7, right - left, 1.4);
  }
}

function drawClefKeyTime(
  ctx: CanvasRenderingContext2D,
  staff: StaffCtx,
  x0: number,
  time: boolean,
): void {
  ctx.fillStyle = '#000000';
  // 谱号
  ctx.font = '60px Bravura';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const clefY = staff.clef === 'treble' ? staff.bottom - 0.5 * SP : staff.top + 4.1 * SP;
  ctx.fillText(staff.clef === 'treble' ? GLYPH_TREBLE : GLYPH_BASS, x0 + 1.4 * SP, clefY);
  // b♭ 调号
  const flatK = staff.clef === 'treble' ? 4 : 2; // B 线
  const flatY = yOf(staff, flatK);
  ctx.font = '38px Bravura';
  ctx.fillText(GLYPH_FLAT, x0 + 3.3 * SP, flatY + 0.7 * SP);
  if (time) {
    ctx.font = '40px Bravura';
    ctx.fillText(GLYPH_TIME_4, x0 + 4.9 * SP, staff.top + 1.35 * SP);
    ctx.fillText(GLYPH_TIME_4, x0 + 4.9 * SP, staff.top + 3.15 * SP);
  }
}

function renderScore(): { width: number; height: number; data: Uint8ClampedArray; gt: GT[]; staves: StaffCtx[] } {
  const width = 980;
  const height = 900;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const gt: GT[] = [];
  const staves: StaffCtx[] = [];
  const renderer: Renderer = { ctx, gt, staffIndex: 0 };

  const left = 34;
  const right = 950;

  const mkStaff = (top: number, clef: 'treble' | 'bass'): StaffCtx => {
    const staff: StaffCtx = { top, bottom: top + 4 * SP, clef, staffIndex: renderer.staffIndex };
    renderer.staffIndex += 1;
    staves.push(staff);
    return staff;
  };

  const sys1Treble = mkStaff(100, 'treble');
  const sys1Bass = mkStaff(100 + 4 * SP + 4.5 * SP, 'bass');
  const sys2Treble = mkStaff(100 + 4 * SP + 4.5 * SP + 4 * SP + 13.5 * SP, 'treble');
  const sys2Bass = mkStaff(100 + 4 * SP + 4.5 * SP + 4 * SP + 13.5 * SP + 4 * SP + 4.5 * SP, 'bass');

  const drawSystem = (treble: StaffCtx, bass: StaffCtx, systemIndex: number): void => {
    for (const staff of [treble, bass]) {
      drawStaffLine(ctx, staff, left, right);
      drawClefKeyTime(ctx, staff, left, systemIndex === 0);
    }
    // 小节线：跨两谱表
    const noteStart = left + (systemIndex === 0 ? 7.5 : 5.6) * SP;
    const barY0 = treble.top - SP;
    const barY1 = bass.bottom + SP;
    const measureCount = 4;
    const mWidth = (right - 10 - noteStart) / measureCount;
    ctx.fillStyle = '#000000';
    for (let m = 1; m <= measureCount; m += 1) {
      const bx = noteStart + m * mWidth;
      ctx.fillRect(bx - 0.8, barY0, 1.6, barY1 - barY0);
    }
    return { noteStart, mWidth };
  };

  // ===== 系统 1 =====
  const s1 = drawSystem(sys1Treble, sys1Bass, 0);

  const M1q: Ev[] = [
    singleNote(45, { step: 'C', octave: 4 }, 4),
    singleNote(95, { step: 'D', octave: 4 }, 4),
    singleNote(145, { step: 'E', octave: 4 }, 4),
    singleNote(195, { step: 'F', octave: 4 }, 4),
  ];
  const M1qb: Ev[] = [
    singleNote(45, { step: 'C', octave: 3 }, 4),
    singleNote(95, { step: 'D', octave: 3 }, 4),
    singleNote(145, { step: 'E', octave: 3 }, 4),
    singleNote(195, { step: 'F', octave: 3 }, 4),
  ];
  const M2b8: Ev[] = [
    beamNote(45, { step: 'G', octave: 4 }, 8, 1),
    beamNote(71, { step: 'A', octave: 4 }, 8, 1),
    beamNote(97, { step: 'B', octave: 4 }, 8, 1),
    beamNote(123, { step: 'C', octave: 5 }, 8, 1),
    singleNote(165, { step: 'D', octave: 5 }, 4, true),
    rest(193, 8),
  ];
  const M2b8b: Ev[] = [
    beamNote(45, { step: 'G', octave: 3 }, 8, 1),
    beamNote(71, { step: 'A', octave: 3 }, 8, 1),
    beamNote(97, { step: 'B', octave: 3 }, 8, 1),
    beamNote(123, { step: 'C', octave: 4 }, 8, 1),
    singleNote(165, { step: 'D', octave: 3 }, 4, true),
    rest(193, 8),
  ];
  const M3b16: Ev[] = [
    beamNote(45, { step: 'C', octave: 5 }, 16, 1),
    beamNote(67, { step: 'D', octave: 5 }, 16, 1),
    beamNote(89, { step: 'E', octave: 5 }, 16, 1),
    beamNote(111, { step: 'F', octave: 5 }, 16, 1),
    singleNote(160, { step: 'G', octave: 5 }, 2, true),
  ];
  const M3b16b: Ev[] = [
    beamNote(45, { step: 'C', octave: 3 }, 16, 1),
    beamNote(67, { step: 'D', octave: 3 }, 16, 1),
    beamNote(89, { step: 'E', octave: 3 }, 16, 1),
    beamNote(111, { step: 'F', octave: 3 }, 16, 1),
    singleNote(160, { step: 'F', octave: 3 }, 2, true),
  ];
  const M4w: Ev[] = [singleNote(120, { step: 'C', octave: 5 }, 1)];
  const M4wb: Ev[] = [singleNote(120, { step: 'E', octave: 2 }, 1)];

  drawMeasure(renderer, sys1Treble, s1.noteStart, M1q);
  drawMeasure(renderer, sys1Treble, s1.noteStart + s1.mWidth, M2b8);
  drawMeasure(renderer, sys1Treble, s1.noteStart + 2 * s1.mWidth, M3b16);
  drawMeasure(renderer, sys1Treble, s1.noteStart + 3 * s1.mWidth, M4w);
  drawMeasure(renderer, sys1Bass, s1.noteStart, M1qb);
  drawMeasure(renderer, sys1Bass, s1.noteStart + s1.mWidth, M2b8b);
  drawMeasure(renderer, sys1Bass, s1.noteStart + 2 * s1.mWidth, M3b16b);
  drawMeasure(renderer, sys1Bass, s1.noteStart + 3 * s1.mWidth, M4wb);

  // ===== 系统 2 =====
  const s2 = drawSystem(sys2Treble, sys2Bass, 1);

  const M1q2: Ev[] = [
    singleNote(45, { step: 'E', octave: 4 }, 4),
    singleNote(95, { step: 'F', octave: 4 }, 4),
    singleNote(145, { step: 'G', octave: 4 }, 4),
    singleNote(195, { step: 'A', octave: 4 }, 4),
  ];
  const M1qb2: Ev[] = [
    singleNote(45, { step: 'A', octave: 2 }, 4),
    singleNote(95, { step: 'B', octave: 2 }, 4),
    singleNote(145, { step: 'C', octave: 3 }, 4),
    singleNote(195, { step: 'D', octave: 3 }, 4),
  ];
  const M2b8_2: Ev[] = [
    beamNote(45, { step: 'C', octave: 4 }, 8, 1),
    beamNote(71, { step: 'D', octave: 4 }, 8, 1),
    beamNote(97, { step: 'E', octave: 4 }, 8, 1),
    beamNote(123, { step: 'F', octave: 4 }, 8, 1),
    singleNote(165, { step: 'G', octave: 4 }, 4),
    rest(192, 4),
  ];
  const M2b8b_2: Ev[] = [
    beamNote(45, { step: 'E', octave: 3 }, 8, 1),
    beamNote(71, { step: 'F', octave: 3 }, 8, 1),
    beamNote(97, { step: 'G', octave: 3 }, 8, 1),
    beamNote(123, { step: 'A', octave: 3 }, 8, 1),
    singleNote(165, { step: 'C', octave: 3 }, 4),
    rest(192, 4),
  ];
  const M3b16_2: Ev[] = [
    beamNote(45, { step: 'A', octave: 4 }, 16, 1),
    beamNote(67, { step: 'B', octave: 4 }, 16, 1),
    beamNote(89, { step: 'C', octave: 5 }, 16, 1),
    beamNote(111, { step: 'D', octave: 5 }, 16, 1),
    singleNote(160, { step: 'D', octave: 5 }, 2, true),
  ];
  const M3b16b_2: Ev[] = [
    beamNote(45, { step: 'F', octave: 2 }, 16, 1),
    beamNote(67, { step: 'G', octave: 2 }, 16, 1),
    beamNote(89, { step: 'A', octave: 2 }, 16, 1),
    beamNote(111, { step: 'B', octave: 2 }, 16, 1),
    singleNote(160, { step: 'B', octave: 2 }, 2, true),
  ];
  const M4w2: Ev[] = [singleNote(120, { step: 'C', octave: 4 }, 1)];
  const M4wb2: Ev[] = [singleNote(120, { step: 'A', octave: 2 }, 1)];

  drawMeasure(renderer, sys2Treble, s2.noteStart, M1q2);
  drawMeasure(renderer, sys2Treble, s2.noteStart + s2.mWidth, M2b8_2);
  drawMeasure(renderer, sys2Treble, s2.noteStart + 2 * s2.mWidth, M3b16_2);
  drawMeasure(renderer, sys2Treble, s2.noteStart + 3 * s2.mWidth, M4w2);
  drawMeasure(renderer, sys2Bass, s2.noteStart, M1qb2);
  drawMeasure(renderer, sys2Bass, s2.noteStart + s2.mWidth, M2b8b_2);
  drawMeasure(renderer, sys2Bass, s2.noteStart + 2 * s2.mWidth, M3b16b_2);
  drawMeasure(renderer, sys2Bass, s2.noteStart + 3 * s2.mWidth, M4wb2);

  const img = ctx.getImageData(0, 0, width, height);
  writeFileSync('/tmp/piano-score.png', canvas.toBuffer('image/png'));
  return { width, height, data: new Uint8ClampedArray(img.data), gt, staves };
}

interface RecNote {
  x: number;
  k: number;
  type: Type;
  dot: boolean;
  rest: boolean;
  staffIndex: number;
}

function summarizeByStaff(
  notes: RecNote[],
  gt: GT[],
  tag: string,
): void {
  const staffIndexes = [...new Set(gt.map((g) => g.staffIndex))].sort((a, b) => a - b);
  let tPitch = 0;
  let tRhythm = 0;
  let tBoth = 0;
  let tTotal = 0;
  let tRestPitch = 0;
  let tRestRhythm = 0;
  let tRestTotal = 0;
  const mis: string[] = [];

  for (const si of staffIndexes) {
    const staffNotes = notes.filter((n) => n.staffIndex === si);
    const staffGt = gt.filter((g) => g.staffIndex === si).sort((a, b) => a.x - b.x);
    let pitch = 0;
    let rhythm = 0;
    let both = 0;
    let restRhythm = 0;
    const totalNotes = staffGt.filter((g) => !g.rest).length;
    const totalRests = staffGt.filter((g) => g.rest).length;

    // 音符：最近 x 匹配（不重复使用同一识别音符）
    const used = new Set<number>();
    for (const g of staffGt) {
      if (g.rest) continue;
      let bestIdx = -1;
      let bestD = Infinity;
      staffNotes.forEach((n, idx) => {
        if (used.has(idx)) return;
        const d = Math.abs(n.x - g.x);
        if (d < bestD) {
          bestD = d;
          bestIdx = idx;
        }
      });
      if (bestIdx < 0 || bestD > 30) {
        mis.push(`s${si} 漏检/错位 expected k${g.k} t${g.type}@x${g.x} (no match)`);
        continue;
      }
      used.add(bestIdx);
      const n = staffNotes[bestIdx];
      const pitchOk = n.k === g.k;
      const rhythmOk = n.type === g.type && n.dot === g.dot;
      if (pitchOk) pitch += 1;
      if (rhythmOk) rhythm += 1;
      if (pitchOk && rhythmOk) both += 1;
      if (!pitchOk) mis.push(`s${si} pitch: exp k${g.k}@x${g.x} got k${n.k}@x${Math.round(n.x)} (t exp${g.type} got${n.type})`);
      if (!rhythmOk) mis.push(`s${si} rhythm: exp t${g.type}${g.dot ? 'd' : ''}@x${g.x} got t${n.type}${n.dot ? 'd' : ''}@x${Math.round(n.x)}`);
    }
    // 休止符：类型对比（识别休止符位置与 GT 匹配）
    const restNotes = notes.filter((n) => n.rest);
    for (const g of staffGt) {
      if (!g.rest) continue;
      let bestD = Infinity;
      for (const n of restNotes) {
        const d = Math.abs(n.x - g.x);
        if (d < bestD) bestD = d;
      }
      if (bestD <= 30 && g.type === 4) restRhythm += 1; // 识别器一律输出 4，只有 GT=4 才可能匹配
    }
    const nStr = `s${si}(${si % 2 === 0 ? 'treble' : 'bass'}): notes ${pitch}/${totalNotes} pitch, ${rhythm}/${totalNotes} rhythm, ${both}/${totalNotes} both${totalRests ? `, rests ${restRhythm}/${totalRests} (type4)` : ''}`;
    console.log(`[${tag}] ${nStr}`);
    tPitch += pitch;
    tRhythm += rhythm;
    tBoth += both;
    tTotal += totalNotes;
    tRestRhythm += restRhythm;
    tRestTotal += totalRests;
  }
  console.log(`[${tag}] TOTAL notes: pitch=${tPitch}/${tTotal} (${((tPitch / Math.max(1, tTotal)) * 100).toFixed(1)}%) rhythm=${tRhythm}/${tTotal} (${((tRhythm / Math.max(1, tTotal)) * 100).toFixed(1)}%) both=${tBoth}/${tTotal} (${((tBoth / Math.max(1, tTotal)) * 100).toFixed(1)}%)`);
  console.log(`[${tag}] TOTAL rests(type4-match): ${tRestRhythm}/${tRestTotal}`);
  if (mis.length > 0 && mis.length <= 60) {
    console.log(`[${tag}] mismatches:`);
    for (const m of mis.slice(0, 60)) console.log(`  ${m}`);
  } else if (mis.length > 60) {
    console.log(`[${tag}] mismatches (first 60 of ${mis.length}):`);
    for (const m of mis.slice(0, 60)) console.log(`  ${m}`);
  }
}

function collect(result: Awaited<ReturnType<typeof import('../src/lib/omr/worker').recognize>>): RecNote[] {
  if (!result.ok) return [];
  const notes: RecNote[] = [];
  for (const d of result.debug?.notes ?? []) {
    notes.push({ x: d.x, k: d.k, type: d.type as Type, dot: d.dot, rest: false, staffIndex: d.staffIndex });
  }
  for (const r of result.debug?.rests ?? []) {
    notes.push({ x: r.x, k: 0, type: r.type as Type, dot: false, rest: true, staffIndex: r.staffIndex });
  }
  return notes;
}

function dumpNotes(notes: RecNote[], gt: GT[], tag: string): void {
  const staffIndexes = [...new Set(gt.map((g) => g.staffIndex))].sort((a, b) => a - b);
  for (const si of staffIndexes) {
    const list = notes
      .filter((n) => n.staffIndex === si)
      .sort((a, b) => a.x - b.x)
      .map((n) => `x${Math.round(n.x)}${n.rest ? `R${n.type}` : `k${n.k}t${n.type}${n.dot ? 'd' : ''}`}`);
    console.log(`[${tag}] s${si} notes: ${list.join(' ')}`);
  }
}

async function main(): Promise<void> {
  const { width, height, data, gt } = renderScore();
  console.log(`canvas ${width}x${height}, GT notes=${gt.filter((g) => !g.rest).length} rests=${gt.filter((g) => g.rest).length}`);
  if (process.env.RENDER_ONLY) return;
  const session = await ort.InferenceSession.create('/workspace/public/models/segnet.onnx', { executionProviders: ['cpu'] });
  const mod = await import('../src/lib/omr/worker');
  mod.__injectSegnetSession(session);
  const request = { width, height, data, debug: true };
  if (!process.env.SKIP_SEGNET) {
    const t0 = Date.now();
    const seg = await mod.recognize(request);
    console.log(`[segnet] time: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
    if (!seg.ok) {
      console.log('[segnet] FAIL:', seg.error);
    } else {
      const collected = collect(seg);
      dumpNotes(collected, gt, 'segnet');
      summarizeByStaff(collected, gt, 'segnet');
    }
  }

  mod.__setSegnetEnabled(false);
  const heu = await mod.recognize(request);
  if (!heu.ok) {
    console.log('[heuristic] FAIL:', heu.error);
  } else {
    summarizeByStaff(collect(heu), gt, 'heuristic');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
