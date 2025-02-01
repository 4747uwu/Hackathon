import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectDashboard from '../component/ProjectDashboard';
import { User } from "lucide-react";
import { useAuth } from '../context/AuthContext'; // Import the AuthContext

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("projects");
  const { logout } = useAuth(); // Access logout function
  const navigate = useNavigate(); // For redirecting after logout

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect user to login page after logout
  };

  const navigationItems = [
    { id: "projects", label: "Projects", icon: "📋", path: "/projects" },
    { id: "tasks", label: "Tasks", icon: "✓", path: "/tasks" },
    { id: "team", label: "Team", icon: "👥", path: "/team" },
    { id: "analytics", label: "Analytics", icon: "📊", path: "/analytics" },
    { id: "profile", label: "Profile", icon: <User size={20} />, path: "/profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>Dashboard</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="p-4">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center p-3 mb-2 rounded-lg transition-colors
                ${currentView === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>{item.label}</span>
            </Link>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 mt-4 text-red-600 rounded-lg hover:bg-red-50"
          >
            <User size={20} />
            <span className={`ml-3 ${!sidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </nav> 
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ProjectDashboard />
      </div>
    </div>
  );
};

export default DashboardLayout;
