---
name: vish288.github.io
description: Personal site for Visweshwaran S (Vish), with a live repository list and an MCP install gateway.
colors:
  primary: 'hsl(272 12.3% 51.4%)'
  primary-foreground: 'hsl(225 15.4% 5.1%)'
  primary-hover: 'hsl(272 12.3% 55%)'
  background: 'hsl(40 20% 97.1%)'
  foreground: 'hsl(218.2 21.6% 10%)'
  card: 'hsl(40 20% 97.1%)'
  secondary: 'hsl(276 12.2% 92%)'
  muted: 'hsl(276 12.2% 92%)'
  muted-foreground: 'hsl(219 10.3% 38%)'
  accent: 'hsl(276 12.2% 92%)'
  border: 'hsl(273.3 11.7% 84.9%)'
  input: 'hsl(273.3 11.7% 84.9%)'
  ring: 'hsl(272 12.3% 51.4%)'
  destructive: 'hsl(0 72% 42%)'
  link: 'hsl(272.7 12% 36.1%)'
  code: 'hsl(250 13% 9%)'
  code-foreground: 'hsl(210 20% 92.2%)'
  code-muted: 'hsl(215.5 12% 63.9%)'
  code-accent: 'hsl(152 49.8% 57.8%)'
  code-link: 'hsl(271.8 11.9% 72%)'
  code-border: 'hsl(255 10% 20%)'
  dark-primary: 'hsl(272 12.3% 51.4%)'
  dark-primary-foreground: 'hsl(225 15.4% 5.1%)'
  dark-primary-hover: 'hsl(272 12.3% 55%)'
  dark-background: 'hsl(225 15.4% 5.1%)'
  dark-foreground: 'hsl(210 20% 92.2%)'
  dark-card: 'hsl(250 13% 9%)'
  dark-secondary: 'hsl(255 14.3% 11%)'
  dark-muted: 'hsl(255 14.3% 11%)'
  dark-muted-foreground: 'hsl(215.5 12% 63.9%)'
  dark-accent: 'hsl(255 14.3% 11%)'
  dark-border: 'hsl(260 10% 16%)'
  dark-destructive: 'hsl(0 63% 51%)'
  dark-link: 'hsl(271.6 11.7% 68%)'
  dark-code-border: 'hsl(255 10% 30%)'
typography:
  display:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
    fontSize: '3rem'
    fontSizeSm: '3.75rem'
    fontWeight: 600
    lineHeight: 1
  headline:
    fontSize: '1.875rem'
    fontSizeSm: '2.25rem'
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: '-0.025em'
  title:
    fontFamily: "'JetBrains Mono Variable' index + system sans heading"
    fontSize: '1.5rem'
    fontSizeSm: '1.875rem'
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: '-0.025em'
  lead:
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.556
  body:
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.625
  body-sm:
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontSize: '0.75rem'
    fontWeight: 600
    lineHeight: 1.333
    textTransform: 'uppercase'
    letterSpacing: '0.1em'
  mono:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
    fontSize: '0.875rem'
    lineHeight: 1.429
rounded:
  sm: '4px'
  md: '4px'
  lg: '4px'
  DEFAULT: '4px'
  full: '9999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '12px'
  lg: '16px'
  xl: '24px'
  2xl: '32px'
  3xl: '40px'
  section: '64px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.md}'
    padding: '0 16px'
    height: '36px'
    shadow: none
  button-primary-lg:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.md}'
    height: '40px'
    shadow: none
  button-outline:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    border: '1px solid {colors.border}'
    rounded: '{rounded.md}'
    shadow: none
  button-ghost-hover:
    backgroundColor: '{colors.accent}'
  badge-outline:
    textColor: '{colors.foreground}'
    border: '1px solid {colors.border}'
    rounded: '{rounded.full}'
    padding: '0 6px'
  tile:
    backgroundColor: '{colors.muted}/30'
    border: '1px solid {colors.border}'
    rounded: '{rounded.md}'
    padding: '20px'
    shadow: none
  segmented-active:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.md}'
    padding: '6px 12px'
  code-inline:
    backgroundColor: '{colors.muted}'
    typography: '{typography.mono}'
    rounded: '{rounded.sm}'
    padding: '2px 6px'
  code-surface:
    backgroundColor: '{colors.code}'
    textColor: '{colors.code-foreground}'
    border: '2px solid {colors.code-border}'
    rounded: '{rounded.md}'
    padding: '16px'
    typography: '{typography.mono}'
    theme: 'dark in both themes'
  modal:
    backgroundColor: '{colors.background}'
    border: '2px solid {colors.border}'
    rounded: '{rounded.md}'
    padding: '32px'
    width: '600px'
    scrim: 'black/70 + 4px blur'
    shadow: none
