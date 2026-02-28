#!/usr/bin/env node
/**
 * Capture screenshots of the app using Playwright.
 * Run: npm run build && node scripts/capture-screenshots.mjs
 * Or with dev server: npm run dev (in another terminal) && node scripts/capture-screenshots.mjs
 */

import { chromium } from 'playwright';
import { createServer } from 'http';
import { createReadStream, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'out');
const screenshotsDir = join(root, 'screenshots');

const PORT = 3789;
const BASE_URL = `http://localhost:${PORT}`;

async function main() {
  const server = createServer((req, res) => {
    let urlPath = req.url.split('?')[0] || '/';
    if (urlPath === '/') urlPath = '/index.html';
    else if (!urlPath.includes('.')) urlPath = `${urlPath}.html`;
    let filePath = join(outDir, urlPath);
    if (!filePath.startsWith(outDir)) filePath = join(outDir, 'index.html');
    if (!existsSync(filePath)) {
      res.writeHead(404);
      res.end();
      return;
    }
    const ext = filePath.split('.').pop();
    const types = { html: 'text/html', js: 'application/javascript', css: 'text/css', json: 'application/json', png: 'image/png', ico: 'image/x-icon', txt: 'text/plain' };
    res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
    createReadStream(filePath).pipe(res);
  });

  server.listen(PORT, () => console.log(`Serving at ${BASE_URL}`));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const captures = [
    { name: '01-rendering-approaches', url: `${BASE_URL}/?demo=rendering` },
    { name: '02-contenteditable', url: `${BASE_URL}/?demo=contenteditable` },
    { name: '03-selection-inspector', url: `${BASE_URL}/?demo=selection` },
    { name: '04-state-model', url: `${BASE_URL}/?demo=state` },
    { name: '05-update-loop', url: `${BASE_URL}/?demo=update-loop` },
    { name: '06-node-structures', url: `${BASE_URL}/?demo=node-structures` },
    { name: '07-prosemirror', url: `${BASE_URL}/prosemirror` },
  ];

  for (const { name, url } of captures) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(500);
      const path = join(screenshotsDir, `${name}.png`);
      await page.screenshot({ path, fullPage: false });
      console.log(`Captured ${name}.png`);
    } catch (e) {
      console.error(`Failed ${name}:`, e.message);
    }
  }

  await browser.close();
  server.close();
  console.log('Done.');
}

main().catch(console.error);
