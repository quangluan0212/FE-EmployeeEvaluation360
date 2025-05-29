import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllKetQuaDanhGiaPaged,
  getLatestQuaDanhGiaPaged,
  getGoodQuaDanhGiaPaged,
  getBadQuaDanhGiaPaged,
  getBadQuaDanhGia,
  getGoodQuaDanhGia,
  getLatestQuaDanhGia,
} from "../api/KetQuaDanhGia";

const ITEMS_PER_PAGE = 10;
import {
  Users,
  Trophy,
  AlertTriangle,
  AlertCircle,
  Table,
  Calendar,
  Loader2,
  Download,
  X,
} from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
  const [totalLatestEvaluations, setTotalLatestEvaluations] = useState(0);
  const [totalBestEvaluations, setTotalBestEvaluations] = useState(0);
  const [totalWorstEvaluations, setTotalWorstEvaluations] = useState(0);
  const [latestEvaluation, setLatestEvaluation] = useState([]);
  const [bestEvaluation, setBestEvaluation] = useState(null);
  const [worstEvaluation, setWorstEvaluation] = useState(null);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [loading, setLoading] = useState({
    all: true,
    latest: true,
    best: true,
    worst: true,
  });
  const [modalLoading, setModalLoading] = useState(false); // Thêm loading riêng cho modal
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalTotalPages, setModalTotalPages] = useState(1);
  const maNguoiDung = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch all evaluations (all database results)
  const fetchAllEvaluations = async (page = currentPage, search = "") => {
    try {
      setLoading((prev) => ({ ...prev, all: true }));
      console.log("Fetching all evaluations with:", {
        page,
        ITEMS_PER_PAGE,
        search,
      });

      const allRes = await getAllKetQuaDanhGiaPaged(
        page,
        ITEMS_PER_PAGE,
        search
      );
      console.log("All evaluations response:", allRes);

      if (allRes && allRes.items) {
        setAllEvaluations(allRes.items);
        setFilteredEvaluations(allRes.items);
        setTotalPages(allRes.totalPages || 1);
      } else {
        console.log("No data from all evaluations API");
        setAllEvaluations([]);
        setFilteredEvaluations([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("All evaluations API error:", err);
      setError(err.message || "Lỗi khi tải danh sách đánh giá.");
      setAllEvaluations([]);
      setFilteredEvaluations([]);
      setTotalPages(1);
    } finally {
      setLoading((prev) => ({ ...prev, all: false }));
    }
  };

  // Fetch latest evaluations (current period) - CẬP NHẬT
  const fetchLatestEvaluations = async (
    page = 1,
    search = "",
    isModal = false
  ) => {
    try {
      if (isModal) {
        setModalLoading(true);
      } else {
        setLoading((prev) => ({ ...prev, latest: true }));
      }

      console.log("Fetching latest evaluations with:", {
        page,
        ITEMS_PER_PAGE,
        search,
        isModal,
      });

      const latestRes = await getLatestQuaDanhGiaPaged(
        page,
        ITEMS_PER_PAGE,
        search
      );
      console.log(
        "Latest evaluations FULL response:",
        JSON.stringify(latestRes, null, 2)
      );

      if (latestRes?.items?.length) {
        if (!isModal) {
          setLatestEvaluation(latestRes.items);
          setTotalLatestEvaluations(latestRes.totalCount || 0);
        }

        if (isModal) {
          setModalData(latestRes.items);
          setModalTotalPages(latestRes.totalPages || 1);
        }
      } else {
        console.log(
          "No data from latest evaluations API. Response:",
          latestRes
        );
        if (!isModal) {
          setLatestEvaluation([]);
          setTotalLatestEvaluations(0);
        }

        if (isModal) {
          setModalData([]);
          setModalTotalPages(1);
        }
      }
    } catch (err) {
      console.error("Latest evaluations API error:", err);
      setError(err.message || "Lỗi khi tải đánh giá gần đây.");
      if (!isModal) {
        setLatestEvaluation([]);
        setTotalLatestEvaluations(0);
      }

      if (isModal) {
        setModalData([]);
        setModalTotalPages(1);
      }
    } finally {
      if (isModal) {
        setModalLoading(false);
      } else {
        setLoading((prev) => ({ ...prev, latest: false }));
      }
    }
  };

  // Fetch best evaluations (current period) - CẬP NHẬT
  const fetchBestEvaluation = async (
    page = 1,
    search = "",
    isModal = false
  ) => {
    try {
      if (isModal) {
        setModalLoading(true);
      } else {
        setLoading((prev) => ({ ...prev, best: true }));
      }

      console.log("Fetching best evaluations with:", {
        page,
        ITEMS_PER_PAGE,
        search,
        isModal,
      });

      const bestRes = await getGoodQuaDanhGiaPaged(
        page,
        ITEMS_PER_PAGE,
        search
      );
      console.log(
        "Best evaluations FULL response:",
        JSON.stringify(bestRes, null, 2)
      );

      if (bestRes?.items?.length) {
        console.log("Best evaluation data:", bestRes.items[0]);
        if (!isModal) {
          setBestEvaluation(bestRes.items[0]);
          setTotalBestEvaluations(bestRes.totalCount || 0);
        }

        if (isModal) {
          setModalData(bestRes.items);
          setModalTotalPages(bestRes.totalPages || 1);
        }
      } else {
        console.log("No data from best evaluations API. Response:", bestRes);
        if (!isModal) {
          setBestEvaluation(null);
          setTotalBestEvaluations(0);
        }

        if (isModal) {
          setModalData([]);
          setModalTotalPages(1);
        }
      }
    } catch (err) {
      console.error("Best evaluations API error:", err);
      setError(err.message || "Lỗi khi tải đánh giá tốt nhất.");
      if (!isModal) {
        setBestEvaluation(null);
        setTotalBestEvaluations(0);
      }

      if (isModal) {
        setModalData([]);
        setModalTotalPages(1);
      }
    } finally {
      if (isModal) {
        setModalLoading(false);
      } else {
        setLoading((prev) => ({ ...prev, best: false }));
      }
    }
  };

  // Fetch worst evaluations (current period) - CẬP NHẬT
  const fetchWorstEvaluation = async (
    page = 1,
    search = "",
    isModal = false
  ) => {
    try {
      if (isModal) {
        setModalLoading(true);
      } else {
        setLoading((prev) => ({ ...prev, worst: true }));
      }

      console.log("Fetching worst evaluations with:", {
        page,
        ITEMS_PER_PAGE,
        search,
        isModal,
      });

      const worstRes = await getBadQuaDanhGiaPaged(
        page,
        ITEMS_PER_PAGE,
        search
      );
      console.log(
        "Worst evaluations FULL response:",
        JSON.stringify(worstRes, null, 2)
      );

      if (worstRes?.items?.length) {
        console.log("Worst evaluation data:", worstRes.items[0]);
        if (!isModal) {
          setWorstEvaluation(worstRes.items[0]);
          setTotalWorstEvaluations(worstRes.totalCount || 0);
        }

        if (isModal) {
          setModalData(worstRes.items);
          setModalTotalPages(worstRes.totalPages || 1);
        }
      } else {
        console.log("No data from worst evaluations API. Response:", worstRes);
        if (!isModal) {
          setWorstEvaluation(null);
          setTotalWorstEvaluations(0);
        }

        if (isModal) {
          setModalData([]);
          setModalTotalPages(1);
        }
      }
    } catch (err) {
      console.error("Worst evaluations API error:", err);
      setError(err.message || "Lỗi khi tải đánh giá kém nhất.");
      if (!isModal) {
        setWorstEvaluation(null);
        setTotalWorstEvaluations(0);
      }

      if (isModal) {
        setModalData([]);
        setModalTotalPages(1);
      }
    } finally {
      if (isModal) {
        setModalLoading(false);
      } else {
        setLoading((prev) => ({ ...prev, worst: false }));
      }
    }
  };

  // CẬP NHẬT: Xử lý mở modal với async/await
  const handleOpenModal = async (modalType) => {
    console.log(`Opening ${modalType} modal`);
    setShowModal(modalType);
    setModalData([]);
    setModalCurrentPage(1);
    setModalSearchQuery("");

    // Fetch data dựa trên loại modal
    try {
      if (modalType === "latest") {
        await fetchLatestEvaluations(1, "", true);
      } else if (modalType === "best") {
        await fetchBestEvaluation(1, "", true);
      } else if (modalType === "worst") {
        await fetchWorstEvaluation(1, "", true);
      }
    } catch (error) {
      console.error(`Error fetching ${modalType} data:`, error);
    }
  };

  const handleExportToExcel = async (modalType, title) => {
    try {
      let data = [];

      // Gọi API tương ứng
      if (modalType === "latest") {
        const response = await getLatestQuaDanhGia();
        data = response || [];
      } else if (modalType === "best") {
        const response = await getGoodQuaDanhGia();
        data = response || [];
      } else if (modalType === "worst") {
        const response = await getBadQuaDanhGia();
        data = response || [];
      }

      if (!data.length) {
        console.log("No data to export for", modalType);
        return;
      }

      // Định dạng dữ liệu
      const formattedData = data.map((item) => ({
        "Mã đánh giá": item.maKetQuaDanhGia || "N/A",
        "Họ tên": item.hoTen || "N/A",
        "Đợt đánh giá": item.tenDotDanhGia || "N/A",
        "Điểm tổng": item.diemTongKet !== undefined ? item.diemTongKet : "N/A",
        "Thời gian đánh giá": item.thoiGianTinh
          ? formatDate(item.thoiGianTinh)
          : "N/A",
      }));

      // Tạo worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Thêm tiêu đề báo cáo
      const reportTitle = `BÁO CÁO ${modalType.toUpperCase()} - ${new Date().toLocaleDateString(
        "vi-VN"
      )}`;
      XLSX.utils.sheet_add_aoa(worksheet, [[reportTitle]], { origin: "A1" });
      worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];

      // Điều chỉnh độ rộng cột
      worksheet["!cols"] = [
        { wch: 20 },
        { wch: 30 },
        { wch: 25 },
        { wch: 15 },
        { wch: 25 },
      ];

      // Rút ngắn tên sheet nếu vượt quá 31 ký tự
      const safeTitle = title.length > 31 ? title.substring(0, 31) : title;

      // Tạo workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, safeTitle);

      // Xuất file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, `${title}.xlsx`);
    } catch (error) {
      console.error(`Error exporting ${modalType} to Excel:`, error);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  useEffect(() => {
    if (!maNguoiDung) {
      setError("Vui lòng đăng nhập để xem dashboard.");
      navigate("/login");
      return;
    }

    fetchAllEvaluations(currentPage, searchQuery);
    fetchLatestEvaluations(1, "", false);
    fetchBestEvaluation(1, "", false);
    fetchWorstEvaluation(1, "", false);
  }, [maNguoiDung, navigate, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchAllEvaluations(1, searchQuery);
  };

  const handleModalSearch = async () => {
    setModalCurrentPage(1);
    if (showModal === "latest") {
      await fetchLatestEvaluations(1, modalSearchQuery, true);
    } else if (showModal === "best") {
      await fetchBestEvaluation(1, modalSearchQuery, true);
    } else if (showModal === "worst") {
      await fetchWorstEvaluation(1, modalSearchQuery, true);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleModalPageChange = async (newPage) => {
    setModalCurrentPage(newPage);
    if (showModal === "latest") {
      await fetchLatestEvaluations(newPage, modalSearchQuery, true);
    } else if (showModal === "best") {
      await fetchBestEvaluation(newPage, modalSearchQuery, true);
    } else if (showModal === "worst") {
      await fetchWorstEvaluation(newPage, modalSearchQuery, true);
    }
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

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Table className="h-6 w-6 mr-2 text-cyan-600" />
              Dashboard Kết Quả Đánh Giá
            </h1>
          </div>
        </div>

        {/* Stats Cards - CẬP NHẬT onClick handlers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Latest Evaluation */}
          <div
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleOpenModal("latest")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-cyan-100 rounded-full">
                  <Users className="h-6 w-6 text-cyan-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Đánh giá đợt này
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {totalLatestEvaluations}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportToExcel(
                    "latest",
                    "Danh_sach_kqdg_dot_nay"
                  );
                }}
                className="flex items-center text-sm text-gray-500 hover:text-cyan-600"
              >
                <Download className="h-4 w-4 mr-1" />
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Best Evaluation */}
          <div
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleOpenModal("best")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Đánh giá tốt nhất
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {totalBestEvaluations}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportToExcel(
                    "best",
                    "Danh_sach_kqdg_tot_dot_nay"
                  );
                }}
                className="flex items-center text-sm text-gray-500 hover:text-green-600"
              >
                <Download className="h-4 w-4 mr-1" />
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Worst Evaluation */}
          <div
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleOpenModal("worst")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Đánh giá kém nhất
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {totalWorstEvaluations}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportToExcel(
                    "worst",
                    "Danh_sach_kqdg_kem_dot_nay"
                  );
                }}
                className="flex items-center text-sm text-gray-500 hover:text-red-600"
              >
                <Download className="h-4 w-4 mr-1" />
                Xuất Excel
              </button>
            </div>
          </div>
        </div>

        {/* Total Evaluations Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-cyan-600" />
                Kết quả đánh giá
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo mã đánh giá, họ tên..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                  >
                    Tìm kiếm
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đợt đánh giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điểm tổng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian đánh giá
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvaluations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  filteredEvaluations.map((item, index) => (
                    <tr
                      key={`${item.maKetQuaDanhGia}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.maKetQuaDanhGia}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.hoTen}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.tenDotDanhGia}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.diemTongKet}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.thoiGianTinh)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
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

      {/* Modal - CẬP NHẬT với loading indicator */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">
                {showModal === "latest"
                  ? "Danh sách đánh giá đợt này"
                  : showModal === "best"
                  ? "Đánh giá tốt nhất"
                  : "Đánh giá kém nhất"}
              </h2>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    handleExportToExcel(
                      showModal,
                      `Danh_sach_danh_gia_${showModal}`
                    );
                  }}
                  className="mr-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                  disabled={modalLoading}
                >
                  <Download className="inline h-4 w-4 mr-2" /> Xuất Excel
                </button>
                <button
                  onClick={() => setShowModal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            {/* Modal Search and Pagination */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo mã đánh giá, họ tên..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    disabled={modalLoading}
                  />
                  <button
                    onClick={handleModalSearch}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors disabled:opacity-50"
                    disabled={modalLoading}
                  >
                    Tìm kiếm
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span>
                    Trang {modalCurrentPage} / {modalTotalPages}
                  </span>
                  <button
                    onClick={() => handleModalPageChange(modalCurrentPage - 1)}
                    disabled={modalCurrentPage === 1 || modalLoading}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  <button
                    onClick={() => handleModalPageChange(modalCurrentPage + 1)}
                    disabled={
                      modalCurrentPage === modalTotalPages || modalLoading
                    }
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
            {/* Modal Table with Loading và Scrollbar */}
            <div className="flex-1 overflow-auto p-4">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="animate-spin h-8 w-8 text-cyan-500 mb-2" />
                  <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đánh giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Họ tên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đợt đánh giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Điểm tổng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian đánh giá
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {modalData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-sm text-gray-500"
                        >
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      modalData.map((item, index) => (
                        <tr
                          key={`modal-${item.maKetQuaDanhGia}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.maKetQuaDanhGia}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.hoTen}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.tenDotDanhGia}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.diemTongKet}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.thoiGianTinh)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
