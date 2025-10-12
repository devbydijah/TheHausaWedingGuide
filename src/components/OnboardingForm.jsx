import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Favorite, CalendarToday, Person } from "@mui/icons-material";

/**
 * OnboardingForm Component
 *
 * Captures critical bride information on first login.
 * This data is IMMUTABLE to prevent account sharing.
 *
 * Flow:
 * 1. Shows modal blocking access to guide
 * 2. Requires bride's name (mandatory)
 * 3. Optionally captures wedding date
 * 4. Calls complete_onboarding() Postgres function
 * 5. Sets is_onboarded = true
 * 6. Allows access to guide
 *
 * Anti-Sharing Measure:
 * - bride_name cannot be changed after submission
 * - Wedding date can be updated later in settings
 * - This creates accountability and personalization
 */

export default function OnboardingForm({ userEmail, onComplete }) {
  const [brideName, setBrideName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!brideName.trim()) {
      setError("Please enter the bride's name");
      return;
    }

    if (brideName.trim().length < 2) {
      setError("Please enter a valid name (at least 2 characters)");
      return;
    }

    if (weddingDate) {
      const selectedDate = new Date(weddingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setError("Wedding date cannot be in the past");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Call Postgres function to complete onboarding
      const { data, error: rpcError } = await supabase.rpc(
        "complete_onboarding",
        {
          user_email: userEmail,
          bride_name: brideName.trim(),
          wedding_date: weddingDate || null,
        }
      );

      if (rpcError) {
        console.error("Onboarding error:", rpcError);
        setError(
          "Failed to save your information. Please try again or contact support."
        );
        setIsSubmitting(false);
        return;
      }

      // Success - notify parent component
      if (onComplete) {
        onComplete({
          brideName: brideName.trim(),
          weddingDate: weddingDate || null,
        });
      }
    } catch (err) {
      console.error("Unexpected onboarding error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#740015] to-[#531946] px-8 py-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Favorite sx={{ fontSize: 32 }} />
            <h2 className="font-playfair text-2xl font-bold">
              Welcome to Your Wedding Journey!
            </h2>
          </div>
          <p className="text-white/90 text-sm">
            Let's personalize your planning experience
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#CE805C]/10 flex items-center justify-center">
                <span className="text-[#CE805C] font-bold text-sm">1</span>
              </div>
              <h3 className="font-semibold text-gray-900">
                Tell us about yourself
              </h3>
            </div>
            <p className="text-sm text-gray-600 ml-10">
              This information helps us create your personalized wedding plan
              and ensures your account stays secure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Bride Name Input */}
            <div>
              <label
                htmlFor="brideName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Bride's Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Person sx={{ fontSize: 20 }} />
                </div>
                <input
                  type="text"
                  id="brideName"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                  placeholder="Enter the bride's name"
                  disabled={isSubmitting}
                  autoFocus
                  maxLength={100}
                />
              </div>
              <p className="text-xs text-amber-600 mt-1.5 flex items-start gap-1">
                <span className="mt-0.5">⚠️</span>
                <span>
                  Important: This name will appear on your personalized plan and
                  cannot be changed later for security reasons.
                </span>
              </p>
            </div>

            {/* Wedding Date Input (Optional) */}
            <div>
              <label
                htmlFor="weddingDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Wedding Date{" "}
                <span className="text-gray-400 font-normal text-xs">
                  (Optional)
                </span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <CalendarToday sx={{ fontSize: 20 }} />
                </div>
                <input
                  type="date"
                  id="weddingDate"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE805C] focus:border-transparent transition-all"
                  disabled={isSubmitting}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                You can update this later in your settings
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
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#740015] to-[#531946] text-white py-3.5 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting up your account...
                </span>
              ) : (
                "Continue to Wedding Planner"
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">
              📊 Your Information is Secure
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Your data is encrypted and stored securely</li>
              <li>• Only you can access your wedding plan</li>
              <li>• Your personalized plan will include this information</li>
              <li>• This helps prevent account sharing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
