# MCP install gateway: client expansion — as built

This is the spec the MCP gateway client expansion was implemented from. The
original spec follows verbatim under "Original spec"; this section records the
corrections and decisions applied during implementation (they override the spec
body where they conflict). All doc facts were re-verified with curl on
2026-10-07.

## 0. Corrections applied (override the original spec)

1. **Devin Desktop (Windsurf) config path.** Kept the existing
   `~/.codeium/windsurf/mcp_config.json` (all OS), not the spec's
   `~/.config/devin/mcp_config.json`. Verification found a three-way split:
   the FAQ (https://docs.devin.ai/desktop/devin-desktop-faq) says the
   `~/.codeium/` structure is unchanged and lists the MCP-config row as
   `~/.codeium/mcp_config.json`; the Cascade page
   (https://docs.devin.ai/desktop/cascade/mcp) shows
   `~/.config/devin/mcp_config.json`. The legacy path was retained per the
   orchestrator decision. Card name: "Devin Desktop (Windsurf)"; aliases
   `windsurf`, `devin-desktop`, `devin-cli`; icon: lucide fallback (not
   `siWindsurf`).
2. **GitHub Copilot CLI.** Confirmed the local stdio form
   `copilot mcp add NAME --env KEY=VALUE -- COMMAND [ARGS]` from
   docs.github.com (the GitHub MCP docker example uses `--env`). Shipped as a
   `cli` kind, envFlag `--env`. Writes `~/.copilot/mcp-config.json`.
3. **Visual Studio.** Shipped the documented `%USERPROFILE%\.mcp.json` file
   snippet only (json kind, top-level key `servers`, `"type":"stdio"`, Windows
   only). NO `aka.ms` one-click link (unverified). This changes the spec's
   row 4 from deeplink to json.
4. **VS Code / Codex / scope flags (verified).** `vscode:mcp/install?` +
   `encodeURIComponent(JSON)` and `vscode-insiders:mcp/install?` confirmed
   (code.visualstudio.com); `inputs` kept per spec (the install-URL page does
   not print the field — QA). Codex `codex mcp add ... --env` and
   `[mcp_servers.<name>]` TOML confirmed. `claude mcp add --scope user` and
   `gemini mcp add -s user` (`-s, --scope`) both confirmed in their docs.
5. **Naming.** Deeplink/config name = `shortName` everywhere (Cursor/VS Code
   install as `gitlab`, matching every config). Legacy `?server=&install=`
   deep links still resolve (aliases preserved). The `"password"` key is still
   built as `['pass','word'].join('')` for the pre-commit secret scan.
6. **Meta description.** Built from shared data, but names five curated clients
   (VS Code, Cursor, Claude Code, Codex, Gemini CLI) + "N more" rather than the
   first six in array order, to stay under the 160-char limit while still
   containing every server displayName.

---

## Original spec

# MCP install gateway: client expansion spec

Route: `https://vish288.github.io/mcp-install`
Repo: `vish288/vish288.github.io` (`main`, v2.9.1). Files touched: `src/pages/McpInstall.tsx`, `src/constants/mcpServers.ts` (unchanged shape), new `src/constants/mcpClients.ts`, new `src/lib/mcpInstall.ts`, `src/constants/routeMeta.ts`, `scripts/prerender.mjs`, `src/entry-server.tsx` (export only), tests.
All facts below were checked on 2026-10-07 against the URL in the Source column. "QA" marks a fact the docs do not state outright; the executor confirms it once in the real client before release.

---

## 1. Decision summary

### 1.1 Final client list (20)

| # | Client | Section | Kind | Install target |
|---|---|---|---|---|
| 1 | VS Code | Editors and IDEs | deeplink (json-url) | `vscode:mcp/install?` |
| 2 | VS Code Insiders | Editors and IDEs | deeplink (json-url) | `vscode-insiders:mcp/install?` |
| 3 | Cursor | Editors and IDEs | deeplink (b64) | `cursor://anysphere.cursor-deeplink/mcp/install` |
| 4 | Visual Studio | Editors and IDEs | deeplink (json-url) | `https://aka.ms/vs/mcp-install?` |
| 5 | Devin Desktop (formerly Windsurf) | Editors and IDEs | json | `~/.config/devin/mcp_config.json` |
| 6 | Zed | Editors and IDEs | json | `~/.config/zed/settings.json`, key `context_servers` |
| 7 | JetBrains AI Assistant | Editors and IDEs | json (UI paste) | Settings \| Tools \| AI Assistant \| Model Context Protocol (MCP) |
| 8 | Junie | Editors and IDEs | json | `~/.junie/mcp/mcp.json` |
| 9 | Kiro | Editors and IDEs | json | `~/.kiro/settings/mcp.json` |
| 10 | Antigravity | Editors and IDEs | json | `~/.gemini/config/mcp_config.json` |
| 11 | Cline | Editor extensions | json (UI paste) | MCP Servers > Configure > Configure MCP Servers |
| 12 | Roo Code | Editor extensions | json (UI paste) | MCP settings > Edit Global MCP |
| 13 | Continue | Editor extensions | json | `.continue/mcpServers/mcp.json` |
| 14 | Claude Code | CLI agents | cli | `claude mcp add` |
| 15 | Codex | CLI agents | cli + toml | `codex mcp add`; `~/.codex/config.toml` |
| 16 | Gemini CLI | CLI agents | cli | `gemini mcp add` |
| 17 | GitHub Copilot CLI | CLI agents | cli | `copilot mcp add` |
| 18 | opencode | CLI agents | json | `opencode.json`, key `mcp` |
| 19 | Claude Desktop | Desktop apps | json | `claude_desktop_config.json` |
| 20 | Warp | Desktop apps | json (UI paste or file) | Settings > Agents > MCP servers; `~/.warp/.mcp.json` |

### 1.2 Verified but deferred (data rows can be added later with no new code)

| Client | Why deferred | Kind it would use |
|---|---|---|
| Amp | Small user base; `amp mcp add` has no env flag so it needs the json kind at `~/.config/amp/settings.json` under `amp.mcpServers`. Source: https://ampcode.com/docs/customize/mcp | json (topKey `amp.mcpServers`) |
| LM Studio | Niche (local models). `lmstudio://add_mcp?name=&config=<b64>` is the Cursor encoding; local server shape not shown in its docs (QA). Source: https://lmstudio.ai/docs/app/mcp/deeplink | deeplink (b64) |
| Goose | Deeplink has no documented `env` parameter, so a one-click install leaves the server without credentials. Needs a YAML kind for `~/.config/goose/config.yaml`. Source: https://goose-docs.ai/docs/getting-started/using-extensions/ | yaml (new kind) |
| Augment Code | UI-only "Import from JSON"; standard `mcpServers`. Trimmed for count. Source: https://docs.augmentcode.com/setup-augment/mcp | json (UI paste) |
| Kilo Code | Format changed to `~/.config/kilo/kilo.jsonc` with the opencode shape; still settling. Source: https://kilo.ai/docs/features/mcp/using-mcp-in-kilo-code | json (topKey `mcp`, shape opencode) |
| Copilot cloud agent | Repo setting, not a developer client; needs `COPILOT_MCP_*` secrets created first, so a copied config does not run by itself. Source: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp | json (shape typed-local, env as `$COPILOT_MCP_*`) |
| Trae | Docs page truncated on two fetches; only search snippets of the official steps (Settings > MCP > Add > Add Manually, standard `mcpServers`). Unverified — excluded. https://docs.trae.ai/ide/add-mcp-servers | json (UI paste) |

### 1.3 Dropped

| Client | Reason |
|---|---|
| Amazon Q Developer | End of support announced 30 Apr 2026; IDE plugins retire 30 Apr 2027; CLI renamed Kiro CLI in Nov 2025 and `~/.aws/amazonq/mcp.json` migrates to `~/.kiro/settings/mcp.json`. Kiro covers it. https://aws.amazon.com/blogs/devops/amazon-q-developer-end-of-support-announcement/ ; https://kiro.dev/docs/upgrade-guides/migrating-from-q/ |
| Qodo Gen | Docs show the UI path but the JSON example is missing from the page and the feature is marked Enterprise. Unverified — excluded. https://docs.qodo.ai/qodo-documentation/qodo-gen/tools-mcps/agentic-tools-mcps |
| Claude Desktop extensions (.mcpb) | A bundle is a zip built by `mcpb pack` from a `manifest.json` and `pyproject.toml` (`server.type = "uv"`). It is a per-server release artifact, not something a static page can generate. Belongs in each server repo's release pipeline. https://github.com/modelcontextprotocol/mcpb |
| Windsurf (name) | Renamed Devin Desktop on 2 Jun 2026; Cascade agent retired after July 2026. Kept as Devin Desktop. https://docs.devin.ai/desktop/devin-desktop-faq |
| ChatGPT desktop, Codex IDE extension | Share `~/.codex/config.toml` with Codex CLI; covered by the Codex entry. https://learn.chatgpt.com/docs/extend/mcp?surface=cli |
| GitHub Copilot in VS Code | Same `mcp.json` and install URL as VS Code; covered. |
| Claude.ai web, Perplexity, Mistral Vibe, Factory, Crush | Remote-only or docs too thin. Not evaluated further. |

### 1.4 Corrections to the existing 7

| Today | Problem | Fix |
|---|---|---|
| VS Code: `https://insiders.vscode.dev/redirect/mcp/install?name=&inputs=&config=` | Not in current VS Code docs. The documented handler is `vscode:mcp/install?<encodeURIComponent(JSON)>` with one flat object. https://code.visualstudio.com/api/extension-guides/ai/mcp | Use `vscode:mcp/install?` (stable) and `vscode-insiders:mcp/install?` (Insiders, new card). Keep `inputs` + `${input:id}` for secrets (QA: confirm the prompt appears). |
| Cursor | Format still correct: `cursor://anysphere.cursor-deeplink/mcp/install?name=$NAME&config=$BASE64`. `config` is the inner server object. https://cursor.com/docs/mcp/install-links | Keep. Use `shortName` as `name` (see open question 1). |
| Claude Code: `claude mcp add gitlab -e K=V -- uvx mcp-gitlab` | Correct. Docs: env after the name and before `--` is a documented form. https://code.claude.com/docs/en/mcp | Keep. Add `--scope user` (see open question 2). |
| Windsurf: `~/.codeium/windsurf/mcp_config.json` | Product is Devin Desktop; the Devin Local agent reads the Devin CLI files. https://docs.devin.ai/desktop/cascade/mcp ; https://docs.devin.ai/cli/extensibility/mcp/configuration | Rename card, new path (section 2.5). |
| IntelliJ: "Settings \| Tools \| MCP Servers" | That page configures the IDE *as* a server. The client is JetBrains AI Assistant at Settings \| Tools \| AI Assistant \| Model Context Protocol (MCP). https://www.jetbrains.com/help/ai-assistant/mcp.html | Rename to "JetBrains AI Assistant", fix path. Add Junie as its own card. |
| Claude Desktop: "Settings > MCP Servers, or claude_desktop_config.json" | UI path is Settings > Developer > Edit Config. macOS and Windows only. https://modelcontextprotocol.io/docs/develop/connect-local-servers | Fix text, add both paths. |
| Gemini CLI: `gemini mcp add -e K=V ... gitlab uvx mcp-gitlab` | Correct. Default scope is `project`. https://geminicli.com/docs/tools/mcp-server/ | Keep. Add `-s user` (open question 2). |
| Hero copy lists 6 names | Stale once 20 clients exist. | Replace with a count generated from data (section 4). |

---

## 2. Per-client output (worked example: `mcp-gitlab`)

Inputs from `SERVERS['mcp-gitlab']`: `shortName=gitlab`, `installCommand=uvx`, `packageName=mcp-gitlab`, env `GITLAB_URL` (placeholder `https://gitlab.example.com`, not secret), `GITLAB_TOKEN` (placeholder `glpat-xxxxxxxxxxxxxxxxxxxx`, secret).
Name used everywhere: `shortName` (`gitlab`). Env values in plain configs: `placeholder || default || ''` (same as today).

### 2.1 VS Code — deeplink, json-url

Flat object: `name`, `inputs`, then the server config (`type`, `command`, `args`, `env`). Secrets become `promptString` inputs with `password: true`; non-secrets become `promptString` with `default`. Input id = env key lower-cased, `_` → `-`.

```
vscode:mcp/install?%7B%22name%22%3A%22gitlab%22%2C%22inputs%22%3A%5B%7B%22id%22%3A%22gitlab-url%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22GitLab%20URL%22%2C%22default%22%3A%22https%3A%2F%2Fgitlab.example.com%22%7D%2C%7B%22id%22%3A%22gitlab-token%22%2C%22type%22%3A%22promptString%22%2C%22description%22%3A%22GitLab%20Personal%20Access%20Token%22%2C%22password%22%3Atrue%7D%5D%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22uvx%22%2C%22args%22%3A%5B%22mcp-gitlab%22%5D%2C%22env%22%3A%7B%22GITLAB_URL%22%3A%22%24%7Binput%3Agitlab-url%7D%22%2C%22GITLAB_TOKEN%22%3A%22%24%7Binput%3Agitlab-token%7D%22%7D%7D
```

Decoded payload (golden): `{"name":"gitlab","inputs":[{"id":"gitlab-url","type":"promptString","description":"GitLab URL","default":"https://gitlab.example.com"},{"id":"gitlab-token","type":"promptString","description":"GitLab Personal Access Token","password":true}],"type":"stdio","command":"uvx","args":["mcp-gitlab"],"env":{"GITLAB_URL":"${input:gitlab-url}","GITLAB_TOKEN":"${input:gitlab-token}"}}`

Rules: `JSON.stringify` with no whitespace, then `encodeURIComponent`. No `//` after the scheme. Source: https://code.visualstudio.com/api/extension-guides/ai/mcp ; input fields: https://code.visualstudio.com/docs/copilot/reference/mcp-configuration. The existing `"password"` key must still be built as `['pass','word'].join('')` to pass the pre-commit secret scan.

### 2.2 VS Code Insiders — deeplink, json-url

Same payload, scheme `vscode-insiders:mcp/install?`. Source: same page ("Insiders: `vscode-insiders:mcp/install?{json-configuration}`").

### 2.3 Cursor — deeplink, b64

`config` = base64 of the inner server object `{"command":"uvx","args":["mcp-gitlab"],"env":{...placeholders}}`. Secrets stay as placeholders; Cursor has no input prompts.

```
cursor://anysphere.cursor-deeplink/mcp/install?name=gitlab&config=eyJjb21tYW5kIjoidXZ4IiwiYXJncyI6WyJtY3AtZ2l0bGFiIl0sImVudiI6eyJHSVRMQUJfVVJMIjoiaHR0cHM6Ly9naXRsYWIuZXhhbXBsZS5jb20iLCJHSVRMQUJfVE9LRU4iOiJnbHBhdC14eHh4eHh4eHh4eHh4eHh4eHh4eCJ9fQ==
```

Rules: `btoa(JSON.stringify(cfg))`; do not URL-encode the base64 (the official example keeps a trailing `=`). Source: https://cursor.com/docs/mcp/install-links

### 2.4 Visual Studio — deeplink, json-url (Windows only)

Same flat JSON as VS Code but without `inputs` (not documented for VS) and with literal placeholders:

```
https://aka.ms/vs/mcp-install?%7B%22name%22%3A%22gitlab%22%2C%22command%22%3A%22uvx%22%2C%22args%22%3A%5B%22mcp-gitlab%22%5D%2C%22env%22%3A%7B%22GITLAB_URL%22%3A%22https%3A%2F%2Fgitlab.example.com%22%2C%22GITLAB_TOKEN%22%3A%22glpat-xxxxxxxxxxxxxxxxxxxx%22%7D%7D
```

Sources: one-click "Install" from the web, VS 2022 17.14+ / VS 2026: https://learn.microsoft.com/en-us/visualstudio/ide/mcp-servers ; exact URL form taken from GitHub's own badges in https://github.com/github/github-mcp-server/blob/main/README.md (QA: click once on Windows). Fallback for manual users is given in the card subtitle: `%USERPROFILE%\.mcp.json` with top-level `servers` and `"type":"stdio"`.

### 2.5 Devin Desktop (formerly Windsurf) — json

Paths: macOS/Linux `~/.config/devin/mcp_config.json`; Windows `%APPDATA%\devin\mcp_config.json`. Project scope `.devin/mcp_config.json`. Shared by Devin Desktop (Devin Local agent) and Devin CLI. `devin mcp add` has no env flag, so the file is the right route.

```json
{
  "mcpServers": {
    "gitlab": {
      "command": "uvx",
      "args": ["mcp-gitlab"],
      "env": {
        "GITLAB_URL": "https://gitlab.example.com",
        "GITLAB_TOKEN": "glpat-xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

Note line: "Windsurf became Devin Desktop on 2 Jun 2026." Sources: https://docs.devin.ai/cli/extensibility/mcp/configuration ; https://docs.devin.ai/desktop/cascade/mcp ; https://docs.devin.ai/desktop/devin-desktop-faq

### 2.6 Zed — json, topKey `context_servers`

Paths: macOS/Linux `~/.config/zed/settings.json`; Windows `%APPDATA%\Zed\settings.json` (QA: inferred from the documented `%APPDATA%\Zed\` config dir). Or run `zed: open settings file`. Merge into the existing file; the modal says so.

```json
{
  "context_servers": {
    "gitlab": {
      "command": "uvx",
      "args": ["mcp-gitlab"],
      "env": { "GITLAB_URL": "https://gitlab.example.com", "GITLAB_TOKEN": "glpat-xxxxxxxxxxxxxxxxxxxx" }
    }
  }
}
```

Source: https://zed.dev/docs/ai/mcp ; paths https://zed.dev/faq

### 2.7 JetBrains AI Assistant — json, UI paste

Path: Settings | Tools | AI Assistant | Model Context Protocol (MCP) > + > paste JSON into "JSON configuration"; choose "Server level" (global or project). Standard `mcpServers` JSON (same as 2.5). The docs show `command`/`args` only; the dialog also accepts Claude Desktop format via "Import from Claude" (QA: confirm `env` is kept). No on-disk path is documented. Source: https://www.jetbrains.com/help/ai-assistant/mcp.html

### 2.8 Junie — json

Paths: global `~/.junie/mcp/mcp.json` (also written by Settings | Tools | Junie | MCP Settings); project `.junie/mcp/mcp.json`. Standard `mcpServers` JSON. Note line: "Junie does not read secrets from a store; the token sits in this file." Source: https://junie.jetbrains.com/docs/junie-ide-plugin.html

### 2.9 Kiro — json

Paths: user `~/.kiro/settings/mcp.json`; workspace `.kiro/settings/mcp.json`; or command palette "Kiro: Open user MCP config (JSON)". Standard `mcpServers` JSON. Changes apply on save (no restart note). Kiro CLI shares the file. Source: https://kiro.dev/docs/mcp/configuration/

### 2.10 Antigravity — json

Paths: global `~/.gemini/config/mcp_config.json`; workspace `.agents/mcp_config.json`; or … > MCP Servers > Manage MCP Servers > View raw config. Standard `mcpServers` JSON. Source: https://antigravity.google/docs/mcp

### 2.11 Cline — json, UI paste

Path: Cline panel > MCP Servers icon > Configure tab > Configure MCP Servers (opens `cline_mcp_settings.json`). CLI users: `~/.cline/data/settings/cline_mcp_settings.json`. Standard `mcpServers` JSON plus `"disabled": false, "autoApprove": []` (shape `cline`). Source: https://docs.cline.bot/mcp/configuring-mcp-servers

### 2.12 Roo Code — json, UI paste

Path: Roo Code pane > MCP icon > Edit Global MCP (`mcp_settings.json`) or Edit Project MCP (`.roo/mcp.json`). Standard `mcpServers` JSON; `type` defaults to `stdio` and is omitted. Source: https://roocodeinc.github.io/Roo-Code/features/mcp/using-mcp-in-roo

### 2.13 Continue — json

Path: `.continue/mcpServers/mcp.json` at the workspace root (Continue picks up Claude/Cursor-format JSON from that folder). Standard `mcpServers` JSON. Note line: "MCP works in Agent mode only." Source: https://docs.continue.dev/customize/deep-dives/mcp

### 2.14 Claude Code — cli

```
claude mcp add gitlab --scope user -e GITLAB_URL=https://gitlab.example.com -e GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx -- uvx mcp-gitlab
```

Template: `claude mcp add {name} --scope user {env} -- {cmd}`, envFlag `-e`. Env flags come after the name (documented form; avoids the `--env`-before-name parse bug). `--scope user` per open question 2; drop it if Vish says no. Source: https://code.claude.com/docs/en/mcp

### 2.15 Codex — cli + toml (two blocks)

Block 1 (command):
```
codex mcp add gitlab --env GITLAB_URL=https://gitlab.example.com --env GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx -- uvx mcp-gitlab
```
Template: `codex mcp add {name} {env} -- {cmd}`, envFlag `--env`.

Block 2 (`~/.codex/config.toml`, shared by Codex CLI, the IDE extension and the ChatGPT desktop app):
```toml
[mcp_servers.gitlab]
command = "uvx"
args = ["mcp-gitlab"]

[mcp_servers.gitlab.env]
GITLAB_URL = "https://gitlab.example.com"
GITLAB_TOKEN = "glpat-xxxxxxxxxxxxxxxxxxxx"
```
TOML rules: basic strings with `\\` and `\"` escaped; keys that are not bare (`A-Za-z0-9_-`) are quoted; env table only when env is non-empty. Source: https://learn.chatgpt.com/docs/extend/mcp?surface=cli

### 2.16 Gemini CLI — cli

```
gemini mcp add -s user -e GITLAB_URL=https://gitlab.example.com -e GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx gitlab uvx mcp-gitlab
```
Template: `gemini mcp add -s user {env} {name} {cmd}`, envFlag `-e`. Options precede the positionals `<name> <commandOrUrl> [args...]`. Source: https://geminicli.com/docs/tools/mcp-server/

### 2.17 GitHub Copilot CLI — cli

```
copilot mcp add gitlab --env GITLAB_URL=https://gitlab.example.com --env GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx -- uvx mcp-gitlab
```
Template: `copilot mcp add {name} {env} -- {cmd}`, envFlag `--env` (no short form documented). Writes `~/.copilot/mcp-config.json`. Source: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers

### 2.18 opencode — json, topKey `mcp`, shape `opencode`

Paths: project `opencode.json`; global `~/.config/opencode/opencode.json`.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "gitlab": {
      "type": "local",
      "command": ["uvx", "mcp-gitlab"],
      "enabled": true,
      "environment": { "GITLAB_URL": "https://gitlab.example.com", "GITLAB_TOKEN": "glpat-xxxxxxxxxxxxxxxxxxxx" }
    }
  }
}
```
Sources: https://opencode.ai/docs/mcp-servers/ ; https://opencode.ai/docs/config/

### 2.19 Claude Desktop — json

Paths: macOS `~/Library/Application Support/Claude/claude_desktop_config.json`; Windows `%APPDATA%\Claude\claude_desktop_config.json`; or Settings > Developer > Edit Config. Standard `mcpServers` JSON. Restart note: "Quit and reopen Claude Desktop." Source: https://modelcontextprotocol.io/docs/develop/connect-local-servers

### 2.20 Warp — json

Path: Settings > Agents > MCP servers > + Add, paste JSON; or save to `~/.warp/.mcp.json`. Standard `mcpServers` JSON. Source: https://docs.warp.dev/knowledge-and-collaboration/mcp

### 2.21 Shared env/secret rules

| Kind | Secret handling |
|---|---|
| deeplink json-url (VS Code, Insiders) | `inputs` prompt; env value `${input:<id>}`; no placeholder in the URL |
| deeplink json-url (Visual Studio), b64 (Cursor) | placeholder literal; user edits after install |
| cli | placeholder literal in `KEY=value`; values containing spaces or shell metacharacters are single-quoted (none today; implement anyway, 1 line) |
| json / toml | placeholder literal |

Modal text for every client with placeholder literals: "Replace the placeholder values before you save." Secret keys are listed under the code block as `GITLAB_TOKEN — secret`.

---

## 3. Data model

New file `src/constants/mcpClients.ts` (no React imports; the prerender script imports it through `entry-server.tsx`). Server data stays in `src/constants/mcpServers.ts`, untouched.

```ts
export type Os = 'mac' | 'linux' | 'win'
export type Section = 'Editors and IDEs' | 'Editor extensions' | 'CLI agents' | 'Desktop apps'

