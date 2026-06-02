import { dailyProfit } from '../../lib/engine/profitability.js';

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

export default function MineThisNow({ rigs, coins, weather, settings }) {
  const activeRigs = rigs.filter((r) => r.is_active);

  if (activeRigs.length === 0 || coins.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[var(--color-accent-dim)] to-[var(--color-surface)] border border-[var(--color-accent)] rounded-lg p-6">
        <h3 className="text-sm text-[var(--color-accent)] mb-1">MINE THIS NOW</h3>
        <p className="text-lg text-[var(--color-text-bright)]">Add your first rig to get a recommendation</p>
      </div>
    );
  }

  // Find the single most profitable coin across all rigs
  let bestCoin = null;
  let bestProfit = -Infinity;
  let bestRevenue = 0;
  let bestCooling = 0;

  for (const coin of coins) {
    let coinProfit = 0;
    let coinRevenue = 0;
    let coinCooling = 0;
    let hasRig = false;

    for (const rig of activeRigs) {
      if (rig.algorithm !== coin.algorithm) continue;
      hasRig = true;
      const result = dailyProfit(rig, coin, weather, settings);
      coinProfit += result.profit;
      coinRevenue += result.revenue;
      coinCooling += result.coolingCost;
    }

    if (hasRig && coinProfit > bestProfit) {
      bestProfit = coinProfit;
      bestCoin = coin;
      bestRevenue = coinRevenue;
      bestCooling = coinCooling;
    }
  }

  if (!bestCoin) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-sm text-[var(--color-text)]">MINE THIS NOW</h3>
        <p className="text-[var(--color-text-bright)]">No compatible coins found for your rigs</p>
      </div>
    );
  }

  const isPositive = bestProfit >= 0;

  return (
    <div className="bg-gradient-to-br from-[var(--color-accent-dim)] to-[var(--color-surface)] border border-[var(--color-accent)] rounded-lg p-6">
      <h3 className="text-sm text-[var(--color-accent)] font-medium mb-2">MINE THIS NOW</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-[var(--color-text-bright)]">
          {bestCoin.tag || bestCoin.name}
        </span>
        <span className="text-sm text-[var(--color-text)]">{bestCoin.algorithm}</span>
      </div>
      <p className={`text-2xl font-bold mt-2 ${isPositive ? 'text-[var(--color-profit)]' : 'text-[var(--color-loss)]'}`}>
        {isPositive ? '+' : ''}{fmt(bestProfit)}/day
      </p>
      <div className="mt-3 flex gap-6 text-xs text-[var(--color-text)]">
        <span>Revenue: {fmt(bestRevenue)}</span>
        <span>Cooling cost: {fmt(bestCooling)}</span>
      </div>
    </div>
  );
}
