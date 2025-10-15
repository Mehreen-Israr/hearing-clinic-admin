// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, TrendingUp, Eye, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalBookings: 0,
    todayBookings: 0,
    pendingBookings: 0
  });

  const [recentContacts, setRecentContacts] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch contacts
      const contactsResponse = await fetch('/api/contacts');
      const contactsData = await contactsResponse.json();
      
      // Fetch bookings
      const bookingsResponse = await fetch('/api/appointments');
      const bookingsData = await bookingsResponse.json();

      if (contactsData.success) {
        setRecentContacts(contactsData.data.slice(0, 5));
        setStats(prev => ({ ...prev, totalContacts: contactsData.data.length }));
      }

      if (bookingsData.success) {
        setRecentBookings(bookingsData.data.slice(0, 5));
        setStats(prev => ({ ...prev, totalBookings: bookingsData.data.length }));
        
        // Calculate today's bookings
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookingsData.data.filter(booking => 
          booking.date === today
        );
        setStats(prev => ({ ...prev, todayBookings: todayBookings.length }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-xl border-b border-blue-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg">Hearing Clinic Islamabad Management System</p>
            </div>
            <div className="flex items-center space-x-4 bg-blue-50 rounded-xl px-4 py-2">
              <div className="text-sm text-blue-600 font-medium">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Contacts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalContacts}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Active patients</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>All appointments</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 mb-1">Today's Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayBookings}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <Clock className="w-4 h-4 mr-1" />
              <span>Scheduled today</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Awaiting confirmation</span>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Contacts */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Users className="w-6 h-6 mr-3" />
                Recent Contacts
              </h3>
              <p className="text-blue-100 text-sm mt-1">Latest patient inquiries</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentContacts.map((contact, index) => (
                  <motion.div
                    key={contact._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.email}</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-1">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700 font-medium">{contact.phone}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Calendar className="w-6 h-6 mr-3" />
                Recent Bookings
              </h3>
              <p className="text-green-100 text-sm mt-1">Latest appointments</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{booking.name}</p>
                      <p className="text-sm text-gray-600">{booking.time} - {booking.date}</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-1">
                      <Mail className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700 font-medium">{booking.email}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;