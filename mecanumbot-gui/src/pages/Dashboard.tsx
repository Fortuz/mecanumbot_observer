import BatteryCard from "../components/BatteryCard"
import ConnectionBadge from "../components/ConnectionBadge"
import OdomCard from "../components/OdomCard"
import { useRobot } from "../hook/useRobot"

export default function Dashboard() {
  const { state } = useRobot()

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <ConnectionBadge state={state} />
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        <BatteryCard battery={state.battery} />
        <OdomCard odom={state.odom} />
      </div>
    </div>
  )
}
