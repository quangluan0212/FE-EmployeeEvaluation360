import apiClient from "./api";

export const GetFormDanhGia = async (maDanhGia) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(`DanhGia/get-form-danh-gia`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        maDanhGia,
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

export const AdminGetListDanhGiaLeader = async (maNguoiDung) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(
      `DanhGia/admin-danh-sach-danh-gia-leader`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          maNguoiDung: maNguoiDung,
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

export const UserGetListDanhGia = async (maNguoiDung) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(
      `DanhGia/user-danh-sach-danh-gia-team`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          maNguoiDung: maNguoiDung,
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

export const GetDanhGiaById = async (maDanhGia) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(
      `DanhGia/get-danh-gia-by-id/${maDanhGia}`,
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

export const submitDanhGia = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.post(
      `DanhGia/submit-danh-gia`, formData,
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
