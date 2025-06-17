import { useEffect, useState } from "react"
import { getUserDetails, changePassword, updateUserInfo } from "../api/NguoiDung"
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Key,
  Save,
  X,
  Briefcase,
  Calendar,
  Award,
  Edit3,
  Shield,
  CheckCircle,
} from "lucide-react"
import { showSuccess, showError } from "../utils/notifications"

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [updatedUserDetails, setUpdatedUserDetails] = useState({
    hoTen: "",
    email: "",
    dienThoai: "",
  })

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getUserDetails()
        setUserDetails(data)
        setUpdatedUserDetails({
          hoTen: data.hoTen,
          email: data.email,
          dienThoai: data.dienThoai,
        })
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error)
        showError("Lỗi", "Không thể tải thông tin người dùng. Vui lòng thử lại!")
      }
    }

    fetchUserDetails()
  }, [])

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      showError("Lỗi", "Mật khẩu mới và xác nhận mật khẩu không khớp!")
      return
    }

    try {
      await changePassword({ currentPassword, newPassword })
      showSuccess("Thành công", "Thay đổi mật khẩu thành công!")
      setShowChangePasswordModal(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    } catch (error) {
      showError("Lỗi", "Thay đổi mật khẩu thất bại. Vui lòng kiểm tra lại thông tin!")
    }
  }

  const handleUpdateInfo = async () => {
    try {
      await updateUserInfo(updatedUserDetails)
      setUserDetails({
        ...userDetails,
        hoTen: updatedUserDetails.hoTen,
        email: updatedUserDetails.email,
        dienThoai: updatedUserDetails.dienThoai,
      })
      showSuccess("Thành công", "Cập nhật thông tin thành công!")
      setShowUpdateInfoModal(false)
    } catch (error) {
      showError("Lỗi", "Cập nhật thông tin thất bại. Vui lòng kiểm tra lại thông tin!")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-cyan-600 absolute top-0 left-0"></div>
          </div>
          <span className="text-lg font-medium text-gray-700">Đang tải thông tin...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full py-2 px-2">
      <div className="w-full h-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin và cài đặt tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full opacity-75 blur-sm"></div>
                  <div className="relative">
                    <img
                      src="/avatar.png"
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">{userDetails.hoTen}</h2>
                <p className="text-gray-500 text-sm mb-4 bg-gray-50 px-3 py-1 rounded-full inline-block">
                  ID: {userDetails.maNguoiDung}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-gray-700">Cấp bậc:</span>
                    <span className="font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      {userDetails.capBac}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">Chức vụ:</span>
                    <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {userDetails.chucVu}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">Ngày vào:</span>
                    <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {formatDate(userDetails.ngayVaoCongTy)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="w-6 h-6 mr-3 text-cyan-600" />
                  Thông tin liên hệ
                </h3>
                <button
                  onClick={() => setShowUpdateInfoModal(true)}
                  className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Chỉnh sửa</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 group-hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                      <p className="text-gray-900 font-semibold break-all">{userDetails.email}</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 group-hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">Điện thoại</p>
                      <p className="text-gray-900 font-semibold">{userDetails.dienThoai}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Shield className="w-6 h-6 mr-3 text-red-600" />
                  Bảo mật tài khoản
                </h3>
              </div>

              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Mật khẩu</h4>
                    <p className="text-gray-600 text-sm">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản của bạn</p>
                  </div>
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300 flex items-center space-x-2"
                  >
                    <Key className="w-4 h-4" />
                    <span className="font-medium">Đổi mật khẩu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Thay đổi mật khẩu</h2>
                </div>
                <button
                  onClick={() => setShowChangePasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex space-x-3">
                <button
                  onClick={() => setShowChangePasswordModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleChangePassword}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateInfoModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Cập nhật thông tin</h2>
                </div>
                <button
                  onClick={() => setShowUpdateInfoModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    disabled="true"
                    value={updatedUserDetails.hoTen}
                    onChange={(e) =>
                      setUpdatedUserDetails({
                        ...updatedUserDetails,
                        hoTen: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ email</label>
                  <input
                    type="email"
                    value={updatedUserDetails.email}
                    onChange={(e) =>
                      setUpdatedUserDetails({
                        ...updatedUserDetails,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="text"
                    value={updatedUserDetails.dienThoai}
                    onChange={(e) =>
                      setUpdatedUserDetails({
                        ...updatedUserDetails,
                        dienThoai: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>

              <div className="mt-8 flex space-x-3">
                <button
                  onClick={() => setShowUpdateInfoModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleUpdateInfo}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile