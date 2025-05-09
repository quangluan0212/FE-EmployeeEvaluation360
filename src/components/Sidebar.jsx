import React, { useState } from "react";
import { Link } from "react-router-dom";
import { removeToken } from "../api/auth";

const Sidebar = ({ userName, roles }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/";
  };

  const isAdmin = roles.includes("Admin");
  const isLeader = roles.includes("Leader");

  return (
    <div className="h-full w-64 bg-[#002958] text-white flex flex-col">
      <div className="flex items-center justify-center p-4 border-b border-gray-700">
        <img
          src="/src/assets/logo.png"
          alt="Viet An Logo"
          className="h-10 w-auto mr-2"
        />
      </div>

      <div className="flex flex-col items-start p-4 border-b border-gray-700">
        <div className="text-left ml-4 ">
          <p className="text-sm">Xin chào,</p>
          <p className="font-bold">{userName} !!!</p>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          {/* Menu cho Admin */}
          {isAdmin && (
            <>
              <li>
                <Link
                  to="/evaluations"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Chi tiết đánh giá
                </Link>
              </li>
              <li>
                <Link
                  to="/evaluations"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Kết quả đánh giá
                </Link>
              </li>
              <li>
                <Link
                  to="/evaluations"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Đánh giá Leaders
                </Link>
              </li>
              <li>
                <Link
                  to="/role-management"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Chức vụ
                </Link>
              </li>
              <li>
                <Link
                  to="/employee-management"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Quản lý nhân viên
                </Link>
              </li>
              <li>
                <Link
                  to="/project-management"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Dự án
                </Link>
              </li>
              <li>
                <Link
                  to="/evaluations"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Nhóm
                </Link>
              </li>
            </>
          )}

          {/* Menu cho Leader */}
          {isLeader && (
            <>
              <li>
                <Link
                  to="/dashboard/evaluations"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Đánh giá chéo
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/evaluations"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Tự đánh giá
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/evaluations"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Kết quả đánh giá
                </Link>
              </li>
            </>
          )}

          {/* Menu cho các role khác */}
          {!isAdmin && !isLeader && (
            <>
              <li>
                <Link
                  to="/dashboard/evaluations"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Đánh giá chéo
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/evaluations"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Tự đánh giá
                </Link>
              </li>
            </>
          )}
          <li>
            <Link
              to="/profile"
              className="block py-2 px-4 rounded hover:bg-gray-600"
            >
              Thông tin cá nhân
            </Link>
          </li>
        </ul>
      </nav>

      {/* Nút đăng xuất */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center py-2 px-4 rounded bg-red-800 hover:bg-red-700 text-white font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 12H9m3-3l-3 3 3 3"
            />
          </svg>
          Đăng xuất
        </button>
      </div>

      {/* Xác nhận đăng xuất */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-4 text-black text-lg font-medium">
              Bạn có chắc chắn muốn đăng xuất?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Đăng xuất
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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

export default Sidebar;
