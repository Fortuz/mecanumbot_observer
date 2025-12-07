import type { RobotClient, Twist } from "./robotClient"
import type { RobotState } from "../types/robot"
import { mockState } from "./mockState"

export function createMockClient(): RobotClient {
  const listeners = new Set<(s: RobotState) => void>()
  let interval: number | null = null

  const client: RobotClient = {
    status: "connected",

    connect() {
      client.status = "connected"
      if (interval) return

      interval = window.setInterval(() => {
        const s: RobotState = {
          ...mockState,
          lastSeenMs: Math.floor(Math.random() * 120),
          battery: {
            ...mockState.battery,
            percent: Math.max(
              0,
              mockState.battery.percent - Math.random() * 0.02
            ),
          },
        }

        listeners.forEach((cb) => cb(s))
      }, 250)
    },

    disconnect() {
      client.status = "disconnected"
      if (interval) window.clearInterval(interval)
      interval = null
    },

    onState(cb) {
      listeners.add(cb)
      cb(mockState)
      return () => listeners.delete(cb)
    },

    publishCmd(cmd: Twist) {
      // Use param to satisfy strict no-unused-vars
      void cmd
      // no-op in mock
    },

    async startRecording(name?: string) {
      void name
      return crypto.randomUUID()
    },

    async stopRecording(id: string) {
      void id
    },

    async listRecordings() {
      return []
    },
  }

  client.connect()
  return client
}
