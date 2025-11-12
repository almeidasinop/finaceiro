import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const balanceMonthly = [
  { name: 'Receitas', value: 5200 },
  { name: 'Despesas', value: 4100 },
]

const categoryData = [
  { name: 'Moradia', value: 40 },
  { name: 'Alimentação', value: 20 },
  { name: 'Transporte', value: 15 },
  { name: 'Lazer', value: 10 },
  { name: 'Outros', value: 15 },
]

const COLORS = ['#16a34a', '#ef4444', '#f59e0b', '#0ea5e9', '#a78bfa']

function StatCard({ title, value }) {
  return (
    <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
      <div className="text-sm text-[color:var(--text-muted)]">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Saldo Total" value="R$ 12.400,00" />
        <StatCard title="Receitas (mês)" value="R$ 5.200,00" />
        <StatCard title="Despesas (mês)" value="R$ 4.100,00" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-lg shadow-sm p-4 lg:col-span-2 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Balanço Mensal</h2>
            <div className="flex gap-2">
              <button className="btn">+ Receita</button>
              <button className="btn-danger">+ Despesa</button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Mês atual', receitas: balanceMonthly[0].value, despesas: balanceMonthly[1].value }]}>                
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="receitas" fill="#16a34a" name="Receitas" />
                <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
          <h2 className="text-lg font-semibold">Gastos por Categoria (Mês)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
        <h2 className="text-lg font-semibold">Próximas Contas a Vencer</h2>
        <ul className="mt-2 space-y-2 text-sm text-[var(--text)]">
          <li className="flex justify-between"><span>Netflix</span><span className="text-[color:var(--text-muted)]">Vence em 2 dias</span></li>
          <li className="flex justify-between"><span>Água</span><span className="text-[color:var(--text-muted)]">Vence em 4 dias</span></li>
          <li className="flex justify-between"><span>Academia</span><span className="text-[color:var(--text-muted)]">Vence em 6 dias</span></li>
        </ul>
      </div>
    </div>
  )
}
