import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('UI error boundary:', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 max-w-md text-center">
            <h1 className="text-lg font-semibold mb-2">Algo deu errado</h1>
            <p className="text-sm text-[color:var(--text-muted)] mb-4">Tente atualizar a página. Se o problema persistir, verifique sua conexão.</p>
            <button className="btn" onClick={() => window.location.reload()}>Recarregar</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

