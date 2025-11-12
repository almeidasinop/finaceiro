import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

export function FirebaseStatus() {
  const [status, setStatus] = useState({
    auth: 'checking',
    firestore: 'checking',
    user: null,
    error: null
  })

  useEffect(() => {
    const checkFirebaseStatus = async () => {
      try {
        // Verificar autenticação
        const auth = getAuth()
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            setStatus(prev => ({ ...prev, auth: 'connected', user: user.email }))
            
            // Testar Firestore com usuário autenticado
            try {
              const userId = user.uid
              const querySnapshot = await getDocs(collection(db, 'users', userId, 'test'))
              setStatus(prev => ({ 
                ...prev, 
                firestore: 'connected',
                error: null 
              }))
            } catch (firestoreError) {
              console.error('Firestore error:', firestoreError.code, firestoreError.message)
              setStatus(prev => ({ 
                ...prev, 
                firestore: 'error',
                error: `Firestore: ${firestoreError.code}` 
              }))
            }
          } else {
            setStatus(prev => ({ 
              ...prev, 
              auth: 'not-authenticated',
              user: null 
            }))
          }
        })
      } catch (error) {
        console.error('Firebase status error:', error)
        setStatus(prev => ({ 
          ...prev, 
          auth: 'error',
          error: error.message 
        }))
      }
    }

    checkFirebaseStatus()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-500'
      case 'error': return 'text-red-500'
      case 'not-authenticated': return 'text-yellow-500'
      case 'checking': return 'text-gray-500'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return '✅'
      case 'error': return '❌'
      case 'not-authenticated': return '⚠️'
      case 'checking': return '⏳'
      default: return '❓'
    }
  }

  if (status.auth === 'checking' && status.firestore === 'checking') {
    return null // Não mostrar enquanto estiver carregando
  }

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg z-50">
      <div className="text-xs space-y-1">
        <div className={`flex items-center gap-2 ${getStatusColor(status.auth)}`}>
          <span>{getStatusIcon(status.auth)}</span>
          <span>Auth: {status.auth}</span>
          {status.user && <span className="text-gray-600">({status.user})</span>}
        </div>
        <div className={`flex items-center gap-2 ${getStatusColor(status.firestore)}`}>
          <span>{getStatusIcon(status.firestore)}</span>
          <span>Firestore: {status.firestore}</span>
        </div>
        {status.error && (
          <div className="text-red-500 text-xs mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
            {status.error}
          </div>
        )}
      </div>
      
      {status.firestore === 'error' && (
        <div className="mt-2 text-xs text-gray-600">
          <p>💡 Verifique as regras no Firebase Console:</p>
          <p>1. Authentication > Sign-in method > Enable Email/Password</p>
          <p>2. Firestore Database > Rules > Apply user-based rules</p>
        </div>
      )}
    </div>
  )
}