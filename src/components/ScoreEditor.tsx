import { useMemo, useState } from 'react';
import {
  DURATION_LABELS,
  keyName,
  noteName,
  type DurationType,
  type Note,
  type Score,
} from '../types/score';
import {
  addChordTone,
  addMeasure,
  appendNote,
  deleteNote,
  duplicateNoteAfter,
  removeChordTone,
  setNoteAlter,
  setNoteDuration,
  setNoteOctave,
  setStaffClef,
  toggleNoteDot,
  transposeNote,
} from '../lib/score/edit';
import { ScoreView } from './ScoreView';
import type { OmrStats } from '../lib/omr/client';

export interface Selection {
  partId: string;
  staffId: string;
  measureId: string;
  noteId: string;
}

interface ScoreEditorProps {
  score: Score;
  selection: Selection | null;
  stats: OmrStats | null;
  canUndo: boolean;
  canRedo: boolean;
  onApply: (score: Score) => void;
  onSelect: (selection: Selection | null) => void;
  onUndo: () => void;
  onRedo: () => void;
  onBack: () => void;
  onExportXml: () => void;
  onPrint: () => void;
  onToast: (message: string) => void;
}

interface LocatedNote {
  note: Note;
  measureNumber: number;
  staffIndex: number;
}

function locateNote(score: Score, selection: Selection | null): LocatedNote | null {
  if (!selection) return null;
  const part = score.parts.find((item) => item.id === selection.partId);
  if (!part) return null;
  const staffIndex = part.staves.findIndex((item) => item.id === selection.staffId);
  if (staffIndex < 0) return null;
  const staff = part.staves[staffIndex];
  const measureIndex = staff.measures.findIndex((measure) => measure.id === selection.measureId);
  if (measureIndex < 0) return null;
  const note = staff.measures[measureIndex].notes.find((item) => item.id === selection.noteId);
  if (!note) return null;
  return { note, measureNumber: measureIndex + 1, staffIndex };
}

function findSelectionByNote(score: Score, noteId: string): Selection | null {
  for (const part of score.parts) {
    for (const staff of part.staves) {
      for (const measure of staff.measures) {
        if (measure.notes.some((note) => note.id === noteId)) {
          return { partId: part.id, staffId: staff.id, measureId: measure.id, noteId };
        }
      }
    }
  }
  return null;
}

function staffLabel(index: number, total: number): string {
  if (total <= 1) return '';
  if (index === 0) return '高音谱表';
  if (index === 1) return '低音谱表';
  return `谱表 ${index + 1}`;
}

