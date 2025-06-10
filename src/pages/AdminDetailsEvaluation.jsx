"use client";

import { useState, useEffect } from "react";
import {
  GetAllDanhGia,
  GetAllDanhGiaCheo,
  GetAllTuDanhGia,
  GetDanhGiaById,
} from "../api/DanhGia";
import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Users,
  BarChart3,
  FileText,
  Star,
  TrendingUp,
  Calendar,
  User,
} from "lucide-react";

const AdminDetailsEvaluation = () => {
  const [data, setData] = useState({
    items: [],
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedDanhGia, setSelectedDanhGia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      switch (filterType) {
        case "cross":
          response = await GetAllDanhGiaCheo(page, pageSize, search);
          break;
        case "self":
          response = await GetAllTuDanhGia(page, pageSize, search);
          break;
        default:
          response = await GetAllDanhGia(page, pageSize, search);
      }
      setData({
        items: response.items || [],
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalCount: response.totalCount || 0,
      });
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      setData({ items: [], currentPage: 1, totalPages: 1, totalCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, filterType]);

  const handleSearch = () => {
    setPage(1); // Reset to page 1 on search
    fetchData();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= data.totalPages) {
      setPage(newPage);
    }
  };

  const handleViewDetails = async (maDanhGia) => {
    try {
      const response = await GetDanhGiaById(maDanhGia);
      if (response) {
        setSelectedDanhGia(response);
        setShowModal(true);
      } else {
        alert("Không thể tải chi tiết đánh giá!");
      }
    } catch (error) {
      console.error("Error fetching evaluation details:", error);
      alert("Đã có lỗi xảy ra khi tải chi tiết đánh giá!");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDanhGia(null);
  };

  const getFilterIcon = (type) => {
    switch (type) {
      case "cross":
        return <Users className="w-4 h-4" />;
      case "self":
        return <User className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getFilterColor = (type) => {
    switch (type) {
      case "cross":
        return "from-blue-500 to-indigo-500";
      case "self":
        return "from-green-500 to-emerald-500";
      default:
        return "from-purple-500 to-pink-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
          </div>
          <span className="text-lg font-medium text-gray-700">
            Đang tải dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full py-2 px-2">
      <div className="w-full h-full mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chi Tiết Đánh Giá
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý tất cả các đánh giá trong hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Bộ lọc và tìm kiếm
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Loại đánh giá
              </label>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
                >
                  <option value="all">Tất cả đánh giá</option>
                  <option value="cross">Đánh giá chéo</option>
                  <option value="self">Tự đánh giá</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  {getFilterIcon(filterType)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm theo tên người đánh giá hoặc được đánh giá..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white pr-12"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600 transition-colors hover:bg-indigo-50 rounded-lg"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Danh sách đánh giá ({data.totalCount} kết quả)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Người Đánh Giá</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Người Được Đánh Giá</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Đợt đánh giá</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4" />
                      <span>Điểm</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.items.map((item, index) => (
                  <tr
                    key={item.maDanhGia}
                    className={`hover:bg-gray-50 transition-colors ${
                      item.maNguoiDanhGia === item.maNguoiDuocDanhGia
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400"
                        : index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                          {item.nguoiDanhGia?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {item.nguoiDanhGia}
                          </div>
                          {item.maNguoiDanhGia === item.maNguoiDuocDanhGia && (
                            <div className="text-xs text-green-600 font-medium">
                              Tự đánh giá
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.maNguoiDanhGia === item.maNguoiDuocDanhGia ? (
                        <span className="text-sm text-gray-500 italic">
                          Chính mình
                        </span>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                            {item.nguoiDuocDanhGia?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {item.nguoiDuocDanhGia}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {item.tenDotDanhGia}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.diem >= 8
                              ? "bg-green-100 text-green-800"
                              : item.diem >= 6
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.diem}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(item.maDanhGia)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Pagination */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="h-4 w-4" />
              <span>
                Hiển thị{" "}
                <span className="font-semibold text-gray-900">
                  {data.items.length}
                </span>{" "}
                /{" "}
                <span className="font-semibold text-gray-900">
                  {data.totalCount}
                </span>{" "}
                đánh giá
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Trước
              </button>

              <div className="flex items-center space-x-1">
                {[...Array(Math.min(data.totalPages, 5))].map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        page === pageNumber
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all"
              >
                Sau
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Modal for Evaluation Details */}
        {showModal && selectedDanhGia && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Chi Tiết Đánh Giá
                      </h2>
                      <p className="text-indigo-100 text-sm">
                        Mã đánh giá: {selectedDanhGia.maDanhGia}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>Câu Hỏi</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4" />
                            <span>Điểm</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedDanhGia.danhSachCauTraLoi.map(
                        (cauTraLoi, index) => (
                          <tr
                            key={cauTraLoi.maCauHoi}
                            className={`hover:bg-gray-50 transition-colors ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  {cauTraLoi.noiDung}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                  cauTraLoi.traLoi >= 8
                                    ? "bg-green-100 text-green-800"
                                    : cauTraLoi.traLoi >= 6
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                <Star className="h-3 w-3 mr-1" />
                                {cauTraLoi.traLoi}
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDetailsEvaluation;