"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getChucVuList, UpdateChucVu, GetCapBacChucVu } from "../api/ChucVu"
import { getEmployeeList, addEmployee, adminUpdateEmployee } from "../api/NguoiDung"
import Select from "react-select"
import { Search, UserPlus, Edit, Trash2, ChevronLeft, ChevronRight, X, Save, Users, PencilLine } from 'lucide-react'
import Swal from 'sweetalert2'

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    hoTen: "",
    email: "",
    dienThoai: "",
    matKhau: "",
    maChucVu: "",
  })
  const [updatePosition, setUpdatePosition] = useState({
    maNguoiDung: "",
    maChucVu: "",
    capBac: 0,
  })
  const [positions, setPositions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPositionDropdownEnabled, setIsPositionDropdownEnabled] = useState(false)
  const [isCapBacDisabled, setIsCapBacDisabled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true)
      try {
        const response = await getEmployeeList(currentPage, 10)
        setEmployees(response.items)
        setCurrentPage(response.currentPage)
        setTotalPages(response.totalPages)
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error)
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải danh sách nhân viên. Vui lòng thử lại!',
          confirmButtonColor: '#0891b2',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [navigate, currentPage])

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await getChucVuList()
        setPositions(data)
      } catch (error) {
        console.error("Error fetching positions:", error)
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải danh sách chức vụ. Vui lòng thử lại!',
          confirmButtonColor: '#0891b2',
        })
      }
    }

    fetchPositions()
  }, [])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const handleAddEmployee = () => setShowModal(true)

  const handleModalClose = () => {
    setShowModal(false)
    setNewEmployee({ hoTen: "", email: "", dienThoai: "", matKhau: "", maChucVu: "" })
  }

  const handlePositionModalClose = () => {
    setShowPositionModal(false)
    setUpdatePosition({ maNguoiDung: "", maChucVu: "", capBac: 0 })
    setIsPositionDropdownEnabled(false)
    setIsCapBacDisabled(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEmployee({ ...newEmployee, [name]: value })
  }

  const handlePositionChange = (selectedOption) => {
    setNewEmployee({ ...newEmployee, maChucVu: selectedOption ? selectedOption.value : "" })
  }

  const handleUpdatePositionChange = (selectedOption) => {
    setUpdatePosition({ ...updatePosition, maChucVu: selectedOption ? selectedOption.value : "" })
  }

  const handleCapBacChange = (e) => {
    const value = parseInt(e.target.value, 10)
    if (value >= 0 && value <= 5) setUpdatePosition({ ...updatePosition, capBac: value })
  }

  const handleSaveEmployee = async () => {
    try {
      await addEmployee(newEmployee)
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Thêm nhân viên thành công!',
        confirmButtonColor: '#0891b2',
        timer: 1500,
        timerProgressBar: true,
      })
      handleModalClose()
      const response = await getEmployeeList(currentPage, 10)
      setEmployees(response.items)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể thêm nhân viên. Vui lòng kiểm tra lại thông tin!',
        confirmButtonColor: '#0891b2',
      })
      console.error("Error adding employee:", error)
    }
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const response = await getEmployeeList(1, 10, searchTerm)
      setEmployees(response.items)
      setCurrentPage(response.currentPage)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error("Lỗi khi tìm kiếm nhân viên:", error)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tìm kiếm nhân viên. Vui lòng thử lại!',
        confirmButtonColor: '#0891b2',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEmployee = (employee) => {
    setNewEmployee({
      maNguoiDung: employee.maNguoiDung,
      hoTen: employee.hoTen,
      email: employee.email,
      dienThoai: employee.dienThoai,
      matKhau: "",
      maChucVu: employee.maChucVu,
    })
    setShowModal(true)
  }

  const handleEditPosition = async (employee) => {
    const currentPosition = employee.chucVu && employee.chucVu.length > 0 ? employee.chucVu[0] : ""
    const currentMaChucVu = positions.find(pos => pos.tenChucVu === currentPosition)?.maChucVu || ""
    
    try {
      const capBac = currentMaChucVu ? await GetCapBacChucVu(employee.maNguoiDung, currentMaChucVu) : 0
      setUpdatePosition({
        maNguoiDung: employee.maNguoiDung,
        maChucVu: currentMaChucVu,
        capBac: capBac,
      })
      setShowPositionModal(true)
    } catch (error) {
      console.error("Lỗi khi lấy cấp bậc chức vụ:", error)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể lấy cấp bậc chức vụ. Vui lòng thử lại!',
        confirmButtonColor: '#0891b2',
      })
      setUpdatePosition({
        maNguoiDung: employee.maNguoiDung,
        maChucVu: currentMaChucVu,
        capBac: 0,
      })
      setShowPositionModal(true)
    }
  }

  const handleUpdateEmployee = async () => {
    try {
      const { hoTen, email, dienThoai, matKhau } = newEmployee
      if (!hoTen || !email || !dienThoai) {
        Swal.fire({
          icon: 'warning',
          title: 'Thiếu thông tin',
          text: 'Vui lòng điền đầy đủ thông tin!',
          confirmButtonColor: '#0891b2',
        })
        return
      }

      const result = await Swal.fire({
        title: 'Xác nhận cập nhật',
        text: 'Bạn có chắc chắn muốn cập nhật thông tin nhân viên này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0891b2',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Hủy',
      })

      if (!result.isConfirmed) return

      const updatedEmployee = { hoTen, email, dienThoai, matKhau }
      await adminUpdateEmployee(newEmployee.maNguoiDung, updatedEmployee)
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Cập nhật nhân viên thành công!',
        confirmButtonColor: '#0891b2',
        timer: 1500,
        timerProgressBar: true,
      })
      handleModalClose()
      const response = await getEmployeeList(currentPage, 10)
      setEmployees(response.items)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể cập nhật nhân viên. Vui lòng thử lại!',
        confirmButtonColor: '#0891b2',
      })
      console.error("Error updating employee:", error)
    }
  }

  const handleUpdatePositionConfirm = async () => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận cập nhật chức vụ',
        text: 'Bạn có chắc chắn muốn cập nhật chức vụ cho nhân viên này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0891b2',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Hủy',
      })

      if (!result.isConfirmed) return

      await UpdateChucVu(updatePosition)
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Cập nhật chức vụ thành công!',
        confirmButtonColor: '#0891b2',
        timer: 1500,
        timerProgressBar: true,
      })
      handlePositionModalClose()
      const response = await getEmployeeList(currentPage, 10)
      setEmployees(response.items)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể cập nhật chức vụ. Vui lòng thử lại!',
        confirmButtonColor: '#0891b2',
      })
      console.error("Error updating position:", error)
    }
  }

  const handleEnablePositionDropdown = async () => {
    const result = await Swal.fire({
      title: 'Xác nhận thay đổi chức vụ',
      text: 'Việc thay đổi chức vụ sẽ đặt cấp bậc về 0. Bạn có muốn tiếp tục?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0891b2',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    })

    if (result.isConfirmed) {
      setIsPositionDropdownEnabled(true)
      setUpdatePosition({ ...updatePosition, capBac: 0 })
      setIsCapBacDisabled(true)
    }
  }

  const handleDeleteEmployee = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa nhân viên này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0891b2',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
      })

      if (result.isConfirmed) {
        // Placeholder for delete API call
        // await deleteEmployee(id)
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Xóa nhân viên thành công!',
          confirmButtonColor: '#0891b2',
          timer: 1500,
          timerProgressBar: true,
        })
        const response = await getEmployeeList(currentPage, 10)
        setEmployees(response.items)
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể xóa nhân viên. Vui lòng thử lại!',
        confirmButtonColor: '#0891b2',
      })
      console.error("Error deleting employee:", error)
    }
  }

  const positionOptions = positions.map((position) => ({
    value: position.maChucVu,
    label: position.tenChucVu,
  }))

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0.5rem',
      borderColor: '#e2e8f0',
      boxShadow: 'none',
      '&:hover': { borderColor: '#cbd5e0' },
      padding: '2px',
      backgroundColor: state.isDisabled ? '#f7fafc' : 'white',
      cursor: state.isDisabled ? 'not-allowed' : 'default',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : null,
      color: state.isSelected ? 'white' : '#1f2937',
    }),
  }

  return (
    <div className="w-full mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <Users className="h-7 w-7 text-cyan-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Quản lý nhân viên</h1>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Tìm kiếm nhân viên..."
              className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-600 hover:text-cyan-800"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={handleAddEmployee}
            className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center justify-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Thêm nhân viên
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã nhân viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức vụ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
                    <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Không có nhân viên nào</td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.maNguoiDung} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{employee.maNguoiDung}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{employee.hoTen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.dienThoai}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center font-bold text-cyan-800">
                      {employee.chucVu && employee.chucVu.length > 0 ? employee.chucVu.join(", ") : "—"}
                      <button
                        onClick={() => handleEditPosition(employee)}
                        className="ml-2 p-1.5 bg-white text-cyan-700 rounded-md hover:bg-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
                        title="Cập nhật chức vụ"
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.trangThai === "Lock"
                          ? "bg-red-100 text-red-800"
                          : employee.trangThai === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {employee.trangThai}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.maNguoiDung)}
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {newEmployee.maNguoiDung ? (
                  <>
                    <Edit className="h-5 w-5 mr-2 text-cyan-600" />
                    Cập nhật thông tin nhân viên
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2 text-cyan-600" />
                    Thêm nhân viên mới
                  </>
                )}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                <input
                  type="text"
                  name="hoTen"
                  value={newEmployee.hoTen}
                  onChange={handleInputChange}
                  placeholder="Nhập họ tên nhân viên"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                <input
                  type="text"
                  name="dienThoai"
                  value={newEmployee.dienThoai}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  name="matKhau"
                  value={newEmployee.maNguoiDung ? 'abc123@@' : newEmployee.matKhau}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              {!newEmployee.maNguoiDung && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                  <Select
                    options={positionOptions}
                    onChange={handlePositionChange}
                    placeholder="Chọn chức vụ"
                    styles={customSelectStyles}
                    className="w-full"
                  />
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
                onClick={newEmployee.maNguoiDung ? handleUpdateEmployee : handleSaveEmployee}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {newEmployee.maNguoiDung ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPositionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <PencilLine className="h-5 w-5 mr-2 text-cyan-600" />
                Cập nhật chức vụ
              </h2>
              <button
                onClick={handlePositionModalClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã nhân viên</label>
                <input
                  type="text"
                  value={updatePosition.maNguoiDung}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                <div className="flex items-center space-x-2">
                  <Select
                    options={positionOptions}
                    onChange={handleUpdatePositionChange}
                    value={positionOptions.find(option => option.value === updatePosition.maChucVu)}
                    placeholder="Chọn chức vụ"
                    styles={customSelectStyles}
                    className="w-full"
                    isDisabled={!isPositionDropdownEnabled}
                  />
                  <button
                    onClick={handleEnablePositionDropdown}
                    className="p-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50"
                    title="Mở khóa thay đổi chức vụ"
                  >
                    <PencilLine className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cấp bậc</label>
                <input
                  type="number"
                  value={updatePosition.capBac}
                  onChange={handleCapBacChange}
                  disabled={isCapBacDisabled}
                  min="0"
                  max="5"
                  className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all ${
                    isCapBacDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handlePositionModalClose}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdatePositionConfirm}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeManagement