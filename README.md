# SiteSport

Site em React + Vite para venda de roupas e materiais esportivos.

## Rodar localmente

```bash
npm install
npm run dev
```

## Deploy: Hostinger (front) + Vercel (back)

- Front (Hostinger): rode `npm run build` e envie a pasta `dist/` para o `public_html`.
- SPA routes: este repo inclui `public/.htaccess` (vai junto pro `dist/`) para `/produto/...` e `/pagamento-concluido` funcionarem.
- Back (Vercel): faça deploy do projeto que contém a pasta `api/` e configure as env vars.
- Como front e back ficam em domínios diferentes, configure no build do front: `VITE_API_BASE_URL=https://SEU-PROJETO.vercel.app`
- Configure no back: `INFINITEPAY_REDIRECT_URL=https://fabayosports.com/pagamento-concluido` (senão ele pode redirecionar pro domínio da Vercel).

Se aparecer `Unexpected token '<' ... is not valid JSON`, normalmente é porque o front não está apontando para a URL da Vercel (ficou sem `VITE_API_BASE_URL`) e está chamando `/api/...` no domínio da Hostinger, que devolve HTML.

## Pagamento (InfinitePay) na Vercel

- Endpoint: `POST /api/create-payment`
- Status do pagamento: `POST /api/payment-check`
- Webhook (opcional): `POST /api/infinitepay-webhook`

Obs: a InfinitePay costuma documentar `items` (e às vezes aparece `itens`); o backend envia os dois por compatibilidade.

### Variáveis de ambiente

Defina na Vercel (Project Settings → Environment Variables) e no seu `.env` local:

- `INFINITEPAY_HANDLE` (obrigatório) — seu `@handle` do InfinitePay Checkout
- `INFINITEPAY_REDIRECT_URL` (opcional) — padrão: `/pagamento-concluido` no mesmo domínio
- `INFINITEPAY_WEBHOOK_URL` (opcional) — ex: `https://seu-dominio.vercel.app/api/infinitepay-webhook`
