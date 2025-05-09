import { p, param } from "framer-motion/client";
import apiClient from "./api";

// Hàm gọi API login
export const login = async ({ maNguoiDung, matKhau }) => {
  try {
    const response = await apiClient.post("/NguoiDung/dang-nhap", {
      maNguoiDung,
      matKhau,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Hàm gọi API chi tiết người dùng
export const getUserDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const maNguoiDung = localStorage.getItem('userId');
  
      console.log('Token:', token);
      console.log('Mã người dùng:', maNguoiDung);
  
      if (!token) throw new Error('Token không tồn tại');
      if (!maNguoiDung) throw new Error('Mã người dùng không tồn tại');
  
      const url = `/NguoiDung/chi-tiet-nguoi-dung/${maNguoiDung}`;
      console.log('Calling API:', url);
  
      const response = await apiClient.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Lỗi getUserDetails:', error);
      throw error;
    }
  };

// Hàm gọi API thay đổi mật khẩu
export const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const token = localStorage.getItem('authToken');
    const maNguoiDung = localStorage.getItem('userId');

    if (!token) throw new Error('Token không tồn tại');
    if (!maNguoiDung) throw new Error('Mã người dùng không tồn tại');

    const response = await apiClient.put(
      `/NguoiDung/doi-mat-khau`,
      {
        CurrentPassword : currentPassword,
        NewPassword: newPassword,
        ConfirmPassword: newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
            maNguoiDung: maNguoiDung,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi changePassword:', error);
    throw error;
  }
};

//hàm gọi API cập nhật thông tin người dùng
export const updateUserInfo = async (userInfo) => {
  try {
    const token = localStorage.getItem('authToken');
    const maNguoiDung = localStorage.getItem('userId');

    if (!token) throw new Error('Token không tồn tại');
    if (!maNguoiDung) throw new Error('Mã người dùng không tồn tại');

    const response = await apiClient.put(
      `/NguoiDung/user-cap-nhat-thong-tin-nguoi-dung`,
      userInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          maNguoiDung: maNguoiDung,
        },
      }
    );

    return response.data;
  }
  catch (error) {
    console.error('Lỗi updateUserInfo:', error);
    throw error;
  }
}

//hàm gọi API lấy danh sách nhân viên
export const getEmployeeList = async (page, pageSize, search) => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) throw new Error('Token không tồn tại');

    const response = await apiClient.get('/NguoiDung/danh-sach-nguoi-dung-chuc-vu', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page,
        pageSize: pageSize,
        search: search,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi getEmployeeList:', error);
    throw error;
  }
}

//hàm gọi API thêm nhân viên
export const addEmployee = async (employeeData) => {
  try {
    const token = localStorage.getItem('authToken');
    const maNguoiDung = localStorage.getItem('userId');

    if (!token) throw new Error('Token không tồn tại');
    if (!maNguoiDung) throw new Error('Mã người dùng không tồn tại');

    const response = await apiClient.post('/NguoiDung/them-nguoi-dung', employeeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi addEmployee:', error);
    throw error;
  }
}

//hàm gọi API cập nhật thông tin nhân viên bởi admin
export const adminUpdateEmployee = async (employeeId, updatedData) => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) throw new Error('Token không tồn tại');

    const response = await apiClient.put(
      `/NguoiDung/admin-cap-nhat-thong-tin-nguoi-dung`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          maNguoiDung: employeeId,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Lỗi adminUpdateEmployee:', error);
    throw error;
  }
};
