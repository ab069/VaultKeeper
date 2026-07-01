import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useVaultStore } from '../store/vaultStore'

export default function SecretForm() {
  const storeSecret = useVaultStore((s) => s.storeSecret)
  const [name, setName] = useState('')
  const [secretType, setSecretType] = useState('api_key')
  const [value, setValue] = useState('')
  const [rotationDays, setRotationDays] = useState(90)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await storeSecret({ name, secret_type: secretType, value, rotation_days: rotationDays })
    setName('')
    setValue('')
    setSecretType('api_key')
    setRotationDays(90)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
        <Plus className="w-4 h-4" style={{ color: '#eab308' }} /> Store New Secret
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Secret name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
          required
        />
        <select
          value={secretType}
          onChange={(e) => setSecretType(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
        >
          <option value="api_key">API Key</option>
          <option value="password">Password</option>
          <option value="certificate">Certificate</option>
          <option value="env_var">Environment Variable</option>
          <option value="other">Other</option>
        </select>
        <textarea
          placeholder="Secret value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500 md:col-span-2"
          rows={2}
          required
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Rotation (days):</label>
          <input
            type="number"
            value={rotationDays}
            onChange={(e) => setRotationDays(Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm w-24 focus:outline-none focus:border-yellow-500"
            min={1}
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 rounded text-sm font-medium text-black transition-colors hover:opacity-90"
        style={{ backgroundColor: '#eab308' }}
      >
        Store Secret
      </button>
    </form>
  )
}
