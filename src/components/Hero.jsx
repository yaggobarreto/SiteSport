import React, { useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef(null);

  // Subtle parallax on mouse move
  const springConfig = { damping: 40, stiffness: 80 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    springX.set(x);
    springY.set(y);
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  // The background image moves very slightly opposite to the mouse → depth illusion
  const bgX = useTransform(springX, [-1, 1], [-20, 20]);
  const bgY = useTransform(springY, [-1, 1], [-20, 20]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8%',
        overflow: 'hidden',
        // Background matches the dark navy edges of the photo — no color seam visible
        background: 'linear-gradient(135deg, #060a14 0%, #0a0f1e 60%, #08101e 100%)',
      }}
    >
      {/* ── Right: Shirt Image (beside the text) ─────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          right: '-2%', top: '50%', translateY: '-50%',
          width: '58%', height: '100%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1,
          x: bgX, y: bgY,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/assets/hero/camisabr.jpg"
          alt="Camisa Brasil"
          style={{
            width: '90%', height: '90%',
            objectFit: 'contain',
            // lighten blends the dark photo bg into our matching dark section bg
            mixBlendMode: 'lighten',
            filter: 'brightness(0.92) contrast(1.04)',
            display: 'block',
          }}
        />
        {/* Fade left edge of image into section bg for seamless blend */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '45%', height: '100%',
          background: 'linear-gradient(to right, #060a14 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
        {/* Fade top & bottom edges */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 80% at 65% 50%, transparent 40%, #060a14 100%)',
          pointerEvents: 'none',
        }} />
      </motion.div>

      {/* ── Left overlays for text readability ───────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(to right, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0.5) 42%, transparent 60%)',
      }} />

      {/* ── Text Content ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '560px', marginTop: '5vh' }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px', padding: '0.4rem 1.2rem', marginBottom: '1.5rem',
            fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', color: '#00db84',
            textTransform: 'uppercase', backdropFilter: 'blur(10px)',
          }}
        >
          Nova Coleção 2025
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: '5.5rem', fontWeight: 900, lineHeight: 0.9,
            marginBottom: '1.5rem', textTransform: 'uppercase',
            letterSpacing: '-3px', color: '#ffffff',
          }}
        >
          A Energia<br/>do Jogo.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)',
            marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 400, maxWidth: '440px',
          }}
        >
          Manto sagrado com design exclusivo. Tecnologia e identidade em cada detalhe do uniforme oficial.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <button className="btn-hero" style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
            Compre Agora
          </button>
          <button style={{
            background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.35)',
            padding: '1.2rem 2.5rem', fontSize: '1rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1px',
            borderRadius: '50px', cursor: 'pointer', transition: 'all 0.3s ease',
          }}
            onMouseEnter={e => { e.target.style.borderColor = '#fff'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.35)'; e.target.style.background = 'transparent'; }}
          >
            Ver Coleção
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            display: 'flex', gap: '3rem', marginTop: '4rem',
            borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '2rem',
          }}
        >
          {[['12+', 'Modelos'], ['5K+', 'Clientes'], ['100%', 'Oficial']].map(([num, label]) => (
            <div key={label}>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{num}</p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '0.2rem' }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          position: 'absolute', bottom: '2.5rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        }}
      >
        <p style={{ fontSize: '0.75rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Scroll</p>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
      </motion.div>
    </section>
  );
}
