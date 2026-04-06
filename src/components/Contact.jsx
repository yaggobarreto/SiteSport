import React from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <section id="contato" style={{ padding: '8rem 8%', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', color: '#00db84', textTransform: 'uppercase', marginBottom: '1rem' }}>Atendimento</p>
          <h3 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, color: '#111', letterSpacing: '-2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Fale<br/>Conosco
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#777', lineHeight: 1.7, marginBottom: '3rem' }}>
            Tem dúvidas sobre tamanhos, personalização ou pedidos? Nossa equipe responde rapidinho. Atendimento de segunda a sábado, das 9h às 18h.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { label: 'WhatsApp', value: '(11) 99999-9999', icon: '📱' },
              { label: 'E-mail', value: 'contato@fabayosports.com', icon: '✉️' },
              { label: 'Instagram', value: '@fabayosports', icon: '📸' },
            ].map(item => (
              <motion.div key={item.label} whileHover={{ x: 5 }} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '1.2rem 1.5rem', background: '#f5f5f5', borderRadius: '12px', cursor: 'pointer' }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#aaa', letterSpacing: '1px', textTransform: 'uppercase' }}>{item.label}</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: '#111' }}>{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Message Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }}
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {['Nome', 'Sobrenome'].map(p => (
                <div key={p}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#777', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{p}</label>
                  <input style={{ width: '100%', padding: '0.9rem 1rem', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '1rem', outline: 'none', fontFamily: 'Montserrat, sans-serif', background: '#f9f9f9', color: '#111' }} />
                </div>
              ))}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#777', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>E-mail</label>
              <input type="email" style={{ width: '100%', padding: '0.9rem 1rem', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '1rem', outline: 'none', fontFamily: 'Montserrat, sans-serif', background: '#f9f9f9', color: '#111' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#777', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Mensagem</label>
              <textarea rows={5} style={{ width: '100%', padding: '0.9rem 1rem', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '1rem', outline: 'none', resize: 'none', fontFamily: 'Montserrat, sans-serif', background: '#f9f9f9', color: '#111' }} />
            </div>
            <motion.button
              type="submit" className="btn-primary" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ marginTop: '0.5rem' }}
            >
              Enviar Mensagem
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
