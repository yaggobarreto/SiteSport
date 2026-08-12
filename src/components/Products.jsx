import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { client, urlFor } from '../lib/sanity';
import { useCartStore } from '../store/useCartStore';
import { Search } from 'lucide-react';

// Fallback products in case Sanity has no data yet
const FALLBACK = [
  {
    _id: '1',
    name: 'Camisa Brasil Retrô 1994',
    price: 329.90,
    originalPrice: 399.90,
    badge: 'Retrô',
    mainImage: null,
    slug: { current: 'brasil-1994' },
    sizes: ['P', 'M', 'G', 'GG'],
    year: 1994,
    sport: 'Futebol',
    team: 'Seleção Brasileira',
    categories: ['Camisas Retrô', 'Futebol', 'Seleções'],
    collectionName: 'Camisas Históricas',
    player: 'Romário',
    brand: 'Umbro',
    inStock: true
  },
  {
    _id: '2',
    name: 'Camisa Los Angeles Lakers 2001',
    price: 349.90,
    badge: 'Edição Especial',
    mainImage: null,
    slug: { current: 'lakers-2001' },
    sizes: ['M', 'G', 'GG'],
    year: 2001,
    sport: 'Basquete',
    team: 'Lakers',
    categories: ['Basquete', 'Camisas Retrô', 'Edições Especiais', 'Times'],
    collectionName: 'Vintage NBA',
    player: 'Kobe Bryant',
    brand: 'Nike',
    inStock: true
  },
  {
    _id: '3',
    name: 'Camisa Barcelona Retrô 2009',
    price: 299.90,
    originalPrice: 349.90,
    badge: 'Especial',
    mainImage: null,
    slug: { current: 'barcelona-2009' },
    sizes: ['P', 'M', 'G'],
    year: 2009,
    sport: 'Futebol',
    team: 'Barcelona',
    categories: ['Camisas Retrô', 'Futebol', 'Times'],
    collectionName: 'Champions Legend',
    player: 'Messi',
    brand: 'Nike',
    inStock: true
  },
  {
    _id: '4',
    name: 'Camisa Chicago Bulls Retrô 1998',
    price: 349.90,
    badge: 'Mais Vendida',
    mainImage: null,
    slug: { current: 'bulls-1998' },
    sizes: ['M', 'G', 'GG', 'XGG'],
    year: 1998,
    sport: 'Basquete',
    team: 'Bulls',
    categories: ['Basquete', 'Camisas Retrô', 'Times'],
    collectionName: 'Championship Era',
    player: 'Jordan',
    brand: 'Nike',
    inStock: true
  },
  {
    _id: '5',
    name: 'Camisa Brasil Home 2026',
    price: 399.90,
    badge: 'Coleção 2026',
    mainImage: null,
    slug: { current: 'brasil-2026' },
    sizes: ['P', 'M', 'G', 'GG'],
    year: 2026,
    sport: 'Futebol',
    team: 'Seleção Brasileira',
    categories: ['Coleção 2026', 'Futebol', 'Seleções'],
    collectionName: 'Copa do Mundo 2026',
    player: 'Neymar Jr',
    brand: 'Nike',
    inStock: true
  }
];

const CATEGORIES = [
  'Todas',
  'Camisas Retrô',
  'Coleção 2026',
  'Basquete',
  'Futebol',
  'Seleções',
  'Times',
  'Edições Especiais'
];

const QUERY = `*[_type == "product" && inStock == true] | order(order asc) {
  _id, name, price, originalPrice, badge, mainImage, sizes, category, checkoutUrl, slug,
  year, sport, team, categories, collectionName, player, brand
}`