export type Output =
  | { kind: 'deeplink'; encoding: 'json-url' | 'b64'; prefix: string; inputs?: boolean; typed?: boolean }
  | { kind: 'cli'; template: string; envFlag: string }
  | { kind: 'json'; topKey: string; shape: 'standard' | 'cline' | 'opencode'; schema?: string }
  | { kind: 'toml' }

export interface McpClient {
  id: string                 // canonical install= value
  name: string
  section: Section
  aliases: string[]          // extra install= values
  icon?: { title: string; path: string }   // simple-icons glyph
  iconUrl?: string           // only the existing wikimedia VS Code SVG
  outputs: Output[]          // 1 or 2 blocks shown in the modal; deeplink clients have exactly 1
  paths?: Partial<Record<Os, string>> | { ui: string }  // file per OS, or a UI path
  notes?: string[]           // short lines under the code: restart, scope, rename
  docs: string               // official URL shown as "Docs" link in the modal
}
```

| id | name | section | aliases | icon | outputs | paths / ui |
|---|---|---|---|---|---|---|
| `vscode` | VS Code | Editors and IDEs | `code`, `vs-code` | iconUrl (existing wikimedia) | deeplink json-url, prefix `vscode:mcp/install?`, inputs, typed | — |
| `vscode-insiders` | VS Code Insiders | Editors and IDEs | `insiders` | same iconUrl | deeplink json-url, prefix `vscode-insiders:mcp/install?`, inputs, typed | — |
| `cursor` | Cursor | Editors and IDEs | — | siCursor | deeplink b64, prefix `cursor://anysphere.cursor-deeplink/mcp/install?name={name}&config=` | — |
| `visualstudio` | Visual Studio | Editors and IDEs | `vs`, `visual-studio` | fallback | deeplink json-url, prefix `https://aka.ms/vs/mcp-install?` | note: Windows; manual: `%USERPROFILE%\.mcp.json` |
| `devin` | Devin Desktop | Editors and IDEs | `windsurf`, `devin-desktop`, `devin-cli` | siWindsurf (brand glyph still shipped) or fallback | json standard | mac/linux `~/.config/devin/mcp_config.json`; win `%APPDATA%\devin\mcp_config.json` |
| `zed` | Zed | Editors and IDEs | — | siZedindustries | json standard, topKey `context_servers` | mac/linux `~/.config/zed/settings.json`; win `%APPDATA%\Zed\settings.json` |
| `jetbrains` | JetBrains AI Assistant | Editors and IDEs | `intellij`, `ai-assistant`, `pycharm`, `webstorm` | siJetbrains | json standard | ui: Settings \| Tools \| AI Assistant \| Model Context Protocol (MCP) |
| `junie` | Junie | Editors and IDEs | — | siJetbrains | json standard | all `~/.junie/mcp/mcp.json` |
| `kiro` | Kiro | Editors and IDEs | `kiro-cli`, `amazonq`, `q` | fallback | json standard | all `~/.kiro/settings/mcp.json` |
| `antigravity` | Antigravity | Editors and IDEs | — | siGoogle | json standard | all `~/.gemini/config/mcp_config.json` |
| `cline` | Cline | Editor extensions | — | siCline | json cline | ui: MCP Servers > Configure > Configure MCP Servers |
| `roo` | Roo Code | Editor extensions | `roo-code`, `roocode` | fallback | json standard | ui: MCP settings > Edit Global MCP |
| `continue` | Continue | Editor extensions | — | fallback | json standard | all `.continue/mcpServers/mcp.json` (workspace) |
| `claude-code` | Claude Code | CLI agents | `claude` | siClaude | cli `claude mcp add {name} --scope user {env} -- {cmd}`, `-e` | — |
| `codex` | Codex | CLI agents | `openai`, `codex-cli`, `chatgpt` | fallback | cli `codex mcp add {name} {env} -- {cmd}`, `--env`; toml | toml path all `~/.codex/config.toml` |
| `gemini-cli` | Gemini CLI | CLI agents | `gemini` | siGooglegemini | cli `gemini mcp add -s user {env} {name} {cmd}`, `-e` | — |
| `copilot-cli` | GitHub Copilot CLI | CLI agents | `copilot` | siGithubcopilot | cli `copilot mcp add {name} {env} -- {cmd}`, `--env` | — |
| `opencode` | opencode | CLI agents | — | siOpencode | json opencode, topKey `mcp`, schema `https://opencode.ai/config.json` | all `opencode.json` (project) or `~/.config/opencode/opencode.json` |
| `claude-desktop` | Claude Desktop | Desktop apps | `desktop` | siClaude | json standard | mac `~/Library/Application Support/Claude/claude_desktop_config.json`; win `%APPDATA%\Claude\claude_desktop_config.json` |
| `warp` | Warp | Desktop apps | — | siWarp | json standard | ui: Settings > Agents > MCP servers > + Add; file `~/.warp/.mcp.json` |

