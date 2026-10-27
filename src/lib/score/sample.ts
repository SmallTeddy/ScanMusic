import { newId, type DurationType, type Measure, type Note, type Pitch, type Score, type Staff } from '../../types/score';

function note(pitch: [string, number] | null, type: DurationType, dot = false): Note {
  const pitches: Pitch[] = pitch
    ? [{ step: pitch[0] as Pitch['step'], octave: pitch[1], alter: 0 }]
    : [];
  return {
    id: newId('note'),
    pitches,
    type,
    dot,
    rest: pitch === null,
  };
}

function buildMeasures(
  rows: Array<Array<{ p: [string, number] | null; t: DurationType; dot?: boolean }>>,
): Measure[] {
  return rows.map((measure) => ({
    id: newId('measure'),
    notes: measure.map((item) => note(item.p, item.t, item.dot)),
  }));
}

function makeStaff(clef: 'treble' | 'bass', rows: Array<Array<{ p: [string, number] | null; t: DurationType; dot?: boolean }>>): Staff {
  return { id: newId('staff'), clef, measures: buildMeasures(rows) };
}

export function createSampleScore(): Score {
  const melody = makeStaff('treble', [
    [
      { p: ['C', 4], t: 4 },
      { p: ['C', 4], t: 4 },
      { p: ['G', 4], t: 4 },
      { p: ['G', 4], t: 4 },
    ],
    [
      { p: ['A', 4], t: 4 },
      { p: ['A', 4], t: 4 },
      { p: ['G', 4], t: 2 },
    ],
    [
      { p: ['F', 4], t: 4 },
      { p: ['F', 4], t: 4 },
      { p: ['E', 4], t: 4 },
      { p: ['E', 4], t: 4 },
    ],
    [
      { p: ['D', 4], t: 4 },
      { p: ['D', 4], t: 4 },
      { p: ['C', 4], t: 2 },
    ],
  ]);

  const bass = makeStaff('bass', [
    [
      { p: ['C', 3], t: 2 },
      { p: ['G', 3], t: 2 },
    ],
    [
      { p: ['C', 3], t: 2 },
      { p: ['G', 3], t: 2 },
    ],
    [
      { p: ['F', 3], t: 2 },
      { p: ['C', 3], t: 2 },
    ],
    [
      { p: ['G', 3], t: 2 },
      { p: ['C', 3], t: 2 },
    ],
  ]);

  return {
    title: '小星星',
    composer: '钢琴示例',
    tempo: 96,
    keyFifths: 0,
    time: { beats: 4, beatType: 4 },
    parts: [
      {
        id: newId('part'),
        name: '钢琴',
        staves: [melody, bass],
      },
    ],
  };
}

export function createEmptyScore(): Score {
  return {
    title: '未命名乐谱',
    composer: '',
    tempo: 96,
    keyFifths: 0,
    time: { beats: 4, beatType: 4 },
    parts: [
      {
        id: newId('part'),
        name: '钢琴',
        staves: [
          {
            id: newId('staff'),
            clef: 'treble',
            measures: [
              {
                id: newId('measure'),
                notes: [
                  {
                    id: newId('note'),
                    pitches: [{ step: 'C', octave: 4, alter: 0 }],
                    type: 4,
                    dot: false,
                    rest: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}
