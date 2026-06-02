/**
 * Cloudflare Worker — WhatToMine CORS proxy
 * Deploy to: bitcraft.indahl.ai/api/whattomine
 * Route pattern: bitcraft.indahl.ai/api/*
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'asic';

    // Only allow known endpoints
    const allowed = ['asic', 'coins'];
    if (!allowed.includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const resp = await fetch(`https://whattomine.com/${type}.json`, {
        headers: { 'User-Agent': 'BitCraft/1.0' },
      });

      if (!resp.ok) {
        return new Response(JSON.stringify({ error: `WhatToMine returned ${resp.status}` }), {
          status: resp.status,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      const data = await resp.text();
      return new Response(data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 's-maxage=120, stale-while-revalidate=60',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