export function ScoreEditor({
  score,
  selection,
  stats,
  canUndo,
  canRedo,
  onApply,
  onSelect,
  onUndo,
  onRedo,
  onBack,
  onExportXml,
  onPrint,
  onToast,
}: ScoreEditorProps) {
  const [activePartId, setActivePartId] = useState(score.parts[0]?.id ?? '');
  const [activeStaffId, setActiveStaffId] = useState(score.parts[0]?.staves[0]?.id ?? '');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const activePart = useMemo(() => {
    return score.parts.find((part) => part.id === activePartId) ?? score.parts[0];
  }, [score.parts, activePartId]);

  const activeStaff = useMemo(() => {
    return activePart?.staves.find((staff) => staff.id === activeStaffId) ?? activePart?.staves[0];
  }, [activePart, activeStaffId]);

  const located = locateNote(score, selection);
  const selectedNote = located?.note ?? null;

  const selectNote = (selectionNext: Selection | null) => {
    onSelect(selectionNext);
    if (selectionNext) {
      setActivePartId(selectionNext.partId);
      setActiveStaffId(selectionNext.staffId);
    }
  };

  const applyNoteChange = (nextScore: Score) => {
    onApply(nextScore);
  };

  const handleTranspose = (steps: number) => {
    if (!selectedNote) return;
    applyNoteChange(transposeNote(score, selectedNote.id, steps));
  };

  const handleInsert = () => {
    if (!selectedNote) return;
    const result = duplicateNoteAfter(score, selectedNote.id);
    if (!result.newNoteId) return;
    onApply(result.score);
    const nextSelection = findSelectionByNote(result.score, result.newNoteId);
    onSelect(nextSelection);
    onToast('已在后方插入音符');
  };

  const handleDelete = () => {
    if (!selectedNote) return;
    onApply(deleteNote(score, selectedNote.id));
    onSelect(null);
    onToast('已删除音符');
  };

  const handleAddNote = () => {
    if (!activeStaff) return;
    const result = appendNote(score, activeStaff.id);
    if (!result.newNoteId) return;
    onApply(result.score);
    onSelect(findSelectionByNote(result.score, result.newNoteId));
  };

  const handleAddMeasure = () => {
    if (!activePart) return;
    const result = addMeasure(score, activePart.id);
    if (!result.measureId) return;
    onApply(result.score);
    onToast('已在末尾添加一个小节');
  };

  const handleToggleDot = () => {
    if (!selectedNote) return;
    applyNoteChange(toggleNoteDot(score, selectedNote.id));
  };

  const updateMeta = (patch: Partial<Score>) => {
    onApply({ ...score, ...patch });
  };

  if (!activePart) return null;

  return (
    <div className={`editor ${selectedNote ? 'has-selection' : ''}`}>
      <header className="editor-head">
        <button className="icon-btn" onClick={onBack} aria-label="返回">
          ←
        </button>
        <div className="editor-title">
          <h2>{score.title || '未命名乐谱'}</h2>
          <p>
            {keyName(score.keyFifths)} · {score.time.beats}/{score.time.beatType} · ♩={score.tempo}
          </p>
        </div>
        <button className="icon-btn" onClick={onUndo} disabled={!canUndo} aria-label="撤销">
          ↶
        </button>
        <button className="icon-btn" onClick={onRedo} disabled={!canRedo} aria-label="重做">
          ↷
        </button>
      </header>

      {stats && (
        <div className="recognition-banner">
          已识别 {stats.staves} 行谱表、{stats.notes} 个音符。请逐个核对，点击音符即可修改。
        </div>
      )}

      {score.parts.length > 1 && (
        <div className="part-tabs" role="tablist">
          {score.parts.map((part, index) => (
            <button
              key={part.id}
              role="tab"
              aria-selected={part.id === activePart.id}
              className={`part-tab ${part.id === activePart.id ? 'is-active' : ''}`}
              onClick={() => {
                setActivePartId(part.id);
                setActiveStaffId(part.staves[0]?.id ?? '');
                onSelect(null);
              }}
            >
              {part.name || `谱表 ${index + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="score-card">
        <ScoreView score={score} part={activePart} selectedNoteId={selection?.noteId ?? null} onSelect={selectNote} />
      </div>

      <div className="editor-actions">
        <button className="chip" onClick={() => setSettingsOpen(true)}>
          设置
        </button>
        <button className="chip" onClick={handleAddNote}>
          ＋ 音符
        </button>
        <button className="chip" onClick={handleAddMeasure}>
          ＋ 小节
        </button>
        <button className="chip" onClick={onExportXml}>
          导出 MusicXML
        </button>
        <button className="chip" onClick={onPrint}>
          打印 / PDF
        </button>
      </div>

      {selectedNote && located ? (
        <div className="note-sheet">
          <div className="sheet-head">
            <div>
              <p className="sheet-kicker">
                第 {located.measureNumber} 小节
                {staffLabel(located.staffIndex, activePart.staves.length)
                  ? ` · ${staffLabel(located.staffIndex, activePart.staves.length)}`
                  : ''}
                {' · '}
                {DURATION_LABELS[selectedNote.type]}
                {selectedNote.dot ? '附点' : ''}
              </p>
              <h3>{noteName(selectedNote)}</h3>
            </div>
            <button className="link-btn" onClick={() => onSelect(null)}>
              完成
            </button>
          </div>

          <div className="control-group">
            <span className="control-label">音高</span>
            <div className="pitch-row">
              <button className="step-btn" onClick={() => handleTranspose(-1)} aria-label="降低一个音级">
                −
              </button>
              <div className="pitch-display">{noteName(selectedNote)}</div>
              <button className="step-btn" onClick={() => handleTranspose(1)} aria-label="升高一个音级">
                ＋
              </button>
              <button className="step-btn wide" onClick={() => selectedNote && applyNoteChange(setNoteOctave(score, selectedNote.id, -1))}>
                低八度
              </button>
              <button className="step-btn wide" onClick={() => selectedNote && applyNoteChange(setNoteOctave(score, selectedNote.id, 1))}>
                高八度
              </button>
            </div>
            <div className="accidental-row">
              {([-1, 0, 1] as const).map((alter) => (
                <button
                  key={alter}
                  className={`accidental-btn ${
                    selectedNote.pitches[0]?.alter === alter ? 'is-active' : ''
                  }`}
                  onClick={() => selectedNote && applyNoteChange(setNoteAlter(score, selectedNote.id, alter))}
                >
                  {alter === -1 ? '♭' : alter === 0 ? '♮' : '♯'}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <span className="control-label">时值</span>
            <div className="duration-row">
              {([1, 2, 4, 8, 16] as const).map((type) => (
                <button
                  key={type}
                  className={`duration-btn ${selectedNote.type === type ? 'is-active' : ''}`}
                  onClick={() => selectedNote && applyNoteChange(setNoteDuration(score, selectedNote.id, type as DurationType))}
                >
                  {DURATION_LABELS[type]}
                </button>
              ))}
            </div>
            <div className="duration-row secondary">
              <button className={`duration-btn ${selectedNote.dot ? 'is-active' : ''}`} onClick={handleToggleDot}>
                附点
              </button>
              <button
                className="duration-btn"
                onClick={() => selectedNote && applyNoteChange(addChordTone(score, selectedNote.id))}
              >
                加和弦音
              </button>
              <button
                className="duration-btn"
                onClick={() => selectedNote && applyNoteChange(removeChordTone(score, selectedNote.id))}
                disabled={selectedNote.pitches.length <= 1}
              >
                减和弦音
              </button>
            </div>
          </div>

          <div className="sheet-actions">
            <button className="btn btn-ghost" onClick={handleInsert}>
              后方插入音符
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              删除音符
            </button>
          </div>
        </div>
      ) : (
        <div className="select-hint">点击乐谱中的任意音符，即可修改音高与时值。</div>
      )}

      {settingsOpen && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setSettingsOpen(false)} />
          <div className="modal-sheet">
            <div className="sheet-head">
              <div>
                <p className="sheet-kicker">乐谱设置</p>
                <h3>全局属性</h3>
              </div>
              <button className="link-btn" onClick={() => setSettingsOpen(false)}>
                完成
              </button>
            </div>

            <label className="field">
              <span>标题</span>
              <input
                value={score.title}
                onChange={(event) => updateMeta({ title: event.target.value })}
                placeholder="未命名乐谱"
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>拍号</span>
                <div className="inline-fields">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={score.time.beats}
                    onChange={(event) =>
                      updateMeta({ time: { ...score.time, beats: Math.max(1, Math.min(12, Number(event.target.value) || 4)) } })
                    }
                  />
                  <span className="slash">/</span>
                  <select
                    value={score.time.beatType}
                    onChange={(event) => updateMeta({ time: { ...score.time, beatType: Number(event.target.value) } })}
                  >
                    {[2, 4, 8, 16].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <label className="field">
                <span>速度（BPM）</span>
                <input
                  type="number"
                  min={30}
                  max={240}
                  value={score.tempo}
                  onChange={(event) => updateMeta({ tempo: Math.max(30, Math.min(240, Number(event.target.value) || 96)) })}
                />
              </label>
            </div>

            <label className="field">
              <span>调号</span>
              <select value={score.keyFifths} onChange={(event) => updateMeta({ keyFifths: Number(event.target.value) })}>
                {Array.from({ length: 15 }, (_, index) => index - 7).map((fifths) => (
                  <option key={fifths} value={fifths}>
                    {keyName(fifths)}
                  </option>
                ))}
              </select>
            </label>

            {activePart.staves.map((staff, staffIndex) => (
              <div className="field" key={staff.id}>
                <span>
                  {staffLabel(staffIndex, activePart.staves.length) || '谱表'}谱号
                </span>
                <div className="segmented">
                  <button
                    className={staff.clef === 'treble' ? 'is-active' : ''}
                    onClick={() => onApply(setStaffClef(score, staff.id, 'treble'))}
                  >
                    高音谱号
                  </button>
                  <button
                    className={staff.clef === 'bass' ? 'is-active' : ''}
                    onClick={() => onApply(setStaffClef(score, staff.id, 'bass'))}
                  >
                    低音谱号
                  </button>
                </div>
              </div>
            ))}

            <p className="modal-tip">提示：修改谱号只改变显示位置，不会自动移调已有音符。</p>
          </div>
        </div>
      )}
    </div>
  );
}
