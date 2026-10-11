import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { bannedPatterns } from './bannedNames'

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
