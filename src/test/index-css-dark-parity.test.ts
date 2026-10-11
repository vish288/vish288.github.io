import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// The dark tokens live twice: in `.dark` (the explicit toggle) and in
// `@media (prefers-color-scheme: dark) { :root:not(.light) { … } }` (the no-JS
// first paint). They must stay byte-for-byte identical or the two paths drift.
const css = readFileSync(`${process.cwd()}/src/index.css`, 'utf8')

function blockAfter(marker: string): string {
  const start = css.indexOf(marker)
  if (start === -1) throw new Error(`marker not found: ${marker}`)
  const open = css.indexOf('{', start)
  let depth = 0
  let i = open
  for (; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}' && --depth === 0) break
  }
  return css.slice(open + 1, i)
}

function customProps(block: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const m of block.matchAll(/(--[\w-]+):\s*([^;]+);/g)) out[m[1]] = m[2].trim()
  return out
}

describe('dark tokens are identical in .dark and the prefers-color-scheme block', () => {
  const explicit = customProps(blockAfter('.dark {'))
  const media = customProps(blockAfter(':root:not(.light)'))

  it('both define the same set of custom properties', () => {
    expect(Object.keys(media).sort()).toEqual(Object.keys(explicit).sort())
  })

  it('every value matches', () => {
    expect(media).toEqual(explicit)
  })

  it('actually carries the dark tokens (guards against an empty match)', () => {
    expect(explicit['--background']).toBe('224 20% 6%')
    expect(Object.keys(explicit).length).toBeGreaterThan(15)
  })
})
