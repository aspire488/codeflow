// Static production build.
//
// CodeFlow is a classic-script app (no bundler, no modules), so `vite build`
// only emitted index.html and silently dropped every <script src>. The build
// must copy the real tree or the artifact is broken.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'dist');

const FILES = [
  'index.html',
  'styles.css',
  'tailwind.js',
  'manifest.json',
  'service-worker.js'
];

const DIRECTORIES = ['data', 'src', 'icons'];

function copyFile(relative) {
  const from = path.join(root, relative);
  const to = path.join(outDir, relative);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDirectory(relative) {
  const from = path.join(root, relative);
  if (!fs.existsSync(from)) return [];
  const copied = [];
  const walk = (currentRelative) => {
    fs.readdirSync(path.join(root, currentRelative), { withFileTypes: true }).forEach((entry) => {
      const child = path.join(currentRelative, entry.name);
      if (entry.isDirectory()) walk(child);
      else {
        copyFile(child);
        copied.push(child);
      }
    });
  };
  walk(relative);
  return copied;
}

fs.rmSync(outDir, { recursive: true, force: true });

FILES.forEach(copyFile);
let copiedScripts = 0;
DIRECTORIES.forEach((directory) => { copiedScripts += copyDirectory(directory).length; });

// Sanity check: fail the build if a referenced script did not land in dist.
const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
const sources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
const missing = sources.filter((source) => !fs.existsSync(path.join(outDir, source)));
if (missing.length) {
  console.error('Build is missing referenced scripts:', missing);
  process.exit(1);
}

console.log(`Static build complete: ${FILES.length} root files, ${copiedScripts} assets, ${sources.length} scripts verified.`);