---

# Design System: vish288.github.io

## Overview

**Creative North Star: "The Manifest Ledger"**

The site reads like a package the visitor can inspect: a manifest block at the top, a ruled proof strip of numbers under it, and numbered sections that run like a ledger. One muted violet carries every interactive and brand signal; one green exists, and only inside the code surface, to mark what is published and live. Everything else is ink on paper (or ink on near-black), separated by borders, never by shadow.

Density is moderate. Long-form content sits in a single 1024px column (`max-w-5xl`) with generous section breaks (56 to 64px), while tool surfaces (repository list, MCP gateway) tighten to 4 to 12px gaps so many items scan at once. Light and dark are equal citizens with their own tuned values, not an inversion of each other, and a system setting follows the OS.

The build is shadcn/ui on Tailwind 4: HSL custom properties on `:root` and `.dark`, consumed through `hsl(var(--token))`. That pipeline is the source of truth; new colors go in `src/index.css` as HSL triplets in both themes. Every shipped text pairing is measured by `scripts/contrast.mjs`, which also verifies the brand round-trips exactly to its hex.

**Key Characteristics:**

- One brand hue (muted violet `#847492`) on neutral ink, in both themes; green appears only inside the code surface.
- Flat, bordered surfaces; no shadows anywhere. Separation is by 1px borders, with 2px borders on the two heavy surfaces (code surface and modal).
- A single self-hosted mono face (JetBrains Mono) is the display voice; body copy is the system sans. Hierarchy comes from the mono/sans contrast plus size and weight.
- Every interactive element has a visible focus ring (`--ring` equals `--primary`) and a 44px touch target on coarse pointers.
- Motion is short colour fades; the theme transition is gated on both `prefers-reduced-motion` and a post-first-paint `html.theme-ready` class, so a dark load never flashes up from light.

## Colors

A near-neutral ink palette carrying a single muted-violet brand, tuned separately for light and dark. Ratios below are from `scripts/contrast.mjs`.

### Brand

- **Brand Violet** `#847492` (`--primary`, HSL `272 12.3% 51.4%`): the one brand hue, identical in both themes. It round-trips exactly to its hex — the naive `hsl(272 12% 51%)` renders `#837391`, so the fractional triplet is load-bearing and asserted by the script. Used for filled buttons, the active nav item, the active segmented filter, the focus ring (`--ring` equals `--primary`), the proof numerals (48 to 60px), and list markers (`marker:text-primary/60`). As large text / UI boundary it clears 3:1: 4.04 on paper, 4.56 on near-black.
- **Ink label** `#0b0c0f` (`--primary-foreground`): the label colour on every brand fill — always ink, never white. White on the brand is 4.29 and fails AA (recorded in the token comment); ink on the brand is **4.56** and passes. This is why primary buttons, the active nav pill and the active filter carry near-black labels, not white.
- **Brand Violet, hover** `#8d7e9a` (`--primary-hover`, HSL `272 12.3% 55%`): a lighter solid hover fill for brand buttons, same hue. (Some controls instead hover at `bg-primary/90`.) The ink label clears AA on it in both themes.

### Link

- **Link Violet** (`--link`): dedicated small-text link colour, because the brand fails AA at small sizes. Light `#5d5167` reaches **6.97** on paper (6.09 on wash); dark `#aea4b7` reaches **8.19** on near-black (7.36 on wash). Every eyebrow and every small inline link uses `text-link`, underlined where it is a link.

