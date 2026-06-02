import { dailyProfit } from '../../lib/engine/profitability.js';

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

export default function CoinProfitTable({ rigs, coins, weather, settings }) {
  const activeRigs = rigs.filter((r) => r.is_active);

  if (activeRigs.length === 0 || coins.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-sm text-[var(--color-text)] mb-2">Coin Profitability</h3>
        <p className="text-xs text-[var(--color-text)]">No data — add rigs and wait for market data</p>
      </div>
    );
  }

  // Calculate profit for each coin using all compatible rigs
  const rows = [];
  for (const coin of coins) {
    let totalRevenue = 0;
    let totalPower = 0;
    let totalCooling = 0;
    let rigCount = 0;

    for (const rig of activeRigs) {
      if (rig.algorithm !== coin.algorithm) continue;
      rigCount++;
      const result = dailyProfit(rig, coin, weather, settings);
      totalRevenue += result.revenue;
      totalPower += result.powerCost;
      totalCooling += result.coolingCost;
    }

    if (rigCount === 0) continue;

    const net = totalRevenue - totalPower - totalCooling;
    rows.push({
      coin: coin.tag || coin.name,
      name: coin.name,
      algorithm: coin.algorithm,
      revenue: totalRevenue,
      power: totalPower,
      cooling: totalCooling,
      net,
      rigs: rigCount,
    });
  }

  rows.sort((a, b) => b.net - a.net);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 overflow-x-auto">
      <h3 className="text-sm text-[var(--color-text)] mb-3">Coin Profitability Ranking</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[var(--color-text)] text-xs border-b border-[var(--color-border)]">
            <th className="pb-2 pr-4">#</th>
            <th className="pb-2 pr-4">Coin</th>
            <th className="pb-2 pr-4">Algorithm</th>
            <th className="pb-2 pr-4 text-right">Revenue</th>
            <th className="pb-2 pr-4 text-right">Power</th>
            <th className="pb-2 pr-4 text-right">Cooling</th>
            <th className="pb-2 text-right">Net/Day</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.coin} className="border-b border-[var(--color-border)] border-opacity-30">
              <td className="py-2 pr-4 text-[var(--color-text)]">{i + 1}</td>
              <td className="py-2 pr-4">
                <span className="text-[var(--color-text-bright)] font-medium">{row.coin}</span>
                {row.name !== row.coin && (
                  <span className="text-[var(--color-text)] text-xs ml-2 opacity-60">{row.name}</span>
                )}
              </td>
              <td className="py-2 pr-4 text-[var(--color-text)]">{row.algorithm}</td>
              <td className="py-2 pr-4 text-right text-[var(--color-text-bright)]">{fmt(row.revenue)}</td>
              <td className="py-2 pr-4 text-right text-[var(--color-loss)]">-{fmt(row.power)}</td>
              <td className="py-2 pr-4 text-right text-[var(--color-hot)]">-{fmt(row.cooling)}</td>
              <td className={`py-2 text-right font-medium ${row.net >= 0 ? 'text-[var(--color-profit)]' : 'text-[var(--color-loss)]'}`}>
                {row.net >= 0 ? '+' : ''}{fmt(row.net)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
