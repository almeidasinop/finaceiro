import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Accounts from './pages/Accounts.jsx'
import Subscriptions from './pages/Subscriptions.jsx'
import Settings from './pages/Settings.jsx'
import { LayoutWithSidebar } from './components/ui/Sidebar.jsx'

export default function App() {
  return (
    <LayoutWithSidebar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transacoes" element={<Transactions />} />
        <Route path="/contas" element={<Accounts />} />
        <Route path="/assinaturas" element={<Subscriptions />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Routes>
    </LayoutWithSidebar>
  )
}
