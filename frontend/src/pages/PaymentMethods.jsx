const PaymentMethods = () => {
  return (
    <div className="payment-methods-page">
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
                  Payment Methods
                </h4>
                <div className="breadcrumb__links">
                  <a href="/" style={{ color: '#666' }}>Home</a>
                  <span style={{ margin: '0 10px', color: '#999' }}>→</span>
                  <span style={{ color: '#e53637' }}>Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0 50px', background: '#fff' }}>
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
                Safe & Secure Payment
              </h2>
              <p style={{
                fontSize: '15px',
                color: '#666',
                lineHeight: '1.8',
                maxWidth: '700px',
                margin: '0 auto'
              }}>
                We accept all major credit and debit cards. All transactions are secured with SSL encryption and processed through Stripe, the world's leading payment platform.
              </p>
            </div>

            <div className="col-lg-12" style={{ marginBottom: '50px' }}>
              <div style={{
                background: '#fff',
                padding: '50px',
                border: '2px solid #e5e5e5',
                borderRadius: '0',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#e5363715',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px',
                  borderRadius: '0'
                }}>
                  <i className="fa fa-credit-card" style={{ 
                    fontSize: '40px', 
                    color: '#e53637' 
                  }}></i>
                </div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  marginBottom: '15px',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Credit & Debit Cards
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.7',
                  marginBottom: '30px',
                  maxWidth: '600px',
                  margin: '0 auto 30px'
                }}>
                  We accept all major credit and debit cards. Your payment information is never stored on our servers and is processed securely through Stripe.
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: '15px', 
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {['VISA', 'MASTERCARD', 'AMERICAN EXPRESS', 'DISCOVER'].map(card => (
                    <div key={card} style={{
                      padding: '12px 20px',
                      background: '#f5f5f5',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#111',
                      letterSpacing: '0.5px',
                      border: '1px solid #e5e5e5'
                    }}>
                      {card}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: '#f9f9f9' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12" style={{ textAlign: 'center', marginBottom: '50px' }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '800',
                marginBottom: '10px',
                color: '#111',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Your Security is Our Priority
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.7'
              }}>
                We use industry-leading security measures to protect your payment information
              </p>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{
                background: '#fff',
                padding: '40px 30px',
                border: '1px solid #e5e5e5',
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
                <i className="fa fa-lock" style={{ 
                  fontSize: '40px', 
                  color: '#895129',
                  marginBottom: '20px'
                }}></i>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  marginBottom: '12px',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  SSL Encryption
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  All payment data is encrypted with 256-bit SSL technology, the same level used by banks.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{
                background: '#fff',
                padding: '40px 30px',
                border: '1px solid #e5e5e5',
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
                <i className="fa fa-shield" style={{ 
                  fontSize: '40px', 
                  color: '#e53637',
                  marginBottom: '20px'
                }}></i>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  marginBottom: '12px',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  PCI Compliant
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  We are fully PCI DSS compliant, meeting the highest security standards for payment processing.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6" style={{ marginBottom: '30px' }}>
              <div style={{
                background: '#fff',
                padding: '40px 30px',
                border: '1px solid #e5e5e5',
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
                <i className="fa fa-check-circle" style={{ 
                  fontSize: '40px', 
                  color: '#895129',
                  marginBottom: '20px'
                }}></i>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  marginBottom: '12px',
                  color: '#111',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Stripe Powered
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.7',
                  margin: 0
                }}>
                  All payments are processed by Stripe, trusted by millions of businesses worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
                Frequently Asked Questions
              </h3>

              {[
                {
                  q: 'Is my payment information secure?',
                  a: 'Yes! We use Stripe for payment processing, which means your card details are never stored on our servers. All transactions are encrypted with bank-level security.'
                },
                {
                  q: 'When will I be charged?',
                  a: 'Your card will be charged immediately when you complete your order. You will receive an email confirmation with your order details.'
                },
                {
                  q: 'What if my payment fails?',
                  a: 'If your payment fails, please check your card details and try again. If the problem persists, contact your bank or try a different card.'
                },
                {
                  q: 'Can I get a refund?',
                  a: 'Yes, refunds are available within 14 days of delivery. See our Return & Exchange policy for full details.'
                },
                {
                  q: 'Do you save my card details?',
                  a: 'No, we never store your full card details. Only Stripe securely stores your payment information if you choose to save it for future purchases.'
                }
              ].map((faq, index) => (
                <div key={index} style={{
                  marginBottom: '25px',
                  paddingBottom: '25px',
                  borderBottom: index < 4 ? '1px solid #e5e5e5' : 'none'
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
                Still have questions about payments?
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
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaymentMethods;