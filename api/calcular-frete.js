/**
 * POST /api/calcular-frete
 * Body: { cep: "01310100", quantidade: 2 }
 * Response: { modalidades: [...], cidade, uf }
 *
 * Lógica:
 *  1. Valida o CEP
 *  2. Consulta ViaCEP (gratuito, sem auth) para obter a UF
 *  3. Aplica tabela de preços por macrorregião
 *  4. Calcula peso: 400g por peça (mínimo 1 peça)
 */

// ─── Tabela de preços por UF ─────────────────────────────────────────────────
// Preços em centavos. Ajuste conforme sua tabela real dos Correios.
// Origem padrão: São Paulo/SP
const TABELA = {
  // Sudeste (exceto SP) — mais barato
  RJ: { pac: [1890, 2190, 2490], sedex: [2890, 3390, 3990] },
  MG: { pac: [1890, 2190, 2490], sedex: [2890, 3390, 3990] },
  ES: { pac: [2090, 2390, 2790], sedex: [3190, 3690, 4290] },

  // São Paulo
  SP: { pac: [1490, 1790, 2090], sedex: [2290, 2790, 3290] },

  // Sul
  PR: { pac: [2190, 2490, 2890], sedex: [3290, 3790, 4390] },
  SC: { pac: [2190, 2490, 2890], sedex: [3290, 3790, 4390] },
  RS: { pac: [2390, 2790, 3190], sedex: [3490, 3990, 4590] },

  // Centro-Oeste
  GO: { pac: [2390, 2790, 3190], sedex: [3590, 4190, 4790] },
  MT: { pac: [2590, 2990, 3490], sedex: [3890, 4490, 5190] },
  MS: { pac: [2390, 2790, 3190], sedex: [3590, 4190, 4790] },
  DF: { pac: [2490, 2890, 3390], sedex: [3690, 4290, 4990] },

  // Nordeste
  BA: { pac: [2590, 2990, 3490], sedex: [3890, 4490, 5190] },
  SE: { pac: [2590, 2990, 3490], sedex: [3890, 4490, 5190] },
  AL: { pac: [2790, 3190, 3690], sedex: [4090, 4790, 5590] },
  PE: { pac: [2790, 3190, 3690], sedex: [4090, 4790, 5590] },
  PB: { pac: [2790, 3190, 3690], sedex: [4090, 4790, 5590] },
  RN: { pac: [2890, 3290, 3790], sedex: [4190, 4890, 5690] },
  CE: { pac: [2890, 3290, 3790], sedex: [4190, 4890, 5690] },
  PI: { pac: [2990, 3390, 3890], sedex: [4290, 4990, 5790] },
  MA: { pac: [3090, 3490, 3990], sedex: [4390, 5090, 5890] },

  // Norte
  PA: { pac: [3290, 3790, 4390], sedex: [4790, 5490, 6390] },
  AP: { pac: [3490, 3990, 4590], sedex: [4990, 5790, 6690] },
  AM: { pac: [3590, 4090, 4790], sedex: [5190, 5990, 6890] },
  RR: { pac: [3790, 4290, 4990], sedex: [5390, 6190, 7090] },
  RO: { pac: [3390, 3890, 4490], sedex: [4890, 5590, 6490] },
  AC: { pac: [3690, 4190, 4890], sedex: [5290, 6090, 6990] },
  TO: { pac: [3090, 3490, 3990], sedex: [4390, 5090, 5890] },
};

// Faixas de quantidade → índice na tabela (0=1pc, 1=2-3pc, 2=4+pc)
function getFaixaIdx(quantidade) {
  if (quantidade <= 1) return 0;
  if (quantidade <= 3) return 1;
  return 2;
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });

  const body = readBody(req);
  const rawCep = String(body?.cep || "").replace(/\D/g, "");
  const quantidade = Math.max(1, parseInt(body?.quantidade ?? 1, 10));

  if (rawCep.length !== 8) {
    return sendJson(res, 400, { error: "CEP inválido. Informe 8 dígitos." });
  }

  // 1. Consulta ViaCEP
  let viaCepData;
  try {
    const resp = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
    viaCepData = await resp.json();
  } catch {
    return sendJson(res, 502, { error: "Não foi possível consultar o CEP. Tente novamente." });
  }

  if (viaCepData?.erro) {
    return sendJson(res, 404, { error: "CEP não encontrado. Verifique e tente novamente." });
  }

  const uf = (viaCepData?.uf || "").toUpperCase();
  const cidade = viaCepData?.localidade || "";

  const tabela = TABELA[uf];
  if (!tabela) {
    return sendJson(res, 422, { error: `Estado "${uf}" não encontrado na tabela de frete.` });
  }

  const idx = getFaixaIdx(quantidade);
  const precoPac = tabela.pac[idx];
  const precoSedex = tabela.sedex[idx];

  return sendJson(res, 200, {
    cidade,
    uf,
    modalidades: [
      { id: "pac",   nome: "PAC",   preco: precoPac,   prazo: "7–12 dias úteis" },
      { id: "sedex", nome: "SEDEX", preco: precoSedex,  prazo: "2–5 dias úteis" },
    ],
  });
}
