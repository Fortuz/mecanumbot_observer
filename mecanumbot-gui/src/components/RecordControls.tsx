import { useState } from "react"

type Props = {
  isRecording: boolean
  onStart: (name?: string) => void
  onStop: () => void
}

export default function RecordControls({ isRecording, onStart, onStop }: Props) {
  const [name, setName] = useState("")

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 16,
  }

  const btnBase: React.CSSProperties = {
    borderRadius: 10,
    padding: "10px 12px",
    fontSize: 12,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
  }

  return (
    <div style={card}>
      <h3 style={{ margin: 0, fontSize: 14 }}>Recording</h3>
      <p style={{ marginTop: 6, fontSize: 11, opacity: 0.7 }}>
        Start a measurement session and save logs for later download.
      </p>

      <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Session name (optional)"
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            fontSize: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(18px)",
            color: "#fff",
            outline: "none",
          }}
        />

        <div style={{ display: "flex", gap: 8 }}>
          {!isRecording ? (
            <button
              style={{
                ...btnBase,
                background: "rgba(80, 200, 120, 0.18)",
                borderColor: "rgba(80, 200, 120, 0.45)",
              }}
              onClick={() => onStart(name.trim() || undefined)}
            >
              Start
            </button>
          ) : (
            <button
              style={{
                ...btnBase,
                background: "rgba(255, 80, 80, 0.18)",
                borderColor: "rgba(255, 80, 80, 0.45)",
              }}
              onClick={onStop}
            >
              Stop
            </button>
          )}

          <span
            style={{
              fontSize: 11,
              opacity: 0.7,
              alignSelf: "center",
            }}
          >
            Status: {isRecording ? "Recording..." : "Idle"}
          </span>
        </div>
      </div>
    </div>
  )
}
