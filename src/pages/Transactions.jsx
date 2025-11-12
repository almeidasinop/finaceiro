import { useState } from 'react'

export default function Transactions() {
  const [type, setType] = useState('despesa')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [category, setCategory] = useState('Alimentação')
  const [account, setAccount] = useState('Carteira')
  const [status, setStatus] = useState('pago')

  const sample = [
    { tipo: 'Despesa', valor: 45.9, descricao: 'Almoço', data: '2025-11-10', categoria: 'Alimentação', conta: 'NuConta', status: 'Pago' },
    { tipo: 'Receita', valor: 5200, descricao: 'Salário', data: '2025-11-05', categoria: 'Receita', conta: 'NuConta', status: 'Pago' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
        <h2 className="text-lg font-semibold mb-3">Adicionar Transação</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0 w-full">
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Tipo</label>
            <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={type} onChange={e=>setType(e.target.value)}>
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Valor (R$)</label>
            <input className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Data</label>
            <input className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm text-[color:var(--text-muted)]">Descrição</label>
            <input className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Ex: Almoço no restaurante X" />
          </div>
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Categoria</label>
            <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={category} onChange={e=>setCategory(e.target.value)}>
              <option>Alimentação</option>
              <option>Transporte</option>
              <option>Moradia</option>
              <option>Salário</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Conta</label>
            <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={account} onChange={e=>setAccount(e.target.value)}>
              <option>NuConta</option>
              <option>Carteira</option>
              <option>Banco do Brasil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Status</label>
            <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button type="button" className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-hover)]">Salvar</button>
          </div>
        </form>
      </div>

      <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
        <h2 className="text-lg font-semibold mb-3">Transações Recentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-[color:var(--text-muted)]">
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Descrição</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4">Categoria</th>
                <th className="py-2 pr-4">Conta</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {sample.map((t, i) => (
                <tr key={i} className="border-t border-[var(--border)] text-[var(--text)]">
                  <td className="py-2 pr-4">{t.tipo}</td>
                  <td className="py-2 pr-4">{t.descricao}</td>
                  <td className="py-2 pr-4">R$ {t.valor.toFixed(2)}</td>
                  <td className="py-2 pr-4">{t.data}</td>
                  <td className="py-2 pr-4">{t.categoria}</td>
                  <td className="py-2 pr-4">{t.conta}</td>
                  <td className="py-2 pr-4">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
