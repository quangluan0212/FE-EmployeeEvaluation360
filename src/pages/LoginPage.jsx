import { useState, useEffect } from "react";
import { login } from "../api/NguoiDung";
import { useNavigate, useLocation } from "react-router-dom";
import { getToken, decodeToken } from "../api/auth";
import { User, Lock, LogIn, AlertCircle } from "lucide-react";
import { getUserRolesFromToken } from "../api/auth";

const LoginPage = () => {
  const [_maNguoiDung, setEmployeeId] = useState("");
  const [_matKhau, setPassword] = useState("");
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
          setTimeout(() => {
            navigate("/profile");
          }, 1000);
        }
      }
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login({
        maNguoiDung: _maNguoiDung,
        matKhau: _matKhau,
      });

      if (response.code !== 200) {
        setMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        return;
      }

      const { maNguoiDung, hoTen, token } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userName", hoTen);
      localStorage.setItem("userId", maNguoiDung);
      const roles = token ? getUserRolesFromToken(token) : [];
      localStorage.setItem("roles", JSON.stringify(roles));
      setMessage("Đăng nhập thành công!");
      console.log("Login successful:", response.data);
      navigate("/profile");

    } catch (error) {
      setMessage("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen h-screen bg-gray-50">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <img
          src="src\assets\login1.png"
          alt="Workspace collaboration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-xl text-center">
            <h1 className="text-4xl font-bold mb-6 drop-shadow-md">
              Chào mừng trở lại!
            </h1>
            <p className="text-xl opacity-90 drop-shadow-md">
              Đăng nhập để truy cập vào hệ thống quản lý và tiếp tục công việc
              của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col items-center justify-center px-6 md:w-1/2 lg:w-2/5">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <img src="src\assets\logo.png" alt="Logo" className="h-16 mb-2" />
            <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-gray-900">
              Đăng nhập vào tài khoản
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Nhập thông tin đăng nhập của bạn để tiếp tục
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="employee-id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mã nhân viên
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="employee-id"
                    name="employee-id"
                    type="text"
                    value={_maNguoiDung}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={_matKhau}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Nhập mật khẩu"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
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
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 text-sm font-medium text-white shadow-md hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <LogIn className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" />
                    </span>
                    Đăng nhập
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500">
            &copy; Website Việt An 360, by Lê Quang Luân{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
