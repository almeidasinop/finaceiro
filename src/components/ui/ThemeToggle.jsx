import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { initTheme, toggleTheme } from '../../lib/theme.js'

export default function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setTheme(initTheme())
  }, [])

  const onToggle = () => {
    const next = toggleTheme()
    setTheme(next)
  }

  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 border bg-[var(--surface)] text-[var(--text)] shadow-sm hover:bg-[var(--hover-surface)] border-[var(--border)] ${className}`}
      aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span className="text-sm flex-1 min-w-0 whitespace-nowrap truncate">{isDark ? 'Claro' : 'Escuro'}</span>
    </button>
  )
}
