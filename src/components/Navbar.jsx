import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export default function Navbar({ darkContent = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const { items, toggleCart } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const bgColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(0,0,0,0)', 'rgba(255,255,255,0.95)']
  );

  const isHome = location.pathname === '/';
  const finalTextColor = isScrolled ? '#111' : (isHome && !darkContent ? '#fff' : '#111');

  return (
    <motion.nav
      className="nav-padding"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isHome ? bgColor : '#fff',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled || !isHome ? '1px solid rgba(0,0,0,0.05)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: finalTextColor, textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1 }}>
            FABAYO
          </h1>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: finalTextColor, letterSpacing: '4px', textTransform: 'uppercase', opacity: 0.7 }}>
            sports
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
        <div className="hide-mobile" style={{ display: 'flex', gap: '2rem' }}>
          <a href="/#camisas" style={{ color: finalTextColor, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Lançamentos</a>
          <a href="/#contato" style={{ color: finalTextColor, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Contato</a>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <button 
            onClick={toggleCart}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', position: 'relative', 
              color: finalTextColor, display: 'flex', alignItems: 'center' 
            }}
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span style={{ 
                position: 'absolute', top: '-5px', right: '-8px', background: '#00db84', 
                color: '#111', fontSize: '0.7rem', fontWeight: 900, padding: '2px 5px', 
                borderRadius: '50px', minWidth: '16px', textAlign: 'center' 
              }}>
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={toggleMenu}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: finalTextColor }}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                zIndex: 2000, backdropFilter: 'blur(4px)',
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '80%', maxWidth: '320px', background: '#fff',
                zIndex: 2001, display: 'flex', flexDirection: 'column',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.05)', padding: '2rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
                <button onClick={toggleMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111' }}>
                  <X size={28} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <a 
                  href="/#camisas" 
                  onClick={toggleMenu}
                  style={{ color: '#111', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                  Lançamentos
                </a>
                <a 
                  href="/#contato" 
                  onClick={toggleMenu}
                  style={{ color: '#111', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                  Contato
                </a>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <div style={{ height: '1px', background: '#eee', marginBottom: '2rem' }} />
                <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: '2px', lineHeight: 1 }}>
                  FABAYO
                </h1>
                <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#111', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.5 }}>
                  sports
                </span>
              </div>
            </motion.div>
          </>
        )}
      </>
    </motion.nav>
  );
}
