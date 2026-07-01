import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Register() {
  const register = useAuthStore((s) => s.register)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register(email, username, password)
      navigate('/login')
    } catch {
      setError('Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-8 h-8" style={{ color: '#eab308' }} />
          <span className="text-2xl font-bold">
            <span style={{ color: '#eab308' }}>Vault</span>Keeper
          </span>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-center">Create Account</h2>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
            required
          />
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded text-sm font-medium text-black transition-colors hover:opacity-90"
            style={{ backgroundColor: '#eab308' }}
          >
            Register
          </button>
          <p className="text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link to="/login" className="hover:underline" style={{ color: '#eab308' }}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
