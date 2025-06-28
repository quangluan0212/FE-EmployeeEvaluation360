import apiClient from "./api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Token không tồn tại");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const GetAllDanhGiaByLeader = async (maNguoiDung, page = 1, pageSize = 10, search = "", maNhom) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(`DanhGia/leader-get-all-danh-sach-danh-gia-paged`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        maNguoiDung,
        page,
        pageSize,
        search,
        maNhom,
      },
    });
    if (response.code == 200) {
      return response.data;
    }
  } catch (error) {
    console.log("Có lỗi xảy ra khi lấy danh sách đánh giá by leader :,", error);
    throw error;
  }
};

export const getThongBaoDanhGia = async (maNguoiDung) => {
  try {
    const response = await apiClient.get("/DanhGia/thong-bao-danh-gia", {
      headers: getAuthHeaders(),
      params: { maNguoiDung },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Thong Bao Danh Gia:", error);
    throw error;
  }
}

export const getAllNguoiChuaDanhGiaPaged = async (
  page = 1,
  pageSize = 10,
  search = "",
  maDotDanhGia = null
) => {
  try {
    const response = await apiClient.get(
      "/DanhGia/admin-get-all-danh-sach-chua-danh-gia-paged",
      {
        headers: getAuthHeaders(),
        params: {
          page,
          pageSize,
          search,
          maDotDanhGia,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching danh sách chưa đánh giá:", error);
    throw error;
  }
};

export const getAllNguoiChuaDanhGia = async (maDotDanhGia) => {
  try {
    const response = await apiClient.get(
      "DanhGia/admin-get-all-danh-sach-chua-danh-gia",
      {
        headers: getAuthHeaders(),
        params: {
          maDotDanhGia,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Ket Qua Danh Gia:", error);
    throw error;
  }
};

export const GetAllDanhGia = async (page = 1, pageSize = 10, search = "") => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(`DanhGia/admin-get-all-danh-sach-danh-gia`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        pageSize,
        search,
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

export const GetAllDanhGiaCheo = async (page = 1, pageSize = 10, search = "") => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(`DanhGia/admin-get-all-danh-sach-danh-gia-cheo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        pageSize,
        search,
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

export const GetAllTuDanhGia = async (page = 1, pageSize = 10, search = "") => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw console.error("Không có token !!!");
    const response = await apiClient.get(`DanhGia/admin-get-all-danh-sach-tu-danh-gia`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        pageSize,
        search,
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
    const response = await apiClient.post(`DanhGia/submit-danh-gia`, formData, {
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
