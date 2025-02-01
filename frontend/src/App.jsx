import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import UserProfile from './component/Profile';
import UserSearch from './component/UserSearch';
import ProjectDetails from './component/ProjectPage';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/search" element={<UserSearch />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/" element={<DashboardLayout />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;