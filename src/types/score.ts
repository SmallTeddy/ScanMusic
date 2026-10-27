export type Step = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Clef = 'treble' | 'bass';
/** 1 = 全音符, 2 = 二分, 4 = 四分, 8 = 八分, 16 = 十六分 */
export type DurationType = 1 | 2 | 4 | 8 | 16;

export interface Pitch {
  step: Step;
  octave: number;
  alter: -1 | 0 | 1;
}

export interface Note {
  id: string;
  pitches: Pitch[];
  type: DurationType;
  dot: boolean;
  rest: boolean;
}

export interface Measure {
  id: string;
  notes: Note[];
}

export interface Staff {
  id: string;
  clef: Clef;
  measures: Measure[];
}

export interface Part {
  id: string;
  name: string;
  staves: Staff[];
}

export interface TimeSignature {
  beats: number;
  beatType: number;
}

export interface Score {
  title: string;
  composer: string;
  tempo: number;
  keyFifths: number;
  time: TimeSignature;
  parts: Part[];
}

export const DURATION_LABELS: Record<DurationType, string> = {
  1: '全',
  2: '二分',
  4: '四分',
  8: '八分',
  16: '十六分',
};

export const STEP_NAMES: Step[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

let idCounter = 0;
export function newId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
}

export function cloneScore(score: Score): Score {
  return JSON.parse(JSON.stringify(score)) as Score;
}

export function diatonicIndex(pitch: Pitch): number {
  return pitch.octave * 7 + STEP_NAMES.indexOf(pitch.step);
}

export function pitchFromIndex(index: number, alter: -1 | 0 | 1 = 0): Pitch {
  const octave = Math.floor(index / 7);
  const step = STEP_NAMES[((index % 7) + 7) % 7];
  return { step, octave, alter };
}

/** 音级上下移动（忽略升降号），可跨越八度 */
export function shiftPitch(pitch: Pitch, steps: number): Pitch {
  return pitchFromIndex(diatonicIndex(pitch) + steps, pitch.alter);
}

/** 低音谱号 / 高音谱号最下面一条线对应的全音阶序号 */
export function clefBaseIndex(clef: Clef): number {
  // 高音谱号底线是 E4 = 30，低音谱号底线是 G2 = 18
  return clef === 'treble' ? 4 * 7 + 2 : 2 * 7 + 4;
}

const ALTER_NAMES: Record<number, string> = { [-1]: '♭', 0: '', 1: '♯' };

export function pitchName(pitch: Pitch): string {
  return `${pitch.step}${ALTER_NAMES[pitch.alter] ?? ''}${pitch.octave}`;
}

export function noteName(note: Note): string {
  if (note.rest) return '休止符';
  if (note.pitches.length === 0) return '空';
  return note.pitches.map(pitchName).join(' / ');
}

export function keySignatureSteps(fifths: number, clef: Clef): Array<{ stepIndex: number; glyph: string }> {
  const sharpOrder: Array<{ letter: Step; trebleK: number; bassK: number }> = [
    { letter: 'F', trebleK: 8, bassK: 6 },
    { letter: 'C', trebleK: 7, bassK: 5 },
    { letter: 'G', trebleK: 9, bassK: 7 },
    { letter: 'D', trebleK: 6, bassK: 4 },
    { letter: 'A', trebleK: 5, bassK: 3 },
    { letter: 'E', trebleK: 10, bassK: 8 },
    { letter: 'B', trebleK: 4, bassK: 2 },
  ];
  const flatOrder: Array<{ letter: Step; trebleK: number; bassK: number }> = [
    { letter: 'B', trebleK: 4, bassK: 2 },
    { letter: 'E', trebleK: 10, bassK: 8 },
    { letter: 'A', trebleK: 5, bassK: 3 },
    { letter: 'D', trebleK: 6, bassK: 4 },
    { letter: 'G', trebleK: 3, bassK: 1 },
    { letter: 'C', trebleK: 7, bassK: 5 },
    { letter: 'F', trebleK: 2, bassK: 0 },
  ];
  if (fifths > 0) {
    return sharpOrder.slice(0, Math.min(7, fifths)).map((entry) => ({
      stepIndex: clef === 'treble' ? entry.trebleK : entry.bassK,
      glyph: '♯',
    }));
  }
  if (fifths < 0) {
    return flatOrder.slice(0, Math.min(7, -fifths)).map((entry) => ({
      stepIndex: clef === 'treble' ? entry.trebleK : entry.bassK,
      glyph: '♭',
    }));
  }
  return [];
}

export function keyName(fifths: number): string {
  const major = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'C♯'];
  const flat = ['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭'];
  if (fifths >= 0) return `${major[Math.min(7, fifths)]} 大调`;
  return `${flat[Math.min(7, -fifths)]} 大调`;
}

export function partMeasureCount(part: Part): number {
  return part.staves.reduce((max, staff) => Math.max(max, staff.measures.length), 0);
}

export function findStaff(score: Score, staffId: string): Staff | null {
  for (const part of score.parts) {
    const staff = part.staves.find((item) => item.id === staffId);
    if (staff) return staff;
  }
  return null;
}
