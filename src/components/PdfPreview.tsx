import { useEffect, useRef, useState } from 'react';
import { loadPdfDocument, renderPdfPage, type PdfDocument } from '../lib/pdf';
import { recognizeImage, type OmrStats } from '../lib/omr/client';
import type { Score } from '../types/score';

interface PdfPreviewProps {
  file: File;
  onScore: (score: Score, stats: OmrStats) => void;
  onClose: () => void;
}

export function PdfPreview({ file, onScore, onClose }: PdfPreviewProps) {
  const [doc, setDoc] = useState<PdfDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recognizing, setRecognizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    file
      .arrayBuffer()
      .then((buffer) => loadPdfDocument(buffer))
      .then((document) => {
        if (cancelled) return;
        setDoc(document);
        setPageCount(document.numPages);
        setPageIndex(0);
      })
      .catch((loadError: unknown) => {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : 'PDF 加载失败');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  useEffect(() => {
    if (!doc) return undefined;
    let cancelled = false;
    setLoading(true);
    setError(null);
    renderPdfPage(doc, pageIndex + 1, 1600)
      .then((page) => {
        if (cancelled) return;
        imageDataRef.current = page.imageData;
        const host = canvasHostRef.current;
        if (host) {
          host.replaceChildren(page.canvas);
          page.canvas.className = 'pdf-canvas';
        }
        setLoading(false);
      })
      .catch((renderError: unknown) => {
        if (cancelled) return;
        setError(renderError instanceof Error ? renderError.message : '页面渲染失败');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doc, pageIndex]);

  const handleRecognize = async () => {
    const image = imageDataRef.current;
    if (!image) return;
    setRecognizing(true);
    setError(null);
    try {
      const result = await recognizeImage(image);
      if (result.ok) {
        onScore(result.score, result.stats);
      } else {
        setError(result.error);
      }
    } catch {
      setError('识别失败，请重试');
    } finally {
      setRecognizing(false);
    }
  };

  return (
    <section className="panel">
      <div className="panel-head">
        <button className="icon-btn" onClick={onClose} aria-label="返回">
          ←
        </button>
        <div className="panel-title">
          <h2>预览扫描</h2>
          <p>
            {pageCount > 0 ? `第 ${pageIndex + 1} / ${pageCount} 页` : '正在打开 PDF…'} · {file.name}
          </p>
        </div>
      </div>

      <div className={`pdf-preview ${loading ? 'is-loading' : ''}`}>
        <div ref={canvasHostRef} className="pdf-canvas-host" />
        {loading && <div className="pdf-loading">正在渲染页面…</div>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="pdf-nav">
        <button
          className="btn btn-ghost"
          onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
          disabled={pageIndex === 0 || loading || recognizing}
        >
          上一页
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => setPageIndex((value) => Math.min(pageCount - 1, value + 1))}
          disabled={pageIndex >= pageCount - 1 || loading || recognizing}
        >
          下一页
        </button>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleRecognize} disabled={loading || recognizing}>
        {recognizing ? '正在识别五线谱…' : '识别本页并编辑'}
      </button>

      <div className="hint-card">
        <strong>识别说明</strong>
        <p>
          当前版本在浏览器本地识别，适合清晰的印刷谱（扫描件、拍照页效果会下降）。识别后可在编辑器中逐个修正音高、时值，并导出 MusicXML。
        </p>
      </div>
    </section>
  );
}
