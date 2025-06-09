"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllEvaluations,
  fetchLatestEvaluations,
  fetchBestEvaluation,
  fetchWorstEvaluation,
  fetchDotDanhGia,
  fetchAllNguoiChuaDanhGia,
} from "../api/ApiHandlers";
import useModal from "../hooks/useModal";
import { handleExportToExcel } from "../utils/exportUtils";
import EvaluationsTable from "../components/EvaluationsTable";
import EvaluationModal from "../components/EvaluationModal";
import {
  Users,
  Trophy,
  AlertTriangle,
  AlertCircle,
  UserX,
  BarChart3,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
  const [totalLatestEvaluations, setTotalLatestEvaluations] = useState(0);
  const [totalBestEvaluations, setTotalBestEvaluations] = useState(0);
  const [totalWorstEvaluations, setTotalWorstEvaluations] = useState(0);
  const [totalNguoiChuaDanhGia, setTotalNguoiChuaDanhGia] = useState(0);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState({
    all: true,
    latest: true,
    best: true,
    worst: true,
    nguoiChuaDanhGia: true,
  });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMaDotDanhGia, setSelectedMaDotDanhGia] = useState("");
  const [dotDanhGiaOptions, setDotDanhGiaOptions] = useState([]);
  const [years, setYears] = useState([]);
  const maNguoiDung = localStorage.getItem("userId");
  const navigate = useNavigate();

  const {
    showModal,
    modalData,
    modalLoading,
    modalSearchQuery,
    modalCurrentPage,
    modalTotalPages,
    openModal,
    closeModal,
    handleModalSearch,
    handleModalPageChange,
    setModalData,
    setModalTotalPages,
    setModalSearchQuery,
  } = useModal(selectedMaDotDanhGia);

  // Tạo danh sách năm
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearList = Array.from({ length: currentYear - 2019 }, (_, i) => ({
      value: currentYear - i,
      label: `${currentYear - i}`,
    }));
    setYears(yearList);
  }, []);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    if (!maNguoiDung) {
      setError("Vui lòng đăng nhập để xem dashboard.");
      navigate("/login");
      return;
    }
    const fetchInitialData = async () => {
      try {
        const allData = await fetchAllEvaluations(
          currentPage,
          searchQuery,
          selectedMaDotDanhGia,
          setLoading,
          setError
        );
        setAllEvaluations(allData.items || []);
        setFilteredEvaluations(allData.items || []);
        setTotalPages(allData.totalPages || 1);

        const latestData = await fetchLatestEvaluations(
          1,
          "",
          false,
          selectedMaDotDanhGia,
          setLoading,
          setError
        );
        setTotalLatestEvaluations(latestData.totalCount || 0);

        const bestData = await fetchBestEvaluation(
          1,
          "",
          false,
          selectedMaDotDanhGia,
          setLoading,
          setError
        );
        setTotalBestEvaluations(bestData.totalCount || 0);

        const worstData = await fetchWorstEvaluation(
          1,
          "",
          false,
          selectedMaDotDanhGia,
          setLoading,
          setError
        );
        setTotalWorstEvaluations(worstData.totalCount || 0);

        const nguoiChuaDanhGiaData = await fetchAllNguoiChuaDanhGia(
          selectedMaDotDanhGia,
          setLoading,
          setError
        );
        setTotalNguoiChuaDanhGia(nguoiChuaDanhGiaData.length || 0);
      } catch (err) {
        setError(err.message || "Lỗi khi tải dữ liệu ban đầu.");
      }
    };
    fetchInitialData();
  }, [maNguoiDung, navigate, currentPage, selectedMaDotDanhGia]);

  const handleYearChange = async (year) => {
    setSelectedYear(year);
    setSelectedMaDotDanhGia("");
    setDotDanhGiaOptions([]);
    if (year) {
      const options = await fetchDotDanhGia(year, setError);
      setDotDanhGiaOptions(options);
    }
    const allData = await fetchAllEvaluations(
      1,
      searchQuery,
      null,
      setLoading,
      setError
    );
    setAllEvaluations(allData.items || []);
    setFilteredEvaluations(allData.items || []);
    setTotalPages(allData.totalPages || 1);
    await fetchLatestEvaluations(1, "", false, null, setLoading, setError);
    await fetchBestEvaluation(1, "", false, null, setLoading, setError);
    await fetchWorstEvaluation(1, "", false, null, setLoading, setError);
    const nguoiChuaDanhGiaData = await fetchAllNguoiChuaDanhGia(
      null,
      setLoading,
      setError
    );
    setTotalNguoiChuaDanhGia(nguoiChuaDanhGiaData.length || 0);
  };

  const handleDotDanhGiaChange = async (maDotDanhGia) => {
    setSelectedMaDotDanhGia(maDotDanhGia);
    const allData = await fetchAllEvaluations(
      1,
      searchQuery,
      maDotDanhGia || null,
      setLoading,
      setError
    );
    setAllEvaluations(allData.items || []);
    setFilteredEvaluations(allData.items || []);
    setTotalPages(allData.totalPages || 1);
    await fetchLatestEvaluations(
      1,
      "",
      false,
      maDotDanhGia || null,
      setLoading,
      setError
    );
    await fetchBestEvaluation(
      1,
      "",
      false,
      maDotDanhGia || null,
      setLoading,
      setError
    );
    await fetchWorstEvaluation(
      1,
      "",
      false,
      maDotDanhGia || null,
      setLoading,
      setError
    );
    const nguoiChuaDanhGiaData = await fetchAllNguoiChuaDanhGia(
      maDotDanhGia || null,
      setLoading,
      setError
    );
    setTotalNguoiChuaDanhGia(nguoiChuaDanhGiaData.length || 0);
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    const allData = await fetchAllEvaluations(
      1,
      searchQuery,
      selectedMaDotDanhGia || null,
      setLoading,
      setError
    );
    setFilteredEvaluations(allData.items || []);
    setTotalPages(allData.totalPages || 1);
  };

  const refreshData = async () => {
    setLoading({
      all: true,
      latest: true,
      best: true,
      worst: true,
      nguoiChuaDanhGia: true,
    });
    const allData = await fetchAllEvaluations(
      currentPage,
      searchQuery,
      selectedMaDotDanhGia,
      setLoading,
      setError
    );
    setAllEvaluations(allData.items || []);
    setFilteredEvaluations(allData.items || []);
    setTotalPages(allData.totalPages || 1);

    const latestData = await fetchLatestEvaluations(
      1,
      "",
      false,
      selectedMaDotDanhGia,
      setLoading,
      setError
    );
    setTotalLatestEvaluations(latestData.totalCount || 0);

    const bestData = await fetchBestEvaluation(
      1,
      "",
      false,
      selectedMaDotDanhGia,
      setLoading,
      setError
    );
    setTotalBestEvaluations(bestData.totalCount || 0);

    const worstData = await fetchWorstEvaluation(
      1,
      "",
      false,
      selectedMaDotDanhGia,
      setLoading,
      setError
    );
    setTotalWorstEvaluations(worstData.totalCount || 0);

    const nguoiChuaDanhGiaData = await fetchAllNguoiChuaDanhGia(
      selectedMaDotDanhGia,
      setLoading,
      setError
    );
    setTotalNguoiChuaDanhGia(nguoiChuaDanhGiaData.length || 0);
  };

  if (
    loading.all ||
    loading.latest ||
    loading.best ||
    loading.worst ||
    loading.nguoiChuaDanhGia
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đang tải dữ liệu
            </h3>
            <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đã xảy ra lỗi
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-3 py-4">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-600 px-6 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Dashboard Quản Trị
                    </h1>
                    <p className="text-indigo-100">
                      Tổng quan kết quả đánh giá và thống kê
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={refreshData}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all flex items-center space-x-2 border border-white/20"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Làm mới</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Filters */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Bộ lọc dữ liệu
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Năm đánh giá
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Chọn năm đánh giá</option>
                    {years.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    Đợt đánh giá
                  </label>
                  <select
                    value={selectedMaDotDanhGia}
                    onChange={(e) => handleDotDanhGiaChange(e.target.value)}
                    disabled={!selectedYear}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Tất cả đợt đánh giá</option>
                    {dotDanhGiaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Latest Evaluations Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <button
                  onClick={() =>
                    handleExportToExcel(
                      "latest",
                      "Danh_sach_kqdg_dot_nay",
                      selectedMaDotDanhGia || null
                    )
                  }
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Toàn bộ kết quả đánh giá
              </h3>
              <p className="text-3xl font-bold text-cyan-600 mb-4">
                {totalLatestEvaluations}
              </p>
              <button
                onClick={() =>
                  openModal("latest", setModalData, setModalTotalPages)
                }
                className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium"
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Best Evaluations Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <button
                  onClick={() =>
                    handleExportToExcel(
                      "best",
                      "Danh_sach_kqdg_tot_dot_nay",
                      selectedMaDotDanhGia || null
                    )
                  }
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kết Quả đánh giá tốt
              </h3>
              <p className="text-3xl font-bold text-green-600 mb-4">
                {totalBestEvaluations}
              </p>
              <button
                onClick={() =>
                  openModal("best", setModalData, setModalTotalPages)
                }
                className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all font-medium"
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          {/* Worst Evaluations Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <button
                  onClick={() =>
                    handleExportToExcel(
                      "worst",
                      "Danh_sach_kqdg_kem_dot_nay",
                      selectedMaDotDanhGia || null
                    )
                  }
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kết quả đánh giá kém
              </h3>
              <p className="text-3xl font-bold text-red-600 mb-4">
                {totalWorstEvaluations}
              </p>
              <button
                onClick={() =>
                  openModal("worst", setModalData, setModalTotalPages)
                }
                className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
          
          {/* People Not Evaluated Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UserX className="h-6 w-6 text-white" />
                </div>
                <button
                  onClick={() =>
                    handleExportToExcel(
                      "nguoiChuaDanhGia",
                      "Danh_sach_nguoi_thieu_dg",
                      selectedMaDotDanhGia || null
                    )
                  }
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Người chưa đánh giá
              </h3>
              <p className="text-3xl font-bold text-orange-600 mb-4">
                {totalNguoiChuaDanhGia}
              </p>
              <button
                onClick={() =>
                  openModal(
                    "nguoiChuaDanhGia",
                    setModalData,
                    setModalTotalPages
                  )
                }
                className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all font-medium"
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <EvaluationsTable
            data={filteredEvaluations}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>

      {showModal && (
        <EvaluationModal
          showModal={showModal}
          modalData={modalData}
          modalLoading={modalLoading}
          modalSearchQuery={modalSearchQuery}
          modalCurrentPage={modalCurrentPage}
          modalTotalPages={modalTotalPages}
          onClose={closeModal}
          onSearch={handleModalSearch}
          onPageChange={handleModalPageChange}
          onExport={() =>
            handleExportToExcel(
              showModal,
              `Danh_sach_${showModal}`,
              selectedMaDotDanhGia || null
            )
          }
          setModalSearchQuery={setModalSearchQuery}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
