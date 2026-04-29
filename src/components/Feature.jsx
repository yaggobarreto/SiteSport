import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { client, urlFor } from '../lib/sanity';

const FALLBACK_PRODUCT = {
  name: 'Camisa Brasil 2025',
  price: 349.90,
  badge: 'Novo',
  description: 'A nova camisa dark da seleção brasileira. Desenvolvida com tecnologia Dri-FIT ADV para performance máxima em campo e estilo inegável fora dele. Tecido respirável, corte slim e acabamento premium.',
  sizes: ['PP', 'P', 'M', 'G', 'GG'],
  mainImage: null
};

export default function Feature() {
  const [product, setProduct] = useState(FALLBACK_PRODUCT);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0.05, 0.2], [60, 0]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const fetchFeature = async () => {
      try {
        const sectionData = await client.fetch(`*[_type == "featuredSection"][0]{ tagline, customDescription, product-> }`);
        if (sectionData && sectionData.product) {
          setProduct({
            ...sectionData.product,
            tagline: sectionData.tagline,
            description: sectionData.customDescription || sectionData.product.description
          });
          setLoading(false);
          return;
        }
        
        const fallbackData = await client.fetch(`*[_type == "product" && featured == true][0]`);
        if (fallbackData) setProduct(fallbackData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeature();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <motion.section 
      style={{ opacity, y }}
      id="lancamentos"
      className="section-light"
      sx={{ padding: isMobile ? '4rem 5%' : '8rem 5%' }}
    >
      <div style={{
        display: isMobile ? 'flex' : 'grid',
        flexDirection: isMobile ? 'column' : 'row',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
        gap: isMobile ? '3rem' : '6rem',
        alignItems: 'center', 
        padding: isMobile ? '4rem 5%' : '8rem 8%', 
        background: '#f5f5f5'
      }}>
        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : -60, y: isMobile ? 30 : 0 }} 
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ 
            position: 'relative', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            aspectRatio: '1/1', 
            background: '#e8e8e8',
            width: '100%'
          }}
        >
          {product.mainImage ? (
            <img 
              src={urlFor(product.mainImage).width(800).url()} alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: isMobile ? '1rem' : '2rem' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
              👕
            </div>
          )}
          {/* Badge */}
          {product.badge && (
            <div style={{
              position: 'absolute', top: '1.5rem', left: '1.5rem',
              background: '#050814', color: '#fff', padding: '0.5rem 1.2rem',
              borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'
            }}>
              {product.badge}
            </div>
          )}
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : 60, y: isMobile ? 30 : 0 }} 
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: isMobile ? 'center' : 'left' }}
        >
          <p style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', color: '#00db84', textTransform: 'uppercase', marginBottom: '1rem' }}>
            {product.tagline || 'Destaque da Temporada'}
          </p>
          <h3 style={{ 
            fontSize: isMobile ? '2.5rem' : '3.5rem', 
            fontWeight: 900, 
            lineHeight: 1, 
            letterSpacing: '-2px', 
            marginBottom: '1.5rem', 
            color: '#111', 
            textTransform: 'uppercase' 
          }}>
            {product.name.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word} {i === 0 && !isMobile && <br/>}
              </React.Fragment>
            ))}
          </h3>
          <p style={{ fontSize: isMobile ? '1rem' : '1.15rem', color: '#666', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            {product.description || 'Produto exclusivo da nova coleção.'}
          </p>
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '1rem' : '2rem', 
            alignItems: 'center', 
            justifyContent: isMobile ? 'center' : 'flex-start',
            marginBottom: '2.5rem' 
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Preço</p>
              <p style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 900, color: '#111' }}>
                R$ {product.price?.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div style={{ width: '1px', height: '40px', background: '#e0e0e0' }} />
            <div>
              <p style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Prazo</p>
              <p style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', fontWeight: 700, color: '#111' }}>7–10 dias</p>
            </div>
          </div>
          {/* Size selector */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', color: '#999', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Tamanho</p>
            <div style={{ display: 'flex', gap: '0.7rem', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {(product.sizes || ['P', 'M', 'G']).map(s => (
                <button key={s} style={{
                  width: isMobile ? '40px' : '44px', 
                  height: isMobile ? '40px' : '44px', 
                  borderRadius: '8px',
                  border: s === 'M' ? '2px solid #111' : '1px solid #e0e0e0',
                  background: s === 'M' ? '#111' : '#fff',
                  color: s === 'M' ? '#fff' : '#333',
                  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
                }}>{s}</button>
              ))}
            </div>
          </div>
          <button className="btn-primary" style={{ padding: '1.2rem 4rem', width: isMobile ? '100%' : 'auto' }}>
            Adicionar ao Carrinho
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
