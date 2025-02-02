import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const socket = io('http://localhost:5000', {
  transports: ['websocket'], // Use WebSocket transport
  withCredentials: true, // Ensure cookies are sent
}); // Ensure this matches backend

const ProjectDiscussion = ({ projectId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !projectId) return;

    socket.emit('join', { projectId, userId: user._id });

    // Fetch previous messages
    fetch(`http://localhost:5000/api/projects/${projectId}/messages`)
      .then(res => res.json())
      .then(setMessages)
      .catch(err => console.error('Error loading messages:', err));

    // Listen for new messages
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [projectId, user]);

 const sendMessage = async (e) => {
  e.preventDefault();
  if (!newMessage.trim()) return;

  if (socket.connected) {
    socket.emit('sendMessage', { projectId, sender: user._id, content: newMessage });
  } else {
    console.error('Socket is not connected');
  }

  setNewMessage('');
};

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message._id} className={`flex ${message.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[70%] ${message.sender._id === user._id ? 'flex-row-reverse' : ''}`}>
              {message.sender.profileImage ? (
                <img src={message.sender.profileImage} alt={message.sender.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
              )}
              <div>
                <span className="text-xs text-gray-500">{message.sender.name}</span>
                <div className="bg-gray-100 p-2 rounded-lg">{message.content}</div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="border-t p-4 bg-white flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ProjectDiscussion;
