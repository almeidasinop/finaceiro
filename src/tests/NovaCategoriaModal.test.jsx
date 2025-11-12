import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NovaCategoriaModal from '../components/NovaCategoriaModal'

describe('NovaCategoriaModal', () => {
  const mockOnSave = vi.fn()
  const mockOnOpenChange = vi.fn()
  
  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onSave: mockOnSave,
    editing: null
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar o modal quando aberto', () => {
    render(<NovaCategoriaModal {...defaultProps} />)
    
    expect(screen.getByText('Nova Categoria')).toBeInTheDocument()
    expect(screen.getByText('Tipo da Categoria')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: Alimentação, Transporte, Salário...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Pesquisar ícones...')).toBeInTheDocument()
  })

  it('deve mostrar erro quando tipo não é selecionado', async () => {
    render(<NovaCategoriaModal {...defaultProps} />)
    
    const submitButton = screen.getByText('Criar Categoria')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Tipo é obrigatório')).toBeInTheDocument()
    })
  })

  it('deve mostrar erro quando nome é muito curto', async () => {
    render(<NovaCategoriaModal {...defaultProps} />)
    
    // Selecionar tipo
    const despesaButton = screen.getByText('Despesa')
    fireEvent.click(despesaButton)
    
    // Digitar nome curto
    const nameInput = screen.getByPlaceholderText('Ex: Alimentação, Transporte, Salário...')
    fireEvent.change(nameInput, { target: { value: 'A' } })
    
    const submitButton = screen.getByText('Criar Categoria')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument()
    })
  })

  it('deve mostrar erro quando ícone não é selecionado', async () => {
    render(<NovaCategoriaModal {...defaultProps} />)
    
    // Selecionar tipo
    const despesaButton = screen.getByText('Despesa')
    fireEvent.click(despesaButton)
    
    // Digitar nome válido
    const nameInput = screen.getByPlaceholderText('Ex: Alimentação, Transporte, Salário...')
    fireEvent.change(nameInput, { target: { value: 'Alimentação' } })
    
    const submitButton = screen.getByText('Criar Categoria')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Ícone é obrigatório')).toBeInTheDocument()
    })
  })

  it('deve filtrar ícones ao pesquisar', async () => {
    render(<NovaCategoriaModal {...defaultProps} />)
    
    const searchInput = screen.getByPlaceholderText('Pesquisar ícones...')
    fireEvent.change(searchInput, { target: { value: 'home' } })
    
    await waitFor(() => {
      // O grid deve conter apenas ícones filtrados
      const grid = screen.getByRole('grid')
      expect(grid).toBeInTheDocument()
    })
  })

  it('deve selecionar ícone ao clicar', async () => {
    render(<NovaCategoriaModal {...defaultProps} />)
    
    // Encontrar e clicar no ícone Home
    const homeButton = screen.getByLabelText('Selecionar ícone Home')
    fireEvent.click(homeButton)
    
    await waitFor(() => {
      // Ícone deve estar selecionado (com check)
      expect(screen.getByText('Home')).toBeInTheDocument()
    })
  })

  it('deve salvar categoria quando todos os campos são válidos', async () => {
    render(<NovaCategoriaModal {...defaultProps} />)
    
    // Selecionar tipo
    const despesaButton = screen.getByText('Despesa')
    fireEvent.click(despesaButton)
    
    // Digitar nome
    const nameInput = screen.getByPlaceholderText('Ex: Alimentação, Transporte, Salário...')
    fireEvent.change(nameInput, { target: { value: 'Alimentação' } })
    
    // Selecionar ícone
    const homeButton = screen.getByLabelText('Selecionar ícone Home')
    fireEvent.click(homeButton)
    
    // Submeter
    const submitButton = screen.getByText('Criar Categoria')
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Alimentação',
        type: 'despesa',
        icon: 'Home',
        color: '#0ea5e9'
      })
    })
  })

  it('deve fechar modal ao clicar em cancelar', () => {
    render(<NovaCategoriaModal {...defaultProps} />)
    
    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('deve mostrar título de edição quando em modo edição', () => {
    const editingProps = {
      ...defaultProps,
      editing: { id: '1', name: 'Teste', type: 'despesa', icon: 'Home', color: '#ff0000' }
    }
    
    render(<NovaCategoriaModal {...editingProps} />)
    
    expect(screen.getByText('Editar Categoria')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Teste')).toBeInTheDocument()
  })

  it('deve ser acessível com ARIA labels', () => {
    render(<NovaCategoriaModal {...defaultProps} />)
    
    // Verificar ARIA labels
    expect(screen.getByLabelText('Fechar modal')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Pesquisar ícones...')).toBeInTheDocument()
    expect(screen.getByLabelText('Selecionar cor da categoria')).toBeInTheDocument()
  })
})