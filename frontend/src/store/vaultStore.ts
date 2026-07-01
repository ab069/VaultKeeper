import { create } from 'zustand'
import axios from 'axios'
import { useAuthStore } from './authStore'

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${useAuthStore.getState().token}` },
})

interface VaultState {
  secrets: any[]
  auditLogs: any[]
  cryptoResult: string | null
  stats: any | null
  loading: boolean
  fetchSecrets: () => Promise<void>
  fetchAudit: () => Promise<void>
  fetchStats: () => Promise<void>
  storeSecret: (data: any) => Promise<void>
  encrypt: (plaintext: string) => Promise<void>
  decrypt: (ciphertext: string, key: string) => Promise<void>
  rotateSecret: (secretId: number) => Promise<void>
}

export const useVaultStore = create<VaultState>((set) => ({
  secrets: [],
  auditLogs: [],
  cryptoResult: null,
  stats: null,
  loading: false,
  fetchSecrets: async () => {
    set({ loading: true })
    const { data } = await axios.get('/api/secrets', authHeaders())
    set({ secrets: data.secrets, loading: false })
  },
  fetchAudit: async () => {
    const { data } = await axios.get('/api/audit', authHeaders())
    set({ auditLogs: data })
  },
  fetchStats: async () => {
    const { data } = await axios.get('/api/audit/stats', authHeaders())
    set({ stats: data })
  },
  storeSecret: async (secretData) => {
    await axios.post('/api/secrets', secretData, authHeaders())
    const { data } = await axios.get('/api/secrets', authHeaders())
    set({ secrets: data.secrets })
  },
  encrypt: async (plaintext) => {
    const { data } = await axios.post('/api/crypto/encrypt', { plaintext }, authHeaders())
    set({ cryptoResult: `Encrypted: ${data.result}\nKey: ${data.key}` })
  },
  decrypt: async (ciphertext, key) => {
    const { data } = await axios.post('/api/crypto/decrypt', { ciphertext, key }, authHeaders())
    set({ cryptoResult: `Decrypted: ${data.result}` })
  },
  rotateSecret: async (secretId) => {
    await axios.post('/api/secrets/rotate', { secret_id: secretId }, authHeaders())
    const { data } = await axios.get('/api/secrets', authHeaders())
    set({ secrets: data.secrets })
  },
}))
