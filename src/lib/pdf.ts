import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import type { PDFDocumentProxy } from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export type PdfDocument = PDFDocumentProxy;

export async function loadPdfDocument(data: ArrayBuffer): Promise<PdfDocument> {
  const task = pdfjsLib.getDocument({ data });
  return task.promise;
}

export interface RenderedPage {
  canvas: HTMLCanvasElement;
  imageData: ImageData;
  width: number;
  height: number;
}

export async function renderPdfPage(
  doc: PdfDocument,
  pageNumber: number,
  targetWidth = 1600,
): Promise<RenderedPage> {
  const page = await doc.getPage(pageNumber);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = Math.min(targetWidth / baseViewport.width, 2.5);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('无法创建画布上下文');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: context, viewport }).promise;
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  return { canvas, imageData, width: canvas.width, height: canvas.height };
}
