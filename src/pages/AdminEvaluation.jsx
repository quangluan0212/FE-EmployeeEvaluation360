import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminActive } from "../api/NguoiDung";
import { getCurrentDotDanhGia, GetFormDanhGia } from "../api/DanhGia";
import EvaluationModal from "../components/evaluation-modal";

const AdminEvaluation = () => {
  const [admins, setAdmins] = useState([])
  const [dotDanhGia, setDotDanhGia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEvaluationForm, setShowEvaluationForm] = useState(false)
  const [evaluationData, setEvaluationData] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  // Format date to display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" }
    return new Date(dateString).toLocaleDateString("vi-VN", options)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First check if there's an active evaluation period
        const dotDanhGiaData = await getCurrentDotDanhGia()
        setDotDanhGia(dotDanhGiaData)

        // If there is an active period, fetch the admin list
        if (dotDanhGiaData) {
          const adminData = await getAdminActive()
          setAdmins(adminData)
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleEvaluate = async (admin) => {
    try {
      setSubmitting(true)
      // Assuming the current user's ID is available (replace with actual user ID)
      const currentUserId = localStorage.getItem("userId");

      const data = await GetFormDanhGia(currentUserId, admin.maNhomNguoiDung, dotDanhGia.maDotDanhGia);

      setEvaluationData(data)
      setSelectedAdmin(admin)

      // Initialize answers object with empty values
      const initialAnswers = {}
      data.danhSachCauHoi.forEach((question) => {
        initialAnswers[question.maCauHoi] = 0
      })
      setAnswers(initialAnswers)

      setShowEvaluationForm(true)
    } catch (err) {
      setError("Lỗi khi tải form đánh giá.")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleViewEvaluation = (maNguoiDung) => {
    navigate(`/view-evaluation/${maNguoiDung}`)
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmitEvaluation = async () => {
    try {
      setSubmitting(true)

      // Check if all questions are answered
      const unansweredQuestions = Object.values(answers).filter((value) => value === 0)
      if (unansweredQuestions.length > 0) {
        alert("Vui lòng trả lời tất cả các câu hỏi trước khi gửi đánh giá.")
        setSubmitting(false)
        return
      }

      // Here you would submit the evaluation data to your API
      console.log("Submitting evaluation:", {
        nguoiDanhGia: "current_user_id", // Replace with actual user ID
        nguoiDuocDanhGia: selectedAdmin.maNguoiDung,
        maDotDanhGia: dotDanhGia.maDotDanhGia,
        answers: answers,
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Close the form and show success message
      setShowEvaluationForm(false)
      alert("Đánh giá đã được gửi thành công!")
    } catch (err) {
      setError("Lỗi khi gửi đánh giá.")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const closeEvaluationForm = () => {
    setShowEvaluationForm(false)
    setEvaluationData(null)
    setSelectedAdmin(null)
    setAnswers({})
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="font-medium">Lỗi</h3>
            </div>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!dotDanhGia) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Không có đợt đánh giá nào đang diễn ra</h2>
            <p className="text-gray-500">Hiện tại không có đợt đánh giá nào đang diễn ra. Vui lòng quay lại sau.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 relative">
      {/* Evaluation Form Modal */}
      {showEvaluationForm && evaluationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Đánh giá: {selectedAdmin.hoten}</h2>
              <button onClick={closeEvaluationForm} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6 bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Xin các anh/chị hãy đánh giá đồng nghiệp một cách chân thành và khách quan — những góp ý xây dựng của anh/chị sẽ là động lực quý giá giúp công ty ngày càng vững mạnh và phát triển !!!</span>
                </p>
              </div>

              <div className="space-y-6">
                {evaluationData.danhSachCauHoi.map((question, index) => (
                  <div key={question.maCauHoi} className="border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-md font-medium text-gray-800">
                        <span className="text-gray-700 px-3 py-1">{index + 1}.</span>
                        {question.noiDung}
                      </h3>
                      <span className="text-sm text-gray-500">Điểm tối đa: {question.diemToiDa}</span>
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {[...Array(question.diemToiDa)].map((_, i) => {
                          const value = i + 1
                          return (
                            <label
                              key={i}
                              className={`
                                flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
                                ${
                                  answers[question.maCauHoi] === value
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }
                                transition-colors duration-200
                              `}
                            >
                              <input
                                type="radio"
                                name={`question-${question.maCauHoi}`}
                                value={value}
                                checked={answers[question.maCauHoi] === value}
                                onChange={() => handleAnswerChange(question.maCauHoi, value)}
                                className="sr-only"
                              />
                              {value}
                            </label>
                          )
                        })}
                      </div>                      
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeEvaluationForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitEvaluation}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang gửi...
                  </span>
                ) : (
                  "Gửi đánh giá"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Đánh giá Admin</h1>
              <p className="mt-1 text-m text-gray-500">Danh sách admin</p>
            </div>

            <div className="bg-blue-50 px-4 py-2 rounded-md">
              <h3 className="text-m font-bold text-blue-800">{dotDanhGia.tenDot}</h3>
              <p className="text-m text-blue-600 mt-1">
                {formatDate(dotDanhGia.thoiGianBatDau)} - {formatDate(dotDanhGia.thoiGianKetThuc)}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Mã Người Dùng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Họ Tên
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tên Nhóm
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                        Không có admin nào đang hoạt động
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => (
                      <tr key={admin.maNguoiDung} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {admin.maNguoiDung}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{admin.hoten}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{admin.tenNhom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEvaluate(admin)}
                              disabled={submitting}
                              className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                submitting ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                              </svg>
                              <span className="hidden sm:inline">Đánh giá</span>
                            </button>
                            <button
                              onClick={() => handleViewEvaluation(admin.maNguoiDung)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span className="hidden sm:inline">Xem đánh giá</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminEvaluation

