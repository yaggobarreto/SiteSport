import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { client, urlFor } from '../lib/sanity';
import { useCartStore } from '../store/useCartStore';
import { ChevronLeft, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id, name, price, originalPrice, badge, mainImage, images, description, sizes, category
}`

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    client.fetch(QUERY, { slug }).then((data) => {
      setProduct(data);
      if (data?.mainImage) setActiveImage(data.mainImage);
      if (data?.sizes?.length > 0) setSelectedSize(data.sizes[0]);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>Carregando...</div>;
  if (!product) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>Produto não encontrado.</div>;

  const allImages = [product.mainImage, ...(product.images || [])].filter(Boolean);

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Navbar darkContent />

      <main style={{ padding: '8rem 8% 4rem', maxWidth: '1400px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <ChevronLeft size={16} /> Voltar para Coleção
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '4rem' }}>
          
          {/* Gallery Section */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  style={{ 
                    width: '70px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: activeImage === img ? '2px solid #111' : '1px solid #eee', cursor: 'pointer', padding: 0, background: 'none'
                  }}
                >
                  <img src={urlFor(img).width(120).url()} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
            <div style={{ flex: 1, background: '#f8f8f8', borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage?.asset?._ref}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={urlFor(activeImage).width(1000).url()} 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Info Section */}
          <div style={{ paddingTop: '1rem' }}>
            {product.badge && (
              <span style={{ background: '#f5f5f5', color: '#111', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {product.badge}
              </span>
            )}
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-2px', color: '#111', margin: '1rem 0 0.5rem' }}>
              {product.name}
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>Uniforme Oficial 2025</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2.5rem' }}>
               <span style={{ fontSize: '2rem', fontWeight: 900, color: '#111' }}>
                 R$ {product.price.toFixed(2).replace('.', ',')}
               </span>
               {product.originalPrice && (
                 <span style={{ fontSize: '1.1rem', color: '#bbb', textDecoration: 'line-through' }}>
                   R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                 </span>
               )}
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Selecione o Tamanho</p>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                {(product.sizes || ['P', 'M', 'G', 'GG']).map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{ 
                      minWidth: '54px', height: '54px', borderRadius: '8px', border: selectedSize === size ? '2px solid #111' : '1px solid #ddd', background: selectedSize === size ? '#111' : '#fff', color: selectedSize === size ? '#fff' : '#111', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => addItem(product, selectedSize)}
              style={{ 
                width: '100%', padding: '1.5rem', background: '#111', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '3rem'
              }}
            >
              <ShoppingBag size={20} /> Adicionar ao Carrinho
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid #eee', paddingTop: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <ShieldCheck style={{ color: '#00db84' }} size={24} />
                 <div>
                   <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Compra Segura</p>
                   <p style={{ color: '#888', fontSize: '0.8rem' }}>Pagamento processado por InfinityPay</p>
                 </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <Truck style={{ color: '#00db84' }} size={24} />
                 <div>
                   <p style={{ fontWeight: 700, fontSize: '0.85rem' }}>Frete Grátis</p>
                   <p style={{ color: '#888', fontSize: '0.8rem' }}>Nas compras acima de R$ 499</p>
                 </div>
              </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
               <h4 style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Descrição</h4>
               <p style={{ color: '#666', lineHeight: 1.8, fontSize: '1rem' }}>
                 {product.description || "Inspirada no modelo oficial de jogo, esta camisa oferece tecnologia de ponta e conforto incomparável para quem vive a energia do futebol."}
               </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
