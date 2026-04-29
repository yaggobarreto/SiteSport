function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  // Vercel may pre-parse JSON, or send raw body as string.
  // For now we just acknowledge receipt; persist/verify if you want to track order status.
  // eslint-disable-next-line no-console
  console.log("InfinitePay webhook received:", req.body);

  return sendJson(res, 200, { ok: true });
};

