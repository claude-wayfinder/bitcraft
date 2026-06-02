import { useState, useEffect, useCallback } from 'react';
import { fetchPrices } from '../api/coingecko.js';
import { fetchAsicCoins } from '../api/whattomine.js';

/**
 * Polls CoinGecko (5 min) and WhatToMine (2 min) for live market data.
 * Pauses when tab is not visible.
 */
export function useMarketData() {
  const [prices, setPrices] = useState(null);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [priceData, coinData] = await Promise.all([
        fetchPrices(),
        fetchAsicCoins(),
      ]);

      // Attach BTC price to each coin for profit calc
      const btcUsd = priceData.bitcoin?.usd || 0;
      const enriched = coinData.map((c) => ({ ...c, btcPrice: btcUsd }));

      setPrices(priceData);
      setCoins(enriched);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      if (!document.hidden) refresh();
    }, 120_000); // 2 min
    return () => clearInterval(interval);
  }, [refresh]);

  return { prices, coins, loading, error, lastUpdated, refresh };
}
