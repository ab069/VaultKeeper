import { create } from 'zustand'
import axios from 'axios'

interface AuthState {
  token: string | null
  user: any | null
  login: (username: string, password: string) => Promise<void>
  register: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('vaultkeeper-auth'),
  user: null,
  login: async (username, password) => {
    const { data } = await axios.post('/api/auth/login', { username, password })
    localStorage.setItem('vaultkeeper-auth', data.access_token)
    set({ token: data.access_token })
  },
  register: async (email, username, password) => {
    const { data } = await axios.post('/api/auth/register', { email, username, password })
    return data
  },
  logout: () => {
    localStorage.removeItem('vaultkeeper-auth')
    set({ token: null, user: null })
  },
}))
