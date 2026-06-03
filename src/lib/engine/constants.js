// ASIC and GPU miner database — auto-fills form when user selects a model
export const MINERS = {
  'antminer-s21-hyd':  { name: 'Antminer S21 Hyd',  algorithm: 'SHA-256',  hashrate: 335,   hashrateUnit: 'TH/s', power: 5360 },
  'antminer-s21':      { name: 'Antminer S21',       algorithm: 'SHA-256',  hashrate: 200,   hashrateUnit: 'TH/s', power: 3550 },
  'antminer-s19-xp':   { name: 'Antminer S19 XP',    algorithm: 'SHA-256',  hashrate: 140,   hashrateUnit: 'TH/s', power: 3010 },
  'antminer-s19j-pro': { name: 'Antminer S19j Pro',  algorithm: 'SHA-256',  hashrate: 104,   hashrateUnit: 'TH/s', power: 3068 },
  'whatsminer-m50s':    { name: 'WhatsMiner M50S',    algorithm: 'SHA-256',  hashrate: 126,   hashrateUnit: 'TH/s', power: 3276 },
  'whatsminer-m56s':    { name: 'WhatsMiner M56S',    algorithm: 'SHA-256',  hashrate: 212,   hashrateUnit: 'TH/s', power: 5400 },
  'antminer-l7':       { name: 'Antminer L7',        algorithm: 'Scrypt',   hashrate: 9500,  hashrateUnit: 'MH/s', power: 3425 },
  'antminer-l9':       { name: 'Antminer L9',        algorithm: 'Scrypt',   hashrate: 16000, hashrateUnit: 'MH/s', power: 3360 },
  'antminer-z15':      { name: 'Antminer Z15',       algorithm: 'Equihash', hashrate: 420,   hashrateUnit: 'kSol/s', power: 1510 },
  'antminer-d9':       { name: 'Antminer D9',        algorithm: 'X11',      hashrate: 1770,  hashrateUnit: 'GH/s', power: 2839 },
  // GPU miners
  'nvidia-a4000':      { name: 'NVIDIA A4000',        algorithm: 'Ethash',   hashrate: 68,    hashrateUnit: 'MH/s', power: 140 },
  'nvidia-a6000':      { name: 'NVIDIA A6000',        algorithm: 'Ethash',   hashrate: 100,   hashrateUnit: 'MH/s', power: 300 },
  'nvidia-3080':       { name: 'NVIDIA RTX 3080',     algorithm: 'Ethash',   hashrate: 100,   hashrateUnit: 'MH/s', power: 224 },
  'nvidia-3090':       { name: 'NVIDIA RTX 3090',     algorithm: 'Ethash',   hashrate: 120,   hashrateUnit: 'MH/s', power: 290 },
  'nvidia-4090':       { name: 'NVIDIA RTX 4090',     algorithm: 'Ethash',   hashrate: 132,   hashrateUnit: 'MH/s', power: 310 },
  'amd-7900xtx':       { name: 'AMD RX 7900 XTX',     algorithm: 'Ethash',   hashrate: 112,   hashrateUnit: 'MH/s', power: 250 },
  'iceriver-ks3m':     { name: 'IceRiver KS3M',       algorithm: 'KHeavyHash', hashrate: 6, hashrateUnit: 'TH/s', power: 3400 },
  'custom':            { name: 'Custom Rig',          algorithm: null,       hashrate: null,  hashrateUnit: null, power: null },
};

// WhatToMine default reference hashrates per algorithm (to scale their estimated_rewards)
export const WTM_REFERENCE = {
  'SHA-256':  { hashrate: 110,   unit: 'TH/s' },
  'Scrypt':   { hashrate: 9500,  unit: 'MH/s' },
  'Equihash': { hashrate: 420,   unit: 'kSol/s' },
  'X11':      { hashrate: 1770,  unit: 'GH/s' },
  'Ethash':   { hashrate: 580,   unit: 'MH/s' },
  'KHeavyHash': { hashrate: 12, unit: 'TH/s' },
};

