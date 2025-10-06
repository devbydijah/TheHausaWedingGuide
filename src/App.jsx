import React, { useState, useEffect } from "react";
import "./index.css";
import LoginGate from "./components/LoginGate";
import InteractiveGuide from "./components/InteractiveGuide";

function App() {
  const [showGuide, setShowGuide] = useState(false);
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const claimParam = params.get("claim");
    const guideParam = params.get("guide");

    if (claimParam === "1") {
      setShowClaim(true);
    } else if (guideParam === "1") {
      setShowGuide(true);
    }
  }, []);

  const handlePurchase = () => {
    window.location.href =
      "https://paystack.shop/hausaroom-wedding-guide-GLQSt";
  };

  const handleAccessGuide = () => {
    setShowGuide(true);
  };

  // Show the interactive guide if authenticated
  if (showGuide) {
    return (
      <LoginGate>
        <InteractiveGuide />
      </LoginGate>
    );
  }

  // Show claim/success page after purchase
  if (showClaim) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#990200] to-[#531946] flex items-center justify-center p-8">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-[#990200] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
        >
          Skip to main content
        </a>

        <main id="main-content" className="max-w-4xl mx-auto text-white">
          {/* Logo Header */}
          <header className="text-center mb-8">
            <img
              src="/assets/logowhite.jpg"
              alt="Hausa Wedding Guide Logo"
              className="h-16 md:h-20 mx-auto mb-4 rounded-lg shadow-lg"
            />
          </header>

          <section
            className="text-center mb-12"
            aria-labelledby="success-heading"
          >
            <div className="text-6xl mb-6" role="img" aria-label="Celebration">
              🎉
            </div>
            <h1
              id="success-heading"
              className="font-playfair text-4xl md:text-6xl font-bold mb-6"
            >
              Thank You for Your Purchase!
            </h1>
            <p className="font-inter text-xl mb-8">
              Your Interactive Wedding Guide is ready to use.
            </p>
          </section>

          <section
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8"
            aria-labelledby="included-features"
          >
            <h2
              id="included-features"
              className="font-playfair text-2xl font-bold mb-4"
            >
              What's Included:
            </h2>
            <ul className="space-y-3 text-lg font-inter">
              <li className="flex items-start">
                <span className="text-2xl mr-3">✨</span>
                <span>Vision & Values Quiz to discover your wedding style</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">💰</span>
                <span>Smart Budget Builder with real-time calculations</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">📋</span>
                <span>Vendor Tracker to organize all your contacts</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">📅</span>
                <span>Timeline & Task Manager with priority sorting</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">☁️</span>
                <span>Cloud sync across all your devices</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">💾</span>
                <span>Automatic progress saving</span>
              </li>
            </ul>
          </section>

          <section
            className="bg-[#CE805C]/20 border-2 border-[#CE805C] rounded-2xl p-6 mb-8"
            aria-labelledby="email-notice"
          >
            <h3
              id="email-notice"
              className="font-playfair text-xl font-bold mb-3"
            >
              <span role="img" aria-label="Email">
                📧
              </span>{" "}
              Check Your Email
            </h3>
            <p className="font-inter text-lg mb-2">
              We've sent you an email with your login credentials and access
              instructions.
            </p>
            <p className="font-inter text-sm opacity-90">
              If you don't see it, check your spam folder.
            </p>
          </section>

          <div className="text-center">
            <button
              onClick={handleAccessGuide}
              className="bg-[#CE805C] hover:bg-[#740015] text-white px-12 py-4 rounded-xl text-xl font-semibold font-inter transition-all shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50"
              aria-label="Access your interactive wedding guide"
            >
              Access Your Interactive Guide
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Default landing page for new visitors
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#990200] to-[#531946] flex items-center justify-center p-8">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-[#990200] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      <main id="main-content" className="max-w-6xl mx-auto">
        {/* Logo Header */}
        <header className="text-center mb-8">
          <img
            src="/assets/logowhite.jpg"
            alt="Hausa Wedding Guide Logo"
            className="h-20 md:h-24 mx-auto mb-4 rounded-lg shadow-2xl"
          />
        </header>

        <section
          className="text-center text-white mb-12"
          aria-labelledby="hero-heading"
        >
          <h1
            id="hero-heading"
            className="font-playfair text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-[#CE805C] bg-clip-text text-transparent"
          >
            Interactive Wedding Guide
          </h1>
          <p className="font-inter text-2xl mb-4">
            Your Complete Digital Wedding Planning Assistant
          </p>
          <p className="font-inter text-xl opacity-90">
            Plan your perfect Hausa wedding with our comprehensive interactive
            tools
          </p>
        </section>

        {/* Hero Images Grid */}
        <div
          className="grid md:grid-cols-3 gap-4 mb-12"
          role="img"
          aria-label="Traditional Hausa wedding photography gallery"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 fade-in-up-delay-1">
            <img
              src="/assets/couple2.png"
              alt="Traditional Hausa wedding couple celebrating"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 fade-in-up-delay-2">
            <img
              src="/assets/bride2.png"
              alt="Hausa bride in traditional wedding attire"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 fade-in-up-delay-3">
            <img
              src="/assets/bride3.png"
              alt="Beautiful Hausa bride portrait"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 fade-in-up-delay-1">
            <div className="text-4xl mb-4" role="img" aria-label="Sparkles">
              ✨
            </div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-3">
              Discover Your Style
            </h3>
            <p className="font-inter text-white/90">
              Take our Vision & Values Quiz to uncover your unique wedding
              aesthetic and preferences
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 fade-in-up-delay-2">
            <div className="text-4xl mb-4" role="img" aria-label="Money bag">
              💰
            </div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-3">
              Smart Budgeting
            </h3>
            <p className="font-inter text-white/90">
              Build and manage your wedding budget with real-time calculations
              and expense tracking
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 fade-in-up-delay-3">
            <div className="text-4xl mb-4" role="img" aria-label="Clipboard">
              📋
            </div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-3">
              Vendor Management
            </h3>
            <p className="font-inter text-white/90">
              Keep track of all your vendors, contracts, and communications in
              one organized place
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 fade-in-up-delay-4">
            <div className="text-4xl mb-4" role="img" aria-label="Cloud">
              ☁️
            </div>
            <h3 className="font-playfair text-2xl font-bold text-white mb-3">
              Cloud Sync
            </h3>
            <p className="font-inter text-white/90">
              Access your wedding plans from any device - your data
              automatically syncs everywhere
            </p>
          </div>
        </section>

        <section className="text-center fade-in-up-delay-5">
          <div className="mb-6">
            <span className="font-playfair text-5xl font-bold text-white">
              ₦100
            </span>
            <span className="font-inter text-xl text-white/80 ml-2">
              one-time payment
            </span>
          </div>
          <button
            onClick={handlePurchase}
            className="bg-[#CE805C] hover:bg-[#740015] text-white px-12 py-5 rounded-xl text-2xl font-semibold font-inter transition-all shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50"
            aria-label="Purchase Interactive Wedding Guide for 100 Naira"
          >
            Get Started - ₦100
          </button>
          <p className="font-inter text-white/70 mt-4 text-sm">
            Lifetime access • Cloud sync included • No monthly fees
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
