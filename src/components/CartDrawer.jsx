import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { urlFor } from '../lib/sanity';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotal } = useCartStore();

  const handleCheckout = () => {
    // Lead to WhatsApp with order details or direct to payment
    const orderItems = items.map(i => `${i.quantity}x ${i.name} (Tam: ${i.size})`).join('%0A');
    const total = getTotal().toFixed(2);
    const msg = `Olá! Gostaria de finalizar o pedido:%0A%0A${orderItems}%0A%0ATotal: R$ ${total}`;
    window.open(`https://wa.me/5511999999999?text=${msg}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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

          {/* Drawer */}
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
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Seu Carrinho</h3>
              </div>
              <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {items.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', color: '#aaa' }}>
                  <ShoppingBag size={48} opacity={0.2} />
                  <p style={{ fontWeight: 600 }}>Seu carrinho está vazio.</p>
                  <button onClick={toggleCart} style={{ color: '#111', fontWeight: 800, fontSize: '0.9rem', borderBottom: '2px solid #111', background: 'none', border: 'none', cursor: 'pointer' }}>Continuar Comprando</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {items.map((item) => (
                    <div key={`${item._id}-${item.size}`} style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ width: '80px', height: '100px', borderRadius: '8px', overflow: 'hidden', background: '#f8f8f8', flexShrink: 0 }}>
                        {item.mainImage && (
                          <img src={urlFor(item.mainImage).width(160).url()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>{item.name}</h4>
                          <button onClick={() => removeItem(item._id, item.size)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.8rem' }}>Tamanho: <strong>{item.size}</strong></p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: '6px' }}>
                            <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} style={{ padding: '0.4rem', background: 'none', border: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                            <span style={{ width: '30px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} style={{ padding: '0.4rem', background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                          </div>
                          <p style={{ fontWeight: 800, color: '#111' }}>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div style={{ padding: '2rem', borderTop: '1px solid #eee', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <span style={{ color: '#666', fontWeight: 600 }}>Subtotal</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#111' }}>R$ {getTotal().toFixed(2).replace('.', ',')}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  style={{ 
                    width: '100%', padding: '1.2rem', background: '#111', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem'
                  }}
                >
                  Finalizar Pedido <ArrowRight size={18} />
                </button>
                <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#aaa' }}>Frete calculado na finalização</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
