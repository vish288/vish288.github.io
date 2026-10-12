// Round-trip + WCAG contrast check for the D (Manifest Ledger) palette.
// Run: node scripts/contrast.mjs
// No deps. Prints the HSL->hex round-trip for --primary and a contrast table.

function hslToRgb(h, s, l) {
  s /= 100
  l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return [f(0), f(8), f(4)].map(v => Math.round(v * 255))
}
const toHex = ([r, g, b]) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
function hexToRgb(hex) {
  const n = hex.replace('#', '')
  return [0, 2, 4].map(i => parseInt(n.slice(i, i + 2), 16))
}
function lum([r, g, b]) {
  const c = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
function ratio(a, b) {
  const la = lum(hexToRgb(a)),
    lb = lum(hexToRgb(b))
  const r = (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
  return Math.round(r * 100) / 100
}
// Composite an fg at alpha over an opaque bg → the effective opaque colour.
// Models Tailwind's `/NN` opacity utilities so a translucent label/fill can be
// contrast-checked as the colour that actually paints.
function over(fg, alpha, bg) {
  const F = hexToRgb(fg),
    B = hexToRgb(bg)
  return toHex([0, 1, 2].map(i => Math.round(F[i] * alpha + B[i] * (1 - alpha))))
}

// ── 1. Find an HSL triplet that round-trips to #847492 ──
const TARGET = '#847492'
let best = null
for (let h = 268; h <= 278; h += 0.1) {
  for (let s = 10; s <= 15; s += 0.1) {
    for (let l = 49; l <= 53; l += 0.1) {
      const hex = toHex(hslToRgb(h, s, l))
      if (hex === TARGET) {
        const err = Math.abs(h - 272) + Math.abs(s - 12.3) + Math.abs(l - 51.4)
        if (!best || err < best.err)
          best = { h: +h.toFixed(1), s: +s.toFixed(1), l: +l.toFixed(1), hex, err }
      }
    }
  }
}
console.log('PRIMARY round-trip to', TARGET)
console.log(`  hsl(272 12% 51%) ->`, toHex(hslToRgb(272, 12, 51)), '(critique says wrong)')
console.log(`  chosen hsl(${best.h} ${best.s}% ${best.l}%) ->`, best.hex, best.hex === TARGET ? 'OK' : 'FAIL')

// ── 2. Contrast table for every text pair that ships ──
const C = {
  paper: '#f9f8f6',
  ink: '#14181f',
  dark: '#0b0c0f',
  darkInk: '#e7ebef',
  primary: '#847492',
  primaryHover: '#8d7e9a', // --primary-hover (272 12.3% 55%)
  destructiveDark: '#e25a5a', // dark --destructive (0 70% 62%)
  destructiveFg: '#0c0e12', // dark --destructive-foreground (224 20% 6%)
  inkLabel: '#0b0c0f',
  linkLight: '#5d5167',
  linkDark: '#aea4b7',
  mutedLight: '#575e6b',
  mutedDark: '#98a1ae',
  washLight: '#ebe8ed',
  washDark: '#1a1820',
  code: '#15141a',
  codeFg: '#e7ebef',
  codeMuted: '#98a1ae',
  codeLink: '#b8afc0',
  codeLive: '#5ec997',
}
const pairs = [
  ['Body ink on paper (light)', C.ink, C.paper, 4.5],
  ['Body ink on dark', C.darkInk, C.dark, 4.5],
  ['Primary numeral 64px on paper (large)', C.primary, C.paper, 3],
  ['Primary numeral on wash hover (large)', C.primary, C.washLight, 3],
  ['Primary numeral on dark (large)', C.primary, C.dark, 3],
  ['Ink label on primary fill (button)', C.inkLabel, C.primary, 4.5],
  ['Link text light #5d5167 on paper', C.linkLight, C.paper, 4.5],
  ['Link text light on wash', C.linkLight, C.washLight, 4.5],
  ['Link text dark #aea4b7 on dark', C.linkDark, C.dark, 4.5],
  ['Link text dark on wash', C.linkDark, C.washDark, 4.5],
  ['Muted light #575e6b on paper', C.mutedLight, C.paper, 4.5],
  ['Muted dark #98a1ae on dark', C.mutedDark, C.dark, 4.5],
  ['Code fg on code surface', C.codeFg, C.code, 4.5],
  ['Code muted (keys) on code surface', C.codeMuted, C.code, 4.5],
  ['Code builds link #b8afc0 on code surface', C.codeLink, C.code, 4.5],
  ['Code live marker #5ec997 on code surface', C.codeLive, C.code, 3],
  ['Focus ring #847492 on paper', C.primary, C.paper, 3],
  ['Focus ring #847492 on dark', C.primary, C.dark, 3],
  // Review findings D (each failed before the fix — see the broken ratio in the
  // comment; the shipping value now passes):
  // 1. Repositories active-filter count: text-primary-foreground/70 on the
  //    primary fill measured 3.22 (ink at 70% opacity); full ink restores 4.56.
  ['Active-filter count: ink label on primary fill (full, not /70)', C.inkLabel, C.primary, 4.5],
  // 2. Dark --destructive used two ways: as text on the dark bg, and as a fill
  //    carrying the ink foreground. The regressed 0 63% 51% gave 3.94 / 4.14;
  //    0 70% 62% with a 224 20% 6% foreground restores both.
  ['Dark text-destructive on dark bg', C.destructiveDark, C.dark, 4.5],
  ['Dark destructive-foreground on destructive fill', C.destructiveFg, C.destructiveDark, 4.5],
  // 3. MCP install button hover:bg-primary/90 dropped the ink label to 3.91 on
  //    the dark surface; hover:bg-primary-hover (#8d7e9a solid) gives 5.2.
  ['Install button hover: ink label on primary-hover', C.inkLabel, C.primaryHover, 4.5],
]
console.log('\nPAIR | ratio | floor | pass')
let fail = 0
for (const [name, fg, bg, floor] of pairs) {
  const r = ratio(fg, bg)
  const ok = r >= floor
  if (!ok) fail++
  console.log(`${name} | ${r} | ${floor} | ${ok ? 'PASS' : 'FAIL'}`)
}
console.log(fail ? `\n${fail} FAILURES` : '\nAll pass')

process.exit(fail ? 1 : 0)
