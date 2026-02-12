---
name: playwright-mcp-custom
description: Operate and troubleshoot a custom fork of Playwright MCP extension with shared fixed-token support across multiple Macs. Use when browser automation relies on `--extension`, when `Invalid token provided` or extension timeout occurs, or when Codex/Claude configs must be synchronized with the extension token.
---

# Playwright MCP Custom

## Overview

Use this skill to keep the local custom Playwright MCP bridge stable and reproducible across machines.
Follow the token synchronization workflow first, then run a smoke test before any real browser task.

## Quick Workflow

1. Confirm the custom unpacked extension path and extension id.
2. Use one source of truth for token (`auth-token-fixed`).
3. Sync the same token into Codex and Claude MCP config.
4. Run a short smoke test (`browser_tabs list`) before real tasks.

## Safety Rules

1. Prefer fixed-token mode over disabled token validation.
2. Use disabled validation only for temporary local debugging.
3. Treat the token as a secret; rotate if leaked into logs/chats.
4. Keep the extension `key` in `manifest.json` unchanged, or extension id will change.

## References

1. For setup and standard operation, read `references/setup-and-ops.md`.
2. For custom fork behavior and intent, read `references/fork-diff.md`.
3. For error handling, read `references/troubleshooting.md`.
