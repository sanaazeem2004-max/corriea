// Quick viewport screenshot. usage: node scripts/shot.mjs width height out [url]
import { chromium } from 'playwright';
const [,, w, h, out, url = 'http://localhost:5180/'] = process.argv;
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: +w, height: +h } });
await ctx.addInitScript(() => localStorage.setItem('clf-cookie-consent', '{"necessary":true}'));
const p = await ctx.newPage(); await p.goto(url, { waitUntil: 'networkidle' }); await p.waitForTimeout(2800);
await p.screenshot({ path: out }); await b.close();
