import { chromium } from 'playwright';
import fs from 'fs'; import path from 'path';
const [,, dir, out] = process.argv;
const files = fs.readdirSync(dir).filter(f => /\.(jpe?g|png)$/i.test(f));
const html = `<body style="margin:0;display:grid;grid-template-columns:repeat(6,1fr);gap:4px;background:#222;font:12px sans-serif;color:#fff">` +
  files.map(f => `<div><img src="data:image/jpeg;base64,${fs.readFileSync(path.join(dir,f)).toString('base64')}" style="width:100%;height:160px;object-fit:cover;display:block"><div>${f.slice(0,22)}</div></div>`).join('') + '</body>';
const b = await chromium.launch({ channel: 'chrome' }); const p = await b.newPage({ viewport: { width: 1500, height: 800 } });
await p.setContent(html); await p.screenshot({ path: out, fullPage: true }); await b.close();
