import {
  clefBaseIndex,
  newId,
  pitchFromIndex,
  type Clef,
  type Measure,
  type Note,
  type Part,
  type Score,
} from '../../types/score';

export interface OmrRequest {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  debug?: boolean;
}

export interface OmrStats {
  staves: number;
  measures: number;
  notes: number;
  width: number;
  height: number;
}

export interface OmrDebugNote {
  x: number;
  y: number;
  k: number;
  staffIndex: number;
  type: number;
  dot: boolean;
  filled: boolean;
  stem: boolean;
  beamed: boolean;
}

export interface OmrDebugRest {
  x: number;
  y: number;
  staffIndex: number;
  type: number;
}

export interface OmrDebugStaff {
  index: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
  space: number;
  clef: Clef;
  systemIndex: number;
}

export interface OmrDebug {
  staves: OmrDebugStaff[];
  notes: OmrDebugNote[];
  rests: OmrDebugRest[];
  barlines: Array<{ systemIndex: number; x: number }>;
  beams: Array<{ staffIndex: number; y: number; startX: number; endX: number }>;
  rawCandidates: Array<{ staffIndex: number; x: number; y: number; k: number; score: number }>;
}

export type OmrResponse =
  | { ok: true; score: Score; stats: OmrStats; debug?: OmrDebug }
  | { ok: false; error: string };

interface LineRun {
  center: number;
  top: number;
  bottom: number;
}

interface RawStaff {
  top: number;
  bottom: number;
  space: number;
  left: number;
  right: number;
  lineRuns: LineRun[];
  clef: Clef;
  systemIndex: number;
  staffInSystem: number;
  systemSize: number;
  index: number;
}

interface Candidate {
  x: number;
  y: number;
  k: number;
  score: number;
  inner: number;
}

interface Cluster {
  x: number;
  ys: number[];
  ks: number[];
  scores: number[];
}

interface BeamSegment {
  y: number;
  startX: number;
  endX: number;
  /** 所属墨迹块是否足够宽（真横梁）；符头+加线形成的假横梁较窄 */
  wide: boolean;
  /** 所属墨迹块编号：同一根斜梁的多行属于同一 blob，数梁数时按 blob 去重 */
  blob: number;
}

interface BinaryImage {
  w: number;
  h: number;
  ink: Uint8Array;
  integral: Int32Array;
  runLength: Uint16Array;
}

function buildGrayAndBinary(source: OmrRequest): { gray: Uint8Array; w: number; h: number } {
  const scale = Math.min(1, 1700 / source.width, 2400 / source.height);
  const w = Math.max(1, Math.floor(source.width * scale));
  const h = Math.max(1, Math.floor(source.height * scale));
  const gray = new Uint8Array(w * h);
  for (let y = 0; y < h; y += 1) {
    const sy = Math.min(source.height - 1, Math.floor(y / scale));
    for (let x = 0; x < w; x += 1) {
      const sx = Math.min(source.width - 1, Math.floor(x / scale));
      const index = (sy * source.width + sx) * 4;
      const r = source.data[index];
      const g = source.data[index + 1];
      const b = source.data[index + 2];
      const a = source.data[index + 3] / 255;
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) * a + 255 * (1 - a);
      gray[y * w + x] = luminance;
    }
  }
  return { gray, w, h };
}

function otsuThreshold(gray: Uint8Array): number {
  const histogram = new Uint32Array(256);
  for (const value of gray) histogram[value] += 1;
  const total = gray.length;
  let sum = 0;
  for (let i = 0; i < 256; i += 1) sum += i * histogram[i];
  let sumBackground = 0;
  let weightBackground = 0;
  let maxVariance = 0;
  let threshold = 160;
  for (let t = 0; t < 256; t += 1) {
    weightBackground += histogram[t];
    if (weightBackground === 0) continue;
    const weightForeground = total - weightBackground;
    if (weightForeground === 0) break;
    sumBackground += t * histogram[t];
    const meanBackground = sumBackground / weightBackground;
    const meanForeground = (sum - sumBackground) / weightForeground;
    const variance = weightBackground * weightForeground * (meanBackground - meanForeground) ** 2;
    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = t;
    }
  }
  return threshold;
}

function makeBinary(gray: Uint8Array, w: number, h: number): BinaryImage {
  const threshold = otsuThreshold(gray);
  const ink = new Uint8Array(w * h);
  for (let i = 0; i < gray.length; i += 1) {
    ink[i] = gray[i] < threshold ? 1 : 0;
  }
  const integral = new Int32Array((w + 1) * (h + 1));
  const runLength = new Uint16Array(w * h);
  const stride = w + 1;
  for (let y = 0; y < h; y += 1) {
    let x = 0;
    while (x < w) {
      if (!ink[y * w + x]) {
        x += 1;
        continue;
      }
      const start = x;
      while (x < w && ink[y * w + x]) x += 1;
      const length = x - start;
      for (let index = start; index < x; index += 1) {
        runLength[y * w + index] = length;
      }
    }
    let cumulative = 0;
    for (let column = 0; column < w; column += 1) {
      cumulative += ink[y * w + column];
      integral[(y + 1) * stride + (column + 1)] = integral[y * stride + (column + 1)] + cumulative;
    }
  }
  return { w, h, ink, integral, runLength };
}

function rectSum(image: BinaryImage, x0: number, y0: number, x1: number, y1: number): number {
  const left = Math.max(0, Math.min(image.w, Math.round(x0)));
  const right = Math.max(0, Math.min(image.w, Math.round(x1)));
  const top = Math.max(0, Math.min(image.h, Math.round(y0)));
  const bottom = Math.max(0, Math.min(image.h, Math.round(y1)));
  if (right <= left || bottom <= top) return 0;
  const stride = image.w + 1;
  return (
    image.integral[bottom * stride + right] -
    image.integral[top * stride + right] -
    image.integral[bottom * stride + left] +
    image.integral[top * stride + left]
  );
}

function density(image: BinaryImage, x0: number, y0: number, x1: number, y1: number): number {
  const area = Math.max(1, Math.round(x1 - x0) * Math.round(y1 - y0));
  return rectSum(image, x0, y0, x1, y1) / area;
}

