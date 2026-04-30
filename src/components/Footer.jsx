import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <footer style={{ background: '#111', color: '#fff', padding: isMobile ? '4rem 5% 2rem' : '5rem 8% 3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? '2.5rem' : '4rem', marginBottom: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-1px', textTransform: 'uppercase', marginBottom: '1rem' }}>
            FABAYO<br/><span style={{ fontSize: '0.9rem', fontWeight: 400, letterSpacing: '0.5rem', color: '#888' }}>sports</span>
          </h2>
          <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '260px' }}>
            Uniformes oficiais com qualidade premium para quem vive o futebol com paixão.
          </p>
        </div>
        {[
          { title: 'Loja', links: ['Camisas', 'Shorts', 'Conjuntos', 'Acessórios'] },
          { title: 'Empresa', links: ['Sobre Nós', 'Contato', 'Parceiros', 'Blog'] },
          { title: 'Suporte', links: ['Trocas', 'Rastreamento', 'Tamanhos', 'FAQ'] },
        ].map(col => (
          <div key={col.title}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '1.5rem' }}>{col.title}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {col.links.map(l => (
                <a key={l} href="#" style={{ color: '#888', textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = '#888'}
                >{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #222', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: '#444', fontSize: '0.85rem' }}>© 2025 FABAYO Sports. Todos os direitos reservados.</p>
        <p style={{ color: '#444', fontSize: '0.85rem' }}>CNPJ: 00.000.000/0001-00</p>
      </div>
    </footer>
  );
}
