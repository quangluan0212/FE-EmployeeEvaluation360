import React, { useEffect, useState } from "react";
import { getChucVuPagedList, addChucVu, updateChucVu, deleteChucVu } from "../api/ChucVu";
import { tr } from "framer-motion/client";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState({
    maChucVu: "",
    tenChucVu: "",
    trangThai: "Active",
  });
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getChucVuPagedList(currentPage, 10);
        setRoles(response.items);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chức vụ:", error);
      }
    };

    fetchRoles();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddRole = () => {
    setCurrentRole({ maChucVu: "", tenChucVu: "", trangThai: "Active" });
    setShowModal(true);
};

  const handleEditRole = (role) => {
    setCurrentRole(role);
    setShowModal(true);
};

  const handleDeleteRole = async (maChucVu) => {
    const userConfirmed = window.confirm('Bạn có chắc chắn muốn xóa chức vụ này?');
    if (!userConfirmed) {
        return; // Exit if the user cancels the action
    }

    try {
        const response = await deleteChucVu(maChucVu);
        alert(response.message || 'Xóa chức vụ thành công!');
        setRoles((prevRoles) => prevRoles.filter((role) => role.maChucVu !== maChucVu));
    } catch (error) {
        console.error('Lỗi khi xóa chức vụ:', error);
        alert('Xóa chức vụ thất bại. Vui lòng thử lại!');
    }
};

  const handleSearch = async () => {
    try {
      const response = await getChucVuPagedList(currentPage, 10, searchTerm);
      setRoles(response.items);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm chức vụ:", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveRole = async () => {
    try {
        if (!currentRole.tenChucVu) {
            alert('Tên chức vụ không được để trống!');
            return;
        }

        if (currentRole.maChucVu) {
            const userConfirmed = window.confirm('Bạn có chắc chắn muốn cập nhật chức vụ này?');
            if (!userConfirmed) {
                return; // Exit if the user cancels the action
            }

            // Update existing role
            const updatedRole = await updateChucVu(currentRole.maChucVu, {
                tenChucVu: currentRole.tenChucVu,
                trangThai: currentRole.trangThai,
            });
            alert('Cập nhật chức vụ thành công!');
            setRoles((prevRoles) => prevRoles.map((role) => role.maChucVu === updatedRole.maChucVu ? updatedRole : role));
        } else {
            // Add new role
            const newRole = await addChucVu({ tenChucVu: currentRole.tenChucVu });
            alert('Thêm chức vụ thành công!');
            setRoles((prevRoles) => [...prevRoles, newRole]);
        }

        setShowModal(false);
    } catch (error) {
        console.error('Lỗi khi lưu chức vụ:', error);
        alert('Lưu chức vụ thất bại. Vui lòng thử lại!');
    }
};

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý chức vụ</h1>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Nhập tên chức vụ"
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={handleAddRole}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Thêm chức vụ
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Mã chức vụ</th>
            <th className="py-2 px-4 border-b text-left">Tên chức vụ</th>
            <th className="py-2 px-4 border-b text-left">Trạng thái</th>
            <th className="py-2 px-4 border-b text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.maChucVu}>
              <td className="py-2 px-4 border-b">{role.maChucVu}</td>
              <td className="py-2 px-4 border-b">{role.tenChucVu}</td>
              <td
                className={`py-2 px-4 border-b font-bold ${
                  role.trangThai === 'Active'
                    ? 'text-green-600'
                    : role.trangThai === 'Inactive'
                    ? 'text-orange-600'
                    : 'text-red-600'
                }`}
              >
                {role.trangThai}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditRole(role)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteRole(role.maChucVu)}
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">
              {currentRole.maChucVu ? "Cập nhật chức vụ" : "Thêm chức vụ"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="tenChucVu"
                value={currentRole.tenChucVu}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, tenChucVu: e.target.value })
                }
                placeholder="Tên chức vụ"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="trangThai"
                value={currentRole.trangThai}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, trangThai: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>

              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveRole}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