// Major mining pools by algorithm
export const POOLS = {
  'SHA-256': [
    { name: 'Foundry USA',  fee: 0.00, payout: 'FPPS' },
    { name: 'AntPool',      fee: 0.00, payout: 'FPPS' },
    { name: 'F2Pool',       fee: 0.025, payout: 'PPS+' },
    { name: 'ViaBTC',       fee: 0.04, payout: 'PPS+' },
    { name: 'Braiins Pool', fee: 0.02, payout: 'FPPS' },
    { name: 'Luxor',        fee: 0.025, payout: 'FPPS' },
  ],
  'Scrypt': [
    { name: 'LitecoinPool', fee: 0.00, payout: 'PPS' },
    { name: 'F2Pool',       fee: 0.025, payout: 'PPS+' },
    { name: 'ViaBTC',       fee: 0.04, payout: 'PPS+' },
  ],
  'Equihash': [
    { name: 'Flypool',      fee: 0.01, payout: 'PPLNS' },
    { name: 'F2Pool',       fee: 0.03, payout: 'PPS+' },
  ],
  'X11': [
    { name: 'NiceHash',     fee: 0.02, payout: 'PPS' },
    { name: 'F2Pool',       fee: 0.025, payout: 'PPS+' },
  ],
};

// Algorithm-friendly display names
export const ALGORITHMS = ['SHA-256', 'Scrypt', 'Equihash', 'X11', 'Ethash', 'KHeavyHash'];

// Hosting centers — curated list of reputable colocation facilities
export const HOSTING_CENTERS = [
  { name: 'Compute North',     location: 'TX, USA',      rate: 0.055, cooling: 'immersion', reputation: 5, note: 'Tier-1, institutional grade' },
  { name: 'Blockstream Mining', location: 'QC, Canada',  rate: 0.03,  cooling: 'air', reputation: 5, note: 'Hydro power, very low rates' },
  { name: 'Whinstone (Riot)',   location: 'TX, USA',      rate: 0.05,  cooling: 'immersion', reputation: 5, note: 'Largest NA facility, 700MW' },
  { name: 'Core Scientific',    location: 'GA/TX, USA',  rate: 0.06,  cooling: 'air', reputation: 4, note: 'Public company, multiple sites' },
  { name: 'Bitdeer',            location: 'TX/Norway',   rate: 0.065, cooling: 'air', reputation: 4, note: 'Global, ex-Bitmain' },
  { name: 'Compass Mining',     location: 'Various USA', rate: 0.07,  cooling: 'air', reputation: 3, note: 'Marketplace model, DYOR on specific hosts' },
  { name: 'HIVE Digital',       location: 'QC/Sweden',   rate: 0.035, cooling: 'air', reputation: 4, note: '100% green energy' },
  { name: 'Applied Digital',    location: 'ND, USA',     rate: 0.04,  cooling: 'air', reputation: 4, note: 'Wind + natural gas, cold climate' },
  { name: 'Mawson Infra',       location: 'PA/GA, USA',  rate: 0.058, cooling: 'air', reputation: 3, note: 'Carbon-neutral focus' },
  { name: 'Self-host (Home)',   location: 'Your location', rate: null, cooling: null, reputation: null, note: 'Use your own electricity rate + cooling settings' },
];

// Default slippage assumptions (user-adjustable in settings)
export const SLIPPAGE_DEFAULTS = {
  uptimePct: 0.97,           // 97% — accounts for reboots, maintenance
  staleSharePct: 0.01,       // 1% stale/rejected shares
  poolLuckVariance: 0.02,    // ±2% multi-day luck variance
  hardwareDegradation: 0.005, // 0.5% annual hashrate loss from wear
};

// Cooling method options
export const COOLING_METHODS = [
  { value: 'air',         label: 'Air Conditioning (Standard)' },
  { value: 'evaporative', label: 'Evaporative Cooling (Swamp)' },
  { value: 'immersion',   label: 'Immersion Cooling' },
  { value: 'none',        label: 'No Active Cooling (Ambient)' },
];
