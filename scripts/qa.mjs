// Playwright QA for the redesigned site.
// usage: node scripts/qa.mjs [baseUrl]   (default http://localhost:5180/)
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.argv[2] || 'http://localhost:5180/';
const OUT = 'screenshots/after';
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const results = { base: BASE, viewports: {}, interactions: {}, links: {} };
const fail = [];
const check = (ok, msg) => { if (!ok) fail.push(msg); return ok; };

const browser = await chromium.launch({ channel: 'chrome' });

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += Math.round(innerHeight * 0.6)) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 140));
    }
    await new Promise((r) => setTimeout(r, 900));
    await Promise.all([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => null))));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1600);
}

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  // Pre-dismiss the cookie banner for clean layout screenshots
  await ctx.addInitScript(() => localStorage.setItem('clf-cookie-consent', '{"necessary":true}'));
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('requestfailed', (r) => !r.url().startsWith('mailto') && errors.push(`request failed: ${r.url()}`));
  page.on('response', (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2600); // hero entrance
  await page.screenshot({ path: `${OUT}/${vp.width}-fold.png` });
  await scrollThrough(page);

  const m = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const overflowX = document.documentElement.scrollWidth - vw;
    // Elements poking outside the viewport horizontally (ignore hidden/clipped decorative ones)
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.right > vw + 1 || r.left < -1) {
        let clipped = false;
        for (let p = el.parentElement; p; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (s.overflowX !== 'visible' || s.overflow === 'hidden' || s.overflow === 'clip') {
            const pr = p.getBoundingClientRect();
            if (pr.right <= vw + 1 && pr.left >= -1) { clipped = true; break; }
          }
        }
        if (!clipped && getComputedStyle(el).position !== 'fixed') offenders.push(`${el.tagName}.${String(el.className).slice(0, 60)}`);
      }
    }
    // Shared container alignment: every .container-x and main section headings
    const containers = [...document.querySelectorAll('.container-x')]
      .filter((el) => el.getBoundingClientRect().width > 0)
      .map((el) => Math.round(el.getBoundingClientRect().left));
    const headings = [...document.querySelectorAll('main h2')].map((h) => ({
      text: h.textContent.trim().slice(0, 40),
      left: Math.round(h.getBoundingClientRect().left),
    }));
    const imgs = [...document.querySelectorAll('img')].map((i) => ({ src: i.currentSrc.split('/').pop(), ok: i.complete && i.naturalWidth > 0 }));
    // Section heights + gaps between consecutive sections
    const sections = [...document.querySelectorAll('main > section, body footer:not(blockquote footer)')].map((s) => {
      const r = s.getBoundingClientRect();
      return { id: s.id || s.tagName.toLowerCase(), top: Math.round(r.top + scrollY), height: Math.round(r.height) };
    });
    const gaps = sections.slice(1).map((s, i) => s.top - (sections[i].top + sections[i].height));
    // Practice cards should share dimensions per row
    const cards = [...document.querySelectorAll('#practice-areas article')].map((c) => {
      const r = c.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top + scrollY) };
    });
    // Small tap targets on touch layouts
    const smallTargets = [...document.querySelectorAll('a, button')]
      .filter((a) => { const r = a.getBoundingClientRect(); return r.width > 0 && (r.height < 24 || r.width < 24); })
      .map((a) => a.textContent.trim().slice(0, 30) || a.getAttribute('aria-label'));
    const h1 = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim());
    return { vw, overflowX, offenders: [...new Set(offenders)].slice(0, 15), containers: [...new Set(containers)], headings, imgs, sections, gaps, cards, smallTargets, h1, height: document.documentElement.scrollHeight };
  });

  await page.screenshot({ path: `${OUT}/${vp.width}-full.png`, fullPage: true });
  // Per-section captures for close review
  fs.mkdirSync(`${OUT}/sections`, { recursive: true });
  const hideHeader = await page.addStyleTag({ content: 'header{visibility:hidden!important}' });
  const secs = ['#about', '#practice-areas', 'section[aria-labelledby=why-title]', '#attorney', '#contact', '#root > footer'];
  for (const [i, sel] of secs.entries()) {
    await page.locator(sel).scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
    await page.locator(sel).screenshot({ path: `${OUT}/sections/${vp.width}-${i + 1}-${sel.replace(/[^a-z]/gi, '').slice(0, 14)}.png` });
  }

  check(m.overflowX <= 0, `${vp.width}: horizontal overflow ${m.overflowX}px`);
  check(m.offenders.length === 0, `${vp.width}: elements outside viewport: ${m.offenders.join(', ')}`);
  check(m.containers.length === 1, `${vp.width}: container left edges differ: ${m.containers}`);
  check(m.imgs.every((i) => i.ok), `${vp.width}: images failed: ${m.imgs.filter((i) => !i.ok).map((i) => i.src)}`);
  check(m.gaps.every((g) => Math.abs(g) <= 1), `${vp.width}: unexpected gaps between sections: ${m.gaps}`);
  check(m.h1.length === 1, `${vp.width}: expected one h1, got ${m.h1.length}`);
  // cards in the same row must match in height
  const rows = {};
  m.cards.forEach((c) => (rows[c.top] ||= []).push(c));
  for (const row of Object.values(rows)) {
    check(new Set(row.map((c) => c.h)).size === 1 && new Set(row.map((c) => c.w)).size === 1,
      `${vp.width}: practice cards differ within a row: ${JSON.stringify(row)}`);
  }
  check(errors.length === 0, `${vp.width}: console/network errors: ${errors.join(' | ')}`);
  results.viewports[vp.width] = { ...m, errors };
  await ctx.close();
}

