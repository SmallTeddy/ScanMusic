/* 像素级查看 piano-score.png 指定区域（ASCII 转储） */
import { loadImage, createCanvas } from '@napi-rs/canvas';

const img = await loadImage('/tmp/piano-score.png');
const c = createCanvas(img.width, img.height);
const ctx = c.getContext('2d');
ctx.drawImage(img, 0, 0);
const data = ctx.getImageData(0, 0, img.width, img.height).data;

function dump(x0: number, y0: number, w: number, h: number, label: string): void {
  console.log(`=== ${label} (${x0},${y0}) ${w}x${h} ===`);
  for (let y = y0; y < y0 + h; y += 1) {
    let line = '';
    for (let x = x0; x < x0 + w; x += 1) {
      const i = (y * img.width + x) * 4;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      line += lum < 128 ? '#' : '.';
    }
    console.log(line);
  }
}

// 高音谱表（s0）M2 的八分休止符：x≈327，谱线在 y=100,113.4,126.8,140.1,153.5
dump(300, 95, 52, 66, 's0 rest8 wide (x300-352, y95-161)');
// 低音谱表（s3）M2 的四分休止符：x≈301，谱线 y=561.4..614.9
dump(288, 555, 40, 70, 's3 rest4 wide (x288-328, y555-625)');
