// Edge gate for /financial-model/* — HTTP Basic Auth with a single shared
// password. The password is read from the GATE_PASSWORD secret (set via
// `wrangler pages secret put GATE_PASSWORD`), never hardcoded here.
//
// Any username is accepted; only the password is checked. This runs on
// Cloudflare's edge before the static asset is served, so the page never
// reaches the browser without the password.

function constantTimeEqual(a, b) {
  // Compare as bytes in constant time to avoid leaking length/contents via timing.
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  // Mix in the length so unequal lengths still take the same path.
  let diff = ba.length ^ bb.length;
  const n = Math.max(ba.length, bb.length);
  for (let i = 0; i < n; i++) {
    diff |= (ba[i] || 0) ^ (bb[i] || 0);
  }
  return diff === 0;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const expected = env.GATE_PASSWORD;

  // If no password is configured, fail closed rather than serving the page.
  if (!expected) {
    return new Response("Gate not configured.", { status: 503 });
  }

  const header = request.headers.get("Authorization") || "";
  if (header.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    const sep = decoded.indexOf(":");
    const password = sep >= 0 ? decoded.slice(sep + 1) : decoded;
    if (constantTimeEqual(password, expected)) {
      return next(); // password OK → serve the static page
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ION Financial Model", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
