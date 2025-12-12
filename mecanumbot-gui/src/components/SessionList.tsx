type Session = {
  id: string
  name: string
  startedAt: string
  endedAt?: string
  sizeBytes?: number
  downloadUrl?: string
}

type Props = {
  sessions: Session[]
  onDownload?: (session: Session) => void
}

function formatSize(bytes?: number) {
  if (!bytes && bytes !== 0) return "—"
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

function formatTime(iso?: string) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

export default function SessionList({ sessions, onDownload }: Props) {
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 16,
  }

  const btn: React.CSSProperties = {
    borderRadius: 8,
    padding: "6px 10px",
    fontSize: 11,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
  }

  return (
    <div style={card}>
      <h3 style={{ margin: 0, fontSize: 14 }}>Sessions</h3>

      {sessions.length === 0 ? (
        <p style={{ marginTop: 10, fontSize: 11, opacity: 0.7 }}>
          No sessions yet.
        </p>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
          {sessions.map((s) => (
            <div
              key={s.id}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(18px)",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: 10, opacity: 0.65, marginTop: 4 }}>
                  Start: {formatTime(s.startedAt)}
                </div>
                <div style={{ fontSize: 10, opacity: 0.65 }}>
                  End: {formatTime(s.endedAt)}
                </div>
                <div style={{ fontSize: 10, opacity: 0.65 }}>
                  Size: {formatSize(s.sizeBytes)}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                {s.downloadUrl ? (
                  <a href={s.downloadUrl} style={btn as React.CSSProperties}>
                    Download
                  </a>
                ) : (
                  <button style={btn} onClick={() => onDownload?.(s)}>
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export type { Session }
