import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InviteUserToProject = ({ projectId }) => {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);

  // Search Users by Email
  const searchUsers = async () => {
    if (!email) return;
    try {
      const response = await axios.get(`http://localhost:5000/users?email=${email}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Send Invite
  const sendInvite = async (userId) => {
    try {
      await axios.post('http://localhost:5000/invite', { userId, projectId });
      alert('Invite sent successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending invite');
    }
  };

  // Fetch Pending Requests
  useEffect(() => {
    axios.get('http://localhost:5000/invites')
      .then(response => setPendingInvites(response.data))
      .catch(error => console.error(error));
  }, []);

  // Accept Invite
  const acceptInvite = async (inviteId) => {
    try {
      await axios.put(`http://localhost:5000/invite/accept/${inviteId}`);
      alert('Invite accepted!');
      setPendingInvites(pendingInvites.filter(invite => invite._id !== inviteId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Invite Users</h2>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        onKeyUp={searchUsers}
        placeholder="Search by email"
        className="p-2 border rounded-lg"
      />
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.email} <button onClick={() => sendInvite(user._id)}>Invite</button>
          </li>
        ))}
      </ul>

      <h3>Pending Invites</h3>
      <ul>
        {pendingInvites.map(invite => (
          <li key={invite._id}>
            {invite.from.email} - <button onClick={() => acceptInvite(invite._id)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InviteUserToProject;
