// node tools/preview-shot.js  (NODE_PATH must point to a folder with puppeteer-core)
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const URL = process.env.URL || 'http://localhost:5173/';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT = path.join(__dirname, '..', 'preview');
const MAX_PX = 30000;
const PIN_AT = { hot: 0.08, film__track: 0.72 };
const CHROME = '.nav, .battery, .notice, #dock, .sbar';
const SHOT_CSS = [
  'html{scroll-behavior:auto!important}',
  '.reveal{opacity:1!important;transform:none!important}',
  'main>section:last-child{transform:none!important}',
  'main>section:last-child::after{opacity:0!important}',
  '.is-shot-hide,.is-shot-hide *{opacity:0!important;pointer-events:none!important}'
].join('');

const DEVICES = [
  { name: 'desktop', width: 1440, height: 900, dsf: 1.5, mobile: false },
  { name: 'mobile', width: 390, height: 844, dsf: 2, mobile: true }
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function settle(page) {
  await page.evaluate(async () => {
    const imgs = [...document.images].filter((i) => {
      const r = i.getBoundingClientRect();
      return r.bottom > -50 && r.top < innerHeight + 50;
    });
    imgs.forEach((i) => { i.loading = 'eager'; });
    await Promise.all(imgs.map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 4000); }))));
  });
  await wait(1300);
}

async function pins(page) {
  return page.evaluate((at) => {
    const vh = innerHeight;
    return [...document.querySelectorAll('*')]
      .filter((el) => getComputedStyle(el).position === 'sticky')
      .map((el) => {
        const box = el.parentElement;
        const s = box.getBoundingClientRect().top + scrollY;
        const e = s + box.offsetHeight - vh;
        const key = Object.keys(at).find((k) => box.classList.contains(k));
        return { s: Math.round(s), e: Math.round(e), k: key ? at[key] : 0.5 };
      })
      .filter((p) => p.e - p.s > 40)
      .sort((a, b) => a.s - b.s);
  }, PIN_AT);
}

function plan(H, vh, list) {
  const frames = [];
  let y = 0;
  while (y < H - 1) {
    const pin = list.find((p) => p.s >= y - 1);
    if (pin && y + vh > pin.s) {
      if (pin.s - y > 1) frames.push({ at: y, top: 0, h: pin.s - y });
      frames.push({ at: Math.round(pin.s + (pin.e - pin.s) * pin.k), top: 0, h: vh });
      y = pin.e + vh;
      continue;
    }
    const max = H - vh;
    if (y > max) { frames.push({ at: max, top: y - max, h: H - y }); break; }
    frames.push({ at: y, top: 0, h: vh });
    y += vh;
  }
  return frames;
}

async function shoot(browser, dev) {
  const page = await browser.newPage();
  await page.setViewport({ width: dev.width, height: dev.height, deviceScaleFactor: dev.dsf, isMobile: dev.mobile, hasTouch: dev.mobile });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.waitForFunction(() => !document.getElementById('loader'), { timeout: 20000 });
  await page.addStyleTag({ content: SHOT_CSS });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
  });
  await wait(1500);

  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const frames = plan(H, dev.height, await pins(page));
  console.log(`[${dev.name}] page ${H}px -> ${frames.length} frames`);

  const shots = [];
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    await page.evaluate((y, sel, hide) => {
      scrollTo(0, y);
      document.querySelectorAll(sel).forEach((el) => el.classList.toggle('is-shot-hide', hide));
    }, f.at, CHROME, i > 0);
    await settle(page);
    shots.push({ ...f, img: await page.screenshot({ type: 'png', encoding: 'base64' }) });
    process.stdout.write(`  ${i + 1}/${frames.length}\r`);
  }

  const total = shots.reduce((n, f) => n + f.h, 0);
  const scale = Math.min(1, MAX_PX / (total * dev.dsf));
  const data = await page.evaluate(async (list, w, dsf, scale) => {
    const cv = document.createElement('canvas');
    cv.width = Math.round(w * dsf * scale);
    cv.height = Math.round(list.reduce((n, f) => n + f.h, 0) * dsf * scale);
    const ctx = cv.getContext('2d');
    let y = 0;
    for (const f of list) {
      const im = new Image();
      im.src = 'data:image/png;base64,' + f.img;
      await im.decode();
      ctx.drawImage(im, 0, f.top * dsf, w * dsf, f.h * dsf, 0, Math.round(y * dsf * scale), cv.width, Math.round(f.h * dsf * scale));
      y += f.h;
    }
    return cv.toDataURL('image/jpeg', 0.9).split(',')[1];
  }, shots, dev.width, dev.dsf, scale);

  const file = path.join(OUT, `tesway-${dev.name}.jpg`);
  fs.writeFileSync(file, Buffer.from(data, 'base64'));
  console.log(`[${dev.name}] saved ${file} (${Math.round(dev.width * dev.dsf * scale)}x${Math.round(total * dev.dsf * scale)})`);
  await page.close();
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const dev of DEVICES) await shoot(browser, dev);
  } finally {
    await browser.close();
  }
})();
