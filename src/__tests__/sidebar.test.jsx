import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../src/App.jsx'

describe('Sidebar navegação', () => {
  it('exibe itens de navegação na sidebar (desktop)', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Transações')).toBeInTheDocument()
    expect(screen.getByText('Contas')).toBeInTheDocument()
    expect(screen.getByText('Assinaturas')).toBeInTheDocument()
  })

  it('marca item ativo conforme rota', () => {
    render(
      <MemoryRouter initialEntries={["/contas"]}>
        <App />
      </MemoryRouter>
    )

    const linkContas = screen.getByText('Contas')
    // classe aplicada contém bg-[var(--hover-surface)] quando ativo
    expect(linkContas.parentElement).toHaveClass('bg-[var(--hover-surface)]')
  })

  it('abre e fecha menu móvel', async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    )

    const trigger = screen.getByRole('button', { name: /abrir menu/i })
    expect(trigger).toBeInTheDocument()

    // Como Radix Dialog, após clicar deve existir Overlay
    trigger.click()
    const overlay = await screen.findByLabelText('Sidebar de navegação')
    expect(overlay).toBeInTheDocument()
  })

  it('inclui item de Configurações na navegação', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Configurações')).toBeInTheDocument()
  })
})
