export default function Subscriptions() {
  const subs = [
    { name: 'Netflix', amount: 39.9, frequency: 'Mensal', dueDay: 15, category: 'Lazer' },
    { name: 'Água', amount: 72.3, frequency: 'Mensal', dueDay: 10, category: 'Moradia' },
    { name: 'Academia', amount: 99.9, frequency: 'Mensal', dueDay: 3, category: 'Saúde' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
        <h2 className="text-lg font-semibold mb-3">Adicionar Assinatura/Recorrência</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0 w-full">
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Serviço/Descrição</label>
            <input className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" placeholder="Netflix, Aluguel" />
          </div>
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Valor (R$)</label>
            <input className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" type="number" step="0.01" />
          </div>
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Frequência</label>
            <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
              <option>Mensal</option>
              <option>Anual</option>
              <option>Semanal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Dia de Vencimento</label>
            <input className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" type="number" min="1" max="31" />
          </div>
          <div>
            <label className="block text-sm text-[color:var(--text-muted)]">Categoria</label>
            <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]">
              <option>Moradia</option>
              <option>Lazer</option>
              <option>Transporte</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button type="button" className="btn">Salvar</button>
          </div>
        </form>
      </div>

      <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
        <h2 className="text-lg font-semibold mb-3">Assinaturas</h2>
        <ul className="divide-y divide-[var(--border)]">
          {subs.map((s, i) => (
            <li key={i} className="py-3 flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-[color:var(--text-muted)]">{s.frequency} • Vence todo dia {s.dueDay} • {s.category}</div>
              </div>
              <div className="font-semibold">R$ {s.amount.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
