import type { RobotClient } from "./robotClient"
import { createMockClient } from "./mockClient"
import { createRosbridgeClient } from "./rosbridgeClient"

export function createClient(): RobotClient {
  const rawMode = (localStorage.getItem("mb_mode") ?? "ros").trim()
  const mode = rawMode === "ros" ? "ros" : "mock"

  const url = (localStorage.getItem("mb_ws_url") ?? "ws://localhost:9090").trim()
  const ns = (localStorage.getItem("mb_ns") ?? "/mecanumbot").trim()
  // ns can be "" on purpose for root topics

  if (mode === "ros") {
    return createRosbridgeClient({ url, namespace: ns })
  }

  return createMockClient()
}
