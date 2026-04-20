const ALLOWED_ORIGINS = [
  'https://ericjin73.github.io',
  'https://tinyfocus.net',
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const isAllowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (!isAllowed) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const { prompt } = await request.json();

      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      return new Response(res.body, {
        status: res.status,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8' },
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders(origin), 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
  }
};

function corsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.find(o => origin.startsWith(o)) || ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
