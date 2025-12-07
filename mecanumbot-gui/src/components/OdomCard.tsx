import type { RobotState } from "../types/robot"

type Props = {
  odom: RobotState["odom"]
}

function toDeg(rad: number) {
  return (rad * 180) / Math.PI
}

export default function OdomCard({ odom }: Props) {
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(18px)",
    borderRadius: 14,
    padding: 16,
  }

  return (
    <div style={card}>
      <h3 style={{ margin: 0, fontSize: 14 }}>Odometry</h3>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(80px, 1fr))",
          gap: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 10, opacity: 0.6 }}>X</div>
          <div style={{ fontSize: 16 }}>{odom.x.toFixed(2)}</div>
        </div>

        <div>
          <div style={{ fontSize: 10, opacity: 0.6 }}>Y</div>
          <div style={{ fontSize: 16 }}>{odom.y.toFixed(2)}</div>
        </div>

        <div>
          <div style={{ fontSize: 10, opacity: 0.6 }}>Yaw</div>
          <div style={{ fontSize: 16 }}>{odom.yaw.toFixed(2)} rad</div>
          <div style={{ fontSize: 10, opacity: 0.6 }}>
            {toDeg(odom.yaw).toFixed(0)}°
          </div>
        </div>
      </div>
    </div>
  )
}
