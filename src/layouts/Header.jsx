import { Link } from "react-router-dom"

const Header = () => {
<<<<<<< HEAD
  const handleLoginClick = () => {
    navigate('/login')
  }
=======
>>>>>>> 563993734dc786c621b7ae2ce6791bdaa78ff8f7
  return (
    <header className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src="/src/assets/logo.png" alt="Viet An Logo" className="h-12 w-auto" />
      </div>
      <div className="flex items-center space-x-8">
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="font-medium text-black hover:text-[#00A7E1] relative group">
            TRANG CHỦ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00A7E1] transition-all duration-300 group-hover:w-full"></span>
          </Link>
<<<<<<< HEAD
          <Link to="/partners" className ="font-medium text-black hover:text-[#00A7E1] relative group">
=======
          <Link to="/partners" className="font-medium text-black hover:text-[#00A7E1] relative group">
>>>>>>> 563993734dc786c621b7ae2ce6791bdaa78ff8f7
            CÁC ĐỐI TÁC
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00A7E1] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link to="/contact" className="font-medium text-black hover:text-[#00A7E1] relative group">
            LIÊN HỆ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00A7E1] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>
        <Link
          to="/login"
          className="bg-[#3026BF] text-white px-6 py-2 rounded-md font-medium hover:bg-[#00A7E1] transition-colors"
<<<<<<< HEAD
          onClick={handleLoginClick}
=======
>>>>>>> 563993734dc786c621b7ae2ce6791bdaa78ff8f7
        >
          ĐĂNG NHẬP
        </Link>
      </div>
    </header>
  )
}

export default Header
