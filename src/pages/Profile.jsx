"use client";

import { useEffect, useState } from "react";
import {
  getUserDetails,
  changePassword,
  updateUserInfo,
} from "../api/NguoiDung";
import { Eye, EyeOff, User, Mail, Phone, Key, Save, X } from "lucide-react";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    hoTen: "",
    email: "",
    dienThoai: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getUserDetails();
        setUserDetails(data);
        setUpdatedUserDetails({
          hoTen: data.hoTen,
          email: data.email,
          dienThoai: data.dienThoai,
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      alert("Thay đổi mật khẩu thành công!");
      setShowChangePasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      alert("Thay đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin!");
    }
  };

  const handleUpdateInfo = async () => {
    console.log("Cập nhật thông tin:", updatedUserDetails);
    try {
      await updateUserInfo(updatedUserDetails);
      alert("Cập nhật thông tin thành công!");
      setShowUpdateInfoModal(false);
    } catch (error) {
      alert("Cập nhật thông tin thất bại. Vui lòng kiểm tra lại thông tin!");
    }
  };

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        <span className="ml-3 text-lg font-medium text-gray-700">
          Đang tải thông tin...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-8 bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-xl">
      <div className="flex flex-col md:flex-row items-center md:items-start w-full gap-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            <img
              src="/avatar.png"
              alt="Avatar"
              className="relative w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
            />
          </div>
          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {userDetails.hoTen}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Mã người dùng: {userDetails.maNguoiDung}
            </p>
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1 w-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-cyan-600" />
              Thông tin cá nhân
            </h2>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-cyan-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">
                    {userDetails.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-cyan-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Điện thoại</p>
                  <p className="font-medium text-gray-800">
                    {userDetails.dienThoai}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowUpdateInfoModal(true)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 flex items-center justify-center"
              >
                <User className="w-4 h-4 mr-2" />
                Cập nhật thông tin
              </button>
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 flex items-center justify-center"
              >
                <Key className="w-4 h-4 mr-2" />
                Thay đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Key className="w-5 h-5 mr-2 text-cyan-600" />
                Thay đổi mật khẩu
              </h2>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhập lại mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Info Modal */}
      {showUpdateInfoModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <User className="w-5 h-5 mr-2 text-cyan-600" />
                Cập nhật thông tin
              </h2>
              <button
                onClick={() => setShowUpdateInfoModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên
                </label>
                <input
                  type="text"
                  value={updatedUserDetails.hoTen}
                  onChange={(e) =>
                    setUpdatedUserDetails({
                      ...updatedUserDetails,
                      hoTen: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={updatedUserDetails.email}
                  onChange={(e) =>
                    setUpdatedUserDetails({
                      ...updatedUserDetails,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điện thoại
                </label>
                <input
                  type="text"
                  value={updatedUserDetails.dienThoai}
                  onChange={(e) =>
                    setUpdatedUserDetails({
                      ...updatedUserDetails,
                      dienThoai: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUpdateInfoModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateInfo}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
