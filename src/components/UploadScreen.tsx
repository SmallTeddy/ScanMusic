import { useRef } from 'react';

interface UploadScreenProps {
  onPdf: (file: File) => void;
  onMusicXml: (file: File) => void;
  onSample: () => void;
  error: string | null;
  resumeTitle?: string | null;
  onResume?: () => void;
}

export function UploadScreen({ onPdf, onMusicXml, onSample, error, resumeTitle, onResume }: UploadScreenProps) {
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const xmlInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="upload">
      <div className="hero">
        <div className="hero-badge">浏览器内识别 · 无需上传服务器</div>
        <h1>
          PDF 五线谱
          <br />
          变成可编辑乐谱
        </h1>
        <p className="hero-sub">导入 PDF，自动识别音符，点击即可修改音高、时值与谱号，最后导出 MusicXML。</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {resumeTitle && onResume && (
        <button className="resume-card" onClick={onResume}>
          <span>
            继续编辑
            <strong>{resumeTitle}</strong>
          </span>
          <span aria-hidden="true">→</span>
        </button>
      )}

      <div className="upload-card">
        <div className="upload-icon" aria-hidden="true">
          <span>♫</span>
        </div>
        <h2>选择一份乐谱 PDF</h2>
        <p>支持单页或多页 PDF，识别时可切换页面。</p>
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onPdf(file);
            event.target.value = '';
          }}
        />
        <button className="btn btn-primary btn-block" onClick={() => pdfInputRef.current?.click()}>
          选择 PDF 文件
        </button>
        <div className="upload-secondary">
          <input
            ref={xmlInputRef}
            type="file"
            accept=".xml,.musicxml,application/xml,text/xml"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onMusicXml(file);
              event.target.value = '';
            }}
          />
          <button className="link-btn" onClick={() => xmlInputRef.current?.click()}>
            已有 MusicXML？直接导入编辑
          </button>
          <span className="dot">·</span>
          <button className="link-btn" onClick={onSample}>
            先看看示例
          </button>
        </div>
      </div>

      <div className="feature-grid">
        <article>
          <h3>识别</h3>
          <p>本地分析谱线与音符位置，不上传文件，保护隐私。</p>
        </article>
        <article>
          <h3>编辑</h3>
          <p>点选任意音符，调整音高、八度、升降号、时值和附点。</p>
        </article>
        <article>
          <h3>导出</h3>
          <p>生成标准 MusicXML，可继续用 MuseScore、Finale 等软件排版。</p>
        </article>
      </div>

      <div className="hint-card">
        <strong>关于识别精度</strong>
        <p>
          纯浏览器环境无法运行 Audiveris、oemer 等重型 OMR 引擎，本应用内置轻量识别算法。对清晰的印刷谱效果最好；复杂节奏、多声部、歌词与连线需要手工修正。
        </p>
      </div>
    </section>
  );
}
