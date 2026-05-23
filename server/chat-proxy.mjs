import http from 'node:http';

const PORT = Number(process.env.PORT || 8787);
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
const ANTHROPIC_VERSION = '2023-06-01';

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
    });
    res.end();
    return;
  }

  if (req.url !== '/api/chat' || req.method !== 'POST') {
    sendJson(res, 404, { error: 'Not Found' });
    return;
  }

  if (!ANTHROPIC_API_KEY) {
    sendJson(res, 500, { error: 'Missing ANTHROPIC_API_KEY on server' });
    return;
  }

  try {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const clientPayload = JSON.parse(raw || '{}');

    const body = {
      model: clientPayload.model || ANTHROPIC_MODEL,
      max_tokens: Number(clientPayload.max_tokens || 400),
      system: String(clientPayload.system || ''),
      messages: Array.isArray(clientPayload.messages) ? clientPayload.messages : [],
    };

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();
    const data = text ? JSON.parse(text) : {};
    sendJson(res, upstream.status, data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Proxy error';
    sendJson(res, 500, { error: message });
  }
});

server.listen(PORT, () => {
  console.log(`Chat proxy running at http://localhost:${PORT}/api/chat`);
});
