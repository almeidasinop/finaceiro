import { NavLink } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, LayoutDashboard, Receipt, Wallet, CreditCard, Settings as SettingsIcon, Plus, Edit, Trash, GripVertical, Folder, LogOut, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";
import NetworkStatusBanner from "./NetworkStatusBanner.jsx";
import { FirebaseStatus } from "../FirebaseStatus.jsx";
import { useAuthContext } from "../../hooks/useAuth.jsx";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transacoes", label: "Transações", icon: Receipt },
  { to: "/contas", label: "Contas", icon: Wallet },
  { to: "/assinaturas", label: "Assinaturas", icon: CreditCard },
  { to: "/categorias", label: "Categorias", icon: Folder },
  { to: "/configuracoes", label: "Configurações", icon: SettingsIcon },
];

export function Sidebar({ className = "" }) {
  return (
    <aside
      className={cx(
        "hidden md:grid md:w-64 lg:w-72 md:shrink-0 border-r bg-[var(--surface)] border-[var(--border)] grid-rows-[auto_1fr_auto]",
        className
      )}
      aria-label="Barra lateral"
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)]">
        <span className="font-semibold" style={{ color: "var(--brand)" }}>Financeiro</span>
      </div>
      <nav className="overflow-y-auto py-3" role="navigation" aria-label="Navegação principal">
        <div className="px-3 text-xs text-[color:var(--text-muted)] mb-2">Navegação</div>
        <ul className="px-2 space-y-2">
          {navItems
            .filter(item => item.to !== "/configuracoes")
            .map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    cx(
                      "flex flex-nowrap items-center gap-3 rounded-md px-2 py-3 text-sm min-w-0 w-full text-[var(--text)] transition-colors",
                      "hover:bg-[var(--hover-surface)]",
                      "focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                      "active:bg-[var(--hover-surface)]",
                      isActive ? "bg-[var(--hover-surface)]" : ""
                    )
                  }
                  aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                >
                  <Icon className="h-5 w-5 shrink-0 flex-none" aria-hidden="true" style={{ color: "var(--text)" }} />
                  <span className="text-sm text-[color:var(--text)] flex-1 min-w-0 whitespace-nowrap truncate">{label}</span>
                </NavLink>
              </li>
            ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <div className="px-3 text-xs text-[color:var(--text-muted)] mb-2">Preferências</div>
          <div className="px-2 space-y-2">
            <ThemeToggle className="w-full justify-start" />
            <NavLink
              to="/configuracoes"
              className={({ isActive }) =>
                cx(
                  "flex flex-nowrap items-center gap-3 rounded-md px-2 py-3 text-sm min-w-0 w-full text-[var(--text)] transition-colors",
                  "hover:bg-[var(--hover-surface)]",
                  "focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                  "active:bg-[var(--hover-surface)]",
                  isActive ? "bg-[var(--hover-surface)]" : ""
                )
              }
            >
              <SettingsIcon className="h-5 w-5 shrink-0 flex-none" aria-hidden="true" style={{ color: "var(--text)" }} />
              <span className="text-sm text-[color:var(--text)] flex-1 min-w-0 whitespace-nowrap truncate">Configurações</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Seção de Usuário e Logout */}
      <UserSection />
    </aside>
  );
}

