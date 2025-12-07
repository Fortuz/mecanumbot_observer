import type { RobotState } from "../types/robot"

type Props = {
  battery: RobotState["battery"]
}

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n))
}

export default function BatteryCard({ battery }: Props) {
  const percent = clamp(battery?.percent ?? 0)
  const voltage = battery?.voltage

  const barOuter: React.CSSProperties = {
    height: 8,
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  }

  const barInner: React.CSSProperties = {
    height: "100%",
    width: `${percent}%`,
    borderRadius: 999,
    background:
      percent > 50
        ? "rgba(80, 200, 120, 0.9)"
        : percent > 20
        ? "rgba(255, 195, 0, 0.9)"
        : "rgba(255, 80, 80, 0.9)",
    transition: "width 200ms ease",
  }

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(18px)",
    borderRadius: 14,
    padding: 16,
  }

  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: 14 }}>Battery</h3>
        <span style={{ fontSize: 12, opacity: 0.8 }}>{percent.toFixed(0)}%</span>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={barOuter}>
          <div style={barInner} />
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          fontSize: 12,
          opacity: 0.85,
        }}
      >
        <div>Voltage: {voltage !== undefined ? `${voltage.toFixed(1)} V` : "—"}</div>
      </div>
    </div>
  )
}
