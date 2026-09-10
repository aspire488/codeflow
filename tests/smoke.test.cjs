const test = require('node:test')
const assert = require('node:assert/strict')
const { existsSync, readFileSync } = require('node:fs')

test('repository contains the browser entry point and architecture visual', () => {
  assert.equal(existsSync('index.html'), true)
  assert.equal(existsSync('docs/codeflow-architecture.svg'), true)
})

test('package exposes deterministic test and production build commands', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
  assert.equal(pkg.scripts.test, 'node --test tests/smoke.test.cjs')
  assert.equal(pkg.scripts.build, 'vite build')
})

test('README documents the execution-engine prototype boundary', () => {
  assert.match(readFileSync('README.md', 'utf8'), /not a general-purpose interpreter/i)
})
