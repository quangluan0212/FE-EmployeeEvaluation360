import {
  getAllKetQuaDanhGiaPaged,
  getLatestQuaDanhGiaPaged,
  getGoodQuaDanhGiaPaged,
  getBadQuaDanhGiaPaged,
} from "./KetQuaDanhGia";
import { GetDotDanhGiaByYear } from "./DotDanhGia";
import { getAllNguoiChuaDanhGia, getAllNguoiChuaDanhGiaPaged } from "./DanhGia";
const ITEMS_PER_PAGE = 10;

export const fetchAllEvaluations = async (page, search, maDotDanhGia, setLoading, setError) => {
  try {
    setLoading((prev) => ({ ...prev, all: true }));
    const allRes = await getAllKetQuaDanhGiaPaged(page, ITEMS_PER_PAGE, search, maDotDanhGia);
    if (allRes && allRes.items) {
      return allRes;
    } else {
      return { items: [], totalPages: 1 };
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách đánh giá:", err);
    setError(err.message || "Lỗi khi tải danh sách đánh giá.");
    return { items: [], totalPages: 1 };
  } finally {
    setLoading((prev) => ({ ...prev, all: false }));
  }
};

export const fetchLatestEvaluations = async (page, search, isModal, maDotDanhGia, setLoading, setError) => {
  try {
    if (isModal) {
      // Modal loading handled in useModal
    } else {
      setLoading((prev) => ({ ...prev, latest: true }));
    }
    const latestRes = await getLatestQuaDanhGiaPaged(page, ITEMS_PER_PAGE, search, maDotDanhGia);
    if (latestRes?.items?.length) {
      return latestRes;
    } else {
      return { items: [], totalCount: 0, totalPages: 1 };
    }
  } catch (err) {
    console.error("Lỗi khi tải đánh giá gần đây:", err);
    setError(err.message || "Lỗi khi tải đánh giá gần đây.");
    return { items: [], totalCount: 0, totalPages: 1 };
  } finally {
    if (!isModal) {
      setLoading((prev) => ({ ...prev, latest: false }));
    }
  }
};

export const fetchBestEvaluation = async (page, search, isModal, maDotDanhGia, setLoading, setError) => {
  try {
    if (isModal) {
      // Modal loading handled in useModal
    } else {
      setLoading((prev) => ({ ...prev, best: true }));
    }
    const bestRes = await getGoodQuaDanhGiaPaged(page, ITEMS_PER_PAGE, search, maDotDanhGia);
    if (bestRes?.items?.length) {
      return bestRes;
    } else {
      return { items: [], totalCount: 0, totalPages: 1 };
    }
  } catch (err) {
    console.error("Lỗi khi tải đánh giá tốt nhất:", err);
    setError(err.message || "Lỗi khi tải đánh giá tốt nhất.");
    return { items: [], totalCount: 0, totalPages: 1 };
  } finally {
    if (!isModal) {
      setLoading((prev) => ({ ...prev, best: false }));
    }
  }
};

export const fetchWorstEvaluation = async (page, search, isModal, maDotDanhGia, setLoading, setError) => {
  try {
    if (isModal) {
      // Modal loading handled in useModal
    } else {
      setLoading((prev) => ({ ...prev, worst: true }));
    }
    const worstRes = await getBadQuaDanhGiaPaged(page, ITEMS_PER_PAGE, search, maDotDanhGia);
    if (worstRes?.items?.length) {
      return worstRes;
    } else {
      return { items: [], totalCount: 0, totalPages: 1 };
    }
  } catch (err) {
    console.error("Lỗi khi tải đánh giá kém nhất:", err);
    setError(err.message || "Lỗi khi tải đánh giá kém nhất.");
    return { items: [], totalCount: 0, totalPages: 1 };
  } finally {
    if (!isModal) {
      setLoading((prev) => ({ ...prev, worst: false }));
    }
  }
};

export const fetchDotDanhGia = async (year, setError) => {
  try {
    const response = await GetDotDanhGiaByYear(year);
    console.log("DotDanhGia response:", response);
    if (Array.isArray(response) && response.length > 0) {
      return response.map((item) => ({
        value: item.maDotDanhGia,
        label: item.tenDot || "Không có tên đợt",
      }));
    } else {
      console.warn("Không có dữ liệu đợt đánh giá cho năm:", year);
      return [];
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách đợt đánh giá:", err);
    setError("Không thể tải danh sách đợt đánh giá.");
    return [];
  }
};

export const fetchAllNguoiChuaDanhGia = async (maDotDanhGia, setLoading, setError) => {
  try {
    setLoading((prev) => ({ ...prev, nguoiChuaDanhGia: true }));
    const response = await getAllNguoiChuaDanhGia(maDotDanhGia);
    if (response && Array.isArray(response)) {
      return response;
    } else {
      console.warn("Không có dữ liệu người chưa đánh giá:", response);
      return [];
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách người chưa đánh giá:", err);
    setError(err.message || "Lỗi khi tải danh sách người chưa đánh giá.");
    return [];
  } finally {
    setLoading((prev) => ({ ...prev, nguoiChuaDanhGia: false }));
  }
};

export const fetchAllNguoiChuaDanhGiaPaged = async (page, search, maDotDanhGia, setLoading, setError) => {
  try {
    setLoading((prev) => ({ ...prev, nguoiChuaDanhGiaPaged: true }));
    const response = await getAllNguoiChuaDanhGiaPaged(page, ITEMS_PER_PAGE, search, maDotDanhGia);
    if (response && Array.isArray(response.data.items)) {
      return {
        items: response.data.items,
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        totalCount: response.totalCount || 0,
      };
    } else {
      console.warn("Không có dữ liệu người chưa đánh giá phân trang:", response);
      return { items: [], currentPage: 1, totalPages: 1, totalCount: 0 };
    }
  } catch (err) {
    console.error("Lỗi khi tải danh sách người chưa đánh giá phân trang:", err);
    setError(err.message || "Lỗi khi tải danh sách người chưa đánh giá phân trang.");
    return { items: [], currentPage: 1, totalPages: 1, totalCount: 0 };
  } finally {
    setLoading((prev) => ({ ...prev, nguoiChuaDanhGiaPaged: false }));
  }
};