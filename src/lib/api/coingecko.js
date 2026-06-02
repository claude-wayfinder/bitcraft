const BASE = 'https://api.coingecko.com/api/v3';

/**
 * Fetch BTC + major coin prices in USD.
 * Free tier: ~10k calls/month. We poll every 5 min = ~8.6k/month.
 */
export async function fetchPrices() {
  const ids = 'bitcoin,ethereum,litecoin,dogecoin,zcash,monero,dash,bitcoin-cash,kaspa';
  const res = await fetch(`${BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
  if (!res.ok) throw new Error(`CoinGecko: ${res.status}`);
  return res.json();
}

/**
 * Returns just the BTC/USD price.
 */
export async function fetchBtcPrice() {
  const data = await fetchPrices();
  return data.bitcoin?.usd || 0;
}