### Neutral

- **Paper** `#f9f8f6` (`background`, light) and **Near-Black** `#0b0c0f` (`dark-background`): the page ground. The dark ground must be `#0b0c0f` — the brand fails on the lighter `#121117`/`#15141a`, so those are reserved for the code/card surface only.
- **Ink** `#14181f` / `#e7ebef` (`foreground`): headings and primary text. **16.76** on paper, **16.32** on near-black.
- **Muted Ink** `#575e6b` / `#98a1ae` (`muted-foreground`): secondary copy, metadata, captions, markers. **6.15** on paper, **7.49** on near-black.
- **Wash** `#ebe8ed` / `#1a1820` (`muted` = `secondary` = `accent`): tile fills (usually at 30%), inline-code and hover fills. One value serves all three roles in each theme.
- **Hairline** (`border` = `input`): every border and divider; often drawn at 60% alpha (`border-border/60`) for timeline rows.
- **Card** (`card`): light equals Paper; dark equals the code surface `#15141a`. The shadcn Card/popover surface.

### Code Surface Palette

A self-contained dark palette used only inside `CodeSurface` (see Components), dark in both themes.

- **Surface** `#15141a` (`--code`) with **Code Ink** `#e7ebef` (`--code-foreground`, **15.28** on surface).
- **Code Muted** `#98a1ae` (`--code-muted`): manifest keys and punctuation (**7.01**).
- **Code Link** `#b8afc0` (`--code-link`): the lavender builds/contact links inside the manifest, always underlined, **8.66** on surface.
- **Code Border** `255 10% 20%` light / `255 10% 30%` dark (`--code-border`): the 2px frame that keeps the surface visible against the near-black page.
- **Live Green** `#5ec997` (`--code-accent`): the only green in the system, and only here — the "published / live" marker on the manifest (**8.96**).

### Status

- **Signal Red** (`destructive`): the copy-failure message only. `0 72% 42%` light, `0 63% 51%` dark.

### Data

- Repository language dots use GitHub's linguist colours (TypeScript `#3178c6`, Python `#3572A5`, and so on, fallback `#6b7280`). They are third-party data, always paired with the language name in text, and never used as UI colour.

### Named Rules

**One Brand, Green Only In Code.** `#847492` is the single hue that carries interactive or brand meaning everywhere on the page. Green (`#5ec997`) is not a second accent: it exists only inside the code surface, where it means "published and live". Do not introduce green — or any other hue — outside that surface.

**The Ink-Label Rule.** Anything filled with the brand carries the ink label `#0b0c0f`, never white. White on the brand is 4.29 and fails; ink is 4.56 and passes. Small link text never uses the brand at all — it uses `--link`.

**The Both-Themes Rule.** Every colour token exists in `:root` and `.dark` with its own value. The `.dark` block and the `@media (prefers-color-scheme: dark)` first-paint block are kept byte-identical (asserted by `src/test/index-css-dark-parity.test.ts`). Every text pairing is checked in both themes by `scripts/contrast.mjs` against 4.5:1 (3:1 for large text and UI boundaries).

## Typography

**Display / Mono Font:** JetBrains Mono Variable, self-hosted via `@fontsource-variable/jetbrains-mono` (imported in `src/main.tsx`), exposed as `--font-mono` / `fontFamily.mono`. It is the display voice: the manifest hero, the numbered section indexes (01–04), the proof numerals, the monogram, and all code.
**Body Font:** the Tailwind default system sans stack (`ui-sans-serif, system-ui, -apple-system, …`). No sans web font loads.

**Character:** a ledger. Hierarchy is carried first by the mono/sans contrast — mono for anything that behaves like data (names, numbers, code, indexes), sans for prose — then by size and weight (700 for headings, 600 for titles, labels and numerals). Only one web font ships, mono; the CSP has no other font origin.

### Hierarchy

