import { useState, useEffect, useRef, useMemo } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Search, Check } from 'lucide-react'

// Importar uma seleção de ícones lucide para performance
import {
  Folder, Wallet, Receipt, CreditCard, Home, Car, ShoppingCart, Heart,
  BookOpen, Gamepad2, Music, Camera, Smartphone, Laptop, Tv, Watch,
  Shirt, Footprints, Coffee, Pizza, Plane, Train, Bus,
  Briefcase, GraduationCap, HeartPulse, Pill, Dumbbell, Trophy, Gift,
  Wrench, Hammer, Paintbrush, Scissors, Zap, Lightbulb, Flame, Droplet,
  Leaf, Globe, Cloud, Sun, Moon, Star, ThumbsUp, Award, Target
} from 'lucide-react'

const CATEGORY_TYPES = [
  { value: 'receita', label: 'Receita', color: '#10b981' },
  { value: 'despesa', label: 'Despesa', color: '#ef4444' }
]

// Cores predefinidas para seleção
const PREDEFINED_COLORS = [
  '#FF6B6B', '#FADADD', '#F06292', '#FF7F50', '#FFD180', '#FFDAC1', 
  '#FFEE93', '#FFC107', '#A0E7E5', '#B4E1D7', '#BABD8D', '#6B8E23', 
  '#B2F2BB', '#20B2AA', '#87CEEB', '#ADD8E6', '#C3D9FF', '#6495ED', 
  '#4682B4', '#B0E0E6', '#E6E6FA', '#D8BFD8', '#9370DB', '#E0BBE4', 
  '#DDA0DD', '#F5F5DC', '#D2B48C', '#BC8F8F', '#708090', '#D3D3D3', 
  '#A99985', '#E3C9A6', '#C0C0C0'
]

const ICONS = [
  { name: 'Folder', component: Folder },
  { name: 'Wallet', component: Wallet },
  { name: 'Receipt', component: Receipt },
  { name: 'CreditCard', component: CreditCard },
  { name: 'Home', component: Home },
  { name: 'Car', component: Car },
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'Heart', component: Heart },
  { name: 'BookOpen', component: BookOpen },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Music', component: Music },
  { name: 'Camera', component: Camera },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Laptop', component: Laptop },
  { name: 'Tv', component: Tv },
  { name: 'Watch', component: Watch },
  { name: 'Shirt', component: Shirt },
  { name: 'Footprints', component: Footprints },
  { name: 'Coffee', component: Coffee },
  { name: 'Pizza', component: Pizza },
  { name: 'Utensils', component: Pizza },
  { name: 'Plane', component: Plane },
  { name: 'Train', component: Train },
  { name: 'Bus', component: Bus },
  { name: 'Briefcase', component: Briefcase },
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'HeartPulse', component: HeartPulse },
  { name: 'Pill', component: Pill },
  { name: 'Dumbbell', component: Dumbbell },
  { name: 'Trophy', component: Trophy },
  { name: 'Gift', component: Gift },
  { name: 'Wrench', component: Wrench },
  { name: 'Hammer', component: Hammer },
  { name: 'Paintbrush', component: Paintbrush },
  { name: 'Scissors', component: Scissors },
  { name: 'Zap', component: Zap },
  { name: 'Lightbulb', component: Lightbulb },
  { name: 'Flame', component: Flame },
  { name: 'Droplet', component: Droplet },
  { name: 'Leaf', component: Leaf },
  { name: 'Globe', component: Globe },
  { name: 'Cloud', component: Cloud },
  { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon },
  { name: 'Star', component: Star },
  { name: 'ThumbsUp', component: ThumbsUp },
  { name: 'Award', component: Award },
  { name: 'Target', component: Target }
]

function validateForm(formData) {
  const errors = {}
  
  if (!formData.name?.trim()) {
    errors.name = 'Nome é obrigatório'
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres'
  }
  
  if (!formData.type) {
    errors.type = 'Tipo é obrigatório'
  }
  
  if (!formData.icon) {
    errors.icon = 'Ícone é obrigatório'
  } else if (!ICONS.find(i => i.name === formData.icon)) {
    errors.icon = 'Ícone inválido'
  }
  
  return errors
}

