import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initTheme, toggleTheme, applyTheme } from '../lib/theme'

function mockMatchMedia(matches) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

describe('Theme management', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    window.localStorage.clear()
    mockMatchMedia(false)
  })

  it('initTheme applies theme from localStorage when available', () => {
    window.localStorage.setItem('theme', 'dark')
    const theme = initTheme()
    expect(theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('initTheme falls back to prefers-color-scheme when not stored', () => {
    mockMatchMedia(true) // prefers dark
    const theme = initTheme()
    expect(theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme switches between light and dark and persists', () => {
    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    const next = toggleTheme()
    expect(next).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('theme')).toBe('dark')
  })
})

