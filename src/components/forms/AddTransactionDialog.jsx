import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Receipt } from 'lucide-react'
import { addTransaction } from '../../lib/repositories'

export default function AddTransactionDialog({ tipo = 'receita' }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ valor: '', descricao: '', data: new Date().toISOString().slice(0,10), categoria: '', conta: '', status: tipo === 'despesa' ? 'pendente' : 'pago' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setMessage(null)
    try {
      setLoading(true)
      await addTransaction({ tipo: tipo === 'receita' ? 'Receita' : 'Despesa', ...form })
      setMessage({ type: 'success', text: 'Salvo com sucesso' })
      setTimeout(() => setOpen(false), 600)
      setForm({ valor: '', descricao: '', data: new Date().toISOString().slice(0,10), categoria: '', conta: '', status: tipo === 'despesa' ? 'pendente' : 'pago' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Falha ao salvar' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn" aria-haspopup="dialog"><Receipt className="h-4 w-4 mr-2" /> {tipo === 'receita' ? 'Adicionar Receita' : 'Adicionar Despesa'}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[480px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4" aria-label={tipo === 'receita' ? 'Adicionar Receita' : 'Adicionar Despesa'}>
          <div className="flex items-center justify-between mb-2">
            <Dialog.Title className="text-lg font-semibold">{tipo === 'receita' ? 'Adicionar Receita' : 'Adicionar Despesa'}</Dialog.Title>
            <Dialog.Close asChild>
              <button className="btn-muted">Fechar</button>
            </Dialog.Close>
          </div>
          {message && (
            <div className={message.type === 'success' ? 'text-green-700 bg-green-100 border border-green-200 rounded px-3 py-2 mb-3' : 'text-red-700 bg-red-100 border border-red-200 rounded px-3 py-2 mb-3'} role="status" aria-live="polite">{message.text}</div>
          )}
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Valor (R$)</label>
              <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" type="number" step="0.01" value={form.valor} onChange={e=>setForm(f=>({ ...f, valor: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Descrição</label>
              <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" value={form.descricao} onChange={e=>setForm(f=>({ ...f, descricao: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[color:var(--text-muted)]">Data</label>
                <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" type="date" value={form.data} onChange={e=>setForm(f=>({ ...f, data: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--text-muted)]">Categoria</label>
                <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" value={form.categoria} onChange={e=>setForm(f=>({ ...f, categoria: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[color:var(--text-muted)]">Conta</label>
                <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" value={form.conta} onChange={e=>setForm(f=>({ ...f, conta: e.target.value }))} required />
              </div>
              {tipo === 'despesa' && (
                <div>
                  <label className="block text-sm text-[color:var(--text-muted)]">Status</label>
                  <select className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" value={form.status} onChange={e=>setForm(f=>({ ...f, status: e.target.value }))}>
                    <option value="pago">Pago</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
              )}
            </div>
            <div>
              <button type="submit" className="btn" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

