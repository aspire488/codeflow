// Structural regression tests: these catch the failure classes that made the
// previous build unusable (missing script paths, screen-id drift, duplicate
// globals shadowing each other, PWA pointing at files that do not exist).
const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync, readdirSync, statSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

function walk(dir, files = []) {
  readdirSync(path.join(root, dir)).forEach((entry) => {
    const relative = path.join(dir, entry);
    const stats = statSync(path.join(root, relative));
    if (stats.isDirectory()) walk(relative, files);
    else if (entry.endsWith('.js') && !entry.endsWith('.test.js')) files.push(relative);
  });
  return files;
}

test('every script referenced by index.html exists', () => {
  const html = read('index.html');
  const sources = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(sources.length > 10, 'expected the shell to load the data, engine and UI layers');
  sources.forEach((source) => {
    assert.equal(existsSync(path.join(root, source)), true, `missing script: ${source}`);
  });
});

test('every route maps to a screen element that exists', () => {
  const html = read('index.html');
  const router = read('src/core/router.js');
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
  const screens = [...router.matchAll(/screen:\s*'([^']+)'/g)].map((match) => match[1]);
  assert.equal(screens.length >= 11, true, 'expected all feature screens to be registered');
  screens.forEach((screenId) => {
    assert.equal(ids.has(screenId), true, `router points at a missing screen: ${screenId}`);
  });
});

test('no global function is declared twice across the browser sources', () => {
  const files = walk('src');
  const seen = new Map();
  const duplicates = [];

  files.forEach((file) => {
    const source = read(file);
    [...source.matchAll(/^function\s+([A-Za-z0-9_$]+)/gm)].forEach((match) => {
      const name = match[1];
      if (seen.has(name)) duplicates.push(`${name} (${seen.get(name)} and ${file})`);
      else seen.set(name, file);
    });
  });

  assert.deepEqual(duplicates, [], `duplicate globals would shadow each other: ${duplicates.join(', ')}`);
});

test('service worker precaches real files only', () => {
  const worker = read('service-worker.js');
  const assets = [...worker.matchAll(/'(\/[^']+\.[a-z0-9]+)'/g)].map((match) => match[1]);
  assert.ok(assets.length > 10, 'expected a real precache list');
  assets.forEach((asset) => {
    const file = asset.replace(/^\//, '');
    assert.equal(existsSync(path.join(root, file)), true, `precached file does not exist: ${asset}`);
  });
});

test('manifest icons exist and the manifest parses', () => {
  const manifest = JSON.parse(read('manifest.json'));
  assert.equal(manifest.display, 'standalone');
  manifest.icons.forEach((icon) => {
    assert.equal(icon.src.startsWith('data:'), false, 'icons must be real files for install prompts');
    assert.equal(existsSync(path.join(root, icon.src)), true, `missing icon: ${icon.src}`);
  });
});

test('package scripts expose unit and browser test workflows', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.match(pkg.scripts.test, /node --test/);
  assert.ok(pkg.scripts['test:e2e']);
  assert.ok(pkg.devDependencies['@playwright/test']);
});
