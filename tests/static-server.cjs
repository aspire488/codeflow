// Minimal static server for Playwright. Serves the repository root.
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');

const root = path.resolve(__dirname, '..');
const port = Number(process.argv[2] || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

// Send the production CSP so the e2e suite exercises it.
const csp = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8')).headers
  .flatMap((entry) => entry.headers)
  .find((header) => header.key === 'Content-Security-Policy').value;

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const filePath = path.join(root, relative);

  if (!filePath.startsWith(root)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      // SPA fallback so direct routes still load the shell.
      fs.readFile(path.join(root, 'index.html'), (fallbackError, html) => {
        if (fallbackError) res.writeHead(404).end('Not found');
        else res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Content-Security-Policy': csp }).end(html);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream', 'Content-Security-Policy': csp });
    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`CodeFlow static server on http://127.0.0.1:${port}`);
});
