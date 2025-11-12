import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuth.jsx'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react'

export default function Login() {
  const { user, login, register, loading, error, clearError } = useAuthContext()
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  })

  // Se já estiver logado, redirecionar para dashboard
  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    try {
      if (isRegister) {
        await register(formData.email, formData.password, formData.displayName)
      } else {
        await login(formData.email, formData.password)
      }
    } catch (error) {
      // Erro já está tratado no contexto
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) clearError()
  }

  const toggleMode = () => {
    setIsRegister(!isRegister)
    clearError()
    setFormData({ email: '', password: '', displayName: '' })
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--accent)] rounded-full mb-4">
            <span className="text-2xl font-bold text-[var(--on-accent)]">F</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Financeiro</h1>
          <p className="text-[var(--text-muted)]">
            {isRegister ? 'Crie sua conta' : 'Entre na sua conta'}
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-[var(--surface)] rounded-lg shadow-lg p-6 border border-[var(--border)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mensagem de Erro */}
            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
                {error}
              </div>
            )}

            {/* Campo Nome (apenas no registro) */}
            {isRegister && (
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-[var(--text)] mb-1">
                  Nome
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[var(--text-muted)]" />
                  </div>
                  <input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--focus-ring)]"
                    placeholder="Seu nome"
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text)] mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[var(--text-muted)]" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--focus-ring)]"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text)] mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[var(--text-muted)]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-[var(--border)] rounded-md bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-[var(--focus-ring)]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[var(--on-accent)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--on-accent)]"></div>
                  Processando...
                </>
              ) : (
                <>
                  {isRegister ? (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Criar Conta
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Entrar
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Link para alternar entre login/registro */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] focus:outline-none focus:underline"
            >
              {isRegister 
                ? 'Já tem uma conta? Faça login' 
                : 'Não tem uma conta? Registre-se'
              }
            </button>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Ao entrar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>
      </div>
    </div>
  )
}