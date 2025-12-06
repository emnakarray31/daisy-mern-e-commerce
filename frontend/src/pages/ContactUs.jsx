import { useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from '../lib/axios';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/contact', formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
 
      <section 
        className="breadcrumb-option" 
        style={{ 
          padding: '40px 0',                  
          background: 'linear-gradient(135deg, #e53637 0%, #ca2829 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>

        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4 style={{ 
                  fontSize: '34px', 
                  fontWeight: '800',
                  marginBottom: '8px',
                  color: '#ffffff',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase'
                }}>
                  Contact Us
                </h4>
                <div className="breadcrumb__links" style={{ fontSize: '16px' }}>
                  <a 
                    href="/" 
                    style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.9}
                  >
                    Home
                  </a>
                  <span style={{ margin: '0 12px', color: '#ffffff', opacity: 0.7 }}>→</span>
                  <span style={{ color: '#d4a574', fontWeight: '700' }}>
                    Contact
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      <section style={{ padding: '90px 0', background: '#ffffff' }}>
        <div className="container">
          <div className="row">
 
            <div className="col-lg-4">
              <div style={{ position: 'sticky', top: '120px' }}>
                <h3 style={{
                  fontSize: '26px',
                  fontWeight: '800',
                  marginBottom: '25px',
                  color: '#111111',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px'
                }}>
                  Get In Touch
                </h3>
                <p style={{ fontSize: '15px', color: '#6f6f6f', lineHeight: '1.8', marginBottom: '40px' }}>
                  Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>

                <div>
                
                  <div style={{ paddingBottom: '30px', borderBottom: '1px solid #eeeeee', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                      <i className="fa fa-map-marker-alt" style={{ color: '#e53637', fontSize: '20px', marginTop: '4px' }}></i>
                      <div>
                        <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Address</h5>
                        <p style={{ fontSize: '15px', color: '#6f6f6f', margin: 0, lineHeight: '1.7' }}>
                          La Soukra<br />Tunis, Tunisia
                        </p>
                      </div>
                    </div>
                  </div>
 
                  <div style={{ paddingBottom: '30px', borderBottom: '1px solid #eeeeee', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                      <i className="fa fa-envelope" style={{ color: '#895129', fontSize: '20px', marginTop: '4px' }}></i>
                      <div>
                        <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Email</h5>
                        <a href="mailto:support@daisyandmore.com" style={{ fontSize: '15px', color: '#6f6f6f', textDecoration: 'none' }}
                          onMouseEnter={(e) => e.target.style.color = '#e53637'}
                          onMouseLeave={(e) => e.target.style.color = '#6f6f6f'}>
                          support@daisyandmore.com
                        </a>
                      </div>
                    </div>
                  </div>
 
                  <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', marginBottom: '30px' }}>
                    <i className="fa fa-phone" style={{ color: '#e53637', fontSize: '20px', marginTop: '4px' }}></i>
                    <div>
                      <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Phone</h5>
                      <p style={{ fontSize: '15px', color: '#6f6f6f', margin: 0 }}>+216 12 312 123</p>
                    </div>
                  </div>

                   <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                    <i className="fa fa-clock" style={{ color: '#895129', fontSize: '20px', marginTop: '4px' }}></i>
                    <div>
                      <h5 style={{ fontSize: '13px', fontWeight: '700', color: '#111111', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Business Hours</h5>
                      <p style={{ fontSize: '15px', color: '#6f6f6f', margin: 0, lineHeight: '1.7' }}>
                        Mon – Fri: 9:00 – 18:00<br />
                        Saturday: 10:00 – 16:00<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

             <div className="col-lg-8">
              <div style={{
                background: '#ffffff',
                padding: '60px',
                boxShadow: '0 15px 45px rgba(0,0,0,0.04)',
                border: '1px solid #f0f0f0'
              }}>
                <h3 style={{
                  fontSize: '26px',
                  fontWeight: '800',
                  marginBottom: '12px',
                  color: '#111111',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px'
                }}>
                  Send Message
                </h3>
                <p style={{ fontSize: '15px', color: '#6f6f6f', marginBottom: '45px' }}>
                  Your email address will not be published. Required fields are marked *
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6 mb-4">
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Name *" 
                        style={{ width: '100%', padding: '16px 20px', border: '1px solid #e5e5e5', fontSize: '15px', background: '#fff', transition: 'all 0.3s' }}
                        onFocus={(e) => e.target.style.borderColor = '#e53637'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e5e5'} />
                    </div>
                    <div className="col-lg-6 mb-4">
                      <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email *" 
                        style={{ width: '100%', padding: '16px 20px', border: '1px solid #e5e5e5', fontSize: '15px', background: '#fff', transition: 'all 0.3s' }}
                        onFocus={(e) => e.target.style.borderColor = '#e53637'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e5e5'} />
                    </div>
                    <div className="col-lg-12 mb-4">
                      <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Subject *" 
                        style={{ width: '100%', padding: '16px 20px', border: '1px solid #e5e5e5', fontSize: '15px', background: '#fff', transition: 'all 0.3s' }}
                        onFocus={(e) => e.target.style.borderColor = '#e53637'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e5e5'} />
                    </div>
                    <div className="col-lg-12 mb-4">
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows="8" placeholder="Message *"
                        style={{ width: '100%', padding: '16px 20px', border: '1px solid #e5e5e5', fontSize: '15px', background: '#fff', resize: 'vertical', transition: 'all 0.3s' }}
                        onFocus={(e) => e.target.style.borderColor = '#e53637'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}></textarea>
                    </div>
                    <div className="col-lg-12">
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          background: loading ? '#cccccc' : '#e53637',
                          color: '#ffffff',
                          padding: '16px 50px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '2px',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.4s',
                          boxShadow: '0 8px 20px rgba(229, 54, 55, 0.25)'
                        }}
                        onMouseEnter={(e) => !loading && (e.target.style.background = '#ca2829')}
                        onMouseLeave={(e) => !loading && (e.target.style.background = '#e53637')}
                      >
                        {loading ? 'SENDING...' : 'SEND MESSAGE'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

       <section style={{ padding: 0 }}>
        <div style={{ position: 'relative', height: '550px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102876.95323651607!2d10.098433969999998!3d36.806389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f5e7ef543%3A0xd671924e714a0275!2sTunis%2C%20Tunisia!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"            width="100%"
            height="550"
            style={{ border: 0, filter: 'grayscale(10%)' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Daisy & More – La Soukra"
          ></iframe>

          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffffff',
            padding: '25px 50px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
            textAlign: 'center',
            borderRadius: '4px'
          }}>
            <i className="fa fa-map-marker-alt" style={{ fontSize: '28px', color: '#e53637', marginBottom: '12px', display: 'block' }}></i>
            <h5 style={{ fontSize: '17px', fontWeight: '800', color: '#111111', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Visit Our Store
            </h5>
            <p style={{ fontSize: '14px', color: '#6f6f6f', margin: 0 }}>
              La Soukra, Tunis, Tunisia
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactUs;