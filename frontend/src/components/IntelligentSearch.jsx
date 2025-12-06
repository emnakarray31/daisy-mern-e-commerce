import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import Fuse from 'fuse.js';
 const highlightMatch = (text, query) => {
	if (!text || !query) return text;
	
	try {
		const regex = new RegExp(`(${query})`, 'gi');
		const parts = text.split(regex);
		
		return parts.map((part, index) => 
			regex.test(part) ? <mark key={index} style={{ background: '#fff3cd', padding: '2px 4px' }}>{part}</mark> : part
		);
	} catch (error) {
		return text;
	}
};
const IntelligentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState({
    products: [],
    categories: [],
    keywords: []
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('searchHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Catégories avec icônes
  const allCategories = [
    { name: 'Jeans', slug: 'jeans', icon: 'fa fa-user-tie' },
    { name: 'T-Shirts', slug: 't-shirt', icon: 'fa fa-shirt' },
    { name: 'Shoes', slug: 'shoes', icon: 'fa fa-shoe-prints' },
    { name: 'Glasses', slug: 'glasses', icon: 'fa fa-glasses' },
    { name: 'Jackets', slug: 'jacket', icon: 'fa fa-vest' },
    { name: 'Suits', slug: 'suits', icon: 'fa fa-user-tie' },
    { name: 'Bags', slug: 'bags', icon: 'fa fa-bag-shopping' },
    { name: 'Accessories', slug: 'accessories', icon: 'fa fa-gem' },
  ];

  // Mots-clés populaires
  const popularKeywords = {
    'jeans': ['slim fit', 'straight', 'skinny', 'bootcut', 'ripped', 'black jeans', 'blue jeans'],
    't-shirt': ['graphic tee', 'plain', 'v-neck', 'crew neck', 'oversized', 'fitted'],
    'shoes': ['sneakers', 'boots', 'running shoes', 'casual', 'formal', 'sport'],
    'glasses': ['sunglasses', 'reading glasses', 'aviator', 'wayfarer', 'round'],
    'jacket': ['leather jacket', 'denim jacket', 'bomber', 'windbreaker', 'parka'],
    'suits': ['formal suit', 'business suit', 'slim fit suit', 'wedding suit'],
    'bags': ['backpack', 'tote bag', 'crossbody', 'messenger bag', 'handbag'],
    'accessories': ['watch', 'belt', 'wallet', 'scarf', 'hat', 'jewelry']
  };

  // Fuse.js
  const categoryFuse = new Fuse(allCategories, {
    keys: ['name'],
    threshold: 0.4,
    includeScore: true
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        fetchIntelligentSuggestions();
      } else if (searchQuery.length === 0) {
        setSuggestions({ products: [], categories: [], keywords: [] });
        setIsOpen(false);
      } else {
        setSuggestions({ products: [], categories: [], keywords: [] });
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchIntelligentSuggestions = async () => {
    setIsLoading(true);
    try {
      const query = searchQuery.toLowerCase().trim();

      // Rechercher produits
      const productsRes = await axios.get(`/products?search=${encodeURIComponent(query)}&limit=5`);

      let products = productsRes.data.products || productsRes.data || [];

      // Filtrer les produits pertinents
      products = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const categoryMatch = product.category?.toLowerCase().includes(query);
        const descMatch = product.description?.toLowerCase().includes(query);
        return nameMatch || categoryMatch || descMatch;
      });

      // Recherche floue catégories
      const categoryMatches = categoryFuse
        .search(query)
        .filter(result => result.score < 0.4)
        .map(result => result.item)
        .slice(0, 3);

      // Générer keywords
      const keywords = generateSmartKeywords(query, products, categoryMatches);

      const hasRelevantResults = products.length > 0 || categoryMatches.length > 0 || keywords.length > 0;

      setSuggestions({
        products,
        categories: categoryMatches,
        keywords
      });
      setIsOpen(hasRelevantResults);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('❌ Search error:', err);
      setSuggestions({ products: [], categories: [], keywords: [] });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartKeywords = (query, products, categories) => {
    const keywords = new Set();

    categories.forEach(cat => {
      const catKeywords = popularKeywords[cat.slug] || [];
      catKeywords.forEach(kw => {
        if (kw.toLowerCase().includes(query)) {
          keywords.add(kw);
        }
      });
    });

    if (query.length >= 3 && categories.length > 0) {
      const firstCat = categories[0].slug;
      const relevantKeywords = popularKeywords[firstCat] || [];
      relevantKeywords.slice(0, 3).forEach(kw => keywords.add(kw));
    }

    return Array.from(keywords).slice(0, 5);
  };

  const handleSelectItem = (item) => {
    if (item.slug) {
      navigate(`/category/${item.slug}`);
    } else if (item._id) {
      navigate(`/product/${item._id}`);
    } else {
      navigate(`/category/all?search=${encodeURIComponent(item)}`);
    }
    addToHistory(typeof item === 'string' ? item : item.name || item.slug);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const trimmed = searchQuery.trim();
      navigate(`/category/all?search=${encodeURIComponent(trimmed)}`);
      addToHistory(trimmed);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const addToHistory = (term) => {
    try {
      const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    setIsOpen(false);
  };

  const hasResults = suggestions.categories.length > 0 || 
                      suggestions.keywords.length > 0 || 
                      suggestions.products.length > 0;

  return (
    <div ref={searchRef} style={{ position: 'relative', marginBottom: '30px', width:'847px' , marginLeft: '-15px' }}>

      <form onSubmit={handleSearch}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="What do you need?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.length >= 2) {
                setIsOpen(true);
              }
            }}
            style={{
              width: '100%',
              padding: '16px 140px 16px 20px',
              border: '2px solid #e0e0e0',
              borderRadius: '0',
              background: '#fff',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 0.3s'
            }}
          />

          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '0',
              top: '0',
              background: '#000',
              border: 'none',
              padding: '0 35px',
              height: '100%',
              borderRadius: '0',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#333'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#000'}
          >
            SEARCH
          </button>
        </div>
      </form>
 
      {isOpen && searchQuery.length >= 2 && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 5px)',
          left: '0',
          right: '0',
          background: '#fff',
          borderRadius: '0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          zIndex: 99999,
          border: '1px solid #e0e0e0',
          maxHeight: '500px',
          overflowY: 'auto'
        }}> 
          {isLoading && (
            <div style={{ padding: '20px' }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 0',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <div style={{ width: '40px', height: '40px', background: '#eee', borderRadius: '0' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: '14px', background: '#eee', borderRadius: '0', marginBottom: '8px', width: '70%' }}></div>
                    <div style={{ height: '12px', width: '50%', background: '#eee', borderRadius: '0' }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
 
          {!isLoading && hasResults && searchQuery.length >= 2 && (
            <> 
              {suggestions.categories.length > 0 && (
                <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#555',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    padding: '0 20px',
                    marginBottom: '8px',
                    background: '#f9f9f9',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}>
                    <i className="fa fa-layer-group" style={{ marginRight: '8px', color: '#895129' }}></i>
                    Categories
                  </div>
                  {suggestions.categories.map((cat) => (
                    <div
                      key={cat.slug}
                      onClick={() => handleSelectItem(cat)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <i className={cat.icon} style={{
                        marginRight: '12px',
                        color: '#895129',
                        width: '20px',
                        fontSize: '16px'
                      }}></i>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {highlightMatch(cat.name, searchQuery)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
 
              {suggestions.keywords.length > 0 && (
                <div style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#555',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    padding: '0 20px',
                    marginBottom: '8px',
                    background: '#f9f9f9',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}>
                    <i className="fa fa-lightbulb" style={{ marginRight: '8px', color: '#e53637' }}></i>
                    Suggested Searches
                  </div>
                  {suggestions.keywords.map((keyword, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectItem(keyword)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <i className="fa fa-search" style={{
                        marginRight: '12px',
                        color: '#999',
                        fontSize: '13px'
                      }}></i>
                      <span style={{ fontSize: '14px' }}>
                        {highlightMatch(keyword, searchQuery)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
 
              {suggestions.products.length > 0 && (
                <div style={{ padding: '12px 0' }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#555',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    padding: '0 20px',
                    marginBottom: '8px',
                    background: '#f9f9f9',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}>
                    <i className="fa fa-box" style={{ marginRight: '8px', color: '#895129' }}></i>
                    Products
                  </div>
                  {suggestions.products.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectItem(product)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '45px',
                          height: '45px',
                          objectFit: 'cover',
                          borderRadius: '0',
                          border: '1px solid #f0f0f0'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                          {highlightMatch(product.name, searchQuery)}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {product.category || 'Clothing'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontWeight: '700',
                          color: product.onSale ? '#e53637' : '#895129',
                          fontSize: '15px'
                        }}>
                          ${product.onSale && product.salePrice ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
                        </div>
                        {product.onSale && product.originalPrice && (
                          <div style={{
                            fontSize: '12px',
                            color: '#999',
                            textDecoration: 'line-through'
                          }}>
                            ${product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
 
              <div style={{
                padding: '12px 20px',
                background: '#f9f9f9',
                borderTop: '1px solid #eee',
                textAlign: 'center'
              }}>
                <Link
                  to={`/category/all?search=${encodeURIComponent(searchQuery)}`}
                  onClick={() => {
                    addToHistory(searchQuery);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  style={{
                    color: '#0066c0',
                    fontSize: '13px',
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  See all results for "{searchQuery}" <i className="fa fa-arrow-right" style={{ marginLeft: '6px', fontSize: '11px' }}></i>
                </Link>
              </div>
            </>
          )}
 
          {!isLoading && !hasResults && searchQuery.length >= 2 && (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                No results found for "{searchQuery}"
              </div>
              <div style={{ fontSize: '14px', color: '#999' }}>
                Try different keywords or check your spelling
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default IntelligentSearch;