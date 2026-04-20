import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { client, urlFor } from '../lib/sanity';
import { useCartStore } from '../store/useCartStore';

// Fallback products in case Sanity has no data yet
const FALLBACK = [
  { _id: '1', name: 'Camisa Brasil - Home',  price: 349.90, badge: 'Novo',  mainImage: null, slug: { current: 'brasil-home' } },
  { _id: '2', name: 'Camisa Brasil - Away',  price: 349.90, badge: null,    mainImage: null, slug: { current: 'brasil-away' } },
];

const QUERY = `*[_type == "product" && inStock == true] | order(order asc) {
  _id, name, price, originalPrice, badge, mainImage, sizes, category, checkoutUrl, slug
}`

export default function Products() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    client.fetch(QUERY)
      .then((data) => {
        setProdutos(data.length > 0 ? data : FALLBACK);
        setLoading(false);
      })
      .catch(() => {
        setProdutos(FALLBACK);
        setLoading(false);
      });
  }, []);

  const handleBuyClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes?.[0] || 'M');
  };

  return (
    <section id="camisas" className="section-padding" style={{ background: '#fafafa' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.5rem' }}
          >
            Lançamentos
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1px', color: '#111', lineHeight: 1 }}
          >
            A Coleção
          </motion.h3>
        </div>
        <Link
          to="/" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '2px solid #111', paddingBottom: '2px' }}
        >
          Ver Tudo →
        </Link>
      </div>

      {loading ? (
        <div className="responsive-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/5', background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div className="responsive-grid">
          {produtos.map((p, index) => (
            <Link 
              key={p._id} 
              to={`/produto/${p.slug?.current || 'brasil-home'}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
              >
                <div style={{
                  backgroundColor: '#f8f8f8', borderRadius: '16px', overflow: 'hidden',
                  position: 'relative', aspectRatio: '4/5',
                }}>
                  {p.badge && (
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2, background: '#111', color: '#fff', padding: '0.3rem 0.9rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                      {p.badge}
                    </div>
                  )}
                  {p.mainImage && p.mainImage.asset ? (
                    <motion.img
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      src={urlFor(p.mainImage).width(900).auto('format').url()}
                      alt={p.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e8e8', color: '#bbb', fontSize: '3rem' }}>
                      👕
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}
                  >
                    <button 
                      onClick={(e) => handleBuyClick(e, p)}
                      style={{
                        width: '100%', padding: '0.9rem', background: '#111', color: '#fff',
                        border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.9rem',
                        cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
                      }}
                    >
                      Adicionar ao Carrinho
                    </button>
                  </motion.div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>{p.name}</h4>
                    <p style={{ color: '#aaa', marginTop: '0.2rem', fontSize: '0.85rem' }}>Uniforme Oficial</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {p.originalPrice && (
                      <p style={{ fontSize: '0.8rem', color: '#bbb', textDecoration: 'line-through' }}>
                        R$ {p.originalPrice.toFixed(2).replace('.', ',')}
                      </p>
                    )}
                    <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#111' }}>
                      R$ {p.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
