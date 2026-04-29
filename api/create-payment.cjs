const { randomUUID } = require("crypto");

function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (!req.body) return null;
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return null;
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  // Basic CORS for local dev + browser calls
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const body = readJsonBody(req);
  const items = Array.isArray(body?.items) ? body.items : null;
  if (!items || items.length === 0) {
    return sendJson(res, 400, { error: "Missing items[]" });
  }

  const handle = process.env.INFINITEPAY_HANDLE;
  if (!handle) {
    return sendJson(res, 500, { error: "Missing env INFINITEPAY_HANDLE" });
  }

  const origin = req.headers.origin || `https://${req.headers.host}`;
  const redirectUrl =
    process.env.INFINITEPAY_REDIRECT_URL || `${origin}/pagamento-concluido`;

  const webhookUrl = process.env.INFINITEPAY_WEBHOOK_URL || undefined;

  const normalizedItems = items
    .map((item) => ({
      quantity: Number(item?.quantity ?? 0),
      price: Number(item?.price ?? 0),
      description: String(item?.name ?? "").trim(),
    }))
    .filter(
      (item) =>
        Number.isFinite(item.quantity) &&
        item.quantity > 0 &&
        Number.isFinite(item.price) &&
        item.price > 0 &&
        item.description.length > 0
    );

  if (normalizedItems.length === 0) {
    return sendJson(res, 400, { error: "Invalid items[]" });
  }

  const customer = body?.customer && typeof body.customer === "object" ? body.customer : undefined;
  const address = body?.address && typeof body.address === "object" ? body.address : undefined;

  const payload = {
    handle,
    redirect_url: redirectUrl,
    order_nsu: randomUUID(),
    // Na prática, a API aceita `items` (e alguns materiais citam `itens`).
    // Enviamos `items` e também `itens` por compatibilidade.
    items: normalizedItems,
    itens: normalizedItems,
  };

  if (webhookUrl) payload.webhook_url = webhookUrl;
  if (customer) payload.customer = customer;
  if (address) payload.address = address;

  try {
    const infinitepayResponse = await fetch(
      "https://api.checkout.infinitepay.io/links",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await infinitepayResponse.json().catch(() => null);

    if (!infinitepayResponse.ok) {
      return sendJson(res, infinitepayResponse.status, {
        error: "InfinitePay error",
        details: data,
      });
    }

    const checkoutUrl =
      data?.url || data?.checkout_url || data?.payment_url || null;

    if (!checkoutUrl) {
      return sendJson(res, 502, {
        error: "InfinitePay did not return a checkout url",
        details: data,
      });
    }

    return sendJson(res, 200, { checkout_url: checkoutUrl });
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to create payment", details: String(error?.message || error) });
  }
};
