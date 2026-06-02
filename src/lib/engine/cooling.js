/**
 * Cooling cost engine — the core differentiator.
 * Models real-world cooling costs from humidity, temperature, and cooling method.
 * Uses the Stull (2011) wet-bulb temperature approximation.
 */

/**
 * Wet-bulb temperature via Stull (2011) approximation.
 * Accurate for RH 5-99%, T -20 to 50°C, error ±1°C.
 * @param {number} T - dry-bulb temperature in Celsius
 * @param {number} RH - relative humidity in percent (0-100)
 * @returns {number} wet-bulb temperature in Celsius
 */
export function wetBulbTemp(T, RH) {
  return (
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035
  );
}

/**
 * Thermal throttle factor — estimates hashrate reduction when cooling is insufficient.
 * @param {number} ambientTempC - ambient temperature in Celsius
 * @returns {number} factor 0.0 to 1.0 (1.0 = no throttling)
 */
export function thermalThrottleFactor(ambientTempC) {
  const estimatedChipTemp = ambientTempC + 30; // ASIC chips run ~30°C above ambient
  if (estimatedChipTemp < 75) return 1.0;
  if (estimatedChipTemp > 105) return 0.0; // hardware shutdown
  return 1.0 - ((estimatedChipTemp - 75) / 30) * 0.5;
}

/**
 * Calculate cooling cost per day based on rig power, weather, and cooling method.
 * @param {number} rigWatts - rig power draw in watts
 * @param {number} ambientTempC - ambient temperature in Celsius
 * @param {number} humidityPct - relative humidity 0-100
 * @param {string} coolingMethod - 'air' | 'evaporative' | 'immersion' | 'none'
 * @param {number} electricityRate - $/kWh
 * @returns {{ costPerDay: number, throttleFactor: number, details: string }}
 */
export function coolingCostPerDay(rigWatts, ambientTempC, humidityPct, coolingMethod, electricityRate) {
  const heatToRemoveKW = rigWatts / 1000;
  const targetTemp = 25; // optimal ASIC operating temp °C

  if (coolingMethod === 'none') {
    const throttle = thermalThrottleFactor(ambientTempC);
    const status = throttle >= 1.0
      ? 'Ambient temps OK — no throttling'
      : throttle > 0
        ? `Thermal throttling: ${((1 - throttle) * 100).toFixed(0)}% hashrate loss`
        : 'DANGER: Hardware shutdown temperature exceeded';
    return { costPerDay: 0, throttleFactor: throttle, details: status };
  }

  if (coolingMethod === 'immersion') {
    const overheadFraction = 0.03;
    const costPerDay = heatToRemoveKW * overheadFraction * 24 * electricityRate;
    return {
      costPerDay,
      throttleFactor: 1.0,
      details: 'Immersion cooling: minimal overhead, weather-immune',
    };
  }

  if (coolingMethod === 'evaporative') {
    const Twb = wetBulbTemp(ambientTempC, humidityPct);
    const maxCoolingDelta = ambientTempC - Twb;
    const saturationEfficiency = 0.85;
    const achievableDrop = maxCoolingDelta * saturationEfficiency;
    const outletTemp = ambientTempC - achievableDrop;
    const evapPowerKW = heatToRemoveKW * 0.05; // fans + pump: ~5% of heat load

    if (outletTemp <= targetTemp) {
      const costPerDay = evapPowerKW * 24 * electricityRate;
      return {
        costPerDay,
        throttleFactor: 1.0,
        details: `Evap cooling sufficient (outlet ${outletTemp.toFixed(1)}°C). Wet-bulb: ${Twb.toFixed(1)}°C`,
      };
    }

    // Evap handles partial load, AC supplements the rest
    const remainingDelta = outletTemp - targetTemp;
    const totalDelta = Math.max(ambientTempC - targetTemp, 1);
    const acFraction = remainingDelta / totalDelta;
    const cop = Math.max(2.0, Math.min(4.5, 6.0 - 0.1 * ambientTempC));
    const supplementalAcKW = (heatToRemoveKW * acFraction) / cop;
    const costPerDay = (evapPowerKW + supplementalAcKW) * 24 * electricityRate;
    return {
      costPerDay,
      throttleFactor: 1.0,
      details: `Evap + supplemental AC (humidity ${humidityPct}% too high for evap alone). Wet-bulb: ${Twb.toFixed(1)}°C`,
    };
  }

  // Default: air conditioning
  const cop = Math.max(2.0, Math.min(4.5, 6.0 - 0.1 * ambientTempC));
  const coolingKW = heatToRemoveKW / cop;
  const costPerDay = coolingKW * 24 * electricityRate;
  return {
    costPerDay,
    throttleFactor: 1.0,
    details: `Standard AC (COP ${cop.toFixed(1)}). Higher temps = lower efficiency.`,
  };
}
