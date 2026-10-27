/* 高分辨率裁剪原始 PDF 区域，人眼核对 x=612,y=799（k=2 音符）与相邻区域 */
import { execSync } from 'node:child_process';
import { loadImage, createCanvas } from '@napi-rs/canvas';
import * as fs from 'node:fs';

async function main(): Promise<void> {
  execSync('pdftoppm -png -r 300 -f 1 -l 1 /workspace/public/test.pdf /tmp/hi-page', { stdio: 'pipe' });
  const image = await loadImage('/tmp/hi-page-1.png');
  // 150dpi 坐标 ×2 = 300dpi 坐标
  const x = 612 * 2;
  const y = 799 * 2;
  const padX = 120 * 2;
  const top = y - 100 * 2;
  const bottom = y + 80 * 2;
  const canvas = createCanvas(padX * 2 + 1, bottom - top + 1);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, x - padX, top, padX * 2 + 1, bottom - top + 1, 0, 0, padX * 2 + 1, bottom - top + 1);
  fs.writeFileSync('/tmp/crop-hi.png', canvas.toBuffer('image/png'));
  console.log('written /tmp/crop-hi.png');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
