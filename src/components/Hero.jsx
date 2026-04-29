import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { client } from '../lib/sanity';

const FALLBACK_HERO = {
  badge: 'Nova Coleção 2025',
  headline: 'A Energia do Jogo.',
  subtext: 'Manto sagrado com design exclusivo. Tecnologia e identidade em cada detalhe do uniforme oficial.',
  ctaLabel: 'Compre Agora',
  ctaSecondaryLabel: 'Ver Coleção'
};

export default function Hero() {
  const containerRef = useRef(null);
  const [heroData, setHeroData] = useState(FALLBACK_HERO);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    client.fetch(`*[_type == "hero"][0]`)
      .then((data) => {
        if (data) setHeroData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Subtle parallax on mouse move
  const springConfig = { damping: 40, stiffness: 80 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const x = (e.clientX / window.innerWidth  - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    springX.set(x);
    springY.set(y);
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  const bgX = useTransform(springX, [-1, 1], [-20, 20]);
  const bgY = useTransform(springY, [-1, 1], [-20, 20]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        minHeight: isMobile ? 'auto' : '100vh',
        height: isMobile ? 'auto' : '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        padding: isMobile ? '8rem 5% 4rem' : '0 8%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #060a14 0%, #0a0f1e 60%, #08101e 100%)',
      }}
    >
      {/* ── Background Image (behind text on mobile, beside on desktop) ── */}
      <motion.div
        style={{
          position: isMobile ? 'absolute' : 'absolute',
          right: isMobile ? '-10%' : '-2%', 
          top: isMobile ? '20%' : '50%', 
          translateY: isMobile ? '0' : '-50%',
          width: isMobile ? '100%' : '58%', 
          height: isMobile ? '60%' : '100%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1,
          x: bgX, y: bgY,
          pointerEvents: 'none',
          opacity: isMobile ? 0.4 : 1,
        }}
      >
        <img
          src="/assets/hero/camisabr.jpg"
          alt="Camisa Brasil"
          style={{
            width: '90%', height: '90%',
            objectFit: 'contain',
            mixBlendMode: 'lighten',
            filter: 'brightness(0.92) contrast(1.04)',
            display: 'block',
          }}
        />
        {/* Fades */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: isMobile ? '100%' : '45%', height: '100%',
          background: isMobile ? 'radial-gradient(circle, transparent 20%, #060a14 100%)' : 'linear-gradient(to right, #060a14 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />
      </motion.div>

      {/* ── Overlay for readability ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: isMobile 
          ? 'linear-gradient(to bottom, rgba(6,10,20,0.4) 0%, rgba(6,10,20,0.9) 70%)'
          : 'linear-gradient(to right, rgba(6,10,20,0.85) 0%, rgba(6,10,20,0.5) 42%, transparent 60%)',
      }} />

      {/* ── Text Content ── */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        maxWidth: isMobile ? '100%' : '650px', 
        marginTop: isMobile ? '0' : '5vh',
        textAlign: isMobile ? 'center' : 'left'
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px', padding: '0.4rem 1.2rem', marginBottom: '1.5rem',
            fontSize: isMobile ? '0.7rem' : '0.8rem', fontWeight: 700, letterSpacing: '2px', color: '#00db84',
            textTransform: 'uppercase', backdropFilter: 'blur(10px)',
          }}
        >
          {heroData.badge}
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: isMobile ? '3.5rem' : 'min(5.5rem, 12vw)', fontWeight: 900, lineHeight: 0.9,
            marginBottom: '1.5rem', textTransform: 'uppercase',
            letterSpacing: isMobile ? '-1px' : '-3px', color: '#ffffff',
          }}
        >
          {heroData.headline.split('<br/>').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < heroData.headline.split('<br/>').length - 1 && <br />}
            </React.Fragment>
          ))}
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: isMobile ? '1rem' : '1.15rem', color: 'rgba(255,255,255,0.85)',
            marginBottom: '2.5rem', lineHeight: 1.6, fontWeight: 400, 
            maxWidth: isMobile ? '100%' : '440px',
            marginInline: isMobile ? 'auto' : '0'
          }}
        >
          {heroData.subtext}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            gap: '1rem', 
            alignItems: 'center' 
          }}
        >
          <button className="btn-hero" style={{ boxShadow: '0 8px 25px rgba(0,0,0,0.5)', width: isMobile ? '100%' : 'auto' }}>
            {heroData.ctaLabel}
          </button>
          <button style={{
            background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.35)',
            padding: '1.2rem 2.5rem', fontSize: '1rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1px',
            borderRadius: '50px', cursor: 'pointer', transition: 'all 0.3s ease',
            width: isMobile ? '100%' : 'auto'
          }}
            onMouseEnter={e => { e.target.style.borderColor = '#fff'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.35)'; e.target.style.background = 'transparent'; }}
          >
            {heroData.ctaSecondaryLabel}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{
            display: 'flex', 
            justifyContent: isMobile ? 'center' : 'flex-start',
            gap: isMobile ? '1.5rem' : '3rem', 
            marginTop: '4rem',
            borderTop: '1px solid rgba(255,255,255,0.15)', 
            paddingTop: '2rem',
          }}
        >
          {[['12+', 'Modelos'], ['5K+', 'Clientes'], ['100%', 'Oficial']].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{num}</p>
              <p style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '0.2rem' }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      {!isMobile && (
        <motion.div
          className="scroll-indicator"
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
      )}
    </section>
  );
}
