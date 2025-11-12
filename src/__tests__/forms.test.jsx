import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddTransactionDialog from '../components/forms/AddTransactionDialog.jsx'

vi.mock('../lib/repositories', () => ({
  addTransaction: vi.fn(async () => ({ id: 'abc123' }))
}))

describe('AddTransactionDialog usability', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('opens dialog and validates required fields', async () => {
    render(<AddTransactionDialog tipo="receita" />)
    const trigger = screen.getByRole('button', { name: /Adicionar Receita/i })
    fireEvent.click(trigger)

    const submit = await screen.findByRole('button', { name: /Salvar/i })
    fireEvent.click(submit)

    // Should show error because required fields are empty (handled via required attribute)
    // As we use native required, we expect the form to not close and no success message
    await waitFor(() => {
      expect(screen.queryByText(/Salvo com sucesso/i)).toBeNull()
    })
  })

  it('submits when valid and shows success message', async () => {
    render(<AddTransactionDialog tipo="receita" />)
    fireEvent.click(screen.getByRole('button', { name: /Adicionar Receita/i }))

    fireEvent.change(screen.getByLabelText(/Valor/i), { target: { value: '100' } })
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Freelance' } })
    fireEvent.change(screen.getByLabelText(/Data/i), { target: { value: '2025-11-12' } })
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: 'Receita' } })
    fireEvent.change(screen.getByLabelText(/Conta/i), { target: { value: 'NuConta' } })

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }))

    await screen.findByRole('status')
    expect(screen.getByText(/Salvo com sucesso/i)).toBeInTheDocument()
  })
})