function findLineRuns(image: BinaryImage): LineRun[] {
  const { w, h, ink } = image;
  const rowCounts = new Int32Array(h);
  let maxCount = 0;
  for (let y = 0; y < h; y += 1) {
    let count = 0;
    const offset = y * w;
    for (let x = 0; x < w; x += 1) {
      if (ink[offset + x]) count += 1;
    }
    rowCounts[y] = count;
    if (count > maxCount) maxCount = count;
  }
  if (maxCount < w * 0.12) return [];
  const threshold = Math.max(12, maxCount * 0.45);
  const runs: LineRun[] = [];
  let start = -1;
  for (let y = 0; y <= h; y += 1) {
    const above = y < h && rowCounts[y] >= threshold;
    if (above && start < 0) start = y;
    if (!above && start >= 0) {
      runs.push({ top: start, bottom: y - 1, center: (start + y - 1) / 2 });
      start = -1;
    }
  }
  return runs;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function horizontalExtent(image: BinaryImage, centerY: number): { left: number; right: number } {
  const { w, h, ink } = image;
  const rowStart = Math.max(0, Math.round(centerY) - 2);
  const rowEnd = Math.min(h - 1, Math.round(centerY) + 2);
  const hasInk = new Uint8Array(w);
  for (let x = 0; x < w; x += 1) {
    for (let y = rowStart; y <= rowEnd; y += 1) {
      if (ink[y * w + x]) {
        hasInk[x] = 1;
        break;
      }
    }
  }
  let bestStart = 0;
  let bestEnd = w - 1;
  let bestLength = 0;
  let x = 0;
  while (x < w) {
    if (!hasInk[x]) {
      x += 1;
      continue;
    }
    const start = x;
    let lastInk = x;
    while (x < w && (hasInk[x] || x - lastInk <= 3)) {
      if (hasInk[x]) lastInk = x;
      x += 1;
    }
    const end = lastInk;
    if (end - start > bestLength) {
      bestLength = end - start;
      bestStart = start;
      bestEnd = end;
    }
  }
  return { left: bestStart, right: bestEnd };
}

function detectStaves(image: BinaryImage): RawStaff[] {
  const runs = findLineRuns(image);
  if (runs.length < 5) return [];
  const gaps: number[] = [];
  for (let i = 1; i < runs.length; i += 1) {
    const gap = runs[i].center - runs[i - 1].center;
    if (gap >= 2 && gap <= 120) gaps.push(gap);
  }
  const typicalGap = median(gaps);
  if (!typicalGap) return [];

  const staves: RawStaff[] = [];
  let i = 0;
  while (i + 4 < runs.length) {
    const group = runs.slice(i, i + 5);
    const groupGaps: number[] = [];
    for (let g = 1; g < group.length; g += 1) groupGaps.push(group[g].center - group[g - 1].center);
    const average = groupGaps.reduce((sum, value) => sum + value, 0) / groupGaps.length;
    const consistent = groupGaps.every((gap) => gap >= average * 0.62 && gap <= average * 1.5);
    if (consistent && average >= 2.5 && average <= 90) {
      const top = group[0].center;
      const bottom = group[4].center;
      const extent = horizontalExtent(image, top);
      if (extent.right - extent.left > average * 8) {
        staves.push({
          top,
          bottom,
          space: average,
          left: extent.left + 2,
          right: extent.right - 2,
          lineRuns: group,
          clef: 'treble',
          systemIndex: 0,
          staffInSystem: 0,
          systemSize: 1,
          index: staves.length,
        });
        i += 5;
        continue;
      }
    }
    i += 1;
  }

  staves.sort((a, b) => a.top - b.top);
  const filtered: RawStaff[] = [];
  for (const staff of staves) {
    const previous = filtered[filtered.length - 1];
    if (previous && Math.abs(staff.top - previous.top) < staff.space) continue;
    filtered.push(staff);
  }

  let systemIndex = 0;
  let currentStaffs: RawStaff[] = [];
  for (let index = 0; index < filtered.length; index += 1) {
    const staff = filtered[index];
    const previous = currentStaffs[currentStaffs.length - 1];
    if (previous && staff.top - previous.bottom > previous.space * 8) {
      finalizeSystem(currentStaffs, systemIndex);
      systemIndex += 1;
      currentStaffs = [];
    }
    currentStaffs.push(staff);
  }
  finalizeSystem(currentStaffs, systemIndex);
  return filtered;
}

function finalizeSystem(staffs: RawStaff[], systemIndex: number): void {
  for (let index = 0; index < staffs.length; index += 1) {
    const staff = staffs[index];
    staff.systemIndex = systemIndex;
    staff.staffInSystem = index;
    staff.systemSize = staffs.length;
    staff.clef = index === 0 ? 'treble' : 'bass';
  }
}

/** F 谱号特征：两颗孤立实心圆点竖直堆叠、间距约 1 个间距，中点恰好落在 F 线
 *  （从下往上第 4 条谱线，即 lineRuns[1]）上。
 *  用连通域判别：真圆点是独立小墨块（尺寸受限、近似方形），而 G 谱号的螺旋/卷曲
 *  与谱号主体连成一片或为细笔道，构不成这样的小圆块；竖笔道/调号 ♭ 被谱线行切断
 *  形成的碎片呈竖直链分布且中点不落 F 线，一并排除。 */
function hasBassClefDots(image: BinaryImage, staff: RawStaff, x0: number, x1: number): boolean {
  const { w, h, ink } = image;
  const { space } = staff;
  const regionTop = Math.max(0, Math.round(staff.top - space * 0.7));
  const regionBottom = Math.min(h - 1, Math.round(staff.bottom + space * 0.7));
  const regionW = x1 - x0 + 1;
  const regionH = regionBottom - regionTop + 1;
  if (regionW <= 2 || regionH <= 2) return false;

  // 清除谱线行，避免圆点与谱线粘连成同一个连通域
  const lineRows = new Set<number>();
  for (const line of staff.lineRuns) {
    for (let y = Math.round(line.top) - 1; y <= Math.round(line.bottom) + 1; y += 1) lineRows.add(y);
  }
  const work = new Uint8Array(regionW * regionH);
  for (let y = regionTop; y <= regionBottom; y += 1) {
    if (lineRows.has(y)) continue;
    const rowOffset = (y - regionTop) * regionW;
    for (let x = x0; x <= x1; x += 1) {
      if (ink[y * w + x]) work[rowOffset + (x - x0)] = 1;
    }
  }

  // F 线：从下往上第 4 条谱线（从上往下第 2 条）
  const fLine = staff.lineRuns[1].center;

  const dots: Array<{ x: number; y: number }> = [];
  const visited = new Uint8Array(regionW * regionH);
  for (let start = 0; start < work.length; start += 1) {
    if (!work[start] || visited[start]) continue;
    const queue: number[] = [start];
    visited[start] = 1;
    let area = 0;
    let minX = regionW;
    let maxX = -1;
    let minY = regionH;
    let maxY = -1;
    while (queue.length > 0) {
      const current = queue.pop()!;
      const cx = current % regionW;
      const cy = (current / regionW) | 0;
      area += 1;
      if (cx < minX) minX = cx;
      if (cx > maxX) maxX = cx;
      if (cy < minY) minY = cy;
      if (cy > maxY) maxY = cy;
      for (const n of [current - 1, current + 1, current - regionW, current + regionW]) {
        if (n < 0 || n >= work.length) continue;
        if (work[n] && !visited[n]) {
          visited[n] = 1;
          queue.push(n);
        }
      }
    }
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    // 圆点近似方形（横宽与竖高相当），排除竖笔道被谱线行切断后形成的细高碎片
    if (width < space * 0.28 || width > space * 0.75) continue;
    if (height < space * 0.28 || height > space * 0.75) continue;
    if (Math.abs(width - height) > space * 0.35) continue;
    if (area / (width * height) < 0.55) continue;
    if (area < Math.max(6, space * space * 0.05) || area > space * space * 0.35) continue;
    dots.push({ x: x0 + (minX + maxX) / 2, y: regionTop + (minY + maxY) / 2 });
  }

  for (let i = 0; i < dots.length; i += 1) {
    for (let j = i + 1; j < dots.length; j += 1) {
      const a = dots[i];
      const b = dots[j];
      if (Math.abs(a.x - b.x) > space * 0.7) continue;
      const dy = Math.abs(a.y - b.y);
      if (dy < space * 0.7 || dy > space * 1.5) continue;
      const midY = (a.y + b.y) / 2;
      // 中点必须落在 F 线（而非任意谱线）附近，避免调号 ♭/竖笔道碎片在其它线位形成假圆点对
      if (Math.abs(midY - fLine) > space * 0.45) continue;
      // 若任一成员上方或下方 ~1.7sp 内、横距 ~1.2sp 内还有第三个类圆点墨块，
      // 则是竖笔道被谱线行切断形成的竖直链，而非 F 谱号的两颗孤立圆点
      const isChain = dots.some(
        (c) =>
          c !== a &&
          c !== b &&
          (Math.abs(c.y - a.y) <= space * 1.7 || Math.abs(c.y - b.y) <= space * 1.7) &&
          Math.abs(c.x - a.x) <= space * 1.2 &&
          Math.abs(c.x - b.x) <= space * 1.2,
      );
      if (isChain) continue;
      return true;
    }
  }
  return false;
}

/** G 谱号顶端越过最上一条谱线约 1 个间距：检查谱号区左上角是否有一团粗墨迹（顶环）。
 *  只统计每行横向长度 ≥ 0.55sp 的粗墨迹，排除细竖线（小节线、连谱大括号）造成的误判。 */
function hasTrebleLoopAbove(image: BinaryImage, staff: RawStaff, x0: number): boolean {
  const { space } = staff;
  const bandTop = Math.max(0, Math.round(staff.top - space * 2.2));
  const bandBottom = Math.round(staff.top - space * 0.35);
  if (bandBottom <= bandTop) return false;
  const xEnd = Math.min(image.w - 1, Math.round(x0 + space * 4.0));
  let ink = 0;
  for (let y = bandTop; y <= bandBottom; y += 1) {
    let bestRun = 0;
    let current = 0;
    for (let x = x0; x <= xEnd; x += 1) {
      if (image.ink[y * image.w + x]) {
        current += 1;
        if (current > bestRun) bestRun = current;
      } else {
        current = 0;
      }
    }
    if (bestRun < space * 0.55) continue;
    for (let x = x0; x <= xEnd; x += 1) {
      if (image.ink[y * image.w + x]) ink += 1;
    }
  }
  return ink >= Math.max(20, Math.round(space * space * 0.2));
}

/** 从图像识别一行谱表的谱号（G/F）。无法确定时返回 null，由调用方保留按位置推断的默认值。 */
function detectStaffClef(image: BinaryImage, staff: RawStaff): Clef | null {
  const { space } = staff;
  const x0 = Math.max(0, Math.round(staff.left - space * 1.2));
  const limit = staff.systemIndex === 0 ? 7.5 : 5.5;
  const x1 = Math.min(image.w - 1, Math.round(staff.left + space * limit));
  if (x1 <= x0 + 2) return null;
  // F 谱号的圆点是强特征，优先判断；G 谱号无圆点、顶环越过上谱线
  if (hasBassClefDots(image, staff, x0, x1)) return 'bass';
  if (hasTrebleLoopAbove(image, staff, x0)) return 'treble';
  return null;
}

function detectBarlineColumns(image: BinaryImage, staff: RawStaff): number[] {
  const { w, ink } = image;
  const top = Math.max(0, Math.round(staff.top));
  const bottom = Math.min(image.h - 1, Math.round(staff.bottom));
  const height = bottom - top + 1;
  const columns: number[] = [];
  for (let x = Math.max(0, Math.round(staff.left)); x <= Math.min(w - 1, Math.round(staff.right)); x += 1) {
    let dark = 0;
    for (let y = top; y <= bottom; y += 1) {
      if (ink[y * w + x]) dark += 1;
    }
    if (dark / height >= 0.93) columns.push(x);
  }
  const groups: number[][] = [];
  for (const x of columns) {
    const current = groups[groups.length - 1];
    if (current && x - current[current.length - 1] <= staff.space * 1.1) current.push(x);
    else groups.push([x]);
  }
  return groups.map((group) => group.reduce((sum, value) => sum + value, 0) / group.length);
}

function detectBeams(image: BinaryImage, staff: RawStaff): BeamSegment[] {
  const { w, ink, h } = image;
  const top = Math.max(0, Math.round(staff.top - staff.space * 4));
  const bottom = Math.min(h - 1, Math.round(staff.bottom + staff.space * 4));
  const lineRowSet = new Set<number>();
  for (const line of staff.lineRuns) {
    for (let y = Math.round(line.top) - 1; y <= Math.round(line.bottom) + 1; y += 1) lineRowSet.add(y);
  }
  // 每行的横向墨迹段（保留短段：缓斜横梁每行只贡献一小段，靠 blob 合并还原）
  const minRun = Math.max(3, staff.space * 0.45);
  const rowRuns: Array<Array<{ startX: number; endX: number }>> = [];
  for (let y = top; y <= bottom; y += 1) {
    const runs: Array<{ startX: number; endX: number }> = [];
    if (!lineRowSet.has(y)) {
      let runStart = -1;
      for (let x = 0; x <= w; x += 1) {
        const dark = x < w && ink[y * w + x] === 1;
        if (dark && runStart < 0) runStart = x;
        if (!dark && runStart >= 0) {
          if (x - runStart >= minRun) runs.push({ startX: runStart, endX: x - 1 });
          runStart = -1;
        }
      }
    }
    rowRuns.push(runs);
  }
  // 把相邻行、x 有重叠的段合并为 blob：横梁是跨多行的粗条，加线只有 1-2 行，符头宽度不足 2 个间距
  interface Blob {
    rows: number;
    minX: number;
    maxX: number;
    inkArea: number;
    widths: number[];
    segments: Array<Pick<BeamSegment, 'y' | 'startX' | 'endX'>>;
  }
  const finished: Blob[] = [];
  let active: Blob[] = [];
  for (let r = 0; r < rowRuns.length; r += 1) {
    const runs = rowRuns[r];
    const continued = new Set<number>();
    const next: Blob[] = [];
    for (const run of runs) {
      const runWidth = run.endX - run.startX + 1;
      const owner = active.findIndex((blob) => {
        if (!(blob.minX <= run.endX + 1 && blob.maxX >= run.startX - 1)) return false;
        // 宽度悬殊的不合并：符干（窄竖条）不应并入横梁（宽横条），反之亦然，
        // 否则符干会把符头和横梁连成一个块，或横梁被符干拖垮填充率
        const sorted = [...blob.widths].sort((a, b) => a - b);
        const medianWidth = sorted[Math.floor(sorted.length / 2)] || runWidth;
        return runWidth >= Math.max(3, medianWidth * 0.3) && runWidth <= medianWidth * 3;
      });
      if (owner >= 0 && !continued.has(owner)) {
        const blob = active[owner];
        continued.add(owner);
        blob.rows += 1;
        blob.inkArea += runWidth;
        blob.widths.push(runWidth);
        blob.minX = Math.min(blob.minX, run.startX);
        blob.maxX = Math.max(blob.maxX, run.endX);
        blob.segments.push({ y: top + r, startX: run.startX, endX: run.endX });
        next.push(blob);
      } else {
        next.push({
          rows: 1,
          minX: run.startX,
          maxX: run.endX,
          inkArea: runWidth,
          widths: [runWidth],
          segments: [{ y: top + r, startX: run.startX, endX: run.endX }],
        });
      }
    }
    for (let index = 0; index < active.length; index += 1) {
      if (!continued.has(index)) finished.push(active[index]);
    }
    active = next;
  }
  finished.push(...active);

  const segments: BeamSegment[] = [];
  const minRows = Math.max(3, Math.round(staff.space * 0.2));
  for (let blobIndex = 0; blobIndex < finished.length; blobIndex += 1) {
    const blob = finished[blobIndex];
    const width = blob.maxX - blob.minX + 1;
    if (width < staff.space * 2.0) continue;
    if (blob.rows < minRows) continue;
    // 水平横梁包围盒填充率高；缓斜横梁呈对角线，填充率天然偏低
    const fill = blob.inkArea / (width * blob.rows);
    if (fill < 0.45 && !(fill >= 0.28 && blob.rows >= 5)) continue;
    const wide = width >= staff.space * 2.6;
    for (const segment of blob.segments) {
      segments.push({ y: segment.y, startX: segment.startX, endX: segment.endX, wide, blob: blobIndex });
    }
  }
  return segments;
}

/** 候选是否落在真横梁上：横梁的厚墨切片会被误判为实心符头，需要跳过；
 *  窄块（符头+加线假横梁）不跳过，否则会误杀其下的真实音符 */
function isNearBeam(segments: BeamSegment[], x: number, y: number, space: number): boolean {
  return segments.some(
    (segment) =>
      segment.wide &&
      Math.abs(segment.y - y) <= space * 0.45 &&
      x >= segment.startX - space * 0.5 &&
      x <= segment.endX + space * 0.5,
  );
}

function horizontalRunLength(image: BinaryImage, x: number, y: number): number {
  const row = Math.round(y);
  const column = Math.round(x);
  if (row < 0 || row >= image.h || column < 0 || column >= image.w) return 0;
  return image.runLength[row * image.w + column];
}

function verticalRunLength(image: BinaryImage, x: number, y: number): number {
  const { w, ink } = image;
  const column = Math.round(x);
  const startY = Math.round(y);
  if (column < 0 || column >= w || startY < 0 || startY >= image.h) return 0;
  let top = startY;
  let bottom = startY;
  while (top > 0 && ink[(top - 1) * w + column]) top -= 1;
  while (bottom < image.h - 1 && ink[(bottom + 1) * w + column]) bottom += 1;
  return ink[startY * w + column] ? bottom - top + 1 : 0;
}

/** 符头中心正下方拖着长竖笔（八分休止符特征）；二分音符符干在符头侧缘 ±0.5sp 外，中心带无墨迹 */
function hasTailBelowCenter(image: BinaryImage, x: number, y: number, space: number): boolean {
  for (const ox of [-0.35, -0.18, 0, 0.18, 0.35]) {
    if (verticalRunLength(image, x + ox * space, y + space * 1.8) > space * 0.7) return true;
  }
  return false;
}

function detectSystemBarlines(image: BinaryImage, staves: RawStaff[]): number[] {
  const left = Math.min(...staves.map((staff) => staff.left));
  const right = Math.max(...staves.map((staff) => staff.right));
  const top = Math.max(0, Math.round(Math.min(...staves.map((staff) => staff.top))));
  const bottom = Math.min(image.h - 1, Math.round(Math.max(...staves.map((staff) => staff.bottom))));
  const height = bottom - top + 1;
  if (height <= 0) return [];
  const columns: number[] = [];
  for (let x = Math.max(0, Math.round(left)); x <= Math.min(image.w - 1, Math.round(right)); x += 1) {
    let run = 0;
    let best = 0;
    for (let y = top; y <= bottom; y += 1) {
      if (image.ink[y * image.w + x]) {
        run += 1;
        if (run > best) best = run;
      } else {
        run = 0;
      }
    }
    if (best >= height * 0.92) columns.push(x);
  }
  const groups: number[][] = [];
  for (const x of columns) {
    const current = groups[groups.length - 1];
    if (current && x - current[current.length - 1] <= 2) current.push(x);
    else groups.push([x]);
  }
  return groups.map((group) => group.reduce((sum, value) => sum + value, 0) / group.length);
}

function systemMeasureBounds(
  image: BinaryImage,
  staves: RawStaff[],
  space: number,
): Array<{ start: number; end: number }> {
  const left = Math.min(...staves.map((staff) => staff.left));
  const right = Math.max(...staves.map((staff) => staff.right));
  let bars = detectSystemBarlines(image, staves);
  if (bars.length < 2) {
    const fallback: number[] = [];
    for (const staff of staves) fallback.push(...detectBarlineColumns(image, staff));
    bars = fallback.sort((a, b) => a - b);
  }
  const points = [left, ...bars.filter((x) => x > left + space * 2 && x < right - space * 2), right]
    .sort((a, b) => a - b)
    .filter((value, index, array) => index === 0 || value - array[index - 1] > 2);
  const bounds: Array<{ start: number; end: number }> = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    if (points[index + 1] - points[index] > space * 3) {
      bounds.push({ start: points[index], end: points[index + 1] });
    }
  }
  if (bounds.length === 0) bounds.push({ start: left, end: right });
  return bounds;
}

