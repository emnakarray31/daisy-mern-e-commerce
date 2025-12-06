const ReturnExchange = () => {
  return (
    <div className="return-exchange-page">
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
                  Return & Exchange
                </h4>
                <div className="breadcrumb__links">
                  <a href="/" style={{ color: '#666' }}>Home</a>
                  <span style={{ margin: '0 10px', color: '#999' }}>→</span>
                  <span style={{ color: '#e53637' }}>Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12" style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                marginBottom: '15px',
                color: '#111',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                14-Day Return Policy
              </h2>
              <p style={{
                fontSize: '15px',
                color: '#666',
                lineHeight: '1.8',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                Not satisfied with your purchase? We offer a hassle-free 14-day return policy. 
                Your satisfaction is our priority.
              </p>
            </div>

            <div className="col-lg-12">
              <div className="row">
                {[
                  {
                    step: '1',
                    title: 'Contact Us',
                    desc: 'Email us within 14 days of receiving your order with your order number and reason for return',
                    icon: 'fa-envelope',
                    color: '#895129'
                  },
                  {
                    step: '2',
                    title: 'Ship Item Back',
                    desc: 'Pack the item securely with tags attached and ship it to our return address',
                    icon: 'fa-box',
                    color: '#e53637'
                  },
                  {
                    step: '3',
                    title: 'Inspection',
                    desc: 'We inspect the returned item within 1-2 business days of receiving it',
                    icon: 'fa-search',
                    color: '#895129'
                  },
                  {
                    step: '4',
                    title: 'Refund',
                    desc: 'Once approved, refund is processed within 7-10 business days',
                    icon: 'fa-check-circle',
                    color: '#4caf50'
                  }
                ].map((step, index) => (
                  <div key={index} className="col-lg-3 col-md-6" style={{ marginBottom: '30px' }}>
                    <div style={{
                      background: '#fff',
                      padding: '35px 25px',
                      border: '2px solid #e5e5e5',
                      borderRadius: '0',
                      height: '100%',
                      textAlign: 'center',
                      position: 'relative',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = step.color;
                      e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e5e5';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    >
                      <div style={{
                        width: '65px',
                        height: '65px',
                        background: step.color + '15',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        borderRadius: '50%',
                        position: 'relative'
                      }}>
                        <i className={`fa ${step.icon}`} style={{ 
                          fontSize: '28px', 
                          color: step.color 
                        }}></i>
                        <div style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          width: '25px',
                          height: '25px',
                          background: step.color,
                          color: '#fff',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '800'
                        }}>
                          {step.step}
                        </div>
                      </div>
                      <h4 style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        marginBottom: '12px',
                        color: '#111',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {step.title}
                      </h4>
                      <p style={{
                        fontSize: '13px',
                        color: '#666',
                        lineHeight: '1.7',
                        margin: 0
                      }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f9f9f9' }}>
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
                Return Conditions
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.7'
              }}>
                Please review these conditions before initiating a return
              </p>
            </div>

            <div className="col-lg-6" style={{ marginBottom: '30px' }}>
              <div style={{
                background: '#fff',
                padding: '40px',
                border: '2px solid #4caf50',
                borderRadius: '0',
                height: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '25px'
                }}>
                  <i className="fa fa-check-circle" style={{ 
                    fontSize: '35px', 
                    color: '#4caf50',
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
                    We Accept Returns For
                  </h4>
                </div>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {[
                    'Items returned within 14 days of delivery',
                    'Unworn items with original tags attached',
                    'Items in original packaging and condition',
                    'Products that are defective or damaged',
                    'Wrong items sent by mistake',
                    'Items that don\'t match the description'
                  ].map((item, i) => (
                    <li key={i} style={{
                      padding: '12px 0',
                      fontSize: '14px',
                      color: '#666',
                      borderBottom: i < 5 ? '1px solid #f5f5f5' : 'none',
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}>
                      <i className="fa fa-check" style={{ 
                        color: '#4caf50', 
                        marginRight: '12px',
                        marginTop: '3px',
                        fontSize: '12px'
                      }}></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-lg-6" style={{ marginBottom: '30px' }}>
              <div style={{
                background: '#fff',
                padding: '40px',
                border: '2px solid #e53637',
                borderRadius: '0',
                height: '100%'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '25px'
                }}>
                  <i className="fa fa-times-circle" style={{ 
                    fontSize: '35px', 
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
                    We Cannot Accept
                  </h4>
                </div>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {[
                    'Items returned after 14 days',
                    'Worn, washed, or altered items',
                    'Items without original tags',
                    'Sale items (marked with discount badges)',
                    'Final sale or clearance items',
                    'Items damaged after delivery'
                  ].map((item, i) => (
                    <li key={i} style={{
                      padding: '12px 0',
                      fontSize: '14px',
                      color: '#666',
                      borderBottom: i < 5 ? '1px solid #f5f5f5' : 'none',
                      display: 'flex',
                      alignItems: 'flex-start'
                    }}>
                      <i className="fa fa-times" style={{ 
                        color: '#e53637', 
                        marginRight: '12px',
                        marginTop: '3px',
                        fontSize: '12px'
                      }}></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#fff' }}>
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
                Important Information
              </h3>

              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  background: '#fff',
                  padding: '30px',
                  border: '1px solid #e5e5e5',
                  borderLeft: '4px solid #e53637',
                  borderRadius: '0',
                  marginBottom: '20px'
                }}>
                  <h5 style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    marginBottom: '10px',
                    color: '#111',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fa fa-shipping-fast" style={{ 
                      marginRight: '10px', 
                      color: '#e53637' 
                    }}></i>
                    Return Shipping Costs
                  </h5>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.7',
                    margin: 0
                  }}>
                    Return shipping costs are the responsibility of the customer, unless the item is defective or we sent the wrong item. We recommend using Aramex for reliable return shipping.
                  </p>
                </div>

                <div style={{
                  background: '#fff',
                  padding: '30px',
                  border: '1px solid #e5e5e5',
                  borderLeft: '4px solid #895129',
                  borderRadius: '0',
                  marginBottom: '20px'
                }}>
                  <h5 style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    marginBottom: '10px',
                    color: '#111',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fa fa-money-bill-wave" style={{ 
                      marginRight: '10px', 
                      color: '#895129' 
                    }}></i>
                    Refund Timeline
                  </h5>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.7',
                    margin: 0
                  }}>
                    Once we receive and inspect your return (1-2 business days), we'll process your refund within 3-5 business days. The refund will appear in your original payment method within 7-10 business days depending on your bank.
                  </p>
                </div>

                <div style={{
                  background: '#fff',
                  padding: '30px',
                  border: '1px solid #e5e5e5',
                  borderLeft: '4px solid #e53637',
                  borderRadius: '0',
                  marginBottom: '20px'
                }}>
                  <h5 style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    marginBottom: '10px',
                    color: '#111',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fa fa-exchange-alt" style={{ 
                      marginRight: '10px', 
                      color: '#e53637' 
                    }}></i>
                    Exchanges
                  </h5>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.7',
                    margin: 0
                  }}>
                    We currently don't offer direct exchanges. If you'd like a different size or color, please return your item for a refund and place a new order. This ensures you get exactly what you want without delays.
                  </p>
                </div>

                <div style={{
                  background: '#fff',
                  padding: '30px',
                  border: '1px solid #e5e5e5',
                  borderLeft: '4px solid #895129',
                  borderRadius: '0'
                }}>
                  <h5 style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    marginBottom: '10px',
                    color: '#111',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fa fa-tag" style={{ 
                      marginRight: '10px', 
                      color: '#895129' 
                    }}></i>
                    Sale Items Policy
                  </h5>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.7',
                    margin: 0
                  }}>
                    Items purchased during sales or with discount codes are <strong style={{ color: '#e53637' }}>final sale and cannot be returned or exchanged</strong>. Please choose carefully when shopping sale items. This policy is clearly marked on product pages.
                  </p>
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
                How to Initiate a Return
              </h3>

              <div style={{
                background: '#fff',
                padding: '50px',
                border: '2px solid #e5e5e5',
                borderRadius: '0',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '15px',
                  color: '#666',
                  lineHeight: '1.8',
                  marginBottom: '30px'
                }}>
                  To start your return, please contact our customer service team with your order details:
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  maxWidth: '400px',
                  margin: '0 auto 40px'
                }}>
                  <div style={{
                    padding: '20px',
                    background: '#f9f9f9',
                    border: '1px solid #e5e5e5',
                    borderRadius: '0'
                  }}>
                    <i className="fa fa-envelope" style={{ 
                      fontSize: '24px', 
                      color: '#895129',
                      marginBottom: '10px'
                    }}></i>
                    <p style={{
                      fontSize: '13px',
                      color: '#999',
                      margin: '0 0 5px 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '700'
                    }}>
                      Email Us
                    </p>
                    <a href="mailto:returns@daisyandmore.com" style={{
                      fontSize: '14px',
                      color: '#e53637',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}>
                      returns@daisyandmore.com
                    </a>
                  </div>

                  <div style={{
                    padding: '20px',
                    background: '#f9f9f9',
                    border: '1px solid #e5e5e5',
                    borderRadius: '0'
                  }}>
                    <i className="fa fa-comments" style={{ 
                      fontSize: '24px', 
                      color: '#e53637',
                      marginBottom: '10px'
                    }}></i>
                    <p style={{
                      fontSize: '13px',
                      color: '#999',
                      margin: '0 0 5px 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '700'
                    }}>
                      Or Use Contact Form
                    </p>
                    <a href="/contact" style={{
                      fontSize: '14px',
                      color: '#895129',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}>
                      Contact Page →
                    </a>
                  </div>
                </div>

                <p style={{
                  fontSize: '13px',
                  color: '#999',
                  fontStyle: 'italic',
                  margin: 0
                }}>
                  Please include your order number and reason for return in your message
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#fff' }}>
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
                Return & Exchange FAQ
              </h3>

              {[
                {
                  q: 'How long do I have to return an item?',
                  a: 'You have 14 days from the date of delivery to initiate a return. Items must be unworn with tags attached.'
                },
                {
                  q: 'Can I return sale items?',
                  a: 'No, all sale items are final sale and cannot be returned or exchanged. This policy is clearly marked on product pages during checkout.'
                },
                {
                  q: 'Who pays for return shipping?',
                  a: 'The customer is responsible for return shipping costs, unless the item is defective or we sent the wrong item by mistake.'
                },
                {
                  q: 'Can I exchange an item for a different size?',
                  a: 'We don\'t offer direct exchanges. Please return your item for a refund and place a new order for the correct size.'
                },
                {
                  q: 'How long does it take to get my refund?',
                  a: 'After we receive and inspect your return (1-2 days), we process refunds within 3-5 business days. It may take an additional 5-7 days for the refund to appear in your account depending on your bank.'
                },
                {
                  q: 'What if my item arrives damaged?',
                  a: 'If your item arrives damaged or defective, contact us immediately with photos. We\'ll arrange a free return and send you a replacement or full refund including shipping costs.'
                },
                {
                  q: 'Do I need the original packaging?',
                  a: 'Yes, items must be returned in their original packaging with all tags attached to be eligible for a refund.'
                }
              ].map((faq, index) => (
                <div key={index} style={{
                  marginBottom: '25px',
                  paddingBottom: '25px',
                  borderBottom: index < 6 ? '1px solid #e5e5e5' : 'none'
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
                Need help with a return or exchange?
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

export default ReturnExchange;