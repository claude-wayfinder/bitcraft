import { wetBulbTemp } from '../../lib/engine/cooling.js';

export default function WeatherImpactCard({ weather }) {
  const wb = wetBulbTemp(weather.temp, weather.humidity);

  // Color coding for mining conditions
  let conditionColor = 'var(--color-profit)';   // green = great
  let conditionLabel = 'Excellent';
  if (weather.humidity > 70 || weather.temp > 35) {
    conditionColor = 'var(--color-loss)';
    conditionLabel = 'Expensive';
  } else if (weather.humidity > 50 || weather.temp > 30) {
    conditionColor = 'var(--color-warn)';
    conditionLabel = 'Moderate';
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm text-[var(--color-text)]">Weather Impact</h3>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ color: conditionColor, background: `${conditionColor}20` }}
        >
          {conditionLabel}
        </span>
      </div>

      <p className="text-xs text-[var(--color-text)] mb-3">{weather.city} — {weather.description}</p>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-[var(--color-text)]">Temp</p>
          <p className="text-[var(--color-text-bright)] font-medium">{weather.temp.toFixed(1)}°C</p>
        </div>
        <div>
          <p className="text-[var(--color-text)]">Humidity</p>
          <p className="text-[var(--color-text-bright)] font-medium">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-[var(--color-text)]">Wet Bulb</p>
          <p className="text-[var(--color-cool)] font-medium">{wb.toFixed(1)}°C</p>
        </div>
      </div>

      <p className="text-xs text-[var(--color-text)] mt-3 opacity-70">
        Wet-bulb temp determines evaporative cooling effectiveness. Lower = better.
      </p>
    </div>
  );
}
