import { create } from 'zustand'

export interface AuditEvent {
  action: string
  resource: string
  timestamp: string
}

interface WsState {
  events: AuditEvent[]
  connected: boolean
  addEvent: (event: AuditEvent) => void
  setConnected: (connected: boolean) => void
}

export const useWsStore = create<WsState>((set) => ({
  events: [],
  connected: false,
  addEvent: (event) => set((s) => ({ events: [event, ...s.events].slice(0, 100) })),
  setConnected: (connected) => set({ connected }),
}))