- **Manifest / Display** (JetBrains Mono, 600, line-height 1): the hero `name` value is mono `text-xl` rising to `text-3xl`; the proof numerals are mono `text-5xl` rising to `text-6xl` (48 to 60px), `tabular-nums`, `leading-none`, in Brand Violet.
- **Headline** (system sans, 700, `text-3xl`→`text-4xl` = 30→36px, tracking -0.025em): the h1 on Repositories and MCP.
- **Title** (system sans, 700, `text-2xl`→`text-3xl` = 24→30px, tracking tight): the About section h2s, rendered by `SectionRule` with a leading mono `tabular-nums` index.
- **Lead** (400, `text-lg` = 18px): the line under each h1, in Muted Ink. The About tagline is `text-lg` in Ink.
- **Body** (400, 16px, line-height ~1.6): prose paragraphs, in Ink.
- **Body Small** (400, 14px): capability bodies, timeline bullets, metadata — in Muted Ink. Lists use `marker:text-primary/60`.
- **Label / Eyebrow** (600, `text-xs` = 12px, uppercase, 0.1em+ tracking): in-component group headings (client-picker sections) in Muted Ink.
- **Mono** (14px blocks, 12px inline): configs, commands, package names, section indexes, the manifest.

### Named Rules

**The Mono-Is-Data Rule.** Anything that is a name, a number, a path, a command, an index, or code is set in JetBrains Mono. Prose is set in system sans. The contrast between the two faces is the primary hierarchy signal; do not set prose in mono to decorate it.

**The Tabular Numbers Rule.** Numbers that align in columns — the proof numerals, timeline periods, repository counts — use `tabular-nums`.

**The No-Zero-Index Rule.** `SectionRule` indexes start at 01; there is no 00. The index is `aria-hidden` so the accessible heading name is exactly the text.

## Layout

- **Container:** centred, 16px side padding (`px-4`), content capped at 1024px (`max-w-5xl`). Pages start with 32px top padding (`py-8`).
- **Rhythm:** About sections run `mb-14`/`mb-16` (56–64px); the hero proof strip sits 32px below the manifest; page headers clear ~40px to their content.
- **About:** a full-width manifest hero (code surface), a ruled 2/4-column proof strip, then four numbered sections — 01 narrative, 02 a 1/2-column capability grid, 03 a career timeline, 04 contact.
- **Proof strip:** four cells (`grid-cols-2 sm:grid-cols-4`) bounded top and bottom by a 2px ink rule (`border-y-2 border-foreground`); each cell is a `flex-col-reverse` dt/dd so the label follows the numeral in the DOM while the big numeral shows on top; every cell links to its evidence.
- **Timeline:** an ordered list; each entry is a 2-column grid at md (8rem right-aligned period, then content), rows divided by a 60% hairline (`border-t border-border/60`) with 32px vertical padding; `scroll-mt-20` clears the sticky nav.
- **Tool grids:** MCP client tiles in 2/3/4 columns with 8px gaps; repository rows stack with 4px gaps and bleed 12px past the column (`-mx-3`) so hover fills align with text.
- **Breakpoints:** Tailwind defaults — sm 640px, md 768px, lg 1024px. Below sm, nav labels collapse to icons and topic badges hide; the MCP package name and row action stay visible.
- **Sticky chrome:** a 64px top nav with a bottom hairline, opaque `bg-background`; anchors use `scroll-margin-top` of 80px to clear it.

## Elevation & Depth

Flat. There are no shadows anywhere — not on tiles, cards, panels, rows, the modal or the code surface. Depth comes from borders and tonal fills.

- **Default separation:** a 1px Hairline border, optionally over a Wash fill at ~30%.
- **Heavy surfaces:** the two surfaces that must read as objects — the **code surface** and the **install modal** — use a **2px** border instead of a shadow. The code surface's 2px frame is what keeps `#15141a` legible against the near-black page.
- **Overlay:** the modal sits over a `black/70` scrim with a 4px backdrop blur; the scrim, not a shadow, lifts it.

### Named Rules

**The Border-First Rule.** A container is defined by its border (1px, or 2px for the code surface and modal) and, if needed, a tonal fill. Never reach for a shadow — the system ships none.

## Shapes

