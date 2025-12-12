import { useState } from "react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log(isSignUp ? "Sign up" : "Sign in", { email, password });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-green relative flex-col justify-between p-10">
        {/* Decorative curves */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-green-dark/30" />
          <div className="absolute bottom-40 -left-32 w-80 h-80 rounded-full bg-green-dark/20" />
          <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-green-dark/25 translate-x-1/2" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/images/logo.png"
              alt="Healed and Restored Logo"
              className="h-14 w-auto"
            />
          </Link>
        </div>

        {/* Description */}
        <div className="relative z-10 text-white max-w-md">
          <p className="text-lg leading-relaxed opacity-90">
            The Olanike Omopariola Foundation (TOOF) is a non-profit
            organization dedicated to ending domestic and gender-based violence
            and transforming the lives of women and children impacted by these
            injustices. We believe that every woman and child deserves to live
            free from fear, violence, and oppression.
          </p>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-white/70 text-sm">
          Copyright © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">
            The Olanike Omopariola Foundation
          </span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link to="/">
              <img
                src="/assets/images/logo.png"
                alt="Healed and Restored Logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isSignUp ? "Create Account" : "Welcome back!"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isSignUp
              ? "Please fill in your details to create an account"
              : "Please enter your credentials to sign in!"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
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
              />
            </div>

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
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-green hover:text-green-dark text-sm font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-green hover:bg-green-dark text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-green hover:text-green-dark font-semibold transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account yet?{" "}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-green hover:text-green-dark font-semibold transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
          </p>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-green transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
