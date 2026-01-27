import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useConvex } from "convex/react";
import { api } from "../lib/convex-api";

// Timeout duration in milliseconds
const MUTATION_TIMEOUT = 30000;

// Input validation helpers
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  if (email.length > 255) return "Email must be less than 255 characters";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password.length > 100) return "Password must be less than 100 characters";
  return null;
};

const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required";
  if (name.length > 100) return "Name must be less than 100 characters";
  return null;
};

// Wrapper to add timeout to async operations
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Connection timeout. Please check your internet and try again.",
            ),
          ),
        ms,
      ),
    ),
  ]);
};

type AuthView =
  | "signin"
  | "signup"
  | "forgot"
  | "verify-code"
  | "reset-password";

// Inner component that uses Convex hooks (only rendered when Convex is available)
const AuthWithConvex = () => {
  const navigate = useNavigate();
  const convex = useConvex();
  const [view, setView] = useState<AuthView>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const signup = useMutation(api.auth.signup);
  const signin = useMutation(api.auth.signin);
  const requestPasswordReset = useMutation(
    api.passwordReset.requestPasswordReset,
  );
  const resetPassword = useMutation(api.passwordReset.resetPassword);
  const incrementAttempts = useMutation(api.passwordReset.incrementAttempts);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1);
    setOtpCode(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otpCode];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtpCode(newOtp);
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const sendResetCode = async () => {
    setError("");
    setLoading(true);
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }
    try {
      const result = await withTimeout(
        requestPasswordReset({ email: email.trim() }),
        MUTATION_TIMEOUT,
      );
      if (result.code) {
        const convexUrl = import.meta.env.VITE_CONVEX_URL || "";
        let httpUrl = convexUrl;
        try {
          const parsed = new URL(convexUrl);
          parsed.hostname = parsed.hostname.replace(".cloud", ".site");
          httpUrl = parsed.origin;
        } catch (_e) {
          httpUrl = convexUrl.replace(".cloud", ".site");
        }
        const response = await withTimeout(
          fetch(`${httpUrl}/send-reset-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), code: result.code }),
          }),
          MUTATION_TIMEOUT,
        );
        if (!response.ok) {
          const errorData = await response.text();
          console.error("Email send error:", errorData);
          throw new Error("Failed to send reset email. Please try again.");
        }
      }
      setView("verify-code");
      setResendCountdown(60);
      setOtpCode(["", "", "", "", "", ""]);
      setSuccess(true);
      setSuccessMessage("A 6-digit code has been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setError("");
    const code = otpCode.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const verification = await withTimeout(
        convex.query(api.passwordReset.verifyResetCode, {
          code,
          email: email.trim(),
        }),
        MUTATION_TIMEOUT,
      );
      if (!verification.valid) {
        await incrementAttempts({ email: email.trim() });
        setError(verification.error || "Invalid code");
        setLoading(false);
        return;
      }
      setView("reset-password");
      setSuccess(true);
      setSuccessMessage("Code verified! Please enter your new password.");
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await withTimeout(
        resetPassword({
          email: email.trim(),
          code: otpCode.join(""),
          new_password: password,
        }),
        MUTATION_TIMEOUT,
      );
      setSuccess(true);
      setSuccessMessage(
        "Password reset successfully! Redirecting to sign in...",
      );
      setTimeout(() => {
        setView("signin");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setOtpCode(["", "", "", "", "", ""]);
        setSuccess(false);
        setSuccessMessage("");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }
    try {
      if (view === "forgot") {
        await sendResetCode();
        return;
      } else if (view === "signup") {
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }
        const nameError = validateName(name);
        if (nameError) {
          setError(nameError);
          setLoading(false);
          return;
        }
        const user = await withTimeout(
          signup({
            email: email.trim(),
            password,
            name: name.trim(),
          }),
          MUTATION_TIMEOUT,
        );
        localStorage.setItem("user", JSON.stringify(user));
        setSuccess(true);
        setSuccessMessage("Account created! Redirecting...");
        setTimeout(() => {
          navigate("/admin");
        }, 500);
      } else {
        const passwordError = validatePassword(password);
        if (passwordError) {
          setError(passwordError);
          setLoading(false);
          return;
        }
        const user = await withTimeout(
          signin({
            email: email.trim(),
            password,
          }),
          MUTATION_TIMEOUT,
        );
        localStorage.setItem("user", JSON.stringify(user));
        if (rememberMe) {
          localStorage.setItem("savedEmail", email.trim());
        } else {
          localStorage.removeItem("savedEmail");
        }
        setSuccess(true);
        setSuccessMessage("Signed in successfully! Redirecting...");
        setTimeout(() => {
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 500);
      }
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred";
      if (
        errorMessage.includes("timeout") ||
        errorMessage.includes("Timeout")
      ) {
        setError(
          "Connection timeout. Please check your internet connection and try again.",
        );
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("Network")
      ) {
        setError("Network error. Please check your internet connection.");
      } else if (
        errorMessage.includes("Invalid password") ||
        errorMessage.includes("User not found")
      ) {
        setError("Wrong password or email. Please try again.");
      } else if (errorMessage.includes("Email already registered")) {
        setError("This email is already registered. Please sign in instead.");
      } else if (errorMessage.toLowerCase().includes("convex")) {
        // Hide any Convex-specific error messages
        setError("An error occurred. Please try again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchView = (newView: AuthView) => {
    setView(newView);
    setError("");
    setSuccess(false);
    setSuccessMessage("");
    setPassword("");
    setConfirmPassword("");
    setOtpCode(["", "", "", "", "", ""]);
  };

  const getTitle = () => {
    switch (view) {
      case "signup":
        return "Create Account";
      case "forgot":
        return "Reset Password";
      case "verify-code":
        return "Enter Code";
      case "reset-password":
        return "New Password";
      default:
        return "Welcome back!";
    }
  };

  const getSubtitle = () => {
    switch (view) {
      case "signup":
        return "Please fill in your details to create an account";
      case "forgot":
        return "Enter your email and we'll send you a 6-digit code";
      case "verify-code":
        return `Enter the 6-digit code sent to ${email}`;
      case "reset-password":
        return "Enter your new password";
      default:
        return "Please enter your credentials to sign in!";
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <div className="lg:hidden relative w-full overflow-hidden">
        <div className="bg-green text-white px-6 pt-6 pb-14 flex flex-col items-center gap-4">
          <img
            src="/assets/images/logo.png"
            alt="TOOF Logo"
            className="h-12 w-auto"
          />
          <p className="text-center text-sm text-white/90 max-w-xl">
            Standing with survivors. Empowering women and children. Building a
            safer future together.
          </p>
        </div>
        <svg
          className="absolute -bottom-1 left-0 right-0 w-full h-10 text-background"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,96L60,101.3C120,107,240,117,360,117.3C480,117,600,107,720,128C840,149,960,203,1080,218.7C1200,235,1320,213,1380,202.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div>

      <div className="hidden lg:flex lg:w-[45%] bg-green relative flex-col justify-between p-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-green-dark/30" />
          <div className="absolute bottom-40 -left-32 w-80 h-80 rounded-full bg-green-dark/20" />
          <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-green-dark/25 translate-x-1/2" />
        </div>

        <div className="relative z-10">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/assets/images/logo.png"
              alt="TOOF Logo"
              className="h-14 w-auto"
            />
          </a>
        </div>

        <div className="relative z-10 text-white max-w-md">
          <p className="text-lg leading-relaxed opacity-90">
            The Olanike Omopariola Foundation (TOOF) is a non-profit
            organization dedicated to ending domestic and gender-based violence
            and transforming the lives of women and children impacted by these
            injustices. We believe that every woman and child deserves to live
            free from fear, violence, and oppression.
          </p>
        </div>

        <div className="relative z-10 text-white/70 text-sm">
          Copyright © {new Date().getFullYear()} {""}
          <span className="font-semibold text-white">
            The Olanike Omopariola Foundation
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-start lg:items-center justify-center px-4 sm:px-6 lg:p-8 bg-background pb-12">
        <div className="w-full max-w-md -mt-12 lg:mt-0">
          <div className="lg:hidden mb-8 flex justify-center">
            <a href="/">
              <img
                src="/assets/images/logo.png"
                alt="TOOF Logo"
                className="h-10 w-auto"
              />
            </a>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getTitle()}
          </h1>
          <p className="text-muted-foreground mb-8">{getSubtitle()}</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          {view === "verify-code" && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                {otpCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all bg-background text-foreground"
                    disabled={loading}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={verifyCode}
                className="w-full py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading || otpCode.join("").length !== 6}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Verifying...</span>
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={sendResetCode}
                  disabled={resendCountdown > 0 || loading}
                  className="text-green hover:text-green-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : "Resend Code"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => switchView("signin")}
                disabled={loading}
                className="w-full text-center text-green hover:text-green-dark transition-colors font-medium disabled:opacity-50"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {view === "reset-password" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                    disabled={loading}
                    maxLength={100}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
                <small className="text-muted-foreground block mt-1">
                  At least 6 characters
                </small>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                    disabled={loading}
                    maxLength={100}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePasswordReset}
                className="w-full py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading || !password || !confirmPassword}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Resetting...</span>
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              <button
                type="button"
                onClick={() => switchView("signin")}
                disabled={loading}
                className="w-full text-center text-green hover:text-green-dark transition-colors font-medium disabled:opacity-50"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {(view === "signin" || view === "signup" || view === "forgot") && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {view === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                    required
                    disabled={loading}
                    maxLength={100}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                  required
                  disabled={loading}
                  maxLength={255}
                />
              </div>

              {view !== "forgot" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                      required
                      disabled={loading}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {view === "signup" && (
                    <small className="text-muted-foreground block mt-1">
                      At least 6 characters
                    </small>
                  )}
                </div>
              )}

              {view === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                      required
                      disabled={loading}
                      maxLength={100}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={loading}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {view === "signin" && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 border border-border rounded focus:ring-2 focus:ring-green focus:ring-offset-0 cursor-pointer accent-green"
                      disabled={loading}
                    />
                    <span className="text-sm text-foreground">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => switchView("forgot")}
                    className="text-sm text-green hover:text-green-dark transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-green text-white rounded-lg font-semibold hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Please wait...</span>
                  </>
                ) : view === "signup" ? (
                  "Create Account"
                ) : view === "forgot" ? (
                  "Send Code"
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="mt-6 text-center space-y-2">
                {view === "forgot" ? (
                  <button
                    type="button"
                    onClick={() => switchView("signin")}
                    disabled={loading}
                    className="text-green hover:text-green-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back to Sign In
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      switchView(view === "signup" ? "signin" : "signup")
                    }
                    disabled={loading}
                    className="text-green hover:text-green-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {view === "signup"
                      ? "Already have an account? Sign In"
                      : "Don't have an account? Sign Up"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Auth = () => {
  const convexUrlCheck = import.meta.env.VITE_CONVEX_URL;
  if (!convexUrlCheck) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-6 rounded-lg max-w-md text-center">
          <h2 className="text-lg font-semibold mb-2">Configuration Error</h2>
          <p className="text-sm">
            Convex is not configured. Please check that VITE_CONVEX_URL is set
            in your environment variables.
          </p>
        </div>
      </div>
    );
  }
  return <AuthWithConvex />;
};

export default Auth;
