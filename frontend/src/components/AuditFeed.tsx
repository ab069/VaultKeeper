import { Activity } from 'lucide-react'
import { useWsStore } from '../store/wsStore'

export default function AuditFeed() {
  const events = useWsStore((s) => s.events)
  const connected = useWsStore((s) => s.connected)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: '#eab308' }} /> Audit Feed
        </h3>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${connected ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}
        >
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-gray-500">No events yet. Interact with the vault to see audit events.</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {events.map((evt, i) => (
            <div key={i} className="flex items-center gap-2 text-xs bg-gray-800/50 rounded px-3 py-2">
              <span className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300 uppercase">{evt.action}</span>
              <span className="text-gray-400">{evt.resource}</span>
              <span className="text-gray-600 ml-auto">{new Date(evt.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
