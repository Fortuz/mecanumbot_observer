import { useState } from "react"

export default function Camera() {
  const [url, setUrl] = useState("")

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h1 style={{ margin: 0 }}>Camera</h1>

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14,
          padding: 16,
          display: "grid",
          gap: 10,
          maxWidth: 520,
        }}
      >
        <label style={{ fontSize: 12, opacity: 0.8 }}>
          External camera stream URL
        </label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://... or rtsp://..."
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            fontSize: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            color: "#fff",
            outline: "none",
          }}
        />

        {url ? (
          <div
            style={{
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <img
              src={url}
              alt="camera stream"
              style={{ width: "100%", display: "block" }}
            />
          </div>
        ) : (
          <div style={{ fontSize: 11, opacity: 0.6 }}>
            Enter a URL to preview.
          </div>
        )}
      </div>
    </div>
  )
}
