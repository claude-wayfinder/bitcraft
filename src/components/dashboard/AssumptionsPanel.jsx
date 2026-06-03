import { WTM_REFERENCE, SLIPPAGE_DEFAULTS } from '../../lib/engine/constants.js';
import { slippageMultiplier } from '../../lib/engine/profitability.js';

export default function AssumptionsPanel({ settings, coins }) {
  const slip = slippageMultiplier(settings);
  const uptimePct = (settings.uptimePct ?? SLIPPAGE_DEFAULTS.uptimePct) * 100;
  const stalePct = (settings.staleSharePct ?? SLIPPAGE_DEFAULTS.staleSharePct) * 100;
  const luckVar = SLIPPAGE_DEFAULTS.poolLuckVariance * 100;

  // Find BTC price from coins if available
  const btcCoin = coins.find((c) => c.tag === 'BTC');
  const btcPrice = btcCoin?.btcPrice || 0;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
      <h3 className="text-sm text-[var(--color-text)] mb-3">Revenue Assumptions</h3>
      <p className="text-xs text-[var(--color-text)] opacity-60 mb-4">
        How gross revenue becomes net profit — every deduction shown.
      </p>

      <div className="space-y-3 text-xs">
        {/* Data sources */}
        <div className="flex justify-between">
          <span className="text-[var(--color-text)]">BTC Price (CoinGecko)</span>
          <span className="text-[var(--color-text-bright)]">${btcPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text)]">Coin Revenue Source</span>
          <span className="text-[var(--color-text-bright)]">WhatToMine API</span>
        </div>

        <div className="border-t border-[var(--color-border)] pt-3">
          <p className="text-[var(--color-text-bright)] font-medium mb-2">Scaling Method</p>
          <p className="text-[var(--color-text)] leading-relaxed">
            WhatToMine reports daily BTC revenue for a reference hashrate.
            We scale linearly: <span className="text-[var(--color-text-bright)]">(your hashrate / reference) × reported revenue × BTC price</span>.
          </p>
          <div className="mt-2 space-y-1">
            {Object.entries(WTM_REFERENCE).map(([algo, ref]) => (
              <div key={algo} className="flex justify-between text-[var(--color-text)]">
                <span>{algo}</span>
                <span className="text-[var(--color-text-bright)]">{ref.hashrate} {ref.unit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-3">
          <p className="text-[var(--color-text-bright)] font-medium mb-2">Slippage Deductions</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-[var(--color-text)]">Uptime (maintenance, reboots)</span>
              <span className="text-[var(--color-warn)]">{uptimePct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text)]">Stale/rejected shares</span>
              <span className="text-[var(--color-warn)]">-{stalePct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text)]">Multi-day pool luck variance</span>
              <span className="text-[var(--color-text)]">±{luckVar}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-text)]">Hardware degradation (annual)</span>
              <span className="text-[var(--color-text)]">-{SLIPPAGE_DEFAULTS.hardwareDegradation * 100}%</span>
            </div>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-2 mt-2">
              <span className="text-[var(--color-text-bright)] font-medium">Net revenue multiplier</span>
              <span className="text-[var(--color-text-bright)] font-medium">{(slip * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-3">
          <p className="text-[var(--color-text-bright)] font-medium mb-2">Cost Layers</p>
          <div className="space-y-1 text-[var(--color-text)]">
            <p>1. Electricity: rig wattage × 24h × ${settings.electricityRate}/kWh</p>
            <p>2. Cooling: thermodynamic model (Stull wet-bulb, COP)</p>
            <p>3. Pool fees: deducted per pool in Pool Comparison</p>
          </div>
        </div>

        <p className="text-[var(--color-text)] opacity-50 pt-2 border-t border-[var(--color-border)]">
          Difficulty adjustments, halving events, and BTC price changes are NOT predicted — numbers reflect current network state only.
        </p>
      </div>
    </div>
  );
}
