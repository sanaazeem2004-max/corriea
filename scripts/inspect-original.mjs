import { chromium } from 'playwright';
import fs from 'fs';
const URL = 'https://thecorreialawfirm.com/';
const out = 'screenshots/before'; fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const report = {};
for (const w of [1440, 768, 390]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 90000 }).catch(e => console.log('goto', e.message));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${out}/original-${w}-fold.png` });
  // scroll to trigger lazy content
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${out}/original-${w}-full.png`, fullPage: true });
  report[w] = await page.evaluate(() => ({
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    height: document.body.scrollHeight,
  }));
  if (w === 1440) {
    Object.assign(report, await page.evaluate(() => ({
      title: document.title,
      metaDesc: document.querySelector('meta[name=description]')?.content,
      headings: [...document.querySelectorAll('h1,h2,h3,h4')].map(h => h.tagName + ': ' + h.innerText.trim()).filter(Boolean),
      links: [...new Set([...document.querySelectorAll('a')].map(a => (a.innerText.trim().slice(0,40) || '[img]') + ' -> ' + a.href))],
      images: [...document.querySelectorAll('img')].map(i => i.currentSrc || i.src).filter(Boolean),
      bgImages: [...document.querySelectorAll('*')].map(e => getComputedStyle(e).backgroundImage).filter(b => b.includes('url(')),
      fonts: [...new Set([...document.querySelectorAll('h1,h2,h3,p,a')].map(e => getComputedStyle(e).fontFamily))],
      iframes: [...document.querySelectorAll('iframe')].map(f => f.src),
      text: document.body.innerText,
    })));
  }
  await ctx.close();
}
fs.writeFileSync(`${out}/original-report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ 1440: report[1440], 768: report[768], 390: report[390], title: report.title }, null, 1));
await browser.close();
