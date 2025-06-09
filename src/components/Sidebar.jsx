"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  ClipboardCheck,
  ChartCandlestick,
  Users,
  Briefcase,
  CalendarRange,
  LayoutDashboard,
  UserCircle,
  LogOut,
  NotepadTextDashed,
  ChevronRight,
  Settings,
  UserCheck,
  Group,
  Menu,
} from "lucide-react";
import { removeToken } from "../api/auth";

const EnhancedSidebar = ({ userName, roles }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/";
  };

  const isAdmin = roles.includes("Admin");
  const isLeader = roles.includes("Leader");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`h-full ${
        collapsed ? "w-16" : "w-64"
      } bg-[#002958] text-white flex flex-col transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <img
            src="/logo-header.png"
            alt="Viet An Logo"
            className="h-10 w-auto"
          />
        )}
        <button
          onClick={toggleSidebar}
          className={`text-white hover:bg-blue-800 rounded-full p-1 ${
            collapsed ? "mx-auto" : "ml-auto"
          }`}
        >
          <Menu size={20} />
        </button>
      </div>

      {!collapsed && (
        <div className="flex flex-col items-start p-4 border-b border-gray-700">
          <div className="text-left ml-4">
            <p className="text-sm">Xin chào,</p>
            <p className="font-bold">{userName} !!!</p>
          </div>
        </div>
      )}

      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {/* Menu cho Admin */}
          {isAdmin && (
            <>
              <SidebarItem
                to="/admin-dashboard"
                icon={<LayoutDashboard size={20} />}
                text="Dashboard"
                collapsed={collapsed}
              />
              <SidebarItem 
                to="/evaluation-period-management"
                icon={<CalendarRange size={20} />}
                text="Đợt đánh giá"
                collapsed={collapsed}
              />
              <SidebarItem
                to="/evaluation-template-management"
                icon={<NotepadTextDashed size={20} />}
                text="Mẫu đánh giá"
                collapsed={collapsed}
              />
              <SidebarItem
                to="/admin-details-evaluation"
                icon={<BarChart3 size={20} />}
                text="Chi tiết đánh giá"
                collapsed={collapsed}
              />

              <SidebarItem
                to="/admin-evaluations"
                icon={<UserCheck size={20} />}
                text="Đánh giá Leaders"
                collapsed={collapsed}
              />
              <SidebarItem
                to="/role-management"
                icon={<Settings size={20} />}
                text="Chức vụ"
                collapsed={collapsed}
              />
              <SidebarItem
                to="/employee-management"
                icon={<Users size={20} />}
                text="Quản lý nhân viên"
                collapsed={collapsed}
              />
              <SidebarItem
                to="/project-management"
                icon={<Briefcase size={20} />}
                text="Dự án"
                collapsed={collapsed}
              />
              <SidebarItem
                to="/group-management"
                icon={<Group size={20} />}
                text="Nhóm"
                collapsed={collapsed}
              />
            </>
          )}

          {/* Menu cho Leader */}
          {isLeader && (
            <>
              <SidebarItem
                to="/user-evaluations"
                icon={<ClipboardCheck size={20} />}
                text="Đánh giá"
                collapsed={collapsed}
              />
              <SidebarItem
                to="/evaluations"
                icon={<ClipboardCheck size={20} />}
                text="Kết quả đánh giá"
                collapsed={collapsed}
              />
              <SidebarItem
                to="/group-members-page"
                icon={<Group size={20} />}
                text="Nhóm"
                collapsed={collapsed}
              />
            </>
          )}

          {/* Menu cho các role khác */}
          {!isAdmin && !isLeader && (
            <>
              <SidebarItem
                to="/user-evaluations"
                icon={<ClipboardCheck size={20} />}
                text="Đánh giá"
                collapsed={collapsed}
              />
              <SidebarItem
                to="/evaluations"
                icon={<ClipboardCheck size={20} />}
                text="Kết quả đánh giá"
                collapsed={collapsed}
              />
            </>
          )}

          <SidebarItem
            to="/profile"
            icon={<UserCircle size={20} />}
            text="Thông tin cá nhân"
            collapsed={collapsed}
          />
        </ul>
      </nav>

      {/* Nút đăng xuất */}
      <div className="p-2 border-t border-gray-700">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`w-full flex items-center ${
            collapsed ? "justify-center" : "justify-start"
          } py-2 px-4 rounded bg-red-800 hover:bg-red-700 text-white font-medium transition-colors duration-200`}
        >
          <LogOut size={20} className={collapsed ? "" : "mr-2"} />
          {!collapsed && "Đăng xuất"}
        </button>
      </div>

      {/* Xác nhận đăng xuất */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-start justify-center pt-[300px] bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm mx-auto">
            <p className="mb-4 text-black text-lg font-medium">
              Bạn có chắc chắn muốn đăng xuất?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
              >
                Đăng xuất
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({ to, icon, text, collapsed }) => {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center ${
          collapsed ? "justify-center" : "justify-start"
        } py-2 px-4 rounded hover:bg-blue-800 transition-colors duration-200`}
      >
        <div className={collapsed ? "" : "mr-3"}>{icon}</div>
        {!collapsed && <span>{text}</span>}
        {!collapsed && <ChevronRight size={16} className="ml-auto" />}
      </Link>
    </li>
  );
};

export default EnhancedSidebar;
