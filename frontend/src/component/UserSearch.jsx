import React, { useState, useEffect } from 'react';
import axios from 'axios';



const UserSearch = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [pendingRequests, setPendingRequests] = useState([]);

 
  const searchUsers = async () => {



    try {
      const res = await axios.get(`http://localhost:5000/user/search?email=${searchEmail}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={searchUsers}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {searchResults.map(user => (
          <UserCard
            key={user._id}
            user={user}
            onConnect={() => sendConnectionRequest(user._id)}
          />
        ))}
      </div>
    </div>
  );
};

// PendingRequests Component
const PendingRequests = () => {
  const [requests, setRequests] = useState([]);

   const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/pending-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  


  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleRequest = async (requestId, status) => {
    try {
      await axios.put(`http://localhost:5000/user/connect/${requestId}`, { status },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
      <div className="space-y-3">
        {requests.map(request => (
          <div key={request._id} className="flex items-center justify-between bg-white p-3 rounded shadow">
            <div>
              <p className="font-medium">{request.from.name}</p>
              <p className="text-sm text-gray-600">{request.from.email}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRequest(request._id, 'accepted')}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => handleRequest(request._id, 'rejected')}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;