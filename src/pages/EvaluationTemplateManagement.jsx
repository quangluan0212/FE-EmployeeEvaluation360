"use client";

import { useEffect, useState } from "react";
import {
  GetAllMauDanhGiaPagedAsync,
  addMauDanhGia,
  updateMauDanhGia,
  deleteMauDanhGia,
} from "../api/MauDanhGia";
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const EvaluationTemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [validationError, setValidationError] = useState("");

  const [currentTemplate, setCurrentTemplate] = useState({
    maMauDanhGia: "",
    tenMau: "",
    loaiDanhGia: "LEADER",
    danhSachCauHoi: [{ noiDung: "", diemToiDa: 0 }],
  });

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

  const requiredTypes = [
    "LEADER",
    "TEAM",
    "ADMIN-LEADER",
    "NHANVIEN",
    "NHANVIEN-LEADER",
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const response = await GetAllMauDanhGiaPagedAsync(
          currentPage,
          10,
          searchTerm
        );
        if (response.items) {
          setTemplates(response.items);
          setTotalPages(response.totalPages);
        } else {
          console.error("Unexpected response format:", response);
          setTemplates([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplates([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [currentPage, searchTerm]);

  const handleAddTemplate = () => {
    setCurrentTemplate({
      maMauDanhGia: "",
      tenMau: "",
      loaiDanhGia: "LEADER",
      danhSachCauHoi: [{ noiDung: "", diemToiDa: 0 }],
    });
    setValidationError("");
    setShowModal(true);
  };

  const handleEditTemplate = (template) => {
    setCurrentTemplate({
      maMauDanhGia: template.maMauDanhGia,
      tenMau: template.tenMau,
      loaiDanhGia: template.loaiDanhGia,
      danhSachCauHoi:
        template.danhSachCauHoi.length > 0
          ? template.danhSachCauHoi
          : [{ noiDung: "", diemToiDa: 0 }],
    });
    setValidationError("");
    setShowModal(true);
  };

  const handleDeleteTemplate = async (maMauDanhGia) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa mẫu đánh giá này?"
    );
    if (!confirmed) return;

    try {
      await deleteMauDanhGia(maMauDanhGia);
      alert("Xóa mẫu đánh giá thành công!");
      setTemplates((prev) =>
        prev.filter((t) => t.maMauDanhGia !== maMauDanhGia)
      );
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Xóa mẫu đánh giá thất bại. Vui lòng thử lại!");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setValidationError("");
  };

  const handleAddQuestion = () => {
    setCurrentTemplate((prev) => ({
      ...prev,
      danhSachCauHoi: [...prev.danhSachCauHoi, { noiDung: "", diemToiDa: 0 }],
    }));
  };

  const handleRemoveQuestion = (index) => {
    setCurrentTemplate((prev) => ({
      ...prev,
      danhSachCauHoi: prev.danhSachCauHoi.filter((_, i) => i !== index),
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setCurrentTemplate((prev) => {
      const updatedQuestions = [...prev.danhSachCauHoi];
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
      return { ...prev, danhSachCauHoi: updatedQuestions };
    });
  };

  const validateForm = () => {
    if (!currentTemplate.tenMau.trim()) {
      setValidationError("Tên mẫu đánh giá không được để trống!");
      return false;
    }

    if (!currentTemplate.loaiDanhGia) {
      setValidationError("Vui lòng chọn loại đánh giá!");
      return false;
    }

    if (currentTemplate.danhSachCauHoi.length === 0) {
      setValidationError("Phải có ít nhất một câu hỏi!");
      return false;
    }

    const totalPoints = currentTemplate.danhSachCauHoi.reduce(
      (sum, q) => sum + Number(q.diemToiDa),
      0
    );
    if (totalPoints !== 100) {
      setValidationError(
        `Tổng điểm tối đa của các câu hỏi phải bằng 100! Hiện tại: ${totalPoints}`
      );
      return false;
    }

    for (const question of currentTemplate.danhSachCauHoi) {
      if (!question.noiDung.trim()) {
        setValidationError("Nội dung câu hỏi không được để trống!");
        return false;
      }
      if (question.diemToiDa <= 0) {
        setValidationError("Điểm tối đa của câu hỏi phải lớn hơn 0!");
        return false;
      }
    }

    return true;
  };

  const handleSaveTemplate = async () => {
    if (!validateForm()) return;

    try {
      const templateData = {
        tenMau: currentTemplate.tenMau,
        loaiDanhGia: currentTemplate.loaiDanhGia,
        danhSachCauHoi: currentTemplate.danhSachCauHoi,
      };

      if (currentTemplate.maMauDanhGia) {
        const confirmed = window.confirm(
          "Bạn có chắc chắn muốn cập nhật mẫu đánh giá này?"
        );
        if (!confirmed) return;

        const updatedTemplate = await updateMauDanhGia(
          currentTemplate.maMauDanhGia,
          templateData
        );
        alert("Cập nhật mẫu đánh giá thành công!");
        setTemplates((prev) =>
          prev.map((t) =>
            t.maMauDanhGia === updatedTemplate.maMauDanhGia
              ? updatedTemplate
              : t
          )
        );
      } else {
        const newTemplate = await addMauDanhGia(templateData);
        alert("Thêm mẫu đánh giá thành công!");
        const response = await GetAllMauDanhGiaPagedAsync(
          currentPage,
          10,
          searchTerm
        );
        setTemplates(response.items || []);
        setTotalPages(response.totalPages || 1) - OK;
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Lưu mẫu đánh giá thất bại. Vui lòng thử lại!");
    }
  };

  const getTypeDisplayName = (type) => {
    const typeMap = {
      NHANVIEN: "Mẫu nhân viên tự đánh giá",
      LEADER: "Mẫu Leader tự đánh giá",
      TEAM: "Mẫu đánh giá chéo trong nhóm",
      "ADMIN-LEADER": "Mẫu Admin-Leader",
      "NHANVIEN-LEADER": "Mẫu nhân viên đánh giá Leader",
    };
    return typeMap[type] || type;
  };

  return (
    <div className="w-full mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <FileText className="h-7 w-7 text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý mẫu đánh giá
          </h1>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Tìm kiếm mẫu đánh giá..."
              className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={handleAddTemplate}
            className="w-full md:w-auto px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Thêm mẫu đánh giá
          </button>
        </div>
      </div>

      {/* Templates Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên mẫu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại đánh giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạnh thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    <span className="ml-3 text-gray-600">
                      Đang tải dữ liệu...
                    </span>
                  </div>
                </td>
              </tr>
            ) : templates.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  Không có mẫu đánh giá nào
                </td>
              </tr>
            ) : (
              templates.map((template) => (
                <tr
                  key={template.maMauDanhGia}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {template.maMauDanhGia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {template.tenMauDanhGia}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {getTypeDisplayName(template.loaiDanhGia)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(template.trangThai)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="p-1.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                        title="Sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteTemplate(template.maMauDanhGia)
                        }
                        className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-xl shadow-md">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentPage === 1 || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Trang trước
        </button>

        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            Trang <span className="font-medium">{currentPage}</span> /{" "}
            <span className="font-medium">{totalPages}</span>
          </span>
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentPage === totalPages || isLoading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          }`}
        >
          Trang sau
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {/* Modal for adding/editing template */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl transform transition-all animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                {currentTemplate.maMauDanhGia ? (
                  <>
                    <Edit className="h-5 w-5 mr-2 text-indigo-600" />
                    Cập nhật mẫu đánh giá
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2 text-indigo-600" />
                    Thêm mẫu đánh giá mới
                  </>
                )}
              </h2>
              <button
                onClick={handleModalClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {validationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 flex items-start">
                  <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                  {validationError}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên mẫu đánh giá
                </label>
                <input
                  type="text"
                  value={currentTemplate.tenMau}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      tenMau: e.target.value,
                    })
                  }
                  placeholder="Nhập tên mẫu đánh giá"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại đánh giá
                </label>
                <select
                  value={currentTemplate.loaiDanhGia}
                  onChange={(e) =>
                    setCurrentTemplate({
                      ...currentTemplate,
                      loaiDanhGia: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  {requiredTypes.map((type) => (
                    <option key={type} value={type}>
                      {getTypeDisplayName(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh sách câu hỏi
                </label>
                <div className="space-y-4 max-h-64 overflow-y-auto p-2 bg-gray-50 rounded-lg border border-gray-200">
                  {currentTemplate.danhSachCauHoi.map((question, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 p-3 bg-white rounded-md shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          Câu hỏi {index + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveQuestion(index)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={question.noiDung}
                        onChange={(e) =>
                          handleQuestionChange(index, "noiDung", e.target.value)
                        }
                        placeholder="Nhập nội dung câu hỏi"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                      <input
                        type="number"
                        value={question.diemToiDa}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "diemToiDa",
                            Number(e.target.value)
                          )
                        }
                        placeholder="Điểm tối đa"
                        min="0"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleAddQuestion}
                    className="w-full px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Thêm câu hỏi
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleModalClose}
                className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {currentTemplate.maMauDanhGia ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationTemplateManagement;
