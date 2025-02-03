import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import UserProfile from './component/Profile';
import UserSearch from './component/UserSearch';
import ProjectDetails from './component/ProjectPage';
import Request from './pages/Requests';
import TeamConnectionsPage from './pages/TeamConnectionsPage';
import LandingPage from './pages/LandingPage';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/search" element={<UserSearch />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/requests" element={<Request />} />
        <Route path="/connections" element={<TeamConnectionsPage />} />
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/" element={<DashboardLayout />} />  */}
      </Routes>
    </Router>
  );
}

export default App;