/** 把扫描网格的 y 吸附到局部墨迹重心，消除网格与符头中心最多 1/4 间距的错位；排除谱线行避免被拉偏 */
function snapNoteheadY(image: BinaryImage, staff: RawStaff, x: number, y: number, space: number): number {
  const top = Math.max(0, Math.round(y - space * 0.35));
  const bottom = Math.min(image.h - 1, Math.round(y + space * 0.35));
  const left = Math.max(0, Math.round(x - space * 0.4));
  const right = Math.min(image.w - 1, Math.round(x + space * 0.4));
  let weighted = 0;
  let count = 0;
  for (let row = top; row <= bottom; row += 1) {
    if (staff.lineRuns.some((line) => Math.abs(line.center - row) <= 1.2)) continue;
    for (let column = left; column <= right; column += 1) {
      if (image.ink[row * image.w + column]) {
        weighted += row;
        count += 1;
      }
    }
  }
  if (count < 4) return y;
  return weighted / count;
}

/** 把候选的 x 吸附到局部墨迹重心，让落在符头左右边缘的候选汇聚到同一中心，便于 NMS 去重 */
function snapNoteheadX(image: BinaryImage, staff: RawStaff, x: number, y: number, space: number): number {
  const top = Math.max(0, Math.round(y - space * 0.35));
  const bottom = Math.min(image.h - 1, Math.round(y + space * 0.35));
  const left = Math.max(0, Math.round(x - space * 0.7));
  const right = Math.min(image.w - 1, Math.round(x + space * 0.7));
  let weighted = 0;
  let count = 0;
  for (let row = top; row <= bottom; row += 1) {
    if (staff.lineRuns.some((line) => Math.abs(line.center - row) <= 1.2)) continue;
    for (let column = left; column <= right; column += 1) {
      if (image.ink[row * image.w + column]) {
        weighted += column;
        count += 1;
      }
    }
  }
  if (count < 4) return x;
  const snapped = weighted / count;
  // 钳制吸附位移：附点/弧线等不对称墨迹会把重心拉偏，导致符干检测错位
  const maxShift = space * 0.35;
  if (snapped > x + maxShift) return x + maxShift;
  if (snapped < x - maxShift) return x - maxShift;
  return snapped;
}

