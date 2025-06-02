import { Calendar } from "lucide-react";
import { formatDate } from "../utils/exportUtils";

const EvaluationsTable = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onSearch,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-cyan-600" />
            Kết quả đánh giá
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo mã đánh giá, họ tên..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={onSearch}
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={`${item.maKetQuaDanhGia}-${index}`}
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
      </div>
    </div>
  );
};

export default EvaluationsTable;
