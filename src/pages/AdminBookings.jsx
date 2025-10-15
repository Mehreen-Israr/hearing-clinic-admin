// src/pages/AdminBookings.jsx
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, Mail, Phone, Plus, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    reason: '',
    duration: 60
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(booking =>
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.time.includes(searchTerm) ||
      booking.date.includes(searchTerm)
    );
    setFilteredBookings(filtered);
  }, [searchTerm, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/appointments');
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.data);
        setFilteredBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const addUnavailableSlot = async () => {
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSlot,
          name: 'Doctor Unavailable',
          email: 'admin@hearingclinic.pk',
          phone: 'N/A',
          isUnavailable: true
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowAddSlotModal(false);
        setNewSlot({ date: '', time: '', reason: '', duration: 60 });
        fetchBookings();
      }
    } catch (error) {
      console.error('Error adding unavailable slot:', error);
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const response = await fetch(`/api/appointments/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          setBookings(bookings.filter(booking => booking._id !== id));
          setFilteredBookings(filteredBookings.filter(booking => booking._id !== id));
        }
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-xl border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
              <p className="text-gray-600 text-lg">Manage all patient appointments and doctor availability</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddSlotModal(true)}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span className="font-medium">Mark Unavailable</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search bookings by name, email, time, or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg shadow-lg"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-2">
                <span className="text-sm font-semibold text-blue-700">
                  {filteredBookings.length} bookings found
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading bookings...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-blue-100">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <tr>
                    <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {filteredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-blue-50 transition-all duration-200 ${booking.isUnavailable ? 'bg-red-50 hover:bg-red-100' : 'hover:shadow-md'}`}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center shadow-lg ${
                              booking.isUnavailable ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                            }`}>
                              <span className={`text-lg font-bold text-white`}>
                                {booking.isUnavailable ? 'D' : booking.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-semibold text-gray-900">
                              {booking.isUnavailable ? 'Doctor Unavailable' : booking.name}
                            </div>
                            {!booking.isUnavailable && (
                              <>
                                <div className="text-sm text-gray-600 flex items-center mt-1">
                                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                                  {booking.email}
                                </div>
                                <div className="text-sm text-gray-600 flex items-center mt-1">
                                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                                  {booking.phone}
                                </div>
                              </>
                            )}
                            {booking.isUnavailable && booking.reason && (
                              <div className="text-sm text-red-600">
                                {booking.reason}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(booking.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.isUnavailable 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {booking.isUnavailable ? 'Unavailable' : 'Scheduled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => deleteBooking(booking._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Unavailable Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Mark Doctor Unavailable</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    value={newSlot.time}
                    onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Surgery, Conference, Personal"
                    value={newSlot.reason}
                    onChange={(e) => setNewSlot({ ...newSlot, reason: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <select
                    value={newSlot.duration}
                    onChange={(e) => setNewSlot({ ...newSlot, duration: parseInt(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                    <option value={240}>4 hours</option>
                    <option value={480}>8 hours (Full day)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddSlotModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addUnavailableSlot}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Mark Unavailable
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;