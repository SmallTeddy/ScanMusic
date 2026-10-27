import {
  newId,
  partMeasureCount,
  type Clef,
  type DurationType,
  type Measure,
  type Note,
  type Part,
  type Pitch,
  type Score,
  type Staff,
  type Step,
  type TimeSignature,
} from '../../types/score';

const DIVISIONS = 8;

const TYPE_TO_XML: Record<DurationType, string> = {
  1: 'whole',
  2: 'half',
  4: 'quarter',
  8: 'eighth',
  16: '16th',
};

const XML_TO_TYPE: Record<string, DurationType> = {
  whole: 1,
  half: 2,
  quarter: 4,
  eighth: 8,
  '16th': 16,
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function durationTicks(type: DurationType, dot: boolean): number {
  return Math.round((32 / type) * (dot ? 1.5 : 1));
}

function measureTicks(time: TimeSignature): number {
  return Math.max(1, Math.round(DIVISIONS * 4 * (time.beats / time.beatType)));
}

function clefXml(clef: Clef, number: number, staves: number): string[] {
  const sign = clef === 'treble' ? 'G' : 'F';
  const line = clef === 'treble' ? 2 : 4;
  const attrs = staves > 1 ? ` number="${number}"` : '';
  return [`      <clef${attrs}>`, `        <sign>${sign}</sign>`, `        <line>${line}</line>`, '      </clef>'];
}

function noteToXml(note: Note, isChord: boolean, staffNumber: number, staves: number): string {
  const body: string[] = [];
  if (isChord) body.push('      <chord/>');
  if (note.rest || note.pitches.length === 0) {
    body.push('      <rest/>');
  } else {
    const pitch = note.pitches[0];
    body.push(
      '      <pitch>',
      `        <step>${pitch.step}</step>`,
      ...(pitch.alter !== 0 ? [`        <alter>${pitch.alter}</alter>`] : []),
      `        <octave>${pitch.octave}</octave>`,
      '      </pitch>',
    );
  }
  body.push(`      <duration>${durationTicks(note.type, note.dot)}</duration>`);
  if (staves > 1) body.push(`      <voice>${staffNumber}</voice>`);
  body.push(`      <type>${TYPE_TO_XML[note.type]}</type>`);
  if (note.dot) body.push('      <dot/>');
  if (staves > 1) body.push(`      <staff>${staffNumber}</staff>`);
  return ['    <note>', ...body, '    </note>'].join('\n');
}

function emptyMeasureNoteXml(duration: number, staffNumber: number, staves: number): string {
  return [
    '    <note>',
    '      <rest/>',
    `      <duration>${duration}</duration>`,
    ...(staves > 1 ? [`      <voice>${staffNumber}</voice>`] : []),
    '      <type>whole</type>',
    ...(staves > 1 ? [`      <staff>${staffNumber}</staff>`] : []),
    '    </note>',
  ].join('\n');
}

export function scoreToMusicXml(score: Score): string {
  const time = score.time ?? { beats: 4, beatType: 4 };
  const ticks = measureTicks(time);
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">',
  );
  lines.push('<score-partwise version="4.0">');
  lines.push('  <work>');
  lines.push(`    <work-title>${escapeXml(score.title || '未命名乐谱')}</work-title>`);
  lines.push('  </work>');
  lines.push('  <identification>');
  lines.push(`    <creator type="composer">${escapeXml(score.composer || '')}</creator>`);
  lines.push('  </identification>');
  lines.push('  <part-list>');
  score.parts.forEach((part, index) => {
    lines.push(`    <score-part id="P${index + 1}">`);
    lines.push(`      <part-name>${escapeXml(part.name || `声部 ${index + 1}`)}</part-name>`);
    lines.push('    </score-part>');
  });
  lines.push('  </part-list>');

  score.parts.forEach((part, partIndex) => {
    const staves = Math.max(1, part.staves.length);
    const measureCount = partMeasureCount(part);
    lines.push(`  <part id="P${partIndex + 1}">`);
    for (let measureIndex = 0; measureIndex < measureCount; measureIndex += 1) {
      lines.push(`    <measure number="${measureIndex + 1}">`);
      if (measureIndex === 0) {
        lines.push('      <attributes>');
        lines.push(`        <divisions>${DIVISIONS}</divisions>`);
        lines.push('        <key>');
        lines.push(`          <fifths>${score.keyFifths}</fifths>`);
        lines.push('        </key>');
        lines.push('        <time>');
        lines.push(`          <beats>${time.beats}</beats>`);
        lines.push(`          <beat-type>${time.beatType}</beat-type>`);
        lines.push('        </time>');
        if (staves > 1) lines.push(`        <staves>${staves}</staves>`);
        part.staves.forEach((staff, staffIndex) => {
          lines.push(...clefXml(staff.clef, staffIndex + 1, staves));
        });
        lines.push('      </attributes>');
        if (partIndex === 0) {
          lines.push('      <direction placement="above">');
          lines.push('        <direction-type>');
          lines.push('          <metronome>');
          lines.push('            <beat-unit>quarter</beat-unit>');
          lines.push(`            <per-minute>${score.tempo || 96}</per-minute>`);
          lines.push('          </metronome>');
          lines.push('        </direction-type>');
          lines.push(`        <sound tempo="${score.tempo || 96}"/>`);
          lines.push('      </direction>');
        }
      }

      part.staves.forEach((staff, staffIndex) => {
        if (staffIndex > 0) {
          lines.push('      <backup>');
          lines.push(`        <duration>${ticks}</duration>`);
          lines.push('      </backup>');
        }
        const staffNumber = staffIndex + 1;
        const measure = staff.measures[measureIndex];
        if (!measure || measure.notes.length === 0) {
          lines.push(emptyMeasureNoteXml(ticks, staffNumber, staves));
          return;
        }
        measure.notes.forEach((note) => {
          if (note.pitches.length <= 1) {
            lines.push(noteToXml(note, false, staffNumber, staves));
            return;
          }
          note.pitches.forEach((pitch, pitchIndex) => {
            lines.push(noteToXml({ ...note, pitches: [pitch] }, pitchIndex > 0, staffNumber, staves));
          });
        });
      });
      lines.push('    </measure>');
    }
    lines.push('  </part>');
  });

  lines.push('</score-partwise>');
  return lines.join('\n');
}

