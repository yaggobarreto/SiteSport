import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Feature() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0.05, 0.2], [60, 0]);

  return (
    <motion.section 
      style={{ opacity, y }}
      id="lancamentos"
      className="section-light"
      sx={{ padding: '8rem 5%' }}
    >
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem',
        alignItems: 'center', padding: '8rem 8%', background: '#f5f5f5'
      }}>
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '1/1', background: '#e8e8e8' }}
        >
          <img 
            src="/assets/hero/camisabr.jpg" alt="Camisa em destaque" 
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2rem' }}
          />
          {/* Badge */}
          <div style={{
            position: 'absolute', top: '1.5rem', left: '1.5rem',
            background: '#050814', color: '#fff', padding: '0.5rem 1.2rem',
            borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'
          }}>
            Novo
          </div>
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: 60 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', color: '#00db84', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Destaque da Temporada
          </p>
          <h3 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px', marginBottom: '1.5rem', color: '#111', textTransform: 'uppercase' }}>
            Camisa<br/>Brasil 2025
          </h3>
          <p style={{ fontSize: '1.15rem', color: '#666', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            A nova camisa dark da seleção brasileira. Desenvolvida com tecnologia Dri-FIT ADV para performance máxima em campo e estilo inegável fora dele. Tecido respirável, corte slim e acabamento premium.
          </p>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Preço</p>
              <p style={{ fontSize: '2rem', fontWeight: 900, color: '#111' }}>R$ 349,90</p>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#e0e0e0' }} />
            <div>
              <p style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Prazo</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>7–10 dias</p>
            </div>
          </div>
          {/* Size selector */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', color: '#999', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Tamanho</p>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              {['PP', 'P', 'M', 'G', 'GG'].map(s => (
                <button key={s} style={{
                  width: '44px', height: '44px', borderRadius: '8px',
                  border: s === 'M' ? '2px solid #111' : '1px solid #e0e0e0',
                  background: s === 'M' ? '#111' : '#fff',
                  color: s === 'M' ? '#fff' : '#333',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <button className="btn-primary" style={{ padding: '1.2rem 4rem' }}>
            Adicionar ao Carrinho
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
