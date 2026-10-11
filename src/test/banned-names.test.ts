import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { bannedNames, bannedPatterns } from './bannedNames'

// Binary or generated files we never read for names.
const SKIP = /\.(png|ico|jpg|jpeg|gif|webp|woff2?|ttf|svg)$|pnpm-lock\.yaml$/

const repoRoot = process.cwd()
const files = execSync('git ls-files', { cwd: repoRoot, encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter(f => !SKIP.test(f))

describe('no employer or client names in public source', () => {
  it.each(files)('%s is free of banned names', file => {
    const content = readFileSync(`${repoRoot}/${file}`, 'utf8')
    for (const pattern of bannedPatterns) {
      expect(content, `${pattern} matched in ${file}`).not.toMatch(pattern)
    }
  })
})

// Regression for the exact shape that leaked (PRODUCT.md:54,
// "..._Engineer_<Name>.docx"): the name is flanked by "_" and ".", both of
// which "\b" treats as a boundary only on one side (underscore is a word
// char), so a "\b...\b" matcher missed it. Build the line from the encoded
// list — no literal — and never print it (a bare .toBe keeps the name out of
// any failure message).
describe('guard catches a name wedged between "_" and "." (the PRODUCT.md shape)', () => {
  it.each(bannedNames.map((_, i) => i))('encoded name #%i is caught', i => {
    const line = `Resume/Visweshwaran_Senior_Staff_Software_Engineer_${bannedNames[i]}.docx`
    expect(bannedPatterns[i].test(line)).toBe(true)
  })
})
