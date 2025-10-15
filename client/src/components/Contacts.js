import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
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
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      setContacts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/contacts/${id}`, { status });
      if (Array.isArray(contacts)) {
        setContacts(contacts.map(contact => 
          contact._id === id ? { ...contact, status } : contact
        ));
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      new: 'status-new',
      contacted: 'status-confirmed',
      resolved: 'status-completed'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredContacts = Array.isArray(contacts) ? contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  }) : [];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Modern Header */}
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            color: 'var(--gray-900)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.025em',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Patient Inquiries
          </h2>
          <p style={{ 
            color: 'var(--gray-700)',
            fontSize: '1.125rem',
            lineHeight: '1.6',
            margin: 0,
            fontWeight: '500'
          }}>
            Manage and respond to patient inquiries and consultation requests efficiently.
          </p>
        </div>
      </div>

      {/* Modern Filter and Stats */}
      <div className="card" style={{ 
        padding: '2rem', 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
        border: '1px solid var(--primary-200)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--gray-900)',
              marginBottom: '0.5rem'
            }}>
              Filter Inquiries
            </h3>
            <p style={{
              color: 'var(--gray-600)',
              fontSize: '0.875rem',
              margin: 0
            }}>
              Filter inquiries by status to manage them efficiently
            </p>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '0.5rem' : '0.75rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
            style={{ 
              fontSize: '0.875rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>📋</span>
            All ({Array.isArray(contacts) ? contacts.length : 0})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={filter === 'new' ? 'btn-primary' : 'btn-secondary'}
            style={{ 
              fontSize: '0.875rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🆕</span>
            New ({Array.isArray(contacts) ? contacts.filter(c => c.status === 'new').length : 0})
          </button>
          <button
            onClick={() => setFilter('contacted')}
            className={filter === 'contacted' ? 'btn-primary' : 'btn-secondary'}
            style={{ 
              fontSize: '0.875rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>📞</span>
            Contacted ({Array.isArray(contacts) ? contacts.filter(c => c.status === 'contacted').length : 0})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={filter === 'resolved' ? 'btn-primary' : 'btn-secondary'}
            style={{ 
              fontSize: '0.875rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>✅</span>
            Resolved ({Array.isArray(contacts) ? contacts.filter(c => c.status === 'resolved').length : 0})
          </button>
        </div>
      </div>

      {/* Modern Contacts Table */}
      <div className="card" style={{ 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
        border: '1px solid var(--primary-200)'
      }}>
        {filteredContacts.length === 0 ? (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'var(--gray-600)',
            background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)'
          }}>
            <div style={{ 
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, var(--primary-200) 0%, var(--accent-blue) 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 8px 25px rgba(30, 64, 175, 0.15)'
            }}>
              <span style={{ fontSize: '3rem' }}>📋</span>
            </div>
            <h3 style={{ 
              marginBottom: '0.75rem',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--gray-900)'
            }}>
              No inquiries found
            </h3>
            <p style={{
              fontSize: '1rem',
              color: 'var(--gray-600)',
              margin: 0,
              fontWeight: '500'
            }}>
              No patient inquiries match the current filter criteria.
            </p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact._id}>
                  <td style={{ fontWeight: '500' }}>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {contact.message}
                  </td>
                  <td>{getStatusBadge(contact.status)}</td>
                  <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {contact.status === 'new' && (
                        <button
                          onClick={() => updateContactStatus(contact._id, 'contacted')}
                          className="btn-primary"
                          style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                        >
                          Mark Contacted
                        </button>
                      )}
                      {contact.status === 'contacted' && (
                        <button
                          onClick={() => updateContactStatus(contact._id, 'resolved')}
                          className="btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Contacts;
