const { spawn } = require('node:child_process');
const { randomUUID } = require('node:crypto');

const baseURL = 'http://127.0.0.1:4179';
const token = randomUUID();

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async function globalSetup() {
  const server = spawn(process.execPath, ['tests/static-server.cjs', '4179'], {
    cwd: process.cwd(),
    env: { ...process.env, CODEFLOW_TEST_SERVER_TOKEN: token },
    stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
    windowsHide: true
  });
  let startupError;
  server.stderr.setEncoding('utf8');
  server.stderr.on('data', (chunk) => { startupError = (startupError || '') + chunk; });

  let ready = false;
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline && !ready) {
    if (server.exitCode !== null) break;
    try {
      const response = await fetch(`${baseURL}/__codeflow_test_health`);
      ready = response.ok && response.headers.get('x-codeflow-test-server') === token;
      if (response.ok && !ready) break;
    } catch {
      // The server has not bound its port yet.
    }
    if (!ready) await delay(100);
  }

  if (!ready) {
    server.kill();
    await new Promise((resolve) => {
      if (server.exitCode !== null) return resolve();
      server.once('exit', resolve);
    });
    throw new Error(`CodeFlow test server did not become ready on port 4179.${startupError ? ` ${startupError}` : ''}`);
  }

  return async function globalTeardown() {
    if (server.exitCode !== null) return;
    const exited = new Promise((resolve) => server.once('exit', resolve));
    if (server.connected) server.send({ type: 'shutdown' });
    const graceful = await Promise.race([exited.then(() => true), delay(5000).then(() => false)]);
    if (graceful) return;

    server.kill('SIGTERM');
    const forced = await Promise.race([exited.then(() => true), delay(5000).then(() => false)]);
    if (!forced) throw new Error(`CodeFlow test server process ${server.pid} did not exit during teardown.`);
  };
};
