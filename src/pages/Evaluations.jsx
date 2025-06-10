import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getUserKetQuaDanhGia } from "../api/KetQuaDanhGia"
import {
  ArrowLeft,
  Trophy,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  Star,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

const Evaluations = () => {
  const [latestResult, setLatestResult] = useState(null)
  const [otherResults, setOtherResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const maNguoiDung = localStorage.getItem("userId")
  const navigate = useNavigate()

  // Fetch user evaluation results
  const fetchUserEvaluations = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!maNguoiDung) {
        setError("Vui lòng đăng nhập để xem kết quả đánh giá.")
        navigate("/login")
        return
      }

      const response = await getUserKetQuaDanhGia(maNguoiDung)
      console.log("API Response:", response)

      if (response.code === 200 && Array.isArray(response.data)) {
        // Sort by thoiGianTinh descending to get latest result
        const sortedResults = response.data.sort((a, b) => new Date(b.thoiGianTinh) - new Date(a.thoiGianTinh))

        // Set latest result (first item)
        setLatestResult(sortedResults[0] || null)

        // Set other results (exclude the first item)
        setOtherResults(sortedResults.slice(1))
      } else {
        setError("Không có dữ liệu kết quả đánh giá.")
        setLatestResult(null)
        setOtherResults([])
      }
    } catch (err) {
      console.error("Error fetching user evaluations:", err)
      setError(err.message || "Lỗi khi tải kết quả đánh giá.")
      setLatestResult(null)
      setOtherResults([])
    } finally {
      setLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  // Determine score color and recommendation
  const getScoreStyles = (score) => {
    if (score < 40) {
      return {
        colorClass: "text-red-600",
        bgClass: "bg-red-50",
        borderClass: "border-red-200",
        gradientClass: "from-red-500 to-pink-500",
        icon: <XCircle className="h-5 w-5" />,
        recommendation: (
          <div className="mt-3 flex items-center justify-center text-red-600 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <p className="text-sm font-semibold">Đề xuất giảm 1 cấp bậc</p>
          </div>
        ),
      }
    } else if (score < 90) {
      return {
        colorClass: "text-orange-600",
        bgClass: "bg-orange-50",
        borderClass: "border-orange-200",
        gradientClass: "from-orange-500 to-amber-500",
        icon: <AlertCircle className="h-5 w-5" />,
        recommendation: (
          <div className="mt-3 flex items-center justify-center text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
            <Target className="h-4 w-4 mr-2" />
            <p className="text-sm font-semibold">Cần cải thiện thêm</p>
          </div>
        ),
      }
    } else {
      return {
        colorClass: "text-green-600",
        bgClass: "bg-green-50",
        borderClass: "border-green-200",
        gradientClass: "from-green-500 to-emerald-500",
        icon: <CheckCircle className="h-5 w-5" />,
        recommendation: (
          <div className="mt-3 flex items-center justify-center text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            <Trophy className="h-4 w-4 mr-2" />
            <p className="text-sm font-semibold">Được đề xuất tăng 1 bậc</p>
          </div>
        ),
      }
    }
  }

  useEffect(() => {
    fetchUserEvaluations()
  }, [maNguoiDung, navigate])

  if (loading) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Đã xảy ra lỗi</h3>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all font-medium"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-2 px-2">
      <div className="w-full h-full mx-auto">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-6 py-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Kết Quả Đánh Giá Của Bạn</h1>
                  <p className="text-indigo-100">Theo dõi tiến độ và kết quả đánh giá cá nhân</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Result - Enhanced */}
        {latestResult ? (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Kết Quả Gần Nhất</h2>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Side - Details */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Đợt Đánh Giá</p>
                          <p className="text-xl font-bold text-gray-900">Đợt {latestResult.tenDotDanhGia}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tổng kết lúc</p>
                          <p className="text-lg font-semibold text-gray-900">{formatDate(latestResult.thoiGianTinh)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Score */}
                  <div className="flex flex-col items-center justify-center">
                    <div
                      className={`relative w-48 h-48 rounded-full ${getScoreStyles(latestResult.diemTongKet).bgClass} ${getScoreStyles(latestResult.diemTongKet).borderClass} border-4 flex flex-col items-center justify-center shadow-lg`}
                    >
                      <div className="absolute -top-3 -right-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${getScoreStyles(latestResult.diemTongKet).gradientClass} rounded-full flex items-center justify-center shadow-lg`}
                        >
                          {getScoreStyles(latestResult.diemTongKet).icon}
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Điểm Tổng Kết</p>
                        <p className={`text-5xl font-bold ${getScoreStyles(latestResult.diemTongKet).colorClass} mb-2`}>
                          {latestResult.diemTongKet}
                        </p>
                        <div className="flex items-center justify-center">
                          <Award className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500 font-medium">/ 100 điểm</span>
                        </div>
                      </div>
                    </div>
                    {getScoreStyles(latestResult.diemTongKet).recommendation}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có kết quả đánh giá</h3>
              <p className="text-gray-600">Bạn chưa có kết quả đánh giá gần nhất nào.</p>
            </div>
          </div>
        )}

        {/* Historical Results - Enhanced */}
        {otherResults.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Lịch Sử Đánh Giá</h2>
                      <p className="text-sm text-gray-600">{otherResults.length} kết quả trước đó</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Đợt Đánh Giá</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4" />
                          <span>Điểm Tổng Kết</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Thời Gian</span>
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Trạng Thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {otherResults.map((result, index) => (
                      <tr
                        key={`${result.maDotDanhGia}-${index}`}
                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                              {result.maDotDanhGia?.toString().slice(-2) || "??"}
                            </div>
                            <div className="text-sm font-semibold text-gray-900">Đợt {result.maDotDanhGia}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                result.diemTongKet >= 90
                                  ? "bg-green-100 text-green-800"
                                  : result.diemTongKet >= 40
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              <Star className="h-3 w-3 mr-1" />
                              {result.diemTongKet}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            {formatDate(result.thoiGianTinh)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {result.diemTongKet >= 90 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Xuất sắc
                              </span>
                            ) : result.diemTongKet >= 40 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Khá
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Cần cải thiện
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Evaluations