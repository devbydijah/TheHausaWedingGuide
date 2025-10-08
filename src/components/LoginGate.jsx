import { useState, useEffect } from "react";

/**
 * LoginGate Component
 *
 * Provides password-protected access to the Interactive Wedding Planner.
 * Uses a shared password (stored in environment variable) for all customers.
 *
 * Authentication Flow:
 * 1. User enters email (for data isolation) + shared password
 * 2. Validates password against VITE_SHARED_PASSWORD env var
 * 3. On success: Stores auth state + email in localStorage
 * 4. Session persists for 30 days (configurable)
 *
 * Future Enhancement: Validate email against Supabase purchases table
 */

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export default function LoginGate({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for existing valid session on mount
  useEffect(() => {
    const session = localStorage.getItem("hwg_auth_session");
    if (session) {
      try {
        const { email: savedEmail, expiresAt } = JSON.parse(session);
        const now = Date.now();

        if (now < expiresAt && savedEmail) {
          // Valid session exists, auto-login
          onAuthenticated(savedEmail);
        } else {
          // Session expired, clear it
          localStorage.removeItem("hwg_auth_session");
        }
      } catch (err) {
        // Invalid session data, clear it
        localStorage.removeItem("hwg_auth_session");
      }
    }
  }, [onAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate inputs
    if (!email.trim()) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Please enter the access password");
      setIsLoading(false);
      return;
    }

    try {
      // Call backend validation endpoint
      const response = await fetch('/api/validate-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.hasAccess) {
        // Success - user has valid purchase
        const session = {
          email: email.trim().toLowerCase(),
          authenticatedAt: Date.now(),
          expiresAt: Date.now() + SESSION_DURATION,
        };

        // Store session
        localStorage.setItem("hwg_auth_session", JSON.stringify(session));

        // Call parent callback
        setIsLoading(false);
        onAuthenticated(session.email);
      } else {
        // Failed validation
        let errorMessage = data.error || "Authentication failed";
        
        if (response.status === 401) {
          errorMessage = "Incorrect password. Please check your purchase email for the correct password.";
        } else if (response.status === 403) {
          errorMessage = "No valid purchase found for this email. Please check your email or contact support.";
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please check your internet and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B0000] via-[#740015] to-[#531946] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <img
              src="/logowhite.svg"
              alt="Hausa Wedding Guide"
              className="h-12 sm:h-16"
            />
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Hausa Wedding Guide
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            Interactive Wedding Planner
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-[#740015] mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-700 text-sm sm:text-base mb-6">
            Enter your details to access your wedding planner
          </p>

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#740015] focus:border-transparent transition-all text-gray-900 placeholder-gray-400 text-sm sm:text-base min-h-[44px]"
                placeholder="bride@example.com"
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
              <p className="text-xs text-gray-600 mt-1.5">
                Use the email you provided at purchase
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Access Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#740015] focus:border-transparent transition-all text-gray-900 placeholder-gray-400 text-sm sm:text-base min-h-[44px]"
                placeholder="Enter password from email"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <p className="text-xs text-gray-600 mt-1.5">
                Check your purchase confirmation email for the password
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="bg-red-50 border border-red-300 rounded-lg p-3 sm:p-4"
                role="alert"
              >
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#CE805C] hover:bg-[#B87050] text-white py-3 sm:py-3.5 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl min-h-[44px] text-sm sm:text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Logging in...
                </span>
              ) : (
                "Access Planner"
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Don't have access yet?
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Purchase the Interactive Wedding Planner to receive your access
              password via email.
            </p>
            <a
              href="https://paystack.shop/hausaroom-wedding-guide-GLQSt"
              className="inline-flex items-center text-sm text-[#740015] hover:text-[#B87050] font-semibold transition-colors min-h-[44px] py-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Your Guide Now
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>

          {/* Security Note */}
          <div className="mt-4 bg-[#F9F4F1] rounded-lg p-3 sm:p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-[#740015] mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs sm:text-sm text-gray-700">
                Your data is encrypted and secure. Your wedding plans are saved
                automatically and accessible from any device.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-white/80">
            Need help? Email{" "}
            <a
              href="mailto:support@hausaroom.com"
              className="text-[#D4A574] hover:text-white font-medium underline"
            >
              support@hausaroom.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
