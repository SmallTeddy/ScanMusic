/* 裁剪原始乐谱页面某区域为 PNG，便于人眼核对（x=612, y=799, staff2） */
import { execSync } from 'node:child_process';
import { loadImage, createCanvas } from '@napi-rs/canvas';
import * as fs from 'node:fs';

async function main(): Promise<void> {
  execSync('pdftoppm -png -r 150 -f 1 -l 1 /workspace/public/test.pdf /tmp/view-page', { stdio: 'pipe' });
  const image = await loadImage('/tmp/view-page-1.png');
  const x = 612;
  const y = 799;
  const sp = 13.375;
  const padX = 100;
  const top = Math.max(0, y - Math.round(sp * 4.5));
  const bottom = Math.min(image.height - 1, y + Math.round(sp * 3));
  const canvas = createCanvas(padX * 2 + 1, bottom - top + 1);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, x - padX, top, padX * 2 + 1, bottom - top + 1, 0, 0, padX * 2 + 1, bottom - top + 1);
  fs.writeFileSync('/tmp/crop-note.png', canvas.toBuffer('image/png'));
  console.log('written /tmp/crop-note.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
