// Renders the HTML art in tools/art/ to PNGs in assets/.
// Usage: node tools/render-art.mjs   (needs Playwright + Chromium; not part of the app build)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const jobs = [
  { src: 'tools/art/y2k-pink-chrome.html', out: 'assets/wallpapers/y2k-pink-chrome.png', w: 1320, h: 2868 },
  // Half-size copy for the widget extension: widgets have a tight memory budget and
  // the widget blurs its background anyway, so full resolution would be wasted.
  { src: 'tools/art/y2k-pink-chrome.html', out: 'assets/wallpapers/widget/y2k-pink-chrome-widget.png', w: 1320, h: 2868, scale: 0.5 },
  // Frutiger Aero and Aero Night are drawn at 440 x 956 pt, like the mockup, and rendered at 3x.
  { src: 'tools/art/frutiger-aero.html', out: 'assets/wallpapers/frutiger-aero.png', w: 440, h: 956, scale: 3 },
  { src: 'tools/art/frutiger-aero.html', out: 'assets/wallpapers/widget/frutiger-aero-widget.png', w: 440, h: 956, scale: 1.5 },
  { src: 'tools/art/aero-night.html', out: 'assets/wallpapers/aero-night.png', w: 440, h: 956, scale: 3 },
  { src: 'tools/art/aero-night.html', out: 'assets/wallpapers/widget/aero-night-widget.png', w: 440, h: 956, scale: 1.5 },
  { src: 'tools/art/icon.html', out: 'assets/images/icon.png', w: 1024, h: 1024 },
  { src: 'tools/art/mixtape-cover.html', out: 'assets/images/mixtape-default-cover.png', w: 234, h: 234 },
  { src: 'tools/art/splash.html', out: 'assets/images/splash-icon.png', w: 400, h: 400, transparent: true },
];

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
for (const job of jobs) {
  const page = await browser.newPage({
    viewport: { width: job.w, height: job.h },
    deviceScaleFactor: job.scale ?? 1,
  });
  await page.goto(pathToFileURL(resolve(root, job.src)).href);
  const out = resolve(root, job.out);
  mkdirSync(dirname(out), { recursive: true });
  await page.screenshot({ path: out, omitBackground: !!job.transparent });
  await page.close();
  console.log('wrote', job.out);
}
await browser.close();
