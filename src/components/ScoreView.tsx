import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import type { Part, Score } from '../types/score';
import { layoutPart, type Primitive } from '../lib/score/layout';

interface ScoreViewProps {
  score: Score;
  part: Part;
  selectedNoteId: string | null;
  onSelect: (info: { partId: string; staffId: string; measureId: string; noteId: string } | null) => void;
}

function renderPrimitive(primitive: Primitive, index: number) {
  switch (primitive.type) {
    case 'line':
      return (
        <line
          key={index}
          x1={primitive.x1}
          y1={primitive.y1}
          x2={primitive.x2}
          y2={primitive.y2}
          stroke={primitive.stroke}
          strokeWidth={primitive.width}
          strokeLinecap="round"
        />
      );
    case 'rect':
      return (
        <rect
          key={index}
          x={primitive.x}
          y={primitive.y}
          width={primitive.w}
          height={primitive.h}
          rx={primitive.radius ?? 0}
          fill={primitive.fill}
          stroke={primitive.stroke}
          strokeWidth={primitive.strokeWidth}
        />
      );
    case 'ellipse':
      return (
        <ellipse
          key={index}
          cx={primitive.cx}
          cy={primitive.cy}
          rx={primitive.rx}
          ry={primitive.ry}
          fill={primitive.fill}
          stroke={primitive.stroke}
          strokeWidth={primitive.strokeWidth}
          transform={primitive.rotate ? `rotate(${primitive.rotate} ${primitive.cx} ${primitive.cy})` : undefined}
        />
      );
    case 'circle':
      return <circle key={index} cx={primitive.cx} cy={primitive.cy} r={primitive.r} fill={primitive.fill} />;
    case 'text':
      return (
        <text
          key={index}
          x={primitive.x}
          y={primitive.y}
          fontSize={primitive.size}
          textAnchor={primitive.anchor}
          dominantBaseline={primitive.baseline === 'middle' ? 'central' : 'alphabetic'}
          fill={primitive.fill}
          fontWeight={primitive.weight ?? 'normal'}
          fontFamily={primitive.family === 'music' ? 'Bravura, serif' : undefined}
          style={
            primitive.family === 'music'
              ? { userSelect: 'none' }
              : { fontFamily: 'var(--font-ui)' }
          }
        >
          {primitive.text}
        </text>
      );
    default:
      return null;
  }
}

export function ScoreView({ score, part, selectedNoteId, onSelect }: ScoreViewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return undefined;
    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? 0;
      if (nextWidth > 0) setWidth(nextWidth);
    });
    observer.observe(element);
    setWidth(element.clientWidth);
    return () => observer.disconnect();
  }, []);

  const layout = useMemo(
    () => layoutPart(score, part, Math.max(260, width || 360), selectedNoteId),
    [score, part, width, selectedNoteId],
  );

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const pageTop = Number(element.dataset.pageTop ?? 0);
    const pageHeight = Number(element.dataset.pageHeight ?? 0);
    const x = ((event.clientX - rect.left) / rect.width) * layout.width;
    const y = ((event.clientY - rect.top) / rect.height) * pageHeight + pageTop;
    const tickScale = layout.width / rect.width;
    const tolerance = 14 * tickScale;

    for (let index = layout.hitboxes.length - 1; index >= 0; index -= 1) {
      const box = layout.hitboxes[index];
      if (x >= box.x - tolerance && x <= box.x + box.w + tolerance && y >= box.y - tolerance && y <= box.y + box.h + tolerance) {
        onSelect({ partId: box.partId, staffId: box.staffId, measureId: box.measureId, noteId: box.noteId });
        return;
      }
    }

    let nearest: { distance: number; hitbox: (typeof layout.hitboxes)[number] } | null = null;
    for (const box of layout.hitboxes) {
      const dx = Math.max(box.x - x, 0, x - (box.x + box.w));
      const dy = Math.max(box.y - y, 0, y - (box.y + box.h));
      const distance = Math.hypot(dx, dy);
      if (distance <= 22 * tickScale && (!nearest || distance < nearest.distance)) {
        nearest = { distance, hitbox: box };
      }
    }
    if (nearest) {
      onSelect({
        partId: nearest.hitbox.partId,
        staffId: nearest.hitbox.staffId,
        measureId: nearest.hitbox.measureId,
        noteId: nearest.hitbox.noteId,
      });
      return;
    }
    onSelect(null);
  };

  return (
    <div className="score-canvas" ref={wrapperRef}>
      {layout.pages.map((page, pageIndex) => (
        <div className="score-page" key={pageIndex}>
          <svg
            className="score-svg"
            viewBox={`0 ${page.top} ${layout.width} ${page.height}`}
            width="100%"
            data-page-top={page.top}
            data-page-height={page.height}
            onClick={handleClick}
            role="img"
            aria-label={`可编辑乐谱 第 ${pageIndex + 1} 页`}
          >
            <rect x={0} y={page.top} width={layout.width} height={page.height} fill="#fffdf8" />
            {page.primitives.map(renderPrimitive)}
          </svg>
        </div>
      ))}
    </div>
  );
}
