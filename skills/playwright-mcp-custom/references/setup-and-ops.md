# Setup and Operations

## Environment Paths

- Custom fork repo: `/Users/kinya/Desktop/claude/playwright-mcp-custom/playwright-mcp`
- Load-unpacked extension: `/Users/kinya/Desktop/claude/playwright-mcp-custom/playwright-mcp-extension-dist`
- Codex config: `/Users/kinya/.codex/config.toml`
- Claude config: `/Users/kinya/.claude.json`

## Standard Startup Checklist

1. In `chrome://extensions`, ensure the custom unpacked extension is enabled.
2. Ensure the extension page opens as `Playwright MCP Bridge`.
3. Set and save `auth-token-fixed` in the extension UI (shared token).
4. Set the same token as `PLAYWRIGHT_MCP_EXTENSION_TOKEN` in:
   - `/Users/kinya/.codex/config.toml`
   - `/Users/kinya/.claude.json`
5. Restart Codex/Claude sessions already running in other terminals.

## Smoke Test

Run a short test before real browser tasks:

```bash
codex exec --dangerously-bypass-approvals-and-sandbox \
  --skip-git-repo-check \
  "Playwright MCPツールを1回呼び出してbrowser_tabs listを実行。成功/失敗を1行で返して。"
```

Expected: `playwright.browser_tabs` succeeds and lists at least one tab.

## Token Policy

- Preferred: `auth-token-fixed` enabled, validation enabled.
- Allowed only for temporary debug: `auth-token-disable-check=true`.
- Never keep token-check disabled in normal operation.
