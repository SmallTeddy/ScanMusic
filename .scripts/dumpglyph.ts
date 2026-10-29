import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
GlobalFonts.registerFromPath('/workspace/node_modules/@vexflow-fonts/bravura/bravura.otf', 'Bravura');
const w = 300;
const h = 140;
const c = createCanvas(w, h);
const ctx = c.getContext('2d');
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, w, h);
ctx.fillStyle = '#000';
ctx.font = '113px Bravura';
ctx.textAlign = 'center';
ctx.textBaseline = 'alphabetic';
ctx.fillText('\uE4E4', 150, 70);
const d = ctx.getImageData(0, 0, w, h).data;
for (let y = 0; y < h; y += 1) {
  let l = '';
  for (let x = 0; x < w; x += 1) {
    const i = (y * w + x) * 4;
    l += d[i] < 128 ? '#' : '.';
  }
  console.log(l);
}
