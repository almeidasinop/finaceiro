export default function Accounts() {
  const accounts = [
    { name: 'NuConta', type: 'Conta Corrente', balance: 5240 },
    { name: 'Carteira', type: 'Dinheiro Físico', balance: 320 },
    { name: 'Cartão Inter', type: 'Cartão de Crédito', invoice: 780 },
  ]

  return (
    <div className="space-y-6 min-w-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Contas</h2>
        <button className="btn">Adicionar Conta</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
        {accounts.map((acc, i) => (
          <div key={i} className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] min-w-0">
            <div className="font-semibold">{acc.name}</div>
            <div className="text-sm text-[color:var(--text-muted)]">{acc.type}</div>
            {acc.type === 'Cartão de Crédito' ? (
              <div className="mt-2"><span className="text-[color:var(--text-muted)]">Fatura Atual:</span> <span className="font-semibold">R$ {acc.invoice?.toFixed(2)}</span></div>
            ) : (
              <div className="mt-2"><span className="text-[color:var(--text-muted)]">Saldo:</span> <span className="font-semibold">R$ {acc.balance?.toFixed(2)}</span></div>
            )}
            <div className="mt-3 flex gap-2">
              <button className="btn-muted">Editar</button>
              <button className="btn-danger">Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
