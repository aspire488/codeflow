import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')

describe('CodeFlow release smoke checks', () => {
  it('keeps the browser entry point and architecture visual in the repository', () => {
    expect(existsSync('index.html')).toBe(true)
    expect(existsSync('docs/codeflow-architecture.svg')).toBe(true)
  })

  it('declares the expected production build command', () => {
    const pkg = JSON.parse(read('package.json'))
    expect(pkg.scripts.test).toBe('vitest run')
    expect(pkg.scripts.build).toBe('vite build')
  })

  it('documents the prototype boundary', () => {
    expect(read('README.md')).toMatch(/not a general-purpose interpreter/i)
  })
})
