import { useEffect, useMemo, useState } from "react"

const LS_KEY = "mb_cam_url"
const DEFAULT_URL =
  "http://192.168.1.105:8080/stream?topic=/camera/image_color"

export default function Camera() {
  const [url, setUrl] = useState(() => {
    const saved = localStorage.getItem(LS_KEY)
    return (saved && saved.trim()) || DEFAULT_URL
  })

  const [error, setError] = useState<string | null>(null)

  // Keep a trimmed version for actual usage
  const safeUrl = useMemo(() => url.trim(), [url])

  useEffect(() => {
    if (safeUrl) localStorage.setItem(LS_KEY, safeUrl)
  }, [safeUrl])

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        width: "100%",
        justifyItems: "center",
      }}
    >
      <h1 style={{ margin: 0, textAlign: "center", width: "100%" }}>Camera</h1>

      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14,
          padding: 20,
          display: "grid",
          gap: 12,
          justifyItems: "center",
          backdropFilter: "blur(20px)",
        }}
      >
        <label style={{ fontSize: 12, opacity: 0.8, textAlign: "center" }}>
          External camera stream URL
        </label>


        <input
          value={url}
          onChange={(e) => {
            setError(null)
            setUrl(e.target.value)
          }}
          placeholder={DEFAULT_URL}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 10,
            fontSize: 12,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            color: "#fff",
            outline: "none",
          }}
        />

        {/* Preview */}
        {safeUrl ? (
          <div
            style={{
              width: "100%",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(0,0,0,0.2)",
              aspectRatio: "16 / 9",
            }}
          >
            <img
              key={safeUrl}
              src={safeUrl}
              alt="camera stream"
              onLoad={() => setError(null)}
              onError={() =>
                setError(
                  "Preview failed to load. Check URL, network access, and that web_video_server is reachable."
                )
              }
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
          </div>
        ) : (
          <div style={{ fontSize: 11, opacity: 0.6, textAlign: "center" }}>
            Enter the MJPEG stream URL.
          </div>
        )}

        {error && (
          <div style={{ fontSize: 11, color: "#ff8080", textAlign: "center" }}>{error}</div>
        )}

        <div style={{ fontSize: 10, opacity: 0.5, textAlign: "center" }}>
          Run <code>web_video_server</code> on the host machine and use the
          stream URL.
        </div>
      </div>
    </div>
  )
}