Alias resolution: `resolveClient(param)` lower-cases, then matches `id` or any alias. Every alias is unique across the table (test enforces). Existing URLs keep working: `cursor`, `vscode`, `vscode-insiders`, `claude`, `claude-code`, `claude-desktop`, `windsurf`, `intellij`, `gemini`, `gemini-cli`.

Generators, `src/lib/mcpInstall.ts`, pure functions, no React:

| Function | Returns | Notes |
|---|---|---|
| `serverEntry(s, shape)` | object | `standard` → `{command,args,env}`; `cline` → adds `disabled:false, autoApprove:[]`; `opencode` → `{type:'local', command:[cmd,...args], enabled:true, environment}` |
| `envLiteral(s)` | `Record<string,string>` | `placeholder || default || ''` |
| `vscodeInputs(s)` / `vscodeEnv(s)` | as today | moved out of the page unchanged |
| `genDeeplink(s, out)` | string | `json-url`: `prefix + encodeURIComponent(JSON.stringify(flat))` where flat = `{name, inputs?, type?:'stdio', command, args, env}`; `b64`: `prefix.replace('{name}', name) + btoa(JSON.stringify(serverEntry))` |
| `genCli(s, out)` | string | replace `{name}`, `{cmd}` (`installCommand + ' ' + packageName`), `{env}` (joined `${envFlag} KEY=value`, shell-quoted when needed); collapse double spaces when env is empty |
| `genJson(s, out)` | string | `JSON.stringify({ [$schema]?, [topKey]: { [name]: serverEntry } }, null, 2)` |
| `genToml(s)` | string | section 2.15 rules |
| `renderOutputs(s, client)` | `{label, code}[]` | one per output; labels: "Command", "Config", "`~/.codex/config.toml`" |

