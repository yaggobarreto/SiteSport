import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentResult() {
  const [params] = useSearchParams()

  const receiptUrl = params.get('receipt_url')
  const orderNsu = params.get('order_nsu')

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Navbar darkContent />

      <main
        className="section-padding"
        style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '4rem' }}
      >
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#111' }}>
          Pagamento iniciado
        </h1>
        <p style={{ color: '#666', marginTop: '0.75rem', lineHeight: 1.6 }}>
          Se você concluiu o pagamento, aguarde a confirmação. Você pode voltar
          para a loja a qualquer momento.
        </p>

        {(orderNsu || receiptUrl) && (
          <div
            style={{
              marginTop: '2rem',
              padding: '1.25rem',
              border: '1px solid #eee',
              borderRadius: '16px',
              background: '#fafafa',
            }}
          >
            {orderNsu && (
              <p style={{ margin: 0, color: '#111', fontWeight: 700 }}>
                Pedido: <span style={{ fontWeight: 500 }}>{orderNsu}</span>
              </p>
            )}
            {receiptUrl && (
              <p style={{ margin: orderNsu ? '0.75rem 0 0' : 0 }}>
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#111', fontWeight: 800 }}
                >
                  Ver comprovante
                </a>
              </p>
            )}
          </div>
        )}

        <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
          <Link
            to="/"
            style={{
              padding: '0.9rem 1.25rem',
              borderRadius: '999px',
              background: '#111',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 800,
            }}
          >
            Voltar para a loja
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

