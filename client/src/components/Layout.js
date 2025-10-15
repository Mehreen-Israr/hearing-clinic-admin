import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'icon-dashboard' },
    { path: '/contacts', label: 'Patient Inquiries', icon: 'icon-inquiries' },
    { path: '/bookings', label: 'Appointments', icon: 'icon-appointments' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Modern Sidebar */}
      <div style={{
        width: isMobile ? '100%' : '280px',
        background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%)',
        borderRight: '1px solid var(--primary-200)',
        display: sidebarOpen ? 'block' : 'none',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        overflowY: 'auto',
        boxShadow: '4px 0 20px rgba(30, 64, 175, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ padding: '2rem 1.5rem' }}>
          {/* Mobile Close Button */}
          {isMobile && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginBottom: '1rem' 
            }}>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'var(--white)',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                ×
              </button>
            </div>
          )}

          {/* Modern Logo Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '3rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-100) 100%)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginRight: '1rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              🏥
            </div>
            <div>
              <h2 style={{
                fontSize: '1.375rem',
                fontWeight: '800',
                color: 'var(--white)',
                margin: 0,
                letterSpacing: '-0.025em'
              }}>
                Hearing Clinic
              </h2>
              <p style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                fontWeight: '500'
              }}>
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Modern Navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  borderRadius: '1rem',
                  textDecoration: 'none',
                  color: location.pathname === item.path ? 'var(--white)' : 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: location.pathname === item.path 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'transparent',
                  fontWeight: location.pathname === item.path ? '700' : '500',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  backdropFilter: location.pathname === item.path ? 'blur(10px)' : 'none',
                  border: location.pathname === item.path 
                    ? '1px solid rgba(255, 255, 255, 0.3)' 
                    : '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'var(--white)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                {location.pathname === item.path && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '24px',
                    background: 'linear-gradient(180deg, var(--accent-blue) 0%, var(--white) 100%)',
                    borderRadius: '0 2px 2px 0'
                  }} />
                )}
                <span className={`icon ${item.icon}`} style={{ 
                  marginRight: '1rem', 
                  width: '24px', 
                  height: '24px',
                  display: 'inline-block',
                  filter: 'brightness(0) invert(1)',
                  opacity: location.pathname === item.path ? '1' : '0.8'
                }}></span>
                <span style={{ fontSize: '15px', fontWeight: 'inherit' }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && isMobile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen && !isMobile ? '280px' : '0',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Modern Header */}
        <header style={{
          background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
          borderBottom: '1px solid var(--primary-200)',
          padding: isMobile ? '1rem' : '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '0.5rem' : '0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: isMobile ? '1' : 'none' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                backgroundColor: 'var(--primary)',
                border: 'none',
                fontSize: isMobile ? '1rem' : '1.25rem',
                cursor: 'pointer',
                marginRight: isMobile ? '0.75rem' : '1.5rem',
                color: 'var(--white)',
                padding: isMobile ? '0.5rem' : '0.75rem',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(30, 64, 175, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.25)';
              }}
            >
              ☰
            </button>
            <div>
              <h1 style={{
                fontSize: isMobile ? '1.25rem' : '1.75rem',
                fontWeight: '800',
                color: 'var(--gray-900)',
                margin: 0,
                letterSpacing: '-0.025em'
              }}>
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              {!isMobile && (
                <p style={{
                  fontSize: '0.875rem',
                  color: 'var(--gray-600)',
                  margin: '0.25rem 0 0 0',
                  fontWeight: '500'
                }}>
                  Manage your clinic operations efficiently
                </p>
              )}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? '0.5rem' : '1rem',
            flexWrap: isMobile ? 'wrap' : 'nowrap'
          }}>
            {!isMobile && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '1rem',
                border: '1px solid var(--primary-200)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--white)',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginRight: '0.75rem',
                  boxShadow: '0 4px 12px rgba(30, 64, 175, 0.25)'
                }}>
                  {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--gray-900)',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    {user?.username || 'Admin User'}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--gray-600)',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    {user?.role || 'Administrator'}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{ 
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.25rem',
                borderRadius: '0.75rem'
              }}
            >
              {isMobile ? 'Logout' : 'Logout'}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ 
          padding: isMobile ? '1rem' : '2rem',
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--primary-50) 100%)',
          minHeight: 'calc(100vh - 80px)'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
