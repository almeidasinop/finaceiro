import { useState, useEffect, createContext, useContext } from 'react'
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext()

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Registrar novo usuário
  const register = async (email, password, displayName) => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Atualizar nome do usuário
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
      
      return userCredential.user
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Fazer login
  const login = async (email, password) => {
    try {
      setError(null)
      console.log('🔐 Tentando fazer login com:', email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Login bem-sucedido! UID:', userCredential.user.uid)
      return userCredential.user
    } catch (error) {
      console.error('❌ Erro no login:', error.code, '-', error.message)
      setError(error.message)
      throw error
    }
  }

  // Fazer logout
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // Limpar erro
  const clearError = () => setError(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('👤 Estado de autenticação mudou:', currentUser ? currentUser.email : 'null')
      setUser(currentUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}