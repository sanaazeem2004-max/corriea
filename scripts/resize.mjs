// Resize a local image with Chrome canvas. usage: node resize.mjs in out maxWidth mime quality
import { chromium } from 'playwright'; import fs from 'fs';
const [,, input, output, maxW, mime = 'image/jpeg', q = '0.82'] = process.argv;
const src = `data:${input.endsWith('png') ? 'image/png' : 'image/jpeg'};base64,` + fs.readFileSync(input).toString('base64');
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage();
const data = await p.evaluate(async ({ src, maxW, mime, q }) => {
  const img = new Image(); img.src = src; await img.decode();
  const s = Math.min(1, maxW / img.naturalWidth); const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL(mime, q).split(',')[1];
}, { src, maxW: +maxW, mime, q: +q });
fs.writeFileSync(output, Buffer.from(data, 'base64')); await b.close();
console.log(output, fs.statSync(output).size);
