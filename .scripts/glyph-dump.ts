/* 查看大字号下休止符字形形状 */
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';
GlobalFonts.registerFromPath('/workspace/node_modules/@vexflow-fonts/bravura/bravura.otf', 'Bravura');

const SP = 13.375;
const items: Array<[string, string, number]> = [
  ['rest4-34', '\uE4E5', 34],
  ['rest8-113', '\uE4E4', 113],
  ['rest16-133', '\uE4E3', 133],
];

for (const [name, glyph, size] of items) {
  const w = 200;
  const h = 160;
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#000000';
  ctx.font = `${size}px Bravura`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(glyph, 100, 80);
  writeFileSync(`/tmp/glyph-${name}.png`, c.toBuffer('image/png'));
}
console.log('done');
