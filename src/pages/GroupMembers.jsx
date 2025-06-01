import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getDanhSachThanhVienNhom,
  deleteThanhVien,
  getDanhSachNguoiDungKhongCoTrongNhom,
  addThanhVienVaoNhom,
} from "../api/Nhom";

const GroupMembers = () => {
  const { maNhom } = useParams();
  const [members, setMembers] = useState([]);
  const [membersPage, setMembersPage] = useState(1);
  const [membersPageSize, setMembersPageSize] = useState(10);
  const [totalMembersPages, setTotalMembersPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal xóa
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // Modal thêm thành viên
  const [availableUsers, setAvailableUsers] = useState([]); // Danh sách người dùng không trong nhóm
  const [selectedUsers, setSelectedUsers] = useState([]); // Danh sách maNguoiDung được chọn
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

  // Lấy danh sách thành viên nhóm
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await getDanhSachThanhVienNhom(
          maNhom,
          membersPage,
          membersPageSize,
          searchTerm
        );
        setMembers(response.items || []);
        setTotalMembersPages(response.totalPages || 1);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thành viên:", error);
        window.alert("Lỗi khi lấy danh sách thành viên!");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [maNhom, membersPage, membersPageSize, searchTerm]);

  // Lấy danh sách người dùng không trong nhóm khi mở modal
  const fetchAvailableUsers = async () => {
    try {
      setLoading(true);
      const response = await getDanhSachNguoiDungKhongCoTrongNhom(maNhom);
      setAvailableUsers(response.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      window.alert("Lỗi khi lấy danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý mở modal thêm thành viên
  const handleAddMember = () => {
    setShowAddModal(true);
    setSelectedUsers([]); // Reset danh sách chọn
    fetchAvailableUsers(); // Gọi API để lấy danh sách người dùng
  };

  // Xử lý chọn/bỏ chọn người dùng
  const handleSelectUser = (maNguoiDung) => {
    setSelectedUsers((prev) =>
      prev.includes(maNguoiDung)
        ? prev.filter((id) => id !== maNguoiDung)
        : [...prev, maNguoiDung]
    );
  };

  // Xử lý thêm thành viên
  const handleConfirmAdd = async () => {
    if (selectedUsers.length === 0) {
      window.alert("Vui lòng chọn ít nhất một người dùng!");
      return;
    }

    const data = {
      maNhom: parseInt(maNhom),
      maNguoiDung: selectedUsers,
    };

    try {
      setLoading(true);
      await addThanhVienVaoNhom(data);
      window.alert("Thêm thành viên thành công!");
      setShowAddModal(false);
      // Cập nhật lại danh sách thành viên
      const response = await getDanhSachThanhVienNhom(
        maNhom,
        membersPage,
        membersPageSize,
        searchTerm
      );
      setMembers(response.items || []);
      setTotalMembersPages(response.totalPages || 1);
    } catch (error) {
      console.error("Lỗi khi thêm thành viên:", error);
      window.alert("Lỗi khi thêm thành viên!");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa thành viên
  const handleDeleteMember = (id) => {
    setMemberToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      setLoading(true);
      await deleteThanhVien(memberToDelete);
      setMembers((prev) =>
        prev.filter((member) => member.id !== memberToDelete)
      );
      window.alert("Xóa thành viên thành công!");
      setShowModal(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa thành viên:", error);
      window.alert("Lỗi khi xóa thành viên!");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setMemberToDelete(null);
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-xl min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">
          Danh sách thành viên
        </h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm thành viên..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <button
            onClick={handleAddMember}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={loading}
          >
            Thêm Thành viên
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-10">Đang tải...</p>
      ) : members.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          Không có thành viên trong nhóm này.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Mã thành viên
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Tên thành viên
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Chức vụ
                </th>
                <th className="py-3 px-6 text-center text-sm font-medium text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="py-4 px-6 text-gray-600">
                    {member.maNguoiDung}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{member.hoTen}</td>
                  <td className="py-4 px-6 text-gray-600">{member.chucVu}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                      disabled={loading}
                    >
                      Xóa khỏi nhóm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                disabled={loading}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm thành viên */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Thêm thành viên vào nhóm
            </h3>
            {loading ? (
              <p className="text-gray-500 text-center py-10">Đang tải...</p>
            ) : availableUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                Không có người dùng nào để thêm.
              </p>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-gray-100 sticky top-0">
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                        Chọn
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                        Mã người dùng
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                        Tên người dùng
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                        Chức vụ
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                        Số dự án
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableUsers.map((user) => (
                      <tr
                        key={user.maNguoiDung}
                        className="border-b hover:bg-gray-50 transition duration-150"
                      >
                        <td className="py-4 px-6 text-gray-600">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.maNguoiDung)}
                            onChange={() => handleSelectUser(user.maNguoiDung)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {user.maNguoiDung}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {user.hoTen}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {user.chucVu}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {user.soDuAn}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={loading}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setMembersPage((prev) => Math.max(1, prev - 1))}
          disabled={membersPage === 1 || loading}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          Trang trước
        </button>
        <span className="text-gray-600">
          Trang {membersPage} / {totalMembersPages}
        </span>
        <button
          onClick={() =>
            setMembersPage((prev) => Math.min(totalMembersPages, prev + 1))
          }
          disabled={membersPage === totalMembersPages || loading}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default GroupMembers;
