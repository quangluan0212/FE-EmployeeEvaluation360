import apiClient from "./api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("Token không tồn tại");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// danh sach nhom by ma leader
export const getListNhomByLeader = async (maNguoiDung) => {
  try {
    const response = await apiClient.get("/Nhom/danh-sach-nhom-theo-leader", {
      headers: getAuthHeaders(),
      params: { maNguoiDung },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách nhóm:", error);
    throw error;
  }
};

// Thêm thành viên vào nhóm
export const addThanhVienVaoNhom = async (nhomData) => {
  try {
    const response = await apiClient.post("/Nhom/them-thanh-vien-vao-nhom", nhomData, {
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi thêm thành viên vào nhóm:", error);
    throw error;
  }
};

//Lấy danh sách người dùng không có trong nhóm
export const getDanhSachNguoiDungKhongCoTrongNhom = async (
  maNhom,
) => {
  try {
    const response = await apiClient.get(
      "/Nhom/danh-sach-nguoi-dung-khong-co-trong-nhom",
      {
        headers: getAuthHeaders(),
        params: { maNhom },
      }
    );
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng không có trong nhóm:", error);
    throw error;
  }
};

// Lấy danh sách nhóm có phân trang
export const getDanhSachNhomPaged = async (page, pageSize, search = "") => {
  try {
    const response = await apiClient.get("/Nhom/danh-sach-nhom", {
      headers: getAuthHeaders(),
      params: { page, pageSize, search },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách nhóm:", error);
    throw error;
  }
};

// Thêm nhóm
export const addNhom = async (nhomData) => {
  try {
    const response = await apiClient.post("/Nhom/them-nhom", nhomData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm nhóm:", error);
    throw error;
  }
};

// Cập nhật nhóm
export const updateNhom = async (maNhom, nhomData) => {
  try {
    const response = await apiClient.put(`/Nhom/cap-nhat-nhom`, nhomData, {
      headers: getAuthHeaders(),
      params: {
        maNhom,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nhóm:", error);
    throw error;
  }
};

// Xóa nhóm
export const deleteNhom = async (maNhom) => {
  try {
    const response = await apiClient.delete("/Nhom/xoa-nhom", {
      headers: getAuthHeaders(),
      params: { maNhom },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa nhóm:", error);
    throw error;
  }
};

export const getDanhSachThanhVienNhom = async (
  maNhom,
  page = 1,
  pageSize = 10,
  search = ""
) => {
  try {
    const response = await apiClient.get("/Nhom/danh-sach-thanh-vien-nhom", {
      headers: getAuthHeaders(),
      params: { maNhom, page, pageSize, search },
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thành viên nhóm:", error);
    throw error;
  }
};

// Lấy danh sách thành viên theo nhóm (có phân trang)
export const getThanhVienTheoNhom = async (maNhom, page, pageSize) => {
  try {
    const response = await apiClient.get("/Nhom/danh-sach-thanh-vien-nhom", {
      headers: getAuthHeaders(),
      params: { maNhom, page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thành viên nhóm:", error);
    throw error;
  }
};

//xóa thành viên nhóm
export const deleteThanhVien = async (maNhom, maNguoiDung) => {
  try {
    const response = await apiClient.delete("/Nhom/xoa-thanh-vien-nhom", {
      headers: getAuthHeaders(),
      params: { maNhom, maNguoiDung },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa thành viên nhóm:", error);
    throw error;
  }
};

export const getGroupByUserId = async (maNguoiDung) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token không tồn tại");
    //GET/api/Nhom/get-danh-sach-nhom-by-ma-nguoi-dung
    const response = await apiClient.get(
      `/Nhom/get-danh-sach-nhom-by-ma-nguoi-dung`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { maNguoiDung: maNguoiDung },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhóm:", error);
    throw (
      error.response?.data || {
        code: 500,
        message: "Lỗi server",
        error: error.message,
      }
    );
  }
};
