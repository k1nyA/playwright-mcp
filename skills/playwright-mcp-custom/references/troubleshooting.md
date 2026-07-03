# Troubleshooting

## Symptom: `Invalid token provided.`

Cause:

- MCP env token does not match extension token (`auth-token-fixed` or `auth-token`).

Actions:

1. Open extension UI and confirm the active fixed token.
2. Update both configs with the exact same token:
   - `/Users/kinya/.codex/config.toml`
   - `/Users/kinya/.claude.json`
3. Restart active Codex/Claude sessions.

## Symptom: `Extension connection timeout`

Cause candidates:

1. Extension not loaded/enabled.
2. Token mismatch.
3. Browser instance restarted and old session is stale.

Actions:

1. Confirm extension exists in `chrome://extensions`.
2. Re-open bridge page and verify token state.
3. Retry smoke test.

## Symptom: repeated permission dialogs

Cause:

- Browser/OS permissions or extension approval flow reset.

Actions:

1. Re-allow requested browser permissions.
2. Confirm Chrome remote debugging is unrelated when using Playwright extension mode.
3. Keep token validation on and use fixed token to avoid repeated auth mismatch prompts.

## Symptom: print flow did not download PDF

Cause candidates:

1. `印刷` opens print preview only and does not trigger direct file download.
2. Platform-specific print behavior blocks automated save flow.

Actions:

1. Use each platform's direct download path when available (example in freee: `送付 > PDFダウンロード`).
2. Confirm a new PDF is created in `~/Downloads`.
3. Treat `印刷` as fallback/manual path, not default automation path.

## Diagnostic Commands

Show current Playwright server config in Codex:

```bash
codex mcp get playwright
```

Show current Playwright server config in Claude:

```bash
claude mcp get playwright
```