function childrenOf(element: Element, tag: string): Element[] {
  return Array.from(element.children).filter((child) => child.tagName === tag);
}

function textOf(element: Element | null | undefined, tag: string): string | null {
  if (!element) return null;
  const found = element.getElementsByTagName(tag)[0];
  return found ? (found.textContent ?? '').trim() : null;
}

function parsePitch(element: Element): Pitch | null {
  const step = textOf(element, 'step') as Step | null;
  const octaveText = textOf(element, 'octave');
  if (!step || !octaveText) return null;
  const alterText = textOf(element, 'alter');
  const alterValue = alterText ? Number(alterText) : 0;
  let alter: -1 | 0 | 1 = 0;
  if (alterValue > 0) alter = 1;
  else if (alterValue < 0) alter = -1;
  return { step, octave: Number(octaveText), alter };
}

function inferType(duration: number, divisions: number, explicit: string | null): DurationType {
  if (explicit && XML_TO_TYPE[explicit]) return XML_TO_TYPE[explicit];
  if (divisions > 0) {
    const quarterLength = duration / divisions;
    const candidates: Array<[DurationType, number]> = [
      [1, 4],
      [2, 2],
      [4, 1],
      [8, 0.5],
      [16, 0.25],
    ];
    let best: DurationType = 4;
    let bestDiff = Number.POSITIVE_INFINITY;
    for (const [type, value] of candidates) {
      const diff = Math.abs(value - quarterLength);
      if (diff < bestDiff) {
        best = type;
        bestDiff = diff;
      }
    }
    return best;
  }
  return 4;
}

interface ParsedPart {
  part: Part;
  tempo?: number;
}

