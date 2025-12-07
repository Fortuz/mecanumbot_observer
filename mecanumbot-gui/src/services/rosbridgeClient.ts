import * as ROSLIB from "roslib"
import type { RobotClient, Twist } from "./robotClient"
import type { RobotState } from "../types/robot"

type Config = {
  url: string // ws://<robot-ip>:9090
  namespace?: string // default "/mecanumbot" (can also be "" for root topics)
}

/** Minimal shapes to avoid `any` while staying flexible */
type BatteryStateMsg = {
  voltage?: number
  percentage?: number
}

type OdometryMsg = {
  pose?: {
    pose?: {
      position?: {
        x?: number
        y?: number
      }
      // orientation exists but we skip yaw extraction for now
    }
  }
}

type TwistMsg = {
  linear: { x: number; y: number; z: number }
  angular: { x: number; y: number; z: number }
}

const AGE_TICK_MS = 200

export function createRosbridgeClient(cfg: Config): RobotClient {
  // Normalize namespace:
  // - undefined -> "/mecanumbot"
  // - "" -> root topics
  // - "/mecanumbot/" -> "/mecanumbot"
  const nsRaw = (cfg.namespace ?? "/mecanumbot").trim()
  const ns = nsRaw.replace(/\/$/, "") // remove trailing slash only

  const topicName = (base: string) => {
    const cleanBase = base.replace(/^\//, "")
    if (!ns || ns === "/") return `/${cleanBase}`
    const cleanNs = ns.startsWith("/") ? ns : `/${ns}`
    return `${cleanNs}/${cleanBase}`
  }

  let ros: ROSLIB.Ros | null = null
  const listeners = new Set<(s: RobotState) => void>()

  let batteryTopic: ROSLIB.Topic<BatteryStateMsg> | null = null
  let odomTopic: ROSLIB.Topic<OdometryMsg> | null = null
  let cmdVelTopic: ROSLIB.Topic<TwistMsg> | null = null

  // For connection health age calculation
  let lastSeenAt = 0
  let ageTimer: number | null = null

  // cached latest parts to compose RobotState
  let latest: Partial<RobotState> = {
    connected: false,
    lastSeenMs: Number.POSITIVE_INFINITY,
    battery: { percent: 0, voltage: 0 },
    odom: { x: 0, y: 0, yaw: 0 },
    velocity: { linearX: 0, linearY: 0, angularZ: 0 },
  }

  const client: RobotClient = {
    status: "disconnected",

    connect() {
      if (client.status === "connected" || client.status === "connecting") return
      client.status = "connecting"

      ros = new ROSLIB.Ros({ url: cfg.url })

      ros.on("connection", () => {
        client.status = "connected"
        latest = { ...latest, connected: true }
        emit()

        initPublishers()
        attachSubscriptions()
        startAgeTimer()
      })

      ros.on("close", () => {
        client.status = "disconnected"
        latest = { ...latest, connected: false, lastSeenMs: Number.POSITIVE_INFINITY }
        stopAgeTimer()
        cleanupTopics()
        emit()
      })

      ros.on("error", () => {
        client.status = "error"
        latest = { ...latest, connected: false, lastSeenMs: Number.POSITIVE_INFINITY }
        stopAgeTimer()
        cleanupTopics()
        emit()
      })
    },

    disconnect() {
      ros?.close()
      ros = null

      client.status = "disconnected"
      latest = { ...latest, connected: false, lastSeenMs: Number.POSITIVE_INFINITY }

      stopAgeTimer()
      cleanupTopics()
      emit()
    },

    onState(cb) {
      listeners.add(cb)
      cb(latest as RobotState)
      return () => listeners.delete(cb)
    },

    publishCmd(cmd: Twist) {
      if (!ros || client.status !== "connected") return
      if (!cmdVelTopic) initPublishers()
      if (!cmdVelTopic) return

      const msg: TwistMsg = {
        linear: { x: cmd.linearX, y: cmd.linearY, z: 0 },
        angular: { x: 0, y: 0, z: cmd.angularZ },
      }

      cmdVelTopic.publish(msg)

      // keep UI state in sync
      latest = {
        ...latest,
        velocity: {
          linearX: cmd.linearX,
          linearY: cmd.linearY,
          angularZ: cmd.angularZ,
        },
      }
      emit()
    },

    async startRecording(name?: string) {
      void name
      // implement via Python gateway later
      return crypto.randomUUID()
    },

    async stopRecording(sessionId: string) {
      void sessionId
    },

    async listRecordings() {
      return []
    },
  }

  function emit() {
    const state = latest as RobotState
    listeners.forEach((cb) => cb(state))
  }

  function markSeen() {
    lastSeenAt = performance.now()
    // Update immediately so badge feels responsive
    latest = { ...latest, lastSeenMs: 0 }
  }

  function startAgeTimer() {
    if (ageTimer) return
    ageTimer = window.setInterval(() => {
      const age =
        lastSeenAt > 0 ? Math.max(0, performance.now() - lastSeenAt) : Number.POSITIVE_INFINITY
      latest = { ...latest, lastSeenMs: age }
      emit()
    }, AGE_TICK_MS)
  }

  function stopAgeTimer() {
    if (ageTimer) window.clearInterval(ageTimer)
    ageTimer = null
    lastSeenAt = 0
  }

  function initPublishers() {
    if (!ros || cmdVelTopic) return

    cmdVelTopic = new ROSLIB.Topic({
      ros,
      name: topicName("cmd_vel"),
      messageType: "geometry_msgs/Twist",
    })
  }

  function attachSubscriptions() {
    if (!ros) return

    // BatteryState
    batteryTopic = new ROSLIB.Topic({
      ros,
      name: topicName("battery_state"),
      messageType: "sensor_msgs/BatteryState",
    })

    // Odom
    odomTopic = new ROSLIB.Topic({
      ros,
      name: topicName("odom"),
      messageType: "nav_msgs/Odometry",
    })

    batteryTopic.subscribe((msg: BatteryStateMsg) => {
      markSeen()

      // percent sometimes comes as 0..1 or 0..100 depending on drivers
      const rawPct = msg.percentage ?? 0
      const pct = rawPct <= 1 ? rawPct * 100 : rawPct

      latest = {
        ...latest,
        connected: true,
        battery: {
          percent: Math.max(0, Math.min(100, pct)),
          voltage: msg.voltage ?? 0,
        },
      }
      emit()
    })

    odomTopic.subscribe((msg: OdometryMsg) => {
      markSeen()

      const p = msg.pose?.pose?.position
      latest = {
        ...latest,
        odom: {
          x: p?.x ?? 0,
          y: p?.y ?? 0,
          yaw: 0,
        },
      }
      emit()
    })
  }

  function cleanupTopics() {
    try {
      batteryTopic?.unsubscribe()
    } catch {
      // ignore
    }
    try {
      odomTopic?.unsubscribe()
    } catch {
      // ignore
    }

    batteryTopic = null
    odomTopic = null
    cmdVelTopic = null
  }

  return client
}
