---
name: vish288.github.io
description: Personal site for Visweshwaran S (Vish), with a live repository list and an MCP install gateway.
colors:
  primary: 'hsl(152 56% 32%)'
  primary-foreground: 'hsl(0 0% 99%)'
  primary-hover: 'hsl(152 56% 28%)'
  background: 'hsl(0 0% 99%)'
  foreground: 'hsl(220 15% 12%)'
  card: 'hsl(0 0% 100%)'
  muted: 'hsl(220 14% 96%)'
  muted-foreground: 'hsl(220 9% 43%)'
  accent: 'hsl(152 30% 94%)'
  border: 'hsl(220 13% 91%)'
  destructive: 'hsl(0 72% 42%)'
  dark-primary: 'hsl(152 50% 48%)'
  dark-primary-foreground: 'hsl(224 20% 6%)'
  dark-primary-hover: 'hsl(152 50% 54%)'
  dark-background: 'hsl(224 20% 6%)'
  dark-foreground: 'hsl(210 20% 92%)'
  dark-card: 'hsl(224 18% 9%)'
  dark-muted: 'hsl(224 15% 14%)'
  dark-muted-foreground: 'hsl(215 14% 58%)'
  dark-border: 'hsl(224 12% 16%)'
  dark-destructive: 'hsl(0 70% 62%)'
typography:
  display:
    fontSize: '3.75rem'
    fontWeight: 700
    lineHeight: 1
  headline:
    fontSize: '2.25rem'
    fontWeight: 700
    lineHeight: 1.111
    letterSpacing: '-0.025em'
  title:
    fontSize: '1.875rem'
    fontWeight: 700
    lineHeight: 1.2
  lead:
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.556
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Noto Sans, Arial, sans-serif'
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
    letterSpacing: '0.1em'
  mono:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace'
    fontSize: '0.875rem'
    lineHeight: 1.429
rounded:
  xs: '4px'
  md: '8px'
  lg: '10px'
  xl: '12px'
  full: '9999px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '12px'
  lg: '16px'
  tile: '20px'
  xl: '24px'
  2xl: '32px'
  3xl: '40px'
  section: '64px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '40px'
  button-primary-lg:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.md}'
    padding: '0 32px'
    height: '44px'
  button-outline:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
    height: '40px'
  button-outline-hover:
    backgroundColor: '{colors.accent}'
  button-ghost-hover:
    backgroundColor: '{colors.accent}'
  badge-secondary:
    backgroundColor: '{colors.muted}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.full}'
    padding: '2px 10px'
  badge-outline:
    textColor: '{colors.foreground}'
    rounded: '{rounded.full}'
    padding: '2px 10px'
  card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.lg}'
    padding: '24px'
  tile:
    rounded: '{rounded.xl}'
    padding: '{spacing.lg}'
  client-pill:
    rounded: '{rounded.lg}'
    padding: '10px 12px'
  segmented-active:
    backgroundColor: '{colors.background}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.md}'
    padding: '6px 12px'
  code-inline:
    backgroundColor: '{colors.muted}'
    typography: '{typography.mono}'
    rounded: '{rounded.xs}'
    padding: '2px 6px'
  modal:
    backgroundColor: '{colors.background}'
    rounded: '{rounded.xl}'
    padding: '{spacing.2xl}'
    width: '600px'
---

# Design System: vish288.github.io

## Overview

**Creative North Star: "The Open Workbench"**

A quiet, bench-lit workspace where every surface is something a visitor can pick up and check. The system is neutral and low-chroma by design: cool near-white (or near-black) ground, slate text, hairline borders, and one green that marks what is live, current, or clickable. Nothing is ornamental for its own sake; tiles link to repos, pills install servers, rows open GitHub.

Density is moderate. Long-form content sits in a single 1024px column with generous section breaks (64px), while tool surfaces (repository list, MCP gateway) tighten to 8 to 12px gaps so many items scan at once. Light and dark are equal citizens with their own tuned values, not an inversion of each other, and a system setting follows the OS.

The build is shadcn/ui on Tailwind 4: HSL custom properties on `:root` and `.dark`, consumed through `hsl(var(--token))`. That pipeline is the source of truth; new colors go in `src/index.css` as HSL triplets in both themes.

**Key Characteristics:**

- One accent (green) on neutral slate, in both themes.
- Flat, bordered surfaces; shadow only for floating or selected layers.
- System type stack throughout; hierarchy comes from size and weight, not a second face.
- Every interactive element has a visible focus ring and a 44px touch target on coarse pointers.
- Motion is short colour fades; anything that moves is gated on `prefers-reduced-motion`.

