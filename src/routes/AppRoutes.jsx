import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import DashboardLayout from '../layouts/DashboardLayout';
import Evaluations from '../pages/Evaluations';
import EmployeeManagement from '../pages/EmployeeManagement'; 
import Profile from '../pages/Profile';
import RoleManagement from '../pages/RoleManagement';
import ProjectManagement from '../pages/ProjectManagement';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="" element={<DashboardLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/employee-management" element={<EmployeeManagement />} />
            <Route path="/role-management" element={<RoleManagement />} />
            <Route path="/project-management" element={<ProjectManagement />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;