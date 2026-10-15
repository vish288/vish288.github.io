# Changelog

## [2.14.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.13.0...vish288-personal-website-v2.14.0) (2026-10-14)

### Features

- **mcp-install:** add a read-only toggle that writes MCP_READ_ONLY=true ([c505c11](https://github.com/vish288/vish288.github.io/commit/c505c11dc032af16e04c0a03be71f919def4b3d8))

### Bug Fixes

- **mcp-install:** stop the read-only toggle re-opening a badge install ([74af066](https://github.com/vish288/vish288.github.io/commit/74af066a61b8be13d0cfbcb46a6309bf61c099c5))

### Maintenance

- repoint CHANGELOG links and release-please after history rewrite ([778f01d](https://github.com/vish288/vish288.github.io/commit/778f01d00ce624a413eee602d4a167dbd1d5cddf))

## [2.13.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.12.0+r1...vish288-personal-website-v2.13.0+r1) (2026-10-13)

### Features

- **nav:** drop Repositories from the primary nav, link it from the footer ([3aae450](https://github.com/vish288/vish288.github.io/commit/3aae45024f3f7fbdf1bc28ed6994709124987eac))

### Bug Fixes

- **copy:** proof strip says patients grew from a few hundred in 2 quarters ([a7aa9e0](https://github.com/vish288/vish288.github.io/commit/a7aa9e024bf7821c9d7a0c2111a04d1f46e8e101))

### Build System

- **deps:** bump actions/setup-node ([d4d2130](https://github.com/vish288/vish288.github.io/commit/d4d21308c94c1aa1dc5c054c4a2414cc30f5bfd1))
- **deps:** bump the npm-minor-patch group with 6 updates ([1fb0c84](https://github.com/vish288/vish288.github.io/commit/1fb0c84f63f4a42e51096168ed8bef44021aae6d))

## [2.12.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.11.0+r1...vish288-personal-website-v2.12.0+r1) (2026-10-12)

### Features

- **identity:** Manifest Ledger (combo D) — [#847492](https://github.com/vish288/vish288.github.io/issues/847492) brand, live PyPI proof ([97b4534](https://github.com/vish288/vish288.github.io/commit/97b4534199c2c4831a000f583784d62268f2a96e))
- **repos:** pin MCP server repos first; derive client counts ([b5639e4](https://github.com/vish288/vish288.github.io/commit/b5639e4cfa8a4fda13be1c68d6fbaf0c5ffb5539))

### Bug Fixes

- commit client re-pick instead of dropping it on picker blur ([a747c98](https://github.com/vish288/vish288.github.io/commit/a747c9842442ca145cb16247c6e14698959e1e6b))
- **ui:** review findings — AA contrast, About distill, cleanups ([b8c37df](https://github.com/vish288/vish288.github.io/commit/b8c37df0929fa3128f93bbc54cc4ae6cce98572d))

### Tests

- pin the gateway deep-link contract for the 4 MCP repos ([93f2974](https://github.com/vish288/vish288.github.io/commit/93f2974ceee76f6f5728131f6717c88b895e1036))

### Build System

- github. ([97b4534](https://github.com/vish288/vish288.github.io/commit/97b4534199c2c4831a000f583784d62268f2a96e))

## [2.11.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.10.0+r1...vish288-personal-website-v2.11.0+r1) (2026-10-12)

### Features

- **mcp-install:** client-first gateway, 99 to 13 focusable elements ([398a48d](https://github.com/vish288/vish288.github.io/commit/398a48dd8ea0c992243fe29881bc02a8f8bb295b))
- report a 15-day PyPI download window from the /overall feed ([584b174](https://github.com/vish288/vish288.github.io/commit/584b1743b9e4f722b362e0bfc783aed6a5b1293a))
- show live PyPI download totals on About and MCP install ([8cef3ec](https://github.com/vish288/vish288.github.io/commit/8cef3ec8799b53d05f75c29217c4a6366baa17f1))

### Bug Fixes

- build release tag in cron, validate PyPI counts, share deploy lock ([fdd76b7](https://github.com/vish288/vish288.github.io/commit/fdd76b73134af27be155a52e215eaa1533045922))
- count young packages in full over the 15-day window ([ddcd36f](https://github.com/vish288/vish288.github.io/commit/ddcd36f45cae662baf3e687d15384f2376ed67b9))
- harden banned-name guard and finish audit review fixes ([6997b5c](https://github.com/vish288/vish288.github.io/commit/6997b5c3867940ddb1eefe1fa5360223c009064d))
- **mcp-install:** review fixes — prototype keys, radio arrows, scroll target, focus ([6c14c0f](https://github.com/vish288/vish288.github.io/commit/6c14c0feded5abbf578ac91d96d92a4305f8bb87))
- resolve audit a11y/perf findings and scrub employer name ([115c0c7](https://github.com/vish288/vish288.github.io/commit/115c0c7d0a1db09515025e5e82679a21f96f7ec7))

### Documentation

- add DESIGN.md recording the shipped design system ([830bc05](https://github.com/vish288/vish288.github.io/commit/830bc0555897c90960a0b3008f14e33cc72f17fc))

## [2.10.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.9.1+r1...vish288-personal-website-v2.10.0+r1) (2026-10-08)

### Features

- **mcp:** data-driven client table with 20 clients ([4bac609](https://github.com/vish288/vish288.github.io/commit/4bac609960f7152b7341edfea009d2352a8a8c1b))
- **seo:** richer structured data, head tags and llms.txt facts ([2812167](https://github.com/vish288/vish288.github.io/commit/2812167ab779d44b8335f513504d9b15ee33edd5))

### Documentation

- add MCP clients spec ([5b6f299](https://github.com/vish288/vish288.github.io/commit/5b6f299ccbdc005654d8595a6347b159d109d1fc))

### Tests

- **mcp:** golden generator outputs and alias coverage ([8cf06d9](https://github.com/vish288/vish288.github.io/commit/8cf06d98e8bf0c869320c664554ffd9aac943deb))

### Build System

- drop redundant autoprefixer dependency ([81ffeb0](https://github.com/vish288/vish288.github.io/commit/81ffeb00f2c55f4c9982b5c6c7f70f54f784c8a1))

### CI/CD

- run build in CI and dedupe security-audit issues ([5ec3e2d](https://github.com/vish288/vish288.github.io/commit/5ec3e2d4148943c6abeb7da5d98c07920cbcb8cd))

### Maintenance

- add MIT LICENSE referenced by README and package.json ([6773054](https://github.com/vish288/vish288.github.io/commit/67730543da607c1cd7d27902ad2987a7d677f242))
- **security:** replace SPA 404 redirect with a static 404 and tighten CSP ([52037fe](https://github.com/vish288/vish288.github.io/commit/52037fecb748c161c7e9f433a18149967aa0d899))
- stop tracking editor config and remove dead files ([99ade4e](https://github.com/vish288/vish288.github.io/commit/99ade4e9ac32ac6d56b421cd2263068fc9717c6a))

## [2.9.1](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.9.0+r1...vish288-personal-website-v2.9.1+r1) (2026-10-07)

### Build System

- **deps:** bump the npm-minor-patch group with 16 updates ([4b47583](https://github.com/vish288/vish288.github.io/commit/4b47583abb4576f7684fad528001dedc8fef02c8))

## [2.9.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.9+r1...vish288-personal-website-v2.9.0+r1) (2026-10-07)

### Features

- **about:** add capabilities and experience sections ([91051d7](https://github.com/vish288/vish288.github.io/commit/91051d7a2ae6bea295a2091ad3aca5a716bf947b))
- **mcp:** add mcp-argocd server everywhere the siblings appear ([e7e7dbe](https://github.com/vish288/vish288.github.io/commit/e7e7dbe558ae241cc16f221b44fc3b598d924d6f))
- **seo:** prerender routes, structured data, sitemap and llms.txt ([eabbac7](https://github.com/vish288/vish288.github.io/commit/eabbac7706b7b639288ebb2543092d188b74814d))

### Bug Fixes

- **a11y:** 44px touch targets and full MCP client names on small screens ([d927e62](https://github.com/vish288/vish288.github.io/commit/d927e62c6a336871fcee56ca954202c7156f79dd))
- **a11y:** harden navigation, data fetching, and the MCP install flow ([6f6de37](https://github.com/vish288/vish288.github.io/commit/6f6de37406689c491f5911cec0c8663bfb273bc0))
- **a11y:** honor prefers-reduced-motion ([7450fce](https://github.com/vish288/vish288.github.io/commit/7450fcee0c8b0179490c87fd29621cf57efa6cab))
- **a11y:** meet WCAG AA contrast in the light theme ([6bcb4ac](https://github.com/vish288/vish288.github.io/commit/6bcb4ac45e0171fc112033ad272612d42d2ac470))

### Documentation

- add PRODUCT.md product context ([0ce90ce](https://github.com/vish288/vish288.github.io/commit/0ce90ce087761014c562b47f94e83f2e3bae1226))

### Code Refactoring

- **about:** derive skills from real repo data, not a fabricated map ([eca7f44](https://github.com/vish288/vish288.github.io/commit/eca7f4476394c8c075b3ac1accf0e15678b9d526))

### Build System

- **deps:** bump pnpm/action-setup ([0034c18](https://github.com/vish288/vish288.github.io/commit/0034c186af9dbfb5101225ad21cfbecca5a278c2))
- **deps:** bump the actions group across 1 directory with 4 updates ([5b83d31](https://github.com/vish288/vish288.github.io/commit/5b83d319b25ab13d80da786ea91f4daa7f111cd8))
- **deps:** bump the npm-minor-patch group across 1 directory with 25 updates ([00ab820](https://github.com/vish288/vish288.github.io/commit/00ab820dcb24f55296c14422ea376568f2102060))
- **deps:** bump vite-plugin-pwa ([07700c0](https://github.com/vish288/vish288.github.io/commit/07700c021f0e012d6f0642df72d35232a7340a39))
- **deps:** major upgrades and zero vulnerability alerts ([05437ef](https://github.com/vish288/vish288.github.io/commit/05437ef878664074740df24b715501344f517133))

### Maintenance

- ignore .internal/ ([c2e2732](https://github.com/vish288/vish288.github.io/commit/c2e27329d8f9962d42b4a8e4ce9dc965b99153e8))
- remove dead code, bundle icons, fix PWA icon, polish focus states ([b20cb91](https://github.com/vish288/vish288.github.io/commit/b20cb915a4829595b7f7e6d746e2809096cf3c86))

## [2.8.9](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.8+r1...vish288-personal-website-v2.8.9+r1) (2026-06-17)

### Bug Fixes

- allow MCP page icon CDNs in CSP and add SPA catch-all route ([b101129](https://github.com/vish288/vish288.github.io/commit/b1011297bc4de100c2522894bf3cddd593285733))

## [2.8.8](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.7+r1...vish288-personal-website-v2.8.8+r1) (2026-06-17)

### Bug Fixes

- address react-hooks 7 violations and drop tsconfig baseUrl ([d409fb7](https://github.com/vish288/vish288.github.io/commit/d409fb714691d1c23f295b8dabd113aeab49e35b))

### Code Refactoring

- remove VITE_GITHUB_TOKEN surface — drop gratitude form and admin ([bdd11f1](https://github.com/vish288/vish288.github.io/commit/bdd11f1a66b5bc7ea73d00d3b407afab3310dea9))

### Maintenance

- **security:** add CSP, promote 404 to Vite entry, extract SPA scripts to TS ([bdca40c](https://github.com/vish288/vish288.github.io/commit/bdca40c37bdbba6e080ee8ab60a9b2ca042df501))

## [2.8.7](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.6+r1...vish288-personal-website-v2.8.7+r1) (2026-06-17)

### Maintenance

- move serialize-javascript override to pnpm-workspace.yaml ([7f293fa](https://github.com/vish288/vish288.github.io/commit/7f293fa72bb649b1960f3977aecab7131a95a0d7))

## [2.8.6](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.5+r1...vish288-personal-website-v2.8.6+r1) (2026-06-17)

### Bug Fixes

- **vite:** convert manualChunks object to function for vite 8/rolldown ([8594098](https://github.com/vish288/vish288.github.io/commit/85940984ed1c24543fc717028b5dc864399702c1))

## [2.8.5](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.4+r1...vish288-personal-website-v2.8.5+r1) (2026-06-17)

### Bug Fixes

- pin lucide-react to 0.x, set ignoreDeprecations for TS 6 ([01c68ae](https://github.com/vish288/vish288.github.io/commit/01c68aefb74e1aa56632f2a3bd8c7493d80aa72a))

### Build System

- **deps:** bump the actions group across 1 directory with 8 updates ([59b73dd](https://github.com/vish288/vish288.github.io/commit/59b73dda0c08d6d402a44eae3e057f2f3e912b2a))
- **deps:** bump the npm-major group across 1 directory with 6 updates ([8f8e1a0](https://github.com/vish288/vish288.github.io/commit/8f8e1a0a75a7860fb838fbbff2787a1069fc9d3c))
- **deps:** bump the npm-minor-patch group across 1 directory with 25 updates ([27e62fc](https://github.com/vish288/vish288.github.io/commit/27e62fc186d33bc9144848fe52b1e9a42ed1eb5e))

### Maintenance

- **eslint:** downgrade new react-hooks compiler rules to warn ([d1710f1](https://github.com/vish288/vish288.github.io/commit/d1710f1d989601720f136feba4af8de99f2eb0d6))

## [2.8.4](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.3+r1...vish288-personal-website-v2.8.4+r1) (2026-06-17)

### CI/CD

- bump upload-pages-artifact to v4 (pins upload-artifact internally) ([390e05f](https://github.com/vish288/vish288.github.io/commit/390e05f9094742d36ecce172e4e117e185660957))

## [2.8.3](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.2...vish288-personal-website-v2.8.3+r1) (2026-06-17)

### CI/CD

- format CHANGELOG in release PR, drop Node 20 ([a648c53](https://github.com/vish288/vish288.github.io/commit/a648c5360ca3335384c2866b1ba464c9445fb7c0))
- group dependabot updates into batched PRs ([f9c1647](https://github.com/vish288/vish288.github.io/commit/f9c16476afea171c6bd82fb494ee860e3ab16811))
- pin all actions to commit SHA per repo policy ([f9001b1](https://github.com/vish288/vish288.github.io/commit/f9001b1d8a4eed707f20b510597bc03616959e20))

### Maintenance

- format CHANGELOG.md ([bd76b6d](https://github.com/vish288/vish288.github.io/commit/bd76b6d7c36e0428bd08142f8bc0eba7c958938a))

## [2.8.2](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.1...vish288-personal-website-v2.8.2) (2026-03-03)

### Bug Fixes

- **deps:** override serialize-javascript to &gt;=7.0.3 (CVE fix) ([2d25632](https://github.com/vish288/vish288.github.io/commit/2d256323a12bb827d30af25573fa5c0598564250))
- format CHANGELOG.md for prettier ([ec39b12](https://github.com/vish288/vish288.github.io/commit/ec39b124e3e001e24dfc1ba13427db73db80c598))

## [2.8.1](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.8.0...vish288-personal-website-v2.8.1) (2026-02-27)

### Tests

- add link integrity tests for MCP install page ([#64](https://github.com/vish288/vish288.github.io/issues/64)) ([f285176](https://github.com/vish288/vish288.github.io/commit/f285176a5293a38d98b50a2c40724c20d6313b86))

## [2.8.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.7.1...vish288-personal-website-v2.8.0) (2026-02-27)

### Features

- add Gemini CLI client and expand all MCP servers by default ([#62](https://github.com/vish288/vish288.github.io/issues/62)) ([3ad62c5](https://github.com/vish288/vish288.github.io/commit/3ad62c57dd3de046ce1281fe01415d9fb3e4c61f))

## [2.7.1](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.7.0...vish288-personal-website-v2.7.1) (2026-02-25)

### Bug Fixes

- prioritize strategic topics on repository cards ([198c38c](https://github.com/vish288/vish288.github.io/commit/198c38ccc0400663585eccb19f51ff6168c99d44))

## [2.7.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.6.0...vish288-personal-website-v2.7.0) (2026-02-25)

### Features

- add MCP Install link to nav bar and featured card on Repositories page ([0a93312](https://github.com/vish288/vish288.github.io/commit/0a93312fab48da9181fea672d55d48a9b321cfe9))
- add robust SEO keywords and auto-invoke routing based on query params ([#49](https://github.com/vish288/vish288.github.io/issues/49)) ([3d8b82a](https://github.com/vish288/vish288.github.io/commit/3d8b82a0b91f155c24f00d2da4e1b3270e474538))
- add SEO metadata, header, and footer to MCP landing pages ([#44](https://github.com/vish288/vish288.github.io/issues/44)) ([6543892](https://github.com/vish288/vish288.github.io/commit/6543892754e182da8f995989200ca99dc1e12738))
- polish gateway layout and navigation for mcp-atlassian-extended-cursor-redirect.html ([55ece3a](https://github.com/vish288/vish288.github.io/commit/55ece3a2a5c38c255c7aee0d8869805ca276917b))
- polish gateway layout and navigation for mcp-gitlab-cursor-redirect.html ([99077f0](https://github.com/vish288/vish288.github.io/commit/99077f0972007e7d242ed22874c0b96a5a38777b))
- redesign all pages with editorial layout, infinite scroll, and MCP deep-links ([6a6e426](https://github.com/vish288/vish288.github.io/commit/6a6e4265bfdcfbbf0680a268a760ad4184d6e6cd))
- redesign elegant cursor gateway page for mcp-atlassian-extended-cursor-redirect.html ([b76851a](https://github.com/vish288/vish288.github.io/commit/b76851ac9c784d4967713f53e117961d387f2a6f))
- redesign elegant cursor gateway page for mcp-gitlab-cursor-redirect.html ([6270105](https://github.com/vish288/vish288.github.io/commit/6270105e50a390b6fe5105e77183d721454ee946))
- redesign landing pages to mirror Figma MCP catalog style ([#43](https://github.com/vish288/vish288.github.io/issues/43)) ([436d9a5](https://github.com/vish288/vish288.github.io/commit/436d9a56b9bc7f63bb7b18b04aa6d629bd316775))
- redesign landing pages to mirror PyPI style ([#42](https://github.com/vish288/vish288.github.io/issues/42)) ([cb3175a](https://github.com/vish288/vish288.github.io/commit/cb3175a21d3f656ea33321814112dc82bed92ab1))
- unify MCP installation gateway into single data-driven page ([b9fb66b](https://github.com/vish288/vish288.github.io/commit/b9fb66b28417b84fe53c05c899842f82ca015b24))

### Bug Fixes

- add 404.html for SPA routing on GitHub Pages and remove dead HTMLs ([b75fc86](https://github.com/vish288/vish288.github.io/commit/b75fc8632fe6e1008806fdaf62540c28ba2e7cb1))
- address review findings across all pages ([37b94d6](https://github.com/vish288/vish288.github.io/commit/37b94d63da6dc79ddfb6098166dc23f234ccfc3c))
- improve keyboard accessibility for modal and word cloud ([3d327df](https://github.com/vish288/vish288.github.io/commit/3d327dfe8e997c49c35a6fd617aee6cf23fc9f47))
- preserve cursor auto-redirect in old URLs, fix stale text, consistent VS Code redirect ([d51b706](https://github.com/vish288/vish288.github.io/commit/d51b706d93d77cea6ed2b7e07a8ccec8103002a7))
- resolve broken modal buttons, dropdown styling, footer pinning, and label corrections ([2e911dc](https://github.com/vish288/vish288.github.io/commit/2e911dcfbadf328db67de5ce1e12536b2953753d))
- simplify cursor deeplink payload shape for mcp-atlassian-extended-cursor-redirect.html ([7d79296](https://github.com/vish288/vish288.github.io/commit/7d79296b7c87e352b5eb0a5f2c8da9c7e9c048dc))
- simplify cursor deeplink payload shape for mcp-gitlab-cursor-redirect.html ([5a22189](https://github.com/vish288/vish288.github.io/commit/5a22189e3740f315e1498ab68ef043a37522b267))
- update descriptions, logos, and link redirects ([#45](https://github.com/vish288/vish288.github.io/issues/45)) ([812f899](https://github.com/vish288/vish288.github.io/commit/812f8999cfc16484711c7dd189f1c8fac0578559))
- update h1 and subtitle to reflect installation gateway ([#48](https://github.com/vish288/vish288.github.io/issues/48)) ([e1cfd8b](https://github.com/vish288/vish288.github.io/commit/e1cfd8bb73f0f11cae799270dc4f29c1bf0fbbcf))
- update page titles and metadata ([#47](https://github.com/vish288/vish288.github.io/issues/47)) ([47a7cdf](https://github.com/vish288/vish288.github.io/commit/47a7cdfbfad03c3ab16a914d4693ed83dece7655))
- update security-settings ([71d2ef0](https://github.com/vish288/vish288.github.io/commit/71d2ef0c69baae1dd3da15a836ee89ede80a364a))
- update vscode and windsurf logos ([#46](https://github.com/vish288/vish288.github.io/issues/46)) ([c504f22](https://github.com/vish288/vish288.github.io/commit/c504f229e604d9cabffbbf887162ad257df5f5f0))
- url-encode json to fix broken modals, rename Claude Desktop to Claude ([#51](https://github.com/vish288/vish288.github.io/issues/51)) ([2e0753b](https://github.com/vish288/vish288.github.io/commit/2e0753b93aa5e8add7c239ab8bdffc42abb670ff))
- use click-based cursor deeplink redirect for mcp-atlassian-extended-cursor-redirect.html ([f17a157](https://github.com/vish288/vish288.github.io/commit/f17a157261fc3e0c134fdddbc1015ba3daaf2a79))
- use click-based cursor deeplink redirect for mcp-gitlab-cursor-redirect.html ([7e1e052](https://github.com/vish288/vish288.github.io/commit/7e1e0524b0d90333b45a159291715e005fa069a2))
- use direct vscode protocol to keep gateway open ([#50](https://github.com/vish288/vish288.github.io/issues/50)) ([0046165](https://github.com/vish288/vish288.github.io/commit/004616576a4433dc8c719b6e6e5dd429a7e01854))
- use plain server config object in cursor deeplink for mcp-atlassian-extended-cursor-redirect.html ([ff1ac4c](https://github.com/vish288/vish288.github.io/commit/ff1ac4c812b494ec8cbf6076a1d7b4205cb16d3e))
- use plain server config object in cursor deeplink for mcp-gitlab-cursor-redirect.html ([dbc07ac](https://github.com/vish288/vish288.github.io/commit/dbc07ac294ba5ad2c05a10d2c97b7504bc3f5cb3))

### Documentation

- add seo metadata to mcp-atlassian-extended-cursor-redirect.html ([7979cde](https://github.com/vish288/vish288.github.io/commit/7979cde49c14fc124586dafdb3bca0c410797535))
- add seo metadata to mcp-gitlab-cursor-redirect.html ([77b7a0f](https://github.com/vish288/vish288.github.io/commit/77b7a0fba33dc5062a95e1de247b98664b0e5cff))
- streamline README and enrich DEVELOPMENT.md ([1840eda](https://github.com/vish288/vish288.github.io/commit/1840eda303563e7dcc6b1b41899584302999e25a))

### Code Refactoring

- rebrand to Vish, dynamic copyright year, redesign word cloud ([1ee3535](https://github.com/vish288/vish288.github.io/commit/1ee35357d2d44bbbb6d74105ddb1bf14ba81ed2d))

### Tests

- add McpInstall tests (18 cases) and update docs ([10ad43d](https://github.com/vish288/vish288.github.io/commit/10ad43d4b110e899b62fdaa2fae481b54bec6679))

### CI/CD

- test matrix on Node 20 and 24, drop Node 18 ([b163b1b](https://github.com/vish288/vish288.github.io/commit/b163b1ba0789e0e43fd8870ad4ea794e044449de))

### Maintenance

- add @vitest/coverage-v8 for test coverage reporting ([c25d6d3](https://github.com/vish288/vish288.github.io/commit/c25d6d34374167679b62153230d87ebcd97fc6c2))
- add cursor redirect page for mcp-atlassian-extended badge ([5e91399](https://github.com/vish288/vish288.github.io/commit/5e91399f8bf658971fb7f97ba49c5b9d17a8ac6f))
- add cursor redirect page for mcp-gitlab badge ([f4b88df](https://github.com/vish288/vish288.github.io/commit/f4b88df53f1aad3ea72a08701abaab98f90d9d6a))
- drop Node 18, upgrade CI to Node 24 ([4b402f6](https://github.com/vish288/vish288.github.io/commit/4b402f66c24ee2e20cbd3767ec203e0232e2a8dd))
- remove 15 unused dependencies and update all packages to latest ([6d64363](https://github.com/vish288/vish288.github.io/commit/6d643634a601c5662b25d9897dacc253c8763b52))

## [2.6.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.5.0...vish288-personal-website-v2.6.0) (2026-01-05)

### Features

- update dependencies to latest versions ([#8](https://github.com/vish288/vish288.github.io/issues/8)) ([8b3b2ff](https://github.com/vish288/vish288.github.io/commit/8b3b2ff97397cf5996dfb481810341e580822d92))

### Bug Fixes

- add pages and id-token permissions for deployment ([fc9310a](https://github.com/vish288/vish288.github.io/commit/fc9310a2b4fb0dfc2a2975ce21bbe34d609b0376))

### Build System

- **deps-dev:** bump vite from 7.1.3 to 7.1.11 ([#20](https://github.com/vish288/vish288.github.io/issues/20)) ([de9bc63](https://github.com/vish288/vish288.github.io/commit/de9bc63a3dee75388526e48854513eb184aaae52))

### Maintenance

- remove duplicate deploy workflow ([5f68dad](https://github.com/vish288/vish288.github.io/commit/5f68dadff430898b983a7b205eaf7daca48d28b9))

## [2.5.0](https://github.com/vish288/vish288.github.io/compare/vish288-personal-website-v2.4.0...vish288-personal-website-v2.5.0) (2025-08-22)

### Features

- add release-please workflow for automated releases ([9fcc36a](https://github.com/vish288/vish288.github.io/commit/9fcc36ae3a010c49786b0af88878e363e7acb7a5))
- complete modernization to React 18 + TypeScript + Vite ([7cc3e73](https://github.com/vish288/vish288.github.io/commit/7cc3e73d9153297f0f10af57a995d790805f12a6))
- Complete website modernization with shadcn/ui and advanced features ([29eaa84](https://github.com/vish288/vish288.github.io/commit/29eaa84046c247ca181ec56ba3c1c607b7174155))
- enhance UX with constants management and improved accessibility ([75f738b](https://github.com/vish288/vish288.github.io/commit/75f738bfbda42cda2a0f1ee7e556157ea751b88f))

### Bug Fixes

- Add environment variables to GitHub Actions build ([9591b26](https://github.com/vish288/vish288.github.io/commit/9591b26ea977c8295014a011591f06c85b0470db))
- add required permissions for release-please workflow ([8cbe3e2](https://github.com/vish288/vish288.github.io/commit/8cbe3e2e45310b050e18b54f1f4c453dc429189a))
- format code to resolve CI pipeline issues ([5c5148d](https://github.com/vish288/vish288.github.io/commit/5c5148dd8752c2800809a28930058ad9fa289c38))
- resolve GitHub Pages MIME type issues ([03b10a9](https://github.com/vish288/vish288.github.io/commit/03b10a9c150879e7f945ec497b960dc76ad29952))

### Documentation

- clean up documentation structure and update README ([#5](https://github.com/vish288/vish288.github.io/issues/5)) ([14e5060](https://github.com/vish288/vish288.github.io/commit/14e506061da15ef44950864200171439b02420db))