One radius: **4px** everywhere (`--radius` is `0.25rem`, and `rounded-sm`/`md`/`lg` all map to it). Buttons, tiles, cards, code blocks, rows, the code surface and the modal are all 4px. Fully round (`rounded-full`) is reserved for badges and language dots. The VS monogram is a 4px tile, not a disc. Borders are 1px, except the 2px code surface and modal.

## Components

### Buttons

Compact and quiet; colour and the ink label do the work, not size or shadow.

- **Shape:** 4px radius, no shadow.
- **Primary:** Brand Violet fill with the **ink** label (`#0b0c0f`), 14px medium; `h-9` for the inline Install action, `size="lg"` on hero/contact CTAs. Hover is `bg-primary/90` or `--primary-hover`.
- **Outline:** Hairline border on the page ground; ghost/outline hover fills with Wash (`accent`).
- **Ghost:** no fill; used for nav items, the theme toggle and the modal close.
- **Link:** `text-link`, underline on hover with a 4px offset.
- **Focus:** 2px ring in Brand Violet (`ring-ring`), offset from the background.
- **Disabled:** reduced opacity, no pointer events.

### Code Surface (`CodeSurface`)

The single dark surface in the build, dark in **both** themes (`bg-code` `#15141a`). A 4px-radius box with a **2px** `code-border` frame, mono text, `px-4 py-4`. It carries the About manifest hero: a `# handle` comment, a `name = "…"` block (the `<h1>` is mono inside the quotes), `role`, `location`, a `builds` array whose items are `?server=` links, and a `contact` array linking LinkedIn and GitHub. Its links use **Code Link** lavender, always underlined (colour is never the only signal — WCAG 1.4.1). The manifest closes with a Live Green `●` "published" line — the only green in the system. The 32px VS monogram in the nav is a miniature of this surface (mono "VS" on `bg-code` with the 2px frame).

### Section Rule (`SectionRule`)

Every About section h2: a flex-baseline row with a top Hairline, a leading `aria-hidden` mono `tabular-nums` index (01–04) in Muted Ink, then the sans heading at `text-2xl`→`text-3xl` bold. Indexes start at 01.

### Proof Strip

Four 48→60px mono `tabular-nums` numerals in Brand Violet on a 2px ink rule top and bottom, each a link to its evidence. The fourth cell is the live 15-day PyPI download total read from the build-time snapshot `src/generated/pypi-stats.json` (`PypiDownloads` / the `formatDownloads` helper); when the snapshot is zero/empty it falls back to the honest "4 MCP servers" count rather than inventing a number, and when present it carries a dated "as of {windowEnd}" footnote in `text-link`.

### Cards / Containers

- **Capability tile:** 4px radius, 1px Hairline, Wash at 30% (`bg-muted/30`), 20px padding, a `dt` title and `dd` body. No shadow.
- **Server row (MCP gateway):** 4px radius, 1px Hairline, 20px padding, in a `<ul>`. An `<h2>` of the server full name with a package-name code chip, a two-line clamped description, then a wrapping metadata row of GitHub, PyPI and the client-dependent action. The `?server=` target row sorts first, carries `aria-current` and a 4px Brand-Violet left border (`border-l-4 border-l-primary`), and the others collapse into a native `<details>` labelled "Other servers (N)".
- **Feature banner (Repositories → MCP):** 4px radius, 1px Hairline, Wash at 30%, an icon tile plus a routing button. No shadow, no tinted border.

### Inputs / Fields

- **Segmented filter (Repositories):** a 4px bordered group over Wash at 30% with 2px inner padding. The active segment is a **Brand-Violet fill with the ink label** (`bg-primary text-primary-foreground`), its count at 70% of the label; inactive segments are Muted Ink turning Ink on hover. State is `aria-pressed`.
- **Sort toggles:** 4px text buttons; the active one fills with Wash and turns medium weight, with a 12px direction icon.
- **Client picker (MCP):** one native radio group chosen once. A `<fieldset>`/`<legend>` over a 2/3/4-column grid of radio tiles grouped under uppercase labels; each tile is a 4px bordered `<label>` driving an `sr-only` radio, with a 24px Wash icon well and the name. The checked tile gets a Brand-Violet border and a Wash 50% fill; the focused radio shows the 2px ring. Once chosen, the group collapses to a "Client: {name}" summary with a Change button; the choice persists to `localStorage` and `?client=`.
- There are no free-text inputs.

