import { useEffect, useState, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Folder, Wallet, Receipt, CreditCard, Edit, Trash, Plus, GripVertical } from 'lucide-react'
import NovaCategoriaModal from '../components/NovaCategoriaModal'
import { addCategory, updateCategory, deleteCategory, watchCategories } from '../lib/repositories'

function cx(...classes) { return classes.filter(Boolean).join(' ') }

export default function Categorias() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const nameRef = useRef(null)
  const iconRef = useRef(null)
  const colorRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    let fallbackDetected = false
    
    const unsubscribe = watchCategories((categories) => {
      setItems(categories)
      setLoading(false)
      
      // Verificar se está usando fallback (categorias sem ID do Firebase)
      if (categories.length > 0 && !categories[0].id?.startsWith('firebase_')) {
        setUsingFallback(true)
        fallbackDetected = true
      }
    })
    
    // Se após 2 segundos não houver dados, verificar LocalStorage diretamente
    const timeout = setTimeout(() => {
      if (items.length === 0 && !fallbackDetected) {
        const fallbackCategories = JSON.parse(localStorage.getItem('categories') || '[]')
        if (fallbackCategories.length > 0) {
          setItems(fallbackCategories)
          setUsingFallback(true)
          setLoading(false)
        }
      }
    }, 2000)
    
    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  function onAdd() { 
    setEditing({ 
      id: null, 
      name: '', 
      type: '', 
      icon: '', 
      color: '#0ea5e9' 
    }) 
  }
  
  function onEdit(item) { 
    setEditing({ 
      ...item, 
      type: item.type || 'despesa' // Valor padrão para categorias antigas
    }) 
  }
  
  async function onDelete(id) { 
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
    
    try {
      setError(null)
      await deleteCategory(id)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao excluir categoria:', err)
    }
  }
  
  async function onSave(formData) {
    const { name, type, icon, color } = formData
    
    if (!name || !type || !icon) {
      throw new Error('Dados incompletos')
    }
    
    try {
      setError(null)
      setLoading(true)
      
      if (editing.id) {
        // Atualizar categoria existente
        await updateCategory(editing.id, {
          name: name.trim(),
          type,
          icon,
          color
        })
      } else {
        // Criar nova categoria
        await addCategory({
          name: name.trim(),
          type,
          icon,
          color
        })
      }
      
      setEditing(null)
    } catch (err) {
      setError(err.message)
      console.error('Erro ao salvar categoria:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  function onDragStart(e, index) { e.dataTransfer.setData('text/plain', String(index)) }
  function onDrop(e, index) {
    const from = Number(e.dataTransfer.getData('text/plain'))
    if (Number.isNaN(from)) return
    const next = items.slice()
    const [m] = next.splice(from, 1)
    next.splice(index, 0, m)
    persist(next)
  }

  function RenderIcon({ name, color }) {
    const I = { Folder, Wallet, Receipt, CreditCard }[name] || Folder
    return <I className="h-4 w-4 flex-none" style={{ color }} aria-hidden="true" />
  }

  return (
    <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm">
          Erro: {error}
        </div>
      )}
      
      {usingFallback && (
        <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
          ⚠️ Usando modo offline. Conecte-se ao Firebase para sincronizar em tempo real.
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categorias</h2>
        <button 
          type="button" 
          className="btn-primary" 
          onClick={onAdd}
          disabled={loading}
        >
          <Plus className="h-4 w-4" /> Nova
        </button>
      </div>
      
      {loading && items.length === 0 ? (
        <div className="mt-3 text-center text-sm text-[color:var(--text-muted)]">
          Carregando categorias...
        </div>
      ) : (
        <ul className="mt-3 space-y-2" role="list">
          {items.map((item, idx)=> (
            <li key={item.id}
                role="listitem"
                draggable
                onDragStart={(e)=>onDragStart(e, idx)}
                onDragOver={(e)=>e.preventDefault()}
                onDrop={(e)=>onDrop(e, idx)}
                className="flex items-center gap-3 rounded-md px-3 py-3 border border-[var(--border)] hover:bg-[var(--hover-surface)]">
              <GripVertical className="h-4 w-4 text-[color:var(--text-muted)]" aria-hidden="true" />
              <RenderIcon name={item.icon} color={item.color} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">{item.name}</span>
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: item.type === 'receita' ? '#10b98120' : '#ef444420',
                      color: item.type === 'receita' ? '#10b981' : '#ef4444'
                    }}
                  >
                    {item.type === 'receita' ? 'Receita' : 'Despesa'}
                  </span>
                </div>
              </div>
              <button type="button" className="btn-muted px-2 py-1" onClick={()=>onEdit(item)} aria-label="Editar"><Edit className="h-4 w-4" /></button>
              <button type="button" className="btn-muted px-2 py-1" onClick={()=>onDelete(item.id)} aria-label="Excluir"><Trash className="h-4 w-4" /></button>
            </li>
          ))}
          {items.length === 0 && !loading && (
            <li className="text-sm text-[color:var(--text-muted)]">Nenhuma categoria ainda. Clique em "Nova" para adicionar.</li>
          )}
        </ul>
      )}

      {/* Novo Modal de Categoria */}
      <NovaCategoriaModal
        open={!!editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSave={onSave}
        editing={editing}
        loading={loading}
      />
    </div>
  )
}
