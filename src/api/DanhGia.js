import apiClient from "./api";

export const GetFormDanhGia = async (
  nguoiDanhGia,
  nguoiDuocDanhGia,
  maDotDanhGia
) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(`DanhGia/danh-gia`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        nguoiDanhGia,
        nguoiDuocDanhGia,
        maDotDanhGia,
      },
    });
    if (response.code == 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Có lỗi xảy ra,", error);
    throw error;
  }
};

export const getCurrentDotDanhGia = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(`DotDanhGia/dot-danh-gia-hien-tai`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.code == 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Có lỗi xảy ra,", error);
    throw error;
  }
};
