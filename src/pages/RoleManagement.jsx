"use client"

import { useEffect, useState } from "react"
import { getChucVuPagedList, addChucVu, updateChucVu, deleteChucVu } from "../api/ChucVu"
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react"

const RoleManagement = () => {
  const [roles, setRoles] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [currentRole, setCurrentRole] = useState({
    maChucVu: "",
    tenChucVu: "",
    trangThai: "Active",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true)
      try {
        const response = await getChucVuPagedList(currentPage, 10)
        setRoles(response.items)
        setCurrentPage(response.currentPage)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chức vụ:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoles()
  }, [currentPage])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleAddRole = () => {
    setCurrentRole({ maChucVu: "", tenChucVu: "", trangThai: "Active" })
    setShowModal(true)
  }

  const handleEditRole = (role) => {
    setCurrentRole(role)
    setShowModal(true)
  }

  const handleDeleteRole = async (maChucVu) => {
    const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa chức vụ này?")
    if (!userConfirmed) {
      return // Exit if the user cancels the action
    }

    try {
      const response = await deleteChucVu(maChucVu)
      alert(response.message || "Xóa chức vụ thành công!")
      setRoles((prevRoles) => prevRoles.filter((role) => role.maChucVu !== maChucVu))
    } catch (error) {
      console.error("Lỗi khi xóa chức vụ:", error)
      alert("Xóa chức vụ thất bại. Vui lòng thử lại!")
    }
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const response = await getChucVuPagedList(1, 10, searchTerm)
      setRoles(response.items)
      setCurrentPage(response.currentPage)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Lỗi khi tìm kiếm chức vụ:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleSaveRole = async () => {
    try {
      if (!currentRole.tenChucVu) {
        alert("Tên chức vụ không được để trống!")
        return
      }

      if (currentRole.maChucVu) {
        const userConfirmed = window.confirm("Bạn có chắc chắn muốn cập nhật chức vụ này?")
        if (!userConfirmed) {
          return // Exit if the user cancels the action
        }

        // Update existing role
        const updatedRole = await updateChucVu(currentRole.maChucVu, {
          tenChucVu: currentRole.tenChucVu,
          trangThai: currentRole.trangThai,
        })
        alert("Cập nhật chức vụ thành công!")
        setRoles((prevRoles) => prevRoles.map((role) => (role.maChucVu === updatedRole.maChucVu ? updatedRole : role)))
      } else {
        // Add new role
        const newRole = await addChucVu({ tenChucVu: currentRole.tenChucVu })
        alert("Thêm chức vụ thành công!")
        setRoles((prevRoles) => [...prevRoles, newRole])
      }

      setShowModal(false)
    } catch (error) {
      console.error("Lỗi khi lưu chức vụ:", error)
      alert("Lưu chức vụ thất bại. Vui lòng thử lại!")
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        )
      case "Inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        )
    }
  }

  return (
    <div className="w-full mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <Shield className="h-7 w-7 text-cyan-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Quản lý chức vụ</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Tìm kiếm chức vụ..."
              className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-600 hover:text-purple-800"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleAddRole}
            className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Thêm chức vụ
          </button>
        </div>
      </div>

      {/* Role Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã chức vụ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên chức vụ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Không có chức vụ nào
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.maChucVu} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.maChucVu}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{role.tenChucVu}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(role.trangThai)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="p-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.maChucVu)}
                        className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-xl shadow-md">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentPage === 1 || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Trang trước
        </button>

        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Trang <span className="font-medium">{currentPage}</span> / <span className="font-medium">{totalPages}</span>
          </span>
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentPage === totalPages || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          }`}
        >
          Trang sau
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Modal for adding/editing role */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {currentRole.maChucVu ? (
                  <>
                    <Edit className="h-5 w-5 mr-2 text-purple-600" />
                    Cập nhật chức vụ
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2 text-purple-600" />
                    Thêm chức vụ mới
                  </>
                )}
              </h2>
              <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên chức vụ</label>
                <input
                  type="text"
                  name="tenChucVu"
                  value={currentRole.tenChucVu}
                  onChange={(e) => setCurrentRole({ ...currentRole, tenChucVu: e.target.value })}
                  placeholder="Nhập tên chức vụ"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  name="trangThai"
                  value={currentRole.trangThai}
                  onChange={(e) => setCurrentRole({ ...currentRole, trangThai: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRole}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {currentRole.maChucVu ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoleManagement
