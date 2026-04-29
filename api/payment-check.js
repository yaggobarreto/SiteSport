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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const body = readJsonBody(req);
  const handle = process.env.INFINITEPAY_HANDLE;
  if (!handle) {
    return sendJson(res, 500, { error: "Missing env INFINITEPAY_HANDLE" });
  }

  const orderNsu = body?.order_nsu;
  const transactionNsu = body?.transaction_nsu;
  const slug = body?.slug;

  if (!orderNsu && !transactionNsu && !slug) {
    return sendJson(res, 400, {
      error: "Provide at least one of: order_nsu, transaction_nsu, slug",
    });
  }

  const payload = {
    handle,
    order_nsu: orderNsu,
    transaction_nsu: transactionNsu,
    slug,
  };

  try {
    const infinitepayResponse = await fetch(
      "https://api.checkout.infinitepay.io/payment_check",
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

    return sendJson(res, 200, data);
  } catch (error) {
    return sendJson(res, 500, {
      error: "Failed to check payment",
      details: String(error?.message || error),
    });
  }
}
