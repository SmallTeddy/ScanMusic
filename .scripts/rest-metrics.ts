/* 测量 Bravura 休止符字形在各字号下的墨迹包围盒（相对 baseline），校准渲染字号 */
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
GlobalFonts.registerFromPath('/workspace/node_modules/@vexflow-fonts/bravura/bravura.otf', 'Bravura');

const SP = 13.375;
const glyphs: Array<[string, string, number[]]> = [
  ['rest4', '\uE4E5', [30, 34, 38, 48]],
  ['rest8', '\uE4E4', [46, 80, 110, 140, 170]],
  ['rest16', '\uE4E3', [46, 80, 110, 140, 170]],
];

for (const [name, glyph, sizes] of glyphs) {
  for (const size of sizes) {
    const w = 400;
    const h = 400;
    const c = createCanvas(w, h);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000000';
    ctx.font = `${size}px Bravura`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    const baseline = 250;
    ctx.fillText(glyph, 200, baseline);
    const data = ctx.getImageData(0, 0, w, h).data;
    let minX = w;
    let maxX = -1;
    let minY = h;
    let maxY = -1;
    let count = 0;
    for (let y = 0; y < h; y += 1) {
      for (let x = 0; x < w; x += 1) {
        const i = (y * w + x) * 4;
        if (data[i] < 128) {
          count += 1;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (count === 0) {
      console.log(`${name} @${size}px: EMPTY`);
      continue;
    }
    const gw = maxX - minX + 1;
    const gh = maxY - minY + 1;
    console.log(
      `${name} @${size}px: w=${(gw / SP).toFixed(2)}sp(${gw}px) h=${(gh / SP).toFixed(2)}sp(${gh}px) top=${(minY - baseline).toFixed(1)} bottom=${(maxY - baseline).toFixed(1)} center=${((minY + maxY) / 2 - baseline).toFixed(1)}`,
    );
  }
}
