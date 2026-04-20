import React from 'react';
import { motion } from 'framer-motion';

const VALORES = [
  { icon: '🏆', titulo: 'Qualidade Oficial', desc: 'Produtos certificados com os mesmos materiais dos uniformes profissionais.' },
  { icon: '🚚', titulo: 'Entrega Rápida', desc: 'Enviamos para todo o Brasil em até 10 dias úteis com rastreamento em tempo real.' },
  { icon: '🔒', titulo: 'Compra Segura', desc: 'Pagamento 100% protegido. Aceitamos Pix, cartão e boleto com parcelas.' },
  { icon: '↩️', titulo: 'Troca Fácil', desc: 'Não ficou bom? Troca grátis em 30 dias. Sem burocracia, sem custo.' },
];

export default function Values() {
  return (
    <section className="section-padding" style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}>
      <motion.p
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', color: '#aaa', textTransform: 'uppercase', marginBottom: '4rem' }}
      >
        Por que escolher a FABAYO
      </motion.p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
        {VALORES.map((v, i) => (
          <motion.div
            key={v.titulo}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{v.icon}</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.7rem', color: '#111', letterSpacing: '-0.5px' }}>{v.titulo}</h4>
            <p style={{ fontSize: '0.95rem', color: '#888', lineHeight: 1.6 }}>{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