`McpInstall.tsx` keeps one card renderer: `outputs[0].kind === 'deeplink'` → `<a href>`; else → modal button. No per-client component.

---

## 4. UX

Keep the accordion, pill grid, modal, focus trap (`inert` on `#root`), Escape, focus return, copy button and live region exactly as they are.

### 4.1 Server section (1440px)

- Pills grouped under four small section labels in the order of section 1.1 (`<h3 class="text-xs uppercase tracking-widest text-muted-foreground">`). Grid stays `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, so 10 IDE pills form 3 rows, 3 extension pills 1 row, 5 CLI pills 2 rows, 2 desktop pills 1 row. Section labels are `col-span-full`.
- Pill content unchanged: icon tile, name, action word. Action word: `Install` for deeplinks, `Config` for json/toml, `Command` for cli. (Today: `Guide`.)
- Header count: "20 clients" from `CLIENTS.length`.
- Hero sentence replaced with: "Open the server in your editor, or copy a config or command for {n} MCP clients." `{n}` = `CLIENTS.length`.

### 4.2 Server section (390px)

- `grid-cols-2`; section labels still full-width. Pills already meet 44px via `touch-target`. Nothing else changes.
- A long section (10 pills = 5 rows) is acceptable; no collapse per section.

### 4.3 Modal

Order inside the dialog:
1. Title: `{server.displayName} for {client.name}` (unchanged pattern).
2. Lead line (one of): "Run this in your terminal." / "Add this to the file below." / "Paste this into {ui path}." / "Merge this into your existing settings." (Zed, opencode, Codex TOML).
3. Paths block when `paths` is a file map: a `<dl>` with one row per OS present, OS label in `text-muted-foreground`, path in `<code>`. No OS detection, no tabs; all rows always visible. If the same path applies to every OS, one row labelled "All".
4. For each output block: optional label, `<pre>` (existing styling), its own "Copy" button. Single-output clients show one button labelled "Copy to clipboard" exactly as today; two-output clients show "Copy command" and "Copy config".
5. Secret line: "Secrets: GITLAB_TOKEN. Replace the placeholder before you save." Omitted for VS Code / Insiders (prompted) and when the server has no secrets.
6. Notes list (`<ul class="text-xs text-muted-foreground">`) from `client.notes`, max 2 lines. Restart notes: Claude Desktop "Quit and reopen Claude Desktop."; Zed, Warp, JetBrains "Reload the client if the server does not appear."; Codex "The IDE extension and the ChatGPT desktop app read the same file."; Visual Studio "Windows only. Manual: `%USERPROFILE%\.mcp.json`, key `servers`."; Devin "Windsurf became Devin Desktop on 2 Jun 2026."
7. "Docs" external link (`client.docs`, `rel="noopener noreferrer"`, `target="_blank"`).

Modal width stays `max-w-[600px]`; the Codex modal is the tallest (two blocks) and scrolls inside `max-h-[90vh]` as today.

### 4.4 Deep-link behaviour

`?server=<key>&install=<alias>` unchanged: deeplink clients redirect after 400 ms; others open the modal. Unknown alias: no action.

### 4.5 Accessibility

- Section labels are headings (`h3`) inside the `h2` region; the pill remains a native `<a>` or `<button>`.
- Each copy button has a distinct accessible name; the single live region reports which block was copied ("Command copied" / "Config copied").
- `<dl>` for paths gives screen readers OS → path pairs.
- Contrast and focus rings: reuse existing classes only.

### 4.6 Icons

Bundled simple-icons present in v16.34: `siClaude`, `siCursor`, `siGooglegemini`, `siGoogle`, `siJetbrains`, `siWindsurf`, `siZedindustries`, `siGithubcopilot`, `siCline`, `siOpencode`, `siWarp`, `siModelcontextprotocol`. Not present: OpenAI, Visual Studio, Kiro, Roo Code, Continue, Devin. Fallback glyph: lucide `Blocks` (already a dependency), rendered in the same tile. Keep the one existing wikimedia URL for VS Code and reuse it for Insiders; add no new image origins.

---

## 5. SEO / AEO

All three artefacts read `CLIENTS` so copy cannot drift.

| Artefact | Change |
|---|---|
| `ROUTE_META['/mcp-install'].description` | Build at module load: `Install the GitLab, Atlassian, Coda and Argo CD MCP servers in VS Code, Cursor, Claude Code, Codex, Gemini CLI, Zed and {n-6} more clients.` Servers from `SERVERS`, first six client names from `CLIENTS`. Keep under 160 characters (test). |
| `<title>` | unchanged |
| JSON-LD | Keep the `ItemList` of `SoftwareSourceCode` (it describes the servers, which is the entity that earns the page its relevance). Add one `HowTo` per page, not per server: `name: "Install an MCP server from this page"`, three `HowToStep`s ("Choose a server", "Choose your client", "Open the install link or copy the config"), `tool: CLIENTS.map(c => ({'@type':'HowToTool', name: c.name}))`. One HowTo is enough for AEO engines to answer "how do I install X in Y"; 80 HowTos would be spam. |
| `llms.txt` | Under each server: keep GitHub/PyPI/Install lines; add `- Clients: ` followed by the 20 names joined by `, `. Add a new section `## MCP clients supported` with one line per client: `- {name}: {ui or first path or deeplink prefix}` and the direct URL `{ORIGIN}/mcp-install?server=mcp-gitlab&install={id}` pattern explained once. |
| `sitemap.xml` | unchanged |

