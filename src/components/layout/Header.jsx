export default function Header({ currentPage, setPage }) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'rigs', label: 'Rigs' },
    { key: 'pools', label: 'Pools' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-[var(--color-text-bright)]">
            <span className="text-[var(--color-accent)]">Bit</span>Craft
          </span>
          <span className="text-xs text-[var(--color-text)] opacity-60">to Mine Coin</span>
        </div>

        <nav className="flex gap-1">
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                currentPage === key
                  ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                  : 'text-[var(--color-text)] hover:text-[var(--color-text-bright)] hover:bg-[var(--color-surface-2)]'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
