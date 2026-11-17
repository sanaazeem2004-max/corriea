import { chromium } from 'playwright';
import fs from 'fs';
const [,, gifPath, outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const b64 = fs.readFileSync(gifPath).toString('base64');
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.route('https://stub.test/', r => r.fulfill({ contentType: 'text/html', body: '<html></html>' }));
await page.goto('https://stub.test/');
const frames = await page.evaluate(async (b64) => {
  const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const dec = new ImageDecoder({ data: bin, type: 'image/gif' });
  await dec.tracks.ready;
  const n = dec.tracks.selectedTrack.frameCount;
  const out = []; const step = Math.max(1, Math.floor(n / 16));
  for (let i = 0; i < n; i += step) {
    const { image } = await dec.decode({ frameIndex: i });
    const c = new OffscreenCanvas(image.displayWidth, image.displayHeight);
    c.getContext('2d').drawImage(image, 0, 0);
    const blob = await c.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = ''; for (const x of buf) s += String.fromCharCode(x);
    out.push({ i, n, w: image.displayWidth, h: image.displayHeight, data: btoa(s) });
  }
  return out;
}, b64);
for (const f of frames) fs.writeFileSync(`${outDir}/f${String(f.i).padStart(3,'0')}.jpg`, Buffer.from(f.data, 'base64'));
console.log(frames.length, 'frames of', frames[0].n, frames[0].w + 'x' + frames[0].h);
await browser.close();
