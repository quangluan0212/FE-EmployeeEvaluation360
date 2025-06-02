import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {
  getLatestQuaDanhGia,
  getGoodQuaDanhGia,
  getBadQuaDanhGia,
} from "../api/KetQuaDanhGia";

export const formatDate = (dateString) => {
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

export const handleExportToExcel = async (
  modalType,
  title,
  maDotDanhGia = null
) => {
  try {
    let data = [];
    if (modalType === "latest") {
      const response = await getLatestQuaDanhGia(maDotDanhGia);
      data = response || [];
    } else if (modalType === "best") {
      const response = await getGoodQuaDanhGia(maDotDanhGia);
      data = response || [];
    } else if (modalType === "worst") {
      const response = await getBadQuaDanhGia(maDotDanhGia);
      data = response || [];
    }
    if (!data.length) {
      console.log("Không có dữ liệu để xuất cho", modalType);
      return;
    }
    const formattedData = data.map((item) => ({
      "Mã đánh giá": item.maKetQuaDanhGia || "N/A",
      "Họ tên": item.hoTen || "N/A",
      "Đợt đánh giá": item.tenDotDanhGia || "N/A",
      "Điểm tổng": item.diemTongKet !== undefined ? item.diemTongKet : "N/A",
      "Thời gian đánh giá": formatDate(item.thoiGianTinh),
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const reportTitle = `BÁO CÁO ${modalType.toUpperCase()} - ${new Date().toLocaleDateString(
      "vi-VN"
    )}`;
    XLSX.utils.sheet_add_aoa(worksheet, [[reportTitle]], { origin: "A1" });
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
    worksheet["!cols"] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 25 },
      { wch: 15 },
      { wch: 25 },
    ];
    const safeTitle = title.length > 31 ? title.substring(0, 31) : title;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, safeTitle);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${title}.xlsx`);
  } catch (error) {
    console.error(`Lỗi khi xuất ${modalType} sang Excel:`, error);
  }
};
