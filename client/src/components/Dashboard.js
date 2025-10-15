import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    newContacts: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    upcomingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/dashboard/stats`);
      setStats(response.data || {
        totalContacts: 0,
        newContacts: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        upcomingAppointments: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalContacts: 0,
        newContacts: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        upcomingAppointments: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Patient Inquiries',
      value: stats.totalContacts,
      icon: 'icon-inquiries',
      color: 'var(--primary)',
      link: '/contacts'
    },
    {
      title: 'New Inquiries',
      value: stats.newContacts,
      icon: 'icon-new',
      color: 'var(--info)',
      link: '/contacts'
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: 'icon-appointments',
      color: 'var(--success)',
      link: '/bookings'
    }
  ];

  return (
    <div>
      {/* Modern Dashboard Header */}
      <div style={{ 
        marginBottom: '3rem',
        padding: '2rem',
        background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
        borderRadius: '1.5rem',
        border: '1px solid var(--primary-200)',
        boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '200px',
          height: '200px',
          background: 'linear-gradient(135deg, var(--primary-200) 0%, var(--accent-blue) 100%)',
          borderRadius: '50%',
          opacity: 0.1
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '150px',
          height: '150px',
          background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--primary-300) 100%)',
          borderRadius: '50%',
          opacity: 0.1
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--gray-900)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.025em',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Dashboard Overview
          </h1>
          <p style={{ 
            color: 'var(--gray-700)',
            fontSize: '1.125rem',
            lineHeight: '1.6',
            margin: 0,
            fontWeight: '500'
          }}>
            Welcome back! Here's what's happening with your hearing clinic operations.
          </p>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile 
          ? 'repeat(auto-fit, minmax(250px, 1fr))' 
          : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: isMobile ? '1rem' : '2rem',
        marginBottom: isMobile ? '2rem' : '3rem'
      }}>
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            style={{ textDecoration: 'none' }}
          >
            <div className="card" style={{
              padding: '2rem',
              cursor: 'pointer',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
              border: '1px solid var(--primary-200)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '14px',
                    color: 'var(--gray-600)',
                    marginBottom: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {card.title}
                  </h3>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: 'var(--gray-900)',
                    lineHeight: '1',
                    margin: 0,
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {card.value}
                  </div>
                </div>
                
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)',
                  borderRadius: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 25px rgba(30, 64, 175, 0.25)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    animation: 'shimmer 3s infinite'
                  }} />
                  <span className={`icon ${card.icon}`} style={{ 
                    width: '32px', 
                    height: '32px',
                    filter: 'brightness(0) invert(1)',
                    position: 'relative',
                    zIndex: 1
                  }}></span>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '1rem',
                borderTop: '1px solid var(--primary-200)'
              }}>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--gray-500)',
                  fontWeight: '500'
                }}>
                  View Details →
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: 'var(--success)',
                    fontWeight: '600'
                  }}>
                    ↗ +12%
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Modern Quick Actions */}
      <div className="card" style={{ 
        padding: '2.5rem',
        background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
        border: '1px solid var(--primary-200)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '300px',
          height: '300px',
          background: 'linear-gradient(135deg, var(--primary-200) 0%, var(--accent-blue) 100%)',
          borderRadius: '50%',
          opacity: 0.05
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: 'var(--gray-900)',
              marginBottom: '0.75rem',
              letterSpacing: '-0.025em'
            }}>
              Quick Actions
            </h2>
            <p style={{
              color: 'var(--gray-700)',
              fontSize: '1rem',
              margin: 0,
              fontWeight: '500'
            }}>
              Manage your clinic operations efficiently with these quick access tools
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? 'repeat(auto-fit, minmax(200px, 1fr))' 
              : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: isMobile ? '1rem' : '1.5rem'
          }}>
            <Link to="/contacts" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                borderRadius: '1rem',
                color: 'var(--white)',
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                minHeight: '70px',
                boxShadow: '0 8px 25px rgba(30, 64, 175, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(30, 64, 175, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(30, 64, 175, 0.25)';
              }}>
                <span className="icon icon-inquiries" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}></span>
                <span style={{ fontSize: '16px', fontWeight: '700' }}>View Patient Inquiries</span>
              </div>
            </Link>
            
            <Link to="/bookings" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, var(--success) 0%, #059669 100%)',
                borderRadius: '1rem',
                color: 'var(--white)',
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                minHeight: '70px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.25)';
              }}>
                <span className="icon icon-appointments" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}></span>
                <span style={{ fontSize: '16px', fontWeight: '700' }}>Manage Appointments</span>
              </div>
            </Link>
            
            <Link to="/bookings" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, var(--warning) 0%, #d97706 100%)',
                borderRadius: '1rem',
                color: 'var(--white)',
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                minHeight: '70px',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(245, 158, 11, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.25)';
              }}>
                <span className="icon icon-unavailable" style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}></span>
                <span style={{ fontSize: '16px', fontWeight: '700' }}>Set Unavailable Time</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
