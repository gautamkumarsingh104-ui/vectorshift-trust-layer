import { spawn, exec } from 'node:child_process';
import http from 'node:http';

const PORT = 5173;
const URL = `http://127.0.0.1:${PORT}/`;

function isServerUp() {
  return new Promise((resolve) => {
    const req = http.get(URL, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function openBrowser() {
  // Windows: "start" opens the default browser reliably.
  const cmd = process.platform === 'win32' ? `start "" "${URL}"` : `open "${URL}"`;
  exec(cmd, (err) => {
    if (err) {
      console.log(`\nCould not auto-open browser. Open this URL manually:\n  ${URL}\n`);
    } else {
      console.log(`\nOpened browser at ${URL}\n`);
    }
  });
}

async function main() {
  const alreadyRunning = await isServerUp();

  if (alreadyRunning) {
    console.log(`\nDev server already running at ${URL}`);
    openBrowser();
    return;
  }

  console.log(`\nStarting dev server at ${URL} ...\n`);

  const vite = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    { stdio: 'inherit', shell: true }
  );

  let opened = false;

  const poll = setInterval(async () => {
    if (opened) return;
    if (await isServerUp()) {
      opened = true;
      clearInterval(poll);
      openBrowser();
    }
  }, 400);

  vite.on('exit', (code) => {
    clearInterval(poll);
    process.exit(code ?? 0);
  });
}

main();