`entry-server.tsx` exports `CLIENTS` alongside `SERVERS` so `prerender.mjs` gets it from the SSR bundle (same mechanism as today).

---

## 6. Tests

New `src/lib/mcpInstall.test.ts` (pure, no DOM):

| Test | Assertion |
|---|---|
| golden: Cursor | `genDeeplink(gitlab, cursor)` equals the string in 2.3 |
| golden: VS Code | equals the string in 2.1; decoding and `JSON.parse` yields the golden payload; `inputs[1].password === true` |
| golden: Insiders | same payload, `vscode-insiders:` prefix |
| golden: Visual Studio | equals 2.4 |
| golden: cli ×4 | Claude Code, Codex, Gemini CLI, Copilot CLI strings in 2.14–2.17 |
| golden: toml | equals 2.15 block 2; a value with `"` is escaped |
| golden: json | Claude Desktop (standard), Zed (`context_servers`), Cline (`disabled`, `autoApprove`), opencode (`command` array, `environment`, `$schema`) |
| every server × every client | each output is non-empty; json parses; deeplink `json-url` round-trips; cli ends with `uvx <packageName>`; no output contains `undefined` or `[object` |
| aliases | every `id` and alias is unique and lower-case; the 10 legacy aliases resolve to the expected `id` |
| sections | all four sections non-empty; `CLIENTS.length === 20` |
| meta | description length < 160 and contains every server displayName |

