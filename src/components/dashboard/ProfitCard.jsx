import { dailyProfit } from '../../lib/engine/profitability.js';

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

export default function ProfitCard({ rigs, coins, weather, settings }) {
  const activeRigs = rigs.filter((r) => r.is_active);

  if (activeRigs.length === 0 || coins.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-sm text-[var(--color-text)] mb-1">Daily Profit</h3>
        <p className="text-2xl font-bold text-[var(--color-text-bright)]">--</p>
        <p className="text-xs text-[var(--color-text)] mt-2">Add a rig to see profitability</p>
      </div>
    );
  }

  // Find best coin per rig and sum
  let totalRevenue = 0;
  let totalPower = 0;
  let totalCooling = 0;

  for (const rig of activeRigs) {
    let bestProfit = -Infinity;
    let bestResult = null;

    for (const coin of coins) {
      if (coin.algorithm !== rig.algorithm) continue;
      const result = dailyProfit(rig, coin, weather, settings);
      if (result.profit > bestProfit) {
        bestProfit = result.profit;
        bestResult = result;
      }
    }

    if (bestResult) {
      totalRevenue += bestResult.revenue;
      totalPower += bestResult.powerCost;
      totalCooling += bestResult.coolingCost;
    }
  }

  const netProfit = totalRevenue - totalPower - totalCooling;
  const isPositive = netProfit >= 0;

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
      <h3 className="text-sm text-[var(--color-text)] mb-1">Daily Profit (All Rigs)</h3>
      <p className={`text-3xl font-bold ${isPositive ? 'text-[var(--color-profit)]' : 'text-[var(--color-loss)]'}`}>
        {isPositive ? '+' : ''}{fmt(netProfit)}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-[var(--color-text)]">Revenue</p>
          <p className="text-[var(--color-text-bright)] font-medium">{fmt(totalRevenue)}</p>
        </div>
        <div>
          <p className="text-[var(--color-text)]">Power</p>
          <p className="text-[var(--color-loss)] font-medium">-{fmt(totalPower)}</p>
        </div>
        <div>
          <p className="text-[var(--color-text)]">Cooling</p>
          <p className="text-[var(--color-hot)] font-medium">-{fmt(totalCooling)}</p>
        </div>
      </div>
    </div>
  );
}
