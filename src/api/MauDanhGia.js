import apiClient from "./api";

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

export const updateMauDanhGia = async (data) => {
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
