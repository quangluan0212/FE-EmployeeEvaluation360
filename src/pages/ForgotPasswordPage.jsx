import { useState, useEffect, useRef } from "react";
import {
  sendResetPasswordEmail,
  verifyResetPasswordCaptcha,
  resetPassword,
} from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle } from "lucide-react";

const ForgotPasswordPage = () => {
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: CAPTCHA, 3: Reset Password
  const [email, setEmail] = useState("");
  const [captchaDigits, setCaptchaDigits] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captchaExpiry, setCaptchaExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [captchaError, setCaptchaError] = useState("");
  const [resetError, setResetError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(120); // Reset to 2 minutes
    console.log("Starting timer with timeLeft: 120s, captchaExpiry:", captchaExpiry);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          setCaptchaError("Mã CAPTCHA đã hết hạn.");
          setCaptchaDigits(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          return 0;
        }
        console.log("Time left (seconds):", prev - 1);
        return prev - 1;
      });
    }, 1000);
  };

  const handleCaptchaInput = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...captchaDigits];
    newDigits[index] = value;
    setCaptchaDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (newDigits.every((digit) => digit !== "") && !isLoading) {
      verifyCaptcha(newDigits.join(""));
    }
  };

  const handleCaptchaPaste = (e, index) => {
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pastedData.length <= 6) {
      const newDigits = [...captchaDigits];
      for (let i = 0; i < pastedData.length && index + i < 6; i++) {
        newDigits[index + i] = pastedData[i];
      }
      setCaptchaDigits(newDigits);
      if (pastedData.length + index < 6) {
        inputRefs.current[index + pastedData.length]?.focus();
      } else {
        inputRefs.current[5]?.focus();
        if (newDigits.every((digit) => digit !== "") && !isLoading) {
          verifyCaptcha(newDigits.join(""));
        }
      }
    }
    e.preventDefault();
  };

  const verifyCaptcha = async (captcha) => {
    try {
      setIsLoading(true);
      setCaptchaError("");
      console.log("Verifying CAPTCHA with:", { email, captcha });
      const response = await verifyResetPasswordCaptcha(email, captcha);
      console.log("Verify CAPTCHA response:", response);
      if (response.code === 200) {
        setForgotPasswordStep(3);
        clearInterval(timerRef.current);
      } else {
        setCaptchaError(response.error || "Mã CAPTCHA không đúng.");
        setCaptchaDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      setCaptchaError(error.message || "Mã CAPTCHA không đúng.");
      setCaptchaDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      console.error("CAPTCHA verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setCaptchaError("");

    if (forgotPasswordStep === 1) {
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        setResetError("Vui lòng nhập email hợp lệ.");
        return;
      }
      try {
        setIsLoading(true);
        console.log("Sending reset email to:", email);
        const start = Date.now();
        await sendResetPasswordEmail(email);
        console.log("API response time (ms):", Date.now() - start);
        const expiryTime = Date.now() + 2 * 60 * 1000; // 2 minutes from now
        console.log("Setting captchaExpiry to:", expiryTime, "Current time:", Date.now());
        setCaptchaExpiry(expiryTime);
        setForgotPasswordStep(2);
        setCaptchaDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        startTimer();
      } catch (error) {
        setResetError(error?.response?.data?.error || "Gửi mã thất bại. Vui lòng thử lại.");
        console.error("Send reset code failed:", error);
      } finally {
        setIsLoading(false);
      }
    } else if (forgotPasswordStep === 3) {
      if (!newPassword || newPassword.length < 8) {
        setResetError("Mật khẩu mới phải có ít nhất 8 ký tự.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setResetError("Mật khẩu xác nhận không khớp.");
        return;
      }
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("email", email);
        formData.append("newPassword", newPassword);
        formData.append("captchaCode", captchaDigits.join(""));
        console.log("Resetting password with FormData:", Object.fromEntries(formData));
        const response = await resetPassword(formData);
        console.log("Reset password response:", response);
        if (response.code === 200) {
          setResetError("");
          setShowSuccessModal(true);
        } else {
          setResetError(response.error || "Reset mật khẩu thất bại. Vui lòng thử lại.");
        }
      } catch (error) {
        setResetError(error.message || "Reset mật khẩu thất bại. Vui lòng thử lại.");
        console.error("Reset password failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) {
      setCaptchaError("Vui lòng đợi hết thời gian để gửi lại mã.");
      return;
    }
    try {
      setIsLoading(true);
      console.log("Resending code to:", email);
      const response = await sendResetPasswordEmail(email);
      console.log("Resend code response:", response);
      if (response.code === 200) {
        const expiryTime = Date.now() + 2 * 60 * 1000;
        console.log("Setting new captchaExpiry to:", expiryTime, "Current time:", Date.now());
        setCaptchaExpiry(expiryTime);
        setCaptchaError("");
        setCaptchaDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        startTimer();
      } else {
        setCaptchaError(response.error || "Gửi mã thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      setCaptchaError(error.message || "Gửi mã thất bại. Vui lòng thử lại.");
      console.error("Resend code failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white-50 to-gray-200">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-600 opacity-60"></div>
        <img
          src="/login1.png"
          alt="Workspace collaboration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-2xl text-center">
            <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
              Chào mừng đến với Việt An 360
            </h1>
            <p className="text-xl opacity-90 drop-shadow-md">
              Hệ thống quản lý hiệu suất toàn diện giúp bạn tối ưu hóa công việc và phát triển đội ngũ.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full h-screen lg:w-2/5 items-center justify-center">
        <div className="w-full h-scr p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src="/logo-header.png" alt="Logo" className="h-16 mb-4" />
            <h2 className="text-3xl font-bold text-blue-900">Khôi phục mật khẩu</h2>
            <p className="mt-2 text-sm text-blue-600">
              Nhập thông tin để lấy lại quyền truy cập
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleForgotPassword} className="space-y-6">
            {forgotPasswordStep === 1 && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Nhập email của bạn"
                  />
                </div>
                {resetError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {resetError}
                  </p>
                )}
              </div>
            )}

            {forgotPasswordStep === 2 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mã CAPTCHA (6 số)
                </label>
                <div className="mt-1 flex justify-between gap-2">
                  {captchaDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleCaptchaInput(index, e.target.value)}
                      onPaste={(e) => handleCaptchaPaste(e, index)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && index > 0) {
                          handleCaptchaInput(index - 1, "");
                          inputRefs.current[index - 1]?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="0"
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Thời gian còn lại:{" "}
                  <span className={`font-semibold ${timeLeft <= 10 ? "text-red-600" : ""}`}>
                    {formatTimeLeft()}
                  </span>
                </p>
                {captchaError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" /> {captchaError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading || timeLeft > 0}
                  className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 transition-all duration-200"
                >
                  Gửi lại mã
                </button>
              </div>
            )}

            {forgotPasswordStep === 3 && (
              <>
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mật khẩu mới
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="new-password"
                      name="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Nhập mật khẩu mới"
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
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Xác nhận mật khẩu mới"
                    />
                  </div>
                  {resetError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {resetError}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Quay lại đăng nhập
              </button>
              {forgotPasswordStep !== 2 && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 flex items-center justify-center text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Đang xử lý...
                    </div>
                  ) : forgotPasswordStep === 1 ? (
                    "Gửi mã"
                  ) : (
                    "Reset mật khẩu"
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full">
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">Thành công!</h3>
                  <p className="mt-2 text-sm text-gray-600 text-center">
                    Mật khẩu của bạn đã được đặt lại thành công.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="mt-6 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Về trang đăng nhập
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-xs text-gray-500">
            © Website Việt An 360, by Lê Quang Luân
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;