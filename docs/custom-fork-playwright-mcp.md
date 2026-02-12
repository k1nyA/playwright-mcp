# Custom Fork Notes: Playwright MCP Extension

## Background

This fork was created to stabilize Playwright MCP extension usage across multiple Macs.
The upstream per-browser token flow caused frequent mismatch errors when switching machines.

## Intent

1. Keep extension-mode automation stable across devices.
2. Preserve upstream behavior by default.
3. Add explicit, opt-in controls only where needed.

## What changed

Custom changes are implemented in:

- `packages/extension/src/ui/authToken.tsx`
- `packages/extension/src/ui/authToken.css`
- `packages/extension/src/ui/connect.tsx`
- `packages/extension/README.md`

Behavior added:

1. Shared fixed token setting (`auth-token-fixed`) in UI.
2. Optional token-check bypass toggle (`auth-token-disable-check`) in UI.
3. Connect logic that honors those settings.

## Security and operational cautions

1. Keep token validation enabled in normal operation.
2. Use bypass only for short local debugging.
3. Treat fixed token as a secret and never commit it.
4. Keep `manifest.json` `key` stable; changing it changes extension ID and breaks assumptions.

## Recommended operation

1. Load unpacked extension from `packages/extension/dist`.
2. Set fixed token in extension UI.
3. Set identical `PLAYWRIGHT_MCP_EXTENSION_TOKEN` in each MCP client config.
4. Restart already-running CLI/app sessions to pick up env changes.
5. Run a smoke test (`browser_tabs` list) before real tasks.

## Common failures

### Invalid token provided

- Cause: token mismatch between extension and MCP client env.
- Fix: resync both sides to one token and restart sessions.

### Extension connection timeout

- Cause: extension not active, token mismatch, or stale browser/session state.
- Fix: re-check extension status, token, and retry with a fresh session.
