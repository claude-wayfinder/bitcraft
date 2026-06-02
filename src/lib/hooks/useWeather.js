import { useState, useEffect, useCallback } from 'react';
import { fetchCurrentWeather, fetchForecast, detectLocation } from '../api/weather.js';

/**
 * Manages location detection, current weather, and 5-day forecast.
 * Polls every 10 minutes (weather changes slowly).
 */
export function useWeather(apiKey) {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState({ temp: 25, humidity: 50, city: 'Loading...' });
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshWeather = useCallback(async (lat, lon) => {
    if (!lat || !lon) return;
    const [current, fcast] = await Promise.all([
      fetchCurrentWeather(lat, lon, apiKey),
      fetchForecast(lat, lon, apiKey),
    ]);
    setWeather(current);
    setForecast(fcast);
    setLoading(false);
  }, [apiKey]);

  // Auto-detect location on mount
  useEffect(() => {
    (async () => {
      const loc = await detectLocation();
      if (loc) {
        setLocation(loc);
        await refreshWeather(loc.lat, loc.lon);
      } else {
        setLoading(false);
      }
    })();
  }, [refreshWeather]);

  // Poll every 10 min
  useEffect(() => {
    if (!location) return;
    const interval = setInterval(() => {
      if (!document.hidden) refreshWeather(location.lat, location.lon);
    }, 600_000);
    return () => clearInterval(interval);
  }, [location, refreshWeather]);

  const setManualLocation = useCallback(async (lat, lon) => {
    setLocation({ lat, lon });
    await refreshWeather(lat, lon);
  }, [refreshWeather]);

  return { weather, forecast, location, loading, setManualLocation };
}
