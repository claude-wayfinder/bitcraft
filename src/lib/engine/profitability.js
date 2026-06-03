import { coolingCostPerDay } from './cooling.js';
import { WTM_REFERENCE, SLIPPAGE_DEFAULTS } from './constants.js';

/**
 * Scale WhatToMine revenue to the user's actual hashrate.
 * WTM gives revenue for a reference hashrate — we proportionally scale.
 */
export function scaledRevenue(rig, coinData) {
  const ref = WTM_REFERENCE[coinData.algorithm];
  if (!ref) return 0;
  const scale = rig.hashrate / ref.hashrate;
  return (coinData.btc_revenue || 0) * scale * (coinData.btcPrice || 0);
}

/**
 * Compute the combined slippage multiplier from all real-world loss factors.
 */
export function slippageMultiplier(settings) {
  const uptime = settings.uptimePct ?? SLIPPAGE_DEFAULTS.uptimePct;
  const stale = settings.staleSharePct ?? SLIPPAGE_DEFAULTS.staleSharePct;
  return uptime * (1 - stale);
}

/**
 * Calculate daily profit for a single rig mining a single coin.
 * This is the core formula that combines revenue, power, cooling, and slippage.
 */
export function dailyProfit(rig, coinData, weather, settings) {
  const grossRevenue = scaledRevenue(rig, coinData);
  const slip = slippageMultiplier(settings);

  const basePowerCost = (rig.power_draw / 1000) * 24 * settings.electricityRate;

  const { costPerDay: coolingCost, throttleFactor, details: coolingDetails } = coolingCostPerDay(
    rig.power_draw,
    weather.temp,
    weather.humidity,
    settings.coolingMethod,
    settings.electricityRate
  );

  const effectiveRevenue = grossRevenue * throttleFactor * slip;
  const slippageLoss = grossRevenue * throttleFactor * (1 - slip);
  const totalCost = basePowerCost + coolingCost;
  const profit = effectiveRevenue - totalCost;

  return {
    grossRevenue,
    revenue: effectiveRevenue,
    slippageLoss,
    slippagePct: (1 - slip) * 100,
    powerCost: basePowerCost,
    coolingCost,
    totalCost,
    profit,
    margin: effectiveRevenue > 0 ? profit / effectiveRevenue : 0,
    throttleFactor,
    coolingDetails,
  };
}

/**
 * Calculate pool-adjusted profit (subtracts pool fee from revenue).
 */
export function dailyProfitWithPool(rig, coinData, weather, settings, poolFee = 0) {
  const result = dailyProfit(rig, coinData, weather, settings);
  const feeDeduction = result.revenue * poolFee;
  return {
    ...result,
    poolFee: feeDeduction,
    revenue: result.revenue - feeDeduction,
    profit: result.profit - feeDeduction,
    totalCost: result.totalCost + feeDeduction,
  };
}

/**
 * Rank all coins by profitability for the user's rig fleet.
 * Returns sorted array: most profitable first.
 */
export function rankCoins(rigs, allCoinData, weather, settings) {
  const results = [];

  for (const coin of allCoinData) {
    const compatibleRigs = rigs.filter(
      (r) => r.is_active && r.algorithm === coin.algorithm
    );
    if (compatibleRigs.length === 0) continue;

    let totalRevenue = 0;
    let totalPowerCost = 0;
    let totalCoolingCost = 0;
    let totalProfit = 0;

    for (const rig of compatibleRigs) {
      const p = dailyProfit(rig, coin, weather, settings);
      totalRevenue += p.revenue;
      totalPowerCost += p.powerCost;
      totalCoolingCost += p.coolingCost;
      totalProfit += p.profit;
    }

    results.push({
      coin: coin.tag || coin.name,
      coinName: coin.name,
      algorithm: coin.algorithm,
      dailyRevenue: totalRevenue,
      dailyPowerCost: totalPowerCost,
      dailyCoolingCost: totalCoolingCost,
      dailyProfit: totalProfit,
      rigCount: compatibleRigs.length,
    });
  }

  return results.sort((a, b) => b.dailyProfit - a.dailyProfit);
}