### Install Modal (`InstallModal`)

Portalled dialog over a `black/70` scrim with 4px blur: `bg-background`, a **2px** Hairline border, 4px radius, 32px padding, 600px max width, 90vh max height with scroll, **no shadow**. Opening moves focus to Close, marks `#root` inert and locks body scroll; Escape and a scrim click close it, and focus and scroll restore on the trigger. Body is an `<ol>`: a "Requires uv" line when applicable, a Step 1 that names the command or config file (or "Do one of these" with two options), a per-secret "Replace the placeholder" step linking each token's source, and a "Check {client} lists {server}" step. Code renders in a Wash `pre` with a 1px border that wraps rather than scrolls; each block has a copy button whose result ("Copied", or the Signal-Red failure line) is announced in a polite live region.

### Repository Row

A full-width link row: 12px language dot, 14px semibold name that turns `text-link` on hover, an external-link icon that fades in on hover, then a 12px Muted-Ink description and a metadata row (language, stars, forks, updated date, up to four topic badges). Rows load in pages of 10 via an IntersectionObserver with a "Show more" fallback.

### Navigation / Footer

- Sticky 64px bar with a bottom Hairline, opaque `bg-background`. Left: the 32px code-surface monogram tile, then "Vish" at `text-xl` bold. Right: small ghost buttons with a 16px icon and label (label hidden below sm); the current route uses the Brand-Violet fill with the ink label and `aria-current="page"`. The theme toggle cycles light, dark, system.
- Footer: top Hairline, 12px Muted-Ink copyright, LinkedIn and GitHub icon links.

### Icons

- **UI icons:** `lucide-react`, 16px in buttons and nav, smaller beside external links. Decorative icons sit next to a text label.
- **Brand marks:** bundled `simple-icons` paths as inline SVG with `currentColor`, so they follow the theme; a missing glyph falls back to lucide's `Blocks`.
- **Remote images:** only `upload.wikimedia.org`, for the VS Code mark; the CSP `img-src` allows nothing else off-site.

### Motion

- Colour changes use the default `transition-colors`.
- The theme switch fades background and text over 0.3s only under `html.theme-ready` **and** `prefers-reduced-motion: no-preference`, so first paint (including a dark load) never fades. `public/theme-init.js` (`script-src 'self'`) sets the class before paint.
- Spinners and the chevron rotation are `motion-safe` only. Nothing slides, scales or parallaxes.

## Do's and Don'ts

### Do:

- **Do** take every colour from the HSL custom properties and define both themes when adding one; keep the `.dark` and `@media prefers-color-scheme: dark` blocks byte-identical.
- **Do** label every brand fill with the ink colour (`primary-foreground`), and use `--link` for small link text.
- **Do** keep text at 4.5:1 or better in both themes (3:1 for large text and UI boundaries); verify with `scripts/contrast.mjs`, not by eye.
- **Do** keep green inside the code surface only, as the "published/live" marker.
- **Do** separate surfaces with borders — 1px by default, 2px for the code surface and modal.
- **Do** give every interactive element a `focus-visible` 2px ring (`ring-ring`) and a 44px touch target on coarse pointers.
- **Do** set names, numbers, paths, commands and indexes in JetBrains Mono; keep prose in system sans.

### Don't:

- **Don't** use white on the brand fill (4.29, fails); don't use the brand for small link text.
- **Don't** introduce green — or any second hue — outside the code surface, and don't use the language-dot colours as UI colour.
- **Don't** add a shadow to anything; use a border (2px for heavy surfaces) or the scrim instead.
- **Don't** use any radius other than 4px (or `rounded-full` for badges and dots).
- **Don't** load a second font or any CDN font/image/icon; a new origin needs a CSP change and a reason.
- **Don't** set text below 12px, and don't let the proof strip show a number the snapshot does not back.
