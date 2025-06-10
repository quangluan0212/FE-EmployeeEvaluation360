import React, { useState, useEffect } from "react";
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
  Info,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  GetListDotDanhGia,
  CreateDotDanhGia,
  UpdateDotDanhGia,
  EndDotDanhGia,
  getCurrentDotDanhGia,
} from "../api/DotDanhGia";
import {
  GetAllMauDanhGiaActive,
  GetAllMauDanhGiaByMDDG,
} from "../api/MauDanhGia";
import { showSuccess, showError, showConfirm } from "../utils/notifications";

const EvaluationPeriodManagement = () => {
  const [evaluationPeriods, setEvaluationPeriods] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [periodToEnd, setPeriodToEnd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [formData, setFormData] = useState({
    tenDot: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    mauDanhGias: [],
  });
  const [evaluationTemplates, setEvaluationTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const requiredTypes = [
    "LEADER",
    "TEAM",
    "ADMIN-LEADER",
    "NHANVIEN",
    "NHANVIEN-LEADER",
  ];

  const getTemplateTypeDisplayName = (type) => {
    const typeMap = {
      NHANVIEN: "Mẫu nhân viên tự đánh giá",
      LEADER: "Mẫu Leader tự đánh giá",
      TEAM: "Mẫu đánh giá chéo trong nhóm",
      "ADMIN-LEADER": "Mẫu Admin-Leader",
      "NHANVIEN-LEADER": "Mẫu nhân viên đánh giá Leader",
    };
    return typeMap[type] || type;
  };

  useEffect(() => {
    fetchEvaluationPeriods();
    fetchEvaluationTemplates();
  }, []);

  const fetchEvaluationPeriods = async () => {
    setIsLoading(true);
    try {
      const data = await GetListDotDanhGia();
      setEvaluationPeriods(data);
      const activePeriod = await getCurrentDotDanhGia();
      setCurrentPeriod(activePeriod || null);
    } catch (error) {
      console.error("Error fetching evaluation periods:", error);
      showError("Lỗi", "Không thể tải danh sách đợt đánh giá. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvaluationTemplates = async () => {
    try {
      const response = await GetAllMauDanhGiaActive();
      if (response) {
        setEvaluationTemplates(response);
      }
    } catch (error) {
      console.error("Error fetching evaluation templates:", error);
      showError("Lỗi", "Không thể tải danh sách mẫu đánh giá. Vui lòng thử lại!");
    }
  };

  const handleCreatePeriod = () => {
    setFormData({
      tenDot: "",
      ngayBatDau: "",
      ngayKetThuc: "",
      mauDanhGias: [],
    });
    setSelectedTemplates([]);
    setValidationErrors({});
    setShowCreateModal(true);
  };

  const handleEditPeriod = async (period) => {
    try {
      setIsLoading(true);
      const templatesForPeriod = await GetAllMauDanhGiaByMDDG(period.maDotDanhGia);
      const selectedTemplateIds = templatesForPeriod.map((template) => template.maMauDanhGia);

      const validTemplateIds = selectedTemplateIds.filter((id) =>
        evaluationTemplates.some((template) => template.maMauDanhGia === id)
      );

      setFormData({
        maDotDanhGia: period.maDotDanhGia,
        tenDot: period.tenDot,
        ngayBatDau: formatDateTimeForInput(period.thoiGianBatDau),
        ngayKetThuc: formatDateTimeForInput(period.thoiGianKetThuc),
        mauDanhGias: validTemplateIds,
      });

      setSelectedTemplates(validTemplateIds);
      setValidationErrors({});
      setShowEditModal(true);
    } catch (error) {
      console.error("Error fetching evaluation period templates:", error);
      showError("Lỗi", "Không thể tải mẫu đánh giá của đợt đánh giá này!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndPeriod = async (maDotDanhGia) => {
    setPeriodToEnd(maDotDanhGia);
    setShowEndModal(true);
  };

  const confirmEndPeriod = async () => {
    if (!periodToEnd) return;

    try {
      await EndDotDanhGia(periodToEnd);
      showSuccess("Thành công", "Kết thúc đợt đánh giá thành công!");
      setShowEndModal(false);
      setPeriodToEnd(null);
      fetchEvaluationPeriods();
    } catch (error) {
      console.error("Error ending evaluation period:", error);
      showError("Lỗi", "Không thể kết thúc đợt đánh giá. Vui lòng thử lại!");
      setShowEndModal(false);
    }
  };

  const cancelEndPeriod = () => {
    setShowEndModal(false);
    setPeriodToEnd(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleTemplateToggle = (templateId) => {
    const selectedTemplate = evaluationTemplates.find((t) => t.maMauDanhGia === templateId);
    if (!selectedTemplate) return;

    setSelectedTemplates((prev) => {
      if (prev.includes(templateId)) {
        return prev.filter((id) => id !== templateId);
      } else {
        const filteredTemplates = prev.filter((id) => {
          const template = evaluationTemplates.find((t) => t.maMauDanhGia === id);
          return template && template.loaiDanhGia !== selectedTemplate.loaiDanhGia;
        });
        return [...filteredTemplates, templateId];
      }
    });

    if (validationErrors.mauDanhGias) {
      setValidationErrors((prev) => ({
        ...prev,
        mauDanhGias: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.tenDot.trim()) {
      errors.tenDot = "Vui lòng nhập tên đợt đánh giá";
    }

    if (!formData.ngayBatDau) {
      errors.ngayBatDau = "Vui lòng chọn ngày bắt đầu";
    }

    if (!formData.ngayKetThuc) {
      errors.ngayKetThuc = "Vui lòng chọn ngày kết thúc";
    }

    if (formData.ngayBatDau && formData.ngayKetThuc) {
      const startDate = new Date(formData.ngayBatDau);
      const endDate = new Date(formData.ngayKetThuc);
      if (endDate <= startDate) {
        errors.ngayKetThuc = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    const selectedTypeMap = {};
    selectedTemplates.forEach((id) => {
      const template = evaluationTemplates.find((t) => t.maMauDanhGia === id);
      if (template) {
        selectedTypeMap[template.loaiDanhGia] = true;
      }
    });

    const missingTypes = requiredTypes.filter((type) => !selectedTypeMap[type]);
    if (missingTypes.length > 0) {
      errors.mauDanhGias = `Vui lòng chọn đủ các loại mẫu đánh giá: ${missingTypes
        .map((type) => getTemplateTypeDisplayName(type))
        .join(", ")}`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await CreateDotDanhGia({
        tenDot: formData.tenDot,
        ngayBatDau: formData.ngayBatDau,
        ngayKetThuc: formData.ngayKetThuc,
        mauDanhGias: selectedTemplates,
      });
      showSuccess("Thành công", "Tạo đợt đánh giá thành công!");
      setShowCreateModal(false);
      fetchEvaluationPeriods();
    } catch (error) {
      console.error("Error creating evaluation period:", error);
      showError("Lỗi", "Không thể tạo đợt đánh giá. Vui lòng thử lại!");
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updateData = {
        maDotDanhGia: formData.maDotDanhGia,
        tenDot: formData.tenDot,
        ngayBatDau: formData.ngayBatDau,
        ngayKetThuc: formData.ngayKetThuc,
        mauDanhGias: selectedTemplates,
      };

      await UpdateDotDanhGia(updateData);
      showSuccess("Thành công", "Cập nhật đợt đánh giá thành công!");
      setShowEditModal(false);
      fetchEvaluationPeriods();
    } catch (error) {
      console.error("Error updating evaluation period:", error);
      showError("Lỗi", "Không thể cập nhật đợt đánh giá. Vui lòng thử lại!");
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
            Active
          </span>
        );
      case "Inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <StopCircle className="w-3 h-3 mr-1" />
            Inactive
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

  const groupedTemplates = evaluationTemplates.reduce((acc, template) => {
    if (!acc[template.loaiDanhGia]) {
      acc[template.loaiDanhGia] = [];
    }
    acc[template.loaiDanhGia].push(template);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl min-h-screen py-2 px-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <Calendar className="h-7 w-7 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý đợt đánh giá
          </h1>
        </div>
        <button
          onClick={handleCreatePeriod}
          className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Tạo đợt đánh giá mới
        </button>
      </div>

      {currentPeriod ? (
        <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
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
                    <CalendarIcon className="h-4 w-4 mr-2 text-purple-500" />
                    <span>
                      Bắt đầu: {formatDate(currentPeriod.thoiGianBatDau)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-purple-500" />
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

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-purple-600" />
                Tạo đợt đánh giá mới
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="space-y-6">
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
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    validationErrors.tenDot
                      ? "border-red-300"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                />
                {validationErrors.tenDot && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.tenDot}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      validationErrors.ngayBatDau
                        ? "border-red-300"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                  />
                  {validationErrors.ngayBatDau && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.ngayBatDau}
                    </p>
                  )}
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
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      validationErrors.ngayKetThuc
                        ? "border-red-300"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                  />
                  {validationErrors.ngayKetThuc && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.ngayKetThuc}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Chọn mẫu đánh giá
                  </label>
                  <span className="text-xs text-purple-600 font-medium">
                    Đã chọn: {selectedTemplates.length} mẫu
                  </span>
                </div>

                {validationErrors.mauDanhGias && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{validationErrors.mauDanhGias}</span>
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                  <div className="mb-3 p-2 bg-purple-50 border border-purple-100 rounded-md">
                    <p className="text-sm text-purple-700 flex items-start">
                      <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>
                        Bạn cần chọn đúng 1 mẫu đánh giá cho mỗi loại
                      </span>
                    </p>
                  </div>

                  {Object.entries(groupedTemplates).map(([type, templates]) => {
                    const selectedTemplateOfType = selectedTemplates.find((id) => {
                      const template = evaluationTemplates.find(
                        (t) => t.maMauDanhGia === id
                      );
                      return template && template.loaiDanhGia === type;
                    });

                    return (
                      <div key={type} className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 bg-gray-100 p-2 rounded flex justify-between items-center">
                          <span>Loại: {getTemplateTypeDisplayName(type)}</span>
                          {requiredTypes.includes(type) && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                selectedTemplateOfType
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {selectedTemplateOfType ? "Đã chọn" : "Chưa chọn"}
                            </span>
                          )}
                        </h3>
                        <div className="space-y-2">
                          {templates.map((template) => (
                            <div
                              key={template.maMauDanhGia}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                id={`template-${type}-${template.maMauDanhGia}`}
                                checked={selectedTemplates.includes(
                                  template.maMauDanhGia
                                )}
                                onChange={() =>
                                  handleTemplateToggle(template.maMauDanhGia)
                                }
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`template-${type}-${template.maMauDanhGia}`}
                                className="ml-2 block text-sm text-gray-700"
                              >
                                {template.tenMauDanhGia}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Edit2 className="h-5 w-5 mr-2 text-purple-600" />
                Chỉnh sửa đợt đánh giá
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitEdit} className="space-y-6">
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
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      validationErrors.tenDot
                        ? "border-red-300"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                  />
                  {validationErrors.tenDot && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.tenDot}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        validationErrors.ngayBatDau
                          ? "border-red-300"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                    />
                    {validationErrors.ngayBatDau && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationErrors.ngayBatDau}
                      </p>
                    )}
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
                      className={`w-full px-4 py-2.5 rounded-lg border ${
                        validationErrors.ngayKetThuc
                          ? "border-red-300"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                    />
                    {validationErrors.ngayKetThuc && (
                      <p className="mt-1 text-sm text-red-600">
                        {validationErrors.ngayKetThuc}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Chọn mẫu đánh giá
                    </label>
                    <span className="text-xs text-purple-600 font-medium">
                      Đã chọn: {selectedTemplates.length} mẫu
                    </span>
                  </div>

                  {validationErrors.mauDanhGias && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600 flex items-start">
                        <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{validationErrors.mauDanhGias}</span>
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                    <div className="mb-3 p-2 bg-purple-50 border border-purple-100 rounded-md">
                      <p className="text-sm text-purple-700 flex items-start">
                        <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span>
                          Bạn cần chọn đúng 1 mẫu đánh giá cho mỗi loại
                        </span>
                      </p>
                    </div>

                    {Object.entries(groupedTemplates).map(([type, templates]) => {
                      const selectedTemplateOfType = selectedTemplates.find((id) => {
                        const template = evaluationTemplates.find(
                          (t) => t.maMauDanhGia === id
                        );
                        return template && template.loaiDanhGia === type;
                      });

                      return (
                        <div key={type} className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-700 mb-2 bg-gray-100 p-2 rounded flex justify-between items-center">
                            <span>Chọn 1 {getTemplateTypeDisplayName(type)}</span>
                            {requiredTypes.includes(type) && (
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  selectedTemplateOfType
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {selectedTemplateOfType ? "Đã chọn" : "Chưa chọn"}
                              </span>
                            )}
                          </h3>
                          <div className="space-y-2">
                            {templates.map((template) => (
                              <div
                                key={template.maMauDanhGia}
                                className="flex items-center"
                              >
                                <input
                                  type="checkbox"
                                  id={`edit-template-${type}-${template.maMauDanhGia}`}
                                  checked={selectedTemplates.includes(
                                    template.maMauDanhGia
                                  )}
                                  onChange={() =>
                                    handleTemplateToggle(template.maMauDanhGia)
                                  }
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`edit-template-${type}-${template.maMauDanhGia}`}
                                  className="ml-2 block text-sm text-gray-700"
                                >
                                  {template.tenMauDanhGia}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                    className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Cập nhật
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              Xác nhận kết thúc
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn kết thúc đợt đánh giá này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelEndPeriod}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  const result = await showConfirm(
                    "Xác nhận kết thúc",
                    "Bạn có chắc chắn muốn kết thúc đợt đánh giá này? Hành động này không thể hoàn tác.",
                    "Kết thúc",
                    "Hủy",
                    { confirmButtonColor: "#dc2626" }
                  );
                  if (result.isConfirmed) {
                    await confirmEndPeriod();
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 flex items-center"
              >
                <StopCircle className="h-4 w-4 mr-2" />
                Kết thúc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationPeriodManagement;