import Layout from '../components/Layout'
import StatsCards from '../components/StatsCards'
import SecretForm from '../components/SecretForm'
import CryptoPanel from '../components/CryptoPanel'
import AuditFeed from '../components/AuditFeed'
import SecretList from '../components/SecretList'
import { useWebSocket } from '../hooks/useWebSocket'

export default function Dashboard() {
  useWebSocket()

  return (
    <Layout>
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SecretForm />
          <CryptoPanel />
          <AuditFeed />
        </div>
        <div>
          <SecretList />
        </div>
      </div>
    </Layout>
  )
}
