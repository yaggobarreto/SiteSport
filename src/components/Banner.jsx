import React from 'react';
import { motion } from 'framer-motion';

export default function Banner() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #050814 0%, #0d1a35 50%, #050814 100%)',
      padding: '7rem 8%',
    }}>
      {/* Decorative blur circles */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,219,132,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-30%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(30,80,180,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '3rem' }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', color: '#00db84', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Oferta Especial
          </p>
          <h3 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, color: '#fff', letterSpacing: '-2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Coleção<br/>Completa
          </h3>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '400px', lineHeight: 1.6 }}>
            Garanta o conjunto completo: camisa, shorts e meias do uniforme oficial. Frete grátis acima de R$ 500.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1.5rem' }}
        >
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>De R$ 750,00</p>
            <p style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>R$ 599,90</p>
          </div>
          <button className="btn-hero" style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.4)' }}>
            Ver Conjunto
          </button>
        </motion.div>
      </div>
    </section>
  );
}
