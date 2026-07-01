import { useEffect, useState } from 'react'
import { Key, Trash2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { useVaultStore } from '../store/vaultStore'

export default function SecretList() {
  const secrets = useVaultStore((s) => s.secrets)
  const fetchSecrets = useVaultStore((s) => s.fetchSecrets)
  const rotateSecret = useVaultStore((s) => s.rotateSecret)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    fetchSecrets()
  }, [fetchSecrets])

  if (secrets.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center text-gray-500">
        No secrets stored yet.
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Key className="w-4 h-4" style={{ color: '#eab308' }} /> Stored Secrets
        </h3>
      </div>
      {secrets.map((secret) => (
        <div key={secret.id} className="border-b border-gray-800 last:border-0">
          <button
            onClick={() => setExpandedId(expandedId === secret.id ? null : secret.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              {expandedId === secret.id ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
              <div>
                <div className="font-medium">{secret.name}</div>
                <div className="text-xs text-gray-500">{secret.secret_type}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>Rotated: {secret.last_rotated ? new Date(secret.last_rotated).toLocaleDateString() : 'Never'}</span>
              <button
                onClick={(e) => { e.stopPropagation(); rotateSecret(secret.id) }}
                className="p-1 hover:text-yellow-500 transition-colors"
                title="Rotate"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation() }}
                className="p-1 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </button>
          {expandedId === secret.id && (
            <div className="px-4 pb-4 pt-0 text-sm text-gray-400 space-y-1">
              <p>Type: {secret.secret_type}</p>
              <p>Rotation: {secret.rotation_days} days</p>
              {secret.expires_at && <p>Expires: {new Date(secret.expires_at).toLocaleDateString()}</p>}
              <p>Created: {new Date(secret.created_at).toLocaleString()}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
