import apiClient from "./api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Token không tồn tại");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAllKetQuaDanhGiaPaged = async (
  page = 1,
  pageSize = 10,
  search = ""
) => {
  try {
    const response = await apiClient.get(
      "/KetQuaDanhGia/get-all-ket-qua-danh-gia-paged",
      {
        headers: getAuthHeaders(),
        params: {
          page,
          pageSize,
          search,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Ket Qua Danh Gia:", error);
    throw error;
  }
};
export const getLatestQuaDanhGiaPaged = async (
  page = 1,
  pageSize = 10,
  search = ""
) => {
  try {
    const response = await apiClient.get(
      "/KetQuaDanhGia/get-latest-ket-qua-danh-gia-paged",
      {
        headers: getAuthHeaders(),
        params: {
          page,
          pageSize,
          search,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching latest Ket Qua Danh Gia:", error);
    throw error;
  }
};
export const getGoodQuaDanhGiaPaged = async (
  page = 1,
  pageSize = 10,
  search = ""
) => {
  try {
    const response = await apiClient.get(
      "/KetQuaDanhGia/get-good-ket-qua-danh-gia-paged",
      {
        headers: getAuthHeaders(),
        params: {
          page,
          pageSize,
          search,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching good Ket Qua Danh Gia:", error);
    throw error;
  }
};
export const getBadQuaDanhGiaPaged = async (
  page = 1,
  pageSize = 10,
  search = ""
) => {
  try {
    const response = await apiClient.get(
      "/KetQuaDanhGia/get-bad-ket-qua-danh-gia-paged",
      {
        headers: getAuthHeaders(),
        params: {
          page,
          pageSize,
          search,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching bad Ket Qua Danh Gia:", error);
    throw error;
  }
};
//excel
export const getAllKetQuaDanhGia = async () => {
  try {
    const response = await apiClient.get(
      "/KetQuaDanhGia/get-all-ket-qua-danh-gia",
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Ket Qua Danh Gia:", error);
    throw error;
  }
};
export const getLatestQuaDanhGia = async () => {
  try {
    const response = await apiClient.get(
      "/KetQuaDanhGia/get-latest-ket-qua-danh-gia",
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching latest Ket Qua Danh Gia:", error);
    throw error;
  }
};
export const getGoodQuaDanhGia = async () => {
  try {
    const response = await apiClient.get(
      "/KetQuaDanhGia/get-good-ket-qua-danh-gia",
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching good Ket Qua Danh Gia:", error);
    throw error;
  }
};
export const getBadQuaDanhGia = async () => {
  try {
    const response = await apiClient.get(
      "/KetQuaDanhGia/get-bad-ket-qua-danh-gia",
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching bad Ket Qua Danh Gia:", error);
    throw error;
  }
};
