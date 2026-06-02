export default async function handler(req, res) {
  const type = req.query.type || 'asic';
  const url = `https://whattomine.com/${type}.json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `WhatToMine returned ${response.status}` });
    }
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=60');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
