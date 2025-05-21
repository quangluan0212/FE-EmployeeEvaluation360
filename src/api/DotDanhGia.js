import apiClient from "./api";

export const GetListDotDanhGia = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(
      `DotDanhGia/admin-get-danh-sach-dot-danh-gia`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.code == 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Có lỗi xảy ra,", error);
    throw error;
  }
};

export const CreateDotDanhGia = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.post(
      `DotDanhGia/them-dot-danh-gia`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.code == 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Có lỗi xảy ra,", error);
    throw error;
  }
};

export const UpdateDotDanhGia = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.put(
      `DotDanhGia/admin-update-dot-danh-gia`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.code == 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Có lỗi xảy ra,", error);
    throw error;
  }
};
export const EndDotDanhGia = async (maDotDanhGia) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.put(
      `DotDanhGia/admin-ket-thuc-dot-danh-gia`, null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          maDotDanhGia: maDotDanhGia,
        },
      }
    );
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
