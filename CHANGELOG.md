# Changelog

## [2.7.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.6.0...vish288-personal-website-v2.7.0) (2026-02-25)


### Features

* add MCP Install link to nav bar and featured card on Repositories page ([adeaae6](https://github.com/vish288/vish288.github.io/commit/adeaae65aafb1bae6411f625d6b27be0ea36afef))
* add robust SEO keywords and auto-invoke routing based on query params ([#49](https://github.com/vish288/vish288.github.io/issues/49)) ([85405ea](https://github.com/vish288/vish288.github.io/commit/85405ea165a7c1c608c1148cf5e558748194da00))
* add SEO metadata, header, and footer to MCP landing pages ([#44](https://github.com/vish288/vish288.github.io/issues/44)) ([4dbe470](https://github.com/vish288/vish288.github.io/commit/4dbe47036a80a5532ea863528b8515126d1ec8c7))
* polish gateway layout and navigation for mcp-atlassian-extended-cursor-redirect.html ([7d1f8eb](https://github.com/vish288/vish288.github.io/commit/7d1f8eb4603c6f175abb4f12b07bf7d1e30043b0))
* polish gateway layout and navigation for mcp-gitlab-cursor-redirect.html ([18b842b](https://github.com/vish288/vish288.github.io/commit/18b842b32af2e9d173add9b02b683337a1ca9521))
* redesign all pages with editorial layout, infinite scroll, and MCP deep-links ([ffcc956](https://github.com/vish288/vish288.github.io/commit/ffcc956615b144a922f16cf91853c31e0a46a122))
* redesign elegant cursor gateway page for mcp-atlassian-extended-cursor-redirect.html ([77157e5](https://github.com/vish288/vish288.github.io/commit/77157e564c8d24c4ce1ac037eb5847e674a96771))
* redesign elegant cursor gateway page for mcp-gitlab-cursor-redirect.html ([5fc0e94](https://github.com/vish288/vish288.github.io/commit/5fc0e940d157a179e6dad8e488ba92b7341c6f9f))
* redesign landing pages to mirror Figma MCP catalog style ([#43](https://github.com/vish288/vish288.github.io/issues/43)) ([b92a016](https://github.com/vish288/vish288.github.io/commit/b92a016d1e34230463688941e9f909d0ead5df86))
* redesign landing pages to mirror PyPI style ([#42](https://github.com/vish288/vish288.github.io/issues/42)) ([fee674e](https://github.com/vish288/vish288.github.io/commit/fee674ecacdc0a939edf5379125a51f43f88c4eb))
* unify MCP installation gateway into single data-driven page ([cfb63e0](https://github.com/vish288/vish288.github.io/commit/cfb63e0402ab627721148b8a77feb60d5eb9f0a9))


### Bug Fixes

* add 404.html for SPA routing on GitHub Pages and remove dead HTMLs ([b490374](https://github.com/vish288/vish288.github.io/commit/b4903745eb2297defe1d7360d833bcc8e1cfd04b))
* address review findings across all pages ([2c14add](https://github.com/vish288/vish288.github.io/commit/2c14addca7af9addfe6d53283cae4c60ab8cffb4))
* improve keyboard accessibility for modal and word cloud ([0a1b25d](https://github.com/vish288/vish288.github.io/commit/0a1b25de9603e7d6e48f13305674b7d932868818))
* preserve cursor auto-redirect in old URLs, fix stale text, consistent VS Code redirect ([4d61bae](https://github.com/vish288/vish288.github.io/commit/4d61baee444799f9963b360938c1100b9df07037))
* resolve broken modal buttons, dropdown styling, footer pinning, and label corrections ([936a3ef](https://github.com/vish288/vish288.github.io/commit/936a3ef89518f754991f4293459ba48504df62df))
* simplify cursor deeplink payload shape for mcp-atlassian-extended-cursor-redirect.html ([2fd30ca](https://github.com/vish288/vish288.github.io/commit/2fd30ca534fd0c4bf3a81e7b37b446c11b05f48a))
* simplify cursor deeplink payload shape for mcp-gitlab-cursor-redirect.html ([4154131](https://github.com/vish288/vish288.github.io/commit/4154131a143fd3b5c8cf166312de878daca50fdd))
* update descriptions, logos, and link redirects ([#45](https://github.com/vish288/vish288.github.io/issues/45)) ([6835f90](https://github.com/vish288/vish288.github.io/commit/6835f908356ee77f4ef73714ca73ecf2a9215f86))
* update h1 and subtitle to reflect installation gateway ([#48](https://github.com/vish288/vish288.github.io/issues/48)) ([092b976](https://github.com/vish288/vish288.github.io/commit/092b97623caba1a388017b02c116207e203b2e0c))
* update page titles and metadata ([#47](https://github.com/vish288/vish288.github.io/issues/47)) ([25ebf04](https://github.com/vish288/vish288.github.io/commit/25ebf0422afb7fc1a590be8113c466b576bc1fc0))
* update security-settings ([edef6af](https://github.com/vish288/vish288.github.io/commit/edef6afa2b320980ad5b8d54483dcc20577b127a))
* update vscode and windsurf logos ([#46](https://github.com/vish288/vish288.github.io/issues/46)) ([d3231b5](https://github.com/vish288/vish288.github.io/commit/d3231b5e9c27a36a1555ae9103e1ac177119eac4))
* url-encode json to fix broken modals, rename Claude Desktop to Claude ([#51](https://github.com/vish288/vish288.github.io/issues/51)) ([5ef883f](https://github.com/vish288/vish288.github.io/commit/5ef883f3d8c3545031bc7839496e8e04ed95de6c))
* use click-based cursor deeplink redirect for mcp-atlassian-extended-cursor-redirect.html ([7077e04](https://github.com/vish288/vish288.github.io/commit/7077e048685b39b8d3256f93f7ef470699363a04))
* use click-based cursor deeplink redirect for mcp-gitlab-cursor-redirect.html ([d803629](https://github.com/vish288/vish288.github.io/commit/d803629b26484ec9dcf11ccffd3cb32f3fcb8b5a))
* use direct vscode protocol to keep gateway open ([#50](https://github.com/vish288/vish288.github.io/issues/50)) ([0b50954](https://github.com/vish288/vish288.github.io/commit/0b5095433c638e3d8e0c1267ab729ed965955365))
* use plain server config object in cursor deeplink for mcp-atlassian-extended-cursor-redirect.html ([6d0b754](https://github.com/vish288/vish288.github.io/commit/6d0b754b820aedec52b70e356a50330788187d79))
* use plain server config object in cursor deeplink for mcp-gitlab-cursor-redirect.html ([9dc6045](https://github.com/vish288/vish288.github.io/commit/9dc6045e8274e51cf036b560ebe793e6402fcae5))


### Documentation

* add seo metadata to mcp-atlassian-extended-cursor-redirect.html ([1782c32](https://github.com/vish288/vish288.github.io/commit/1782c3272074ba9f58740a036e39ca798de18880))
* add seo metadata to mcp-gitlab-cursor-redirect.html ([b3eb3d5](https://github.com/vish288/vish288.github.io/commit/b3eb3d5f36256d2c0e85cfb95fa4a84a84314713))
* streamline README and enrich DEVELOPMENT.md ([1899433](https://github.com/vish288/vish288.github.io/commit/18994336ed6e364b51143ca35163cd9951e5daaf))


### Code Refactoring

* rebrand to Vish, dynamic copyright year, redesign word cloud ([1102867](https://github.com/vish288/vish288.github.io/commit/1102867ede32f2343bbd16f9d918d6952df17f3c))


### Tests

* add McpInstall tests (18 cases) and update docs ([86f64ca](https://github.com/vish288/vish288.github.io/commit/86f64ca66709aa4317e9b854823361579756fd96))


### CI/CD

* test matrix on Node 20 and 24, drop Node 18 ([95d705e](https://github.com/vish288/vish288.github.io/commit/95d705efbcdee736f20b494958cc96e981751852))


### Maintenance

* add @vitest/coverage-v8 for test coverage reporting ([fc2c222](https://github.com/vish288/vish288.github.io/commit/fc2c222d779e2bd45bd93fbb3a9a3519e6aa6ed7))
* add cursor redirect page for mcp-atlassian-extended badge ([9c4acd6](https://github.com/vish288/vish288.github.io/commit/9c4acd6d6a75e88b960d3cb22e4ede9aedff4ad5))
* add cursor redirect page for mcp-gitlab badge ([95391be](https://github.com/vish288/vish288.github.io/commit/95391be5bf1eaec05c117521698d0e3de3c96877))
* drop Node 18, upgrade CI to Node 24 ([d7d0d26](https://github.com/vish288/vish288.github.io/commit/d7d0d265df81d59da4c909ef5dedf49900217f57))
* remove 15 unused dependencies and update all packages to latest ([dc6fc31](https://github.com/vish288/vish288.github.io/commit/dc6fc31b9051b3b5fe062fe8417971a949135af8))

## [2.6.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.5.0...vish288-personal-website-v2.6.0) (2026-01-05)

### Features

- update dependencies to latest versions ([#8](https://github.com/vish288/vish288.github.io/issues/8)) ([97f6eae](https://github.com/vish288/vish288.github.io/commit/97f6eae061e5af75b43e4d52e9e41c4925988904))

### Bug Fixes

- add pages and id-token permissions for deployment ([a2a6898](https://github.com/vish288/vish288.github.io/commit/a2a6898fb802dce3a6382177996a1c670ec5b7fc))

### Build System

- **deps-dev:** bump vite from 7.1.3 to 7.1.11 ([#20](https://github.com/vish288/vish288.github.io/issues/20)) ([697a89d](https://github.com/vish288/vish288.github.io/commit/697a89ddf325d41f8e2291ab3b44e40d162a2914))

### Maintenance

- remove duplicate deploy workflow ([39f849d](https://github.com/vish288/vish288.github.io/commit/39f849d216e794fd4eb483b3926a7c0f09fdc583))

## [2.5.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.4.0...vish288-personal-website-v2.5.0) (2025-08-22)

### Features

- add release-please workflow for automated releases ([7b6f02c](https://github.com/vish288/vish288.github.io/commit/7b6f02c708f0bcdfead5351d8a30a562485ce6a0))
- complete modernization to React 18 + TypeScript + Vite ([09879ea](https://github.com/vish288/vish288.github.io/commit/09879ea83a728cf684ae2ae3da66c007d49ba48d))
- Complete website modernization with shadcn/ui and advanced features ([bfab1bf](https://github.com/vish288/vish288.github.io/commit/bfab1bfa4ce47f04aa1db624a546fdfcb6442f6c))
- enhance UX with constants management and improved accessibility ([1aaf8fd](https://github.com/vish288/vish288.github.io/commit/1aaf8fdd753c42aa628abeac56fdb75e47600e36))

### Bug Fixes

- Add environment variables to GitHub Actions build ([b92e04a](https://github.com/vish288/vish288.github.io/commit/b92e04adb992469f080db6f156f5641bc2d3821e))
- add required permissions for release-please workflow ([76a55b6](https://github.com/vish288/vish288.github.io/commit/76a55b69af1f83b067fbdb769057e9359b83a001))
- format code to resolve CI pipeline issues ([d1b820b](https://github.com/vish288/vish288.github.io/commit/d1b820b37c78d5d98a698c77afbe3152dc7a6936))
- resolve GitHub Pages MIME type issues ([3c5a5c0](https://github.com/vish288/vish288.github.io/commit/3c5a5c0f111b52fbb5d7d48ab98c4d9f2dca47f4))

### Documentation

- clean up documentation structure and update README ([#5](https://github.com/vish288/vish288.github.io/issues/5)) ([250d1e7](https://github.com/vish288/vish288.github.io/commit/250d1e7b53a507cc0cadd353c175277d931362ec))
