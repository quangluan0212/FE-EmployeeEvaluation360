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
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

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
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa thành viên này?"
    );
    if (!confirmDelete) return;

    try {
      await deleteThanhVien(id);
      setMembers((prev) => prev.filter((member) => member.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa thành viên:", error);
    }
  };

  const handleAddMember = () => {
    // navigate(`/group-management/${maNhom}/add-member`);
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-md flex flex-col">
      <div className="flex justify-between items-center mb-6"> 
        <h2 className="text-2xl font-bold">Danh sách thành viên</h2>

        <div className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm thành viên..."
            className="px-4 py-2 border rounded"
          />
          <button
            onClick={handleAddMember}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thêm Thành viên
          </button>
        </div>
      </div>

      {members.length === 0 ? (
        <p>Không có thành viên trong nhóm này.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Mã thành viên</th>
              <th className="py-2 px-4 border">Tên thành viên</th>
              <th className="py-2 px-4 border">Chức vụ</th>
              <th className="py-2 px-4 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td className="border px-4 py-2">{member.maNguoiDung}</td>
                <td className="border px-4 py-2">{member.hoTen}</td>
                <td className="border px-4 py-2">{member.chucVu}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Xóa khỏi nhóm
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setMembersPage((prev) => Math.max(1, prev - 1))}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Trang trước
        </button>
        <span>
          Trang {membersPage} / {totalMembersPages}
        </span>
        <button
          onClick={() =>
            setMembersPage((prev) => Math.min(totalMembersPages, prev + 1))
          }
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default GroupMembers;
