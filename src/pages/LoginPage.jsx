import { useState, useEffect } from "react";
import { login } from "../api/NguoiDung";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, decodeToken, getUserRolesFromToken } from "../api/auth";
import { User, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [maNguoiDung, setEmployeeId] = useState("");
  const [matKhau, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      const token = getToken();
      if (token) {
        const decoded = decodeToken(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded && decoded.exp > currentTime) {
          console.log("Token hợp lệ, chuyển hướng tới /profile");
          setTimeout(() => navigate("/profile"), 1000);
        }
      }
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit được gọi với:", { maNguoiDung, matKhau });
    setIsLoading(true);
    setMessage("");
    try {
      console.log("Gọi API login...");
      const response = await login({
        maNguoiDung,
        matKhau,
      });
      console.log("Phản hồi từ login:", response);

      if (response.code !== 200) {
        setMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        return;
      }

      const { maNguoiDung: userId, hoTen, token } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", hoTen);
      localStorage.setItem("userId", userId);
      const roles = token ? getUserRolesFromToken(token) : [];
      localStorage.setItem("roles", JSON.stringify(roles));
      setMessage("Đăng nhập thành công!");
      navigate("/profile");
    } catch (error) {
      setMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
      console.log("isLoading reset về false");
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-white-50 to-gray-100">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-500 opacity-50"></div>
        <img
          src="/src/assets/login1.png"
          alt="Workspace collaboration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-2xl text-center">
            <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
              Chào mừng đến với Việt An 360
            </h1>
            <p className="text-xl opacity-90 drop-shadow-md">
              Hệ thống quản lý hiệu suất toàn diện giúp bạn tối ưu hóa công việc
              và phát triển đội ngũ.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full h-full lg:w-2/5 items-center justify-center">
        <div className="w-full max-w-md bg-white p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src="/src/assets/logo.png" alt="Logo" className="h-16 mb-4" />
            <h2 className="text-3xl font-bold text-blue-900">Đăng nhập</h2>
            <p className="mt-2 text-sm text-blue-600">
              Nhập thông tin đăng nhập để tiếp tục
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="employee-id"
                className="block text-sm font-medium text-gray-700"
              >
                Mã nhân viên
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="employee-id"
                  name="employee-id"
                  type="text"
                  value={maNguoiDung}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Nhập mã nhân viên"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={matKhau}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Nhập mật khẩu"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-700"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div>

            {message && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-sm font-medium text-red-800">
                    {message}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-indigo-900 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Đang xử lý...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Đăng nhập
                </div>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500">
            © Website Việt An 360, by Lê Quang Luân
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;