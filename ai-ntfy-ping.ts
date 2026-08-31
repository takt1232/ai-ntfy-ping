import type { Plugin } from "@opencode-ai/plugin"

let lastNotified: string | undefined

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " [code block] ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_~#>|]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export const AiNtfyPing: Plugin = async ({ client }) => {
  return {
    event: async ({ event }) => {
      if (event.type !== "session.idle") return

      const sessionID = event.properties.sessionID

      let summary = "The AI has finished responding."
      let messageID: string | undefined
      try {
        const { data } = await client.session.messages({
          path: { id: sessionID },
          query: { limit: 5 },
        })
        const messages = data ?? []
        const lastAssistant = [...messages].reverse().find((m) => m.info.role === "assistant")
        if (lastAssistant) {
          messageID = lastAssistant.info.id
          if (lastNotified === messageID) return
          const text = lastAssistant.parts
            .filter((p) => p.type === "text")
            .map((p) => (p as { text: string }).text)
            .join(" ")
          const stripped = stripMarkdown(text)
          if (stripped) summary = stripped
        }
      } catch (err) {
        console.error("[ai-ntfy-ping] could not fetch session messages:", err)
      }

      const topic = process.env.NTFY_TOPIC ?? "opencode_status"
      const base = process.env.NTFY_BASE ?? "https://ntfy.sh"
      const url = `${base.replace(/\/$/, "")}/${topic}`
      const body = summary.length > 400 ? `${summary.slice(0, 397)}...` : summary

      try {
        const headers: Record<string, string> = {
          Title: "AI response ready",
          Priority: "high",
          Tags: "white_check_mark,computer",
        }
        if (process.env.NTFY_TOKEN) {
          headers.Authorization = `Bearer ${process.env.NTFY_TOKEN}`
        }
        await fetch(url, { method: "POST", headers, body })
        if (messageID) lastNotified = messageID
      } catch (err) {
        console.error("[ai-ntfy-ping] notification failed:", err)
      }
    },
  }
}