/* ---------- Interactions (desktop) ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // Cookie banner shows on first visit, Settings expands, Reject hides + persists
  const banner = page.getByRole('dialog', { name: 'We Use Cookies' });
  await banner.waitFor({ timeout: 5000 });
  await banner.getByRole('button', { name: 'Settings' }).click();
  const toggles = await banner.getByRole('switch').count();
  await page.screenshot({ path: `${OUT}/interaction-cookie-settings.png` });
  await banner.getByRole('button', { name: 'Reject' }).click();
  await banner.waitFor({ state: 'hidden' });
  const stored = await page.evaluate(() => localStorage.getItem('clf-cookie-consent'));
  results.interactions.cookie = { toggles, stored };
  check(toggles === 3 && stored?.includes('"analytics":false'), 'cookie banner settings/reject did not work');

  // Nav links scroll to their section and set the active underline
  for (const label of ['About', 'Practice Areas', 'Our Attorney', 'Contact']) {
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label, exact: true }).click();
    await page.waitForTimeout(1400);
    const state = await page.evaluate((label) => {
      const a = [...document.querySelectorAll('nav[aria-label=Primary] a')].find((x) => x.textContent.trim() === label);
      const target = document.querySelector(a.getAttribute('href'));
      return { top: Math.round(target.getBoundingClientRect().top), current: a.getAttribute('aria-current') };
    }, label);
    results.interactions[`nav:${label}`] = state;
    check(Math.abs(state.top) < 120 && state.current === 'true', `nav "${label}" did not land on its section (${JSON.stringify(state)})`);
  }

  // Practice area drawer: open, check content, Escape closes
  await page.locator('#practice-areas').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: /Learn more about Psychedelic Law/ }).click();
  const drawer = page.getByRole('dialog', { name: 'Psychedelic Law' });
  await drawer.waitFor();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/interaction-practice-drawer.png` });
  const drawerText = await drawer.innerText();
  const focusInDrawer = await page.evaluate(() => !!document.activeElement.closest('[role=dialog]'));
  await page.keyboard.press('Escape');
  await drawer.waitFor({ state: 'hidden' });
  results.interactions.drawer = { hasServices: drawerText.includes('Regulatory Advice'), focusInDrawer };
  check(drawerText.includes('Regulatory Advice') && focusInDrawer, 'practice drawer content/focus failed');

  // Contact form: validation then success state
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Send message' }).click();
  const alerts = await page.locator('#contact [role=alert]').count();
  await page.getByLabel('Full name').fill('Test Visitor');
  await page.getByLabel('Email').fill('visitor@example.com');
  await page.getByLabel('Practice area').selectOption({ label: 'Estate Planning and Probate' });
  await page.getByLabel('How can we help?').fill('Interested in setting up a trust.');
  await page.getByLabel(/does not create an attorney-client relationship/).check();
  let mailto = null;
  page.on('framenavigated', () => {});
  await page.route(/^mailto:/, (r) => { mailto = r.request().url(); r.abort(); }).catch(() => {});
  const nav = page.waitForEvent('request', { predicate: (r) => r.url().startsWith('mailto:'), timeout: 3000 }).catch(() => null);
  await page.getByRole('button', { name: 'Send message' }).click();
  const req = await nav;
  await page.getByText('Your message is ready to send.').waitFor({ timeout: 4000 });
  await page.screenshot({ path: `${OUT}/interaction-form-sent.png` });
  results.interactions.form = { validationAlerts: alerts, mailto: (req?.url() || mailto || 'not observable in headless').slice(0, 120) };
  check(alerts === 4, `form validation expected 4 alerts, got ${alerts}`);

  // Consultation links all point at the original Clio Grow booking page
  const book = await page.$$eval('a', (as) => as.filter((a) => /book a consultation|start a conversation/i.test(a.textContent)).map((a) => a.href));
  results.interactions.bookLinks = [...new Set(book)];
  check(book.length >= 5 && new Set(book).size === 1 && book[0] === 'https://thecorreialawfirm.cliogrow.com/book', `booking links inconsistent: ${[...new Set(book)]}`);

  // Collect every link for the broken-link pass
  results.allLinks = [...new Set(await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href'))))];
  await ctx.close();
}

/* ---------- Interactions (mobile menu) ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await ctx.addInitScript(() => localStorage.setItem('clf-cookie-consent', '{"necessary":true}'));
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu' }).tap();
  await page.waitForTimeout(1100);
  await page.screenshot({ path: `${OUT}/interaction-mobile-menu.png` });
  await page.locator('#mobile-menu').getByRole('link', { name: /Practice Areas/ }).tap();
  await page.waitForTimeout(1500);
  const st = await page.evaluate(() => ({
    menuGone: !document.getElementById('mobile-menu'),
    top: Math.round(document.getElementById('practice-areas').getBoundingClientRect().top),
    overflow: document.body.style.overflow,
  }));
  results.interactions.mobileMenu = st;
  check(st.menuGone && Math.abs(st.top) < 120 && st.overflow === '', `mobile menu navigation failed ${JSON.stringify(st)}`);
  await ctx.close();
}
await browser.close();

/* ---------- Link check ---------- */
for (const href of results.allLinks) {
  if (href.startsWith('#')) {
    results.links[href] = 'anchor';
    continue;
  }
  if (/^(tel|mailto):/.test(href)) { results.links[href] = 'ok (protocol)'; continue; }
  try {
    const r = await fetch(href, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (link check)' }, signal: AbortSignal.timeout(15000) });
    results.links[href] = r.status;
    // LinkedIn answers bots with 999; Instagram may 429 — both are reachable in a browser.
    if (r.status >= 400 && ![999, 429, 403].includes(r.status)) fail.push(`broken link ${href} -> ${r.status}`);
  } catch (e) {
    results.links[href] = `error: ${e.message}`;
    fail.push(`link error ${href}: ${e.message}`);
  }
}
// Anchors must point at existing ids (checked against desktop DOM ids)
const ids = ['home', 'about', 'practice-areas', 'attorney', 'contact', 'main'];
for (const a of results.allLinks.filter((h) => h.startsWith('#'))) check(ids.includes(a.slice(1)), `anchor without target: ${a}`);

results.failures = fail;
fs.writeFileSync(`${OUT}/qa-report.json`, JSON.stringify(results, null, 2));
for (const [w, v] of Object.entries(results.viewports)) {
  console.log(`${w}px  height=${v.height} overflowX=${v.overflowX} containerLeft=${v.containers} imgs=${v.imgs.filter((i) => i.ok).length}/${v.imgs.length} errors=${v.errors.length} smallTargets=${v.smallTargets.length}`);
  console.log('   headings:', v.headings.map((h) => `${h.left}`).join(','), ' gaps:', v.gaps.join(','));
}
console.log('interactions:', JSON.stringify(results.interactions, null, 1));
console.log('links:', JSON.stringify(results.links, null, 1));
console.log(fail.length ? `\nFAILURES (${fail.length}):\n- ${fail.join('\n- ')}` : '\nALL CHECKS PASSED');
