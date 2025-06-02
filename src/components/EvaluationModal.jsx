import { Download, X, Loader2 } from "lucide-react";
import { formatDate } from "../utils/exportUtils";

const EvaluationModal = ({
  showModal,
  modalData,
  modalLoading,
  modalSearchQuery,
  modalCurrentPage,
  modalTotalPages,
  onClose,
  onSearch,
  onPageChange,
  onExport,
  setModalSearchQuery,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-5/6 flex flex-col">
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
              onClick={onExport}
              className="mr-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
              disabled={modalLoading}
            >
              <Download className="inline h-4 w-4 mr-2" /> Xuất Excel
            </button>
            <button
              onClick={onClose}
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
                onClick={onSearch}
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
                onClick={() => onPageChange(modalCurrentPage - 1)}
                disabled={modalCurrentPage === 1 || modalLoading}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => onPageChange(modalCurrentPage + 1)}
                disabled={modalCurrentPage === modalTotalPages || modalLoading}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
        {/* Modal Table with Loading */}
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
  );
};

export default EvaluationModal;
