#!/usr/bin/env node
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';
const tmpDir = path.join(process.cwd(), '.vercel-tmp');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
if (!isWindows) { try { fs.chmodSync(tmpDir, 0o700); } catch (e) {} }
const LOG_FILE = path.join(tmpDir, 'login.log');

function log(msg) { console.error(msg); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function checkLoggedIn() {
  const r = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
  const out = (r.stdout || '').trim();
  if (r.status === 0 && out && !out.includes('Error') && !out.includes('not logged in')) {
    log(`Logged in as: ${out}`);
    return true;
  }
  return false;
}

function startBackgroundLogin() {
  const logStream = fs.openSync(LOG_FILE, 'w');
  const child = spawn('vercel', ['login'], {
    detached: true,
    stdio: ['ignore', logStream, logStream],
    shell: isWindows
  });
  child.unref();
  log(`Background login PID: ${child.pid}`);
  fs.writeFileSync(LOG_FILE + '.pid', String(child.pid));
  return child.pid;
}

function openBrowser(url) {
  const urlPattern = /^https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+$/;
  if (!urlPattern.test(url)) {
    log('URL pattern check failed: ' + url);
    return;
  }
  const platform = os.platform();
  try {
    if (platform === 'darwin') spawnSync('open', [url], { stdio: 'ignore' });
    else if (platform === 'win32') spawnSync('powershell', ['-Command', `Start-Process '${url}'`], { stdio: 'ignore', windowsHide: true });
    else spawnSync('xdg-open', [url], { stdio: 'ignore' });
    log('Browser opened');
  } catch (e) { log('Open browser failed: ' + e.message); }
}

async function waitForAuthUrl() {
  for (let i = 0; i < 40; i++) {
    await sleep(500);
    try {
      if (fs.existsSync(LOG_FILE)) {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const m = content.match(/https:\/\/vercel\.com\/oauth\/device\?user_code=[A-Z0-9-]+(?=\s|$)/);
        if (m) return m[0];
      }
    } catch (e) {}
  }
  return null;
}

async function main() {
  log('========================================');
  log('Vercel Login');
  log('========================================');
  if (checkLoggedIn()) {
    console.log(JSON.stringify({ status: 'already_logged_in' }));
    process.exit(0);
  }
  const pid = startBackgroundLogin();
  log('Waiting for auth URL...');
  const url = await waitForAuthUrl();
  if (url) {
    log('Auth URL: ' + url);
    openBrowser(url);
    console.log(JSON.stringify({ status: 'needs_auth', auth_url: url, log_file: LOG_FILE }));
  } else {
    log('Failed to get auth URL');
    try { log('Log: ' + fs.readFileSync(LOG_FILE, 'utf8')); } catch (e) {}
    process.exit(1);
  }
}
main();
