import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

const TeamConnectionsPage = () => {
  const { user } = useAuth(); // Access user data from AuthContext
  const [expandedUsers, setExpandedUsers] = useState({});
  const [error, setError] = useState(null);

  if (!user) {
    return <div>Loading...</div>;
  }

  const connections = user.connections || [];
  console.log('Connections:', connections); // Debug log

  const toggleExpand = (userId) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Team Connections</h1>
      {connections.length === 0 ? (
        <p>No connections found.</p>
      ) : (
        connections.map((connection, index) => {
          // Provide default values to prevent errors
          const connectionName = connection?.name || "Unknown User";
          const connectionEmail = connection?.email || "No Email Available";
          const projectName = connection?.project?.name || "No Project Assigned";
          const projectPriority = connection?.project?.priority || "N/A";
          const projectDeadline = connection?.project?.deadline
            ? new Date(connection.project.deadline).toLocaleDateString()
            : "No Deadline";

          return (
            <motion.div
              key={`${connection._id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
                    {connectionName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium">{connectionName}</h2>
                    <p className="text-sm text-gray-500">{connectionEmail}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(connection._id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ChevronDown size={24} />
                </button>
              </div>
              <AnimatePresence>
                {expandedUsers[connection._id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <h3 className="text-lg font-semibold mb-2">Project Details:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">Project Name: {projectName}</p>
                      <p>Priority: {projectPriority}</p>
                      <p>Deadline: {projectDeadline}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </div>
  );
};

export default TeamConnectionsPage;