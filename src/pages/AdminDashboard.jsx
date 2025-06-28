import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  fetchAllEvaluations,
  fetchLatestEvaluations,
  fetchBestEvaluation,
  fetchWorstEvaluation,
  fetchDotDanhGia,
  fetchAllNguoiChuaDanhGia,
} from "../api/ApiHandlers"
import useModal from "../hooks/useModal"
import { handleExportToExcel } from "../utils/exportUtils"
import EvaluationsTable from "../components/EvaluationsTable"
import EvaluationModal from "../components/EvaluationModal"
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
  RefreshCw,
  PieChart,
} from "lucide-react"

const ITEMS_PER_PAGE = 10

// Pie Chart Component
const EvaluationPieChart = ({ goodCount, poorCount, restCount }) => {
  const total = goodCount + poorCount + restCount

  if (total === 0) {
    return (
      <div
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Không có dữ liệu
      </div>
    )
  }

  const goodPercentage = (goodCount / total) * 100
  const poorPercentage = (poorCount / total) * 100
  const restPercentage = (restCount / total) * 100

  // Calculate angles for each segment
  const goodAngle = (goodCount / total) * 360
  const poorAngle = (poorCount / total) * 360
  const restAngle = (restCount / total) * 360

  // Create SVG path for each segment
  const createPath = (startAngle, endAngle, outerRadius = 80, innerRadius = 35) => {
    const start = polarToCartesian(90, 90, outerRadius, endAngle)
    const end = polarToCartesian(90, 90, outerRadius, startAngle)
    const innerStart = polarToCartesian(90, 90, innerRadius, endAngle)
    const innerEnd = polarToCartesian(90, 90, innerRadius, startAngle)

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return [
      "M",
      start.x,
      start.y,
      "A",
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      innerEnd.x,
      innerEnd.y,
      "A",
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      "Z",
    ].join(" ")
  }

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  // Only add segments with count > 0 to the actual chart
  let currentAngle = 0
  const segments = []

  // Always create segments for categories that have data
  if (goodCount > 0) {
    const angle = (goodCount / total) * 360
    segments.push({
      path: createPath(currentAngle, currentAngle + angle),
      color: "#3b82f6",
      label: "Tốt",
      count: goodCount,
      percentage: goodPercentage,
    })
    currentAngle += angle
  }

  if (poorCount > 0) {
    const angle = (poorCount / total) * 360
    segments.push({
      path: createPath(currentAngle, currentAngle + angle),
      color: "#ef4444",
      label: "Kém",
      count: poorCount,
      percentage: poorPercentage,
    })
    currentAngle += angle
  }

  if (restCount > 0) {
    const angle = (restCount / total) * 360
    segments.push({
      path: createPath(currentAngle, currentAngle + angle),
      color: "#f97316",
      label: "Khác",
      count: restCount,
      percentage: restPercentage,
    })
  }

  // If only one segment exists and it's 100%, make sure it displays as a full circle
  if (segments.length === 1 && segments[0].percentage === 100) {
    segments[0].path = createPath(0, 360)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      {/* Chart */}
      <div style={{ position: "relative" }}>
        <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
          {segments.length > 0 ? (
            segments.map((segment, index) => (
              <path
                key={index}
                d={segment.path}
                fill={segment.color}
                stroke="#ffffff"
                strokeWidth="2"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                  transition: "all 0.3s ease",
                }}
              />
            ))
          ) : (
            // Fallback circle when no segments (shouldn't happen with our logic)
            <circle cx="90" cy="90" r="80" fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="2" />
          )}
        </svg>

        {/* Center text */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#374151",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>{total}</div>
          <div>Tổng số</div>
        </div>
      </div>

      {/* Simple Legend */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        esist
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
            }}
          ></div>
          <span style={{ fontSize: "12px", color: "#374151" }}>Tốt</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
            }}
          ></div>
          <span style={{ fontSize: "12px", color: "#374151" }}>Kém</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#f97316",
            }}
          ></div>
          <span style={{ fontSize: "12px", color: "#374151" }}>Khác</span>
        </div>
      </div>
    </div>
  )
}

