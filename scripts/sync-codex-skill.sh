#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Sync the custom Playwright MCP Codex skill from this repo to local Codex skills.

Usage:
  scripts/sync-codex-skill.sh [--dry-run]

Options:
  --dry-run   Show what would change without writing files.
  -h, --help  Show this help.
EOF
}

dry_run=0
while (($#)); do
  case "$1" in
    --dry-run)
      dry_run=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if ! command -v rsync >/dev/null 2>&1; then
  echo "rsync is required but not found." >&2
  exit 1
fi

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "${script_dir}/.." && pwd)"

skill_name="playwright-mcp-custom"
source_dir="${repo_root}/skills/${skill_name}"
target_dir="${CODEX_HOME:-$HOME/.codex}/skills/${skill_name}"

if [[ ! -d "${source_dir}" ]]; then
  echo "Source skill directory not found: ${source_dir}" >&2
  exit 1
fi

mkdir -p "${target_dir}"

rsync_args=(-a --delete)
if [[ "${dry_run}" -eq 1 ]]; then
  rsync_args+=(--dry-run --itemize-changes)
fi

echo "Syncing skill:"
echo "  from: ${source_dir}/"
echo "  to:   ${target_dir}/"

rsync "${rsync_args[@]}" "${source_dir}/" "${target_dir}/"

if [[ "${dry_run}" -eq 1 ]]; then
  echo "Dry-run completed."
else
  echo "Sync completed."
fi
