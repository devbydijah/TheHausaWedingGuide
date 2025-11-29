import { useState, useEffect } from "react";
// --- CORRECT IMPORT PATH ---
import { supabase } from "../lib/supabase"; // Use lib/supabase.js
// --- END CORRECT IMPORT PATH ---
import {
  Favorite,
  Lock,
  Visibility,
  VisibilityOff,
  Email,
  Key,
} from "@mui/icons-material";

/**
 * LoginGate Component - Supabase Authentication
 *
 * Handles Login, Signup, Password Reset Request, and New Password Setting.
 * Provides secure account-based access to the Interactive Wedding Planner.
 *
 * Authentication Flow:
 * 1. Shows Login or Signup form based on URL param or user toggle.
 * 2. Validates credentials with Supabase Auth.
 * 3. Checks user access status (via check_user_access function).
 * 4. Redirects to onboarding if needed.
 * 5. Handles Password Recovery flow via onAuthStateChange listener.
 */
export default function LoginGate({ children, onAuthenticated }) {
  // State for different views
  const [view, setView] = useState("login"); // 'login', 'signup', 'forgot_password', 'update_password'

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status/Error states
  const [message, setMessage] = useState(""); // General messages (e.g., reset link sent)
  const [error, setError] = useState(""); // Authentication errors
  const [isLoading, setIsLoading] = useState(true);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [accessStatus, setAccessStatus] = useState(null); // { hasAccess, daysRemaining, expiresAt, ... }
  const [recoverySession, setRecoverySession] = useState(null); // Stores session during password update

  // Check session & URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
      setView("signup"); // Default to signup if email is prefilled
    }
    checkSession(); // Check for existing Supabase session

    // --- Add Auth State Change Listener for Password Recovery ---
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // This event fires when the user clicks the reset link and Supabase redirects back
      if (event === "PASSWORD_RECOVERY") {
        setRecoverySession(session); // Store session needed for updateUser
        setView("update_password"); // Show the form to set a new password
        setMessage(""); // Clear any previous messages
        setError("");
      } else if (event === "SIGNED_IN") {
        // If already signed in (e.g., session restored), verify access
        if (session?.user) {
          verifyUserAccess(session.user.email);
        }
      } else if (event === "SIGNED_OUT") {
        // Handle sign out if needed externally
        setIsAuthenticated(false);
        setUserEmail("");
        setAccessStatus(null);
        setRecoverySession(null);
        setView("login"); // Go back to login view on sign out
      }
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []); // Run only once on mount

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await verifyUserAccess(session.user.email);
      } else {
        setIsLoading(false); // No session, ready for login/signup
      }
    } catch (err) {
      console.error("Session check error:", err);
      setError("Failed to check session. Please try refreshing.");
      setIsLoading(false);
    }
  };

  const verifyUserAccess = async (verifiedEmail) => {
    try {
      setIsLoading(true); // Start loading during verification
      const { data, error: rpcError } = await supabase.rpc(
        "check_user_access",
        {
          user_email: verifiedEmail,
        }
      );

      if (rpcError) throw rpcError;

      if (data.has_access) {
        const {
          data: { session },
        } = await supabase.auth.getSession(); // Get current session again
        setIsAuthenticated(true);
        setUserEmail(verifiedEmail);

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
          onAuthenticated(verifiedEmail, statusData);
        }
        // Don't set isLoading false here, let the parent component handle rendering the children
      } else {
        setError(
          data.reason ||
            `Your access period may have expired. Please contact support.`
        );
        await supabase.auth.signOut();
        setIsLoading(false); // Stop loading as access is denied
      }
    } catch (err) {
      console.error("Access verification error:", err);
      setError(
        "Error verifying access. Please try logging in again or contact support."
      );
      await supabase.auth.signOut(); // Sign out on error
      setIsLoading(false); // Stop loading on error
    }
    // No setIsLoading(false) here on success, parent takes over
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!email.trim() || !email.includes("@")) {
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
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password,
        });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError(
            "Incorrect email or password. Please check your credentials."
          );
        } else {
          setError(signInError.message);
        }
        setIsLoading(false);
        return;
      }

      await verifyUserAccess(data.user.email); // Let verify handle isLoading
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }
    if (!password.trim() || password.length < 8) {
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
      // Check purchase exists first
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("web_app_users")
        .select("email")
        .eq("email", email.trim().toLowerCase())
        .maybeSingle(); // Use maybeSingle to handle not found gracefully

      // Handle specific error case for no user found
      if (purchaseError && purchaseError.code !== "PGRST116") {
        // PGRST116 means 0 rows found
        throw purchaseError;
      }

      if (!purchaseData) {
        setError(
          "No purchase found for this email. Please complete payment first or check the email address used for purchase."
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
            // Supabase uses Site URL from dashboard by default if emailRedirectTo is not set here
            // emailRedirectTo: `${window.location.origin}/?guide=1`, // Optionally override default
          },
        });

      if (signupError) {
        if (signupError.message.includes("User already registered")) {
          setError(
            "An account with this email already exists. Please login instead."
          );
          setView("login"); // Switch to login view
        } else {
          setError(signupError.message);
        }
        setIsLoading(false);
        return;
      }

      // If signup needs confirmation, show a message
      if (signupData.user && !signupData.session) {
        setMessage(
          "Account created! Please check your email (" +
            email.trim().toLowerCase() +
            ") for a confirmation link to activate your account."
        );
        setIsLoading(false);
        // Don't verify access yet, wait for confirmation
        return;
      }

      // If user is immediately authenticated (e.g., email confirmation disabled), link and verify
      if (signupData.user && signupData.session) {
        // Link auth account to web_app_users (best effort)
        const { error: updateError } = await supabase
          .from("web_app_users")
          .update({ auth_user_id: signupData.user.id })
          .eq("email", email.trim().toLowerCase());
        if (updateError) {
          console.error("Failed to link accounts:", updateError); // Log but don't block
        }
        await verifyUserAccess(signupData.user.email); // Proceed to verify access
      } else {
        // Should not happen if confirmation is needed, but handle defensively
        setError(
          "Signup process incomplete. Please check your email or try again."
        );
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        `Failed to create account: ${err.message || "Please try again."}`
      );
      setIsLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          // Supabase uses Site URL from dashboard by default if redirectTo is not set
          // redirectTo: `${window.location.origin}/?guide=1`, // Optionally override
        }
      );

      if (resetError) throw resetError;

      setMessage(
        "Password reset link sent! Please check your email (" +
          email.trim().toLowerCase() +
          ")."
      );
      setView("login"); // Go back to login view after sending
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(
        err.message || "Failed to send password reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    if (!password.trim() || password.length < 8) {
      setError("New password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // updateUser requires an active session, which onAuthStateChange provides via recoverySession
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setMessage(
        "Password updated successfully! You can now log in with your new password."
      );
      setPassword(""); // Clear password fields
      setConfirmPassword("");
      setRecoverySession(null); // Clear recovery session
      setView("login"); // Redirect to login
    } catch (err) {
      console.error("Update password error:", err);
      setError(
        err.message ||
          "Failed to update password. Please try the reset process again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // If authenticated and access is valid, render the main application content
  if (isAuthenticated && accessStatus?.hasAccess) {
    return (
      <>
        {/* Access Status Banner (Optional) */}
        {accessStatus.daysRemaining != null &&
          accessStatus.daysRemaining <= 5 && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-center sticky top-0 z-40">
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

  // Loading state while checking session
  if (isLoading && !error && !message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#740015]/10 via-[#531946]/10 to-[#CE805C]/10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#CE805C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // --- Render different forms based on the 'view' state ---

  const renderForm = () => {
    switch (view) {
      case "signup":
        return (
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email-signup"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email-signup"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                placeholder="your-email@example.com"
                required
                disabled={
                  isLoading ||
                  new URLSearchParams(window.location.search).get("email")
                }
                autoComplete="email"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use the email from your purchase confirmation.
              </p>
            </div>
            {/* Create Password Input */}
            <div>
              <label
                htmlFor="password-signup"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Create Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password-signup"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                  placeholder="At least 8 characters"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
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
            </div>
            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword-signup"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword-signup"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                placeholder="Re-enter your password"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must match the password above.
              </p>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#740015] to-[#531946] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Creating Account..." : "Create Account & Continue"}
            </button>
          </form>
        );

      case "forgot_password":
        return (
          <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
            <div>
              <label
                htmlFor="email-forgot"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email-forgot"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                placeholder="your-email@example.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the email associated with your account.
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        );

      case "update_password":
        return (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* New Password Input */}
            <div>
              <label
                htmlFor="password-update"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password-update"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                  placeholder="At least 8 characters"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
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
            </div>
            {/* Confirm New Password Input */}
            <div>
              <label
                htmlFor="confirmPassword-update"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword-update"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                placeholder="Re-enter your new password"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must match the new password above.
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#740015] to-[#531946] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Updating..." : "Update Password & Continue"}
            </button>
          </form>
        );

      case "login":
      default:
        return (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email-login"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email-login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                placeholder="your-email@example.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {/* Password Input */}
            <div>
              <label
                htmlFor="password-login"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password-login"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
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
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#740015] to-[#531946] text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        );
    }
  };

  const getTitle = () => {
    switch (view) {
      case "signup":
        return "Create Your Account";
      case "forgot_password":
        return "Reset Your Password";
      case "update_password":
        return "Set New Password";
      case "login":
      default:
        return "Welcome Back";
    }
  };

  const getSubtitle = () => {
    switch (view) {
      case "signup":
        return "Set up your wedding planner account";
      case "forgot_password":
        return "Enter your email to receive a reset link";
      case "update_password":
        return "Enter and confirm your new password";
      case "login":
      default:
        return "Access your wedding planner";
    }
  };

  // --- Render the main LoginGate structure ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#740015]/10 via-[#531946]/10 to-[#CE805C]/10 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#740015] to-[#531946] rounded-full mb-4 shadow-lg">
            <Favorite sx={{ fontSize: 40, color: "white" }} />
          </div>
          <h1 className="font-playfair text-3xl font-bold bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent mb-2">
            Northern Wedding Guide
          </h1>
          <p className="text-gray-600 font-inter">
            Interactive Wedding Planner
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Lock sx={{ fontSize: 28, color: "#CE805C" }} />
            <div>
              <h2 className="font-playfair text-2xl font-semibold text-gray-900">
                {getTitle()}
              </h2>
              <p className="text-sm text-gray-600">{getSubtitle()}</p>
            </div>
          </div>

          {/* Render the current form */}
          {renderForm()}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* General Message */}
          {message && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {/* Footer links */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-600 text-center space-y-3">
            {view === "login" && (
              <>
                <p>
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setView("signup");
                      setError("");
                      setMessage("");
                      setPassword("");
                    }}
                    className="text-[#CE805C] hover:underline font-medium"
                  >
                    Create account
                  </button>
                </p>
                <p>
                  Forgot your password?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setView("forgot_password");
                      setError("");
                      setMessage("");
                    }}
                    className="text-[#CE805C] hover:underline font-medium"
                  >
                    Reset it here
                  </button>
                </p>
              </>
            )}
            {view === "signup" && (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setMessage("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-[#CE805C] hover:underline font-medium"
                >
                  Login instead
                </button>
              </p>
            )}
            {(view === "forgot_password" || view === "update_password") && (
              <p>
                Remembered your password?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setView("login");
                    setError("");
                    setMessage("");
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  className="text-[#CE805C] hover:underline font-medium"
                >
                  Back to Login
                </button>
              </p>
            )}
            <p className="pt-2">
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
        </div>
      </div>
    </div>
  );
}
