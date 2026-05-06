import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { urlFor } from '../lib/sanity';

// ─── Constante de frete grátis ────────────────────────────────────────────────
const FRETE_GRATIS_ACIMA_DE = 499; // R$

// ─── Helper: formata centavos → "R$ 24,90" ───────────────────────────────────
function formatCents(cents) {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

// ─── Tabela de preços por UF (em centavos) ───────────────────────────────────
// Índices: [1 peça, 2-3 peças, 4+ peças]
const TABELA_FRETE = {
  SP: { pac: [1490, 1790, 2090], sedex: [2290, 2790, 3290] },
  RJ: { pac: [1890, 2190, 2490], sedex: [2890, 3390, 3990] },
  MG: { pac: [1890, 2190, 2490], sedex: [2890, 3390, 3990] },
  ES: { pac: [2090, 2390, 2790], sedex: [3190, 3690, 4290] },
  PR: { pac: [2190, 2490, 2890], sedex: [3290, 3790, 4390] },
  SC: { pac: [2190, 2490, 2890], sedex: [3290, 3790, 4390] },
  RS: { pac: [2390, 2790, 3190], sedex: [3490, 3990, 4590] },
  GO: { pac: [2390, 2790, 3190], sedex: [3590, 4190, 4790] },
  MT: { pac: [2590, 2990, 3490], sedex: [3890, 4490, 5190] },
  MS: { pac: [2390, 2790, 3190], sedex: [3590, 4190, 4790] },
  DF: { pac: [2490, 2890, 3390], sedex: [3690, 4290, 4990] },
  BA: { pac: [2590, 2990, 3490], sedex: [3890, 4490, 5190] },
  SE: { pac: [2590, 2990, 3490], sedex: [3890, 4490, 5190] },
  AL: { pac: [2790, 3190, 3690], sedex: [4090, 4790, 5590] },
  PE: { pac: [2790, 3190, 3690], sedex: [4090, 4790, 5590] },
  PB: { pac: [2790, 3190, 3690], sedex: [4090, 4790, 5590] },
  RN: { pac: [2890, 3290, 3790], sedex: [4190, 4890, 5690] },
  CE: { pac: [2890, 3290, 3790], sedex: [4190, 4890, 5690] },
  PI: { pac: [2990, 3390, 3890], sedex: [4290, 4990, 5790] },
  MA: { pac: [3090, 3490, 3990], sedex: [4390, 5090, 5890] },
  PA: { pac: [3290, 3790, 4390], sedex: [4790, 5490, 6390] },
  AP: { pac: [3490, 3990, 4590], sedex: [4990, 5790, 6690] },
  AM: { pac: [3590, 4090, 4790], sedex: [5190, 5990, 6890] },
  RR: { pac: [3790, 4290, 4990], sedex: [5390, 6190, 7090] },
  RO: { pac: [3390, 3890, 4490], sedex: [4890, 5590, 6490] },
  AC: { pac: [3690, 4190, 4890], sedex: [5290, 6090, 6990] },
  TO: { pac: [3090, 3490, 3990], sedex: [4390, 5090, 5890] },
};

function calcularPrecos(uf, quantidade) {
  const tabela = TABELA_FRETE[uf.toUpperCase()];
  if (!tabela) return null;
  const idx = quantidade <= 1 ? 0 : quantidade <= 3 ? 1 : 2;
  return [
    { id: 'pac',   nome: 'PAC',   preco: tabela.pac[idx],   prazo: '7–12 dias úteis' },
    { id: 'sedex', nome: 'SEDEX', preco: tabela.sedex[idx], prazo: '2–5 dias úteis'  },
  ];
}

// ─── Componente de Calculadora de Frete ──────────────────────────────────────
// Chama ViaCEP diretamente do browser (CORS aberto) — funciona em dev e prod
function CalculadoraFrete({ totalItens }) {
  const { shipping, setShipping, clearShipping } = useCartStore();

  const [cep, setCep] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [resultado, setResultado] = useState(null); // { cidade, uf, modalidades }
  const [erro, setErro] = useState('');

  // Sincroniza estado local com o store: se o frete sumir do store, reseta a UI
  React.useEffect(() => {
    if (!shipping) {
      setResultado(null);
      setStatus('idle');
      setErro('');
    }
  }, [shipping]);

  const freteGratis = totalItens >= FRETE_GRATIS_ACIMA_DE;

  // Máscara de CEP: 00000-000
  const handleCepChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    const masked = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setCep(masked);
    if (resultado) { setResultado(null); clearShipping(); setStatus('idle'); }
  };

  const calcular = async () => {
    const rawCep = cep.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      setErro('Digite um CEP válido com 8 dígitos.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErro('');
    setResultado(null);
    clearShipping();

    try {
      // ViaCEP tem CORS aberto — chama direto do browser, sem precisar de backend
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      if (!res.ok) throw new Error('ViaCEP indisponível');
      const data = await res.json();

      if (data?.erro) {
        setErro('CEP não encontrado. Verifique e tente novamente.');
        setStatus('error');
        return;
      }

      const uf = (data.uf || '').toUpperCase();
      const cidade = data.localidade || '';
      const modalidades = calcularPrecos(uf, Math.max(1, totalItens));

      if (!modalidades) {
        setErro(`Estado "${uf}" não encontrado. Entre em contato conosco.`);
        setStatus('error');
        return;
      }

      setResultado({ cidade, uf, modalidades });
      setStatus('success');
      // Pré-seleciona PAC por padrão
      setShipping(modalidades.find(m => m.id === 'pac') || modalidades[0]);

    } catch {
      setErro('Não foi possível consultar o CEP. Verifique sua conexão.');
      setStatus('error');
    }
  };

  if (freteGratis) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #e8faf2, #d0f5e3)',
        borderRadius: '12px', padding: '1rem 1.2rem',
        display: 'flex', alignItems: 'center', gap: '0.7rem',
        marginBottom: '1.2rem', border: '1px solid #a3e9c8'
      }}>
        <CheckCircle2 size={20} color="#00a86b" />
        <div>
          <p style={{ fontWeight: 800, color: '#00724a', fontSize: '0.9rem' }}>🎉 Frete Grátis!</p>
          <p style={{ color: '#009960', fontSize: '0.78rem' }}>Seu pedido tem frete grátis para todo o Brasil.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '1.2rem' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
        <Truck size={16} color="#555" />
        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Calcular Frete
        </p>
      </div>

      {/* Input + Botão */}
      <div style={{ display: 'flex', gap: '0.6rem' }}>
        <input
          type="text"
          inputMode="numeric"
          placeholder="00000-000"
          value={cep}
          onChange={handleCepChange}
          onKeyDown={(e) => e.key === 'Enter' && calcular()}
          style={{
            flex: 1, padding: '0.75rem 1rem', borderRadius: '10px',
            border: status === 'error' ? '1.5px solid #ff4444' : '1.5px solid #e0e0e0',
            fontSize: '0.95rem', fontWeight: 600, outline: 'none',
            fontFamily: 'inherit', color: '#111',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#111'}
          onBlur={e => e.target.style.borderColor = status === 'error' ? '#ff4444' : '#e0e0e0'}
        />
        <button
          onClick={calcular}
          disabled={status === 'loading'}
          style={{
            padding: '0.75rem 1.2rem', background: '#111', color: '#fff',
            border: 'none', borderRadius: '10px', fontWeight: 700,
            fontSize: '0.85rem', cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            opacity: status === 'loading' ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {status === 'loading'
            ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            : 'OK'
          }
        </button>
      </div>

      {/* Mensagem de erro */}
      {status === 'error' && (
        <p style={{ color: '#ff4444', fontSize: '0.78rem', marginTop: '0.5rem', fontWeight: 600 }}>{erro}</p>
      )}

      {/* Resultado com opções */}
      <AnimatePresence>
        {status === 'success' && resultado && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ marginTop: '0.8rem' }}
          >
            <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.6rem' }}>
              📍 {resultado.cidade}/{resultado.uf}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {resultado.modalidades.map((m) => {
                const selected = shipping?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setShipping(m)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.7rem 1rem', borderRadius: '10px', cursor: 'pointer',
                      border: selected ? '2px solid #111' : '1.5px solid #e0e0e0',
                      background: selected ? '#111' : '#fff',
                      color: selected ? '#fff' : '#111',
                      fontFamily: 'inherit', transition: 'all 0.18s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: '16px', height: '16px', borderRadius: '50%',
                        border: selected ? '2px solid #fff' : '2px solid #bbb',
                        background: selected ? '#fff' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {selected && <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#111' }} />}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontWeight: 800, fontSize: '0.88rem' }}>{m.nome}</p>
                        <p style={{ fontSize: '0.72rem', opacity: 0.7 }}>{m.prazo}</p>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                      {formatCents(m.preco)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Componente Principal do Carrinho ─────────────────────────────────────────
export default function CartDrawer() {
  const {
    items, isOpen, toggleCart,
    updateQuantity, removeItem,
    getSubtotal, shipping,
  } = useCartStore();

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
  const subtotal = getSubtotal();
  const freteGratis = subtotal >= FRETE_GRATIS_ACIMA_DE;
  const shippingCost = freteGratis ? 0 : (shipping?.preco ?? null);
  const total = shippingCost !== null ? subtotal + shippingCost / 100 : subtotal;

  // Quantidade total de peças (para o cálculo do frete)
  const totalPecas = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const handle = import.meta.env.VITE_INFINITEPAY_HANDLE || 'fabayosports'; 

      const itemsFormatted = items.map(item => ({
        description: `${item.name} (Tam: ${item.size})`,
        quantity: item.quantity,
        price: Math.round(item.price * 100),
      }));

      if (!freteGratis && shipping) {
        itemsFormatted.push({
          description: `Frete ${shipping.nome} (${shipping.prazo})`,
          quantity: 1,
          price: shipping.preco,
        });
      }

      const payload = {
        handle: handle,
        order_nsu: crypto.randomUUID(),
        items: itemsFormatted,
        itens: itemsFormatted,
        redirect_url: window.location.origin + '/pagamento-concluido'
      };

      // Tenta usar um proxy de CORS para desenvolvimento local
      // Isso evita o erro de "Verifique sua conexão" no navegador
      const corsProxy = 'https://corsproxy.io/?';
      const apiUrl = 'https://api.checkout.infinitepay.io/links';

      const response = await fetch(corsProxy + encodeURIComponent(apiUrl), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Erro API:', errText);
        throw new Error('Falha na comunicação com InfinitePay');
      }

      const data = await response.json();
      const checkoutUrl = data.url || data.checkout_url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('URL não encontrada');
      }

    } catch (err) {
      console.error('Erro no Checkout:', err);
      alert('Não foi possível gerar o link de pagamento. Isso geralmente acontece em ambiente de teste (CORS). Tente novamente ou verifique se o handle está correto.');
    }
  };

  const canCheckout = items.length > 0 && (freteGratis || shipping !== null);

  return (
    <>
      {/* Injeção de CSS para animação do spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={toggleCart}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                zIndex: 1000, backdropFilter: 'blur(4px)',
              }}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '100%', maxWidth: '440px', background: '#fff',
                zIndex: 1001, display: 'flex', flexDirection: 'column',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.12)',
              }}
            >
              {/* ── Header ── */}
              <div style={{
                padding: '1.5rem 2rem', borderBottom: '1px solid #eee',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <ShoppingBag size={22} color="#111" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Seu Carrinho</h3>
                  {items.length > 0 && (
                    <span style={{
                      background: '#111', color: '#fff', borderRadius: '50%',
                      width: '22px', height: '22px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 800,
                    }}>{totalPecas}</span>
                  )}
                </div>
                <button onClick={toggleCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}>
                  <X size={22} />
                </button>
              </div>

              {/* ── Items ── */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                {items.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#aaa', marginTop: '4rem' }}>
                    <ShoppingBag size={52} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 600 }}>Seu carrinho está vazio.</p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>Adicione um produto para começar!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {items.map((item) => (
                      <div key={`${item._id}-${item.size}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Imagem */}
                        <div style={{
                          width: '80px', height: '100px', borderRadius: '10px',
                          overflow: 'hidden', background: '#f5f5f5', flexShrink: 0,
                        }}>
                          <img
                            src={urlFor(item.mainImage).width(160).url()}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            alt={item.name}
                          />
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111', lineHeight: 1.2 }}>{item.name}</h4>
                              <p style={{ fontSize: '0.78rem', color: '#888', fontWeight: 600, marginTop: '0.2rem' }}>
                                Tamanho: <span style={{ color: '#333' }}>{item.size}</span>
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item._id, item.size)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', transition: 'color 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.color = '#ff4444'}
                              onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Qty + Preço */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '0.8rem',
                              background: '#f5f5f5', padding: '0.3rem 0.7rem', borderRadius: '50px',
                            }}>
                              <button onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center' }}>
                                <Minus size={13} />
                              </button>
                              <span style={{ fontWeight: 700, fontSize: '0.88rem', minWidth: '14px', textAlign: 'center' }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center' }}>
                                <Plus size={13} />
                              </button>
                            </div>
                            <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111' }}>
                              R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Footer: frete + total + checkout ── */}
              {items.length > 0 && (
                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #eee' }}>

                  {/* Calculadora de frete */}
                  <CalculadoraFrete totalItens={totalPecas} />

                  {/* Divisor */}
                  <div style={{ borderTop: '1px dashed #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
                    {/* Subtotal */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#888', fontSize: '0.88rem' }}>Subtotal</span>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        R$ {subtotal.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    {/* Frete */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <span style={{ color: '#888', fontSize: '0.88rem' }}>
                        Frete {shipping && !freteGratis ? `(${shipping.nome})` : ''}
                      </span>
                      <span style={{
                        fontWeight: 700, fontSize: '0.88rem',
                        color: freteGratis ? '#00a86b' : (shipping ? '#111' : '#bbb'),
                      }}>
                        {freteGratis
                          ? 'GRÁTIS'
                          : shipping
                            ? formatCents(shipping.preco)
                            : '—'
                        }
                      </span>
                    </div>

                    {/* Total */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem' }}>Total</span>
                      <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#111' }}>
                        {(freteGratis || shipping)
                          ? `R$ ${total.toFixed(2).replace('.', ',')}`
                          : '—'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Aviso se frete não selecionado */}
                  {!freteGratis && !shipping && (
                    <p style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 600, textAlign: 'center', marginBottom: '0.8rem' }}>
                      ⚠️ Calcule o frete para continuar
                    </p>
                  )}

                  {/* Botão de checkout */}
                  <button
                    onClick={handleCheckout}
                    disabled={!canCheckout}
                    style={{
                      width: '100%', padding: '1rem 1.5rem',
                      background: canCheckout ? '#111' : '#ddd',
                      color: canCheckout ? '#fff' : '#aaa',
                      border: 'none', borderRadius: '50px',
                      fontSize: '0.95rem', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '1.5px',
                      cursor: canCheckout ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    Finalizar Pedido
                  </button>

                  {/* Botão de WhatsApp para Cálculo de Envio */}
                  <button
                    onClick={() => {
                      const number = import.meta.env.VITE_WHATSAPP_NUMBER || '5511932277941';
                      const itemsList = items.map(i => `- ${i.name} (${i.size}) x${i.quantity}`).join('%0A');
                      const message = `Olá! Gostaria de *CALCULAR O ENVIO* para os seguintes itens:%0A%0A${itemsList}%0A%0ATotal dos produtos: R$ ${subtotal.toFixed(2).replace('.', ',')}%0A%0APoderia me ajudar com o frete?`;
                      window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${message}`, '_blank');
                    }}
                    style={{
                      width: '100%', padding: '0.9rem 1.5rem',
                      background: 'transparent',
                      color: '#25D366',
                      border: '2px solid #25D366',
                      borderRadius: '50px',
                      fontSize: '0.85rem', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '1px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                      marginTop: '0.8rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#25D366'; }}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Calcular via WhatsApp
                  </button>

                  {/* Progresso para frete grátis */}
                  {!freteGratis && (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#aaa' }}>Frete grátis acima de R$ {FRETE_GRATIS_ACIMA_DE},00</span>
                        <span style={{ fontSize: '0.72rem', color: '#aaa' }}>
                          Falta R$ {Math.max(0, FRETE_GRATIS_ACIMA_DE - subtotal).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div style={{ background: '#f0f0f0', borderRadius: '50px', height: '4px', overflow: 'hidden' }}>
                        <div style={{
                          background: 'linear-gradient(90deg, #00db84, #00a86b)',
                          height: '100%', borderRadius: '50px',
                          width: `${Math.min(100, (subtotal / FRETE_GRATIS_ACIMA_DE) * 100)}%`,
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
