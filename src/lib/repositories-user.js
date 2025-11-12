import { 
  addDoc, 
  collection, 
  serverTimestamp, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc,
  where
} from 'firebase/firestore'
import { db } from './firebase'
import { getAuth } from 'firebase/auth'

// Função auxiliar para obter o ID do usuário atual
function getCurrentUserId() {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    throw new Error('Usuário não autenticado')
  }
  return user.uid
}

// Função auxiliar para obter referência de coleção do usuário
function getUserCollection(collectionName) {
  const userId = getCurrentUserId()
  return collection(db, 'users', userId, collectionName)
}

export async function addTransaction({ tipo, valor, descricao, data, categoria, conta, status }) {
  if (!tipo || !descricao || !data || !categoria || !conta) throw new Error('Campos obrigatórios ausentes')
  const valorNum = Number(valor)
  if (!Number.isFinite(valorNum) || valorNum <= 0) throw new Error('Valor inválido')
  
  try {
    return addDoc(getUserCollection('transactions'), {
      tipo, valor: valorNum, descricao, data, categoria, conta, status: status || 'pendente', createdAt: serverTimestamp(),
    })
  } catch (error) {
    if (error.code === 'permission-denied') {
      // Fallback para LocalStorage quando não há permissão no Firebase
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      const newTransaction = { 
        id: crypto.randomUUID(), 
        tipo, 
        valor: valorNum, 
        descricao, 
        data, 
        categoria, 
        conta, 
        status: status || 'pendente',
        createdAt: new Date().toISOString() 
      }
      transactions.push(newTransaction)
      localStorage.setItem('transactions', JSON.stringify(transactions))
      return { id: newTransaction.id }
    }
    throw error
  }
}

export async function addAccount({ name, type, balance }) {
  if (!name || !type) throw new Error('Nome e tipo são obrigatórios')
  const balanceNum = balance === undefined || balance === '' ? null : Number(balance)
  if (balanceNum !== null && (!Number.isFinite(balanceNum) || balanceNum < 0)) throw new Error('Saldo inválido')
  
  try {
    return addDoc(getUserCollection('accounts'), {
      name, type, balance: balanceNum, createdAt: serverTimestamp(),
    })
  } catch (error) {
    if (error.code === 'permission-denied') {
      // Fallback para LocalStorage
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]')
      const newAccount = { 
        id: crypto.randomUUID(), 
        name, 
        type, 
        balance: balanceNum,
        createdAt: new Date().toISOString() 
      }
      accounts.push(newAccount)
      localStorage.setItem('accounts', JSON.stringify(accounts))
      return { id: newAccount.id }
    }
    throw error
  }
}

export async function addSubscription({ name, amount, frequency, dueDay, category }) {
  if (!name || !frequency || !dueDay || !category) throw new Error('Campos obrigatórios ausentes')
  const amountNum = Number(amount)
  const due = Number(dueDay)
  if (!Number.isFinite(amountNum) || amountNum <= 0) throw new Error('Valor inválido')
  if (!Number.isInteger(due) || due < 1 || due > 31) throw new Error('Dia inválido')
  
  try {
    return addDoc(getUserCollection('subscriptions'), {
      name, amount: amountNum, frequency, dueDay: due, category, createdAt: serverTimestamp(),
    })
  } catch (error) {
    if (error.code === 'permission-denied') {
      // Fallback para LocalStorage
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]')
      const newSubscription = { 
        id: crypto.randomUUID(), 
        name, 
        amount: amountNum, 
        frequency, 
        dueDay: due, 
        category,
        createdAt: new Date().toISOString() 
      }
      subscriptions.push(newSubscription)
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions))
      return { id: newSubscription.id }
    }
    throw error
  }
}

export async function listTransactions() {
  try {
    const q = query(getUserCollection('transactions'), orderBy('data', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      return JSON.parse(localStorage.getItem('transactions') || '[]')
    }
    throw error
  }
}

export function watchTransactions(callback) {
  try {
    const q = query(getUserCollection('transactions'), orderBy('data', 'desc'))
    return onSnapshot(q, 
      snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        callback(items)
      },
      error => {
        if (error.code === 'permission-denied') {
          console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
          const items = JSON.parse(localStorage.getItem('transactions') || '[]')
          callback(items)
          return () => {}
        }
        console.error('Erro no snapshot:', error)
        callback([])
      }
    )
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      const items = JSON.parse(localStorage.getItem('transactions') || '[]')
      callback(items)
      return () => {}
    }
    console.error('Erro ao configurar snapshot:', error)
    callback([])
    return () => {}
  }
}

