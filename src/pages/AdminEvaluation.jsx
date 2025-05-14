"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentDotDanhGia,
  GetFormDanhGia,
  AdminGetListDanhGiaLeader,
} from "../api/DanhGia";
import {
  ClipboardList,
  Edit,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Loader2,
} from "lucide-react";

const AdminEvaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [dotDanhGia, setDotDanhGia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const maNguoiDung = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Format date to display
  const formatDate = (dateString) => {
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
    const fetchData = async () => {
      try {
        // First check if there's an active evaluation period
        const dotDanhGiaData = await getCurrentDotDanhGia();
        setDotDanhGia(dotDanhGiaData);

        // If there is an active period, fetch the evaluation list
        if (dotDanhGiaData) {
          const evaluationData = await AdminGetListDanhGiaLeader(maNguoiDung);
          setEvaluations(evaluationData);
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEvaluate = async (evaluation) => {
    try {
      setSubmitting(true);
      // Assuming the current user's ID is available (replace with actual user ID)
      const currentUserId = localStorage.getItem("userId");

      const data = await GetFormDanhGia(
        evaluation.maDanhGia
      );

      setEvaluationData(data);
      setSelectedEvaluation(evaluation);

      // Initialize answers object with empty values
      const initialAnswers = {};
      data.danhSachCauHoi.forEach((question) => {
        initialAnswers[question.maCauHoi] = 0;
      });
      setAnswers(initialAnswers);

      setShowEvaluationForm(true);
    } catch (err) {
      setError("Lỗi khi tải form đánh giá.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvaluation = (evaluation) => {
    console.log("Edit evaluation:", evaluation);
    alert(`Chỉnh sửa đánh giá cho ${evaluation.hotTen}`);
  };

  const handleViewEvaluation = (maNguoiDung) => {
    navigate(`/view-evaluation/${maNguoiDung}`);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitEvaluation = async () => {
    try {
      setSubmitting(true);
      const unansweredQuestions = Object.values(answers).filter(
        (value) => value === 0
      );
      if (unansweredQuestions.length > 0) {
        alert("Vui lòng trả lời tất cả các câu hỏi trước khi gửi đánh giá.");
        setSubmitting(false);
        return;
      }
      console.log("Submitting evaluation:", {
        maDanhGia: selectedEvaluation.maDanhGia,
        nguoiDanhGia: "current_user_id",
        nguoiDuocDanhGia: selectedEvaluation.maNguoiDanhGia,
        maDotDanhGia: dotDanhGia.maDotDanhGia,
        answers: answers,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close the form and show success message
      setShowEvaluationForm(false);
      alert("Đánh giá đã được gửi thành công!");

      // Refresh the evaluation list

      const evaluationData = await AdminGetListDanhGiaLeader(maNguoiDung);
      setEvaluations(evaluationData);
    } catch (err) {
      setError("Lỗi khi gửi đánh giá.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const closeEvaluationForm = () => {
    setShowEvaluationForm(false);
    setEvaluationData(null);
    setSelectedEvaluation(null);
    setAnswers({});
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

  if (!dotDanhGia) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Không có đợt đánh giá nào đang diễn ra
            </h2>
            <p className="text-gray-500">
              Hiện tại không có đợt đánh giá nào đang diễn ra. Vui lòng quay lại
              sau.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative">
      {/* Evaluation Form Modal */}
      {showEvaluationForm && evaluationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <ClipboardList className="h-5 w-5 mr-2 text-cyan-600" />
                Đánh giá: {selectedEvaluation.hotTen}
              </h2>
              <button
                onClick={closeEvaluationForm}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6 bg-cyan-50 p-4 rounded-md border border-cyan-100">
                <p className="text-sm text-cyan-700">
                  <span className="font-medium">
                    Xin các anh/chị hãy đánh giá đồng nghiệp một cách chân thành
                    và khách quan — những góp ý xây dựng của anh/chị sẽ là động
                    lực quý giá giúp công ty ngày càng vững mạnh và phát triển
                    !!!
                  </span>
                </p>
              </div>

              <div className="space-y-6">
                {evaluationData.danhSachCauHoi.map((question, index) => (
                  <div
                    key={question.maCauHoi}
                    className="border-b border-gray-200 pb-6"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-md font-medium text-gray-800">
                        <span className="text-gray-700 px-3 py-1">
                          {index + 1}.
                        </span>
                        {question.noiDung}
                      </h3>
                      <span className="text-sm text-gray-500">
                        Điểm tối đa: {question.diemToiDa}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {[...Array(question.diemToiDa)].map((_, i) => {
                          const value = i + 1;
                          return (
                            <label
                              key={i}
                              className={`
                                flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
                                ${
                                  answers[question.maCauHoi] === value
                                    ? "bg-cyan-500 text-white"
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
                                onChange={() =>
                                  handleAnswerChange(question.maCauHoi, value)
                                }
                                className="sr-only"
                              />
                              {value}
                            </label>
                          );
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
                className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
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

      <div className="w-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <ClipboardList className="h-6 w-6 mr-2 text-cyan-600" />
                Đánh giá Leader
              </h1>
              <p className="mt-1 text-m text-gray-500">Danh sách đánh giá</p>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 px-4 py-2 rounded-md shadow-sm border border-cyan-100">
              <h3 className="text-m font-bold text-cyan-800 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-cyan-600" />
                {dotDanhGia.tenDot}
              </h3>
              <p className="text-m text-cyan-600 mt-1">
                {formatDate(dotDanhGia.thoiGianBatDau)} -{" "}
                {formatDate(dotDanhGia.thoiGianKetThuc)}
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
                      Mã đánh giá
                    </th>
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
                      Trạng thái
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evaluations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        Không có đánh giá nào
                      </td>
                    </tr>
                  ) : (
                    evaluations.map((evaluation) => (
                      <tr
                        key={evaluation.maDanhGia}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {evaluation.maDanhGia}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {evaluation.hotTen}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {evaluation.trangThai === "Chưa đánh giá" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {evaluation.trangThai}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {evaluation.trangThai}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {evaluation.trangThai === "Chưa đánh giá" ? (
                              <button
                                onClick={() => handleEvaluate(evaluation)}
                                disabled={submitting}
                                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 ${
                                  submitting
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <ClipboardList className="h-4 w-4 mr-1.5" />
                                <span className="hidden sm:inline">
                                  Đánh giá
                                </span>
                              </button>
                            ) : (
                              <>
                                {" "}
                                <button
                                  onClick={() =>
                                    handleEditEvaluation(evaluation)
                                  }
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                >
                                  <Edit className="h-4 w-4 mr-1.5" />
                                  <span className="hidden sm:inline">Sửa</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleViewEvaluation(
                                      evaluation.maNguoiDanhGia
                                    )
                                  }
                                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-cyan-700 bg-cyan-50 hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                                >
                                  <Eye className="h-4 w-4 mr-1.5" />
                                  <span className="hidden sm:inline">Xem</span>
                                </button>
                              </>
                            )}
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
  );
};

export default AdminEvaluation;
