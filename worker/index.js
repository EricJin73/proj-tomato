export default {
  async fetch(request, env) {
    // 只允许来自你的 GitHub Pages 的请求
    const origin = request.headers.get('Origin') || '';
    const allowed = 'https://ericjin73.github.io';

    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204, origin, allowed);
    }

    if (!origin.startsWith(allowed)) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const body = await request.json();
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiRes = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await geminiRes.json();
      return corsResponse(JSON.stringify(data), 200, origin, allowed);
    } catch (e) {
      return corsResponse(JSON.stringify({ error: e.message }), 500, origin, allowed);
    }
  }
};

function corsResponse(body, status, origin, allowed) {
  const headers = {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  return new Response(body, { status, headers });
}
