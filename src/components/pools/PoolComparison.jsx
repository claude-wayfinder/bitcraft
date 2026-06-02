import { POOLS } from '../../lib/engine/constants.js';
import { dailyProfit } from '../../lib/engine/profitability.js';

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

export default function PoolComparison({ rigs, coins, weather, settings }) {
  const activeRigs = rigs.filter((r) => r.is_active);
  const algorithms = [...new Set(activeRigs.map((r) => r.algorithm))];

  if (algorithms.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-sm text-[var(--color-text)]">Pool Comparison</h3>
        <p className="text-xs text-[var(--color-text)] mt-2">Add rigs to compare pool impact</p>
      </div>
    );
  }

  // Calculate base revenue per algorithm (before pool fees)
  const algoRevenue = {};
  for (const algo of algorithms) {
    let rev = 0;
    const algoRigs = activeRigs.filter((r) => r.algorithm === algo);
    const bestCoin = coins
      .filter((c) => c.algorithm === algo)
      .sort((a, b) => (b.btc_revenue || 0) - (a.btc_revenue || 0))[0];

    if (bestCoin) {
      for (const rig of algoRigs) {
        const result = dailyProfit(rig, bestCoin, weather, settings);
        rev += result.revenue;
      }
    }
    algoRevenue[algo] = rev;
  }

  return (
    <div className="space-y-6">
      {algorithms.map((algo) => {
        const pools = POOLS[algo];
        if (!pools) return null;
        const baseRev = algoRevenue[algo] || 0;

        return (
          <div key={algo} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
            <h3 className="text-sm font-medium text-[var(--color-text-bright)] mb-3">{algo} Pools</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--color-text)] text-xs border-b border-[var(--color-border)]">
                  <th className="pb-2 pr-4">Pool</th>
                  <th className="pb-2 pr-4 text-right">Fee</th>
                  <th className="pb-2 pr-4 text-right">Payout</th>
                  <th className="pb-2 pr-4 text-right">Fee Cost/Day</th>
                  <th className="pb-2 text-right">Net Revenue</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((pool) => {
                  const feeCost = baseRev * pool.fee;
                  const net = baseRev - feeCost;
                  return (
                    <tr key={pool.name} className="border-b border-[var(--color-border)] border-opacity-30">
                      <td className="py-2 pr-4 text-[var(--color-text-bright)]">{pool.name}</td>
                      <td className="py-2 pr-4 text-right text-[var(--color-text)]">{(pool.fee * 100).toFixed(1)}%</td>
                      <td className="py-2 pr-4 text-right text-[var(--color-text)]">{pool.payout}</td>
                      <td className="py-2 pr-4 text-right text-[var(--color-hot)]">
                        {feeCost > 0 ? `-${fmt(feeCost)}` : fmt(0)}
                      </td>
                      <td className="py-2 text-right text-[var(--color-text-bright)] font-medium">{fmt(net)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
