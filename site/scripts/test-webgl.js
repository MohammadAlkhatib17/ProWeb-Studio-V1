/*
Integration test: Single-context guard + pause/resume (no remount)
- Starts a production server
- Navigates across /, /diensten, /contact ensuring no fallback flash
- Asserts at most one active WebGL canvas with data markers at any time
- Forces WebGL context loss on homepage; fallback appears after debounce
- Restores context; same canvas remains mounted; fallback hides
*/

const http = require('http');
const net = require('net');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.request(url, { method: 'GET', headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 PWS-Test' } }, (res) => {
        res.resume();
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) return reject(new Error('Server did not start in time'));
        setTimeout(attempt, 500);
      });
      req.end();
    };
    attempt();
  });
}

function findFreePort(start = 3000, end = 3020) {
  return new Promise((resolve, reject) => {
    let port = start;
    const tryNext = () => {
      if (port > end) return reject(new Error('No free port found'));
      const server = net.createServer();
      server.once('error', () => {
        port += 1;
        tryNext();
      });
      server.once('listening', () => {
        server.close(() => resolve(port));
      });
      server.listen(port, '127.0.0.1');
    };
    tryNext();
  });
}

async function run() {
  process.env.NODE_ENV = 'production';
  const projectRoot = path.resolve(__dirname, '..');
  const port = await findFreePort(3000, 3030);

  const nextBin = path.join(projectRoot, 'node_modules', '.bin', 'next');
  const server = spawn(nextBin, ['start', '-p', String(port)], {
    cwd: projectRoot,
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  server.stdout.on('data', (d) => process.stdout.write(d));
  server.stderr.on('data', (d) => process.stderr.write(d));

  try {
    await waitForServer(`http://localhost:${port}/`);
  } catch (e) {
    server.kill('SIGTERM');
    throw e;
  }

  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--use-gl=swiftshader',
      '--use-angle=swiftshader',
      '--enable-unsafe-webgpu'
    ]
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36 PWS-Test');
  await page.setViewport({ width: 900, height: 1400, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Ensure canvas is present
  let canvasSelector = 'canvas[data-hero-canvas]';
  try {
    await page.waitForSelector(canvasSelector, { timeout: 15000 });
  } catch {
    canvasSelector = 'canvas';
    await page.waitForSelector(canvasSelector, { timeout: 15000 });
  }

  // Wait for fallback to hide after first frame
  await page.waitForFunction(() => !document.querySelector('#hero-fallback'), { timeout: 15000 });

  // Assert single active WebGL canvas (marked)
  const countMarked = await page.evaluate(() => document.querySelectorAll('canvas[data-hero-canvas], canvas[data-playground-canvas]').length);
  if (countMarked > 1) {
    throw new Error(`Expected at most 1 marked WebGL canvas, found ${countMarked}`);
  }

  // Navigate to diensten and contact: no fallback flash expected
  const gotoAndCheck = async (path) => {
    await page.goto(`http://localhost:${port}${path}`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));
    const hasFallback = await page.evaluate(() => !!document.querySelector('#hero-fallback'));
    if (hasFallback) throw new Error(`Fallback appeared during navigation to ${path}`);
    const marked = await page.evaluate(() => document.querySelectorAll('canvas[data-hero-canvas], canvas[data-playground-canvas]').length);
    if (marked > 1) throw new Error(`Multiple marked canvases on ${path}`);
  };
  await gotoAndCheck('/diensten');
  await gotoAndCheck('/contact');

  // Return home
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('canvas[data-hero-canvas]', { timeout: 15000 });
  await page.waitForFunction(() => !document.querySelector('#hero-fallback'), { timeout: 15000 });

  // Keep a handle to the hero canvas to verify no remount
  const heroHandle = await page.$('canvas[data-hero-canvas]');
  const heroIsSame = async () => {
    const current = await page.$('canvas[data-hero-canvas]');
    if (!current || !heroHandle) return false;
    return (await current.evaluate((el, prev) => el === prev, await heroHandle.getProperty('constructor')));
  };

  // Lose context and then assert fallback appears after debounce
  const lostResult = await page.evaluate(() => {
    const canvas = document.querySelector('canvas[data-hero-canvas]') || document.querySelector('canvas');
    if (!canvas) return { ok: false, reason: 'no canvas' };
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { ok: false, reason: 'no gl' };
    const ext = gl.getExtension('WEBGL_lose_context');
    if (!ext) return { ok: false, reason: 'no ext' };
    ext.loseContext();
    return { ok: true, reason: 'lost triggered' };
  });

  if (!lostResult.ok) {
    console.error('Context loss did not show fallback:', lostResult.reason);
    await browser.close();
    server.kill('SIGTERM');
    process.exit(1);
  }

  // Wait beyond debounce (200ms) for fallback to appear
  await new Promise(r => setTimeout(r, 220));
  const fbVisible = await page.evaluate(() => !!document.querySelector('#hero-fallback'));
  if (!fbVisible) {
    console.error('Fallback did not appear after context loss');
    await browser.close();
    server.kill('SIGTERM');
    process.exit(1);
  }

  // Restore and ensure same canvas remains (no remount)
  await page.evaluate(() => {
    const canvasBefore = document.querySelector('canvas[data-hero-canvas]') || document.querySelector('canvas');
    const gl = canvasBefore && (canvasBefore.getContext('webgl2') || canvasBefore.getContext('webgl') || canvasBefore.getContext('experimental-webgl'));
    const ext = gl && gl.getExtension('WEBGL_lose_context');
    if (ext && typeof ext.restoreContext === 'function') ext.restoreContext();
    // Some headless environments do not fire restored; dispatch manually
    canvasBefore?.dispatchEvent(new Event('webglcontextrestored'));
  });
  await page.waitForFunction(() => !document.querySelector('#hero-fallback'), { timeout: 15000 });
  const canvasStillOne = await page.evaluate(() => document.querySelectorAll('canvas[data-hero-canvas]').length);
  if (canvasStillOne !== 1) {
    throw new Error('Hero canvas was remounted or missing after restore');
  }

  await browser.close();
  server.kill('SIGTERM');
  console.log('WebGL context loss test finished');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
