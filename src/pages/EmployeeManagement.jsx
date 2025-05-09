import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChucVuList } from "../api/ChucVu";
import { getEmployeeList, addEmployee, adminUpdateEmployee } from "../api/NguoiDung";
import Select from "react-select";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    hoTen: "",
    email: "",
    dienThoai: "",
    matKhau: "",
    maChucVu: "",
  });
  const [positions, setPositions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployeeList(currentPage, 10);
        setEmployees(response.items);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
      }
    };

    fetchEmployees();
  }, [navigate, currentPage]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await getChucVuList();
        setPositions(data);
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    fetchPositions();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddEmployee = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewEmployee({
      hoTen: "",
      email: "",
      dienThoai: "",
      matKhau: "",
      maChucVu: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handlePositionChange = (selectedOption) => {
    setNewEmployee({
      ...newEmployee,
      maChucVu: selectedOption ? selectedOption.value : "",
    });
  };

  const handleSaveEmployee = async () => {
    try {
      await addEmployee(newEmployee);
      alert("Thêm nhân viên thành công!");
      handleModalClose();
    } catch (error) {
      alert("Lỗi khi thêm nhân viên!");
      console.error("Error adding employee:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await getEmployeeList(currentPage, 10, searchTerm);
      setEmployees(response.items);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm nhân viên:", error);
    }
  };

  const handleEditEmployee = (employee) => {
    setNewEmployee({
      maNguoiDung: employee.maNguoiDung,
      hoTen: employee.hoTen,
      email: employee.email,
      dienThoai: employee.dienThoai,
      matKhau: '', // Leave password empty for security reasons
      maChucVu: employee.maChucVu,
    });
    setShowModal(true);
  };

  const handleUpdateEmployee = async () => {
    try {
      const { hoTen, email, dienThoai, matKhau} = newEmployee;
      if (!newEmployee.hoTen || !newEmployee.email || !newEmployee.dienThoai) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
      }
      
      const userConfirmed = window.confirm('Bạn có chắc chắn muốn cập nhật thông tin nhân viên này?');
      if (!userConfirmed) {
        return; // Exit if the user cancels the action
      }
  
      const updatedEmployee = {
        hoTen,
        email,
        dienThoai,
        matKhau,
      }

      await adminUpdateEmployee(newEmployee.maNguoiDung, updatedEmployee);
      alert('Cập nhật nhân viên thành công!');
      handleModalClose();     
    } catch (error) {
      alert('Lỗi khi cập nhật nhân viên!');
      console.error('Error updating employee:', error);
    }
  };

  const positionOptions = positions.map((position) => ({
    value: position.maChucVu,
    label: position.tenChucVu,
  }));

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý nhân viên</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nhân viên..."
              className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleAddEmployee}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Modal for adding employee */}
      {showModal && !newEmployee.maNguoiDung && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Thêm nhân viên</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="hoTen"
                value={newEmployee.hoTen}
                onChange={handleInputChange}
                placeholder="Họ tên"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="dienThoai"
                value={newEmployee.dienThoai}
                onChange={handleInputChange}
                placeholder="Điện thoại"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="matKhau"
                value={newEmployee.matKhau}
                onChange={handleInputChange}
                placeholder="Mật khẩu"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Select
                options={positionOptions}
                onChange={handlePositionChange}
                placeholder="Chọn chức vụ"
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={newEmployee.maNguoiDung ? handleUpdateEmployee : handleSaveEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {newEmployee.maNguoiDung ? 'Cập nhật' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for updating employee */}
      {showModal && newEmployee.maNguoiDung && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Cập nhật thông tin nhân viên</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="hoTen"
                value={newEmployee.hoTen}
                onChange={handleInputChange}
                placeholder="Họ tên"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="dienThoai"
                value={newEmployee.dienThoai}
                onChange={handleInputChange}
                placeholder="Điện thoại"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="matKhau"
                value={'abc123@@'}
                onChange={handleInputChange}
                placeholder="Mật khẩu"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateEmployee}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Mã nhân viên</th>
            <th className="py-2 px-4 border-b text-left">Họ tên</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Điện thoại</th>
            <th className="py-2 px-4 border-b text-left">Chức vụ</th>{" "}
            <th className="py-2 px-4 border-b text-left">Trạng thái</th>
            <th className="py-2 px-4 border-b text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.maNguoiDung}>
              <td className="py-2 px-4 border-b">{employee.maNguoiDung}</td>
              <td className="py-2 px-4 border-b">{employee.hoTen}</td>
              <td className="py-2 px-4 border-b">{employee.email}</td>
              <td className="py-2 px-4 border-b">{employee.dienThoai}</td>
              <td className="py-2 px-4 border-b">
                {employee.chucVu && employee.chucVu.length > 0
                  ? employee.chucVu.join(", ")
                  : "—"}
              </td>
              <td
                className={`py-2 px-4 border-b ${
                  employee.trangThai === "Lock"
                    ? "text-red-500"
                    : employee.trangThai === "Active"
                    ? "text-green-500"
                    : ""
                }`}
              >
                {employee.trangThai}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.maNguoiDung)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default EmployeeManagement;
