import { useEffect, useState } from 'react';
import { UploadScreen } from './components/UploadScreen';
import { PdfPreview } from './components/PdfPreview';
import { ScoreEditor, type Selection } from './components/ScoreEditor';
import { createSampleScore } from './lib/score/sample';
import { musicXmlToScore, scoreToMusicXml } from './lib/score/musicxml';
import type { OmrStats } from './lib/omr/client';
import type { Score } from './types/score';

type View = 'upload' | 'pdf' | 'editor';

function selectionExists(score: Score, selection: Selection): boolean {
  const part = score.parts.find((item) => item.id === selection.partId);
  const staff = part?.staves.find((item) => item.id === selection.staffId);
  const measure = staff?.measures.find((item) => item.id === selection.measureId);
  return Boolean(measure?.notes.some((note) => note.id === selection.noteId));
}

export default function App() {
  const [view, setView] = useState<View>('upload');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [stats, setStats] = useState<OmrStats | null>(null);
  const [past, setPast] = useState<Score[]>([]);
  const [future, setFuture] = useState<Score[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loadingImport, setLoadingImport] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (score && selection && !selectionExists(score, selection)) {
      setSelection(null);
    }
  }, [score, selection]);

  const applyScore = (next: Score) => {
    if (!score) {
      setScore(next);
      return;
    }
    setPast((stack) => [...stack.slice(-39), score]);
    setFuture([]);
    setScore(next);
  };

  const openScore = (next: Score, nextStats: OmrStats | null) => {
    setScore(next);
    setStats(nextStats);
    setSelection(null);
    setPast([]);
    setFuture([]);
    setError(null);
    setView('editor');
  };

  const handleUndo = () => {
    if (!score || past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((stack) => stack.slice(0, -1));
    setFuture((stack) => [score, ...stack].slice(0, 40));
    setScore(previous);
  };

  const handleRedo = () => {
    if (!score || future.length === 0) return;
    const next = future[0];
    setFuture((stack) => stack.slice(1));
    setPast((stack) => [...stack.slice(-39), score]);
    setScore(next);
  };

  const handleImportXml = async (file: File) => {
    setError(null);
    setLoadingImport(true);
    try {
      if (file.name.toLowerCase().endsWith('.mxl')) {
        throw new Error('暂不支持 .mxl 压缩包，请先在 MuseScore 中导出未压缩的 MusicXML');
      }
      const text = await file.text();
      const imported = musicXmlToScore(text);
      setPdfFile(null);
      openScore(imported, null);
      setToast('MusicXML 已导入');
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'MusicXML 导入失败');
    } finally {
      setLoadingImport(false);
    }
  };

  const handleExportXml = () => {
    if (!score) return;
    const xml = scoreToMusicXml(score);
    const blob = new Blob([xml], { type: 'application/vnd.recordare.musicxml+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (score.title || 'score').replace(/[\\/:*?"<>|]+/g, '_');
    link.href = url;
    link.download = `${safeTitle}.musicxml`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    setToast('已导出 MusicXML');
  };

  return (
    <div className="app">
      {view === 'upload' && (
        <UploadScreen
          onPdf={(file) => {
            setError(null);
            setPdfFile(file);
            setView('pdf');
          }}
          onMusicXml={handleImportXml}
          onSample={() => {
            setPdfFile(null);
            openScore(createSampleScore(), null);
          }}
          error={loadingImport ? null : error}
          resumeTitle={score ? score.title : null}
          onResume={() => setView('editor')}
        />
      )}

      {view === 'pdf' && pdfFile && (
        <PdfPreview
          file={pdfFile}
          onScore={(recognized, recognizedStats) => {
            const title = pdfFile.name.replace(/\.pdf$/i, '') || '识别结果';
            openScore({ ...recognized, title }, recognizedStats);
          }}
          onClose={() => {
            setView('upload');
            setPdfFile(null);
          }}
        />
      )}

      {view === 'editor' && score && (
        <ScoreEditor
          score={score}
          selection={selection}
          stats={stats}
          canUndo={past.length > 0}
          canRedo={future.length > 0}
          onApply={applyScore}
          onSelect={setSelection}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onBack={() => {
            setView('upload');
            setSelection(null);
            setError(null);
          }}
          onExportXml={handleExportXml}
          onPrint={() => {
            setSelection(null);
            window.setTimeout(() => window.print(), 60);
          }}
          onToast={setToast}
        />
      )}

      {loadingImport && <div className="loading-overlay">正在解析 MusicXML…</div>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
