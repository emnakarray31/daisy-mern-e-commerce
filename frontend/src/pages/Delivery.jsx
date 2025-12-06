const Delivery = () => {
  return (
    <div className="delivery-page">
    
      <section className="breadcrumb-option" style={{ 
        padding: '40px 0',
        background: '#f5f5f5'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4 style={{ 
                  fontSize: '32px', 
                  fontWeight: '800',
                  marginBottom: '10px',
                  color: '#111'
                }}>
                  Delivery Information
                </h4>
                <div className="breadcrumb__links">
                  <a href="/" style={{ color: '#666' }}>Home</a>
                  <span style={{ margin: '0 10px', color: '#999' }}>→</span>
                  <span style={{ color: '#e53637' }}>Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0', background: '#000', textAlign: 'center' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <i className="fa fa-truck" style={{ 
                fontSize: '50px', 
                color: '#e53637',
                marginBottom: '20px'
              }}></i>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '800',
                marginBottom: '15px',
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '2px'
              }}>
                FREE SHIPPING
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#fff',
                lineHeight: '1.8',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Enjoy free delivery on all orders across Tunisia. No minimum purchase required!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12" style={{ marginBottom: '50px', textAlign: 'center' }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '800',
                marginBottom: '10px',
                color: '#111',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                How Delivery Works
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.7'
              }}>
                Fast and reliable delivery powered by Aramex
              </p>
            </div>

            
            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{
                background: '#fff',
                padding: '40px 25px',
                border: '2px solid #e5e5e5',
                borderRadius: '0',
                height: '100%',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#895129';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#89512915',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#895129'
                }}>
                  1
                </div>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  marginBottom: '12px',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Order Placed
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  Complete your order and receive instant confirmation via email
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{
                background: '#fff',
                padding: '40px 25px',
                border: '2px solid #e5e5e5',
                borderRadius: '0',
                height: '100%',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#e53637';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#e5363715',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#e53637'
                }}>
                  2
                </div>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  marginBottom: '12px',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Processing
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  We carefully prepare and pack your order within 1-2 business days
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{
                background: '#fff',
                padding: '40px 25px',
                border: '2px solid #e5e5e5',
                borderRadius: '0',
                height: '100%',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#895129';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#89512915',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#895129'
                }}>
                  3
                </div>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  marginBottom: '12px',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Shipped
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  Your order is handed to Aramex with a tracking number
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{
                background: '#fff',
                padding: '40px 25px',
                border: '2px solid #e5e5e5',
                borderRadius: '0',
                height: '100%',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#e53637';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e5e5';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#e5363715',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  borderRadius: '50%',
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#e53637'
                }}>
                  4
                </div>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: '800',
                  marginBottom: '12px',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Delivered
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  Receive your order within 3-7 business days
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f9f9f9' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6" style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#fff',
                padding: '40px',
                border: '1px solid #e5e5e5',
                borderRadius: '0',
                height: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                  <i className="fa fa-map-marker-alt" style={{ 
                    fontSize: '30px', 
                    color: '#e53637',
                    marginRight: '15px'
                  }}></i>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    margin: 0,
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Delivery Coverage
                  </h4>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>
                  We deliver to all cities and regions across Tunisia, from Tunis to Sfax, Sousse to Djerba, and everywhere in between.
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {['All major cities', 'Suburban areas', 'Rural regions', 'Remote locations'].map((item, i) => (
                    <li key={i} style={{
                      padding: '8px 0',
                      fontSize: '13px',
                      color: '#666',
                      borderBottom: i < 3 ? '1px solid #f5f5f5' : 'none'
                    }}>
                      <i className="fa fa-check-circle" style={{ 
                        color: '#4caf50', 
                        marginRight: '10px' 
                      }}></i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-6" style={{ marginBottom: '40px' }}>
              <div style={{
                background: '#fff',
                padding: '40px',
                border: '1px solid #e5e5e5',
                borderRadius: '0',
                height: '100%'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
                  <i className="fa fa-clock" style={{ 
                    fontSize: '30px', 
                    color: '#895129',
                    marginRight: '15px'
                  }}></i>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    margin: 0,
                    color: '#111',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Delivery Time
                  </h4>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.7',
                  marginBottom: '20px'
                }}>
                  Your order will be delivered within 3-7 business days, depending on your location in Tunisia.
                </p>
                <div style={{
                  background: '#f9f9f9',
                  padding: '20px',
                  border: '1px solid #f0f0f0',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #e5e5e5'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>
                      Major Cities
                    </span>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      3-4 days
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    paddingBottom: '10px',
                    borderBottom: '1px solid #e5e5e5'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>
                      Other Regions
                    </span>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      5-7 days
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#111' }}>
                      Remote Areas
                    </span>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      6-7 days
                    </span>
                  </div>
                </div>
                <p style={{
                  fontSize: '12px',
                  color: '#999',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  * Business days exclude weekends and public holidays
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8" style={{ margin: '0 auto', textAlign: 'center', marginBottom: '50px' }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '800',
                marginBottom: '15px',
                color: '#111',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Track Your Order
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.7'
              }}>
                Once your order ships, you'll receive a tracking number via email to monitor your delivery in real-time through Aramex.
              </p>
            </div>

            <div className="col-lg-10" style={{ margin: '0 auto' }}>
              <div style={{
                background: '#f9f9f9',
                padding: '50px',
                border: '1px solid #e5e5e5',
                borderRadius: '0'
              }}>
                <div className="row">
                  <div className="col-md-4" style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      background: '#89512915',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      borderRadius: '50%'
                    }}>
                      <i className="fa fa-box" style={{ fontSize: '30px', color: '#895129' }}></i>
                    </div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: '800',
                      marginBottom: '8px',
                      color: '#111',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Processing
                    </h5>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                      Order is being prepared
                    </p>
                  </div>

                  <div className="col-md-4" style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      background: '#e5363715',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      borderRadius: '50%'
                    }}>
                      <i className="fa fa-truck" style={{ fontSize: '30px', color: '#e53637' }}></i>
                    </div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: '800',
                      marginBottom: '8px',
                      color: '#111',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      In Transit
                    </h5>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                      Package is on the way
                    </p>
                  </div>

                  <div className="col-md-4" style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      background: '#4caf5015',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      borderRadius: '50%'
                    }}>
                      <i className="fa fa-check" style={{ fontSize: '30px', color: '#4caf50' }}></i>
                    </div>
                    <h5 style={{
                      fontSize: '14px',
                      fontWeight: '800',
                      marginBottom: '8px',
                      color: '#111',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Delivered
                    </h5>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                      Order has arrived
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      <section style={{ padding: '80px 0', background: '#f9f9f9' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8" style={{ margin: '0 auto' }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '800',
                marginBottom: '40px',
                color: '#111',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                textAlign: 'center'
              }}>
                Delivery FAQ
              </h3>

              {[
                {
                  q: 'Is delivery really free?',
                  a: 'Yes! We offer completely free delivery on all orders to any location in Tunisia, with no minimum purchase required.'
                },
                {
                  q: 'How long does delivery take?',
                  a: 'Delivery typically takes 3-7 business days depending on your location. Major cities receive orders faster (3-4 days), while remote areas may take up to 30 days.'
                },
                {
                  q: 'Can I track my order?',
                  a: 'Absolutely! Once your order ships, you ll receive a tracking number via email. You can track your package in real-time through Aramex.'
                },
                {
                  q: 'What if I\'m not home when delivery arrives?',
                  a: 'Aramex will attempt delivery up to 3 times. If unsuccessful, theyll contact you to arrange a convenient delivery time or pickup location.'
                },
                {
                  q: 'Do you deliver on weekends?',
                  a: 'Aramex delivers Monday to Saturday. Orders are not delivered on Sundays or public holidays.'
                },
                {
                  q: 'Can I change my delivery address after ordering?',
                  a: 'Yes, but only before your order ships. Contact us immediately at support@daisyandmore.com to update your address.'
                }

              ].map((faq, index) => (
                <div key={index} style={{
                  marginBottom: '25px',
                  paddingBottom: '25px',
                  borderBottom: index < 5 ? '1px solid #e5e5e5' : 'none'
                }}>
                  <h5 style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    marginBottom: '10px',
                    color: '#111'
                  }}>
                    {faq.q}
                  </h5>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.7',
                    margin: 0
                  }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="row" style={{ marginTop: '50px' }}>
            <div className="col-lg-12" style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '20px'
              }}>
                Need help with your delivery?
              </p>
              <a 
                href="/contact" 
                style={{
                  display: 'inline-block',
                  padding: '15px 40px',
                  background: '#000',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  transition: 'all 0.3s',
                  border: 'none',
                  borderRadius: '0'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e53637'}
                onMouseLeave={(e) => e.target.style.background = '#000'}
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Delivery;