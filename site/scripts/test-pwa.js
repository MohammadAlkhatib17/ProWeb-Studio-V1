/*
 Minimal PWA integration check for CI.
 - Builds the app (outside this script via npm script)
 - Assumes `next start` is running on localhost:3000
 - Verifies service worker registration/controller across key routes
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
      const req = http.request(url, { method: 'GET' }, (res) => {
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
  const isCI = process.env.CI === 'true' || process.env.CI === '1';
  const projectRoot = path.resolve(__dirname, '..');

  // Ensure production env for SW registration
  process.env.NODE_ENV = 'production';

  const port = process.env.PWA_TEST_PORT ? Number(process.env.PWA_TEST_PORT) : await findFreePort(3000, 3020);
  // Prefer standalone server when available to avoid Next CLI warnings
  const standaloneServer = path.join(projectRoot, '.next', 'standalone', 'server.js');
  let server;
  if (fs.existsSync(standaloneServer)) {
    server = spawn(process.execPath, [standaloneServer], {
      cwd: projectRoot,
      env: { ...process.env, NODE_ENV: 'production', PORT: String(port) },
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } else {
    const nextBin = path.join(projectRoot, 'node_modules', '.bin', 'next');
    server = spawn(nextBin, ['start', '-p', String(port)], {
      cwd: projectRoot,
      env: { ...process.env, NODE_ENV: 'production' },
      stdio: ['ignore', 'pipe', 'pipe']
    });
  }

  server.stdout.on('data', (d) => process.stdout.write(d));
  server.stderr.on('data', (d) => process.stderr.write(d));

  try {
    await waitForServer(`http://localhost:${port}/`);
  } catch (e) {
    server.kill('SIGTERM');
    throw e;
  }

  // Use built-in Chromium via Puppeteer
  const puppeteer = require('puppeteer');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();

  const routes = ['/', '/diensten', '/contact'];
  const results = [];

  // Enable service worker debugging domain
  const client = await page.target().createCDPSession();
  await client.send('Network.enable');
  await client.send('ServiceWorker.enable');

  for (const route of routes) {
    await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle2' });
    // Wait for SW controller
    const hasController = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      // Wait for readiness/controller after load
      await navigator.serviceWorker.ready;
      if (navigator.serviceWorker.controller) return true;
      return new Promise((resolve) => {
        navigator.serviceWorker.addEventListener('controllerchange', () => resolve(true), { once: true });
        setTimeout(() => resolve(!!navigator.serviceWorker.controller), 5000);
      });
    });

    results.push({ route, hasController });
  }

  await browser.close();
  server.kill('SIGTERM');

  const failures = results.filter(r => !r.hasController);
  if (failures.length) {
    console.error('PWA check failed for routes:', failures.map(f => f.route).join(', '));
    process.exit(1);
  }

  console.log('PWA check passed for routes:', results.map(r => r.route).join(', '));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
