import { useEffect, useMemo, useState, useCallback } from "react"
import type { RobotState } from "../types/robot"
import type { RobotClient, Twist, ClientStatus } from "../services/robotClient"
import { createClient } from "../services/clientFactory"
import { mockState } from "../services/mockState"

export function useRobot() {
  // Create client once
  const [client] = useState<RobotClient>(() => createClient())

  const [state, setState] = useState<RobotState>(mockState)

  // ✅ Initialize from client without setting inside effect
  const [status, setStatus] = useState<ClientStatus>(client.status)

  const connected = useMemo(() => !!state.connected, [state.connected])

  useEffect(() => {
    client.connect()

    // Update status only when external updates occur
    const off = client.onState((s) => {
      setState(s)

      // Avoid unnecessary renders
      setStatus((prev) => (prev === client.status ? prev : client.status))
    })

    // optional tiny poll to catch status changes without telemetry ticks
    const statusPoll = window.setInterval(() => {
      setStatus((prev) => (prev === client.status ? prev : client.status))
    }, 500)

    return () => {
      off?.()
      window.clearInterval(statusPoll)
      client.disconnect()
      // no setStatus here (keep cleanup lean)
    }
  }, [client])

  const publish = useCallback(
    (cmd: Twist) => {
      client.publishCmd(cmd)
    },
    [client]
  )

  return {
    state,
    status,
    connected,
    publish,
  }
}
