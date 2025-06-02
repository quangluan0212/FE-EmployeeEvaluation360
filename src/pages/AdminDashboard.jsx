import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllEvaluations,
  fetchLatestEvaluations,
  fetchBestEvaluation,
  fetchWorstEvaluation,
  fetchDotDanhGia,
} from "../api/ApiHandlers";
import useModal from "../hooks/useModal";
import { handleExportToExcel } from "../utils/exportUtils";
import StatsCard from "../components/StatsCard";
import EvaluationsTable from "../components/EvaluationsTable";
import EvaluationModal from "../components/EvaluationModal";
import {
  Users,
  Trophy,
  AlertTriangle,
  AlertCircle,
  Table,
  Loader2,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
  const [totalLatestEvaluations, setTotalLatestEvaluations] = useState(0);
  const [totalBestEvaluations, setTotalBestEvaluations] = useState(0);
  const [totalWorstEvaluations, setTotalWorstEvaluations] = useState(0);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState({
    all: true,
    latest: true,
    best: true,
    worst: true,
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

  if (loading.all || loading.latest || loading.best || loading.worst) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
        <Loader2 className="animate-spin h-12 w-12 text-cyan-500 mb-4" />
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-700" />
              <h3 className="text-red-700 font-medium">Lỗi</h3>
            </div>
            <p className="mt-2 text-sm text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="w-full mx-auto px-2 sm:px-2 lg:px-2 py-2">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Table className="h-6 w-6 mr-2 text-cyan-600" />
              Dashboard Kết quả đánh giá
            </h1>
            <div className="flex items-center gap-2">
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 w-32"
              >
                <option value="">Chọn năm</option>
                {years.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedMaDotDanhGia}
                onChange={(e) => handleDotDanhGiaChange(e.target.value)}
                disabled={!selectedYear}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 w-40"
              >
                <option value="">Tất cả đợt</option>
                {dotDanhGiaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard
            title="Đánh giá đợt này"
            icon={<Users className="h-6 w-6 text-cyan-600" />}
            count={totalLatestEvaluations}
            onClick={() =>
              openModal("latest", setModalData, setModalTotalPages)
            }
            onExport={() =>
              handleExportToExcel(
                "latest",
                "Danh_sach_kqdg_dot_nay",
                selectedMaDotDanhGia || null
              )
            }
            color="cyan"
          />
          <StatsCard
            title="Đánh giá tốt nhất"
            icon={<Trophy className="h-6 w-6 text-green-600" />}
            count={totalBestEvaluations}
            onClick={() => openModal("best", setModalData, setModalTotalPages)}
            onExport={() =>
              handleExportToExcel(
                "best",
                "Danh_sach_kqdg_tot_dot_nay",
                selectedMaDotDanhGia || null
              )
            }
            color="green"
          />
          <StatsCard
            title="Đánh giá kém nhất"
            icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
            count={totalWorstEvaluations}
            onClick={() => openModal("worst", setModalData, setModalTotalPages)}
            onExport={() =>
              handleExportToExcel(
                "worst",
                "Danh_sach_kqdg_kem_dot_nay",
                selectedMaDotDanhGia || null
              )
            }
            color="red"
          />
        </div>
        {/* Evaluations Table */}
        <EvaluationsTable
          data={filteredEvaluations}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
          >
            Quay lại
          </button>
        </div>
      </div>
      {/* Modal */}
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
              `Danh_sach_danh_gia_${showModal}`,
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
