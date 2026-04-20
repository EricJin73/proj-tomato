export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = 'https://ericjin73.github.io';

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowed),
      });
    }

    if (!origin.startsWith(allowed)) {
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

      // 直接透传 DeepSeek 的响应体，只替换 CORS headers
      return new Response(res.body, {
        status: res.status,
        headers: {
          ...corsHeaders(allowed),
          'Content-Type': 'application/json; charset=utf-8',
        },
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { ...corsHeaders(allowed), 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
  }
};

function corsHeaders(allowed) {
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
