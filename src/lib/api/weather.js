/**
 * OpenWeatherMap integration.
 * Fetches current conditions + 5-day forecast for cooling cost calculations.
 */

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetch current weather for a location.
 * @param {number} lat
 * @param {number} lon
 * @param {string} apiKey - OpenWeatherMap API key
 * @returns {{ temp: number, humidity: number, description: string, city: string }}
 */
export async function fetchCurrentWeather(lat, lon, apiKey) {
  if (!apiKey) return getDefaultWeather();

  const res = await fetch(
    `${OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  if (!res.ok) {
    console.warn(`OWM current weather: ${res.status}`);
    return getDefaultWeather();
  }
  const data = await res.json();
  return {
    temp: data.main.temp,
    humidity: data.main.humidity,
    feelsLike: data.main.feels_like,
    description: data.weather?.[0]?.description || '',
    city: data.name || 'Unknown',
    windSpeed: data.wind?.speed || 0,
    pressure: data.main.pressure,
  };
}

/**
 * Fetch 5-day / 3-hour forecast.
 * Returns array of { dt, temp, humidity } for charting profitability over time.
 */
export async function fetchForecast(lat, lon, apiKey) {
  if (!apiKey) return [];

  const res = await fetch(
    `${OWM_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  if (!res.ok) return [];
  const data = await res.json();

  return (data.list || []).map((entry) => ({
    dt: entry.dt,
    date: entry.dt_txt,
    temp: entry.main.temp,
    humidity: entry.main.humidity,
    description: entry.weather?.[0]?.description || '',
  }));
}

/**
 * Auto-detect user location via browser geolocation API.
 * Returns { lat, lon } or null.
 */
export function detectLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 10000 }
    );
  });
}

function getDefaultWeather() {
  return {
    temp: 25,
    humidity: 50,
    feelsLike: 25,
    description: 'No weather data — using defaults',
    city: 'Unknown',
    windSpeed: 0,
    pressure: 1013,
  };
}
