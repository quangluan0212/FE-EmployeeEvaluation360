import { Navigate } from "react-router-dom";

const PrivateRouteNotAdmin = ({ children }) => {
  let roles = [];

  try {
    roles = JSON.parse(localStorage.getItem("roles")) || [];
  } catch (e) {
    console.error("Lỗi khi đọc roles:", e);
    return <Navigate to="/notfound" />;
  }

  // Nếu là Admin thì redirect
  if (roles.includes("Admin")) {
    return <Navigate to="/not-found" />;
  }

  return children;
};

export default PrivateRouteNotAdmin;
