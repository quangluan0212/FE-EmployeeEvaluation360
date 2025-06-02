import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserKetQuaDanhGia } from "../api/KetQuaDanhGia";
import { Loader2, ArrowLeft, Trophy, Table, AlertTriangle } from "lucide-react";

const Evaluations = () => {
  const [latestResult, setLatestResult] = useState(null);
  const [otherResults, setOtherResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const maNguoiDung = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch user evaluation results
  const fetchUserEvaluations = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!maNguoiDung) {
        setError("Vui lòng đăng nhập để xem kết quả đánh giá.");
        navigate("/login");
        return;
      }

      const response = await getUserKetQuaDanhGia(maNguoiDung);
      console.log("API Response:", response);

      if (response.code === 200 && Array.isArray(response.data)) {
        // Sort by thoiGianTinh descending to get latest result
        const sortedResults = response.data.sort(
          (a, b) => new Date(b.thoiGianTinh) - new Date(a.thoiGianTinh)
        );

        // Set latest result (first item)
        setLatestResult(sortedResults[0] || null);

        // Set other results (exclude the first item)
        setOtherResults(sortedResults.slice(1));
      } else {
        setError("Không có dữ liệu kết quả đánh giá.");
        setLatestResult(null);
        setOtherResults([]);
      }
    } catch (err) {
      console.error("Error fetching user evaluations:", err);
      setError(err.message || "Lỗi khi tải kết quả đánh giá.");
      setLatestResult(null);
      setOtherResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date
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

  // Determine score color and recommendation
  const getScoreStyles = (score) => {
    if (score < 40) {
      return {
        colorClass: "text-red-600",
        recommendation: (
          <div className="mt-2 flex items-center justify-center text-red-600">
            <AlertTriangle className="h-5 w-5 mr-1" />
            <p className="text-sm font-medium">Đề xuất giảm 1 cấp bậc</p>
          </div>
        ),
      };
    } else if (score < 90) {
      return {
        colorClass: "text-orange-600",
        recommendation: null,
      };
    } else {
      return {
        colorClass: "text-green-600",
        recommendation: (
          <div className="mt-2 flex items-center justify-center text-green-600">
            <Trophy className="h-5 w-5 mr-1" />
            <p className="text-sm font-medium">Được đề xuất tăng 1 bậc</p>
          </div>
        ),
      };
    }
  };

  useEffect(() => {
    fetchUserEvaluations();
  }, [maNguoiDung, navigate]);

  if (loading) {
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
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="font-medium">Lỗi</h3>
            </div>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50 py-4 px-4">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Table className="h-6 w-6 mr-2 text-cyan-600" />
              Kết Quả Đánh Giá Của Bạn
            </h1>
          </div>
        </div>

        {/* Latest Result */}
        {latestResult ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Kết Quả Gần Nhất
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đợt Đánh Giá</p>
                <p className="text-xl font-medium text-gray-900">
                  Đợt {latestResult.maDotDanhGia}
                </p>
                <p className="text-sm text-gray-500 mt-2">Thời Gian</p>
                <p className="text-base text-gray-900">
                  {formatDate(latestResult.thoiGianTinh)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Điểm Tổng Kết</p>
                <p
                  className={`text-3xl font-bold ${getScoreStyles(
                    latestResult.diemTongKet
                  ).colorClass}`}
                >
                  {latestResult.diemTongKet}
                </p>
                {getScoreStyles(latestResult.diemTongKet).recommendation}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
            <p className="text-gray-500">Chưa có kết quả đánh giá gần nhất.</p>
          </div>
        )}

        {/* Other Results */}
        {otherResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Các Kết Quả Trước Đó
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đợt Đánh Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Điểm Tổng Kết
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời Gian
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {otherResults.map((result, index) => (
                    <tr
                      key={`${result.maDotDanhGia}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Đợt {result.maDotDanhGia}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.diemTongKet}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(result.thoiGianTinh)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay Lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default Evaluations;