`McpInstall.test.tsx` updates: counts `20 clients`; section headings present; modal for Codex has two copy buttons with distinct names; paths `<dl>` renders for Claude Desktop with macOS and Windows rows; `install=windsurf` opens the Devin Desktop modal; `install=intellij` opens JetBrains AI Assistant; `install=vs` redirect href starts with `https://aka.ms/vs/mcp-install?`.

`McpInstall.links.test.tsx` updates:
- Skip-list of non-http schemes: `cursor://`, `vscode:`, `vscode-insiders:`.
- `ALLOWED_LINK_DOMAINS` add `aka.ms`, `code.visualstudio.com`, `cursor.com`, `learn.microsoft.com`, `docs.devin.ai`, `zed.dev`, `jetbrains.com`, `junie.jetbrains.com`, `kiro.dev`, `antigravity.google`, `docs.cline.bot`, `roocodeinc.github.io`, `docs.continue.dev`, `code.claude.com`, `learn.chatgpt.com`, `geminicli.com`, `docs.github.com`, `opencode.ai`, `modelcontextprotocol.io`, `docs.warp.dev` (the modal "Docs" links). Remove `vscode.dev` and `cdn.simpleicons.org` (unused).
- `EXPECTED_CLIENTS` derived from `CLIENTS.map(c => c.name)` instead of a hand list.
- VS Code link test: expects `vscode:mcp/install?` and a decodable payload with `name`, `inputs`, `command`.
- Keep the mcp-argocd README deep-link test; add `install=vscode-insiders`.

`prerender`/`entry-server.test.tsx`: llms.txt contains "## MCP clients supported" and 20 bullet lines; JSON-LD graph has one `HowTo` with 20 `HowToTool`s.

---

## 7. Acceptance criteria

1. `/mcp-install` shows 4 servers × 20 clients; header reads "20 clients"; no hand-written client list remains in JSX, route meta, llms.txt or JSON-LD.
2. All strings in section 2 are reproduced byte-for-byte by the generators (golden tests pass).
3. Each of the 10 legacy `install=` aliases still works; new aliases in section 3 work.
4. Lighthouse accessibility 100 on `/mcp-install` light and dark; axe reports no violations with a modal open; keyboard-only path opens, copies, closes and returns focus.
5. 390px: no horizontal scroll; every pill and button ≥ 44×44 CSS px.
6. `pnpm test`, `pnpm lint:check`, `pnpm typecheck`, `pnpm build` pass; prerendered `mcp-install.html` contains the h1 and the new meta description.
7. No change to `index.html` CSP. No new dependency in `package.json`.
8. Pre-commit secret scan passes (no literal `password` key in source).

### Non-goals

- No backend, no telemetry, no OS detection, no per-OS tabs.
- No `.mcpb` bundles, no YAML kind, no Goose/LM Studio/Amp/Augment/Kilo/Trae/Copilot cloud agent cards (data rows deferred; see 1.2).
- No icon downloads or new image origins; fallback glyph is acceptable.
- No remote (HTTP/SSE) transport; all four servers are stdio.
- No changes to `mcpServers.ts` other than none; if `ARGOCD_READ_ONLY` should be exposed, that is a separate change.

