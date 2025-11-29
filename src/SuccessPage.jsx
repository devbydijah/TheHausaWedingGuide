// src/SuccessPage.jsx

import {
  CheckCircleIcon,
  SparkleIcon,
  CloudIcon,
  LockKeyIcon,
  EnvelopeSimpleIcon,
} from "@phosphor-icons/react";
// --- END CORRECTED ICON IMPORTS ---

function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#740015]/5 via-[#531946]/5 to-[#CE805C]/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-2xl animate-bounce-slow">
            <CheckCircleIcon size={60} weight="bold" className="text-white" />{" "}
            {/* Correct Usage */}
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#740015] via-[#531946] to-[#CE805C] bg-clip-text text-transparent mb-3">
            Thank You for Your Purchase!
          </h1>
          <p className="text-xl text-gray-700 font-inter">
            Your Interactive Wedding Guide is ready to use.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-[#740015] to-[#531946] p-8 text-white">
            <h2 className="font-playfair text-2xl font-bold mb-2">
              What's Included:
            </h2>
            <p className="text-white/90 text-sm">
              Everything you need to plan your perfect Northern Nigerian wedding
            </p>
          </div>

          {/* Features Grid */}
          <div className="p-8 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: SparkleIcon,
                  text: "Vision & Values Quiz to discover your wedding style",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: CloudIcon,
                  text: "Smart Budget Builder with real-time calculations",
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  icon: LockKeyIcon,
                  text: "Vendor Tracker to organize all your contacts",
                  color: "from-green-500 to-teal-500",
                },
                {
                  icon: CheckCircleIcon,
                  text: "Timeline & Task Manager with priority sorting",
                  color: "from-blue-500 to-indigo-500",
                },
                {
                  icon: CloudIcon,
                  text: "Cloud sync across all your devices",
                  color: "from-cyan-500 to-blue-500",
                },
                {
                  icon: CheckCircleIcon,
                  text: "Automatic progress saving",
                  color: "from-red-500 to-pink-500",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                  >
                    <feature.icon
                      size={20}
                      weight="bold"
                      className="text-white"
                    />{" "}
                    {/* Correct Usage */}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed pt-1">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Email Notification Box */}
            <div className="bg-gradient-to-br from-[#CE805C]/10 to-[#531946]/10 border-2 border-[#CE805C]/30 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#CE805C] to-[#740015] rounded-full flex items-center justify-center">
                  <EnvelopeSimpleIcon
                    size={24}
                    weight="bold"
                    className="text-white"
                  />{" "}
                  {/* Correct Usage */}
                </div>
                <div className="flex-1">
                  <h3 className="font-playfair text-xl font-bold text-gray-900 mb-2">
                    📧 Check Your Email
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We've sent you an email with your{" "}
                    <strong>login credentials</strong> and{" "}
                    <strong>access instructions</strong>.
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    If you don't see it, check your spam folder.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a
                href="/?guide=1"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#CE805C] to-[#740015] text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <LockKeyIcon size={24} weight="bold" /> {/* Correct Usage */}
                Access Your Interactive Guide
              </a>
              <p className="text-sm text-gray-500 mt-4">
                Use the credentials from your email to log in
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 border-t-2 border-green-200 p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon
                  size={20}
                  weight="bold"
                  className="text-white"
                />{" "}
                {/* Correct Usage */}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  ⏰ 20-Day Access Period
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Your access begins from your <strong>first login</strong> and
                  lasts for 20 days. This gives you dedicated time to plan your
                  wedding with full access to all features. Make the most of it!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Need help? Email{" "}
            <a
              href="mailto:support@hausaroom.com"
              className="text-[#CE805C] font-semibold hover:underline"
            >
              {" "}
              {/* Updated Email */}
              support@hausaroom.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
