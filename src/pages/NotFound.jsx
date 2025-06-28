import { Home, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="h-screen w-screen bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <span className="text-7xl font-bold text-red-500">4</span>
              <div className="relative">
                <span className="text-7xl font-bold text-red-500 relative z-10">
                  0
                </span>
              </div>
              <span className="text-7xl font-bold text-red-500">4</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Trang không tìm thấy
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Trang bạn tìm kiếm không tồn tại hoặc bạn không có quyền truy cập
            trang này !!!.
          </p>

          <div className="space-y-3 items-center justify-center flex flex-col">
            <Link
              to="/"
              className="flex items-center justify-center w-60 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Trở về trang chủ
            </Link>
          </div>
        </div>

        <div className="px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            Nếu bạn cho rằng đây là lỗi, vui lòng
            <a href="/contact" className="text-indigo-600 hover:underline ml-1">
              liên hệ với chúng tôi
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
