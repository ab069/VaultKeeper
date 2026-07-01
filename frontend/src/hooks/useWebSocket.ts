import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/authStore'
import { useWsStore } from '../store/wsStore'

export function useWebSocket() {
  const token = useAuthStore((s) => s.token)
  const addEvent = useWsStore((s) => s.addEvent)
  const setConnected = useWsStore((s) => s.setConnected)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (!token) return

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const ws = new WebSocket(`${protocol}//${host}/ws/events`)
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        addEvent({
          action: data.action || 'unknown',
          resource: data.resource || data.resource_type || '',
          timestamp: data.created_at || new Date().toISOString(),
        })
      } catch {
        // ignore
      }
    }

    return () => {
      ws.close()
    }
  }, [token, addEvent, setConnected])
}
