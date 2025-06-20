import apiClient from "./api";

// Lấy thông tin mẫu đánh giá theo ID
export const getMauDanhGiaById = async (maMau) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.get(
      `/MauDanhGia/admin-get-thong-tin-mau-danh-gia`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          maMau: maMau,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting MauDanhGia by ID:", error);
    throw error;
  }
};

export const addMauDanhGia = async (data) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.post(
      "/MauDanhGia/tao-mau-danh-gia",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding MauDanhGia:", error);
    throw error;
  }
};

export const updateMauDanhGia = async (maMau, data) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.put(
      `/MauDanhGia/admin-cap-nhat-mau-danh-gia`,data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          maMau: maMau,

        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating MauDanhGia:", error);
    throw error;
  }
};

export const deleteMauDanhGia = async (data) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.post(
      "/MauDanhGia/tao-mau-danh-gia",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding MauDanhGia:", error);
    throw error;
  }
};

export const GetAllMauDanhGiaActive = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.get(
      "/MauDanhGia/admin-danh-sach-mau-danh-gia-active",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching active MauDanhGia:", error);
    throw error;
  }
};

export const GetAllMauDanhGiaPagedAsync = async (page, pageSize, search) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.get(
      "/MauDanhGia/admin-danh-sach-mau-danh-gia",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          pageSize: pageSize,
          search: search,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching active MauDanhGia:", error);
    throw error;
  }
};

export const GetAllMauDanhGiaByMDDG = async (MaDotDanhGia) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    const response = await apiClient.get(
      `/MauDanhGia/admin-get-danh-sach-mau-danh-gia-by-mddg`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          MaDotDanhGia: MaDotDanhGia,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching MauDanhGia by MaDotDanhGia:", error);
    throw error;
  }
};
