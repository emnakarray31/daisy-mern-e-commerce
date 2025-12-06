import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useUserStore();

  const menuItems = [
    { text: 'Dashboard', icon: 'fa-tachometer', path: '/admin/dashboard' },
    { text: 'Products', icon: 'fa-cube', path: '/admin/products' },
    { text: 'Sales', icon: 'fa-tags', path: '/admin/sales' },
    { text: 'Orders', icon: 'fa-shopping-cart', path: '/admin/orders' },
    { text: 'Messages', icon: 'fa-envelope', path: '/admin/messages' },
    { text: 'Users', icon: 'fa-users', path: '/admin/users' },
    { text: 'Analytics', icon: 'fa-bar-chart', path: '/admin/analytics' },
    { text: 'Coupons', icon: 'fa-ticket', path: '/admin/coupons' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9f9f9' }}>
       
      <div
        style={{
          width: sidebarOpen ? '280px' : '0',
          background: '#fff',
          borderRight: '1px solid #e5e5e5',
          transition: 'all 0.3s',
          overflow: 'hidden',
          position: 'fixed',
          height: '100vh',
          zIndex: 100,
          display: 'flex',               
          flexDirection: 'column',     
        }}
      > 
        <div style={{
          padding: '25px',
          borderBottom: '1px solid #e5e5e5',
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#111',
              fontFamily: 'Playfair Display, serif',
            }}>
              Daisy <span style={{ color: '#e53637' }}>and</span> More
            </h2>
            <p style={{
              margin: '5px 0 0 0',
              fontSize: '12px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '600',
            }}>
              Admin Dashboard
            </p>
          </Link>
        </div>
 
        <div style={{
          padding: '25px',
          borderBottom: '1px solid #e5e5e5',
          textAlign: 'center',
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #895129 0%, #e53637 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#fff',
            fontWeight: '700',
            margin: '0 auto 15px',
            fontFamily: 'Playfair Display, serif',
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h4 style={{
            margin: '0 0 5px 0',
            fontSize: '16px',
            fontWeight: '700',
            color: '#111',
          }}>
            {user?.name}
          </h4>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Administrator
          </p>
        </div>
 
<nav
  style={{
    padding: '20px 0',
    flex: 1,                    
    overflowY: 'auto',          
    overflowX: 'hidden',
    scrollbarWidth: 'thin',
    msOverflowStyle: 'none',
  }}
   onWheel={(e) => e.stopPropagation()}  
>
  <div style={{ minHeight: '100%', paddingBottom: '20px' }}>
    {menuItems.map((item) => {
      const isActive = location.pathname.startsWith(item.path);
      return (
        <Link
          key={item.text}
          to={item.path}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '15px 25px',
            textDecoration: 'none',
            color: isActive ? '#895129' : '#6f6f6f',
            background: isActive ? '#89512910' : 'transparent',
            borderLeft: isActive ? '4px solid #895129' : '4px solid transparent',
            fontWeight: isActive ? '700' : '600',
            fontSize: '14px',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = '#f5f5f5';
              e.currentTarget.style.color = '#111';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#6f6f6f';
            }
          }}
        >
          <i
            className={`fa ${item.icon}`}
            style={{
              marginRight: '15px',
              fontSize: '18px',
              width: '20px',
              textAlign: 'center',
            }}
          ></i>
          {item.text}
        </Link>
      );
    })}
  </div>
</nav>
      </div>
 
      <div
        style={{
          marginLeft: sidebarOpen ? '280px' : '0',
          flex: 1,
          transition: 'all 0.3s',
          width: sidebarOpen ? 'calc(100% - 280px)' : '100%',
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      > 
        <div
          style={{
            background: '#fff',
            borderBottom: '1px solid #e5e5e5',
            padding: '0 30px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        > 
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#111',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '4px',
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <i className="fa fa-bars"></i>
          </button>
 
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}> 
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#6f6f6f',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '4px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.color = '#111';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6f6f6f';
              }}
            >
              <i className="fa fa-shopping-bag"></i>
              Go to Store
            </Link>
 
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #895129 0%, #e53637 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#fff',
                    fontWeight: '700',
                    fontFamily: 'Playfair Display, serif',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <i className="fa fa-chevron-down" style={{ fontSize: '12px', color: '#999' }}></i>
              </button> 
              {profileMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50px',
                    right: 0,
                    background: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    minWidth: '200px',
                    zIndex: 1000,
                  }}
                >
                  <Link
                    to="/account"
                    onClick={() => setProfileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      textDecoration: 'none',
                      color: '#111',
                      fontSize: '14px',
                      fontWeight: '600',
                      borderBottom: '1px solid #f5f5f5',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <i className="fa fa-user"></i>
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      background: 'none',
                      border: 'none',
                      color: '#e53637',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <i className="fa fa-sign-out"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
 
        <div style={{ padding: '30px', maxWidth: '100%', overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
 
      {profileMenuOpen && (
        <div
          onClick={() => setProfileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 98,
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboardLayout;