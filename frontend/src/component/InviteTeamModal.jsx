import React, { useState, useEffect, useRef } from 'react';
import { X, Search, UserPlus, Check } from 'lucide-react';
import axios from 'axios';
import { use } from 'react';
import { useAuth } from '../context/AuthContext';

const InviteTeamModal = ({ isOpen, onClose, projectId, projectName, projectPriority, projectDeadline }) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState(new Set());
  const modalRef = useRef();
  const {token} = useAuth();
  console.log('token:', token); 

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Search users by email
  const searchUsers = async (email) => {
    if (!email.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
        console.log('token:', localStorage.getItem('token'));

    try {
      const response = await axios.get(`http://localhost:5000/users?email=${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`
       },
        withCredentials:true
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send invitation
  const sendInvite = async (userId) => {
    console.log('token:', localStorage.getItem('token'));
    try {
      await axios.post('http://localhost:5000/invite', 
         { userId, projectId, projectName, projectPriority, projectDeadline },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials:true}
      );
      setInvitedUsers(new Set([...invitedUsers, userId]));
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-md"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Invite Team Members</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Search by email..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchEmail}
              onChange={(e) => {
                setSearchEmail(e.target.value);
                searchUsers(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-60 overflow-y-auto px-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div 
                  key={user._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {/* {user.name.charAt(0)} */}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => sendInvite(user._id)}
                    disabled={invitedUsers.has(user._id)}
                    className={`p-2 rounded-lg ${
                      invitedUsers.has(user._id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {invitedUsers.has(user._id) ? (
                      <Check size={20} />
                    ) : (
                      <UserPlus size={20} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : searchEmail && (
            <p className="text-center py-4 text-gray-500">No users found</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t mt-2">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteTeamModal;