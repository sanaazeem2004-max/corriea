// Trim transparent padding from a PNG. usage: node trim-png.mjs in.png out.png [pad]
import { chromium } from 'playwright'; import fs from 'fs';
const [,, input, output, pad = '4'] = process.argv;
const src = 'data:image/png;base64,' + fs.readFileSync(input).toString('base64');
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage();
const r = await p.evaluate(async ({ src, pad }) => {
  const img = new Image(); img.src = src; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
  for (let y = 0; y < c.height; y++) for (let i = 0; i < c.width; i++) if (d[(y * c.width + i) * 4 + 3] > 12) {
    minX = Math.min(minX, i); maxX = Math.max(maxX, i); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  const w = maxX - minX + 1 + pad * 2, h = maxY - minY + 1 + pad * 2;
  const o = document.createElement('canvas'); o.width = w; o.height = h;
  o.getContext('2d').drawImage(c, minX - pad, minY - pad, w, h, 0, 0, w, h);
  return { data: o.toDataURL('image/png').split(',')[1], w, h };
}, { src, pad: +pad });
fs.writeFileSync(output, Buffer.from(r.data, 'base64')); await b.close(); console.log(r.w, r.h);
