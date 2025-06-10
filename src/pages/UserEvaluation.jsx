import { useEffect, useState } from "react";
import {
  getCurrentDotDanhGia,
  GetFormDanhGia,
  submitDanhGia,
  GetDanhGiaById,
  UserGetListDanhGia,
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
  Save,
  Users,
  User,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from "lucide-react";

const UserEvaluation = () => {
  const [groupsData, setGroupsData] = useState([]);
  const [dotDanhGia, setDotDanhGia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const maNguoiDung = localStorage.getItem("userId");

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
  // Set body overflow to hidden when the evaluation form is open
  useEffect(() => {
    if (showEvaluationForm) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showEvaluationForm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First check if there's an active evaluation period
        const dotDanhGiaData = await getCurrentDotDanhGia();
        setDotDanhGia(dotDanhGiaData);

        // If there is an active period, fetch the evaluation list for the groups
        if (dotDanhGiaData) {
          const data = await UserGetListDanhGia(maNguoiDung);

          // Ensure data is an array
          const groupsList = Array.isArray(data) ? data : [data];
          setGroupsData(groupsList);

          // Initialize all groups as expanded
          const initialExpandedState = {};
          groupsList.forEach((group, index) => {
            initialExpandedState[index] = true;
          });
          setExpandedGroups(initialExpandedState);
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maNguoiDung]);

  const toggleGroupExpanded = (groupIndex) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupIndex]: !prev[groupIndex],
    }));
  };

  const handleEvaluate = async (evaluation) => {
    try {
      setSubmitting(true);
      const data = await GetFormDanhGia(evaluation.maDanhGia);

      setEvaluationData(data);
      setSelectedEvaluation(evaluation);
      setViewMode(false);

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

  const handleEditEvaluation = async (evaluation) => {
    try {
      setSubmitting(true);

      // Fetch the evaluation data by ID
      const data = await GetDanhGiaById(evaluation.maDanhGia);

      // Set up the evaluation form with existing data
      setEvaluationData({
        danhSachCauHoi: data.danhSachCauTraLoi.map((answer) => ({
          maCauHoi: answer.maCauHoi,
          noiDung: answer.noiDung,
          diemToiDa: 10, // Assuming max score is 10, adjust if needed
        })),
      });

      setSelectedEvaluation(evaluation);

      // Initialize answers with existing values
      const initialAnswers = {};
      data.danhSachCauTraLoi.forEach((answer) => {
        initialAnswers[answer.maCauHoi] = answer.traLoi;
      });
      setAnswers(initialAnswers);

      setViewMode(false); // Edit mode
      setShowEvaluationForm(true);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu đánh giá.");
      console.error(err);
      alert("Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewEvaluation = async (evaluation) => {
    try {
      setSubmitting(true);

      // Fetch the evaluation data by ID
      const data = await GetDanhGiaById(evaluation.maDanhGia);

      // Set up the evaluation form with existing data
      setEvaluationData({
        danhSachCauHoi: data.danhSachCauTraLoi.map((answer) => ({
          maCauHoi: answer.maCauHoi,
          noiDung: answer.noiDung,
          diemToiDa: 10, // Assuming max score is 10, adjust if needed
        })),
      });

      setSelectedEvaluation(evaluation);

      // Initialize answers with existing values
      const initialAnswers = {};
      data.danhSachCauTraLoi.forEach((answer) => {
        initialAnswers[answer.maCauHoi] = answer.traLoi;
      });
      setAnswers(initialAnswers);

      setViewMode(true); // View-only mode
      setShowEvaluationForm(true);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu đánh giá.");
      console.error(err);
      alert("Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    if (viewMode) return; // Prevent changes in view mode

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
        return;
      }

      const formData = {
        maDanhGia: selectedEvaluation.maDanhGia,
        cauHoiTraLoi: Object.entries(answers).map(([maCauHoi, traLoi]) => ({
          maCauHoi: Number.parseInt(maCauHoi),
          traLoi,
        })),
      };

      await submitDanhGia(formData);

      setShowEvaluationForm(false);
      alert("Đánh giá đã được gửi thành công!");

      // Refresh the evaluation list
      const data = await UserGetListDanhGia(maNguoiDung);
      const groupsList = Array.isArray(data) ? data : [data];
      setGroupsData(groupsList);
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
    setViewMode(false);
  };

  // Calculate completion stats for a group
  const getGroupStats = (group) => {
    if (!group || !Array.isArray(group.thanhViens))
      return { total: 0, completed: 0, percentage: 0 };

    const total = group.thanhViens.length;
    const completed = group.thanhViens.filter(
      (member) => member.trangThai !== "Chưa đánh giá"
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  };

  // Check if an evaluation is a self-evaluation
  const isSelfEvaluation = (member) => {
    return member.maNguoiDuocDanhGia === maNguoiDung;
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

  if (!Array.isArray(groupsData) || groupsData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Không tìm thấy nhóm
            </h2>
            <p className="text-gray-500">
              Bạn chưa được phân vào nhóm nào hoặc không có quyền đánh giá.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative py-2 px-2">
      {/* Evaluation Form Modal */}
      {showEvaluationForm && evaluationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start p-0 sm:p-4">
          <div className="bg-white rounded-none sm:rounded-lg shadow-xl max-w-full sm:max-w-4xl w-full h-screen sm:h-auto max-h-screen sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                {viewMode ? (
                  <>
                    <Eye className="h-5 w-5 mr-2 text-cyan-600" />
                    Xem đánh giá: {selectedEvaluation.hoTen}
                    {isSelfEvaluation(selectedEvaluation) && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Tự đánh giá
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {selectedEvaluation.trangThai === "Chưa đánh giá" ? (
                      <>
                        <ClipboardList className="h-5 w-5 mr-2 text-cyan-600" />
                        Đánh giá: {selectedEvaluation.hoTen}
                        {isSelfEvaluation(selectedEvaluation) && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Tự đánh giá
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <Edit className="h-5 w-5 mr-2 text-cyan-600" />
                        Chỉnh sửa đánh giá: {selectedEvaluation.hoTen}
                        {isSelfEvaluation(selectedEvaluation) && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Tự đánh giá
                          </span>
                        )}
                      </>
                    )}
                  </>
                )}
              </h2>
              <button
                onClick={closeEvaluationForm}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4">
              {!viewMode && (
                <div
                  className={`mb-6 p-4 rounded-md border ${
                    isSelfEvaluation(selectedEvaluation)
                      ? "bg-purple-50 border-purple-100"
                      : "bg-cyan-50 border-cyan-100"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isSelfEvaluation(selectedEvaluation)
                        ? "text-purple-700"
                        : "text-cyan-700"
                    }`}
                  >
                    <span className="font-medium">
                      {isSelfEvaluation(selectedEvaluation)
                        ? "Đây là phần tự đánh giá. Hãy đánh giá bản thân một cách khách quan và trung thực để giúp cải thiện năng lực của chính mình."
                        : "Xin các anh/chị hãy đánh giá đồng nghiệp một cách chân thành và khách quan — những góp ý xây dựng của anh/chị sẽ là động lực quý giá giúp công ty ngày càng vững mạnh và phát triển !!!"}
                    </span>
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {evaluationData.danhSachCauHoi &&
                  evaluationData.danhSachCauHoi.map((question, index) => (
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
                                flex items-center justify-center w-10 h-10 rounded-full 
                                ${
                                  viewMode &&
                                  answers[question.maCauHoi] !== value
                                    ? "bg-gray-100 text-gray-400 cursor-default"
                                    : answers[question.maCauHoi] === value
                                    ? isSelfEvaluation(selectedEvaluation)
                                      ? "bg-purple-500 text-white"
                                      : "bg-cyan-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
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
                                  disabled={viewMode}
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
                {viewMode ? "Đóng" : "Hủy"}
              </button>

              {!viewMode && (
                <button
                  onClick={handleSubmitEvaluation}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    isSelfEvaluation(selectedEvaluation)
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                      : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isSelfEvaluation(selectedEvaluation)
                      ? "focus:ring-purple-500"
                      : "focus:ring-cyan-500"
                  } ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Đang gửi...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      {selectedEvaluation.trangThai === "Chưa đánh giá"
                        ? "Gửi đánh giá"
                        : "Cập nhật đánh giá"}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Users className="h-6 w-6 mr-2 text-cyan-600" />
                Đánh giá nhóm & Tự đánh giá
              </h1>
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
        </div>

        {/* Groups */}
        {groupsData.map((group, groupIndex) => {
          // Skip rendering if group doesn't have the expected structure
          if (!group || !group.tenNhom || !Array.isArray(group.thanhViens)) {
            return null;
          }

          const { total, completed, percentage } = getGroupStats(group);

          return (
            <div
              key={groupIndex}
              className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
            >
              {/* Group Header */}
              <div
                className="px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => toggleGroupExpanded(groupIndex)}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-cyan-600" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Nhóm: <span className="text-cyan-700">{group.tenNhom}</span>
                  </h2>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Progress indicator */}
                  <div className="hidden sm:block">
                    <div className="flex items-center">
                      <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-cyan-600 h-2.5 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {completed}/{total}
                      </span>
                    </div>
                  </div>

                  {expandedGroups[groupIndex] ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Group Content */}
              {expandedGroups[groupIndex] && (
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
                            Chức vụ
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
                        {group.thanhViens.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="px-6 py-10 text-center text-sm text-gray-500"
                            >
                              Không có thành viên nào trong nhóm
                            </td>
                          </tr>
                        ) : (
                          group.thanhViens.map((member) => {
                            const isSelf = isSelfEvaluation(member);
                            return (
                              <tr
                                key={member.maDanhGia}
                                className={`hover:bg-gray-50 ${
                                  isSelf ? "bg-purple-50" : ""
                                }`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {member.maDanhGia}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                  <div className="flex items-center">
                                    {member.hoTen}
                                    {isSelf && (
                                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        <UserCheck className="h-3 w-3 mr-1" />
                                        Tự đánh giá
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {member.tenChucVu}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {member.trangThai === "Chưa đánh giá" ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      {member.trangThai}
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      {member.trangThai}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end space-x-2">
                                    {member.trangThai === "Chưa đánh giá" ? (
                                      <button
                                        onClick={() => handleEvaluate(member)}
                                        disabled={submitting}
                                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white ${
                                          isSelf
                                            ? "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                                            : "bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                          isSelf
                                            ? "focus:ring-purple-500"
                                            : "focus:ring-cyan-500"
                                        } ${
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
                                        <button
                                          onClick={() =>
                                            handleEditEvaluation(member)
                                          }
                                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md ${
                                            isSelf
                                              ? "text-purple-700 bg-purple-50 hover:bg-purple-100"
                                              : "text-amber-700 bg-amber-50 hover:bg-amber-100"
                                          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            isSelf
                                              ? "focus:ring-purple-500"
                                              : "focus:ring-amber-500"
                                          }`}
                                        >
                                          <Edit className="h-4 w-4 mr-1.5" />
                                          <span className="hidden sm:inline">
                                            Sửa
                                          </span>
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleViewEvaluation(member)
                                          }
                                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md ${
                                            isSelf
                                              ? "text-purple-700 bg-purple-50 hover:bg-purple-100"
                                              : "text-cyan-700 bg-cyan-50 hover:bg-cyan-100"
                                          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            isSelf
                                              ? "focus:ring-purple-500"
                                              : "focus:ring-cyan-500"
                                          }`}
                                        >
                                          <Eye className="h-4 w-4 mr-1.5" />
                                          <span className="hidden sm:inline">
                                            Xem
                                          </span>
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserEvaluation;
