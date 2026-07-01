import { useEffect } from 'react'
import { Shield, Activity, Clock } from 'lucide-react'
import { useVaultStore } from '../store/vaultStore'

export default function StatsCards() {
  const stats = useVaultStore((s) => s.stats)
  const fetchStats = useVaultStore((s) => s.fetchStats)

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const cards = [
    {
      label: 'Total Secrets',
      value: stats?.total_events != null ? '—' : '—',
      icon: Shield,
      color: '#eab308',
    },
    {
      label: 'Audit Events',
      value: stats?.total_events ?? '—',
      icon: Activity,
      color: '#eab308',
    },
    {
      label: 'Expiring Soon',
      value: '—',
      icon: Clock,
      color: '#eab308',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center gap-4"
        >
          <card.icon className="w-8 h-8 opacity-80" style={{ color: card.color }} />
          <div>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="text-sm text-gray-400">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
