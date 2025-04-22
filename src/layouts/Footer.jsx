import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-[#002958] py-12 text-white mt-[20px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src="/src/assets/logo.png" alt="Viet An Logo" className="h-12 w-auto mb-4"/>
            <p className="text-sm text-gray-300 mt-4">
              Công ty phần mềm Việt An chuyên cung cấp các giải pháp công nghệ thông tin tiên tiến cho doanh nghiệp.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch Vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/ai" className="text-gray-300 hover:text-[#00A7E1]">
                  Trí tuệ nhân tạo
                </Link>
              </li>
              <li>
                <Link to="/services/data-analytics" className="text-gray-300 hover:text-[#00A7E1]">
                  Phân tích dữ liệu
                </Link>
              </li>
              <li>
                <Link to="/services/software-development" className="text-gray-300 hover:text-[#00A7E1]">
                  Phát triển phần mềm
                </Link>
              </li>
              <li>
                <Link to="/services/consulting" className="text-gray-300 hover:text-[#00A7E1]">
                  Tư vấn giải pháp
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Kết</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#00A7E1]">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[#00A7E1]">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-300 hover:text-[#00A7E1]">
                  Đối tác
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-[#00A7E1]">
                  Tuyển dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <address className="not-italic text-gray-300">
              <p>123 Đường Nguyễn Văn Linh</p>
              <p>Quận 7, TP. Hồ Chí Minh</p>
              <p className="mt-2">Email: info@vietan.com</p>
              <p>Điện thoại: (028) 1234 5678</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Công ty Phần mềm Việt An. Tất cả các quyền được bảo lưu.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-400 hover:text-[#00A7E1]">
              Điều khoản sử dụng
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-[#00A7E1]">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
