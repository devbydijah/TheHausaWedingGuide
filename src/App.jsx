import React, { useState, useEffect } from "react";
import {
  List,
  X,
  ArrowUp,
  Sparkle,
  CurrencyCircleDollar,
  ClipboardText,
  CalendarBlank,
  Cloud,
  FloppyDisk,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import "./index.css";
import LoginGate from "./components/LoginGate";
import InteractiveGuide from "./components/InteractiveGuide";

function App() {
  const [showGuide, setShowGuide] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [showNav, setShowNav] = useState(true); // Always show nav
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  // Scroll spy for navigation and back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Show back to top button after scrolling down
      setShowBackToTop(scrollPosition > 500);

      // Update active section
      const sections = [
        "hero",
        "features",
        "why-choose",
        "how-it-works",
        "pricing",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 100 && bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed nav height
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
      setMobileMenuOpen(false); // Close mobile menu after clicking
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
    <div className="min-h-screen bg-[#F9F4F1]">
      {/* Overlay for mobile menu - should be behind menu but above content */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Floating Navigation Bar - Always Visible */}
      <nav className="fixed top-0 left-0 right-0 z-[70] bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Always visible */}
            <div className="flex items-center py-2">
              <img
                src="/assets/logowhite.jpg"
                alt="Hausa Wedding Guide"
                className="h-12 md:h-14 w-auto object-contain rounded-lg"
              />
            </div>

            {/* Desktop Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { id: "hero", label: "Home" },
                { id: "features", label: "Features" },
                { id: "why-choose", label: "Why Choose" },
                { id: "how-it-works", label: "How It Works" },
                { id: "pricing", label: "Pricing" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${
                    activeSection === item.id
                      ? "text-[#740015] font-semibold bg-[#740015]/5"
                      : "text-gray-700 hover:text-[#740015]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop CTA Button - Hidden on mobile */}
            <button
              onClick={handlePurchase}
              className="hidden md:inline-flex px-6 py-2.5 bg-[#CE805C] hover:bg-[#B87050] text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Get Started
            </button>

            {/* Mobile Menu Button - ONLY visible on mobile, HIDDEN on desktop */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={28} weight="bold" />
              ) : (
                <List size={28} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Slide-out Panel - Only on small screens */}
      <div
        className={`md:hidden fixed top-16 right-0 h-screen w-64 bg-white shadow-2xl z-[80] transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-4 py-6 space-y-3">
          {[
            { id: "hero", label: "Home" },
            { id: "features", label: "Features" },
            { id: "why-choose", label: "Why Choose" },
            { id: "how-it-works", label: "How It Works" },
            { id: "pricing", label: "Pricing" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeSection === item.id
                  ? "bg-[#740015]/5 text-[#740015] font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handlePurchase}
            className="w-full px-6 py-3 bg-[#CE805C] hover:bg-[#B87050] text-white font-semibold rounded-lg shadow-md transition-all duration-300 mt-4"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Hero Section - Dark Gradient */}
      <section
        id="hero"
        className="relative min-h-screen bg-gradient-to-br from-[#990200] via-[#740015] to-[#531946] overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#CE805C]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          {/* Hero Section with enhanced typography */}
          <section
            className="text-center text-white mb-16 animate-slide-up"
            aria-labelledby="hero-heading"
          >
            <div className="inline-block mb-6">
              <span className="bg-gradient-to-r from-[#CE805C] to-[#D4A574] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 justify-center">
                <Sparkle size={20} weight="duotone" />
                <span>Your Complete Wedding Planning Solution</span>
              </span>
            </div>

            <h1
              id="hero-heading"
              className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-[#D4A574] to-white bg-clip-text text-transparent animate-gradient">
                Interactive
              </span>
              <br />
              <span className="text-white">Wedding Guide</span>
            </h1>

            <p className="font-inter text-xl sm:text-2xl md:text-3xl mb-4 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your Complete Digital Wedding Planning Assistant
            </p>

            <p className="font-inter text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Plan your perfect Hausa wedding with our comprehensive interactive
              tools and cultural guidance
            </p>
          </section>

          {/* Hero Images Grid with responsive circular images */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 animate-fade-in-delay"
            role="img"
            aria-label="Traditional Hausa wedding photography gallery"
          >
            <div className="group mx-auto">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-[#CE805C]/40">
                <img
                  src="/assets/couple2.png"
                  alt="Traditional Hausa wedding couple celebrating"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#740015]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
            </div>

            <div className="group mx-auto">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-[#CE805C]/40">
                <img
                  src="/assets/bride2.png"
                  alt="Hausa bride in traditional wedding attire"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#740015]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
            </div>

            <div className="group mx-auto">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-[#CE805C]/40">
                <img
                  src="/assets/bride3.png"
                  alt="Beautiful Hausa bride portrait"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#740015]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section - Light Background */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* What's Included Section */}
          <div className="animate-slide-up">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#740015] mb-4">
                Everything You Need to Plan Your Perfect Day
              </h2>
              <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
                Powerful tools and cultural guidance all in one interactive
                platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="group bg-gradient-to-br from-[#990200]/5 to-[#740015]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#740015]/20 hover:border-[#CE805C]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-[#CE805C]/10 to-[#740015]/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Sparkle
                    size={40}
                    weight="duotone"
                    className="text-[#CE805C]"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#740015] mb-3">
                  Vision & Values Quiz
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discover your unique wedding style and aesthetic preferences
                </p>
              </div>

              <div className="group bg-gradient-to-br from-[#990200]/5 to-[#740015]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#740015]/20 hover:border-[#CE805C]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-[#CE805C]/10 to-[#740015]/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <CurrencyCircleDollar
                    size={40}
                    weight="duotone"
                    className="text-[#CE805C]"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#740015] mb-3">
                  Smart Budget Builder
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Real-time calculations and comprehensive expense tracking
                </p>
              </div>

              <div className="group bg-gradient-to-br from-[#990200]/5 to-[#740015]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#740015]/20 hover:border-[#CE805C]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-[#CE805C]/10 to-[#740015]/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <ClipboardText
                    size={40}
                    weight="duotone"
                    className="text-[#CE805C]"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#740015] mb-3">
                  Vendor Tracker
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Organize all your contacts and communications effortlessly
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="group bg-gradient-to-br from-[#990200]/5 to-[#740015]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#740015]/20 hover:border-[#CE805C]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-[#CE805C]/10 to-[#740015]/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <CalendarBlank
                    size={40}
                    weight="duotone"
                    className="text-[#CE805C]"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#740015] mb-3">
                  Timeline Manager
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Priority sorting and task management for stress-free planning
                </p>
              </div>

              <div className="group bg-gradient-to-br from-[#990200]/5 to-[#740015]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#740015]/20 hover:border-[#CE805C]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-[#CE805C]/10 to-[#740015]/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Cloud
                    size={40}
                    weight="duotone"
                    className="text-[#CE805C]"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#740015] mb-3">
                  Cloud Sync
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Access your plans from any device with automatic syncing
                </p>
              </div>

              <div className="group bg-gradient-to-br from-[#990200]/5 to-[#740015]/10 backdrop-blur-xl rounded-2xl p-8 border border-[#740015]/20 hover:border-[#CE805C]/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-[#CE805C]/10 to-[#740015]/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <FloppyDisk
                    size={40}
                    weight="duotone"
                    className="text-[#CE805C]"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#740015] mb-3">
                  Auto-Save Progress
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Never lose your work with automatic progress saving
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Interactive Guide Section - Dark Gradient */}
      <section
        id="why-choose"
        className="py-20 bg-gradient-to-r from-[#740015] via-[#8B0000] to-[#740015]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Why Choose Interactive Guide Section */}
          <div className="animate-slide-up">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
                Why Choose the Interactive Guide?
              </h2>
              <p className="text-white/90 text-lg max-w-3xl mx-auto">
                More than just a PDF - a complete digital planning experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#CE805C] flex items-center justify-center">
                    <CheckCircle
                      size={24}
                      weight="bold"
                      className="text-white"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Live Updates & Calculations
                  </h3>
                  <p className="text-white/80">
                    Budget calculations update instantly as you make changes -
                    no manual math needed
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#CE805C] flex items-center justify-center">
                    <CheckCircle
                      size={24}
                      weight="bold"
                      className="text-white"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Access Anywhere
                  </h3>
                  <p className="text-white/80">
                    Cloud sync means your plans are available on any device,
                    anytime
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#CE805C] flex items-center justify-center">
                    <CheckCircle
                      size={24}
                      weight="bold"
                      className="text-white"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Never Lose Your Work
                  </h3>
                  <p className="text-white/80">
                    Automatic saving ensures your planning progress is always
                    protected
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#CE805C] flex items-center justify-center">
                    <CheckCircle
                      size={24}
                      weight="bold"
                      className="text-white"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Personalized Experience
                  </h3>
                  <p className="text-white/80">
                    Discover your unique style with our Vision & Values Quiz
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Light Background */}
      <section id="how-it-works" className="py-20 bg-[#F9F4F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* How It Works Section */}
          <div className="animate-slide-up">
            <div className="text-center mb-12">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold text-[#740015] mb-4">
                Simple 3-Step Process
              </h2>
              <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
                Get started with your wedding planning in minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#CE805C] to-[#B87050] text-white text-3xl font-bold mb-6 shadow-xl">
                  1
                </div>
                <h3 className="font-playfair text-2xl font-bold text-[#740015] mb-4">
                  Purchase & Access
                </h3>
                <p className="text-gray-600 text-lg">
                  Make your one-time payment of ₦100 and receive instant access
                  to your dashboard
                </p>
                {/* Connector line */}
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#CE805C] to-transparent"></div>
              </div>

              <div className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#CE805C] to-[#B87050] text-white text-3xl font-bold mb-6 shadow-xl">
                  2
                </div>
                <h3 className="font-playfair text-2xl font-bold text-[#740015] mb-4">
                  Discover Your Style
                </h3>
                <p className="text-gray-600 text-lg">
                  Take the Vision & Values Quiz to uncover your unique wedding
                  aesthetic
                </p>
                {/* Connector line */}
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#CE805C] to-transparent"></div>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#CE805C] to-[#B87050] text-white text-3xl font-bold mb-6 shadow-xl">
                  3
                </div>
                <h3 className="font-playfair text-2xl font-bold text-[#740015] mb-4">
                  Plan & Execute
                </h3>
                <p className="text-gray-600 text-lg">
                  Use our interactive tools to budget, organize vendors, and
                  manage your timeline
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - White Background */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pricing Section with enhanced CTA */}
          <div className="text-center bg-gradient-to-br from-[#990200]/5 to-[#740015]/10 rounded-3xl p-12 border-2 border-[#740015]/20 shadow-2xl mb-8">
            <div className="mb-8">
              <div className="inline-block mb-4">
                <span className="bg-[#CE805C] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Special Launch Offer
                </span>
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="font-playfair text-6xl md:text-7xl font-bold text-[#740015] drop-shadow-lg">
                  ₦100
                </span>
              </div>
              <p className="font-inter text-xl text-gray-600">
                one-time payment
              </p>
            </div>

            <button
              onClick={handlePurchase}
              className="group relative bg-gradient-to-r from-[#CE805C] to-[#B87050] hover:from-[#B87050] hover:to-[#740015] text-white px-16 py-6 rounded-2xl text-2xl font-bold font-inter transition-all shadow-2xl hover:shadow-[#CE805C]/50 transform hover:scale-105 hover:-translate-y-1 duration-300 mb-6"
              aria-label="Purchase Interactive Wedding Guide for 100 Naira"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span>Get Started Now</span>
                <ArrowRight
                  size={24}
                  weight="bold"
                  className="group-hover:translate-x-2 transition-transform"
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </button>

            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 text-base">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Extended access period</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-2">
                <CheckCircle
                  size={20}
                  weight="fill"
                  className="text-green-600"
                />
                <span>Cloud sync included</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-2">
                <CheckCircle
                  size={20}
                  weight="fill"
                  className="text-green-600"
                />
                <span>No monthly fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#CE805C] hover:bg-[#740015] text-white p-4 rounded-full shadow-2xl hover:shadow-[#CE805C]/50 transition-all duration-300 transform hover:scale-110 z-40 animate-fade-in-delay"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} weight="bold" />
        </button>
      )}
    </div>
  );
}

export default App;
