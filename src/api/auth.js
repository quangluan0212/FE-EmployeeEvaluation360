import { jwtDecode } from "jwt-decode";
import apiClient from "./api";
// Hàm đọc token từ localStorage
export const getToken = () => {
  return localStorage.getItem("authToken");
};

// Hàm giải mã token để lấy thông tin người dùng
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Lỗi khi giải mã token:", error);
    return null;
  }
};

export const getUserRolesFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return [];

  return decoded.role || [];
};

// Hàm xóa token khỏi localStorage
export const removeToken = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("roles");
};

export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await apiClient.post("/Auth/send-reset-email", { email });
    return response;
  } catch (error) {
    console.error("Lỗi khi gửi email khôi phục mật khẩu:", error);
    throw error;
  }
};

export const verifyResetPasswordCaptcha = async (email, captchaCode) => {
  try {
    const response = await apiClient.post("/Auth/verify-captcha", {
      email,
      captchaCode,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi xác thực token khôi phục mật khẩu:", error);
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await apiClient.put("/Auth/user-reset-password", data);
    return response;
  } catch (error) {
    console.error(
      "Lỗi khi đặt lại mật khẩu:",
      error?.response?.data || error.message
    );
    throw new Error(
      error?.response?.data?.message || "Đã xảy ra lỗi khi đặt lại mật khẩu."
    );
  }
};
