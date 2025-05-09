import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getToken, getUserRolesFromToken } from '../api/auth';

const DashboardLayout = () => {
  // Lấy token từ localStorage
  const token = getToken();

  // Lấy thông tin người dùng và vai trò từ token
    const userName = localStorage.getItem("userName");
    const roles = token ? getUserRolesFromToken(token) : [];


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar userName={userName} roles={roles} />

      {/* Nội dung chính */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;