function findCandidates(image: BinaryImage, staff: RawStaff, beams: BeamSegment[]): Candidate[] {
  const { space } = staff;
  const rx = space * 0.58;
  const ry = space * 0.42;
  const extra = space * 0.24;
  const stepX = Math.max(1, Math.round(space * 0.25));
  const candidates: Candidate[] = [];
  const skipLeft = staff.systemIndex === 0 ? space * 6.5 : space * 3.5;
  for (let k = -6; k <= 14; k += 1) {
    const gridY = staff.bottom - (k * space) / 2;
    if (gridY < staff.top - space * 6 || gridY > staff.bottom + space * 6) continue;
    for (let x = Math.round(staff.left + skipLeft); x <= staff.right - space * 0.6; x += stepX) {
      if (isNearBeam(beams, x, gridY, space)) continue;
      const y = snapNoteheadY(image, staff, x, gridY, space);
      if (Math.abs(y - gridY) > space * 0.3) continue;
      // x 也吸附到符头中心：落在同一符头左右边缘的候选汇聚到同一点，便于 NMS 去重
      const sx = snapNoteheadX(image, staff, x, y, space);
      if (Math.abs(sx - x) > space * 0.6) continue;
      const inner = density(image, sx - rx, y - ry, sx + rx, y + ry);
      if (inner < 0.35) continue;
      const kind = classifyNotehead(image, sx, y, space);
      if (!kind) continue;
      const filled = kind === 'filled';
      // 空心候选若中心被一条长竖线穿过，多半是 ♭/♯ 变音记号而非符头
      if (!filled && verticalRunLength(image, sx, y) > space * 1.5) continue;
      // 空心候选中心正下方拖着长竖笔的是八分休止符
      if (!filled && hasTailBelowCenter(image, sx, y, space)) continue;
      if (filled && inner < 0.6) continue;
      const extent = localVerticalExtent(image, sx, y, space * 0.7, space * 0.8);
      if (extent < space * 0.65 || extent > space * 1.6) continue;
      const maxRun = maxRunLengthNearExcludingLines(image, staff, sx, y, space * 0.75, space * 0.6);
      if (maxRun < space * 1.0 || maxRun > space * 2.8) continue;
      const outer = density(image, sx - rx - extra, y - ry - extra, sx + rx + extra, y + ry + extra);
      const innerArea = 4 * rx * ry;
      const outerArea = 4 * (rx + extra) * (ry + extra);
      const ring = Math.max(0, (outer * outerArea - inner * innerArea) / (outerArea - innerArea));
      const score = inner - ring * 0.2;
      if (score < 0.3) continue;
      candidates.push({ x: sx, y, k: Math.round(((staff.bottom - y) * 2) / space), score, inner });
    }
  }
  return candidates;
}