export function MobileSidebar() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex md:hidden items-center gap-2 rounded-md px-3 py-2 text-[var(--text)] hover:bg-[var(--hover-surface)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
          aria-label="Abrir menu"
          aria-controls="mobile-sidebar"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          Menu
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed inset-y-0 left-0 w-72 bg-[var(--surface)] border-r border-[var(--border)] focus:outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left"
          aria-label="Sidebar de navegação"
          id="mobile-sidebar"
        >
          <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)]">
            <Dialog.Title className="font-semibold" style={{ color: "var(--brand)" }}>Financeiro</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="inline-flex items-center rounded-md p-2 hover:bg-[var(--hover-surface)]"
                aria-label="Fechar menu"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <nav className="py-2" role="navigation">
            <ul className="px-2 space-y-2">
              {navItems
                .filter(item => item.to !== "/configuracoes")
                .map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    {/* Close dialog on navigation */}
                    <Dialog.Close asChild>
                      <NavLink
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) =>
                          cx(
                            "flex flex-nowrap items-center gap-3 rounded-md px-2 py-3 text-sm min-w-0 w-full text-[var(--text)] transition-colors",
                            "hover:bg-[var(--hover-surface)]",
                            "focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                            "active:bg-[var(--hover-surface)]",
                            isActive ? "bg-[var(--hover-surface)]" : ""
                          )
                        }
                        aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                      >
                        <Icon className="h-5 w-5 shrink-0 flex-none" aria-hidden="true" style={{ color: "var(--text)" }} />
                        <span className="text-sm text-[color:var(--text)] flex-1 min-w-0 whitespace-nowrap truncate">{label}</span>
                      </NavLink>
                    </Dialog.Close>
                  </li>
                ))}
            </ul>
            {/* Seção de Configurações no menu mobile */}
            <div className="mt-3 pt-3 border-t border-[var(--border)]">
              <div className="px-2 text-xs text-[color:var(--text-muted)] mb-2">Preferências</div>
              <div className="px-2 space-y-2">
                {/* ThemeToggle migrado para seção de Configurações no mobile, full-width */}
                <ThemeToggle className="w-full justify-start" />
                {/* Link direto para página de Configurações */}
                <Dialog.Close asChild>
                  <NavLink
                    to="/configuracoes"
                    className={({ isActive }) =>
                      cx(
                        "flex flex-nowrap items-center gap-3 rounded-md px-2 py-3 text-sm min-w-0 w-full text-[var(--text)] transition-colors",
                        "hover:bg-[var(--hover-surface)]",
                        "focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
                        "active:bg-[var(--hover-surface)]",
                        isActive ? "bg-[var(--hover-surface)]" : ""
                      )
                    }
                  >
                    <SettingsIcon className="h-5 w-5 shrink-0 flex-none" aria-hidden="true" style={{ color: "var(--text)" }} />
                    <span className="text-sm text-[color:var(--text)] flex-1 min-w-0 whitespace-nowrap truncate">Configurações</span>
                  </NavLink>
                </Dialog.Close>
              </div>
            </div>

          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function LayoutWithSidebar({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 h-14 w-full border-b bg-[var(--surface)]/80 backdrop-blur border-[var(--border)]">
        <div className="mx-auto max-w-7xl h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold" style={{ color: "var(--brand)" }}>Financeiro</span>
          </div>
          <div className="flex items-center gap-2">
            <MobileSidebar />
          </div>
        </div>
      </header>
      <NetworkStatusBanner />
      <FirebaseStatus />

      <div className="mx-auto max-w-7xl w-full flex">
        <Sidebar />
        <main className="flex-1 md:pl-6 px-4 py-6 bg-[var(--bg)] text-[var(--text)] overflow-x-hidden" id="conteudo-principal">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Sidebar;

// Componente de Usuário e Logout
function UserSection() {
  const { user, logout } = useAuthContext()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (!user) return null

  return (
    <div className="p-4 border-t border-[var(--border)]">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-[var(--accent)] rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-[var(--on-accent)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text)] truncate">
            {user.displayName || user.email?.split('@')[0] || 'Usuário'}
          </p>
          <p className="text-xs text-[var(--text-muted)] truncate">
            {user.email}
          </p>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover-surface)] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </button>
    </div>
  )
}

