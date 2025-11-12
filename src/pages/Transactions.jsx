import { useState, useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { addTransaction, watchTransactions, seedTransactions } from '../lib/repositories'

export default function Transactions() {
  const [type, setType] = useState('despesa')
  const [amount, setAmount] = useState('')
  const [amountRaw, setAmountRaw] = useState('')
  const [amountDisplay, setAmountDisplay] = useState('')
  const [amountPlaceholderActive, setAmountPlaceholderActive] = useState(true)
  const [amountError, setAmountError] = useState('')
  const amountRef = useRef(null)
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [dateDisplay, setDateDisplay] = useState(formatDateBR(new Date()))
  const [category, setCategory] = useState('Alimentação')
  const [account, setAccount] = useState('Carteira')
  const [status, setStatus] = useState('pago')
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState(null)
  const [scheduleError, setScheduleError] = useState('')
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const unsubscribe = watchTransactions(items => setTransactions(items))
    return () => unsubscribe && unsubscribe()
  }, [])

  async function handleSave() {
    const tipo = type === 'receita' ? 'Receita' : 'Despesa'
    const valorNum = Number(amountRaw || '0') / 100
    if (!Number.isFinite(valorNum) || valorNum <= 0) { setAmountError('Informe um valor válido.'); return }
    await addTransaction({ tipo, valor: valorNum, descricao: description, data: date, categoria: category, conta: account, status })
    setAmount('')
    setAmountRaw('')
    setAmountDisplay('')
    setAmountPlaceholderActive(true)
    setAmountError('')
    setDescription('')
  }

  async function handleSeed() {
    await seedTransactions()
  }

  function formatBRLFromDigits(digits) {
    const cleaned = String(digits).replace(/\D/g, '')
    if (cleaned.length === 0) return 'R$ 0,00'
    const padded = cleaned.padStart(3, '0')
    const decimals = padded.slice(-2)
    const integerRaw = padded.slice(0, -2).replace(/^0+/, '') || '0'
    const intWithDots = integerRaw.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return `R$ ${intWithDots},${decimals}`
  }

  function handleAmountChange(e) {
    const val = e.target.value
    const caret = e.target.selectionStart ?? val.length
    const digitsBefore = val.slice(0, caret).replace(/\D/g, '').length
    const digits = val.replace(/\D/g, '')
    const display = formatBRLFromDigits(digits)
    const num = Number(digits) / 100
    setAmountDisplay(display)
    setAmount(Number.isFinite(num) ? String(num) : '')
    setAmountRaw(digits)
    setAmountError('')
    requestAnimationFrame(() => {
      if (!amountRef.current) return
      let count = 0
      let pos = display.length
      for (let i = 0; i < display.length; i++) {
        if (/\d/.test(display[i])) count++
        if (count === digitsBefore) { pos = i + 1; break }
      }
      amountRef.current.selectionStart = pos
      amountRef.current.selectionEnd = pos
    })
  }

  function handleAmountFocus() { setAmountPlaceholderActive(false) }
  function handleAmountBlur() { if (!amountDisplay) setAmountPlaceholderActive(true) }
  function handleAmountKeyDown(e) {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
    if (allowed.includes(e.key)) return
    if (!/\d/.test(e.key)) e.preventDefault()
  }

  function formatDateBR(d) {
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  function toISODate(d) {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  function openDatePicker() {
    setIsDatePickerOpen(true)
  }

  function onDatePick(d) {
    setDate(toISODate(d))
    setDateDisplay(formatDateBR(d))
    setIsDatePickerOpen(false)
  }

  function onStatusChange(e) {
    const val = e.target.value
    setStatus(val)
    if (val === 'pendente') {
      setScheduleError('')
      setScheduleDate(null)
      setIsScheduleOpen(true)
    }
  }

  function confirmSchedule() {
    if (!scheduleDate) { setScheduleError('Selecione uma data futura.'); return }
    const today = new Date()
    const s = new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate())
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (s <= t) { setScheduleError('A data deve ser futura.'); return }
    setDate(toISODate(scheduleDate))
    setDateDisplay(formatDateBR(scheduleDate))
    setStatus('pendente')
    setIsScheduleOpen(false)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
          <h2 className="text-lg font-semibold mb-3">Adicionar Transação</h2>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0 w-full">
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Tipo</label>
              <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={type} onChange={e => setType(e.target.value)}>
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Valor (R$)</label>
              <input ref={amountRef} className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" type="text" inputMode="numeric" placeholder={amountPlaceholderActive ? 'R$ 0,00' : ''} value={amountDisplay} onChange={handleAmountChange} onFocus={handleAmountFocus} onBlur={handleAmountBlur} onKeyDown={handleAmountKeyDown} />
              {amountError && <div className="mt-1 text-sm text-red-500">{amountError}</div>}
            </div>
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Data</label>
              <button type="button" onClick={openDatePicker} className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] flex items-center justify-between">
                <span>{dateDisplay}</span>
                <span className="text-xs text-[color:var(--text-muted)]">pt-BR</span>
              </button>
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm text-[color:var(--text-muted)]">Descrição</label>
              <input className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Almoço no restaurante X" />
            </div>
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Categoria</label>
              <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={category} onChange={e => setCategory(e.target.value)}>
                <option>Alimentação</option>
                <option>Transporte</option>
                <option>Moradia</option>
                <option>Salário</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Conta</label>
              <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={account} onChange={e => setAccount(e.target.value)}>
                <option>NuConta</option>
                <option>Carteira</option>
                <option>Banco do Brasil</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[color:var(--text-muted)]">Status</label>
              <select className="mt-1 w-full rounded-md h-11 px-3 text-base bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]" value={status} onChange={onStatusChange}>
                <option value="pago">Pago</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <button type="button" onClick={handleSave} className="btn-primary">Salvar</button>
            </div>
          </form>
        </div>

        <Dialog.Root open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
              <div className="flex items-center justify-between mb-2">
                <Dialog.Title className="font-semibold">Selecionar data</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="btn-muted px-2 py-1">Fechar</button>
                </Dialog.Close>
              </div>
              <Calendar value={new Date(date)} onChange={(d) => { onDatePick(d); setIsDatePickerOpen(false) }} yearSelector />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

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
                {transactions.map((t) => (
                  <tr key={t.id} className="border-t border-[var(--border)] text-[var(--text)]">
                    <td className="py-2 pr-4">{t.tipo}</td>
                    <td className="py-2 pr-4">{t.descricao}</td>
                    <td className="py-2 pr-4">R$ {Number(t.valor).toFixed(2)}</td>
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

      <Dialog.Root open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22rem] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="flex items-center justify-between mb-2">
              <Dialog.Title className="font-semibold">Agendar pagamento</Dialog.Title>
              <Dialog.Close asChild>
                <button className="btn-muted px-2 py-1">Fechar</button>
              </Dialog.Close>
            </div>
            <Calendar value={scheduleDate || new Date()} minDate={new Date()} onChange={d => { setScheduleDate(d); setScheduleError(''); setIsScheduleOpen(false) }} yearSelector />
            {scheduleError && <div className="mt-2 text-sm text-red-500">{scheduleError}</div>}
            <div className="mt-3 flex items-center gap-2">
              <button type="button" onClick={confirmSchedule} className="px-4 py-2 rounded bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-hover)]">Confirmar</button>
              <Dialog.Close asChild>
                <button type="button" className="btn-muted">Cancelar</button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

function Calendar({ value, onChange, minDate, maxDate, yearSelector }) {
  const [current, setCurrent] = useState(new Date(value))
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const start = new Date(current.getFullYear(), current.getMonth(), 1)
  const end = new Date(current.getFullYear(), current.getMonth() + 1, 0)
  const startDay = start.getDay()
  const total = end.getDate()
  const cells = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= total; d++) cells.push(new Date(current.getFullYear(), current.getMonth(), d))
  function isDisabled(day) {
    const a = new Date(day.getFullYear(), day.getMonth(), day.getDate())
    const withinMin = minDate ? a >= new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : true
    const withinMax = maxDate ? a <= new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()) : true
    return !(withinMin && withinMax)
  }
  const [focused, setFocused] = useState(null)
  function onGridKey(e) {
    if (!focused) return
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = new Date(focused)
    next.setDate(next.getDate() + step)
    if (!isDisabled(next)) setFocused(next)
  }
  return (
    <div className="w-full" role="dialog" aria-label="Calendário">
      <div className="flex items-center justify-between px-2 py-2">
        <button type="button" className="btn-muted" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))} aria-label="Mês anterior">Anterior</button>
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium" aria-live="polite">{meses[current.getMonth()]} {current.getFullYear()}</div>
          {yearSelector && (
            <select className="btn-muted px-2 py-1" value={current.getFullYear()} onChange={(e) => setCurrent(new Date(Number(e.target.value), current.getMonth(), 1))} aria-label="Selecionar ano">
              {Array.from({ length: 21 }, (_, i) => current.getFullYear() - 10 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          )}
        </div>
        <button type="button" className="btn-muted" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))} aria-label="Próximo mês">Próximo</button>
      </div>
      <div className="grid grid-cols-7 gap-1 px-2" role="grid" onKeyDown={onGridKey} tabIndex={0}>
        {dias.map((d) => (
          <div key={d} className="text-center text-xs text-[color:var(--text-muted)] py-1">{d}</div>
        ))}
        {cells.map((c, i) => (
          c ? (
            <button
              key={i}
              type="button"
              disabled={isDisabled(c)}
              onClick={() => onChange(c)}
              onFocus={() => setFocused(c)}
              className={`h-9 rounded-md border border-[var(--border)] ${isDisabled(c) ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[var(--hover-surface)]'} text-[var(--text)] ${value && c.toDateString() === new Date(value).toDateString() ? 'bg-[var(--hover-surface)]' : ''}`}
            >
              {String(c.getDate()).padStart(2, '0')}
            </button>
          ) : (
            <div key={i} />
          )
        ))}
      </div>
    </div>
  )
}

