import { useState, useEffect } from 'react';
import { login } from '../api/NguoiDung';
import { useNavigate, useLocation } from 'react-router-dom';
import { getToken, decodeToken } from '../api/auth';

const LoginPage = () => {
  const [_maNguoiDung, setEmployeeId] = useState('');
  const [_matKhau, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/') {
      const token = getToken();
      if (token) {
        const decoded = decodeToken(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded && decoded.exp > currentTime) {
          setTimeout(() => {
            navigate('/profile');
          }, 3000);
        }
      }
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ maNguoiDung: _maNguoiDung, matKhau: _matKhau });
      
      const { maNguoiDung, hoTen, token} = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', hoTen);
      localStorage.setItem('userId', maNguoiDung);

      setMessage('Đăng nhập thành công!');
      console.log('Login successful:', response.data);

      navigate('/profile'); 
    } catch (error) {
      setMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen h-screen">
      <div className="hidden md:block md:w-1/2 lg:w-3/5">
        <img
          src="src\\assets\\login1.png"
          alt="Workspace collaboration"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full flex-col items-center justify-center px-6 md:w-1/2 lg:w-2/5">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <img src="src\\assets\\logo.png"/>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6 rounded-md">
              <div>
                <label
                  htmlFor="employee-id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mã nhân viên
                </label>
                <input
                  id="employee-id"
                  name="employee-id"
                  type="text"
                  value={_maNguoiDung}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 shadow-sm focus:border-[#3026bf] focus:outline-none focus:ring-[#3026bf]"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={_matKhau}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3 shadow-sm focus:border-[#3026bf] focus:outline-none focus:ring-[#3026bf]"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-[#3026bf] px-3 py-3 text-sm font-medium text-white hover:bg-[#2a21a8] focus:outline-none focus:ring-2 focus:ring-[#3026bf] focus:ring-offset-2"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          {/* Message Display */}
          {message && (
            <div className="mt-4 text-center text-sm font-medium text-red-500">
              {message}
            </div>
          )}

          <div className="text-center">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-[#3026bf] hover:underline"
            >
              Quên mật khẩu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
