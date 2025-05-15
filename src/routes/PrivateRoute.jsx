import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  let roles = [];

  try {
    roles = JSON.parse(localStorage.getItem("roles")) || [];
  } catch (e) {
    console.error("Lỗi khi đọc roles:", e);
    return <Navigate to="/notfound" />;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/not-found" />;
  }

  return children;
};

export default PrivateRoute;
