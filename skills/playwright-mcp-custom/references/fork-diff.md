# Custom Fork Diff and Intent

## Why this fork exists

This fork is used to stabilize Playwright MCP extension workflows across two Macs where default token generation caused frequent mismatches and reconnect failures.

Primary goals:

1. Share one stable token across machines.
2. Keep default behavior compatible with upstream unless explicitly changed in UI.
3. Add a temporary emergency bypass for local debugging.

## Implemented Changes

Files changed in fork:

- `packages/extension/src/ui/authToken.tsx`
- `packages/extension/src/ui/authToken.css`
- `packages/extension/src/ui/connect.tsx`
- `packages/extension/README.md`

Behavior added:

1. Runtime UI field for fixed token (`auth-token-fixed`).
2. Runtime UI toggle to disable token validation (`auth-token-disable-check`).
3. Connection logic uses fixed token when set.
4. Optional bypass skips token validation when explicitly enabled.

## Non-goals

1. Do not change upstream transport protocol.
2. Do not remove security checks by default.
3. Do not commit personal tokens to git.
