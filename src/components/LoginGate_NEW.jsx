import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Favorite, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

/**
 * LoginGate Component - Supabase Authentication
 *
 * Provides secure account-based access to the Interactive Wedding Planner.
 * Each customer gets individual credentials from their purchase email.
 *
 * Authentication Flow:
 * 1. User enters email + password (from purchase email)
 * 2. Validates with Supabase Auth
 * 3. Checks user access status (20-day period from first login)
 * 4. On first login: Redirects to onboarding to set bride name
 * 5. Session persists via Supabase (refresh tokens)
 *
 * Access Control:
 * - 20 days from first login (not purchase date)
 * - Bride name is immutable (anti-sharing measure)
 * - Multi-device support with same credentials
 */

export default function LoginGate({ children, onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [accessStatus, setAccessStatus] = useState(null); // { hasAccess, daysRemaining, expiresAt }

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Session exists, verify access
        await verifyUserAccess(session.user.email);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Session check error:", err);
      setIsLoading(false);
    }
  };

  const verifyUserAccess = async (userEmail) => {
    try {
      // Call Supabase function to check access
      const { data, error } = await supabase.rpc("check_user_access", {
        user_email: userEmail,
      });

      if (error) throw error;

      if (data.has_access) {
        setIsAuthenticated(true);
        setUserEmail(userEmail);
        setAccessStatus({
          hasAccess: true,
          daysRemaining: data.days_remaining,
          expiresAt: data.expires_at,
          isOnboarded: data.is_onboarded,
        });

        if (onAuthenticated) {
          onAuthenticated(userEmail, data);
        }
      } else {
        // Access expired
        setError(
          `Your 20-day access period has expired. Please contact support if you need assistance.`
        );
        await supabase.auth.signOut();
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Access verification error:", err);
      setError("Error verifying access. Please try again.");
      setIsLoading(false);
    }
  };

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
      setError("Please enter your password");
      setIsLoading(false);
      return;
    }

    try {
      // Sign in with Supabase Auth
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password,
        });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError(
            "Incorrect email or password. Please check your purchase email for the correct credentials."
          );
        } else {
          setError(signInError.message);
        }
        setIsLoading(false);
        return;
      }

      // Verify user has access (20-day period)
      await verifyUserAccess(data.user.email);
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserEmail("");
      setAccessStatus(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // If authenticated and access is valid, render children
  if (isAuthenticated && accessStatus?.hasAccess) {
    return (
      <>
        {/* Access Status Banner */}
        {accessStatus.daysRemaining <= 5 && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-center">
            <p className="text-sm text-yellow-800">
              ⏰ Your access expires in{" "}
              <strong>{accessStatus.daysRemaining} days</strong>. Make sure to
              export your personalized plan!
            </p>
          </div>
        )}
        {children}
      </>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#740015]/10 via-[#531946]/10 to-[#CE805C]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#CE805C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#740015]/10 via-[#531946]/10 to-[#CE805C]/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#740015] to-[#531946] rounded-full mb-4 shadow-lg">
            <Favorite sx={{ fontSize: 40, color: "white" }} />
          </div>
          <h1 className="font-playfair text-3xl font-bold bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent mb-2">
            Hausa Wedding Guide
          </h1>
          <p className="text-gray-600 font-inter">
            Interactive Wedding Planner
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Lock sx={{ fontSize: 28, color: "#CE805C" }} />
            <div>
              <h2 className="font-playfair text-2xl font-semibold text-gray-900">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-600">
                Access your wedding planner
              </p>
            </div>
          </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                placeholder="bride@example.com"
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                Use the email from your purchase confirmation
              </p>
            </div>

            {/* Password Input with visibility toggle */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                  placeholder="Enter password from email"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ fontSize: 20 }} />
                  ) : (
                    <Visibility sx={{ fontSize: 20 }} />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Check your purchase email for your password
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#740015] to-[#531946] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              Can't find your password?{" "}
              <a
                href="mailto:support@hausaroom.com"
                className="text-[#CE805C] hover:underline font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Secure authentication powered by Supabase</p>
          <p className="mt-1">
            Your credentials were sent to your email after purchase
          </p>
        </div>
      </div>
    </div>
  );
}
