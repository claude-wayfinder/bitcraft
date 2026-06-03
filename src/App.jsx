import { useState } from 'react';
import Header from './components/layout/Header.jsx';
import ProfitCard from './components/dashboard/ProfitCard.jsx';
import MineThisNow from './components/dashboard/MineThisNow.jsx';
import WeatherImpactCard from './components/dashboard/WeatherImpactCard.jsx';
import CoinProfitTable from './components/dashboard/CoinProfitTable.jsx';
import ForecastChart from './components/dashboard/ForecastChart.jsx';
import AssumptionsPanel from './components/dashboard/AssumptionsPanel.jsx';
import HostingCenters from './components/dashboard/HostingCenters.jsx';
import RigForm from './components/rigs/RigForm.jsx';
import RigCard from './components/rigs/RigCard.jsx';
import PoolComparison from './components/pools/PoolComparison.jsx';
import SettingsPanel from './components/settings/SettingsPanel.jsx';
import { useMarketData } from './lib/hooks/useMarketData.js';
import { useWeather } from './lib/hooks/useWeather.js';
import { useSettings } from './lib/hooks/useSettings.js';
import { useRigs } from './lib/hooks/useRigs.js';

function App() {
  const [page, setPage] = useState('dashboard');
  const [showRigForm, setShowRigForm] = useState(false);

  const { settings, updateSetting } = useSettings();
  const { rigs, addRig, updateRig, removeRig, toggleRig } = useRigs();
  const { prices, coins, loading: marketLoading, error: marketError, lastUpdated } = useMarketData();
  const { weather, forecast, location, loading: weatherLoading, setManualLocation } = useWeather(settings.owmApiKey);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header currentPage={page} setPage={setPage} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-6 text-xs text-[var(--color-text)]">
          <div className="flex gap-4">
            <span>Rigs: {rigs.filter((r) => r.is_active).length}/{rigs.length}</span>
            <span>BTC: ${prices?.bitcoin?.usd?.toLocaleString() || '...'}</span>
            <span>{weather.city} {weather.temp.toFixed(0)}°C / {weather.humidity}%</span>
          </div>
          <div>
            {marketLoading ? (
              <span className="text-[var(--color-warn)]">Loading market data...</span>
            ) : marketError ? (
              <span className="text-[var(--color-loss)]">API error: {marketError}</span>
            ) : lastUpdated ? (
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            ) : null}
          </div>
        </div>

        {/* Dashboard */}
        {page === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MineThisNow rigs={rigs} coins={coins} weather={weather} settings={settings} />
              <ProfitCard rigs={rigs} coins={coins} weather={weather} settings={settings} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <WeatherImpactCard weather={weather} />
              <div className="lg:col-span-2">
                <CoinProfitTable rigs={rigs} coins={coins} weather={weather} settings={settings} />
              </div>
            </div>
            <ForecastChart rigs={rigs} coins={coins} forecast={forecast} settings={settings} />
            <HostingCenters rigs={rigs} coins={coins} weather={weather} settings={settings} />
            <AssumptionsPanel settings={settings} coins={coins} />
            {rigs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[var(--color-text)] mb-4">No rigs configured yet</p>
                <button
                  onClick={() => setPage('rigs')}
                  className="bg-[var(--color-accent)] text-white px-6 py-2 rounded text-sm font-medium hover:brightness-110 transition"
                >
                  Add Your First Rig
                </button>
              </div>
            )}
          </div>
        )}

        {/* Rigs */}
        {page === 'rigs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-[var(--color-text-bright)]">Mining Rigs</h2>
              <button
                onClick={() => setShowRigForm(!showRigForm)}
                className="bg-[var(--color-accent)] text-white px-4 py-2 rounded text-sm font-medium hover:brightness-110 transition"
              >
                {showRigForm ? 'Cancel' : '+ Add Rig'}
              </button>
            </div>
            {showRigForm && (
              <RigForm onAdd={(rig) => { addRig(rig); setShowRigForm(false); }} onClose={() => setShowRigForm(false)} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rigs.map((rig) => (
                <RigCard key={rig.id} rig={rig} onToggle={toggleRig} onRemove={removeRig} />
              ))}
            </div>
            {rigs.length === 0 && !showRigForm && (
              <p className="text-center text-[var(--color-text)] py-8">No rigs yet. Click "+ Add Rig" to start.</p>
            )}
          </div>
        )}

        {/* Pools */}
        {page === 'pools' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-[var(--color-text-bright)]">Pool Comparison</h2>
            <PoolComparison rigs={rigs} coins={coins} weather={weather} settings={settings} />
          </div>
        )}

        {/* Settings */}
        {page === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-[var(--color-text-bright)]">Settings</h2>
            <SettingsPanel
              settings={settings}
              updateSetting={updateSetting}
              weather={weather}
              setManualLocation={setManualLocation}
            />
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-[var(--color-text)] opacity-50">
        Estimates only. BTC price, electricity rates, and hardware degradation will vary.
      </footer>
    </div>
  );
}

export default App;
