import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  checkInfinitePayPayment,
  hasInfinitePayConfig,
} from '../lib/infinitepay'
import { useCartStore } from '../store/useCartStore'

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams()
  const clearCart = useCartStore((state) => state.clearCart)
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Confirmando seu pagamento...')
  const [details, setDetails] = useState(null)

  const params = useMemo(
    () => ({
      orderNsu: searchParams.get('order_nsu'),
      transactionNsu: searchParams.get('transaction_nsu'),
      slug: searchParams.get('slug'),
      receiptUrl: searchParams.get('receipt_url'),
      captureMethod: searchParams.get('capture_method'),
    }),
    [searchParams]
  )

  useEffect(() => {
    if (!hasInfinitePayConfig()) {
      setStatus('error')
      setMessage(
        'Falta configurar a InfinitePay no projeto antes de validar o pagamento.'
      )
      return
    }

    if (!params.orderNsu || !params.transactionNsu || !params.slug) {
      setStatus('error')
      setMessage('Nao encontramos os dados do pagamento para confirmar o pedido.')
      return
    }

    let active = true

    async function validatePayment() {
      try {
        const response = await checkInfinitePayPayment(params)
        if (!active) return

        setDetails(response)

        if (response?.paid) {
          clearCart()
          setStatus('success')
          setMessage('Pagamento confirmado. Pedido liberado para separacao.')
          return
        }

        setStatus('pending')
        setMessage(
          'Pagamento ainda pendente. Se foi Pix, espere alguns instantes e atualize a pagina.'
        )
      } catch (error) {
        if (!active) return

        setStatus('error')
        setMessage(error.message || 'Nao foi possivel confirmar o pagamento.')
      }
    }

    validatePayment()

    return () => {
      active = false
    }
  }, [clearCart, params])

  const title =
    status === 'success'
      ? 'Pedido confirmado'
      : status === 'pending'
        ? 'Pagamento pendente'
        : status === 'error'
          ? 'Falha ao validar'
          : 'Confirmando pagamento'

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Navbar darkContent />
      <main
        style={{
          padding: '8rem 8% 4rem',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <section
          style={{
            width: '100%',
            maxWidth: '680px',
            padding: '2rem',
            border: '1px solid #eee',
            borderRadius: '8px',
            background: '#fff',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#666',
            }}
          >
            InfinitePay
          </p>
          <h1
            style={{
              margin: '0.75rem 0 1rem',
              fontSize: '2.2rem',
              lineHeight: 1.1,
              color: '#111',
            }}
          >
            {title}
          </h1>
          <p style={{ margin: 0, color: '#555', lineHeight: 1.7 }}>{message}</p>

          <div
            style={{
              marginTop: '2rem',
              display: 'grid',
              gap: '0.75rem',
              color: '#333',
            }}
          >
            {params.orderNsu && <div>Pedido: {params.orderNsu}</div>}
            {params.captureMethod && <div>Pagamento: {params.captureMethod}</div>}
            {details?.paid_amount && (
              <div>
                Valor pago: R$ {(details.paid_amount / 100).toFixed(2).replace('.', ',')}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <Link
              to="/"
              style={{
                padding: '0.95rem 1.2rem',
                borderRadius: '8px',
                background: '#111',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              Voltar para a loja
            </Link>
            {params.receiptUrl && (
              <a
                href={params.receiptUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '0.95rem 1.2rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  color: '#111',
                  textDecoration: 'none',
                  fontWeight: 700,
                }}
              >
                Ver comprovante
              </a>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
