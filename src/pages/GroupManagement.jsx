"use client"

import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { getDanhSachNhomPaged, addNhom, updateNhom, deleteNhom } from "../api/Nhom"
import { getSimpleProjectList } from "../api/DuAn"
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserPlus,
} from "lucide-react"

const GroupManagement = () => {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [currentGroup, setCurrentGroup] = useState({
    maNhom: "",
    tenNhom: "",
    maDuAn: "",
    trangThai: "Active",
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  // Fetch groups
  const fetchGroups = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getDanhSachNhomPaged(currentPage, 10, debouncedSearchTerm)
      setGroups(response.items || [])
      setTotalPages(response.totalPages || 1)
    } catch {
      setError("Không thể tải danh sách nhóm. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, debouncedSearchTerm])

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      const res = await getSimpleProjectList()
      setProjects(res || [])
    } catch {
      setError("Không thể tải danh sách dự án. Vui lòng thử lại sau.")
    }
  }, [])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleAddGroup = () => {
    setCurrentGroup({
      maNhom: "",
      tenNhom: "",
      maDuAn: "",
      trangThai: "Active",
    })
    setShowModal(true)
  }

  const handleEditGroup = (group) => {
    setCurrentGroup({
      maNhom: group.maNhom,
      tenNhom: group.tenNhom,
      maDuAn: group.maDuAn?.toString() || "",
      trangThai: group.trangThai || "Active",
    })
    setShowModal(true)
  }

  const handleDeleteGroup = async (maNhom) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhóm này?")) return
    try {
      await deleteNhom(maNhom)
      alert("Xóa nhóm thành công!")
      await fetchGroups()
    } catch (err) {
      console.error(err)
      alert("Xóa nhóm thất bại: " + (err.message || ""))
    }
  }

  const handleViewMembers = (maNhom) => {
    navigate(`/group-management/${maNhom}/members`)
  }

  const validateForm = () => {
    const errors = []
    if (!currentGroup.tenNhom.trim()) errors.push("Tên nhóm không được để trống")
    if (!currentGroup.maDuAn) errors.push("Vui lòng chọn dự án")
    return errors
  }

  const handleSaveGroup = async () => {
    const errs = validateForm()
    if (errs.length) {
      alert(errs.join("\n"))
      return
    }
    try {
      if (currentGroup.maNhom) {
        // update
        await updateNhom(currentGroup.maNhom, {
          tenNhom: currentGroup.tenNhom.trim(),
          maDuAn: Number.parseInt(currentGroup.maDuAn),
          trangThai: currentGroup.trangThai,
        })
        alert("Cập nhật nhóm thành công!")
      } else {
        // add
        await addNhom({
          tenNhom: currentGroup.tenNhom.trim(),
          maDuAn: Number.parseInt(currentGroup.maDuAn),
        })
        alert("Thêm nhóm thành công!")
      }
      await fetchGroups()
      setShowModal(false)
    } catch (err) {
      console.error(err)
      alert("Thao tác thất bại: " + (err.message || ""))
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="w-full mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <Users className="h-7 w-7 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhóm</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm nhóm..."
              className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <button
            onClick={handleAddGroup}
            className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Thêm Nhóm
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã nhóm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên nhóm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dự Án
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groups.length ? (
                  groups.map((g) => (
                    <tr key={g.maNhom} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{g.maNhom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{g.tenNhom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{g.tenDuAn}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {g.trangThai === "Active" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewMembers(g.maNhom)}
                            className="p-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            title="Xem thành viên"
                          >
                            <UserPlus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditGroup(g)}
                            className="p-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                            title="Sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(g.maNhom)}
                            className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-xl shadow-md">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages || isLoading}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentPage >= totalPages || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          }`}
        >
          Trang sau
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Modal for adding/editing group */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {currentGroup.maNhom ? (
                  <>
                    <Edit className="h-5 w-5 mr-2 text-blue-600" />
                    Sửa Nhóm
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
                    Thêm Nhóm Mới
                  </>
                )}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên nhóm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={currentGroup.tenNhom}
                  onChange={(e) => setCurrentGroup({ ...currentGroup, tenNhom: e.target.value })}
                  placeholder="Nhập tên nhóm"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dự án <span className="text-red-500">*</span>
                </label>
                <select
                  key={currentGroup.maDuAn}
                  value={currentGroup.maDuAn.toString()}
                  defaultChecked={currentGroup.maDuAn}
                  onChange={(e) => setCurrentGroup({ ...currentGroup, maDuAn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">-- Chọn dự án --</option>
                  {projects.map((p) => (
                    <option key={p.maDuAn} value={p.maDuAn.toString()}>
                      {p.tenDuAn}
                    </option>
                  ))}
                </select>
              </div>

              {currentGroup.maNhom && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={currentGroup.trangThai}
                    onChange={(e) => setCurrentGroup({ ...currentGroup, trangThai: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveGroup}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {currentGroup.maNhom ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupManagement
