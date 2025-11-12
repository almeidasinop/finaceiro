import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Wallet } from 'lucide-react'
import { addAccount } from '../../lib/repositories'

export default function AddAccountDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', type: '', balance: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setMessage(null)
    try {
      setLoading(true)
      await addAccount(form)
      setMessage({ type: 'success', text: 'Conta adicionada' })
      setTimeout(() => setOpen(false), 600)
      setForm({ name: '', type: '', balance: '' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Falha ao salvar' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="btn" aria-haspopup="dialog"><Wallet className="h-4 w-4 mr-2" /> Adicionar Conta</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[420px] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4" aria-label="Adicionar Conta">
          <div className="flex items-center justify-between mb-2">
            <Dialog.Title className="text-lg font-semibold">Adicionar Conta</Dialog.Title>
            <Dialog.Close asChild>
              <button className="btn-muted">Fechar</button>
            </Dialog.Close>
          </div>
          {message && (
            <div className={message.type === 'success' ? 'text-green-700 bg-green-100 border border-green-200 rounded px-3 py-2 mb-3' : 'text-red-700 bg-red-100 border border-red-200 rounded px-3 py-2 mb-3'} role="status" aria-live="polite">{message.text}</div>
          )}
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Nome</label>
              <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" value={form.name} onChange={e=>setForm(f=>({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Tipo</label>
              <select className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" value={form.type} onChange={e=>setForm(f=>({ ...f, type: e.target.value }))} required>
                <option value="">Selecione</option>
                <option>Conta Corrente</option>
                <option>Dinheiro Físico</option>
                <option>Cartão de Crédito</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Saldo Inicial (opcional)</label>
              <input className="mt-1 w-full rounded p-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" type="number" step="0.01" value={form.balance} onChange={e=>setForm(f=>({ ...f, balance: e.target.value }))} />
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

