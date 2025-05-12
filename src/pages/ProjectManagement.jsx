"use client"

import { useEffect, useState } from "react"
import { getProjectList, addProject, updateProject, deleteProject } from "../api/DuAn"
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Briefcase,
  CheckCircle,
  Clock,
} from "lucide-react"

const ProjectManagement = () => {
  const [projects, setProjects] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [currentProject, setCurrentProject] = useState({
    maDuAn: "",
    tenDuAn: "",
    moTa: "",
    trangThai: "Bắt đầu",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        console.log(`Fetching projects for page: ${currentPage}, searchTerm: ${searchTerm}`)
        const response = await getProjectList(currentPage, 10, searchTerm)
        console.log("API response:", response)

        if (response.items) {
          setProjects(response.items)
          setTotalPages(response.totalPages)
        } else {
          console.error("Unexpected response format:", response)
          setProjects([])
          setTotalPages(1)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
        setProjects([])
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [currentPage, searchTerm])

  const handleAddProject = () => {
    setCurrentProject({
      maDuAn: "",
      tenDuAn: "",
      moTa: "",
      trangThai: "Bắt đầu",
    })
    setShowModal(true)
  }

  const handleEditProject = (project) => {
    setCurrentProject(project)
    setShowModal(true)
  }

  const handleDeleteProject = async (maDuAn) => {
    const userConfirmed = window.confirm("Bạn có chắc chắn muốn xóa dự án này?")
    if (!userConfirmed) return

    try {
      await deleteProject(maDuAn)
      alert("Xóa dự án thành công!")
      setProjects((prevProjects) => prevProjects.filter((p) => p.maDuAn !== maDuAn))
    } catch (error) {
      console.error("Lỗi khi xóa dự án:", error)
      alert("Xóa dự án thất bại. Vui lòng thử lại!")
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  const handleSaveProject = async () => {
    try {
      if (!currentProject.tenDuAn || !currentProject.moTa) {
        alert("Tên dự án và mô tả không được để trống!")
        return
      }

      if (currentProject.maDuAn) {
        // Cập nhật dự án
        const confirmed = window.confirm("Bạn có chắc chắn muốn cập nhật dự án này?")
        if (!confirmed) return

        const updatedProject = await updateProject(currentProject.maDuAn, {
          tenDuAn: currentProject.tenDuAn,
          moTa: currentProject.moTa,
          trangThai: currentProject.trangThai, // Trạng thái có thể thay đổi khi cập nhật
        })

        alert("Cập nhật dự án thành công!")
        setProjects((prev) => prev.map((p) => (p.maDuAn === updatedProject.maDuAn ? updatedProject : p)))
      } else {
        // Thêm dự án mới
        console.log("Sending project data:", {
          tenDuAn: currentProject.tenDuAn,
          moTa: currentProject.moTa,
        })
        const newProject = await addProject({
          tenDuAn: currentProject.tenDuAn,
          moTa: currentProject.moTa,
        })

        alert("Thêm dự án thành công!")
        const response = await getProjectList(currentPage, 10, searchTerm)
        setProjects(response.items || [])
        setTotalPages(response.totalPages || 1)
      }

      setShowModal(false)
    } catch (error) {
      console.error("Lỗi khi lưu dự án:", error)
      alert("Lưu dự án thất bại. Vui lòng thử lại!")
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Bắt đầu":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </span>
        )
      case "Kết Thúc":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="w-full mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <Briefcase className="h-7 w-7 text-cyan-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Quản lý dự án</h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Tìm kiếm dự án..."
              className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-600 hover:text-emerald-800"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleAddProject}
            className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center justify-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Thêm dự án
          </button>
        </div>
      </div>

      {/* Project Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã dự án
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên dự án
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
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
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Không có dự án nào
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.maDuAn} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.maDuAn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.tenDuAn}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="max-w-md overflow-hidden text-ellipsis">{project.moTa}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(project.trangThai)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="p-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.maDuAn)}
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

      {/* Modal for adding/editing project */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {currentProject.maDuAn ? (
                  <>
                    <Edit className="h-5 w-5 mr-2 text-emerald-600" />
                    Cập nhật dự án
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2 text-emerald-600" />
                    Thêm dự án mới
                  </>
                )}
              </h2>
              <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên dự án</label>
                <input
                  type="text"
                  value={currentProject.tenDuAn}
                  onChange={(e) =>
                    setCurrentProject({
                      ...currentProject,
                      tenDuAn: e.target.value,
                    })
                  }
                  placeholder="Nhập tên dự án"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả dự án</label>
                <textarea
                  value={currentProject.moTa}
                  onChange={(e) => setCurrentProject({ ...currentProject, moTa: e.target.value })}
                  placeholder="Nhập mô tả dự án"
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Chỉ hiển thị trường trạng thái khi cập nhật */}
              {currentProject.maDuAn && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={currentProject.trangThai}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        trangThai: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="Bắt đầu">Bắt đầu</option>
                    <option value="Kết Thúc">Kết Thúc</option>
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProject}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {currentProject.maDuAn ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectManagement
