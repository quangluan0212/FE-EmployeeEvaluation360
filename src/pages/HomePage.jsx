import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import Header from "../layouts/Header"
import Footer from "../layouts/Footer"

const slides = [
  {
    id: 1,
    title: "Trí Tuệ Nhân Tạo",
    subtitle: "Năng suất bứt phá với",
    description:
      "Dựa trên khả năng phân tích, tận dụng, khai phá, dự báo và đề xuất hành động, chúng tôi hỗ trợ khách hàng làm chủ dữ liệu và năng suất.",
    gradient: "from-[#00B2C2] via-[#7CD4E0] to-[#E6F7FA]",
    image: "/src/assets/slide1.png",
  },
  {
    id: 2,
    title: "Phân Tích Dữ Liệu",
    subtitle: "Giải pháp toàn diện với",
    description:
      "Chúng tôi cung cấp các công cụ phân tích dữ liệu tiên tiến giúp doanh nghiệp của bạn đưa ra quyết định sáng suốt dựa trên thông tin chính xác và kịp thời.",
    gradient: "from-[#2563EB] via-[#60A5FA] to-[#E0F2FE]",
    image: "/src/assets/slide2.png",
  },
  {
    id: 3,
    title: "Tự Động Hóa",
    subtitle: "Tối ưu quy trình với",
    description:
      "Giải pháp tự động hóa thông minh giúp doanh nghiệp tiết kiệm thời gian, giảm chi phí vận hành và tăng hiệu quả công việc trong mọi lĩnh vực.",
    gradient: "from-[#059669] via-[#34D399] to-[#ECFDF5]",
    image: "/src/assets/slide3.png",
  },
]

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(()=>{
      setCurrentSlide((prev) =>  (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  },[]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section
        className={`w-full h-[600px] flex items-center relative bg-cover bg-center transition-all duration-700`}
        style={{
          backgroundImage: `
          linear-gradient(to bottom, rgb(0, 0, 0), rgba(0, 0, 0, 0.17) 40%),
          linear-gradient(to bottom, rgba(0, 0, 0, 0) 70%, rgba(255, 255, 255, 0.28) 100%),
          url(${currentSlideData.image})`,
        }}
      >
        <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl mx-auto md:mx-0"
        >
          <h3 className="text-white text-xl md:text-2xl mb-2">{currentSlideData.subtitle}</h3>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">{currentSlideData.title}</h1>
          <p className="text-white text-lg md:text-xl leading-relaxed mb-6">{currentSlideData.description}</p>
          <Link to="/learn-more" className="text-white underline hover:text-gray-100 inline-block mt-4">
            Đọc thêm
          </Link>
        </motion.div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
