// Renders TikTok posts (1080 × 1920 PNG) from the app's own export screen, via the web preview.
//
//   npx expo start --web --port 8089        (in another terminal)
//   CHROMIUM_PATH=/path/to/chromium node tools/render-posts.mjs <out-dir> <theme-id>:<layout>:<hook#|screen> ...
//
// e.g. `frutiger-aero:0:0` is layout 0 with the first hook; `aero-night:2:screen` is Full screen mode.
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';

const [out = 'renders', ...jobs] = process.argv.slice(2);
const base = process.env.BASE_URL ?? 'http://localhost:8089';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
// A 408-wide window gives a 360 pt post on the export screen; 3× makes it 1080 × 1920.
const page = await browser.newPage({
  viewport: { width: 408, height: 1000 },
  deviceScaleFactor: 3,
  timezoneId: process.env.TZ_ID ?? 'America/Los_Angeles',
});
page.on('pageerror', (e) => console.error(e.message));

for (const job of jobs) {
  const [id, layout, hook] = job.split(':');
  await page.goto(`${base}/export/${id}?layout=${layout}`, { waitUntil: 'networkidle', timeout: 180000 });
  await page.waitForTimeout(800);
  if (hook === 'screen') {
    await page.getByText('Full screen', { exact: true }).click();
  } else {
    await page.locator('[role="button"], div[tabindex]').filter({ hasText: /./ }).first().waitFor();
    const chips = page.locator('div[tabindex="0"]').filter({ hasNotText: /Phone frame|Full screen|Save|Share|Done/ });
    await chips.nth(Number(hook)).click();
  }
  await page.waitForTimeout(1200);
  const post = page.getByTestId('tiktok-post');
  const box = await post.boundingBox();
  const file = join(out, `${id}-layout${layout}-${hook === 'screen' ? 'fullscreen' : `hook${hook}`}.png`);
  await post.screenshot({ path: file });
  console.log(file, `${Math.round(box.width * 3)}×${Math.round(box.height * 3)}`);
}
await browser.close();