function CategoriesSection({ compact = false }) {
  const [expanded, setExpanded] = useState(true);
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const nameRef = useRef(null);
  const iconRef = useRef(null);
  const colorRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("categories");
      const list = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(list) ? list : []);
    } catch { }
  }, []);

  function persist(next) {
    setItems(next);
    try { localStorage.setItem("categories", JSON.stringify(next)); } catch { }
  }

  function onAdd() {
    setEditing({ id: null, name: "", icon: "Folder", color: "#0ea5e9" });
  }
  function onEdit(item) { setEditing({ ...item }); }
  function onDelete(id) { persist(items.filter(i => i.id !== id)); }
  function onSave() {
    const name = nameRef.current?.value?.trim() || "";
    const icon = iconRef.current?.value?.trim() || "Folder";
    const color = colorRef.current?.value || "#0ea5e9";
    if (!name) return;
    if (editing.id) {
      persist(items.map(i => i.id === editing.id ? { ...i, name, icon, color } : i));
    } else {
      const id = crypto.randomUUID();
      persist([...items, { id, name, icon, color }]);
    }
    setEditing(null);
  }

  function onDragStart(e, index) { e.dataTransfer.setData("text/plain", String(index)); }
  function onDrop(e, index) {
    const from = Number(e.dataTransfer.getData("text/plain"));
    if (Number.isNaN(from)) return;
    const next = items.slice();
    const [m] = next.splice(from, 1);
    next.splice(index, 0, m);
    persist(next);
  }

  function RenderIcon({ name, color }) {
    const I = { Folder, Wallet, Receipt, CreditCard, LayoutDashboard }[name] || Folder;
    return <I className="h-4 w-4 flex-none" style={{ color }} aria-hidden="true" />;
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        className="w-full flex items-center justify-between rounded-md px-2 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover-surface)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
        aria-controls="categorias-list"
      >
        <span className="inline-flex items-center gap-2"><Folder className="h-4 w-4" aria-hidden="true" /> Categorias</span>
        <span className="text-xs text-[color:var(--text-muted)]">{expanded ? "Ocultar" : "Exibir"}</span>
      </button>
      <div id="categorias-list" className={cx("overflow-hidden transition-all", expanded ? "max-h-96" : "max-h-0")}>
        <ul className="px-2 py-2 space-y-1" role="list">
          {items.map((item, idx) => (
            <li key={item.id}
              role="listitem"
              draggable
              onDragStart={e => onDragStart(e, idx)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => onDrop(e, idx)}
              className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-[var(--hover-surface)]">
              <GripVertical className="h-4 w-4 text-[color:var(--text-muted)]" aria-hidden="true" />
              <RenderIcon name={item.icon} color={item.color} />
              <span className="flex-1 min-w-0 truncate">{item.name}</span>
              <button type="button" className="btn-muted px-2 py-1" onClick={() => onEdit(item)} aria-label="Editar categoria"><Edit className="h-4 w-4" /></button>
              <button type="button" className="btn-muted px-2 py-1" onClick={() => onDelete(item.id)} aria-label="Excluir categoria"><Trash className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
        <div className="px-2 pb-2">
          <button type="button" className="btn-muted w-full" onClick={onAdd}><Plus className="h-4 w-4" /> Adicionar categoria</button>
        </div>
      </div>

      <Dialog.Root open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
            <div className="flex items-center justify-between mb-2">
              <Dialog.Title className="font-semibold">{editing?.id ? "Editar categoria" : "Nova categoria"}</Dialog.Title>
              <Dialog.Close asChild>
                <button className="btn-muted px-2 py-1">Fechar</button>
              </Dialog.Close>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-[color:var(--text-muted)]">Nome</label>
                <input ref={nameRef} defaultValue={editing?.name || ""} className="mt-1 w-full rounded-md h-10 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" />
              </div>
              <div>
                <label className="block text-xs text-[color:var(--text-muted)]">Ícone (lucide)</label>
                <input ref={iconRef} defaultValue={editing?.icon || "Folder"} className="mt-1 w-full rounded-md h-10 px-3 text-sm bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]" />
              </div>
              <div>
                <label className="block text-xs text-[color:var(--text-muted)]">Cor</label>
                <input ref={colorRef} type="color" defaultValue={editing?.color || "#0ea5e9"} className="mt-1 h-10 w-16 rounded-md border border-[var(--border)]" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button type="button" className="btn-primary" onClick={onSave}>Salvar</button>
              <Dialog.Close asChild>
                <button type="button" className="btn-muted">Cancelar</button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