// Função para validar renderização do ícone SVG
function validateIconRendering(iconName) {
  try {
    const icon = ICONS.find(i => i.name === iconName)
    if (!icon) return false
    
    // Testa se o componente do ícone pode ser renderizado
    const IconComponent = icon.component
    return IconComponent && typeof IconComponent === 'function'
  } catch (error) {
    console.error('Erro ao validar ícone:', error)
    return false
  }
}

export default function NovaCategoriaModal({ open, onOpenChange, onSave, editing, loading: externalLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    icon: '',
    color: '#0ea5e9'
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [iconSearch, setIconSearch] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  
  const nameInputRef = useRef(null)
  const iconSearchRef = useRef(null)

  // Inicializar formulário com dados de edição
  useEffect(() => {
    if (editing) {
      setFormData({
        name: editing.name || '',
        type: editing.type || '',
        icon: editing.icon || '',
        color: editing.color || '#0ea5e9'
      })
    } else {
      setFormData({
        name: '',
        type: '',
        icon: '',
        color: '#0ea5e9'
      })
    }
    setErrors({})
  }, [editing, open])

  // Focar no primeiro campo quando abrir
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 100)
    }
  }, [open])

  // Filtrar ícones baseado na pesquisa
  const filteredIcons = useMemo(() => {
    if (!iconSearch.trim()) return ICONS
    const search = iconSearch.toLowerCase()
    return ICONS.filter(icon => 
      icon.name.toLowerCase().includes(search)
    )
  }, [iconSearch])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validação em tempo real
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      
      // Revalidar campo
      const tempFormData = { ...formData, [field]: value }
      const fieldErrors = validateForm(tempFormData)
      if (fieldErrors[field]) {
        newErrors[field] = fieldErrors[field]
      }
      
      setErrors(newErrors)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formErrors = validateForm(formData)
    setErrors(formErrors)
    
    if (Object.keys(formErrors).length > 0) {
      // Focar no primeiro campo com erro
      const firstErrorField = Object.keys(formErrors)[0]
      const fieldRef = firstErrorField === 'name' ? nameInputRef : null
      fieldRef?.current?.focus()
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onSave({
        ...formData,
        name: formData.name.trim()
      })
      onOpenChange(false)
      
      // Limpar formulário após sucesso
      setFormData({ name: '', type: '', icon: '', color: '#0ea5e9' })
      setErrors({})
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      setErrors({ submit: error.message || 'Erro ao salvar categoria. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onOpenChange(false)
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleIconSelect = (iconName) => {
    // Validar se o ícone pode ser renderizado
    if (!validateIconRendering(iconName)) {
      console.error('Ícone inválido ou não pode ser renderizado:', iconName)
      return
    }
    
    setFormData(prev => ({ ...prev, icon: iconName }))
    setIconSearch('')
    
    // Remover erro de ícone se existir
    if (errors.icon) {
      const newErrors = { ...errors }
      delete newErrors.icon
      setErrors(newErrors)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => onOpenChange(false)}
        />
        <Dialog.Content 
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-scale-in focus:outline-none"
          onKeyDown={handleKeyDown}
          aria-describedby="nova-categoria-descricao"
        >
          <div id="nova-categoria-descricao" className="sr-only">
            Formulário para criar nova categoria com seleção de tipo, ícone e cor
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <Dialog.Title className="text-lg font-semibold text-[var(--text)]">
              {editing ? 'Editar Categoria' : 'Nova Categoria'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button 
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[var(--text-muted)] hover:bg-[var(--hover-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors"
                aria-label="Fechar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Mensagem de erro geral */}
            {errors.submit && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
                {errors.submit}
              </div>
            )}
            
            {/* Tipo da Categoria */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text)]">
                Tipo da Categoria <span className="text-[var(--danger)]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`
                      relative flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-200
                      ${formData.type === type.value 
                        ? 'border-[var(--focus-ring)] bg-[var(--hover-surface)] shadow-md' 
                        : 'border-[var(--border)] hover:border-[var(--text-muted)] hover:bg-[var(--surface-muted)]'
                      }
                      ${errors.type ? 'border-[var(--danger)]' : ''}
                      focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2
                      min-h-[64px] touch-manipulation
                    `}
                    aria-pressed={formData.type === type.value}
                    aria-describedby={errors.type ? 'tipo-erro' : undefined}
                  >
                    <div className="text-center">
                      <div 
                        className="w-3 h-3 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                    {formData.type === type.value && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-[var(--focus-ring)]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {errors.type && (
                <p id="tipo-erro" className="text-sm text-[var(--danger)]" role="alert">
                  {errors.type}
                </p>
              )}
            </div>

            {/* Nome da Categoria */}
            <div className="space-y-2">
              <label htmlFor="categoria-nome" className="block text-sm font-medium text-[var(--text)]">
                Nome da Categoria <span className="text-[var(--danger)]">*</span>
              </label>
              <input
                ref={nameInputRef}
                id="categoria-nome"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`
                  w-full px-4 py-3 rounded-lg border bg-[var(--surface)] text-[var(--text)]
                  transition-colors duration-200
                  ${errors.name ? 'border-[var(--danger)]' : 'border-[var(--border)]'}
                  ${focusedField === 'name' ? 'border-[var(--focus-ring)] ring-2 ring-[var(--focus-ring)] ring-opacity-30' : ''}
                  hover:border-[var(--text-muted)] focus:outline-none focus:border-[var(--focus-ring)] focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-opacity-30
                  text-base min-h-[48px] touch-manipulation
                `}
                placeholder="Ex: Alimentação, Transporte, Salário..."
                autoComplete="off"
                aria-describedby={errors.name ? 'nome-erro' : undefined}
                aria-invalid={!!errors.name}
                required
              />
              {errors.name && (
                <p id="nome-erro" className="text-sm text-[var(--danger)]" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Seleção de Ícone - Caixa Clicável */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text)]">
                Ícone <span className="text-[var(--danger)]">*</span>
              </label>
              
              {/* Caixa de Seleção de Ícone */}
              <button
                type="button"
                onClick={() => setShowIconPicker(true)}
                className={`
                  w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 min-h-[64px]
                  ${errors.icon ? 'border-[var(--danger)]' : 'border-[var(--border)]'}
                  hover:border-[var(--text-muted)] hover:bg-[var(--surface-muted)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2
                  touch-manipulation
                `}
                aria-label="Selecionar ícone"
                aria-describedby={errors.icon ? 'icone-erro' : undefined}
              >
                {formData.icon ? (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                      {(() => {
                        const IconComponent = ICONS.find(i => i.name === formData.icon)?.component || Folder
                        return <IconComponent className="h-6 w-6" style={{ color: formData.color }} />
                      })()}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-[var(--text)]">{formData.icon}</div>
                      <div className="text-xs text-[var(--text-muted)]">Clique para alterar</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface-muted)] border border-dashed border-[var(--border)] flex items-center justify-center">
                      <Search className="h-5 w-5 text-[var(--text-muted)]" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-[var(--text-muted)]">Selecionar ícone</div>
                      <div className="text-xs text-[var(--text-muted)]">Escolha um ícone para sua categoria</div>
                    </div>
                  </>
                )}
                <div className="text-[var(--text-muted)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              
              {errors.icon && (
                <p id="icone-erro" className="text-sm text-[var(--danger)]" role="alert">
                  {errors.icon}
                </p>
              )}
            </div>

            {/* Cor da Categoria - Caixa Clicável */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text)]">
                Cor da Categoria
              </label>
              
              {/* Caixa de Seleção de Cor */}
              <button
                type="button"
                onClick={() => setShowColorPicker(true)}
                className="
                  w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 min-h-[64px]
                  border-[var(--border)] hover:border-[var(--text-muted)] hover:bg-[var(--surface-muted)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2
                  touch-manipulation
                "
                aria-label="Selecionar cor"
              >
                <div 
                  className="w-10 h-10 rounded-lg border-2 border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: formData.color }}
                />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-[var(--text)]">Cor Selecionada</div>
                  <div className="text-xs text-[var(--text-muted)]">{formData.color}</div>
                </div>
                <div className="text-[var(--text-muted)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Erro de Submit */}
            {errors.submit && (
              <div className="p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] text-sm" role="alert">
                {errors.submit}
              </div>
            )}

            {/* Ações */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || externalLoading}
                className="flex-1 btn-primary min-h-[48px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                aria-busy={isSubmitting || externalLoading}
              >
                {isSubmitting || externalLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  editing ? 'Atualizar Categoria' : 'Criar Categoria'
                )}
              </button>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-6 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)]
                    hover:bg-[var(--surface)] hover:border-[var(--text-muted)]
                    focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2
                    min-h-[48px] touch-manipulation transition-colors"
                  disabled={isSubmitting || externalLoading}
                >
                  Cancelar
                </button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>

      {/* Modal de Seleção de Ícones */}
      <Dialog.Root open={showIconPicker} onOpenChange={setShowIconPicker}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-scale-in focus:outline-none">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <Dialog.Title className="text-lg font-semibold text-[var(--text)]">
                Selecionar Ícone
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[var(--text-muted)] hover:bg-[var(--hover-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-4 space-y-4">
              {/* Campo de Pesquisa */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[var(--text-muted)]" />
                </div>
                <input
                  ref={iconSearchRef}
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]
                    hover:border-[var(--text-muted)] focus:outline-none focus:border-[var(--focus-ring)] focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-opacity-30
                    text-base min-h-[48px] touch-manipulation"
                  placeholder="Pesquisar ícones..."
                  aria-label="Pesquisar ícones"
                />
              </div>

              {/* Grid de Ícones */}
              <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] custom-scrollbar">
                {filteredIcons.map((icon) => {
                  const IconComponent = icon.component
                  const isSelected = formData.icon === icon.name
                  
                  return (
                    <button
                      key={icon.name}
                      type="button"
                      onClick={() => {
                        handleIconSelect(icon.name)
                        setShowIconPicker(false)
                      }}
                      className={`
                        relative flex items-center justify-center w-12 h-12 rounded-lg border transition-all duration-200
                        ${isSelected 
                          ? 'border-[var(--focus-ring)] bg-[var(--hover-surface)] shadow-md scale-110' 
                          : 'border-[var(--border)] hover:border-[var(--text-muted)] hover:bg-[var(--surface)] hover:scale-110'
                        }
                        focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2
                        touch-manipulation
                      `}
                      aria-label={`Selecionar ícone ${icon.name}`}
                      aria-pressed={isSelected}
                      title={icon.name}
                    >
                      <IconComponent 
                        className="h-6 w-6" 
                        style={{ color: isSelected ? formData.color : 'var(--text-muted)' }}
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--focus-ring)] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)]">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)]
                  hover:bg-[var(--surface)] hover:border-[var(--text-muted)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2">
                  Cancelar
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Modal de Seleção de Cores */}
      <Dialog.Root open={showColorPicker} onOpenChange={setShowColorPicker}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-scale-in focus:outline-none">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <Dialog.Title className="text-lg font-semibold text-[var(--text)]">
                Selecionar Cor
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-[var(--text-muted)] hover:bg-[var(--hover-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]">
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>

            <div className="p-4">
              {/* Grade de Cores */}
              <div className="grid grid-cols-6 gap-3 p-2 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)]">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      handleInputChange('color', color)
                      setShowColorPicker(false)
                    }}
                    className={`
                      relative w-12 h-12 rounded-lg border-2 transition-all duration-200
                      ${formData.color === color 
                        ? 'border-[var(--focus-ring)] shadow-lg scale-110' 
                        : 'border-white hover:scale-110 hover:shadow-md'
                      }
                      focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2
                      touch-manipulation
                    `}
                    style={{ backgroundColor: color }}
                    aria-label={`Selecionar cor ${color}`}
                    aria-pressed={formData.color === color}
                    title={color}
                  >
                    {formData.color === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white drop-shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Cor Atual */}
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                    style={{ backgroundColor: formData.color }}
                  />
                  <span className="text-sm font-medium text-[var(--text)]">{formData.color}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-[var(--border)]">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text)]
                  hover:bg-[var(--surface)] hover:border-[var(--text-muted)]
                  focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-2">
                  Cancelar
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Dialog.Root>
  )
}