// services/mockState.ts
import type { RobotState } from "../types/robot"

export const mockState: RobotState = {
  connected: true,
  lastSeenMs: 120,
  battery: { percent: 76, voltage: 24.1 },
  odom: { x: 1.2, y: -0.4, yaw: 0.62 },
  velocity: { linearX: 0.1, linearY: 0.0, angularZ: 0.2 },
}
