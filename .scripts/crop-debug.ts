/* 裁剪 piano-score.png 中指定区域，用于视觉检查 */
import { loadImage } from '@napi-rs/canvas';
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';

const img = await loadImage('/tmp/piano-score.png');
const regions: Array<[string, number, number, number, number]> = [
  ['rest8-s0', 305, 108, 45, 34], // 高音谱表八分休止符
  ['rest8-s1', 305, 220, 45, 34], // 低音谱表八分休止符
  ['rest4-s2', 278, 462, 45, 40], // 高音谱表四分休止符
  ['rest4-s3', 278, 578, 45, 40], // 低音谱表四分休止符
  ['beam16-s0', 572, 160, 90, 36], // 高音谱表十六分双梁
];
for (const [name, x, y, w, h] of regions) {
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
  writeFileSync(`/tmp/piano-${name}.png`, c.toBuffer('image/png'));
}
console.log('done');
