import type { RobotState } from "../types/robot"

type Props = {
  state?: RobotState
  connected?: boolean
  lastSeenMs?: number
  warnAfterMs?: number
}

export default function ConnectionBadge({
  state,
  connected,
  lastSeenMs,
  warnAfterMs = 800,
}: Props) {
  const isConnected = connected ?? state?.connected ?? false
  const age = lastSeenMs ?? state?.lastSeenMs ?? Number.POSITIVE_INFINITY

  const healthy = isConnected && age <= warnAfterMs

  const label = healthy
    ? "Connected"
    : isConnected
    ? "Unstable"
    : "Disconnected"

  const sub =
    age !== Number.POSITIVE_INFINITY ? `${Math.round(age)}ms` : "no data"

  const style: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 11,
    border: "1px solid",
    backdropFilter: "blur(18px)",
    background: healthy
      ? "rgba(80, 200, 120, 0.12)"
      : isConnected
      ? "rgba(255, 195, 0, 0.10)"
      : "rgba(255, 80, 80, 0.10)",
    borderColor: healthy
      ? "rgba(80, 200, 120, 0.45)"
      : isConnected
      ? "rgba(255, 195, 0, 0.45)"
      : "rgba(255, 80, 80, 0.45)",
    color: "#fff",
  }

  const dotStyle: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: healthy ? "#52d07c" : isConnected ? "#ffc300" : "#ff5050",
    boxShadow: healthy
      ? "0 0 10px rgba(82, 208, 124, 0.9)"
      : isConnected
      ? "0 0 10px rgba(255, 195, 0, 0.8)"
      : "0 0 10px rgba(255, 80, 80, 0.8)",
  }

  return (
    <span style={style} title={`Last update: ${sub}`}>
      <span style={dotStyle} />
      <span>{label}</span>
      <span style={{ opacity: 0.7 }}>• {sub}</span>
    </span>
  )
}