## Colors

A neutral slate palette carrying a single green accent, tuned separately for light and dark.

### Primary

- **Workbench Green** (light `primary`, dark `dark-primary`): the only accent. Filled primary buttons, the active nav item, the VS monogram, inline links, focus rings (`--ring` equals `--primary` in both themes), list markers at 60% and icon wells at 10% tint. Light value was darkened for contrast: text on background and white-on-green both reach 4.83:1; dark green on dark ground reaches 7.69:1.
- **Workbench Green, hover** (`primary-hover` / `dark-primary-hover`): the hover fill for filled primary buttons and the default badge. A solid token, not an opacity shift: darker in light (5.97:1 under white text), lighter in dark (8.85:1 under dark text), because alpha-lightening the rest green over a light ground dropped the hover to 4.0:1. Same hue — still the one green.

### Neutral

- **Paper** (`background`, light) and **Graphite Night** (`dark-background`): page ground. A fixed radial wash sits behind content (green at 4% / 6% top-centre, blue at 3% / 4% bottom-right), visible only as a tint.
- **Ink** (`foreground` / `dark-foreground`): headings and primary text. 16.45:1 light, 16.12:1 dark.
- **Slate Note** (`muted-foreground` / `dark-muted-foreground`): secondary copy, metadata, captions. Darkened in light to clear 4.5:1 on tinted surfaces too: 5.28:1 on background, 4.92:1 on `muted`; 6.05:1 on dark.
- **Bench Grey** (`muted` / `dark-muted`): code blocks, inline code, secondary badges, icon wells, hover fills (usually at 30% or 50% alpha). `secondary` is the same value.
- **Hairline** (`border` / `dark-border`): every border and divider; `--input` is the same value. Often drawn at 50 to 60% alpha for dividers.
- **Card White** (`card` / `dark-card`): the shadcn Card surface only.
- **Mint Wash** (`accent`, light only): hover fill for outline and ghost buttons. In dark, `accent` equals `dark-muted`.

### Status

- **Signal Red** (`destructive` / `dark-destructive`): copy-failure message only. Retuned to pass small text in both themes: 6.31:1 (light) and 5.38:1 (dark) on background.

### Data

- Repository language dots use GitHub's linguist colours (TypeScript `#3178c6`, Python `#3572A5`, and so on, fallback `#6b7280`). They are third-party data, always paired with the language name in text, and never used as UI colour.

### Named Rules

**The One Green Rule.** Green is the only hue that carries meaning. If an element is green, it is interactive, current, or the brand mark. Do not introduce a second accent.

**The Both-Themes Rule.** Every colour token exists in `:root` and `.dark` with its own value, and every text pairing is checked in both themes against 4.5:1 (3:1 for large text and UI boundaries).

## Typography

**Display Font:** none chosen; headings use the body stack.
**Body Font:** system sans (`-apple-system`, `Segoe UI`, `Roboto`, falling back to `Arial`).
**Label/Mono Font:** system monospace (`ui-monospace`, `SFMono-Regular`, `Menlo`).

**Character:** Plain, native, fast. No web fonts load, and the CSP has no font origin. Hierarchy is carried by weight (700 for headings, 600 for titles and labels) and a steep size step.

### Hierarchy

- **Display** (700, 36px to 48px to 60px across sm/md, line-height 1): the hero name on About only.
- **Headline** (700, 30px rising to 36px at sm, tracking -0.025em): the h1 on Repositories and MCP.
- **Title** (700, 24px rising to 30px at sm): section h2s on About. Section h2s sit 24 to 32px above their content.
- **Lead** (400, 18px, line-height 1.556, max 42rem): the line under each h1, in Slate Note. On About, the role line uses 20 to 24px at 600 in Ink.
- **Body** (400, 16px, line-height 1.625): prose paragraphs, in Slate Note.
- **Body Small** (400, 14px): timeline bullets, capability descriptions, metadata. Lists use `marker` in green at 60%.
- **Label** (600, 12px, uppercase, 0.1em tracking): group headings inside a component (Languages, Topics, client categories on the MCP grid), in Slate Note.
- **Mono** (14px blocks, 12px inline): configs, commands, package names, file paths.

### Named Rules

