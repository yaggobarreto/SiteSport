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

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

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
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 8%', background: isHome ? bgColor : '#fff',
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
        <div style={{ display: 'flex', gap: '2rem' }}>
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
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: finalTextColor }}>
            <Menu size={24} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
