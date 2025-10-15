import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Bookings() {
  const [appointments, setAppointments] = useState([]);
  const [surgerySlots, setSurgerySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [showSurgeryForm, setShowSurgeryForm] = useState(false);
  const [surgeryForm, setSurgeryForm] = useState({
    title: '',
    startTime: '',
    endTime: '',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, surgerySlotsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments'),
        axios.get('http://localhost:5000/api/surgery-slots')
      ]);
      setAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data : []);
      setSurgerySlots(Array.isArray(surgerySlotsRes.data) ? surgerySlotsRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setAppointments([]);
      setSurgerySlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSurgerySubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert datetime-local strings to proper Date objects
      const startTime = new Date(surgeryForm.startTime);
      const endTime = new Date(surgeryForm.endTime);
      
      await axios.post('http://localhost:5000/api/surgery-slots', {
        title: surgeryForm.title,
        startTime: startTime,
        endTime: endTime,
        description: surgeryForm.description,
        createdBy: 'admin'
      });
      setSurgeryForm({ title: '', startTime: '', endTime: '', description: '' });
      setShowSurgeryForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating surgery slot:', error);
    }
  };

  const deleteSurgerySlot = async (id) => {
    if (window.confirm('Are you sure you want to delete this surgery slot?')) {
      try {
        await axios.delete(`http://localhost:5000/api/surgery-slots/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting surgery slot:', error);
      }
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`, { status });
      if (Array.isArray(appointments)) {
        setAppointments(appointments.map(apt => 
          apt._id === id ? { ...apt, status } : apt
        ));
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const deleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      scheduled: 'status-pending',
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
            Appointment Management
          </h2>
          <p style={{ 
            color: 'var(--gray-700)',
            fontSize: '1.125rem',
            lineHeight: '1.6',
            margin: 0,
            fontWeight: '500'
          }}>
            Manage patient appointments and doctor unavailability slots efficiently.
          </p>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="card" style={{ 
        padding: '2rem', 
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
        border: '1px solid var(--primary-200)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('appointments')}
            className={activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <span>📅</span>
            Patient Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('surgery')}
            className={activeTab === 'surgery' ? 'btn-primary' : 'btn-secondary'}
            style={{
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              fontWeight: '600',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <span>🚫</span>
            Doctor Unavailable Slots ({surgerySlots.length})
          </button>
        </div>

        {activeTab === 'surgery' && (
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setShowSurgeryForm(!showSurgeryForm)}
              className="btn-primary"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{showSurgeryForm ? '❌' : '➕'}</span>
              {showSurgeryForm ? 'Cancel' : 'Book Doctor Unavailable Slot'}
            </button>
          </div>
        )}
      </div>

      {/* Modern Surgery Form */}
      {showSurgeryForm && activeTab === 'surgery' && (
        <div className="card" style={{ 
          padding: '2rem', 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
          border: '1px solid var(--primary-200)'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem', 
            color: 'var(--gray-900)',
            fontSize: '1.5rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>🚫</span>
            Book Doctor Unavailable Slot
          </h3>
          <form onSubmit={handleSurgerySubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
                <input
                  type="text"
                  value={surgeryForm.title}
                  onChange={(e) => setSurgeryForm({...surgeryForm, title: e.target.value})}
                  className="input-field"
                  placeholder="e.g., Hearing Test, Consultation"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Time</label>
                <input
                  type="datetime-local"
                  value={surgeryForm.startTime}
                  onChange={(e) => setSurgeryForm({...surgeryForm, startTime: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>End Time</label>
                <input
                  type="datetime-local"
                  value={surgeryForm.endTime}
                  onChange={(e) => setSurgeryForm({...surgeryForm, endTime: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
              <textarea
                value={surgeryForm.description}
                onChange={(e) => setSurgeryForm({...surgeryForm, description: e.target.value})}
                className="input-field"
                rows="3"
                placeholder="Additional details about the unavailability..."
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-primary">Create Unavailable Slot</button>
              <button type="button" onClick={() => setShowSurgeryForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Modern Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="card" style={{ 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
          border: '1px solid var(--primary-200)'
        }}>
          {appointments.length === 0 ? (
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
                <span style={{ fontSize: '3rem' }}>📅</span>
              </div>
              <h3 style={{ 
                marginBottom: '0.75rem',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--gray-900)'
              }}>
                No appointments found
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'var(--gray-600)',
                margin: 0,
                fontWeight: '500'
              }}>
                No patient appointments have been scheduled yet.
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Contact</th>
                  <th>Date & Time</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '500' }}>{appointment.name}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>
                        <div>{appointment.email}</div>
                        <div style={{ color: 'var(--gray-500)' }}>{appointment.phone}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{appointment.date}</div>
                        <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                          {appointment.time}
                        </div>
                      </div>
                    </td>
                    <td>Hearing Consultation</td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                            className="btn-primary"
                            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                          >
                            Confirm
                          </button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                            className="btn-secondary"
                            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => deleteAppointment(appointment._id)}
                          className="btn-danger"
                          style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modern Surgery Slots Tab */}
      {activeTab === 'surgery' && (
        <div className="card" style={{ 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--white) 0%, var(--primary-50) 100%)',
          border: '1px solid var(--primary-200)'
        }}>
          {surgerySlots.length === 0 ? (
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
                <span style={{ fontSize: '3rem' }}>🚫</span>
              </div>
              <h3 style={{ 
                marginBottom: '0.75rem',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--gray-900)'
              }}>
                No unavailable slots
              </h3>
              <p style={{
                fontSize: '1rem',
                color: 'var(--gray-600)',
                margin: 0,
                fontWeight: '500'
              }}>
                No doctor unavailability slots have been set yet.
              </p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {surgerySlots.map((slot) => (
                  <tr key={slot._id}>
                    <td style={{ fontWeight: '500' }}>{slot.title}</td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>
                        {new Date(slot.startTime).toLocaleDateString()}
                      </div>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>
                        {new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>
                        {new Date(slot.endTime).toLocaleDateString()}
                      </div>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>
                        {new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td>{slot.description || '-'}</td>
                    <td>
                      <button
                        onClick={() => deleteSurgerySlot(slot._id)}
                        className="btn-danger"
                        style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Bookings;
