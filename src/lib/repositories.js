import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function addTransaction({ tipo, valor, descricao, data, categoria, conta, status }) {
  if (!tipo || !descricao || !data || !categoria || !conta) throw new Error('Campos obrigatórios ausentes')
  const valorNum = Number(valor)
  if (!Number.isFinite(valorNum) || valorNum <= 0) throw new Error('Valor inválido')
  return addDoc(collection(db, 'transactions'), {
    tipo, valor: valorNum, descricao, data, categoria, conta, status: status || 'pendente', createdAt: serverTimestamp(),
  })
}

export async function addAccount({ name, type, balance }) {
  if (!name || !type) throw new Error('Nome e tipo são obrigatórios')
  const balanceNum = balance === undefined || balance === '' ? null : Number(balance)
  if (balanceNum !== null && (!Number.isFinite(balanceNum) || balanceNum < 0)) throw new Error('Saldo inválido')
  return addDoc(collection(db, 'accounts'), {
    name, type, balance: balanceNum, createdAt: serverTimestamp(),
  })
}

export async function addSubscription({ name, amount, frequency, dueDay, category }) {
  if (!name || !frequency || !dueDay || !category) throw new Error('Campos obrigatórios ausentes')
  const amountNum = Number(amount)
  const due = Number(dueDay)
  if (!Number.isFinite(amountNum) || amountNum <= 0) throw new Error('Valor inválido')
  if (!Number.isInteger(due) || due < 1 || due > 31) throw new Error('Dia inválido')
  return addDoc(collection(db, 'subscriptions'), {
    name, amount: amountNum, frequency, dueDay: due, category, createdAt: serverTimestamp(),
  })
}

