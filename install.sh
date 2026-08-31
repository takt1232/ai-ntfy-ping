#!/usr/bin/env bash
set -euo pipefail

plugins_dir="${OPENCODE_CONFIG_DIR:-$HOME/.config/opencode}/plugins"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "${plugins_dir}"
cp "${script_dir}/ai-ntfy-ping.ts" "${plugins_dir}/ai-ntfy-ping.ts"
echo "Installed ai-ntfy-ping to ${plugins_dir}/ai-ntfy-ping.ts"

cat <<'EOF'

Next steps:
1. Subscribe your phone (ntfy app) to the topic: opencode_status
   (or set NTFY_TOPIC to a custom topic before restarting opencode)
2. Restart opencode so the plugin loads.
3. Optional env vars (set in your shell profile):
   NTFY_TOPIC  topic name (default: opencode_status)
   NTFY_TOKEN  access token for protected topics
   NTFY_BASE   ntfy server base URL (default: https://ntfy.sh)

To uninstall: rm "${plugins_dir}/ai-ntfy-ping.ts"
EOF