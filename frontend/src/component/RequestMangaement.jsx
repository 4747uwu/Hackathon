import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  UserPlus, 
  Users, 
  Bell, 
  Check, 
  X, 
  Search,
  ChevronDown,
  Mail 
} from 'lucide-react';

const RequestManagement = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    console.log('token:', localStorage.getItem('token'));
    try {
      const response = await axios.get('http://localhost:5000/invites', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials:true
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
        
     },
     withCredentials:true
      });
      const pending = response.data.filter(request => request.status === 'pending');
      
      setPendingRequests(pending);
    } catch (error) {
      showNotification('Error fetching requests', 'error');
    }
  };

  // Search users
  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/users?email=${searchQuery}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials:true
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
       withCredentials:true

      });
      setAllUsers(response.data);
    } catch (error) {
      showNotification('Error searching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle request actions
  const handleRequest = async (inviteId, action) => {
    console.log('Handling request:', inviteId, action);
    try {
      const response = await axios.put(
        `http://localhost:5000/invite/${action}/${inviteId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },withCredentials:true},
  
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         withCredentials:true
       }
      );
      showNotification(`Request ${action}ed successfully!`, 'success');
      // Update the pending requests state
      setPendingRequests(prevRequests => prevRequests.filter(request => request._id !== inviteId));
    } catch (error) {
      showNotification(`Error ${action}ing request`, 'error');
    }
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white z-50`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {['requests', 'users'].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 ${
              activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-sm transition-colors duration-200`}
          >
            {tab === 'requests' ? <Bell size={20} /> : <Users size={20} />}
            <span className="capitalize">{tab}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        {activeTab === 'requests' ? (
          // Pending Requests Section
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
            {pendingRequests.length === 0 ? (
              <motion.p 
                variants={itemVariants}
                className="text-gray-500 text-center py-8"
              >
                No pending requests
              </motion.p>
            ) : (
              pendingRequests.map((request) => (
                <motion.div
                  key={request._id}
                  variants={itemVariants}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">{request.from.name}</p>
                      <p className="text-sm text-gray-500">{request.from.email}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRequest(request._id, 'accept')}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                    >
                      <Check size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRequest(request._id, 'reject')}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          // Users Search Section
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Find Users</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                />
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                <AnimatePresence>
                  {allUsers.map((user) => (
                    <motion.div
                      key={user._id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      >
                        <UserPlus size={20} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RequestManagement;