export default function Products() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    client.fetch(QUERY)
      .then((data) => {
        setProdutos(data.length > 0 ? data : FALLBACK);
        setLoading(false);
      })
      .catch(() => {
        setProdutos(FALLBACK);
        setLoading(false);
      });

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleBuyClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes?.[0] || 'M');
  };

  const normalizeString = (str) => {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const filteredProdutos = produtos.filter((p) => {
    // 1. Category Filter (Aba)
    if (selectedCategory !== 'Todas') {
      const catNormalized = normalizeString(selectedCategory);
      const inCategories = p.categories && p.categories.some(
        c => normalizeString(c) === catNormalized
      );
      const inOldCategory = p.category && normalizeString(p.category) === catNormalized;
      
      if (!inCategories && !inOldCategory) {
        return false;
      }
    }

    // 2. Search Query Filter
    if (searchQuery.trim() !== '') {
      const query = normalizeString(searchQuery);
      const fields = [
        p.name,
        p.team,
        p.player,
        p.sport,
        p.collectionName,
        p.brand,
        p.year ? String(p.year) : '',
        p.category,
        ...(p.categories || [])
      ].filter(Boolean);

      const matches = fields.some(f => normalizeString(f).includes(query));
      if (!matches) {
        return false;
      }
    }

    return true;
  });

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(160px, 1fr))' : 'repeat(4, minmax(0, 1fr))',
    gap: isMobile ? '1rem' : '2rem',
    width: '100%',
  };

  return (
    <section id="camisas" style={{ padding: isMobile ? '4rem 5%' : '8rem 8%', background: '#fafafa' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: isMobile ? '2rem' : '4rem', 
        flexWrap: 'wrap', 
        gap: '1rem',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <div style={{ width: isMobile ? '100%' : 'auto' }}>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', color: '#aaa', textTransform: 'uppercase', marginBottom: '0.5rem' }}
          >
            Lançamentos
          </motion.p>
          <motion.h3
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ 
              fontSize: isMobile ? '2.2rem' : '3rem', 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              letterSpacing: '-1px', 
              color: '#111', 
              lineHeight: 1 
            }}
          >
            A Coleção
          </motion.h3>
        </div>
        {!isMobile && (
          <Link
            to="/" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '2px solid #111', paddingBottom: '2px' }}
          >
            Ver Tudo →
          </Link>
        )}
      </div>

      {/* Catalog Controls: Search and Category Tabs */}
      <div className="catalog-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Pesquisar camisas..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} className="search-icon-inside" />
        </div>

        <div className="tabs-wrapper">
          <div className="tabs-container">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={gridStyles}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/5', background: 'linear-gradient(90deg, #ececec 25%, #f5f5f5 50%, #ececec 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={gridStyles}>
          {filteredProdutos.length === 0 ? (
            <div className="catalog-empty">
              <span style={{ fontSize: '3rem' }}>👕</span>
              <h4 className="catalog-empty-title">Nenhuma camisa encontrada</h4>
              <p className="catalog-empty-text">Experimente pesquisar com outros termos ou selecione outra categoria.</p>
            </div>
          ) : (
            filteredProdutos.map((p, index) => (
              <Link 
                key={p._id} 
                to={`/produto/${p.slug?.current || 'brasil-home'}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  whileHover={!isMobile ? { y: -8 } : {}}
                >
                  <div style={{
                    backgroundColor: '#f8f8f8', borderRadius: '16px', overflow: 'hidden',
                    position: 'relative', aspectRatio: '4/5',
                  }}>
                    {p.badge && (
                      <div style={{ 
                        position: 'absolute', top: '0.8rem', left: '0.8rem', zIndex: 2, 
                        background: '#111', color: '#fff', padding: '0.2rem 0.6rem', 
                        borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800, 
                        letterSpacing: '1px', textTransform: 'uppercase' 
                      }}>
                        {p.badge}
                      </div>
                    )}
                    {p.mainImage && p.mainImage.asset ? (
                      <motion.img
                        whileHover={!isMobile ? { scale: 1.04 } : {}}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        src={urlFor(p.mainImage).width(900).auto('format').url()}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '0.5rem' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8e8e8', color: '#bbb', fontSize: '2rem' }}>
                        👕
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: isMobile ? 1 : 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{ position: 'absolute', bottom: isMobile ? '0.5rem' : '1rem', left: isMobile ? '0.5rem' : '1rem', right: isMobile ? '0.5rem' : '1rem' }}
                    >
                      <button 
                        onClick={(e) => handleBuyClick(e, p)}
                        style={{
                          width: '100%', padding: isMobile ? '0.6rem' : '0.9rem', 
                          background: '#111', color: '#fff',
                          border: 'none', borderRadius: '10px', fontWeight: 800, 
                          fontSize: isMobile ? '0.7rem' : '0.9rem',
                          cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px',
                        }}
                      >
                        {isMobile ? '+' : 'Adicionar ao Carrinho'}
                      </button>
                    </motion.div>
                  </div>

                  <div style={{ marginTop: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <h4 style={{ fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: 700, color: '#111' }}>{p.name}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 900, color: '#111' }}>
                        R$ {p.price.toFixed(2).replace('.', ',')}
                      </p>
                      {p.originalPrice && (
                        <p style={{ fontSize: '0.75rem', color: '#bbb', textDecoration: 'line-through' }}>
                          R$ {p.originalPrice.toFixed(2).replace('.', ',')}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      )}
    </section>
  );
}
