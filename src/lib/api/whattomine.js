/**
 * WhatToMine API integration.
 * Fetches ASIC and GPU coin profitability data.
 *
 * CORS note: WhatToMine may block browser-direct requests.
 * If that happens, swap BASE_URL to a Vercel serverless proxy.
 */

// In production (Vercel), use our serverless proxy to bypass CORS.
// In dev, use Vite's proxy config.
const BASE_URL = '/api/whattomine';

/**
 * Fetch ASIC-mineable coins (SHA-256, Scrypt, X11, etc.)
 */
export async function fetchAsicCoins() {
  try {
    const res = await fetch(`${BASE_URL}?type=asic`);
    if (!res.ok) throw new Error(`WhatToMine ASIC: ${res.status}`);
    const data = await res.json();
    return normalizeCoins(data.coins);
  } catch (err) {
    console.warn('WhatToMine ASIC fetch failed, using fallback:', err.message);
    return getFallbackData();
  }
}

/**
 * Fetch GPU-mineable coins (Ethash, etc.)
 */
export async function fetchGpuCoins() {
  try {
    const res = await fetch(`${BASE_URL}?type=coins`);
    if (!res.ok) throw new Error(`WhatToMine GPU: ${res.status}`);
    const data = await res.json();
    return normalizeCoins(data.coins);
  } catch (err) {
    console.warn('WhatToMine GPU fetch failed:', err.message);
    return [];
  }
}

/**
 * Normalize WhatToMine response into a flat array.
 */
function normalizeCoins(coinsObj) {
  if (!coinsObj) return [];
  return Object.entries(coinsObj).map(([name, data]) => ({
    name,
    tag: data.tag,
    algorithm: data.algorithm,
    difficulty: data.difficulty,
    nethash: data.nethash,
    block_reward: data.block_reward,
    block_time: data.block_time,
    exchange_rate: data.exchange_rate,       // in BTC
    btc_revenue: parseFloat(data.btc_revenue) || 0,
    revenue: parseFloat(data.revenue) || 0,  // USD at WTM's reference hashrate
    profitability: data.profitability,
    estimated_rewards: parseFloat(data.estimated_rewards) || 0,
    lagging: data.lagging,
  }));
}

/**
 * Fallback data when WhatToMine is unreachable (CORS blocked etc.)
 * Values sourced from WhatToMine API as of 2026-06-02, for reference hashrates in constants.js.
 * These drift with difficulty changes but are ballpark-correct for weeks.
 */
function getFallbackData() {
  return [
    { name: 'Bitcoin', tag: 'BTC', algorithm: 'SHA-256', btc_revenue: 0.00026762, revenue: 0, exchange_rate: 1, difficulty: 0, nethash: 0, block_reward: 3.125, block_time: 600, estimated_rewards: 0, lagging: false },
    { name: 'BitcoinCash', tag: 'BCH', algorithm: 'SHA-256', btc_revenue: 0.00026624, revenue: 0, exchange_rate: 0, difficulty: 0, nethash: 0, block_reward: 3.125, block_time: 600, estimated_rewards: 0, lagging: false },
    { name: 'Fractal Bitcoin', tag: 'FB', algorithm: 'SHA-256', btc_revenue: 0.00025042, revenue: 0, exchange_rate: 0, difficulty: 0, nethash: 0, block_reward: 25, block_time: 30, estimated_rewards: 0, lagging: false },
    { name: 'eCash', tag: 'XEC', algorithm: 'SHA-256', btc_revenue: 0.0002445, revenue: 0, exchange_rate: 0, difficulty: 0, nethash: 0, block_reward: 3.125, block_time: 600, estimated_rewards: 0, lagging: false },
    { name: 'DGB-SHA', tag: 'DGB', algorithm: 'SHA-256', btc_revenue: 0.00029125, revenue: 0, exchange_rate: 0, difficulty: 0, nethash: 0, block_reward: 665.21, block_time: 15, estimated_rewards: 0, lagging: false },
    { name: 'Litecoin', tag: 'LTC', algorithm: 'Scrypt', btc_revenue: 0.00061000, revenue: 0, exchange_rate: 0, difficulty: 0, nethash: 0, block_reward: 6.25, block_time: 150, estimated_rewards: 0, lagging: false },
    { name: 'Zcash', tag: 'ZEC', algorithm: 'Equihash', btc_revenue: 0.00057044, revenue: 0, exchange_rate: 0, difficulty: 0, nethash: 0, block_reward: 1.25, block_time: 75, estimated_rewards: 0, lagging: false },
    { name: 'Dash', tag: 'DASH', algorithm: 'X11', btc_revenue: 0.00015000, revenue: 0, exchange_rate: 0, difficulty: 0, nethash: 0, block_reward: 1.56, block_time: 150, estimated_rewards: 0, lagging: false },
  ];
}