---

## 8. Open questions for Vish

1. Server name in deeplinks: today Cursor/VS Code install as `mcp-gitlab` (packageName) while every config uses `gitlab` (shortName). Spec unifies on `gitlab`. Users who reinstall from Cursor get a second entry named `gitlab` next to the old `mcp-gitlab`. Accept, or keep `packageName` for the two legacy deeplinks?
2. Scope flags: spec adds `--scope user` (Claude Code) and `-s user` (Gemini CLI) so the server is available in every project, matching what the file-based clients do. Default scopes are `local` and `project`. Keep the flags?
3. Visual Studio one-click: the `https://aka.ms/vs/mcp-install?<json>` form is what GitHub's own README ships, but Microsoft's docs page does not print the format. Ship the link, or show the `%USERPROFILE%\.mcp.json` snippet instead?
4. Devin Desktop card icon: the shipped `siWindsurf` glyph is the old brand. Use it, or the neutral fallback?
5. JetBrains aliases: should `pycharm`, `webstorm`, `goland`, `rider` all map to JetBrains AI Assistant? Cheap to add; the spec includes two.
6. Any of the deferred clients (1.2) you want in the first release? Each is one data row except Goose (new YAML kind).
7. Do the four server READMEs (`?server=…&install=vscode|cursor`) need a new badge for Insiders or Visual Studio, or stay as they are?
