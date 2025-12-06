import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const SalesPage = () => {
  const [activeSales, setActiveSales] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSale, setSelectedSale] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveSales();
  }, []);

  const fetchActiveSales = async () => {
    try {
      setLoading(true);
      const [salesRes, productsRes] = await Promise.all([
        axios.get('/sales/active'),
        axios.get('/sales/products')
      ]);

      setActiveSales(salesRes.data || []);
      setSaleProducts(productsRes.data || []);

      if (salesRes.data && salesRes.data.length > 0) {
        setSelectedSale(salesRes.data[0]);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };


  const CountdownTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    useEffect(() => {
      const calculateTimeLeft = () => {
        const difference = new Date(endDate) - new Date();
        
        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }, [endDate]);

    return (
      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '30px'
      }}>
        <TimeBox value={timeLeft.days} label="Days" />
        <TimeBox value={timeLeft.hours} label="Hours" />
        <TimeBox value={timeLeft.minutes} label="Minutes" />
        <TimeBox value={timeLeft.seconds} label="Seconds" />
      </div>
    );
  };

  const TimeBox = ({ value, label }) => (
    <div style={{
      textAlign: 'center',
      minWidth: '80px',
    }}>
      <div style={{
        background: '#fff',
        border: '2px solid #895129',
        borderRadius: '12px',
        padding: '15px 20px',
        boxShadow: '0 4px 12px rgba(137, 81, 41, 0.15)',
      }}>
        <div style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#e53637',
          fontFamily: "'Playfair Display', serif",
        }}>
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <div style={{
        marginTop: '8px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#6f6f6f',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        {label}
      </div>
    </div>
  );


  const filteredProducts = selectedSale
    ? saleProducts.filter(p => 
        selectedSale.products.some(sp => sp._id === p._id || sp === p._id)
      )
    : saleProducts;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)',
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #895129',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}></div>
      </div>
    );
  }

  if (activeSales.length === 0) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)',
      }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fa fa-tags" style={{ fontSize: '64px', color: '#e5e5e5', marginBottom: '20px' }}></i>
          <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '10px' }}>
            No Active Sales
          </h3>
          <p style={{ fontSize: '16px', color: '#6f6f6f', marginBottom: '20px' }}>
            Check back soon for amazing deals!
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 30px',
              background: '#895129',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#6f3f1f'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#895129'}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)', minHeight: '100vh' }}>
      
      <section style={{
        background: 'linear-gradient(135deg, #895129 0%, #6f3f1f 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div className="container">
          <div style={{
            display: 'inline-block',
            background: '#e53637',
            padding: '8px 20px',
            borderRadius: '30px',
            marginBottom: '20px',
            fontSize: '13px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            <i className="fa fa-bolt" style={{ marginRight: '8px' }}></i>
            Limited Time Offer
          </div>

          <h1 style={{
            fontSize: '56px',
            fontWeight: '800',
            marginBottom: '15px',
            fontFamily: "'Playfair Display', serif",
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}>
            {selectedSale?.name || 'Special Sale'}
          </h1>

          {selectedSale?.description && (
            <p style={{
              fontSize: '20px',
              marginBottom: '10px',
              opacity: 0.95,
            }}>
              {selectedSale.description}
            </p>
          )}

          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '12px 30px',
            borderRadius: '50px',
            marginBottom: '30px',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ fontSize: '18px', fontWeight: '600' }}>
              Up to{' '}
              <span style={{ 
                fontSize: '32px', 
                fontWeight: '800',
                color: '#FFD728',
              }}>
                {selectedSale?.discountValue}
                {selectedSale?.discountType === 'percentage' ? '%' : '$'}
              </span>
              {' '}OFF
            </span>
          </div>

          {selectedSale && (
            <>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}>
                Sale Ends In
              </h3>
              <CountdownTimer endDate={selectedSale.endDate} />
            </>
          )}
        </div>
      </section>

    
      {activeSales.length > 1 && (
        <section style={{ padding: '40px 20px 20px', background: '#fff' }}>
          <div className="container">
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              {activeSales.map((sale) => (
                <button
                  key={sale._id}
                  onClick={() => setSelectedSale(sale)}
                  style={{
                    padding: '12px 25px',
                    background: selectedSale?._id === sale._id 
                      ? 'linear-gradient(135deg, #895129 0%, #6f3f1f 100%)' 
                      : '#f5f5f5',
                    color: selectedSale?._id === sale._id ? '#fff' : '#111',
                    border: selectedSale?._id === sale._id ? 'none' : '1px solid #e5e5e5',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSale?._id !== sale._id) {
                      e.currentTarget.style.background = '#e5e5e5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSale?._id !== sale._id) {
                      e.currentTarget.style.background = '#f5f5f5';
                    }
                  }}
                >
                  {sale.name}
                  <span style={{
                    marginLeft: '10px',
                    padding: '2px 8px',
                    background: selectedSale?._id === sale._id ? 'rgba(255,255,255,0.2)' : '#895129',
                    color: selectedSale?._id === sale._id ? '#fff' : '#fff',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '700',
                  }}>
                    {sale.products?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: '60px 20px' }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            marginBottom: '50px',
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '800',
              marginBottom: '10px',
              fontFamily: "'Playfair Display', serif",
              background: 'linear-gradient(135deg, #895129 0%, #e53637 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Products on Sale
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6f6f6f',
            }}>
              {filteredProducts.length} amazing deals waiting for you
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <i className="fa fa-shopping-bag" style={{ fontSize: '64px', color: '#e5e5e5', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#111', marginBottom: '10px' }}>
                No Products Available
              </h3>
              <p style={{ fontSize: '16px', color: '#6f6f6f' }}>
                Products will be added to this sale soon
              </p>
            </div>
          ) : (
            <div className="row">
              {filteredProducts.map((product) => (
                <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SalesPage;