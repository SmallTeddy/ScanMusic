/* 裁剪合成图休止符区域，检查 k8 误检 blob 的形状 */
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

(globalThis as unknown as { self?: unknown }).self = globalThis;
GlobalFonts.registerFromPath('/workspace/node_modules/@vexflow-fonts/bravura/bravura.otf', 'Bravura');

const SP = 13.375;
const staffTop = 120;
const width = 940;
const height = 320;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, width, height);
const staffBottom = staffTop + 4 * SP;
ctx.fillStyle = '#111111';
for (let i = 0; i < 5; i += 1) {
  const y = staffTop + i * SP;
  ctx.fillRect(30, y - 0.7, width - 60, 1.4);
}
ctx.fillStyle = '#000000';
ctx.font = '60px Bravura';
ctx.textBaseline = 'alphabetic';
ctx.fillText('\uE050', 44, staffBottom - 0.5 * SP);
ctx.font = '22px sans-serif';
ctx.fillText('4', 92, staffTop + 1.35 * SP);
ctx.fillText('4', 92, staffTop + 3.15 * SP);
// 第二小节：G4 四分、A4 二分、四分休止
const x = 130 + 190;
const head = (hx: number, hy: number, hollow: boolean) => {
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(-0.35);
  ctx.beginPath();
  ctx.ellipse(0, 0, 0.62 * SP, 0.43 * SP, 0, 0, Math.PI * 2);
  if (hollow) {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.4;
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillStyle = '#000000';
    ctx.fill();
  }
  ctx.restore();
};
const kOf = (step: string, octave: number) => octave * 7 + 'CDEFGAB'.indexOf(step) - 30;
const k2 = kOf('G', 4);
head(x, staffBottom - (k2 * SP) / 2, false);
const k3 = kOf('A', 4);
const y3 = staffBottom - (k3 * SP) / 2;
head(x + 44, y3, true);
ctx.fillStyle = '#000000';
ctx.fillRect(x + 44 + 0.55 * SP - 0.6, y3 - 3.2 * SP, 1.2, 3.2 * SP);
ctx.font = '60px Bravura';
ctx.fillText('\uE4E5', x + 128, staffTop + 2 * SP);

const img = ctx.getImageData(0, 0, width, height);
// 保存全图 + 放大的休止符区域
const full = createCanvas(width, height);
const fctx = full.getContext('2d');
fctx.putImageData(img, 0, 0);
import { writeFileSync } from 'node:fs';
const fullBuf = full.toBuffer('image/png');
writeFileSync('/tmp/synth-full.png', fullBuf);

const region = createCanvas(120, 90);
const rctx = region.getContext('2d');
rctx.scale(3, 3);
rctx.putImageData(img, -410, -90);
const regionBuf = region.toBuffer('image/png');
writeFileSync('/tmp/synth-rest-zoom.png', regionBuf);
console.log('saved');
