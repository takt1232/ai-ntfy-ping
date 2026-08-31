# ai-ntfy-ping

Notify your phone via [ntfy.sh](https://ntfy.sh) whenever the AI finishes responding in opencode — whether it finished a task, is asking for permission, or is asking you a question.

Unlike a skill, this is a **plugin**, so it always fires on `session.idle` and never gets forgotten.

## Install

```bash
git clone <repo-url> ai-ntfy-ping && cd ai-ntfy-ping && ./install.sh
```

Once the repo is public, a one-liner:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/<owner>/ai-ntfy-ping/main/install.sh)
```

This copies `ai-ntfy-ping.ts` into `~/.config/opencode/plugins/` (auto-loaded at startup). Re-running is safe.

## Configure

Subscribe your phone's [ntfy](https://ntfy.sh/docs/subscribe/phone/) app to the topic, then set any env vars you need:

| Env var      | Purpose                                                            | Default           |
| ------------ | ------------------------------------------------------------------ | ----------------- |
| `NTFY_TOPIC` | ntfy topic name to publish to                                      | `opencode_status` |
| `NTFY_TOKEN` | ntfy access token for protected topics (`Authorization` header)   | unset (no auth)   |
| `NTFY_BASE`  | ntfy server base URL (self-hosted)                                 | `https://ntfy.sh` |

Example:

```bash
export NTFY_TOPIC=my-private-topic
export NTFY_TOKEN=tok_abc123
```

Then restart opencode.

## How it works

- Listens for the `session.idle` event (fires whenever the model finishes responding).
- Fetches the last assistant message and sends a short summary to ntfy.
- Dedupes by message ID so each response pings exactly once.
- Notification title: "AI response ready".

## Uninstall

```bash
rm ~/.config/opencode/plugins/ai-ntfy-ping.ts
```

## License

MIT