const AdminDashboard = () => {
  const [totalLatestEvaluations, setTotalLatestEvaluations] = useState(0)
  const [totalBestEvaluations, setTotalBestEvaluations] = useState(0)
  const [totalWorstEvaluations, setTotalWorstEvaluations] = useState(0)
  const [totalNguoiChuaDanhGia, setTotalNguoiChuaDanhGia] = useState(0)
  const [allEvaluations, setAllEvaluations] = useState([])
  const [filteredEvaluations, setFilteredEvaluations] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState({
    all: true,
    latest: true,
    best: true,
    worst: true,
    nguoiChuaDanhGia: true,
  })
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMaDotDanhGia, setSelectedMaDotDanhGia] = useState("")
  const [dotDanhGiaOptions, setDotDanhGiaOptions] = useState([])
  const [years, setYears] = useState([])
  const maNguoiDung = localStorage.getItem("userId")
  const navigate = useNavigate()

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
  } = useModal(selectedMaDotDanhGia)

  // Initialize year list and set default year to current year
  useEffect(() => {
    const initializeYearAndDotDanhGia = async () => {
      const currentYear = new Date().getFullYear()
      const yearList = Array.from({ length: currentYear - 2019 }, (_, i) => ({
        value: currentYear - i,
        label: `${currentYear - i}`,
      }))
      setYears(yearList)
      setSelectedYear(currentYear.toString())

      // Fetch evaluation periods for the current year
      let options = await fetchDotDanhGia(currentYear, setError)
      if (options.length > 0) {
        // Select the first evaluation period (most recent since sorted descending)
        setDotDanhGiaOptions(options)
        setSelectedMaDotDanhGia(options[0].value)
      } else {
        // If no evaluation periods, try the previous year
        const previousYear = (currentYear - 1).toString()
        setSelectedYear(previousYear)
        options = await fetchDotDanhGia(previousYear, setError)
        setDotDanhGiaOptions(options)
        if (options.length > 0) {
          setSelectedMaDotDanhGia(options[0].value)
        }
      }
    }

    initializeYearAndDotDanhGia()
  }, [])

  // Fetch initial data based on selected year and evaluation period
  useEffect(() => {
    if (!maNguoiDung) {
      setError("Vui lòng đăng nhập để xem dashboard.")
      navigate("/login")
      return
    }
    const fetchInitialData = async () => {
      try {
        const allData = await fetchAllEvaluations(currentPage, searchQuery, selectedMaDotDanhGia, setLoading, setError)
        setAllEvaluations(allData.items || [])
        setFilteredEvaluations(allData.items || [])
        setTotalPages(allData.totalPages || 1)

        const latestData = await fetchLatestEvaluations(1, "", false, selectedMaDotDanhGia, setLoading, setError)
        setTotalLatestEvaluations(latestData.totalCount || 0)

        const bestData = await fetchBestEvaluation(1, "", false, selectedMaDotDanhGia, setLoading, setError)
        setTotalBestEvaluations(bestData.totalCount || 0)

        const worstData = await fetchWorstEvaluation(1, "", false, selectedMaDotDanhGia, setLoading, setError)
        setTotalWorstEvaluations(worstData.totalCount || 0)

        const nguoiChuaDanhGiaData = await fetchAllNguoiChuaDanhGia(selectedMaDotDanhGia, setLoading, setError)
        setTotalNguoiChuaDanhGia(nguoiChuaDanhGiaData.length || 0)
      } catch (err) {
        setError(err.message || "Lỗi khi tải dữ liệu ban đầu.")
      }
    }
    if (selectedMaDotDanhGia) {
      fetchInitialData()
    }
  }, [maNguoiDung, navigate, currentPage, selectedMaDotDanhGia])

  const handleYearChange = async (year) => {
    setSelectedYear(year)
    setSelectedMaDotDanhGia("")
    setDotDanhGiaOptions([])
    if (year) {
      const options = await fetchDotDanhGia(year, setError)
      setDotDanhGiaOptions(options)
      if (options.length > 0) {
        setSelectedMaDotDanhGia(options[0].value)
      }
    }
    const allData = await fetchAllEvaluations(1, searchQuery, null, setLoading, setError)
    setAllEvaluations(allData.items || [])
    setFilteredEvaluations(allData.items || [])
    setTotalPages(allData.totalPages || 1)
    await fetchLatestEvaluations(1, "", false, null, setLoading, setError)
    await fetchBestEvaluation(1, "", false, null, setLoading, setError)
    await fetchWorstEvaluation(1, "", false, null, setLoading, setError)
    const nguoiChuaDanhGiaData = await fetchAllNguoiChuaDanhGia(null, setLoading, setError)
    setTotalNguoiChuaDanhGia(nguoiChuaDanhGiaData.length || 0)
  }

  const handleDotDanhGiaChange = async (maDotDanhGia) => {
    setSelectedMaDotDanhGia(maDotDanhGia)
    const allData = await fetchAllEvaluations(1, searchQuery, maDotDanhGia || null, setLoading, setError)
    setAllEvaluations(allData.items || [])
    setFilteredEvaluations(allData.items || [])
    setTotalPages(allData.totalPages || 1)
    await fetchLatestEvaluations(1, "", false, maDotDanhGia || null, setLoading, setError)
    await fetchBestEvaluation(1, "", false, maDotDanhGia || null, setLoading, setError)
    await fetchWorstEvaluation(1, "", false, maDotDanhGia || null, setLoading, setError)
    const nguoiChuaDanhGiaData = await fetchAllNguoiChuaDanhGia(maDotDanhGia || null, setLoading, setError)
    setTotalNguoiChuaDanhGia(nguoiChuaDanhGiaData.length || 0)
  }

  const handleSearch = async () => {
    setCurrentPage(1)
    const allData = await fetchAllEvaluations(1, searchQuery, selectedMaDotDanhGia || null, setLoading, setError)
    setFilteredEvaluations(allData.items || [])
    setTotalPages(allData.totalPages || 1)
  }

  const refreshData = async () => {
    setLoading({
      all: true,
      latest: true,
      best: true,
      worst: true,
      nguoiChuaDanhGia: true,
    })
    const allData = await fetchAllEvaluations(currentPage, searchQuery, selectedMaDotDanhGia, setLoading, setError)
    setAllEvaluations(allData.items || [])
    setFilteredEvaluations(allData.items || [])
    setTotalPages(allData.totalPages || 1)

    const latestData = await fetchLatestEvaluations(1, "", false, selectedMaDotDanhGia, setLoading, setError)
    setTotalLatestEvaluations(latestData.totalCount || 0)

    const bestData = await fetchBestEvaluation(1, "", false, selectedMaDotDanhGia, setLoading, setError)
    setTotalBestEvaluations(bestData.totalCount || 0)

    const worstData = await fetchWorstEvaluation(1, "", false, selectedMaDotDanhGia, setLoading, setError)
    setTotalWorstEvaluations(worstData.totalCount || 0)

    const nguoiChuaDanhGiaData = await fetchAllNguoiChuaDanhGia(selectedMaDotDanhGia, setLoading, setError)
    setTotalNguoiChuaDanhGia(nguoiChuaDanhGiaData.length || 0)
  }

  if (loading.all || loading.latest || loading.best || loading.worst || loading.nguoiChuaDanhGia) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải dữ liệu</h3>
            <p className="text-gray-600">Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      </div>
    )
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Đã xảy ra lỗi</h3>
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
    )
  }

  // Calculate chart data
  const restEvaluations = totalLatestEvaluations - totalBestEvaluations - totalWorstEvaluations

  return (
    <div className="w-full h-full min-h-screen py-2 px-2">
      <div className="w-full h-full">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-600 px-2 py-2">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard Quản Trị</h1>
                    <p className="text-indigo-100">Tổng quan kết quả đánh giá và thống kê</p>
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
                <h3 className="text-lg font-semibold text-gray-900">Bộ lọc dữ liệu</h3>
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

        {/* Chart Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Biểu đồ phân bố kết quả đánh giá</h2>
                  <p className="text-purple-100 text-sm">Tổng quan phân loại kết quả đánh giá</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Left Stats */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Kết quả đánh giá tốt</p>
                        <p className="text-2xl font-bold text-blue-700">{totalBestEvaluations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-red-600 font-medium">Kết quả đánh giá kém</p>
                        <p className="text-2xl font-bold text-red-700">{totalWorstEvaluations}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Chart */}
                <div className="flex justify-center">
                  <EvaluationPieChart
                    goodCount={totalBestEvaluations}
                    poorCount={totalWorstEvaluations}
                    restCount={restEvaluations}
                  />
                </div>

                {/* Right Stats */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Kết quả đánh giá khác</p>
                        <p className="text-2xl font-bold text-orange-700">{restEvaluations}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Tổng cộng</p>
                        <p className="text-2xl font-bold text-gray-700">{totalLatestEvaluations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Summary */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Tỷ lệ kết quả tốt</p>
                    <p className="text-lg font-bold text-blue-600">
                      {totalLatestEvaluations > 0
                        ? ((totalBestEvaluations / totalLatestEvaluations) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tỷ lệ kết quả kém</p>
                    <p className="text-lg font-bold text-red-600">
                      {totalLatestEvaluations > 0
                        ? ((totalWorstEvaluations / totalLatestEvaluations) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tỷ lệ khác</p>
                    <p className="text-lg font-bold text-orange-600">
                      {totalLatestEvaluations > 0 ? ((restEvaluations / totalLatestEvaluations) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
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
                  onClick={() => handleExportToExcel("latest", "Danh_sach_kqdg_dot_nay", selectedMaDotDanhGia || null)}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Toàn bộ kết quả đánh giá</h3>
              <p className="text-3xl font-bold text-cyan-600 mb-4">{totalLatestEvaluations}</p>
              <button
                onClick={() => openModal("latest", setModalData, setModalTotalPages)}
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
                    handleExportToExcel("best", "Danh_sach_kqdg_tot_dot_nay", selectedMaDotDanhGia || null)
                  }
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kết quả đánh giá tốt</h3>
              <p className="text-3xl font-bold text-green-600 mb-4">{totalBestEvaluations}</p>
              <button
                onClick={() => openModal("best", setModalData, setModalTotalPages)}
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
                    handleExportToExcel("worst", "Danh_sach_kqdg_kem_dot_nay", selectedMaDotDanhGia || null)
                  }
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kết quả đánh giá kém</h3>
              <p className="text-3xl font-bold text-red-600 mb-4">{totalWorstEvaluations}</p>
              <button
                onClick={() => openModal("worst", setModalData, setModalTotalPages)}
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
                    handleExportToExcel("nguoiChuaDanhGia", "Danh_sach_nguoi_thieu_dg", selectedMaDotDanhGia || null)
                  }
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Download className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Người chưa đánh giá</h3>
              <p className="text-3xl font-bold text-orange-600 mb-4">{totalNguoiChuaDanhGia}</p>
              <button
                onClick={() => openModal("nguoiChuaDanhGia", setModalData, setModalTotalPages)}
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
          onExport={() => handleExportToExcel(showModal, `Danh_sach_${showModal}`, selectedMaDotDanhGia || null)}
          setModalSearchQuery={setModalSearchQuery}
        />
      )}
    </div>
  )
}

export default AdminDashboard