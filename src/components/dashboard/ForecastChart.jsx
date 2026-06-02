import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, ComposedChart, ReferenceLine } from 'recharts';
import { dailyProfit } from '../../lib/engine/profitability.js';

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
}

export default function ForecastChart({ rigs, coins, forecast, settings }) {
  const activeRigs = rigs.filter((r) => r.is_active);

  if (activeRigs.length === 0 || coins.length === 0 || forecast.length === 0) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-sm text-[var(--color-text)] mb-2">5-Day Profit Forecast</h3>
        <p className="text-xs text-[var(--color-text)]">
          {forecast.length === 0
            ? 'Add your OpenWeatherMap API key in Settings to see forecast'
            : 'Add rigs to see forecast'}
        </p>
      </div>
    );
  }

  // Find best coin for each rig's algorithm
  const bestCoinPerAlgo = {};
  for (const rig of activeRigs) {
    if (bestCoinPerAlgo[rig.algorithm]) continue;
    const best = coins
      .filter((c) => c.algorithm === rig.algorithm)
      .sort((a, b) => (b.btc_revenue || 0) - (a.btc_revenue || 0))[0];
    if (best) bestCoinPerAlgo[rig.algorithm] = best;
  }

  // Sample forecast at ~6-hour intervals (every 2nd entry) to avoid clutter
  const sampled = forecast.filter((_, i) => i % 2 === 0).slice(0, 20);

  const chartData = sampled.map((point) => {
    const weather = { temp: point.temp, humidity: point.humidity };
    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    for (const rig of activeRigs) {
      const coin = bestCoinPerAlgo[rig.algorithm];
      if (!coin) continue;
      const result = dailyProfit(rig, coin, weather, settings);
      totalRevenue += result.revenue;
      totalCost += result.totalCost;
      totalProfit += result.profit;
    }

    // Format time label
    const d = new Date(point.dt * 1000);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

    return {
      time: label,
      revenue: parseFloat(totalRevenue.toFixed(2)),
      cost: parseFloat(totalCost.toFixed(2)),
      profit: parseFloat(totalProfit.toFixed(2)),
      temp: point.temp,
      humidity: point.humidity,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded p-3 text-xs">
        <p className="text-[var(--color-text-bright)] font-medium mb-1">{d.time}</p>
        <p className="text-[var(--color-profit)]">Profit: {fmt(d.profit)}/day</p>
        <p className="text-[var(--color-text)]">Revenue: {fmt(d.revenue)}</p>
        <p className="text-[var(--color-loss)]">Total Cost: {fmt(d.cost)}</p>
        <p className="text-[var(--color-text)] mt-1">{d.temp.toFixed(1)}°C / {d.humidity}% humidity</p>
      </div>
    );
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
      <h3 className="text-sm text-[var(--color-text)] mb-4">5-Day Profit Forecast</h3>
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={chartData}>
          <XAxis
            dataKey="time"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#2a2b36' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: '#2a2b36' }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#2a2b36" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="profit"
            fill="rgba(34, 197, 94, 0.1)"
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            name="Net Profit"
          />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#ef4444"
            strokeWidth={1}
            strokeDasharray="4 4"
            dot={false}
            name="Total Cost"
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex gap-6 mt-3 text-xs text-[var(--color-text)]">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[var(--color-profit)] inline-block"></span> Net Profit
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[var(--color-loss)] inline-block border-dashed"></span> Total Cost
        </span>
      </div>
    </div>
  );
}