export async function addCategory({ name, type, icon, color }) {
  if (!name || !type) throw new Error('Nome e tipo são obrigatórios')
  if (!icon) throw new Error('Ícone é obrigatório')
  if (!color || !/^#[0-9A-F]{6}$/i.test(color)) throw new Error('Cor inválida')
  
  try {
    return await addDoc(getUserCollection('categories'), {
      name, type, icon, color, createdAt: serverTimestamp(),
    })
  } catch (error) {
    if (error.code === 'permission-denied') {
      // Fallback para LocalStorage quando não há permissão no Firebase
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      const categories = JSON.parse(localStorage.getItem('categories') || '[]')
      const newCategory = { 
        id: crypto.randomUUID(), 
        name, 
        type, 
        icon, 
        color, 
        createdAt: new Date().toISOString() 
      }
      categories.push(newCategory)
      localStorage.setItem('categories', JSON.stringify(categories))
      return { id: newCategory.id }
    }
    throw error
  }
}

export async function updateCategory(id, { name, type, icon, color }) {
  if (!id) throw new Error('ID da categoria é obrigatório')
  if (!name || !type) throw new Error('Nome e tipo são obrigatórios')
  if (!icon) throw new Error('Ícone é obrigatório')
  if (!color || !/^#[0-9A-F]{6}$/i.test(color)) throw new Error('Cor inválida')
  
  try {
    const { updateDoc, doc } = await import('firebase/firestore')
    const userCollection = getUserCollection('categories')
    return await updateDoc(doc(userCollection, id), {
      name, type, icon, color, updatedAt: serverTimestamp(),
    })
  } catch (error) {
    if (error.code === 'permission-denied') {
      // Fallback para LocalStorage quando não há permissão no Firebase
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      const categories = JSON.parse(localStorage.getItem('categories') || '[]')
      const index = categories.findIndex(c => c.id === id)
      if (index === -1) throw new Error('Categoria não encontrada')
      
      categories[index] = { ...categories[index], name, type, icon, color, updatedAt: new Date().toISOString() }
      localStorage.setItem('categories', JSON.stringify(categories))
      return { id }
    }
    throw error
  }
}

export async function deleteCategory(id) {
  if (!id) throw new Error('ID da categoria é obrigatório')
  
  try {
    const { deleteDoc, doc } = await import('firebase/firestore')
    const userCollection = getUserCollection('categories')
    return await deleteDoc(doc(userCollection, id))
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      const categories = JSON.parse(localStorage.getItem('categories') || '[]')
      const filteredCategories = categories.filter(c => c.id !== id)
      localStorage.setItem('categories', JSON.stringify(filteredCategories))
      return { id }
    }
    throw error
  }
}

export async function listCategories() {
  try {
    const q = query(getUserCollection('categories'), orderBy('name', 'asc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      return JSON.parse(localStorage.getItem('categories') || '[]')
    }
    throw error
  }
}

export function watchCategories(callback) {
  try {
    const q = query(getUserCollection('categories'), orderBy('name', 'asc'))
    return onSnapshot(q, 
      snap => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        callback(items)
      },
      error => {
        if (error.code === 'permission-denied') {
          console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
          const items = JSON.parse(localStorage.getItem('categories') || '[]')
          callback(items)
          return () => {}
        }
        console.error('Erro no snapshot:', error)
        callback([])
      }
    )
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      const items = JSON.parse(localStorage.getItem('categories') || '[]')
      callback(items)
      return () => {}
    }
    console.error('Erro ao configurar snapshot:', error)
    callback([])
    return () => {}
  }
}

export async function seedTransactions() {
  const exemplos = [
    { tipo: 'Despesa', valor: 45.9, descricao: 'Almoço', data: '2025-11-10', categoria: 'Alimentação', conta: 'NuConta', status: 'pago' },
    { tipo: 'Receita', valor: 5200, descricao: 'Salário', data: '2025-11-05', categoria: 'Receita', conta: 'NuConta', status: 'pago' },
    { tipo: 'Despesa', valor: 18.5, descricao: 'Uber', data: '2025-11-11', categoria: 'Transporte', conta: 'Carteira', status: 'pago' },
  ]
  
  try {
    await Promise.all(exemplos.map(e => addTransaction(e)))
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.warn('Sem permissão no Firebase, usando LocalStorage como fallback')
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
      const newTransactions = [...transactions, ...exemplos.map(e => ({
        ...e,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      }))]
      localStorage.setItem('transactions', JSON.stringify(newTransactions))
    } else {
      throw error
    }
  }
}