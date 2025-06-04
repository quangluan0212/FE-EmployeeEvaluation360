import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Header from "../layouts/Header"
import Footer from "../layouts/Footer"
import { getToken, decodeToken } from "../api/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "Trí Tuệ Nhân Tạo",
    subtitle: "Năng suất bứt phá với",
    description:
      "Dựa trên khả năng phân tích, tận dụng, khai phá, dự báo và đề xuất hành động, chúng tôi hỗ trợ khách hàng làm chủ dữ liệu và năng suất.",
    gradient: "from-[#00B2C2] via-[#7CD4E0] to-[#E6F7FA]",
    image: "/slide1.png",
    buttonColor: "bg-cyan-600 hover:bg-cyan-700",
    dotColor: "bg-cyan-500",
  },
  {
    id: 2,
    title: "Phân Tích Dữ Liệu",
    subtitle: "Giải pháp toàn diện với",
    description:
      "Chúng tôi cung cấp các công cụ phân tích dữ liệu tiên tiến giúp doanh nghiệp của bạn đưa ra quyết định sáng suốt dựa trên thông tin chính xác và kịp thời.",
    gradient: "from-[#2563EB] via-[#60A5FA] to-[#E0F2FE]",
    image: "/slide2.png",
    buttonColor: "bg-cyan-600 hover:bg-cyan-700",
    dotColor: "bg-cyan-500",
  },
  {
    id: 3,
    title: "Tự Động Hóa",
    subtitle: "Tối ưu quy trình với",
    description:
      "Giải pháp tự động hóa thông minh giúp doanh nghiệp tiết kiệm thời gian, giảm chi phí vận hành và tăng hiệu quả công việc trong mọi lĩnh vực.",
    gradient: "from-[#059669] via-[#34D399] to-[#ECFDF5]",
    image: "/slide3.png",
    buttonColor: "bg-cyan-600 hover:bg-cyan-700",
    dotColor: "bg-cyan-500",
  },
]

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      const token = getToken();
      if (token) {
        const decoded = decodeToken(token);
        const currentTime = Math.floor(Date.now() / 10000);

        if (decoded && decoded.exp > currentTime) {
          setTimeout(() => {
            navigate("/profile");
          }, 3000);
        }
      }
    }
  }, [navigate, location]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section with Slider */}
      <section className="relative w-full h-[700px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-105"
          style={{
            backgroundImage: `url(${currentSlideData.image})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-40 h-full flex items-center relative z-10">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
              {currentSlideData.subtitle}
            </span>
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">{currentSlideData.title}</h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              {currentSlideData.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/learn-more"
                className={`px-6 py-3 rounded-lg ${currentSlideData.buttonColor} text-white font-medium flex items-center transition-all shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10`}
              >
                Tìm hiểu thêm
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium border border-white/20 hover:bg-white/20 transition-all"
              >
                Liên hệ ngay
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm hover:bg-black/40 p-3 rounded-full transition-all z-20 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-black/20 backdrop-blur-sm hover:bg-black/40 p-3 rounded-full transition-all z-20 group"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? `w-10 ${slides[index].dotColor}` : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Giải pháp của chúng tôi</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp các giải pháp công nghệ tiên tiến giúp doanh nghiệp của bạn phát triển trong kỷ nguyên
              số.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-100 group hover:-translate-y-1 duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {slide.id === 1 && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    )}
                    {slide.id === 2 && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    )}
                    {slide.id === 3 && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    )}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{slide.title}</h3>
                <p className="text-gray-600 mb-6">{slide.description}</p>
                <Link
                  to={`/services/${slide.id}`}
                  className="text-sm font-medium inline-flex items-center text-gray-900 hover:underline"
                >
                  Khám phá giải pháp
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng nâng cấp doanh nghiệp của bạn?</h2>
              <p className="text-white/90 text-lg">
                Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí về các giải pháp phù hợp với nhu cầu của
                doanh nghiệp bạn.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Liên hệ ngay
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                Yêu cầu demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
