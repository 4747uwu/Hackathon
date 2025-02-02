import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Users, Briefcase, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Camera, Edit2, Check, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { use } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
const UserProfile = () => {

    const { user } = useAuth();
    console.log('User:', user); // Debug log
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug log


    //editing features
    const [isEditing, setIsEditing] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
        useEffect(() => {
        const fetchPendingRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5000/invites', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setPendingRequests(response.data); 
            console.log('Pending Requests:', response.data); // Debug log
            // Assuming the response has a field with the array of invites
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
        };

        fetchPendingRequests();
    }, []);

  const [editedUser, setEditedUser] = useState({
    name: user.name,
    role: user.role,
    email: user.email,
    bio: user.bio || '',
  });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
   const updateUser = (updatedUser) => {
    setEditedUser(updatedUser);
  };


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch("http://localhost:5000/users/profile/profile-image", {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          updateUser({ ...user, profileImage: data.profileImage });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
      setShowImageUpload(false);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        body: JSON.stringify(editedUser)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('userRequests:', user.pendingRequests); // Debug log

        updateUser(updatedUser);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

        console.log('userRequests:', user.pendingRequests); // Debug log
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-center">
                <div className="relative group">
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    src={user.profileImage || "/api/placeholder/128/128"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white -mt-12 shadow-lg"
                  />
                  <button
                    onClick={() => setShowImageUpload(true)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                </div>
                <div className="ml-4 -mt-12">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        className="text-xl font-bold px-2 py-1 border rounded"
                      />
                      <select
                        value={editedUser.role}
                        onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
                        className="block w-full px-2 py-1 border rounded"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                      <p className="text-gray-600">{user.role}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveChanges}
                      className="mt-4 sm:mt-0 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(false)}
                      className="mt-4 sm:mt-0 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="mt-4 sm:mt-0 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </motion.button>
                )}
              </div>
            </div>

            {/* Additional Profile Information */}
            {isEditing ? (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <p className="text-gray-600">{user.bio || 'No bio added yet'}</p>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    {user.isVerified ? 'Verified Account' : 'Unverified Account'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Image Upload Modal */}
        {showImageUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Update Profile Picture</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowImageUpload(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Connections</p>
                <p className="text-xl font-semibold">{user.connections?.length || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Projects</p>
                <p className="text-xl font-semibold">{user.projects?.length || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tasks</p>
                <p className="text-xl font-semibold">{user.tasks?.length || 0}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Section */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
            <div className="space-y-4">
              {user.projects?.slice(0, 9).map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{project.name || 'Project Name'}</h2>     
                    <h3 className="font-medium">{project._id|| 'Project Name'}</h3>
                    
                    <p className="text-sm text-gray-600">Role: {project.role}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Active
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connection Requests Section */}
         <motion.div 
      variants={itemVariants}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
      <div className="space-y-4">
        {pendingRequests.slice(0, 4).map((request, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <img
              src={request.from.profileImage || "/api/placeholder/40/40"}
              alt="User Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium">{request.from.name}</p>
              <p className="px-3 py-1 justify-center text-center bg-blue-100 text-blue-800 rounded-full">{request.status}</p>
              <p className="text-sm text-gray-600">
                <Clock className="h-4 w-4 inline mr-1" />
                {new Date(request.timestamp).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;