import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { CreditCard } from 'lucide-react'
import { addSubscription } from '../../lib/repositories'

export default function AddSubscriptionDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', amount: '', frequency: 'Mensal', dueDay: '', category: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setMessage(null)
    try {
      setLoading(true)
      await addSubscription(form)
      setMessage({ type: 'success', text: 'Assinatura adicionada' })
      setTimeout(() => setOpen(false), 600)
      setForm({ name: '', amount: '', frequency: 'Mensal', dueDay: '', category: '' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Falha ao salvar' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn" aria-haspopup="dialog"><CreditCard className="h-4 w-4 mr-2" /> Adicionar Assinatura</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[480px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4" aria-label="Adicionar Assinatura">
          <div className="flex items-center justify-between mb-2">
            <Dialog.Title className="text-lg font-semibold">Adicionar Assinatura</Dialog.Title>
            <Dialog.Close asChild>
              <button className="btn-muted">Fechar</button>
            </Dialog.Close>
          </div>
          {message && (
            <div className={message.type === 'success' ? 'text-green-700 bg-green-100 border border-green-200 rounded px-3 py-2 mb-3' : 'text-red-700 bg-red-100 border border-red-200 rounded px-3 py-2 mb-3'} role="status" aria-live="polite">{message.text}</div>
          )}
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Serviço</label>
              <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" value={form.name} onChange={e=>setForm(f=>({ ...f, name: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[color:var(--text-muted)]">Valor (R$)</label>
                <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" type="number" step="0.01" value={form.amount} onChange={e=>setForm(f=>({ ...f, amount: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--text-muted)]">Frequência</label>
                <select className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" value={form.frequency} onChange={e=>setForm(f=>({ ...f, frequency: e.target.value }))}>
                  <option>Mensal</option>
                  <option>Anual</option>
                  <option>Semanal</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[color:var(--text-muted)]">Dia de Vencimento</label>
                <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" type="number" min="1" max="31" value={form.dueDay} onChange={e=>setForm(f=>({ ...f, dueDay: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm text-[color:var(--text-muted)]">Categoria</label>
                <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" value={form.category} onChange={e=>setForm(f=>({ ...f, category: e.target.value }))} required />
              </div>
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