function suppressCandidates(candidates: Candidate[], space: number): Candidate[] {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const accepted: Candidate[] = [];
  for (const candidate of sorted) {
    const duplicate = accepted.some(
      (other) => Math.abs(other.x - candidate.x) <= space * 1.1 && Math.abs(other.y - candidate.y) <= space * 0.62,
    );
    if (!duplicate) accepted.push(candidate);
  }
  return accepted.sort((a, b) => a.x - b.x);
}

function clusterCandidates(candidates: Candidate[], space: number): Cluster[] {
  const clusters: Cluster[] = [];
  for (const candidate of candidates) {
    const last = clusters[clusters.length - 1];
    if (last && candidate.x - last.x <= space * 0.72) {
      last.ys.push(candidate.y);
      last.ks.push(candidate.k);
      last.scores.push(candidate.score);
      last.x = (last.x * (last.ks.length - 1) + candidate.x) / last.ks.length;
    } else {
      clusters.push({ x: candidate.x, ys: [candidate.y], ks: [candidate.k], scores: [candidate.score] });
    }
  }
  return clusters;
}

/**
 * 判别符头类型。加线穿过符头中心时，中心行墨迹宽度接近加线长度（>1.45sp），
 * 此时实心/空心不能靠中心密度区分（加线把空心也填实了），改看中心行上下 0.25sp 处是否断开。
 */
function classifyNotehead(image: BinaryImage, x: number, y: number, space: number): 'filled' | 'hollow' | null {
  const centerRun = horizontalRunLength(image, x, y);
  if (centerRun > space * 1.45) {
    const upRun = horizontalRunLength(image, x, y - space * 0.25);
    const downRun = horizontalRunLength(image, x, y + space * 0.25);
    if (upRun < space * 0.55 || downRun < space * 0.55) {
      return rimProbesPass(image, x, y, space) ? 'hollow' : null;
    }
    return 'filled';
  }
  // 实心：中心多个小探针都为实心墨迹
  const probes = [0, -0.2, 0.2];
  let minimum = 1;
  for (const offset of probes) {
    const centerY = y + offset * space;
    const value = density(
      image,
      x - space * 0.17,
      centerY - space * 0.09,
      x + space * 0.17,
      centerY + space * 0.09,
    );
    minimum = Math.min(minimum, value);
  }
  if (minimum > 0.55) return 'filled';
  // 空心：中心密度低 + 边缘探针大多数落在符头轮廓上
  const center = density(
    image,
    x - space * 0.18,
    y - space * 0.18,
    x + space * 0.18,
    y + space * 0.18,
  );
  if (center > 0.62) return null;
  return rimProbesPass(image, x, y, space) ? 'hollow' : null;
}

