import {
  clefBaseIndex,
  diatonicIndex,
  keySignatureSteps,
  partMeasureCount,
  type Measure,
  type Note,
  type Part,
  type Score,
  type Staff,
} from '../../types/score';

export type Primitive =
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: string; width: number }
  | {
      type: 'rect';
      x: number;
      y: number;
      w: number;
      h: number;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      radius?: number;
    }
  | {
      type: 'ellipse';
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      fill: string;
      stroke?: string;
      strokeWidth?: number;
      rotate?: number;
    }
  | { type: 'circle'; cx: number; cy: number; r: number; fill: string }
  | {
      type: 'text';
      x: number;
      y: number;
      text: string;
      size: number;
      family: 'music' | 'text';
      anchor: 'start' | 'middle' | 'end';
      baseline: 'alphabetic' | 'middle';
      fill: string;
      weight?: 'normal' | 'bold';
    };

export interface HitBox {
  partId: string;
  staffId: string;
  measureId: string;
  noteId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PartLayout {
  primitives: Primitive[];
  hitboxes: HitBox[];
  width: number;
  height: number;
}

const SPACE = 9;
const STAFF_HEIGHT = SPACE * 4;
const STAFF_GAP = SPACE * 6.5;
const PAGE_PADDING = 10;
const SYSTEM_TOP_PADDING = 30;
const SYSTEM_BOTTOM_PADDING = 40;
const INK = '#26231f';
const STAFF_COLOR = '#4b453d';
const PAPER = '#fffdf8';
const ACCENT = '#0f766e';

const MUSIC = {
  trebleClef: '\uE050',
  bassClef: '\uE062',
  wholeRest: '\uE4E3',
  halfRest: '\uE4E4',
  quarterRest: '\uE4E5',
  eighthRest: '\uE4E6',
  sixteenthRest: '\uE4E7',
  flagUp: '\uE240',
  flagDown: '\uE241',
  flag16Up: '\uE242',
  flag16Down: '\uE243',
} as const;

function line(x1: number, y1: number, x2: number, y2: number, width = 1.1, stroke = STAFF_COLOR): Primitive {
  return { type: 'line', x1, y1, x2, y2, stroke, width };
}

function musicText(
  x: number,
  y: number,
  text: string,
  size: number,
  anchor: 'start' | 'middle' | 'end' = 'middle',
  baseline: 'alphabetic' | 'middle' = 'middle',
  fill = INK,
): Primitive {
  return { type: 'text', x, y, text, size, family: 'music', anchor, baseline, fill };
}

function labelText(
  x: number,
  y: number,
  text: string,
  size: number,
  anchor: 'start' | 'middle' | 'end' = 'middle',
  fill = INK,
  weight: 'normal' | 'bold' = 'normal',
): Primitive {
  return { type: 'text', x, y, text, size, family: 'text', anchor, baseline: 'middle', fill, weight };
}

function accidentalGlyph(alter: number): string {
  if (alter > 0) return '♯';
  if (alter < 0) return '♭';
  return '♮';
}

function keyLead(keyCount: number): number {
  return 56 + keyCount * 8;
}

function beatWeight(note: Note): number {
  return Math.max(0.25, (4 / note.type) * (note.dot ? 1.5 : 1));
}

function drawRest(primitives: Primitive[], x: number, staffTop: number, note: Note) {
  const glyph =
    note.type === 1
      ? MUSIC.wholeRest
      : note.type === 2
        ? MUSIC.halfRest
        : note.type === 4
          ? MUSIC.quarterRest
          : note.type === 8
            ? MUSIC.eighthRest
            : MUSIC.sixteenthRest;
  const y = note.type === 1 ? staffTop + SPACE * 1.5 : staffTop + SPACE * 2;
  primitives.push(musicText(x, y, glyph, SPACE * 4));
}

function drawNote(
  primitives: Primitive[],
  hitboxes: HitBox[],
  ids: { partId: string; staffId: string; measureId: string },
  note: Note,
  x: number,
  staffTop: number,
  clefBase: number,
  selected: boolean,
) {
  const staffBottom = staffTop + STAFF_HEIGHT;
  if (note.rest || note.pitches.length === 0) {
    drawRest(primitives, x, staffTop, note);
    hitboxes.push({
      ...ids,
      noteId: note.id,
      x: x - SPACE * 1.4,
      y: staffTop + SPACE * 0.5,
      w: SPACE * 2.8,
      h: SPACE * 3.4,
    });
    return;
  }

  const ks = note.pitches.map((pitch) => diatonicIndex(pitch) - clefBase);
  const ys = ks.map((k) => staffBottom - (k * SPACE) / 2);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const maxK = Math.max(...ks);
  const minK = Math.min(...ks);

  const hitbox: HitBox = {
    ...ids,
    noteId: note.id,
    x: x - SPACE * 1.35,
    y: minY - SPACE * 1.2,
    w: SPACE * 2.7,
    h: maxY - minY + SPACE * 2.4,
  };
  hitboxes.push(hitbox);
  if (selected) {
    primitives.push({
      type: 'rect',
      x: hitbox.x,
      y: hitbox.y,
      w: hitbox.w,
      h: hitbox.h,
      fill: 'rgba(15, 118, 110, 0.12)',
      stroke: ACCENT,
      strokeWidth: 1.5,
      radius: 8,
    });
  }

  for (let k = -2; k >= minK; k -= 2) {
    const y = staffBottom - (k * SPACE) / 2;
    primitives.push(line(x - SPACE * 0.95, y, x + SPACE * 0.95, y, 1.1, INK));
  }
  for (let k = 10; k <= maxK; k += 2) {
    const y = staffBottom - (k * SPACE) / 2;
    primitives.push(line(x - SPACE * 0.95, y, x + SPACE * 0.95, y, 1.1, INK));
  }

  const hollow = note.type === 1 || note.type === 2;
  ys.forEach((y) => {
    primitives.push({
      type: 'ellipse',
      cx: x,
      cy: y,
      rx: SPACE * 0.62,
      ry: SPACE * 0.43,
      fill: hollow ? PAPER : INK,
      stroke: hollow ? INK : undefined,
      strokeWidth: hollow ? 2.2 : undefined,
      rotate: -20,
    });
  });

  let accidentalOffset = 0;
  note.pitches.forEach((pitch, pitchIndex) => {
    if (pitch.alter !== 0) {
      primitives.push(
        labelText(
          x - SPACE * (1.2 + accidentalOffset),
          ys[pitchIndex] ?? minY,
          accidentalGlyph(pitch.alter),
          SPACE * 2.1,
          'middle',
          INK,
        ),
      );
      accidentalOffset += 0.75;
    }
  });

  const stemDown = maxK > 4;
  const stemX = x + (stemDown ? -SPACE * 0.6 : SPACE * 0.6);
  const stemTip = stemDown ? maxY + SPACE * 3.2 : minY - SPACE * 3.2;
  primitives.push(line(stemX, stemDown ? minY : maxY, stemX, stemTip, 1.4, INK));

  if (note.type >= 8) {
    const flagGlyph = stemDown
      ? note.type >= 16
        ? MUSIC.flag16Down
        : MUSIC.flagDown
      : note.type >= 16
        ? MUSIC.flag16Up
        : MUSIC.flagUp;
    primitives.push(
      musicText(stemX, stemTip, flagGlyph, SPACE * 4, stemDown ? 'end' : 'start', 'middle', INK),
    );
    if (note.type >= 16) {
      primitives.push(
        musicText(
          stemX,
          stemTip + (stemDown ? -SPACE * 0.75 : SPACE * 0.75),
          stemDown ? MUSIC.flagDown : MUSIC.flagUp,
          SPACE * 4,
          stemDown ? 'end' : 'start',
          'middle',
          INK,
        ),
      );
    }
  }

  if (note.dot) {
    const dotK = ks[0];
    const dotY = staffBottom - (dotK * SPACE) / 2 + (dotK % 2 === 0 ? -SPACE * 0.5 : 0);
    primitives.push({ type: 'circle', cx: x + SPACE * 1.15, cy: dotY, r: SPACE * 0.18, fill: INK });
  }
}

function measureAt(staff: Staff | undefined, index: number): Measure | null {
  if (!staff) return null;
  return staff.measures[index] ?? null;
}

export function layoutPart(score: Score, part: Part, width: number, selectedNoteId: string | null): PartLayout {
  const primitives: Primitive[] = [];
  const hitboxes: HitBox[] = [];
  const innerWidth = Math.max(240, width - PAGE_PADDING * 2);
  const staves = part.staves.length ? part.staves : [{ id: `${part.id}-staff`, clef: 'treble' as const, measures: [] }];
  const measureCount = Math.max(1, partMeasureCount(part));

  const keyStepsByStaff = staves.map((staff) => keySignatureSteps(score.keyFifths, staff.clef));
  const lead = Math.max(...keyStepsByStaff.map((steps) => keyLead(steps.length)));

  const baseWidths = Array.from({ length: measureCount }, (_, measureIndex) => {
    let maxBeats = 0;
    let maxNotes = 0;
    for (const staff of staves) {
      const measure = measureAt(staff, measureIndex);
      if (!measure) continue;
      maxBeats = Math.max(maxBeats, measure.notes.reduce((sum, note) => sum + beatWeight(note), 0));
      maxNotes = Math.max(maxNotes, measure.notes.length);
    }
    const units = Math.max(maxBeats, maxNotes * 0.72, 2);
    return 24 + Math.min(10, units) * 21;
  });

  const systems: Array<{ indices: number[]; widths: number[] }> = [];
  let current: number[] = [];
  let currentWidth = 0;
  baseWidths.forEach((baseWidth, index) => {
    const systemLead = current.length === 0 ? lead : 10;
    if (current.length > 0 && currentWidth + baseWidth + systemLead > innerWidth) {
      systems.push({ indices: current, widths: [] });
      current = [];
      currentWidth = 0;
    }
    current.push(index);
    currentWidth += baseWidth + (current.length === 1 ? lead : 0);
  });
  if (current.length > 0) systems.push({ indices: current, widths: [] });

  for (const system of systems) {
    const total = system.indices.reduce(
      (sum, index, position) => sum + baseWidths[index] + (position === 0 ? lead : 0),
      0,
    );
    const scale = innerWidth / total;
    system.widths = system.indices.map(
      (index, position) => (baseWidths[index] + (position === 0 ? lead : 0)) * scale,
    );
  }

  const staffCount = staves.length;
  const staffBlockHeight = STAFF_HEIGHT + STAFF_GAP;
  const systemHeight = SYSTEM_TOP_PADDING + staffCount * STAFF_HEIGHT + (staffCount - 1) * STAFF_GAP + SYSTEM_BOTTOM_PADDING;

  let y = PAGE_PADDING;
  systems.forEach((system) => {
    const firstTop = y + SYSTEM_TOP_PADDING;
    const lastBottom = firstTop + (staffCount - 1) * staffBlockHeight + STAFF_HEIGHT;
    const staffTops = Array.from({ length: staffCount }, (_, index) => firstTop + index * staffBlockHeight);

    staffTops.forEach((staffTop) => {
      primitives.push(line(PAGE_PADDING, staffTop, PAGE_PADDING + innerWidth, staffTop, 1.0));
      for (let lineIndex = 1; lineIndex <= 4; lineIndex += 1) {
        const lineY = staffTop + lineIndex * SPACE;
        primitives.push(line(PAGE_PADDING, lineY, PAGE_PADDING + innerWidth, lineY, 1.0));
      }
    });

    // 左侧连谱线
    primitives.push(line(PAGE_PADDING, firstTop, PAGE_PADDING, lastBottom, 2.2, INK));

    let cursor = PAGE_PADDING;
    system.indices.forEach((measureIndex, position) => {
      const measureWidth = system.widths[position];
      const xStart = cursor;
      const xEnd = cursor + measureWidth;
      cursor = xEnd;

      primitives.push(line(xEnd, firstTop, xEnd, lastBottom, 1.4, INK));

      if (position === 0) {
        staves.forEach((staff, staffIndex) => {
          const staffTop = staffTops[staffIndex];
          const staffBottom = staffTop + STAFF_HEIGHT;
          const clefGlyph = staff.clef === 'treble' ? MUSIC.trebleClef : MUSIC.bassClef;
          const clefY = staff.clef === 'treble' ? staffTop + SPACE * 3 : staffTop + SPACE;
          primitives.push(musicText(xStart + 6, clefY, clefGlyph, SPACE * 4, 'start', 'alphabetic'));
          const keySteps = keyStepsByStaff[staffIndex];
          keySteps.forEach((step, keyIndex) => {
            const keyY = staffBottom - (step.stepIndex * SPACE) / 2;
            primitives.push(
              labelText(xStart + 28 + keyIndex * 8, keyY, step.glyph, SPACE * 1.8, 'middle', INK, 'bold'),
            );
          });
          const timeX = xStart + 34 + keySteps.length * 8 + 8;
          primitives.push(
            labelText(timeX, staffTop + SPACE * 1.35, String(score.time.beats), SPACE * 1.95, 'middle', INK, 'bold'),
          );
          primitives.push(
            labelText(timeX, staffTop + SPACE * 3.15, String(score.time.beatType), SPACE * 1.95, 'middle', INK, 'bold'),
          );
        });
      }

      const contentEnd = xEnd - 10;
      const contentStart = Math.min(xStart + (position === 0 ? lead : 10), contentEnd - 24);
      const contentWidth = Math.max(8, contentEnd - contentStart);

      staves.forEach((staff, staffIndex) => {
        const staffTop = staffTops[staffIndex];
        const measure = measureAt(staff, measureIndex);
        const notes = measure?.notes ?? [];
        if (notes.length === 0) {
          const x = contentStart + contentWidth / 2;
          primitives.push(musicText(x, staffTop + SPACE * 1.5, MUSIC.wholeRest, SPACE * 4));
          return;
        }
        const weights = notes.map(beatWeight);
        const totalWeight = weights.reduce((sum, value) => sum + value, 0);
        let consumed = 0;
        notes.forEach((note, noteIndex) => {
          const weight = weights[noteIndex];
          const x = contentStart + (contentWidth * (consumed + weight / 2)) / totalWeight;
          consumed += weight;
          drawNote(
            primitives,
            hitboxes,
            { partId: part.id, staffId: staff.id, measureId: measure?.id ?? '' },
            note,
            x,
            staffTop,
            clefBaseIndex(staff.clef),
            note.id === selectedNoteId,
          );
        });
      });
    });

    y += systemHeight;
  });

  const height = Math.max(systemHeight, y + PAGE_PADDING);
  return { primitives, hitboxes, width: Math.max(240, width), height };
}
