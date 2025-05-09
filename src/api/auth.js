import { jwtDecode } from "jwt-decode";

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

// Hàm lấy thông tin người dùng từ token
export const getUserIdInfoFromToken = (token) => {
  const MaNguoiDung = jwtDecode(token).maNguoiDung;
  if (!decoded) return null;

  return {
    MaNguoiDung: MaNguoiDung  };
};

// Hàm xóa token khỏi localStorage
export const removeToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
};
