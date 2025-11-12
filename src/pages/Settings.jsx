import ThemeToggle from "../components/ui/ThemeToggle.jsx"

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg shadow-sm p-4 bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
        <h2 className="text-lg font-semibold mb-3">Configurações</h2>
        <div className="space-y-4">
          <section>
            <h3 className="text-sm font-medium text-[color:var(--text-muted)] mb-2">Tema</h3>
            <div className="flex items-center">
              <ThemeToggle />
            </div>
          </section>
          <section>
            <h3 className="text-sm font-medium text-[color:var(--text-muted)] mb-2">Conta</h3>
            <p className="text-sm text-[color:var(--text-muted)]">Em breve: Gerencie credenciais e provedores.</p>
          </section>
          <section>
            <h3 className="text-sm font-medium text-[color:var(--text-muted)] mb-2">Preferências de Perfil</h3>
            <p className="text-sm text-[color:var(--text-muted)]">Em breve: Nome, avatar, idioma e preferências gerais.</p>
          </section>
          <section>
            <h3 className="text-sm font-medium text-[color:var(--text-muted)] mb-2">Privacidade</h3>
            <p className="text-sm text-[color:var(--text-muted)]">Em breve: Controles de dados, exportação e visibilidade.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
