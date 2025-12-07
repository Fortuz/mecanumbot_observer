// services/ws.ts
import type { RobotState } from "../types/robot"

export function connectStateWS(onState: (s: RobotState) => void) {
  const ws = new WebSocket(`ws://${location.host}/api/ws/state`)
  ws.onmessage = (e) => onState(JSON.parse(e.data))
  return () => ws.close()
}
