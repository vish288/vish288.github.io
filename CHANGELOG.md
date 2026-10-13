# Changelog

## [2.13.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.12.0+r1...vish288-personal-website-v2.13.0+r1) (2026-10-13)

### Features

- **nav:** drop Repositories from the primary nav, link it from the footer ([056f46e](https://github.com/vish288/vish288.github.io/commit/43d0460210396001a98aaac86542a05360ca1bfd))

### Bug Fixes

- **copy:** proof strip says patients grew from a few hundred in 2 quarters ([a64a719](https://github.com/vish288/vish288.github.io/commit/be544d9e9e3476f5ee4faf0252b7877df6f00b24))

### Build System

- **deps:** bump actions/setup-node ([6972100](https://github.com/vish288/vish288.github.io/commit/6dc78df6959ee8eef258c8f1c95fde9f4fd85d97))
- **deps:** bump the npm-minor-patch group with 6 updates ([3c91a17](https://github.com/vish288/vish288.github.io/commit/4c4224d87bb1e1c6dc49aa8e3023419ebeee10e4))

## [2.12.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.11.0+r1...vish288-personal-website-v2.12.0+r1) (2026-10-12)

### Features

- **identity:** Manifest Ledger (combo D) — [#847492](https://github.com/vish288/vish288.github.io/issues/847492) brand, live PyPI proof ([462cb11](https://github.com/vish288/vish288.github.io/commit/6cf1993bef90d86344b4b83d90333203ebdde240))
- **repos:** pin MCP server repos first; derive client counts ([ad1a2da](https://github.com/vish288/vish288.github.io/commit/f39c3b306b8f33ea8348b520fb40ad7851227c41))

### Bug Fixes

- commit client re-pick instead of dropping it on picker blur ([bdba28b](https://github.com/vish288/vish288.github.io/commit/53e0e2a69f02ac7c3fb4a10e7cb6af55021fd175))
- **ui:** review findings — AA contrast, About distill, cleanups ([f21687a](https://github.com/vish288/vish288.github.io/commit/bf4339b6030411a91e9ae75ca5a880e6d7a937d9))

### Tests

- pin the gateway deep-link contract for the 4 MCP repos ([789546a](https://github.com/vish288/vish288.github.io/commit/834246edd69405d7dac9772803f725d89af5e579))

### Build System

- github. ([462cb11](https://github.com/vish288/vish288.github.io/commit/6cf1993bef90d86344b4b83d90333203ebdde240))

## [2.11.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.10.0+r1...vish288-personal-website-v2.11.0+r1) (2026-10-12)

### Features

- **mcp-install:** client-first gateway, 99 to 13 focusable elements ([bfb12bb](https://github.com/vish288/vish288.github.io/commit/ebc1b42e52d243e2c260f3c009278d991dbb72f6))
- report a 15-day PyPI download window from the /overall feed ([08e3137](https://github.com/vish288/vish288.github.io/commit/ade617e4d12628606ddf05376a1eb81351838d24))
- show live PyPI download totals on About and MCP install ([7e26972](https://github.com/vish288/vish288.github.io/commit/45d3eeb9d36efabe2305ce06184fef5665d3d258))

### Bug Fixes

- build release tag in cron, validate PyPI counts, share deploy lock ([aefcdd8](https://github.com/vish288/vish288.github.io/commit/4017a01de802145902e6f6935f6408de99519b64))
- count young packages in full over the 15-day window ([9b69e40](https://github.com/vish288/vish288.github.io/commit/6e0c4ddf06912ccb27eaf2a2f419dd78fcc20ee2))
- harden banned-name guard and finish audit review fixes ([4bf9d90](https://github.com/vish288/vish288.github.io/commit/6f18d2b5d31a02a8e66d2499887811fa098eac00))
- **mcp-install:** review fixes — prototype keys, radio arrows, scroll target, focus ([af862ba](https://github.com/vish288/vish288.github.io/commit/e44fe4eb63de419acab3f79cc5771b063ac71f1f))
- resolve audit a11y/perf findings and scrub employer name ([da0ba1f](https://github.com/vish288/vish288.github.io/commit/d1a433ba466df0c4da9fc0521c02b40e8c02dc14))

### Documentation

- add DESIGN.md recording the shipped design system ([2333bf5](https://github.com/vish288/vish288.github.io/commit/4e56cac2013aa9914183c42aae1a9799d67669d1))

## [2.10.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.9.1+r1...vish288-personal-website-v2.10.0+r1) (2026-10-08)

### Features

- **mcp:** data-driven client table with 20 clients ([6ac4288](https://github.com/vish288/vish288.github.io/commit/0b7b1e857fe42551a1add338e17cfeb979ce0f05))
- **seo:** richer structured data, head tags and llms.txt facts ([169fb60](https://github.com/vish288/vish288.github.io/commit/a30593d0dfe0afd745d7c388a8db78576b6e9857))

### Documentation

- add MCP clients spec ([d2c5c54](https://github.com/vish288/vish288.github.io/commit/8204bc7e40bf3897149bfcfb2d53853ddb61bbb9))

### Tests

- **mcp:** golden generator outputs and alias coverage ([8368761](https://github.com/vish288/vish288.github.io/commit/c254e4efbf8515a304ab83fe4f9aa4b70cb3bd2e))

### Build System

- drop redundant autoprefixer dependency ([ac0e6e8](https://github.com/vish288/vish288.github.io/commit/b7593ad62ca7a497f5bae8be82d75906d2a42f53))

### CI/CD

- run build in CI and dedupe security-audit issues ([b45e363](https://github.com/vish288/vish288.github.io/commit/d4c271235dec1236f3984dc4832eddbc8100d8a9))

### Maintenance

- add MIT LICENSE referenced by README and package.json ([3ff01dc](https://github.com/vish288/vish288.github.io/commit/4cb80da97b28a2fd63e29a5ed5b53bd03f029afe))
- **security:** replace SPA 404 redirect with a static 404 and tighten CSP ([9d9f0c5](https://github.com/vish288/vish288.github.io/commit/c22acf586e28f62b63030aa9d7104edd266d5b3e))
- stop tracking editor config and remove dead files ([2eb6477](https://github.com/vish288/vish288.github.io/commit/67b3e680a338230f0002fcc83ed23ea2fff84ab4))

## [2.9.1](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.9.0+r1...vish288-personal-website-v2.9.1+r1) (2026-10-07)

### Build System

- **deps:** bump the npm-minor-patch group with 16 updates ([69a4b0e](https://github.com/vish288/vish288.github.io/commit/1f5d5efab5d3164322e0ca5015e6631a26d85cf4))

## [2.9.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.9+r1...vish288-personal-website-v2.9.0+r1) (2026-10-07)

### Features

- **about:** add capabilities and experience sections ([0c23232](https://github.com/vish288/vish288.github.io/commit/8486963eb2967119d0f5af9f71fe9c02b40bc1e3))
- **mcp:** add mcp-argocd server everywhere the siblings appear ([a5638e8](https://github.com/vish288/vish288.github.io/commit/ad9567aeec15b249c39022fa0562681e1dc1ec90))
- **seo:** prerender routes, structured data, sitemap and llms.txt ([56679fc](https://github.com/vish288/vish288.github.io/commit/27c1286c3753652ab527b62ed49a917543888daf))

### Bug Fixes

- **a11y:** 44px touch targets and full MCP client names on small screens ([82cc11b](https://github.com/vish288/vish288.github.io/commit/fe2a706f14e5b189c1383af8524ef94dd65a8529))
- **a11y:** harden navigation, data fetching, and the MCP install flow ([c73c880](https://github.com/vish288/vish288.github.io/commit/e3b945c9ebe31f503190d4df427c62aee0c690ec))
- **a11y:** honor prefers-reduced-motion ([ec4b629](https://github.com/vish288/vish288.github.io/commit/c298211fa70555269ba96c5818cc42cfa39b324a))
- **a11y:** meet WCAG AA contrast in the light theme ([1fa7ecf](https://github.com/vish288/vish288.github.io/commit/913c6c59ae260ed40267431893702e4a3f593634))

### Documentation

- add PRODUCT.md product context ([3db5d7c](https://github.com/vish288/vish288.github.io/commit/f9c34360d6436ef8b997cb4f99beb847afbfc3ef))

### Code Refactoring

- **about:** derive skills from real repo data, not a fabricated map ([e03933e](https://github.com/vish288/vish288.github.io/commit/9181d00c0e953132e4b824f83b5fc59d475acada))

### Build System

- **deps:** bump pnpm/action-setup ([de22a30](https://github.com/vish288/vish288.github.io/commit/f26d179c4339c140b594867435ed8b1260c2f2e2))
- **deps:** bump the actions group across 1 directory with 4 updates ([ab6759c](https://github.com/vish288/vish288.github.io/commit/6e405b85e4ec0040e4b49b30c55ae23eba618e5d))
- **deps:** bump the npm-minor-patch group across 1 directory with 25 updates ([63763e2](https://github.com/vish288/vish288.github.io/commit/0915d480f870a4cb36ca31b3cc6e8677ba1ec163))
- **deps:** bump vite-plugin-pwa ([4e1dfd8](https://github.com/vish288/vish288.github.io/commit/7dff7e5a8a376fe4f4321d40c46fac7dfe4c7531))
- **deps:** major upgrades and zero vulnerability alerts ([c685b01](https://github.com/vish288/vish288.github.io/commit/818278e03e3c67fe829cd4cb30bbe472048f3745))

### Maintenance

- ignore .internal/ ([bd1e019](https://github.com/vish288/vish288.github.io/commit/74638ba6e3fb17b31cb90feccf048078e308d60d))
- remove dead code, bundle icons, fix PWA icon, polish focus states ([e6ab48a](https://github.com/vish288/vish288.github.io/commit/547b271d7d77de4e39c4f2f68401688b0015376a))

## [2.8.9](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.8+r1...vish288-personal-website-v2.8.9+r1) (2026-06-17)

### Bug Fixes

- allow MCP page icon CDNs in CSP and add SPA catch-all route ([24ef415](https://github.com/vish288/vish288.github.io/commit/042e87259ace8c18f8c6d8bb5c224caab51a1f4c))

## [2.8.8](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.7+r1...vish288-personal-website-v2.8.8+r1) (2026-06-17)

### Bug Fixes

- address react-hooks 7 violations and drop tsconfig baseUrl ([67da9ab](https://github.com/vish288/vish288.github.io/commit/022aefd34c3e76a011b4c9d1ae76445ab6315d3d))

### Code Refactoring

- remove VITE_GITHUB_TOKEN surface — drop gratitude form and admin ([44544b1](https://github.com/vish288/vish288.github.io/commit/60a23f0f99e335729f8040c3c3f372d6b34de904))

### Maintenance

- **security:** add CSP, promote 404 to Vite entry, extract SPA scripts to TS ([b918aff](https://github.com/vish288/vish288.github.io/commit/628ce04b06168ed378a5a4937e7f4edc320acec3))

## [2.8.7](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.6+r1...vish288-personal-website-v2.8.7+r1) (2026-06-17)

### Maintenance

- move serialize-javascript override to pnpm-workspace.yaml ([1487df2](https://github.com/vish288/vish288.github.io/commit/5c826b2edd2790eea60ffcd27dd82c98d9a69896))

## [2.8.6](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.5+r1...vish288-personal-website-v2.8.6+r1) (2026-06-17)

### Bug Fixes

- **vite:** convert manualChunks object to function for vite 8/rolldown ([c35c4ab](https://github.com/vish288/vish288.github.io/commit/20398f141e2adaee0363b0496d1add72bbe4ea69))

## [2.8.5](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.4+r1...vish288-personal-website-v2.8.5+r1) (2026-06-17)

### Bug Fixes

- pin lucide-react to 0.x, set ignoreDeprecations for TS 6 ([d99c37b](https://github.com/vish288/vish288.github.io/commit/b7df2ba0004889c06cdc1e04cd806a600f17c199))

### Build System

- **deps:** bump the actions group across 1 directory with 8 updates ([547a94d](https://github.com/vish288/vish288.github.io/commit/21d32e3d931e3f734348ffe095679b5280c91265))
- **deps:** bump the npm-major group across 1 directory with 6 updates ([f32d97a](https://github.com/vish288/vish288.github.io/commit/dcbbb9270c056a3e224c144edc6d229199e28a1d))
- **deps:** bump the npm-minor-patch group across 1 directory with 25 updates ([f35c699](https://github.com/vish288/vish288.github.io/commit/eb7932bce03e00f93953fdbb25b78a5a93655450))

### Maintenance

- **eslint:** downgrade new react-hooks compiler rules to warn ([3ffebc1](https://github.com/vish288/vish288.github.io/commit/4972d4657bd11871518493301371550ee099c8fc))

## [2.8.4](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.3+r1...vish288-personal-website-v2.8.4+r1) (2026-06-17)

### CI/CD

- bump upload-pages-artifact to v4 (pins upload-artifact internally) ([27c457f](https://github.com/vish288/vish288.github.io/commit/2d75ed270d2331f814e908fc2866dc8b7d24b41b))

## [2.8.3](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.2...vish288-personal-website-v2.8.3+r1) (2026-06-17)

### CI/CD

- format CHANGELOG in release PR, drop Node 20 ([8f5c4a9](https://github.com/vish288/vish288.github.io/commit/972abbd3d7f1653a5e255b35e61d0c67c97d004d))
- group dependabot updates into batched PRs ([7792e28](https://github.com/vish288/vish288.github.io/commit/f8ad54d1d8871089ada0b868ec17819142027015))
- pin all actions to commit SHA per repo policy ([1ddc92e](https://github.com/vish288/vish288.github.io/commit/3423d70b67cf349d73af77e3668fd2e3452b7262))

### Maintenance

- format CHANGELOG.md ([40349ff](https://github.com/vish288/vish288.github.io/commit/71ec780390ee4a0043be418f54fe8e9d49e1e8b2))

## [2.8.2](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.1...vish288-personal-website-v2.8.2) (2026-03-03)

### Bug Fixes

- **deps:** override serialize-javascript to &gt;=7.0.3 (CVE fix) ([c9eb69b](https://github.com/vish288/vish288.github.io/commit/ebd1aef74682a789f068dfbfcc870b692c9b600b))
- format CHANGELOG.md for prettier ([0a7a411](https://github.com/vish288/vish288.github.io/commit/b396fb4da9a8df1eaa565eddc392f98577e48cc5))

## [2.8.1](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.0...vish288-personal-website-v2.8.1) (2026-02-27)

### Tests

- add link integrity tests for MCP install page ([#64](https://github.com/vish288/vish288.github.io/issues/64)) ([ae5d5b4](https://github.com/vish288/vish288.github.io/commit/cc41a8cc67a4396ed91b9f51490258c062476c51))

## [2.8.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.7.1...vish288-personal-website-v2.8.0) (2026-02-27)

### Features

- add Gemini CLI client and expand all MCP servers by default ([#62](https://github.com/vish288/vish288.github.io/issues/62)) ([ef0710e](https://github.com/vish288/vish288.github.io/commit/41781239ad3db36f16941cb5a40013963a881ae6))

## [2.7.1](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.7.0...vish288-personal-website-v2.7.1) (2026-02-25)

### Bug Fixes

- prioritize strategic topics on repository cards ([46c604a](https://github.com/vish288/vish288.github.io/commit/04b30de909f1745df9c40857acfa4951a3626695))

## [2.7.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.6.0...vish288-personal-website-v2.7.0) (2026-02-25)

### Features

- add MCP Install link to nav bar and featured card on Repositories page ([adeaae6](https://github.com/vish288/vish288.github.io/commit/d42ae738fe47dc9dfe2f6a45b9aa341d7e42cf72))
- add robust SEO keywords and auto-invoke routing based on query params ([#49](https://github.com/vish288/vish288.github.io/issues/49)) ([85405ea](https://github.com/vish288/vish288.github.io/commit/534ad9b2fd59200892cc36814ab259f40f4391b5))
- add SEO metadata, header, and footer to MCP landing pages ([#44](https://github.com/vish288/vish288.github.io/issues/44)) ([4dbe470](https://github.com/vish288/vish288.github.io/commit/b926ea2a13358c27e0e299b802c4e11d13eeda86))
- polish gateway layout and navigation for mcp-atlassian-extended-cursor-redirect.html ([7d1f8eb](https://github.com/vish288/vish288.github.io/commit/76825fa4774ee5c4b4181ea477b5860c09adb2bc))
- polish gateway layout and navigation for mcp-gitlab-cursor-redirect.html ([18b842b](https://github.com/vish288/vish288.github.io/commit/2e8e4dede480429744b498a74676930e4d7b0ab2))
- redesign all pages with editorial layout, infinite scroll, and MCP deep-links ([ffcc956](https://github.com/vish288/vish288.github.io/commit/c7e3d01a79aa4fca6bde18e0f3f825a017cdd353))
- redesign elegant cursor gateway page for mcp-atlassian-extended-cursor-redirect.html ([77157e5](https://github.com/vish288/vish288.github.io/commit/212d96684090b869f8a66b62b63da57bf3d910e0))
- redesign elegant cursor gateway page for mcp-gitlab-cursor-redirect.html ([5fc0e94](https://github.com/vish288/vish288.github.io/commit/7abe5c888c3f62aa9f98fccd82551de48c7fb43a))
- redesign landing pages to mirror Figma MCP catalog style ([#43](https://github.com/vish288/vish288.github.io/issues/43)) ([b92a016](https://github.com/vish288/vish288.github.io/commit/1541682e19f7c3b0a9404950bd99d496a8362155))
- redesign landing pages to mirror PyPI style ([#42](https://github.com/vish288/vish288.github.io/issues/42)) ([fee674e](https://github.com/vish288/vish288.github.io/commit/58c9ff386a7f176e09fff4345b68049a6bea1593))
- unify MCP installation gateway into single data-driven page ([cfb63e0](https://github.com/vish288/vish288.github.io/commit/51e7a6a07fc44db88f6f7241b8a77f51781ae298))

### Bug Fixes

- add 404.html for SPA routing on GitHub Pages and remove dead HTMLs ([b490374](https://github.com/vish288/vish288.github.io/commit/2a2aa84e2213062e9730f10bede3788b815a6742))
- address review findings across all pages ([2c14add](https://github.com/vish288/vish288.github.io/commit/4cdb79d911579c339d7ff45afb611557e820e30f))
- improve keyboard accessibility for modal and word cloud ([0a1b25d](https://github.com/vish288/vish288.github.io/commit/fe5138c1fad26913de51e0ea9b73fa3d93d43854))
- preserve cursor auto-redirect in old URLs, fix stale text, consistent VS Code redirect ([4d61bae](https://github.com/vish288/vish288.github.io/commit/89aa9f870bcc25a5411edbe4febe1ec565e005b8))
- resolve broken modal buttons, dropdown styling, footer pinning, and label corrections ([936a3ef](https://github.com/vish288/vish288.github.io/commit/6df74465bbdf303f210b5b679e4227d723268bd3))
- simplify cursor deeplink payload shape for mcp-atlassian-extended-cursor-redirect.html ([2fd30ca](https://github.com/vish288/vish288.github.io/commit/bf227a7c94021788d09618b7c3b52c865d5703ff))
- simplify cursor deeplink payload shape for mcp-gitlab-cursor-redirect.html ([4154131](https://github.com/vish288/vish288.github.io/commit/61dfaf7527af4ec1bb9b7f994d9616a4d1bf954f))
- update descriptions, logos, and link redirects ([#45](https://github.com/vish288/vish288.github.io/issues/45)) ([6835f90](https://github.com/vish288/vish288.github.io/commit/bff892a603fc9e404e78dbd7be781b122b67d9a1))
- update h1 and subtitle to reflect installation gateway ([#48](https://github.com/vish288/vish288.github.io/issues/48)) ([092b976](https://github.com/vish288/vish288.github.io/commit/985b92f0e4a9ffc2cc484db0bbb331724937db84))
- update page titles and metadata ([#47](https://github.com/vish288/vish288.github.io/issues/47)) ([25ebf04](https://github.com/vish288/vish288.github.io/commit/4f5515e2df36df439488d865ff6877ec5689f7d8))
- update security-settings ([edef6af](https://github.com/vish288/vish288.github.io/commit/04285906108689c0a2ac77ed6db175f49ba47a43))
- update vscode and windsurf logos ([#46](https://github.com/vish288/vish288.github.io/issues/46)) ([d3231b5](https://github.com/vish288/vish288.github.io/commit/8d3f98afc3c8c8cec15ba614971ffb5f28c1fe28))
- url-encode json to fix broken modals, rename Claude Desktop to Claude ([#51](https://github.com/vish288/vish288.github.io/issues/51)) ([5ef883f](https://github.com/vish288/vish288.github.io/commit/44876a55fe0d8e8da347de5cd0cfadbaeffda78b))
- use click-based cursor deeplink redirect for mcp-atlassian-extended-cursor-redirect.html ([7077e04](https://github.com/vish288/vish288.github.io/commit/93eff2a4326f29bf9f10c4b7e818c6f6fba66117))
- use click-based cursor deeplink redirect for mcp-gitlab-cursor-redirect.html ([d803629](https://github.com/vish288/vish288.github.io/commit/32b382ddd1dfce940dfe636005ce703a498fc578))
- use direct vscode protocol to keep gateway open ([#50](https://github.com/vish288/vish288.github.io/issues/50)) ([0b50954](https://github.com/vish288/vish288.github.io/commit/aa37db4436e153c206a233bdd3761e1d6836c8e2))
- use plain server config object in cursor deeplink for mcp-atlassian-extended-cursor-redirect.html ([6d0b754](https://github.com/vish288/vish288.github.io/commit/2bdd39123eb2e50857f7e497e27136d46be2dc0e))
- use plain server config object in cursor deeplink for mcp-gitlab-cursor-redirect.html ([9dc6045](https://github.com/vish288/vish288.github.io/commit/c87eef5546b5f683f49284ac1e40b689f349f421))

### Documentation

- add seo metadata to mcp-atlassian-extended-cursor-redirect.html ([1782c32](https://github.com/vish288/vish288.github.io/commit/da20db8cd9f8db07f7f0d352cf970cf2a37d5c34))
- add seo metadata to mcp-gitlab-cursor-redirect.html ([b3eb3d5](https://github.com/vish288/vish288.github.io/commit/dfd7b644fbbe7eda459745fee449d676eaf1dc24))
- streamline README and enrich DEVELOPMENT.md ([1899433](https://github.com/vish288/vish288.github.io/commit/e72c6ed67ad55e8a8f40acedcf61cdbd16801941))

### Code Refactoring

- rebrand to Vish, dynamic copyright year, redesign word cloud ([1102867](https://github.com/vish288/vish288.github.io/commit/b72134b3d515f4a00d377ee5cb7fd3fb84f83ab4))

### Tests

- add McpInstall tests (18 cases) and update docs ([86f64ca](https://github.com/vish288/vish288.github.io/commit/33b716bc901bd9ab26241eaca8834aa536bb5315))

### CI/CD

- test matrix on Node 20 and 24, drop Node 18 ([95d705e](https://github.com/vish288/vish288.github.io/commit/d569d44a29d7268348c70fe7299f6dd55add6ff5))

### Maintenance

- add @vitest/coverage-v8 for test coverage reporting ([fc2c222](https://github.com/vish288/vish288.github.io/commit/a99943fc817ad9ee878ccb38a3ff1096e660069d))
- add cursor redirect page for mcp-atlassian-extended badge ([9c4acd6](https://github.com/vish288/vish288.github.io/commit/bcba6c58733d238173f2794eba9a13cc4e46b86c))
- add cursor redirect page for mcp-gitlab badge ([95391be](https://github.com/vish288/vish288.github.io/commit/bda57a520f34be5967d65fa8bcbbab0b92914ce2))
- drop Node 18, upgrade CI to Node 24 ([d7d0d26](https://github.com/vish288/vish288.github.io/commit/dd8d632b1199a4a3923ddc91f05983a19ca4ed8b))
- remove 15 unused dependencies and update all packages to latest ([dc6fc31](https://github.com/vish288/vish288.github.io/commit/efbc75a2f96dbe4222c287ee8eea616ec14f33a0))

## [2.6.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.5.0...vish288-personal-website-v2.6.0) (2026-01-05)

### Features

- update dependencies to latest versions ([#8](https://github.com/vish288/vish288.github.io/issues/8)) ([97f6eae](https://github.com/vish288/vish288.github.io/commit/61367a1713006ea7925c1d751676fccc175bf417))

### Bug Fixes

- add pages and id-token permissions for deployment ([a2a6898](https://github.com/vish288/vish288.github.io/commit/12aa5356749161eae280054149ad75721153fdae))

### Build System

- **deps-dev:** bump vite from 7.1.3 to 7.1.11 ([#20](https://github.com/vish288/vish288.github.io/issues/20)) ([697a89d](https://github.com/vish288/vish288.github.io/commit/d83be21d6f937276b21369d946f6338ebde17f56))

### Maintenance

- remove duplicate deploy workflow ([39f849d](https://github.com/vish288/vish288.github.io/commit/8ac43fb370247a7eb4d302d360bbd441d98da46d))

## [2.5.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.4.0...vish288-personal-website-v2.5.0) (2025-08-22)

### Features

- add release-please workflow for automated releases ([7b6f02c](https://github.com/vish288/vish288.github.io/commit/3adebb05fec13870d8682e9e2905de0e287730b3))
- complete modernization to React 18 + TypeScript + Vite ([09879ea](https://github.com/vish288/vish288.github.io/commit/0162b4bc7e5ec28a25613a9f2eea0ff287ee4f6b))
- Complete website modernization with shadcn/ui and advanced features ([bfab1bf](https://github.com/vish288/vish288.github.io/commit/097b630a2ab0827a772fb77f4c79bb4f52cbba7a))
- enhance UX with constants management and improved accessibility ([1aaf8fd](https://github.com/vish288/vish288.github.io/commit/92913567e1302a4645b697edde8fb2d735fc0c6d))

### Bug Fixes

- Add environment variables to GitHub Actions build ([b92e04a](https://github.com/vish288/vish288.github.io/commit/d1ba3018c1ed438622b0c22de410c1e658fc27e1))
- add required permissions for release-please workflow ([76a55b6](https://github.com/vish288/vish288.github.io/commit/a0d3ebe4e0b26166e005392f1d3078c8a35f1e0b))
- format code to resolve CI pipeline issues ([d1b820b](https://github.com/vish288/vish288.github.io/commit/0fd8af3a689ba8253702ff615fc1f19b0aae36eb))
- resolve GitHub Pages MIME type issues ([3c5a5c0](https://github.com/vish288/vish288.github.io/commit/fc92e95a856c18b8b3c282194548f76c134d6b7c))

### Documentation

- clean up documentation structure and update README ([#5](https://github.com/vish288/vish288.github.io/issues/5)) ([250d1e7](https://github.com/vish288/vish288.github.io/commit/4c78d645ff6b87ecab0902d39b7e9e2a1b8be478))
