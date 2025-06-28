import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGroupByUserId } from "../api/Nhom";
import {
  User,
  Users,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react";

const GroupMembersPage = () => {
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const maNguoiDung = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!maNguoiDung) {
        setError("Vui lòng đăng nhập để xem thông tin nhóm.");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const response = await getGroupByUserId(maNguoiDung);
        const groupsList = Array.isArray(response) ? response : [];
        
        setGroupsData(groupsList);
        // Initialize all groups as expanded
        const initialExpandedState = {};
        groupsList.forEach((_, index) => {
          initialExpandedState[index] = true;
        });
        setExpandedGroups(initialExpandedState);
      } catch (err) {
        setError(err.message || "Lấy danh sách nhóm thất bại.");
        console.error("Lỗi khi lấy nhóm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maNguoiDung, navigate]);

  const toggleGroupExpanded = (groupIndex) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupIndex]: !prev[groupIndex],
    }));
  };

  const isCurrentUser = (member) => {
    return member.maNguoiDung === maNguoiDung;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h3 className="font-medium">Lỗi</h3>
            </div>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(groupsData) || groupsData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Không tìm thấy nhóm
            </h2>
            <p className="text-gray-500">Bạn chưa được phân vào nhóm nào.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 py-2 px-2">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Users className="h-6 w-10 mr-2 text-cyan-600" />
                Danh sách thành viên nhóm
              </h1>
            </div>
          </div>
        </div>

        {/* Groups */}
        {groupsData.map((group, groupIndex) => {
          if (!group || !group.tenNhom || !Array.isArray(group.thanhVien)) {
            return null;
          }

          return (
            <div
              key={group.maNhom}
              className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
            >
              {/* Group Header */}
              <div
                className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => toggleGroupExpanded(groupIndex)}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-cyan-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Nhóm: <span className="text-cyan-700">{group.tenNhom}</span>{" "}
                  </h2>
                </div>
                <div className="flex items-center">
                  {expandedGroups[groupIndex] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Group Content */}
              {expandedGroups[groupIndex] && (
                <div className="px-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Họ tên
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Chức vụ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Số điện thoại
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {group.thanhVien.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-10 text-center text-sm text-gray-500"
                            >
                              Không có thành viên nào trong nhóm
                            </td>
                          </tr>
                        ) : (
                          group.thanhVien.map((member) => {
                            const isSelf = isCurrentUser(member);
                            return (
                              <tr
                                key={member.maNhomNguoiDung}
                                className={`hover:bg-gray-50 ${
                                  isSelf ? "bg-purple-50" : ""
                                }`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  <div className="flex items-center">
                                    {member.hoTen}
                                    {isSelf && (
                                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        <UserCheck className="h-3 w-3 mr-1" />
                                        Bản thân
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {member.chucVu}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {member.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {member.soDienThoai}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Back Button */}
        <div className="max-w-4xl mx-auto mt-6">
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupMembersPage;
