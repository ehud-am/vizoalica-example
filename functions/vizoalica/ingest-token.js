const PROJECT_ID = '29335878-6d62-4461-a306-2dca996523ca';
const SOURCE_ID = 'd26ea3c9-481f-4ddc-a623-3ffc7ec836e1';

function base64url(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

async function sign(input, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(input))
  );
  let binary = '';
  for (const byte of signature) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

export async function onRequestGet({ request, env }) {
  const origin = new URL(request.url).origin;
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: 'vizoalica-sample-pages',
    aud: 'vizoalica-ingest',
    sub: `source/${SOURCE_ID}`,
    project_id: PROJECT_ID,
    source_id: SOURCE_ID,
    origin,
    scope: 'events:write',
    iat: now,
    nbf: now,
    exp: now + 300,
    jti: crypto.randomUUID(),
    max_events: 25
  };
  const signingInput = `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(claims)}`;
  const token = `${signingInput}.${await sign(signingInput, env.VIZOALICA_TOKEN_SECRET)}`;
  return new Response(token, {
    headers: {
      'cache-control': 'no-store',
      'content-type': 'text/plain; charset=utf-8',
      'x-content-type-options': 'nosniff'
    }
  });
}

export function onRequest() {
  return new Response('Method Not Allowed', { status: 405, headers: { allow: 'GET' } });
}
