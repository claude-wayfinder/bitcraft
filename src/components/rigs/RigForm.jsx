import { useState } from 'react';
import { MINERS, ALGORITHMS } from '../../lib/engine/constants.js';

export default function RigForm({ onAdd, onClose }) {
  const [model, setModel] = useState('');
  const [name, setName] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA-256');
  const [hashrate, setHashrate] = useState('');
  const [hashrateUnit, setHashrateUnit] = useState('TH/s');
  const [power, setPower] = useState('');

  const handleModelSelect = (key) => {
    setModel(key);
    const miner = MINERS[key];
    if (miner && key !== 'custom') {
      setName(miner.name);
      setAlgorithm(miner.algorithm);
      setHashrate(miner.hashrate.toString());
      setHashrateUnit(miner.hashrateUnit);
      setPower(miner.power.toString());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !hashrate || !power) return;
    onAdd({
      name,
      model,
      algorithm,
      hashrate: parseFloat(hashrate),
      hashrateUnit,
      power_draw: parseFloat(power),
    });
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg p-6 space-y-4">
      <h3 className="text-sm font-medium text-[var(--color-text-bright)]">Add Rig</h3>

      <div>
        <label className="block text-xs text-[var(--color-text)] mb-1">Model (auto-fills specs)</label>
        <select
          value={model}
          onChange={(e) => handleModelSelect(e.target.value)}
          className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
        >
          <option value="">Select a model...</option>
          {Object.entries(MINERS).map(([key, m]) => (
            <option key={key} value={key}>{m.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-[var(--color-text)] mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My S21"
          className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[var(--color-text)] mb-1">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
          >
            {ALGORITHMS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[var(--color-text)] mb-1">Hashrate ({hashrateUnit})</label>
          <input
            type="number"
            value={hashrate}
            onChange={(e) => setHashrate(e.target.value)}
            placeholder="200"
            className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[var(--color-text)] mb-1">Power Draw (Watts)</label>
        <input
          type="number"
          value={power}
          onChange={(e) => setPower(e.target.value)}
          placeholder="3550"
          className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-[var(--color-accent)] text-white px-4 py-2 rounded text-sm font-medium hover:brightness-110 transition"
        >
          Add Rig
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--color-text)] px-4 py-2 rounded text-sm hover:text-[var(--color-text-bright)] transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
