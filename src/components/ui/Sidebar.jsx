import { NavLink } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X, LayoutDashboard, Receipt, Wallet, CreditCard, Settings as SettingsIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";
import NetworkStatusBanner from "./NetworkStatusBanner.jsx";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transacoes", label: "Transações", icon: Receipt },
  { to: "/contas", label: "Contas", icon: Wallet },
  { to: "/assinaturas", label: "Assinaturas", icon: CreditCard },
  { to: "/configuracoes", label: "Configurações", icon: SettingsIcon },
];

export function Sidebar({ className = "" }) {
  return (
    <aside
      className={cx(
        "hidden md:flex md:flex-col md:w-64 md:shrink-0 border-r bg-[var(--surface)] border-[var(--border)]",
        className
      )}
      aria-label="Navegação principal"
    >
      <div className="h-14 flex items-center justify-end px-4 border-b border-[var(--border)]">
        <ThemeToggle />
      </div>
      <nav className="flex-1 overflow-y-auto py-2" role="navigation">
        <ul className="px-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cx(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors min-w-0 w-full text-[var(--text)] hover:bg-[var(--hover-surface)]",
                    isActive
                      ? "bg-[var(--hover-surface)]"
                      : ""
                  )
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" style={{ color: "var(--text)" }} />
                <span className="text-sm text-[color:var(--text)] flex-1 min-w-0 whitespace-nowrap truncate">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export function MobileSidebar() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex md:hidden items-center gap-2 rounded-md px-3 py-2 text-[var(--text)] hover:bg-[var(--hover-surface)]"
          aria-label="Abrir menu"
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
            <ul className="px-2 space-y-1">
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
                          "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors min-w-0 w-full text-[var(--text)] hover:bg-[var(--hover-surface)]",
                          isActive
                            ? "bg-[var(--hover-surface)]"
                            : ""
                        )
                      }
                      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" style={{ color: "var(--text)" }} />
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
                        "flex items-center gap-2 rounded-md px-2 py-2 text-sm outline-none transition-colors min-w-0 w-full",
                        "hover:bg-[var(--hover-surface)]",
                        isActive ? "bg-[var(--hover-surface)]" : ""
                      )
                    }
                  >
                    <SettingsIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="flex-1 min-w-0 whitespace-nowrap truncate">Configurações</span>
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
      <header className="sticky top-0 z-40 h-14 w-full border-b bg-[var(--surface)]/80 backdrop-blur border-[var(--border)]">
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
