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

export default function LoginGate({ children, onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check for existing valid session on mount
  useEffect(() => {
    const session = localStorage.getItem("hwg_auth_session");
    if (session) {
      try {
        const { email: savedEmail, expiresAt } = JSON.parse(session);
        const now = Date.now();

        if (now < expiresAt && savedEmail) {
          // Valid session exists, auto-login
          setIsAuthenticated(true);
          setUserEmail(savedEmail);
          if (onAuthenticated) {
            onAuthenticated(savedEmail);
          }
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

    // Get shared password from environment variable
    const correctPassword =
      import.meta.env.VITE_SHARED_PASSWORD || "HausaPlanner2025";

    // Validate password (case-sensitive)
    if (password !== correctPassword) {
      setError(
        "Incorrect password. Please check your purchase email for the correct password."
      );
      setIsLoading(false);
      return;
    }

    // TODO: Phase 2 - Validate email against Supabase purchases
    // For now, accept any email with correct password

    // Create session
    const session = {
      email: email.trim().toLowerCase(),
      authenticatedAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION,
    };

    // Store session
    localStorage.setItem("hwg_auth_session", JSON.stringify(session));

    // Success - authenticate user
    setIsLoading(false);
    setIsAuthenticated(true);
    setUserEmail(session.email);

    if (onAuthenticated) {
      onAuthenticated(session.email);
    }
  };

  // If authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <span className="text-3xl">💍</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hausa Wedding Guide
          </h1>
          <p className="text-gray-600">Interactive Wedding Planner</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 mb-6">
            Enter your details to access your wedding planner
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="bride@example.com"
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Use the email you provided at purchase
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Access Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter password from email"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Check your purchase confirmation email for the password
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? "Logging in..." : "Access Planner"}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Don't have access yet?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Purchase the Interactive Wedding Planner to receive your access
              password via email.
            </p>
            <a
              href="https://hausaroom.com"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit HausaRoom.com →
            </a>
          </div>

          {/* Security Note */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              🔒 Your data is encrypted and secure. Your wedding plans are saved
              automatically and accessible from any device.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? Email{" "}
            <a
              href="mailto:support@hausaroom.com"
              className="text-purple-600 hover:underline"
            >
              support@hausaroom.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
