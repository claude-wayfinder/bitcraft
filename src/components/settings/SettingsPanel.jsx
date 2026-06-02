import { COOLING_METHODS } from '../../lib/engine/constants.js';

export default function SettingsPanel({ settings, updateSetting, weather, setManualLocation }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-sm font-medium text-[var(--color-text-bright)] mb-4">Power & Cooling</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[var(--color-text)] mb-1">Electricity Rate ($/kWh)</label>
            <input
              type="number"
              step="0.01"
              value={settings.electricityRate}
              onChange={(e) => updateSetting('electricityRate', parseFloat(e.target.value) || 0)}
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
            />
            <p className="text-xs text-[var(--color-text)] mt-1">US average: $0.10/kWh. Industrial: $0.04-0.07/kWh.</p>
          </div>

          <div>
            <label className="block text-xs text-[var(--color-text)] mb-1">Cooling Method</label>
            <select
              value={settings.coolingMethod}
              onChange={(e) => updateSetting('coolingMethod', e.target.value)}
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
            >
              {COOLING_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-sm font-medium text-[var(--color-text-bright)] mb-4">Location</h3>
        <p className="text-xs text-[var(--color-text)] mb-3">
          Current: {weather.city} ({weather.temp.toFixed(1)}°C, {weather.humidity}% humidity)
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[var(--color-text)] mb-1">Latitude</label>
            <input
              type="number"
              step="0.01"
              placeholder="40.71"
              onBlur={(e) => {
                const lat = parseFloat(e.target.value);
                if (!isNaN(lat)) {
                  const lonInput = e.target.closest('.grid').querySelector('input:last-of-type');
                  const lon = parseFloat(lonInput?.value);
                  if (!isNaN(lon)) setManualLocation(lat, lon);
                }
              }}
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
            />
          </div>
          <div>
            <label className="block text-xs text-[var(--color-text)] mb-1">Longitude</label>
            <input
              type="number"
              step="0.01"
              placeholder="-74.01"
              className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6">
        <h3 className="text-sm font-medium text-[var(--color-text-bright)] mb-4">API Keys</h3>
        <div>
          <label className="block text-xs text-[var(--color-text)] mb-1">OpenWeatherMap API Key</label>
          <input
            type="text"
            value={settings.owmApiKey}
            onChange={(e) => updateSetting('owmApiKey', e.target.value)}
            placeholder="Enter your OWM API key"
            className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded px-3 py-2 text-sm text-[var(--color-text-bright)]"
          />
          <p className="text-xs text-[var(--color-text)] mt-1">
            Free at openweathermap.org. Without it, weather defaults to 25°C / 50% humidity.
          </p>
        </div>
      </div>
    </div>
  );
}
