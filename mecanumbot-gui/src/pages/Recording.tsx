import { useMemo, useState } from "react"
import RecordControls from "../components/RecordControls"
import SessionList, { type Session } from "../components/SessionList"

export default function Recording() {
  const [isRecording, setIsRecording] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])

  const nowIso = useMemo(() => new Date().toISOString(), [])

  function start(name?: string) {
    const id = crypto.randomUUID()
    const session: Session = {
      id,
      name: name ?? `Session ${sessions.length + 1}`,
      startedAt: new Date().toISOString(),
    }
    setSessions((s) => [session, ...s])
    setIsRecording(true)
  }

  function stop() {
    setSessions((s) => {
      const copy = [...s]
      const first = copy[0]
      if (first && !first.endedAt) {
        copy[0] = {
          ...first,
          endedAt: new Date().toISOString(),
          sizeBytes: Math.floor(5000 + Math.random() * 15000),
        }
      }
      return copy
    })
    setIsRecording(false)
  }

  return (
    <div style={{ display: "grid", gap: 16, backdropFilter: "blur(20px)" }}>
      <h1 style={{ margin: 0 }}>Recording</h1>

      <RecordControls isRecording={isRecording} onStart={start} onStop={stop} />

      <SessionList sessions={sessions} />
      <div style={{ fontSize: 10, opacity: 0.5 }}>Mock time: {nowIso}</div>
    </div>
  )
}
