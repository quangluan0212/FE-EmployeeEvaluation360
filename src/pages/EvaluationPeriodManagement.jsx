"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Edit2,
  Plus,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  StopCircle,
  CalendarIcon,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  GetListDotDanhGia,
  CreateDotDanhGia,
  UpdateDotDanhGia,
  EndDotDanhGia,
} from "../api/DotDangGia";

const EvaluationPeriodManagement = () => {
  const [evaluationPeriods, setEvaluationPeriods] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [formData, setFormData] = useState({
    tenDot: "",
    ngayBatDau: "",
    ngayKetThuc: "",
  });

  useEffect(() => {
    fetchEvaluationPeriods();
  }, []);

  const fetchEvaluationPeriods = async () => {
    setIsLoading(true);
    try {
      const data = await GetListDotDanhGia();
      setEvaluationPeriods(data);

      // Find current active period
      const activePeriod = data.find((period) => period.trangThai === "Active");
      setCurrentPeriod(activePeriod || null);
    } catch (error) {
      console.error("Error fetching evaluation periods:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePeriod = () => {
    setFormData({
      tenDot: "",
      ngayBatDau: "",
      ngayKetThuc: "",
    });
    setShowCreateModal(true);
  };

  const handleEditPeriod = (period) => {
    setFormData({
      maDotDanhGia: period.maDotDanhGia,
      tenDot: period.tenDot,
      ngayBatDau: formatDateTimeForInput(period.thoiGianBatDau),
      ngayKetThuc: formatDateTimeForInput(period.thoiGianKetThuc),
    });
    setShowEditModal(true);
  };

  const handleEndPeriod = async (maDotDanhGia) => {
    const confirmed = window.confirm(
      "Kết thúc đợt đánh giá đồng nghĩa với việc hệ thống sẽ bắt đầu tính kết quả đánh giá cho đợt đánh giá này. Bạn có chắc chắn muốn kết thúc đợt đánh giá này?"
    );
    if (!confirmed) return;

    try {
      await EndDotDanhGia(maDotDanhGia);
      alert("Kết thúc đợt đánh giá thành công!");
      fetchEvaluationPeriods();
    } catch (error) {
      console.error("Error ending evaluation period:", error);
      alert("Có lỗi xảy ra khi kết thúc đợt đánh giá!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    if (!formData.tenDot || !formData.ngayBatDau || !formData.ngayKetThuc) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await CreateDotDanhGia({
        tenDot: formData.tenDot,
        ngayBatDau: formData.ngayBatDau,
        ngayKetThuc: formData.ngayKetThuc,
      });
      alert("Tạo đợt đánh giá thành công!");
      setShowCreateModal(false);
      fetchEvaluationPeriods();
    } catch (error) {
      console.error("Error creating evaluation period:", error);
      alert("Có lỗi xảy ra khi tạo đợt đánh giá!");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!formData.tenDot || !formData.ngayBatDau || !formData.ngayKetThuc) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      await UpdateDotDanhGia({
        maDotDanhGia: formData.maDotDanhGia,
        tenDot: formData.tenDot,
        ngayBatDau: formData.ngayBatDau,
        ngayKetThuc: formData.ngayKetThuc,
      });
      alert("Cập nhật đợt đánh giá thành công!");
      setShowEditModal(false);
      fetchEvaluationPeriods();
    } catch (error) {
      console.error("Error updating evaluation period:", error);
      alert("Có lỗi xảy ra khi cập nhật đợt đánh giá!");
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTimeForInput = (dateString) => {
    try {
      // Format to YYYY-MM-DDThh:mm which is required for datetime-local input
      return format(parseISO(dateString), "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      return "";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đang hoạt động
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <StopCircle className="w-3 h-3 mr-1" />
            Đã kết thúc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full h-full mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <Calendar className="h-7 w-7 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý đợt đánh giá
          </h1>
        </div>

        <button
          onClick={handleCreatePeriod}
          className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tạo đợt đánh giá mới
        </button>
      </div>

      {/* Current Evaluation Period Card */}
      {currentPeriod ? (
        <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-gray-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Đợt đánh giá hiện tại
            </h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {currentPeriod.tenDot}
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span>
                      Bắt đầu: {formatDate(currentPeriod.thoiGianBatDau)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                    <span>
                      Kết thúc: {formatDate(currentPeriod.thoiGianKetThuc)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <button
                  onClick={() => handleEditPeriod(currentPeriod)}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Sửa
                </button>
                <button
                  onClick={() => handleEndPeriod(currentPeriod.maDotDanhGia)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center"
                >
                  <StopCircle className="h-4 w-4 mr-2" />
                  Kết thúc
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-4">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Không có đợt đánh giá nào đang hoạt động
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600">
              Vui lòng tạo đợt đánh giá mới để bắt đầu.
            </p>
          </div>
        </div>
      )}

      {/* Evaluation Periods List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Danh sách đợt đánh giá
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đợt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên đợt đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian bắt đầu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian kết thúc
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-gray-600">
                        Đang tải dữ liệu...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : evaluationPeriods.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không có đợt đánh giá nào
                  </td>
                </tr>
              ) : (
                evaluationPeriods.map((period) => (
                  <tr
                    key={period.maDotDanhGia}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {period.maDotDanhGia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {period.tenDot}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(period.thoiGianBatDau)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(period.thoiGianKetThuc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(period.trangThai)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPeriod(period)}
                          className="p-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                          title="Sửa"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        {period.trangThai === "Active" && (
                          <button
                            onClick={() => handleEndPeriod(period.maDotDanhGia)}
                            className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            title="Kết thúc"
                          >
                            <StopCircle className="h-4 w-4" />
                          </button>
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-600" />
                Tạo đợt đánh giá mới
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-blue-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đợt đánh giá
                </label>
                <input
                  type="text"
                  name="tenDot"
                  value={formData.tenDot}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đợt đánh giá"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian bắt đầu
                  <span className="text-xs text-gray-500 ml-1">
                    (Ngày và giờ)
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="ngayBatDau"
                  value={formData.ngayBatDau}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian kết thúc
                  <span className="text-xs text-gray-500 ml-1">
                    (Ngày và giờ)
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="ngayKetThuc"
                  value={formData.ngayKetThuc}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Edit2 className="h-5 w-5 mr-2 text-blue-600" />
                Chỉnh sửa đợt đánh giá
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đợt đánh giá
                </label>
                <input
                  type="text"
                  name="tenDot"
                  value={formData.tenDot}
                  onChange={handleInputChange}
                  placeholder="Nhập tên đợt đánh giá"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian bắt đầu
                  <span className="text-xs text-gray-500 ml-1">
                    (Ngày và giờ)
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="ngayBatDau"
                  value={formData.ngayBatDau}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian kết thúc
                  <span className="text-xs text-gray-500 ml-1">
                    (Ngày và giờ)
                  </span>
                </label>
                <input
                  type="datetime-local"
                  name="ngayKetThuc"
                  value={formData.ngayKetThuc}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationPeriodManagement;
