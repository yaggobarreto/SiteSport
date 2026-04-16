const CHECKOUT_API_URL = 'https://api.infinitepay.io/invoices/public/checkout/links'
const PAYMENT_CHECK_API_URL =
  'https://api.infinitepay.io/invoices/public/checkout/payment_check'

function getHandle() {
  return import.meta.env.VITE_INFINITEPAY_HANDLE?.trim()
}

function toCents(value) {
  return Math.round(Number(value || 0) * 100)
}

function extractCheckoutUrl(payload) {
  return (
    payload?.url ||
    payload?.checkout_url ||
    payload?.payment_url ||
    payload?.invoice_url ||
    payload?.data?.url ||
    payload?.data?.checkout_url ||
    payload?.data?.payment_url ||
    null
  )
}

export function hasInfinitePayConfig() {
  return Boolean(getHandle())
}

export function buildOrderNsu(items) {
  const timestamp = Date.now()
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase()
  const quantity = items.reduce((total, item) => total + item.quantity, 0)

  return `pedido-${timestamp}-${quantity}-${suffix}`
}

export async function createInfinitePayCheckout({
  items,
  redirectUrl,
  webhookUrl,
  customer,
  address,
  orderNsu,
}) {
  const handle = getHandle()

  if (!handle) {
    throw new Error('Configure VITE_INFINITEPAY_HANDLE para usar o checkout.')
  }

  const payload = {
    handle,
    items: items.map((item) => ({
      quantity: item.quantity,
      price: toCents(item.price),
      description: item.size ? `${item.name} - Tam ${item.size}` : item.name,
    })),
    order_nsu: orderNsu ?? buildOrderNsu(items),
  }

  if (redirectUrl) payload.redirect_url = redirectUrl
  if (webhookUrl) payload.webhook_url = webhookUrl
  if (customer) payload.customer = customer
  if (address) payload.address = address

  const response = await fetch(CHECKOUT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel criar o checkout na InfinitePay.')
  }

  const data = await response.json()
  const checkoutUrl = extractCheckoutUrl(data)

  if (!checkoutUrl) {
    throw new Error('A InfinitePay nao retornou a URL do checkout.')
  }

  return { checkoutUrl, orderNsu: payload.order_nsu, raw: data }
}

export async function checkInfinitePayPayment({
  orderNsu,
  transactionNsu,
  slug,
}) {
  const handle = getHandle()

  if (!handle) {
    throw new Error('Configure VITE_INFINITEPAY_HANDLE para consultar pagamentos.')
  }

  const response = await fetch(PAYMENT_CHECK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      handle,
      order_nsu: orderNsu,
      transaction_nsu: transactionNsu,
      slug,
    }),
  })

  if (!response.ok) {
    throw new Error('Nao foi possivel consultar o pagamento na InfinitePay.')
  }

  return response.json()
}
