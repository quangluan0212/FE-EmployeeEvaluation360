import {
  Download,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Users,
  Trophy,
  AlertTriangle,
  UserX,
} from "lucide-react";
import { formatDate } from "../utils/exportUtils";

const EvaluationModal = ({
  showModal,
  modalData,
  modalLoading,
  modalSearchQuery,
  modalCurrentPage,
  modalTotalPages,
  onClose,
  onSearch,
  onPageChange,
  onExport,
  setModalSearchQuery,
}) => {
  if (!showModal) return null;

  const getModalConfig = () => {
    switch (showModal) {
      case "latest":
        return {
          title: "Danh Sách Đánh Giá Đợt Này",
          icon: <Users className="h-6 w-6" />,
          gradient: "from-cyan-500 to-blue-500",
          bgGradient: "from-cyan-50 to-blue-50",
        };
      case "best":
        return {
          title: "Đánh Giá Tốt Nhất",
          icon: <Trophy className="h-6 w-6" />,
          gradient: "from-green-500 to-emerald-500",
          bgGradient: "from-green-50 to-emerald-50",
        };
      case "worst":
        return {
          title: "Đánh Giá Kém Nhất",
          icon: <AlertTriangle className="h-6 w-6" />,
          gradient: "from-red-500 to-pink-500",
          bgGradient: "from-red-50 to-pink-50",
        };
      case "nguoiChuaDanhGia":
        return {
          title: "Người Chưa Đánh Giá",
          icon: <UserX className="h-6 w-6" />,
          gradient: "from-orange-500 to-amber-500",
          bgGradient: "from-orange-50 to-amber-50",
        };
      default:
        return {
          title: "Dữ Liệu Đánh Giá",
          icon: <FileText className="h-6 w-6" />,
          gradient: "from-gray-500 to-gray-600",
          bgGradient: "from-gray-50 to-gray-100",
        };
    }
  };

  const config = getModalConfig();

  const renderTable = () => {
    if (modalLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
            <div
              className={`animate-spin rounded-full h-12 w-12 border-t-4 bg-gradient-to-r ${config.gradient} absolute top-0 left-0 rounded-full`}
            ></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Đang tải dữ liệu...</p>
        </div>
      );
    }

    if (!modalData || modalData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div
            className={`w-16 h-16 bg-gradient-to-r ${config.gradient} rounded-full flex items-center justify-center mb-4 opacity-50`}
          >
            {config.icon}
          </div>
          <p className="text-gray-500 text-lg font-medium">Không có dữ liệu</p>
          <p className="text-gray-400 text-sm mt-1">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      );
    }

    if (showModal === "nguoiChuaDanhGia") {
      return (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead
              className={`bg-gradient-to-r ${config.bgGradient} sticky top-0`}
            >
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Mã Người Dùng</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Họ Tên</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Chức Vụ
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Số Đánh Giá Còn Thiếu
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {modalData.map((item, index) => (
                <tr
                  key={`nguoiChuaDanhGia-${item.maNguoiDung}-${index}`}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.maNguoiDung}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.hoTen}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.tenChucVu}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        item.soDanhGiaConThieu > 5
                          ? "bg-red-100 text-red-800"
                          : item.soDanhGiaConThieu > 2
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item.soDanhGiaConThieu}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Bảng cho latest, best, worst
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead
            className={`bg-gradient-to-r ${config.bgGradient} sticky top-0`}
          >
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Họ Tên</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Đợt Đánh Giá
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>Điểm Tổng</span>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thời Gian Đánh Giá
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {modalData.map((item, index) => (
              <tr
                key={`modal-${item.maKetQuaDanhGia}-${index}`}
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.hoTen}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {item.tenDotDanhGia}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        item.diemTongKet >= 8
                          ? "bg-green-100 text-green-800"
                          : item.diemTongKet >= 6
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.diemTongKet}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {formatDate(item.thoiGianTinh)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
        {/* Enhanced Modal Header */}
        <div className={`bg-gradient-to-r ${config.gradient} px-6 py-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                {config.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{config.title}</h2>
                <p className="text-white/80 text-sm">
                  {modalData?.length || 0} kết quả
                  {modalTotalPages > 1 &&
                    ` • Trang ${modalCurrentPage}/${modalTotalPages}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onExport}
                disabled={modalLoading}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 border border-white/20"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Xuất Excel</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  placeholder={
                    showModal === "nguoiChuaDanhGia"
                      ? "Tìm kiếm theo họ tên..."
                      : "Tìm kiếm theo họ tên..."
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                  disabled={modalLoading}
                />
              </div>
              <button
                onClick={onSearch}
                disabled={modalLoading}
                className={`px-6 py-3 bg-gradient-to-r ${config.gradient} text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
              >
                Tìm kiếm
              </button>
            </div>

            {showModal !== "nguoiChuaDanhGia" && modalTotalPages > 1 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 font-medium">
                  Trang {modalCurrentPage} / {modalTotalPages}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onPageChange(modalCurrentPage - 1)}
                    disabled={modalCurrentPage === 1 || modalLoading}
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onPageChange(modalCurrentPage + 1)}
                    disabled={
                      modalCurrentPage === modalTotalPages || modalLoading
                    }
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Modal Table */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {renderTable()}
        </div>

        {/* Enhanced Footer */}
        {modalData && modalData.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-semibold text-gray-900">
                  {modalData.length}
                </span>{" "}
                kết quả
                {modalTotalPages > 1 && (
                  <>
                    {" • "}
                    <span className="font-semibold text-gray-900">
                      Trang {modalCurrentPage}/{modalTotalPages}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationModal;
