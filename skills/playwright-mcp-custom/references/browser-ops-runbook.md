# Browser Ops Runbook

## Goal

Keep a reproducible terminal workflow for browser tasks using the custom Playwright MCP extension.

## Preconditions

1. Extension is loaded and enabled (`Playwright MCP Bridge`).
2. `PLAYWRIGHT_MCP_EXTENSION_TOKEN` in `/Users/kinya/.codex/config.toml` matches extension `auth-token-fixed`.

## Basic Session Commands

```bash
TOKEN=$(awk -F'"' '/PLAYWRIGHT_MCP_EXTENSION_TOKEN/{print $2; exit}' /Users/kinya/.codex/config.toml)

PLAYWRIGHT_MCP_EXTENSION_TOKEN="$TOKEN" npx -y @playwright/cli@latest list --all
PLAYWRIGHT_MCP_EXTENSION_TOKEN="$TOKEN" npx -y @playwright/cli@latest open --extension "https://discord.com/channels/@me/1401138239896686594"
PLAYWRIGHT_MCP_EXTENSION_TOKEN="$TOKEN" npx -y @playwright/cli@latest -s=default snapshot
```

If the session is stale:

```bash
PLAYWRIGHT_MCP_EXTENSION_TOKEN="$TOKEN" npx -y @playwright/cli@latest kill-all
```

## Discord Search Pattern (Safe)

Do not type directly into the chat composer. Always target the search combobox `ref` from snapshot.

1. Take snapshot.
2. Extract `combobox "検索"` ref.
3. `fill <ref> <keyword>` then `press Enter`.
4. Extract result region text with `eval`.

Example:

```bash
snap_out=$(PLAYWRIGHT_MCP_EXTENSION_TOKEN="$TOKEN" npx -y @playwright/cli@latest -s=default snapshot)
snap=$(echo "$snap_out" | rg -o '\.playwright-cli/page-[^)]*\.yml' | tail -n1)
ref=$(rg -n 'combobox "検索" \[ref=' "/Users/kinya/Documents/New project/$snap" | sed -E 's/.*\[ref=([^]]+)\].*/\1/' | head -n1)

PLAYWRIGHT_MCP_EXTENSION_TOKEN="$TOKEN" npx -y @playwright/cli@latest -s=default fill "$ref" "見積"
PLAYWRIGHT_MCP_EXTENSION_TOKEN="$TOKEN" npx -y @playwright/cli@latest -s=default press Enter
```

## freee Transition Pattern

```bash
PLAYWRIGHT_MCP_EXTENSION_TOKEN="$TOKEN" npx -y @playwright/cli@latest -s=default goto "https://invoice.secure.freee.co.jp/reports/invoices?filter_view_id=-1&cancel_status=uncanceled&per_page=20"
PLAYWRIGHT_MCP_EXTENSION_TOKEN="$TOKEN" npx -y @playwright/cli@latest -s=default snapshot
```

From snapshot, start with `link "新規作成"` and proceed to draft/edit/download.

## freee PDF Download Pattern (Recommended)

Prefer `送付 > PDFダウンロード` for file output.
Do not rely on `その他 > 印刷` as the primary download path.

1. Open invoice detail page.
2. Click `送付`.
3. In popup menu, click `PDFダウンロード`.
4. Verify new file in `~/Downloads`.

Reason:

- In many SaaS platforms, print flows open preview/OS print paths and may not create a file.
- `PDFダウンロード` usually triggers direct file generation and is more reliable for automation.

## Known Pitfalls

1. `ref` values are unstable; re-snapshot before each critical input.
2. If search `ref` is missing, current page is not the intended view; `goto` target URL again and snapshot.
3. If browser moves unexpectedly, verify no extra `codex exec` tasks are running and use a single direct `playwright-cli` flow.
