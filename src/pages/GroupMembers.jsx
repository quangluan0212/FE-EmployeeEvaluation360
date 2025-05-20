import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDanhSachThanhVienNhom, deleteThanhVien } from "../api/Nhom";

const GroupMembers = () => {
  const { maNhom } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [membersPage, setMembersPage] = useState(1);
  const [membersPageSize, setMembersPageSize] = useState(10);
  const [totalMembersPages, setTotalMembersPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); // State để hiển thị modal
  const [memberToDelete, setMemberToDelete] = useState(null); // Lưu ID thành viên cần xóa

  useEffect(() => {
    const fetchMembers = async () => {
      try {
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
      }
    };

    fetchMembers();
  }, [maNhom, membersPage, membersPageSize, searchTerm]);

  const handleDeleteMember = async (id) => {
    setMemberToDelete(id); // Lưu ID thành viên cần xóa
    setShowModal(true); // Hiển thị modal
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      await deleteThanhVien(memberToDelete);
      setMembers((prev) => prev.filter((member) => member.id !== memberToDelete));
      setShowModal(false); // Đóng modal sau khi xóa
      setMemberToDelete(null); // Xóa ID tạm thời
    } catch (error) {
      console.error("Lỗi khi xóa thành viên:", error);
      setShowModal(false); // Đóng modal nếu có lỗi
    }
  };

  const cancelDelete = () => {
    setShowModal(false); // Đóng modal
    setMemberToDelete(null); // Xóa ID tạm thời
  };

  const handleAddMember = () => {
    // navigate(`/group-management/${maNhom}/add-member`);
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
          >
            Thêm Thành viên
          </button>
        </div>
      </div>

      {members.length === 0 ? (
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
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setMembersPage((prev) => Math.max(1, prev - 1))}
          disabled={membersPage === 1}
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
          disabled={membersPage === totalMembersPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default GroupMembers;