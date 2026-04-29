import React from 'react';
import { motion } from 'framer-motion';

import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { urlFor } from '../lib/sanity';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotal } = useCartStore();
  const apiBaseUrlRaw = (import.meta.env.VITE_API_BASE_URL || '').trim();
  const apiBaseUrl = apiBaseUrlRaw.replace(/\/+$/, '');

  // ✅ PAGAMENTO INFINITEPAY
const handleCheckout = async () => {
  try {
    const url = apiBaseUrl ? `${apiBaseUrl}/api/create-payment` : `/api/create-payment`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: items.map(item => ({
          name: `${item.name} (Tam: ${item.size})`,
          quantity: item.quantity,
          price: Math.round(item.price * 100)
        }))
      })
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`Pagamento falhou (${response.status}). Resposta: ${text.slice(0, 200)}`);
    }

    if (!contentType.includes('application/json')) {
      const text = await response.text().catch(() => '');
      throw new Error(`Backend retornou algo que não é JSON. Resposta: ${text.slice(0, 200)}`);
    }

    const data = await response.json();

    if (!data.checkout_url) {
      console.error(data);
      alert("Erro ao gerar pagamento");
      return;
    }

    window.location.href = data.checkout_url;

  } catch (err) {
    console.error(err);
    alert("Erro ao processar pagamento");
  }
};

  return (
    <>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              zIndex: 1000, backdropFilter: 'blur(4px)',
            }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '100%', maxWidth: '440px', background: '#fff',
              zIndex: 1001, display: 'flex', flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
            }}
          >

            {/* Header */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <ShoppingBag size={24} color="#111" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Seu Carrinho</h3>
              </div>
              <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {items.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Carrinho vazio</p>
              ) : (
                items.map((item) => (
                  <div key={`${item._id}-${item.size}`} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    
                    <img
                      src={urlFor(item.mainImage).width(160).url()}
                      style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                    />

                    <div style={{ flex: 1 }}>
                      <h4>{item.name}</h4>
                      <p>Tam: {item.size}</p>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}>+</button>
                        </div>

                        <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>

                    <button onClick={() => removeItem(item._id, item.size)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '2rem', borderTop: '1px solid #eee' }}>
                <h3>Total: R$ {getTotal().toFixed(2)}</h3>

                <button
                  onClick={handleCheckout}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: '#111',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '30px',
                    marginTop: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  Finalizar Pedido
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </>
  );
}
