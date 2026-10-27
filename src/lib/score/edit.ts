import {
  cloneScore,
  diatonicIndex,
  newId,
  shiftPitch,
  type DurationType,
  type Note,
  type Pitch,
  type Score,
  type Staff,
} from '../../types/score';

const FALLBACK_PITCH: Pitch = { step: 'C', octave: 4, alter: 0 };

export function updateNote(score: Score, noteId: string, updater: (note: Note) => Note): Score {
  const next = cloneScore(score);
  for (const part of next.parts) {
    for (const staff of part.staves) {
      for (const measure of staff.measures) {
        const index = measure.notes.findIndex((n) => n.id === noteId);
        if (index >= 0) {
          measure.notes[index] = updater(measure.notes[index]);
          return next;
        }
      }
    }
  }
  return score;
}

export function transposeNote(score: Score, noteId: string, steps: number): Score {
  return updateNote(score, noteId, (note) => ({
    ...note,
    rest: false,
    pitches: (note.pitches.length ? note.pitches : [FALLBACK_PITCH]).map((p) => shiftPitch(p, steps)),
  }));
}

export function setNoteAlter(score: Score, noteId: string, alter: -1 | 0 | 1): Score {
  return updateNote(score, noteId, (note) => ({
    ...note,
    rest: false,
    pitches: (note.pitches.length ? note.pitches : [FALLBACK_PITCH]).map((p) => ({ ...p, alter })),
  }));
}

export function setNoteOctave(score: Score, noteId: string, delta: number): Score {
  return updateNote(score, noteId, (note) => ({
    ...note,
    rest: false,
    pitches: (note.pitches.length ? note.pitches : [FALLBACK_PITCH]).map((p) => ({
      ...p,
      octave: Math.max(0, Math.min(9, p.octave + delta)),
    })),
  }));
}

export function setNoteDuration(score: Score, noteId: string, type: DurationType): Score {
  return updateNote(score, noteId, (note) => ({ ...note, type }));
}

export function toggleNoteDot(score: Score, noteId: string): Score {
  return updateNote(score, noteId, (note) => ({ ...note, dot: !note.dot }));
}

export function addChordTone(score: Score, noteId: string): Score {
  return updateNote(score, noteId, (note) => {
    const base = [...note.pitches].sort((a, b) => diatonicIndex(b) - diatonicIndex(a))[0] ?? FALLBACK_PITCH;
    return { ...note, rest: false, pitches: [...note.pitches, shiftPitch(base, 2)] };
  });
}

export function removeChordTone(score: Score, noteId: string): Score {
  return updateNote(score, noteId, (note) =>
    note.pitches.length > 1 ? { ...note, pitches: note.pitches.slice(0, -1) } : note,
  );
}

export function deleteNote(score: Score, noteId: string): Score {
  const next = cloneScore(score);
  for (const part of next.parts) {
    for (const staff of part.staves) {
      for (const measure of staff.measures) {
        const index = measure.notes.findIndex((n) => n.id === noteId);
        if (index >= 0) {
          measure.notes.splice(index, 1);
          return next;
        }
      }
    }
  }
  return score;
}

interface NoteLocation {
  partIndex: number;
  staffIndex: number;
  measureIndex: number;
  noteIndex: number;
}

function locate(score: Score, noteId: string): NoteLocation | null {
  for (let p = 0; p < score.parts.length; p += 1) {
    for (let s = 0; s < score.parts[p].staves.length; s += 1) {
      const measures = score.parts[p].staves[s].measures;
      for (let m = 0; m < measures.length; m += 1) {
        const n = measures[m].notes.findIndex((note) => note.id === noteId);
        if (n >= 0) return { partIndex: p, staffIndex: s, measureIndex: m, noteIndex: n };
      }
    }
  }
  return null;
}

export function duplicateNoteAfter(score: Score, noteId: string): { score: Score; newNoteId: string | null } {
  const where = locate(score, noteId);
  if (!where) return { score, newNoteId: null };
  const next = cloneScore(score);
  const measure = next.parts[where.partIndex].staves[where.staffIndex].measures[where.measureIndex];
  const source = measure.notes[where.noteIndex];
  const copy: Note = { ...(JSON.parse(JSON.stringify(source)) as Note), id: newId('note') };
  measure.notes.splice(where.noteIndex + 1, 0, copy);
  return { score: next, newNoteId: copy.id };
}

export function appendNote(score: Score, staffId: string): { score: Score; newNoteId: string | null } {
  const next = cloneScore(score);
  const staff = findStaffInScore(next, staffId);
  if (!staff) return { score, newNoteId: null };
  if (staff.measures.length === 0) {
    staff.measures.push({ id: newId('measure'), notes: [] });
  }
  const measure = staff.measures[staff.measures.length - 1];
  const last = measure.notes[measure.notes.length - 1];
  const note: Note = {
    id: newId('note'),
    pitches: last ? last.pitches.map((p) => ({ ...p })) : [{ step: 'C', octave: 4, alter: 0 }],
    type: last?.type ?? 4,
    dot: false,
    rest: false,
  };
  measure.notes.push(note);
  return { score: next, newNoteId: note.id };
}

export function addMeasure(score: Score, partId: string): { score: Score; measureId: string | null } {
  const next = cloneScore(score);
  const part = next.parts.find((p) => p.id === partId);
  if (!part) return { score, measureId: null };
  let firstMeasureId: string | null = null;
  for (const staff of part.staves) {
    const measure = { id: newId('measure'), notes: [] as Note[] };
    staff.measures.push(measure);
    if (!firstMeasureId) firstMeasureId = measure.id;
  }
  return { score: next, measureId: firstMeasureId };
}

export function setStaffClef(score: Score, staffId: string, clef: 'treble' | 'bass'): Score {
  const next = cloneScore(score);
  const staff = findStaffInScore(next, staffId);
  if (staff) staff.clef = clef;
  return next;
}

function findStaffInScore(score: Score, staffId: string): Staff | null {
  for (const part of score.parts) {
    const staff = part.staves.find((item) => item.id === staffId);
    if (staff) return staff;
  }
  return null;
}
