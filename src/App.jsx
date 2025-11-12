import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Accounts from './pages/Accounts.jsx'
import Subscriptions from './pages/Subscriptions.jsx'
import Settings from './pages/Settings.jsx'
import Categorias from './pages/Categorias.jsx'
import Login from './pages/Login.jsx'
import { LayoutWithSidebar } from './components/ui/Sidebar.jsx'
import { AuthProvider, useAuthContext } from './hooks/useAuth.jsx'
import { useEffect } from 'react'

// Componente para proteger rotas privadas
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" replace />
}

// Layout protegido
function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <LayoutWithSidebar>
        {children}
      </LayoutWithSidebar>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rota de Login (pública) */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
        <Route path="/transacoes" element={<ProtectedLayout><Transactions /></ProtectedLayout>} />
        <Route path="/contas" element={<ProtectedLayout><Accounts /></ProtectedLayout>} />
        <Route path="/assinaturas" element={<ProtectedLayout><Subscriptions /></ProtectedLayout>} />
        <Route path="/categorias" element={<ProtectedLayout><Categorias /></ProtectedLayout>} />
        <Route path="/configuracoes" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
        
        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}