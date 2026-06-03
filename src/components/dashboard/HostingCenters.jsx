import { HOSTING_CENTERS } from '../../lib/engine/constants.js';
import { dailyProfit } from '../../lib/engine/profitability.js';

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

const stars = (n) => {
  if (n === null) return '—';
  return '★'.repeat(n) + '☆'.repeat(5 - n);
};

export default function HostingCenters({ rigs, coins, weather, settings }) {
  const activeRigs = rigs.filter((r) => r.is_active);

  // Find best coin per rig's algo
  const bestCoinPerAlgo = {};
  for (const rig of activeRigs) {
    if (bestCoinPerAlgo[rig.algorithm]) continue;
    const best = coins
      .filter((c) => c.algorithm === rig.algorithm)
      .sort((a, b) => (b.btc_revenue || 0) - (a.btc_revenue || 0))[0];
    if (best) bestCoinPerAlgo[rig.algorithm] = best;
  }

  // Calculate profit for each hosting center
  const rows = HOSTING_CENTERS.map((center) => {
    const rate = center.rate ?? settings.electricityRate;
    const cooling = center.cooling ?? settings.coolingMethod;

    let totalProfit = 0;
    for (const rig of activeRigs) {
      const coin = bestCoinPerAlgo[rig.algorithm];
      if (!coin) continue;
      const result = dailyProfit(rig, coin, weather, {
        ...settings,
        electricityRate: rate,
        coolingMethod: cooling,
      });
      totalProfit += result.profit;
    }

    return { ...center, dailyProfit: totalProfit, rate };
  }).sort((a, b) => b.dailyProfit - a.dailyProfit);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
      <h3 className="text-sm text-[var(--color-text)] mb-1">Hosting Centers</h3>
      <p className="text-xs text-[var(--color-text)] opacity-60 mb-4">
        Estimated daily profit if your rigs were colocated at each facility.
      </p>

      {activeRigs.length === 0 || coins.length === 0 ? (
        <p className="text-xs text-[var(--color-text)]">Add rigs to compare hosting options.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[var(--color-text)] border-b border-[var(--color-border)]">
                <th className="pb-2 pr-3">Facility</th>
                <th className="pb-2 pr-3">Location</th>
                <th className="pb-2 pr-3 text-right">Rate</th>
                <th className="pb-2 pr-3">Cooling</th>
                <th className="pb-2 pr-3">Reputation</th>
                <th className="pb-2 text-right">Daily Profit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-b border-[var(--color-border)] border-opacity-30">
                  <td className="py-2 pr-3">
                    <span className="text-[var(--color-text-bright)] font-medium">{row.name}</span>
                    <p className="text-[var(--color-text)] opacity-50 mt-0.5">{row.note}</p>
                  </td>
                  <td className="py-2 pr-3 text-[var(--color-text)]">{row.location}</td>
                  <td className="py-2 pr-3 text-right text-[var(--color-text-bright)]">${row.rate?.toFixed(3) || '—'}</td>
                  <td className="py-2 pr-3 text-[var(--color-text)] capitalize">{row.cooling || '—'}</td>
                  <td className="py-2 pr-3 text-[var(--color-warn)]">{stars(row.reputation)}</td>
                  <td className={`py-2 text-right font-medium ${row.dailyProfit >= 0 ? 'text-[var(--color-profit)]' : 'text-[var(--color-loss)]'}`}>
                    {row.dailyProfit >= 0 ? '+' : ''}{fmt(row.dailyProfit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
