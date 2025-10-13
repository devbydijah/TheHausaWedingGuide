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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [accessStatus, setAccessStatus] = useState(null); // { hasAccess, daysRemaining, expiresAt }
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false); // NEW: Toggle between login/signup

  // Check for existing session on mount + check for email parameter
  useEffect(() => {
    // Check if email parameter is in URL (from purchase email)
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");

    if (emailParam) {
      setEmail(emailParam);
      setIsSignupMode(true); // Show signup form for new users
    }

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
        // Get current session to pass user object
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setIsAuthenticated(true);
        setUserEmail(userEmail);

        const statusData = {
          hasAccess: true,
          daysRemaining: data.days_remaining,
          expiresAt: data.expires_at,
          isOnboarded: data.is_onboarded,
          user: session?.user || null,
          userData: {
            brideName: data.bride_name,
            weddingDate: data.wedding_date,
          },
        };

        setAccessStatus(statusData);

        if (onAuthenticated) {
          onAuthenticated(userEmail, statusData);
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
            "Incorrect email or password. Please check your credentials or create an account if you haven't already."
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate inputs
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // First, check if user has purchased (exists in web_app_users)
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("web_app_users")
        .select("email, paystack_reference")
        .eq("email", email.trim().toLowerCase())
        .single();

      if (purchaseError || !purchaseData) {
        setError(
          "No purchase found for this email. Please complete payment first or use the email from your purchase confirmation."
        );
        setIsLoading(false);
        return;
      }

      // Create Supabase auth account
      const { data: signupData, error: signupError } =
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password,
          options: {
            emailRedirectTo: `${window.location.origin}/?guide=1`,
          },
        });

      if (signupError) {
        if (signupError.message.includes("already registered")) {
          setError(
            "An account with this email already exists. Please login instead."
          );
          setIsSignupMode(false); // Switch to login mode
        } else {
          setError(signupError.message);
        }
        setIsLoading(false);
        return;
      }

      // Link auth account to web_app_users
      const { error: updateError } = await supabase
        .from("web_app_users")
        .update({ auth_user_id: signupData.user.id })
        .eq("email", email.trim().toLowerCase());

      if (updateError) {
        console.error("Failed to link accounts:", updateError);
      }

      // Verify access and log in
      await verifyUserAccess(signupData.user.email);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to create account. Please try again.");
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

  const handleForgotPassword = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setError("");
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/?guide=1&reset=1`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      setTimeout(() => {
        setResetEmailSent(false);
        setShowForgotPassword(false);
      }, 5000);
    } catch (err) {
      setError(err.message || "Failed to send password reset email");
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

        {/* Login/Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Lock sx={{ fontSize: 28, color: "#CE805C" }} />
            <div>
              <h2 className="font-playfair text-2xl font-semibold text-gray-900">
                {isSignupMode ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-gray-600">
                {isSignupMode
                  ? "Set up your wedding planner account"
                  : "Access your wedding planner"}
              </p>
            </div>
          </div>

          <form
            onSubmit={isSignupMode ? handleSignup : handleLogin}
            className="space-y-4"
          >
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
                disabled={
                  isLoading ||
                  (isSignupMode &&
                    new URLSearchParams(window.location.search).get("email"))
                }
                autoComplete="email"
                autoFocus={!isSignupMode}
              />
              <p className="text-xs text-gray-500 mt-1">
                {isSignupMode
                  ? "Use the email from your purchase confirmation"
                  : "Use your registered email address"}
              </p>
            </div>

            {/* Password Input with visibility toggle */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {isSignupMode ? "Create Password" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                  placeholder={
                    isSignupMode
                      ? "At least 8 characters"
                      : "Enter your password"
                  }
                  disabled={isLoading}
                  autoComplete={
                    isSignupMode ? "new-password" : "current-password"
                  }
                  autoFocus={isSignupMode}
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
              {!isSignupMode && (
                <p className="text-xs text-gray-500 mt-1">
                  Enter your password
                </p>
              )}
            </div>

            {/* Confirm Password (Signup only) */}
            {isSignupMode && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must match the password above
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Success Message for Password Reset */}
            {resetEmailSent && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  ✅ Password reset email sent! Check your inbox.
                </p>
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
                  {isSignupMode ? "Creating Account..." : "Signing in..."}
                </span>
              ) : isSignupMode ? (
                "Create Account & Continue"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Toggle between Login/Signup */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-3">
              {isSignupMode ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignupMode(false);
                      setError("");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                    className="text-[#CE805C] hover:underline font-medium"
                  >
                    Login instead
                  </button>
                </>
              ) : (
                <>
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignupMode(true);
                      setError("");
                      setPassword("");
                    }}
                    className="text-[#CE805C] hover:underline font-medium"
                  >
                    Create account
                  </button>
                </>
              )}
            </p>

            {/* Forgot Password (Login mode only) */}
            {!isSignupMode && (
              <>
                <p className="text-xs text-gray-600 text-center mb-3">
                  Forgot your password?{" "}
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(!showForgotPassword)}
                    className="text-[#CE805C] hover:underline font-medium"
                  >
                    Reset it here
                  </button>
                </p>

                {/* Password Reset Form */}
                {showForgotPassword && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-700 mb-3">
                      Enter your email and we'll send you a password reset link.
                    </p>
                    <button
                      onClick={handleForgotPassword}
                      disabled={!email || resetEmailSent}
                      className="w-full px-4 py-2 bg-[#CE805C] text-white rounded-lg text-sm font-medium hover:bg-[#B87050] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send Reset Link
                    </button>
                  </div>
                )}
              </>
            )}

            <p className="text-xs text-gray-600 text-center mt-3">
              Need help?{" "}
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
          {isSignupMode ? (
            <p className="mt-1">
              Create your password and start planning your perfect wedding
            </p>
          ) : (
            <p className="mt-1">
              First time? Click "Create account" above to get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
