import { useEffect, useState } from "react";


import { GetFormDanhGia } from "../api/DanhGia";

export default function EvaluationModal({ admin, onClose, onSubmit }) {
  const [evaluationForm, setEvaluationForm] = useState(null)
  const [answers, setAnswers] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true)
      try {
        const form = await GetFormDanhGia()
        setEvaluationForm(form)
        setAnswers(
          form.danhSachCauHoi.map((question) => ({
            maCauHoi: question.maCauHoi,
            diem: 0,
          }))
        )
      } catch (err) {
        console.error("Lỗi khi lấy form đánh giá:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [])

  const handleRatingChange = (maCauHoi, diem) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.maCauHoi === maCauHoi ? { ...answer, diem } : answer
      )
    )

    if (errors[maCauHoi]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[maCauHoi]
        return newErrors
      })
    }
  }

  const handleSubmit = () => {
    const newErrors = {}
    let hasErrors = false

    answers.forEach((answer) => {
      if (answer.diem === 0) {
        newErrors[answer.maCauHoi] = "Vui lòng đánh giá câu hỏi này"
        hasErrors = true
      }
    })

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    onSubmit(answers)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 text-center">
          <p>Đang tải biểu mẫu đánh giá...</p>
        </div>
      </div>
    )
  }

  if (!evaluationForm) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Đánh giá: {admin.hoten}</h2>
            <p className="text-sm text-gray-500 mt-1">{evaluationForm.tenDotDanhGia}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {evaluationForm.danhSachCauHoi.map((question, index) => (
              <div key={question.maCauHoi} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-medium text-gray-900">
                    <span className="mr-2">{index + 1}.</span>
                    {question.noiDung}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {question.diemToiDa} điểm
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {[...Array(question.diemToiDa)].map((_, i) => {
                      const rating = i + 1
                      return (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => handleRatingChange(question.maCauHoi, rating)}
                          className={`w-10 h-10 rounded-md flex items-center justify-center border ${
                            answers.find((a) => a.maCauHoi === question.maCauHoi)?.diem === rating
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {rating}
                        </button>
                      )
                    })}
                  </div>
                  {errors[question.maCauHoi] && (
                    <p className="mt-2 text-sm text-red-600">{errors[question.maCauHoi]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang gửi...
              </>
            ) : (
              "Gửi đánh giá"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