**The No Second Face Rule.** The system ships no web font. A display face would need a CSP `font-src` entry and an explicit decision; until then, headings get their weight from 700 and size, not from a new family.

**The Tabular Numbers Rule.** Dates and counts that align in columns (timeline periods, language counts) use `tabular-nums`.

## Layout

- **Container:** centred, 16px side padding, content capped at 1024px (`max-w-5xl`). Pages start with 32px top padding.
- **Rhythm:** 64px between About sections; 40px under page headers; 24px between a control bar and the list it drives.
- **About:** centred hero, then a 5-column grid at md (3 columns narrative, 2 columns of 2x2 highlight tiles), a capability grid (1, 2, 3 columns at base, sm, lg), and a career timeline.
- **Timeline:** an ordered list; each entry is a 2-column grid at md (8rem right-aligned period, then content), rows divided by a 60% hairline with 32px vertical padding.
- **Tool grids:** MCP client pills in 2, 3, 4 columns (base, sm, lg) with 8px gaps; repository rows stack with 4px gaps and bleed 12px past the column so hover fills align with text.
- **Breakpoints:** Tailwind defaults, sm 640px, md 768px, lg 1024px. Below sm, nav labels collapse to icons and text-heavy secondary metadata (topic badges) hides. The MCP server package name stays visible at every width; the row action drops below the links instead of sitting at the right edge.
- **Sticky chrome:** a 64px top nav, translucent with backdrop blur; anchors use `scroll-margin-top` of 80px to clear it.

## Elevation & Depth

Flat by default. Depth comes from hairline borders and tonal fills (Bench Grey at 30 to 50% alpha), with translucency and blur on chrome. Shadows appear only where a layer floats or a choice is selected.

### Shadow Vocabulary

- **Rest** (`0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): the shadcn Card and the selected segment in a segmented control.
- **Lift** (`0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): the skip link when it appears.
- **Float** (`0 25px 50px -12px rgb(0 0 0 / 0.25)`): the install modal, over a 70% black scrim with 8px blur.

### Named Rules

**The Border-First Rule.** A container is defined by a 1px Hairline border and, if needed, a tinted fill. Reach for a shadow only for an overlay or a selected state.

## Shapes

Gently rounded, with radius stepping up with container size: 4px for inline code and the small client icon well, 8px for buttons and segmented controls, 10px (the `--radius` root) for cards, pills, code blocks and list rows, 12px for tiles, server panels, the banner and the modal. Fully round for badges, the monogram and language dots. Borders are always 1px.

## Components

### Buttons

Compact and quiet; colour does the work, not size.

- **Shape:** gently rounded (8px).
- **Primary:** green fill, near-white text, 14px medium, 40px tall (44px for `lg`, 36px for `sm`).
- **Outline:** Hairline border on Paper; hover fills with Mint Wash.
- **Ghost:** no fill; hover fills with Mint Wash. Used for nav items, the theme toggle and modal close.
- **Link:** green text, underline on hover with 4px offset.
- **Focus:** 2px ring in green, offset 2px from the background.
- **Disabled:** 50% opacity, no pointer events.

### Chips

- **Secondary badge:** fully round, Bench Grey fill, Ink text, 12 to 14px semibold. Language tallies, fallback skills.
- **Outline badge:** fully round, Hairline border, Ink text. Topics and the Fork marker.

### Cards / Containers

- **Highlight tile:** 12px radius, Hairline border, Bench Grey at 30%, 16px (20px for capability tiles) padding, centred icon well (40px, 12px radius, green at 10%, green 20px icon), 14px semibold label and 12px Slate Note caption. Tiles that link get a 50% fill on hover and a focus ring.
- **Card:** 10px radius, Card White, Rest shadow, 24px padding. Used once, for the skills panel.
- **Server row (MCP gateway):** 12px radius, Hairline border, 20px padding, listed in a `<ul>`. An `<h2>` of plain text (the server full name) with a package-name code chip beside it, a two-line clamped description, then a wrapping metadata row of GitHub, PyPI and the client-dependent action. The `?server=` target row sorts first, carries `aria-current` and a green left border, and the other rows collapse into a native `<details>` labelled "Other servers (N)".
- **Feature banner:** 12px radius, green border at 20%, a left-to-right green 5% gradient to transparent. Used once, to route from Repositories to the MCP gateway.

### Inputs / Fields