/** 空心符头的边缘探针：8 个方向至少 5 个有墨迹 */
function rimProbesPass(image: BinaryImage, x: number, y: number, space: number): boolean {
  const rx = space * 0.62 * 0.85;
  const ry = space * 0.43;
  const offsets: Array<[number, number]> = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [0.7, 0.7],
    [-0.7, 0.7],
    [0.7, -0.7],
    [-0.7, -0.7],
  ];
  let dark = 0;
  for (const [dx, dy] of offsets) {
    const pointX = x + dx * rx;
    const pointY = y + dy * ry;
    if (density(image, pointX - 1.6, pointY - 1.6, pointX + 1.6, pointY + 1.6) > 0.35) dark += 1;
  }
  return dark >= 5;
}

function hasStem(image: BinaryImage, x: number, ys: number[], space: number): boolean {
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  const strips = [
    [x + space * 0.32, top - space * 3.2, x + space * 1.15, top - space * 0.4],
    [x - space * 1.15, top - space * 3.2, x - space * 0.32, top - space * 0.4],
    [x + space * 0.32, bottom + space * 0.4, x + space * 1.15, bottom + space * 3.2],
    [x - space * 1.15, bottom + space * 0.4, x - space * 0.32, bottom + space * 3.2],
  ];
  return strips.some(([x0, y0, x1, y1]) => density(image, x0, y0, x1, y1) > 0.26);
}

/** 检测未连梁音符的符尾（符干顶端的弯钩），有符尾的实心音符是八分音符 */
function hasFlag(image: BinaryImage, x: number, ys: number[], space: number): boolean {
  const top = Math.min(...ys);
  const bottom = Math.max(...ys);
  // 符干向上（符干在符头右侧）：符尾从顶端向下弯向右侧
  const upTip = top - space * 3.0;
  const upBox = density(image, x + space * 0.45, upTip, x + space * 1.65, upTip + space * 1.1);
  if (upBox > 0.15) return true;
  // 符干向下（符干在符头左侧）：符尾从底端向上弯向右侧
  const downTip = bottom + space * 3.0;
  const downBox = density(image, x - space * 0.6, downTip - space * 1.1, x + space * 0.6, downTip);
  if (downBox > 0.15) return true;
  return false;
}

function countBeamLines(beams: BeamSegment[], x: number, ys: number[], space: number): number {
  const topTip = Math.min(...ys) - space * 3.2;
  const bottomTip = Math.max(...ys) + space * 3.2;
  const blobIds = new Set<number>();
  for (const segment of beams) {
    // x 容差放宽到 1.1sp：符干在符头侧缘（约 0.55sp），横梁端点常与符头中心对不齐
    if (x < segment.startX - space * 1.1 || x > segment.endX + space * 1.1) continue;
    const nearTip =
      Math.abs(segment.y - topTip) <= space * 1.7 || Math.abs(segment.y - bottomTip) <= space * 1.7;
    if (!nearTip) continue;
    // 按 blob 去重：同一根斜梁跨多行，但只是一根梁
    blobIds.add(segment.blob);
  }
  return blobIds.size;
}

function maxRunLengthNearExcludingLines(
  image: BinaryImage,
  staff: RawStaff,
  x: number,
  y: number,
  windowX: number,
  windowY: number,
): number {
  const { w, runLength } = image;
  let best = 0;
  const top = Math.max(0, Math.round(y - windowY));
  const bottom = Math.min(image.h - 1, Math.round(y + windowY));
  for (let row = top; row <= bottom; row += 1) {
    if (staff.lineRuns.some((line) => Math.abs(line.center - row) <= 1.2)) continue;
    for (let column = Math.max(0, Math.round(x - windowX)); column <= Math.min(w - 1, Math.round(x + windowX)); column += 1) {
      const length = runLength[row * w + column];
      if (length > best) best = length;
    }
  }
  return best;
}

function localVerticalExtent(
  image: BinaryImage,
  x: number,
  y: number,
  windowX: number,
  windowY: number,
): number {
  const { w, ink } = image;
  const top = Math.max(0, Math.round(y - windowY));
  const bottom = Math.min(image.h - 1, Math.round(y + windowY));
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (let row = top; row <= bottom; row += 1) {
    for (let column = Math.round(x - windowX); column <= Math.round(x + windowX); column += 1) {
      if (column < 0 || column >= w) continue;
      if (ink[row * w + column]) {
        if (row < minY) minY = row;
        if (row > maxY) maxY = row;
        break;
      }
    }
  }
  if (maxY < minY) return 0;
  return maxY - minY + 1;
}

/**
 * 判断某列墨迹是否像高瘦折线形的休止符：返回强度（计入的行数），不像则返回 0。
 * 直接分析图像而非候选簇几何，避免 y 吸附后簇塌缩导致休止符漏判；
 * 也只对单音簇调用（和弦簇有两个以上不同 k，不会进入此判定）。
 */
