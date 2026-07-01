import { useState } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { useVaultStore } from '../store/vaultStore'

export default function CryptoPanel() {
  const encrypt = useVaultStore((s) => s.encrypt)
  const decrypt = useVaultStore((s) => s.decrypt)
  const cryptoResult = useVaultStore((s) => s.cryptoResult)
  const [input, setInput] = useState('')
  const [key, setKey] = useState('')

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
        <Lock className="w-4 h-4" style={{ color: '#eab308' }} /> Crypto Tool
      </h3>
      <div className="space-y-3">
        <textarea
          placeholder="Text to encrypt / decrypt"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
          rows={2}
        />
        <input
          placeholder="Encryption key (leave blank to generate)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
        />
        <div className="flex gap-2">
          <button
            onClick={() => encrypt(input)}
            className="flex items-center gap-1 px-3 py-2 rounded text-sm font-medium text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: '#eab308' }}
          >
            <Lock className="w-4 h-4" /> Encrypt
          </button>
          <button
            onClick={() => decrypt(input, key)}
            className="flex items-center gap-1 px-3 py-2 rounded text-sm font-medium border transition-colors hover:bg-gray-800"
            style={{ borderColor: '#eab308', color: '#eab308' }}
          >
            <Unlock className="w-4 h-4" /> Decrypt
          </button>
        </div>
        {cryptoResult && (
          <pre className="bg-gray-950 border border-gray-800 rounded p-3 text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">
            {cryptoResult}
          </pre>
        )}
      </div>
    </div>
  )
}
