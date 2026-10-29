/* 从 /tmp/piano-score.png 裁剪问题区域为 PNG，便于直接查看 */
import { createCanvas, GlobalFonts, loadImage } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';
GlobalFonts.registerFromPath('/workspace/node_modules/@vexflow-fonts/bravura/bravura.otf', 'Bravura');

async function crop(x0: number, y0: number, w: number, h: number, out: string): Promise<void> {
  const img = await loadImage('/tmp/piano-score.png');
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, -x0, -y0);
  writeFileSync(out, c.toBuffer('image/png'));
  console.log('saved', out);
}

async function main(): Promise<void> {
  await crop(290, 425, 70, 90, '/tmp/crop-s2-a4.png'); // s2 A4@303.9 t8
  await crop(490, 60, 60, 110, '/tmp/crop-s0-d5.png'); // s0 D5@500.7 t8 + rest8@528.7
  await crop(392, 205, 56, 60, '/tmp/crop-s1-beamed.png'); // s1 beamed A3@407
  await crop(166, 150, 50, 60, '/tmp/crop-s0-c4.png'); // s0 C4@179 t4d
  await crop(488, 190, 60, 60, '/tmp/crop-s1-d3.png'); // s1 D3@500.7 dotted
  await crop(520, 100, 60, 60, '/tmp/crop-s2-rest4.png'); // s2 rest4@508.7
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