function tallRestScore(image: BinaryImage, staff: RawStaff, column: number, space: number, beams: BeamSegment[]): number {
  const x = Math.round(column);
  if (x < 0 || x >= image.w) return 0;
  let rows = 0;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  const widths: number[] = [];
  for (let y = Math.round(staff.top - space); y <= Math.round(staff.bottom + space); y += 1) {
    if (staff.lineRuns.some((line) => Math.abs(line.center - y) <= 1.2)) continue;
    if (!image.ink[y * image.w + x]) continue;
    // 落在横梁上的行不计入：横梁碎片会把符头+符干的跨度撑大到酷似休止符
    if (beams.some((seg) => Math.abs(seg.y - y) <= 1 && x >= seg.startX - 2 && x <= seg.endX + 2)) continue;
    const run = horizontalRunLength(image, x, y);
    if (run < space * 0.28 || run > space * 1.35) continue;
    rows += 1;
    widths.push(run);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const span = maxY - minY;
  widths.sort((a, b) => a - b);
  const medianWidth = widths.length ? widths[Math.floor(widths.length / 2)] : 0;
  if (!(rows >= 7 && span >= space * 1.5 && span <= space * 3.6 && medianWidth >= space * 0.55)) return 0;
  // 笔直竖线（符干）不是休止符：对整列原始墨迹（含谱线行）求最长连续段，
  // 符干会几乎贯穿整个跨度，休止符是折线、在固定列上只有几小段
  let longest = 0;
  let current = 0;
  const columnTop = Math.round(staff.top - space);
  const columnBottom = Math.round(staff.bottom + space);
  for (let y = columnTop; y <= columnBottom; y += 1) {
    if (image.ink[y * image.w + x]) {
      current += 1;
      if (current > longest) longest = current;
    } else {
      current = 0;
    }
  }
  if (longest >= span * 0.6) return 0;
  return rows;
}

function detectNoteDot(image: BinaryImage, staff: RawStaff, x: number, y: number, space: number): boolean {
  const dxOffsets = [0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.1];
  const dyOffsets = [0, -0.5, 0.5, -1, 1, -1.4, 1.4];
  for (const dx of dxOffsets) {
    for (const dy of dyOffsets) {
      const dotX = x + dx * space;
      const dotY = y + dy * space;
      if (dx < 0.9 && Math.abs(dy) < 0.65) continue;
      const nearStaffLine = staff.lineRuns.some((line) => Math.abs(line.center - dotY) <= 1.8);
      if (nearStaffLine) continue;
      const box = density(image, dotX - 2.2, dotY - 2.2, dotX + 2.2, dotY + 2.2);
      if (box < 0.32) continue;
      const vertical = verticalRunLength(image, dotX, dotY);
      const horizontal = horizontalRunLength(image, dotX, dotY);
      if (vertical > space * 0.5 || horizontal > space * 0.6) continue;
      // 附点是孤立小圆点：墨迹量少且竖向不延伸；符尾和相邻符头边缘在此更庞大、会竖向连成一片
      if (localVerticalExtent(image, dotX, dotY, 2.5, space * 0.5) > space * 0.65) continue;
      // 附点直径约 0.5sp、接近实心，5×5 窗口墨迹约 25；过大则是符头/符尾边缘
      if (rectSum(image, dotX - 2.2, dotY - 2.2, dotX + 2.2, dotY + 2.2) > 30) continue;
      return true;
    }
  }
  return false;
}

function measureIndexForX(bounds: Array<{ start: number; end: number }>, x: number): number {
  for (let index = 0; index < bounds.length; index += 1) {
    if (x >= bounds[index].start - 2 && x < bounds[index].end + 2) return index;
  }
  if (x < bounds[0].start) return 0;
  return bounds.length - 1;
}

function detectTallRests(
  image: BinaryImage,
  staff: RawStaff,
  space: number,
  noteXs: number[],
  noteMarks: Array<{ x: number; y: number; stem: boolean }>,
  beams: BeamSegment[],
): number[] {
  const skipLeft = staff.systemIndex === 0 ? space * 6.5 : space * 3.5;
  const start = Math.round(staff.left + skipLeft);
  const end = Math.round(staff.right - space * 0.5);
  const step = Math.max(2, Math.round(space * 0.4));
  const found: Array<{ x: number; rows: number }> = [];

  for (let x = start; x <= end; x += step) {
    const nearStemmedNote = noteMarks.some((note) => note.stem && Math.abs(note.x - x) < space * 2);
    if (nearStemmedNote) continue;
    const looksLikeAccidental = noteXs.some(
      (noteX) => noteX - x > space * 0.8 && noteX - x < space * 1.9,
    );
    if (looksLikeAccidental) continue;
    const rows = tallRestScore(image, staff, x, space, beams);
    if (rows === 0) continue;
    found.push({ x, rows });
  }

  found.sort((a, b) => b.rows - a.rows);
  const kept: number[] = [];
  for (const item of found) {
    if (kept.some((x) => Math.abs(x - item.x) < space * 1.2)) continue;
    kept.push(item.x);
  }
  return kept.sort((a, b) => a - b);
}

interface PartBuilder {
  name: string;
  /** 各谱表位置在所有系统中被识别为 G/F 谱号的次数（多数票决定最终谱号） */
  clefTreble: number[];
  clefBass: number[];
  staffMeasures: Measure[][];
}

export function recognize(source: OmrRequest): OmrResponse {
  if (source.width < 20 || source.height < 20) {
    return { ok: false, error: '页面图像太小，无法识别' };
  }
  const { gray, w, h } = buildGrayAndBinary(source);
  const image = makeBinary(gray, w, h);
  const staves = detectStaves(image);
  if (staves.length === 0) {
    return { ok: false, error: '未检测到五线谱，请确认 PDF 页面为清晰的印刷乐谱' };
  }

  // 逐行识别谱号（G/F）：有把握则覆盖按位置推断的默认值，避免把实际为 G 谱号的行按 F 谱号换算音高
  for (const staff of staves) {
    const detected = detectStaffClef(image, staff);
    if (detected) staff.clef = detected;
  }

  const systemGroups: RawStaff[][] = [];
  for (const staff of staves) {
    if (!systemGroups[staff.systemIndex]) systemGroups[staff.systemIndex] = [];
    systemGroups[staff.systemIndex].push(staff);
  }

  const builders = new Map<number, PartBuilder>();
  const debugStaves: OmrDebugStaff[] = [];
  const debugNotes: OmrDebugNote[] = [];
  const debugRests: OmrDebugRest[] = [];
  const debugBarlines: Array<{ systemIndex: number; x: number }> = [];
  const debugBeams: Array<{ staffIndex: number; y: number; startX: number; endX: number }> = [];
  const debugRawCandidates: Array<{ staffIndex: number; x: number; y: number; k: number; score: number }> = [];
  let totalNotes = 0;
  let totalMeasures = 0;

  for (const rawSystem of systemGroups) {
    if (!rawSystem || rawSystem.length === 0) continue;
    const system = [...rawSystem].sort((a, b) => a.top - b.top);
    const space = system[0].space;
    const bounds = systemMeasureBounds(image, system, space);
    const staffCount = system.length;

    let builder = builders.get(staffCount);
    if (!builder) {
      builder = {
        name: staffCount === 2 ? '钢琴' : staffCount === 1 ? '旋律' : '多谱表',
        clefTreble: system.map(() => 0),
        clefBass: system.map(() => 0),
        staffMeasures: Array.from({ length: staffCount }, () => []),
      };
      builders.set(staffCount, builder);
    }
    const currentBuilder = builder;

    // 统计每个系统各行识别出的谱号，供最终多数票决定
    system.forEach((staff, staffIndex) => {
      if (staff.clef === 'treble') currentBuilder.clefTreble[staffIndex] += 1;
      else currentBuilder.clefBass[staffIndex] += 1;
    });

    if (source.debug) {
      for (const staff of system) {
        debugStaves.push({
          index: staff.index,
          top: staff.top,
          bottom: staff.bottom,
          left: staff.left,
          right: staff.right,
          space: staff.space,
          clef: staff.clef,
          systemIndex: staff.systemIndex,
        });
      }
      for (const bound of bounds) {
        debugBarlines.push({ systemIndex: system[0].systemIndex, x: bound.start });
      }
    }

    system.forEach((staff, staffIndex) => {
      const beams = detectBeams(image, staff);
      if (source.debug) {
        for (const beam of beams) {
          debugBeams.push({ staffIndex: staff.index, y: beam.y, startX: beam.startX, endX: beam.endX });
        }
      }
      const found = findCandidates(image, staff, beams);
      if (source.debug) {
        for (const c of found) {
          debugRawCandidates.push({ staffIndex: staff.index, x: c.x, y: c.y, k: c.k, score: c.score });
        }
      }
      const candidates = suppressCandidates(found, staff.space);
      const clusters = clusterCandidates(candidates, staff.space);
      const perMeasure: Array<
        Array<{ x: number; y: number; k: number; filled: boolean; stem: boolean; beamed: boolean; note: Note }>
      > = bounds.map(() => []);
      const noteXs: number[] = [];
      const noteMarks: Array<{ x: number; y: number; stem: boolean }> = [];

      for (const cluster of clusters) {
        const measureIndex = measureIndexForX(bounds, cluster.x);
        const filled = classifyNotehead(image, cluster.x, cluster.ys[0], staff.space) === 'filled';
        const stem = hasStem(image, cluster.x, cluster.ys, staff.space);
        const beamLines = countBeamLines(beams, cluster.x, cluster.ys, staff.space);
        const beamed = beamLines > 0;
        // 休止符直接按图像形状判定（只对单音簇：多 k 簇是和弦，不可能是休止符）；
        // tallRestScore 内部已用整列最长连续墨迹排除符干
        const distinctKs = new Set(cluster.ks);
        const isRestShape =
          distinctKs.size === 1 &&
          Math.max(
            tallRestScore(image, staff, cluster.x - 1, staff.space, beams),
            tallRestScore(image, staff, cluster.x, staff.space, beams),
            tallRestScore(image, staff, cluster.x + 1, staff.space, beams),
          ) > 0;
        const midY = (Math.min(...cluster.ys) + Math.max(...cluster.ys)) / 2;

        if (isRestShape) {
          perMeasure[measureIndex].push({
            x: cluster.x,
            y: midY,
            k: 0,
            filled: false,
            stem: false,
            beamed: false,
            note: { id: newId('note'), pitches: [], type: 4, dot: false, rest: true },
          });
          continue;
        }

        // 实心符头既无符干也未连梁、且中心正下方拖着长竖笔：是八分休止符被当成符头，丢弃
        // （真四分音符必有符干；连梁音符的符干可能被梁遮漏检，故豁免 beamed）
        if (
          filled &&
          !stem &&
          !beamed &&
          hasTailBelowCenter(image, cluster.x, cluster.ys[0], staff.space)
        ) {
          continue;
        }

        const pitches = cluster.ks
          .map((k) => pitchFromIndex(clefBaseIndex(staff.clef) + k))
          .sort((a, b) => a.octave * 7 + 'CDEFGAB'.indexOf(a.step) - (b.octave * 7 + 'CDEFGAB'.indexOf(b.step)));
        // 未连梁的带符干实心音符若带符尾，也是八分音符
        const flag = filled && stem && !beamed && hasFlag(image, cluster.x, cluster.ys, staff.space);
        const type: 1 | 2 | 4 | 8 | 16 = filled
          ? beamLines >= 2
            ? 16
            : beamLines === 1 || flag
              ? 8
              : 4
          : stem
            ? 2
            : 1;
        const dot =
          type === 1 ? false : detectNoteDot(image, staff, cluster.x, cluster.ys[0], staff.space);
        perMeasure[measureIndex].push({
          x: cluster.x,
          y: cluster.ys[0],
          k: cluster.ks[0],
          filled,
          stem,
          beamed,
          note: { id: newId('note'), pitches, type, dot, rest: false },
        });
        noteXs.push(cluster.x);
        noteMarks.push({ x: cluster.x, y: cluster.ys[0], stem });
        totalNotes += 1;
      }

      const restXs = detectTallRests(image, staff, staff.space, noteXs, noteMarks, beams);
      for (const restX of restXs) {
        const measureIndex = measureIndexForX(bounds, restX);
        perMeasure[measureIndex].push({
          x: restX,
          y: staff.top + staff.space * 2,
          k: 0,
          filled: false,
          stem: false,
          beamed: false,
          note: { id: newId('note'), pitches: [], type: 4, dot: false, rest: true },
        });
      }

      perMeasure.forEach((items) => {
        items.sort((a, b) => a.x - b.x);
        const restXs: number[] = [];
        for (const item of items) {
          if (!item.note.rest) continue;
          if (restXs.some((restX) => Math.abs(restX - item.x) < staff.space * 1.2)) continue;
          restXs.push(item.x);
        }
        const notes: Note[] = [];
        for (const item of items) {
          if (item.note.rest) {
            if (restXs.includes(item.x)) notes.push(item.note);
            continue;
          }
          if (restXs.some((restX) => Math.abs(restX - item.x) < staff.space * 0.9)) continue;
          notes.push(item.note);
        }
        if (source.debug) {
          for (const item of notes) {
            const origin = items.find((entry) => entry.note.id === item.id);
            if (!origin) continue;
            if (item.rest) {
              debugRests.push({ x: origin.x, y: origin.y, staffIndex: staff.index, type: item.type });
            } else {
              debugNotes.push({
                x: origin.x,
                y: origin.y,
                k: origin.k,
                staffIndex: staff.index,
                type: item.type,
                dot: item.dot,
                filled: origin.filled,
                stem: origin.stem,
                beamed: origin.beamed,
              });
            }
          }
        }
        currentBuilder.staffMeasures[staffIndex].push({ id: newId('measure'), notes });
      });
    });

    totalMeasures += bounds.length;
  }

  const parts: Part[] = [];
  for (const [staffCount, builder] of builders) {
    parts.push({
      id: newId('part'),
      name: builder.name,
      staves: Array.from({ length: staffCount }, (_, index) => ({
        id: newId('staff'),
        clef:
          builder.clefTreble[index] > builder.clefBass[index]
            ? 'treble'
            : builder.clefBass[index] > builder.clefTreble[index]
              ? 'bass'
              : index === 0
                ? 'treble'
                : 'bass',
        measures: builder.staffMeasures[index],
      })),
    });
  }

  if (totalNotes === 0) {
    return { ok: false, error: '已找到谱线，但未识别到音符，请尝试更清晰的页面' };
  }

  const finalNotes = parts.reduce(
    (sum, part) =>
      sum +
      part.staves.reduce(
        (staffSum, staff) =>
          staffSum +
          staff.measures.reduce(
            (measureSum, measure) => measureSum + measure.notes.filter((note) => !note.rest).length,
            0,
          ),
        0,
      ),
    0,
  );

  return {
    ok: true,
    stats: { staves: staves.length, measures: totalMeasures, notes: finalNotes, width: w, height: h },
    debug: source.debug ? { staves: debugStaves, notes: debugNotes, rests: debugRests, barlines: debugBarlines, beams: debugBeams, rawCandidates: debugRawCandidates } : undefined,
    score: {
      title: '识别结果',
      composer: '',
      tempo: 96,
      keyFifths: 0,
      time: { beats: 4, beatType: 4 },
      parts,
    },
  };
}

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<OmrRequest>) => {
  try {
    const result = recognize(event.data);
    workerScope.postMessage(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : '识别过程出现未知错误';
    workerScope.postMessage({ ok: false, error: message } satisfies OmrResponse);
  }
};