- **Segmented control:** a 10px radius group with a Hairline border and Bench Grey at 30%, 2px inner padding. The selected segment is Paper with the Rest shadow; others are Slate Note and turn Ink on hover. State is `aria-pressed`.
- **Sort toggles:** 8px radius text buttons; the active one fills with Bench Grey and turns medium weight, with a 12px direction icon.
- There are no text inputs.

### Navigation

- Sticky 64px bar with a bottom Hairline at 50%, background at 80% (60% where blur is supported) with 16px backdrop blur.
- Left: 32px green monogram disc with "VS" in 14px bold, then "Vish" at 20px bold.
- Right: small ghost buttons with a 16px icon and label (label hidden below sm); the current route uses the primary fill and `aria-current="page"`. The theme toggle cycles light, dark, system.
- Footer: top Hairline at 50%, 12px Slate Note copyright, GitHub icon link.

### Monogram

The brand mark is "VS" in bold on a green disc: 32px in the nav, 80px in the About hero. It is text, not an image.

### Client Picker (MCP gateway)

One native radio group chosen once, not per server. A `<fieldset>` with a `<legend>` ("Which client do you use?", or "Install {server}: which client do you use?" on a `?server=` deep link) over a 2/3/4-column grid of radio tiles grouped under 12px uppercase labels. Each tile is a 10px radius bordered `<label>` driving an `sr-only` radio: 24px Bench Grey icon well plus the client name at 14px medium; the checked tile gets a green border and a Bench Grey 50% fill, and the focused radio shows the 2px green ring on its label. Once a client is chosen the group collapses to a "Client: {name}" summary with a "Change" button (`aria-expanded`, `aria-controls`); the choice persists to `localStorage` and `?client=`.

### Install Modal

Portalled dialog, 600px max width, 90vh max height with scroll, 12px radius, 32px padding, Float shadow. Opening moves focus to Close, marks `#root` inert and locks body scroll; Escape and a scrim click close it, and focus and scroll restore on the trigger. Body is an `<ol>`: a "Requires uv" prerequisite line, a Step 1 that names the command or the config file (or offers "Do one of these" with two options for a client that takes either), a per-secret "Replace the placeholder" step linking each token's source, and a "Check {client} lists {server}" step. Code renders in a Bench Grey `pre` with a Hairline border that wraps rather than scrolls; each block has its own copy button whose result ("Copied", or one failure wording in Signal Red) is announced in a polite live region.

### Repository Row

A full-width link row: 12px language dot, 14px semibold name that turns green on hover, an external-link icon that fades in on hover, then a 12px Slate Note line of description and a metadata row (language, stars, forks, updated date, up to four topic badges). Rows load in pages of 10 with an IntersectionObserver and a "Show more" fallback button.

### Icons

- **UI icons:** `lucide-react`, 16px in buttons and nav, 20px in tile wells, 12px beside external links. Decorative icons sit next to a text label.
- **Brand marks:** bundled `simple-icons` paths rendered as inline SVG with `currentColor`, so they follow the theme. A missing brand glyph falls back to lucide's `Blocks`.
- **Remote images:** only `upload.wikimedia.org`, for the VS Code mark, which `simple-icons` does not carry. The CSP `img-src` allows nothing else off-site.

### Motion

- Colour changes use the 150ms `transition-colors` default.
- The theme switch fades background and text over 0.3s only under `prefers-reduced-motion: no-preference`.
- Spinners and the chevron rotation are `motion-safe` only. Nothing slides, scales or parallaxes.

## Do's and Don'ts

### Do:

- **Do** take every colour from the HSL custom properties and define both themes when adding one.
- **Do** keep text at 4.5:1 or better in both themes (3:1 for large text and UI boundaries); check by computing, not by eye.
- **Do** give every interactive element a `focus-visible` 2px green ring and add the `touch-target` utility to any control under 44px.
- **Do** gate any motion beyond a colour fade on `prefers-reduced-motion`.
- **Do** bundle icons: lucide for UI, simple-icons for brands, inline SVG with `currentColor`.
- **Do** make every tile, pill and row point at something a visitor can open, and keep a quiet fallback for API failure.

### Don't:

- **Don't** add a second accent hue or use the language-dot colours as UI colour.
- **Don't** reintroduce Signal Red below 4.5:1; keep both themes at or above it for the copy-failure message.
- **Don't** set text below 12px.
- **Don't** load icons, fonts or images from a CDN; any new origin needs a CSP change and a reason.
- **Don't** add shadows to resting tiles, panels or rows.
- **Don't** put employer or client names in any visual asset; copy rules live in PRODUCT.md.