function parsePart(partElement: Element, fallbackName: string): ParsedPart {
  let divisions = 1;
  let tempo: number | undefined;

  const measureElements = childrenOf(partElement, 'measure');
  const firstAttributes = measureElements[0] ? childrenOf(measureElements[0], 'attributes')[0] : undefined;
  let staffCount = 1;
  const stavesText = textOf(firstAttributes, 'staves');
  if (stavesText) staffCount = Math.max(1, Number(stavesText) || 1);

  const clefMap = new Map<number, Clef>();
  if (firstAttributes) {
    for (const clefElement of childrenOf(firstAttributes, 'clef')) {
      const number = Number(clefElement.getAttribute('number') || '1') || 1;
      const sign = textOf(clefElement, 'sign');
      clefMap.set(number, sign === 'F' ? 'bass' : 'treble');
      staffCount = Math.max(staffCount, number);
    }
  }

  const staffMeasures: Measure[][] = Array.from({ length: staffCount }, () => []);

  for (const measureElement of measureElements) {
    const perStaff: Measure[] = Array.from({ length: staffCount }, () => ({ id: newId('measure'), notes: [] }));
    for (const child of Array.from(measureElement.children)) {
      if (child.tagName === 'attributes') {
        const divisionsText = textOf(child, 'divisions');
        if (divisionsText) divisions = Math.max(1, Number(divisionsText) || 1);
        for (const clefElement of childrenOf(child, 'clef')) {
          const number = Number(clefElement.getAttribute('number') || '1') || 1;
          const sign = textOf(clefElement, 'sign');
          if (number <= staffCount) clefMap.set(number, sign === 'F' ? 'bass' : 'treble');
        }
        continue;
      }
      if (child.tagName === 'sound') {
        const tempoAttr = child.getAttribute('tempo');
        if (tempoAttr && tempo === undefined) tempo = Number(tempoAttr) || undefined;
        continue;
      }
      if (child.tagName === 'direction') {
        const perMinute = textOf(child, 'per-minute');
        if (perMinute && tempo === undefined) tempo = Number(perMinute) || undefined;
        continue;
      }
      if (child.tagName !== 'note') continue;
      if (childrenOf(child, 'grace').length > 0) continue;

      const staffText = textOf(child, 'staff');
      const staffIndex = Math.max(0, Math.min(staffCount - 1, Number(staffText || '1') - 1));
      const target = perStaff[staffIndex];
      const isChord = childrenOf(child, 'chord').length > 0;
      const rest = childrenOf(child, 'rest').length > 0;
      const pitchElement = childrenOf(child, 'pitch')[0];
      const pitch = pitchElement ? parsePitch(pitchElement) : null;
      if (!rest && !pitch) continue;
      const durationText = textOf(child, 'duration');
      const duration = durationText ? Number(durationText) : 0;
      const typeText = textOf(child, 'type');
      const type = inferType(duration, divisions, typeText);
      const dot = childrenOf(child, 'dot').length > 0;

      if (isChord && target.notes.length > 0 && pitch) {
        target.notes[target.notes.length - 1].pitches.push(pitch);
        continue;
      }

      target.notes.push({
        id: newId('note'),
        pitches: pitch ? [pitch] : [],
        type,
        dot,
        rest: rest || !pitch,
      });
    }
    perStaff.forEach((measure, index) => staffMeasures[index].push(measure));
  }

  const staves: Staff[] = Array.from({ length: staffCount }, (_, index) => ({
    id: newId('staff'),
    clef: clefMap.get(index + 1) ?? (index === 0 ? 'treble' : 'bass'),
    measures: staffMeasures[index],
  }));

  if (staves.every((staff) => staff.measures.length === 0)) {
    staves.forEach((staff) => staff.measures.push({ id: newId('measure'), notes: [] }));
  }

  return {
    part: {
      id: newId('part'),
      name: fallbackName,
      staves,
    },
    tempo,
  };
}

export function musicXmlToScore(xml: string): Score {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');
  const errorNode = doc.getElementsByTagName('parsererror')[0];
  if (errorNode) throw new Error('MusicXML 解析失败，请确认文件格式');
  const root = doc.documentElement;
  if (root.tagName !== 'score-partwise') {
    throw new Error('目前仅支持 score-partwise 格式的 MusicXML（不支持 .mxl 压缩包）');
  }

  const title = textOf(root.getElementsByTagName('work')[0], 'work-title') ?? '未命名乐谱';
  const composer = textOf(root.getElementsByTagName('identification')[0], 'creator') ?? '';
  const partNames = new Map<string, string>();
  for (const scorePart of Array.from(doc.getElementsByTagName('score-part'))) {
    const id = scorePart.getAttribute('id');
    if (id) partNames.set(id, textOf(scorePart, 'part-name') ?? '声部');
  }

  const time: TimeSignature = { beats: 4, beatType: 4 };
  let tempo = 96;
  let keyFifths = 0;
  const parts: Part[] = [];

  const partElements = Array.from(root.children).filter((child) => child.tagName === 'part');
  let first = true;
  for (const partElement of partElements) {
    const id = partElement.getAttribute('id') ?? '';
    const parsed = parsePart(partElement, partNames.get(id) ?? '声部');
    if (first) {
      const firstMeasure = childrenOf(partElement, 'measure')[0];
      const firstAttributes = firstMeasure ? childrenOf(firstMeasure, 'attributes')[0] : undefined;
      const fifthsText = textOf(firstAttributes, 'fifths');
      if (fifthsText) keyFifths = Number(fifthsText) || 0;
      const beatsText = textOf(firstAttributes, 'beats');
      const beatTypeText = textOf(firstAttributes, 'beat-type');
      if (beatsText && beatTypeText) {
        time.beats = Number(beatsText) || 4;
        time.beatType = Number(beatTypeText) || 4;
      }
      if (parsed.tempo) tempo = parsed.tempo;
      first = false;
    }
    parts.push(parsed.part);
  }

  if (parts.length === 0) throw new Error('未在文件中找到乐谱内容');

  return {
    title: title || '未命名乐谱',
    composer,
    tempo,
    keyFifths,
    time,
    parts,
  };
}
