export default function RigCard({ rig, onToggle, onRemove }) {
  return (
    <div className={`bg-[var(--color-surface)] border rounded-lg p-4 ${
      rig.is_active ? 'border-[var(--color-border)]' : 'border-[var(--color-border)] opacity-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-[var(--color-text-bright)]">{rig.name}</h4>
        <div className="flex gap-2">
          <button
            onClick={() => onToggle(rig.id)}
            className={`text-xs px-2 py-0.5 rounded ${
              rig.is_active
                ? 'bg-[var(--color-profit)]20 text-[var(--color-profit)]'
                : 'bg-[var(--color-loss)]20 text-[var(--color-loss)]'
            }`}
          >
            {rig.is_active ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => onRemove(rig.id)}
            className="text-xs text-[var(--color-text)] hover:text-[var(--color-loss)] transition"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-[var(--color-text)]">Algorithm</span>
          <p className="text-[var(--color-text-bright)]">{rig.algorithm}</p>
        </div>
        <div>
          <span className="text-[var(--color-text)]">Hashrate</span>
          <p className="text-[var(--color-text-bright)]">{rig.hashrate} {rig.hashrateUnit}</p>
        </div>
        <div>
          <span className="text-[var(--color-text)]">Power</span>
          <p className="text-[var(--color-text-bright)]">{rig.power_draw}W</p>
        </div>
      </div>
    </div>
  );
}
