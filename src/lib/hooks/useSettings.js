import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bitcraft-settings';

const DEFAULT_SETTINGS = {
  electricityRate: 0.10, // $/kWh
  coolingMethod: 'air',
  currency: 'USD',
  owmApiKey: '',
};

/**
 * Persists user settings to localStorage.
 * No auth needed for MVP — settings live in the browser.
 */
export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting, setSettings };
}
