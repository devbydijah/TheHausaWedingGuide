import React, { useState, useEffect } from "react";
// --- CORRECTED ICON IMPORTS ---
import {
  ListIcon,
  X,
  ArrowUpIcon,
  SparkleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  EnvelopeSimpleIcon,
  InstagramLogoIcon,
  FacebookLogoIcon,
  CaretDownIcon,
  DownloadSimpleIcon,
  MonitorPlayIcon,
  PackageIcon, // Added PackageIcon for Bundle
} from "@phosphor-icons/react";
// --- END CORRECTED ICON IMPORTS ---
import "./index.css";
import LoginGate from "./components/LoginGate";
import InteractiveGuide from "./components/InteractiveGuide";
import OnboardingForm from "./components/OnboardingForm";

// --- PAYSTACK LINKS (Updated Bundle Link) ---
const PDF_GUIDE_PRODUCT_URL =
  "https://paystack.com/buy/northern-wedding-guide-by-hausaroom-vzdojl"; // PDF Test Link
const WEB_APP_PRODUCT_URL =
  "https://paystack.com/buy/interactive-hausa-wedding-web-guide-btclqx"; // Web App Test Link
const BUNDLE_PRODUCT_URL =
  "https://paystack.com/buy/hausa-wedding-guide-bundle-pdf--interactive-access-scykqb"; // NEW Bundle Test Link
// --- END PAYSTACK LINKS ---

function App() {
  const [showGuide, setShowGuide] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [purchasedProductType, setPurchasedProductType] = useState(null); // 'pdf', 'webapp', 'bundle'

  // Auth states
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [accessStatus, setAccessStatus] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guideParam = params.get("guide");
    const purchasedParam = params.get("purchased");
    const emailParam = params.get("email");

    if (guideParam === "1") {
      setShowGuide(true);
      if (emailParam) {
        setUserEmail(emailParam);
      }
    } else if (purchasedParam) {
      setPurchasedProductType(purchasedParam); // 'pdf', 'webapp', 'bundle' (set by Paystack product redirect config)
      setShowPurchaseSuccess(true);
      setTimeout(() => {
        setShowPurchaseSuccess(false);
        setPurchasedProductType(null);
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 15000);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowBackToTop(scrollPosition > 500);
      const sections = [
        "hero",
        "about",
        "features",
        "pricing",
        "faq",
        "contact",
      ];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offset = 100;
          const elementTop =
            element.getBoundingClientRect().top + window.scrollY - offset;
          const elementBottom = elementTop + element.offsetHeight;
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Purchase Handlers (Using Specific Links) ---
  const handlePurchasePDF = () => {
    window.location.href = PDF_GUIDE_PRODUCT_URL;
  };

  const handlePurchaseWebApp = () => {
    window.location.href = WEB_APP_PRODUCT_URL;
  };

  const handlePurchaseBundle = () => {
    window.location.href = BUNDLE_PRODUCT_URL; // Use the direct bundle link
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleLogout = async () => {
    if (typeof supabase !== "undefined" && supabase?.auth) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error signing out:", error);
      }
    }
    setShowGuide(false);
    setShowOnboarding(false);
    setAccessStatus(null);
    setUserEmail("");
    setUser(null);
    setUserData(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleAuthenticated = (email, status) => {
    setUserEmail(email);
    setAccessStatus(status);
    if (status.user) setUser(status.user);
    if (status.userData) setUserData(status.userData);
    if (!status.isOnboarded) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = (data) => {
    setShowOnboarding(false);
    setAccessStatus((prev) => ({ ...prev, isOnboarded: true }));
    setUserData(data);
  };

  if (showGuide) {
    return (
      <LoginGate
        onAuthenticated={handleAuthenticated}
        prefilledEmail={userEmail}
      >
        {showOnboarding ? (
          <OnboardingForm
            userEmail={userEmail}
            user={user}
            onComplete={handleOnboardingComplete}
          />
        ) : (
          <InteractiveGuide
            onLogout={handleLogout}
            accessStatus={accessStatus}
            userEmail={userEmail}
            user={user}
            userData={userData}
          />
        )}
      </LoginGate>
    );
  }

  const faqs = [
    {
      question: "What's the difference between the PDF and Interactive Guide?",
      answer:
        "The PDF is a downloadable, static guide with templates you can print. The Interactive Guide is a web application with dynamic tools like budget calculators, task management, vendor tracking, and cloud sync. It offers a more engaging and automated planning experience.",
    },
    {
      question: "Is there a discount if I buy both (the Bundle)?",
      answer:
        "Yes! Purchasing the Bundle Deal gives you both the PDF Guide and access to the Interactive Web Planner at a special discounted price (₦120) compared to buying them separately (total ₦210).",
    },
    {
      question: "How long do I have access to the Interactive Guide?",
      answer:
        "You get 20 days of access from your first login. This period allows ample time to use the tools, plan your wedding, and export your personalized plan as a PDF to keep forever.",
    },
    {
      question: "Can I use the Interactive Guide on my phone?",
      answer:
        "Yes! The Interactive Guide is fully responsive and works seamlessly on desktops, tablets, and smartphones. Your progress syncs automatically across all your devices.",
    },
    {
      question: "Is the content culturally authentic?",
      answer:
        "Absolutely. Both guides are created with deep respect for Hausa and Northern Nigerian traditions, covering ceremonies, customs, and etiquette accurately.",
    },
    {
      question: "What happens after the 20-day access expires?",
      answer:
        "After 20 days, you'll no longer be able to log in to the Interactive Guide web app. However, you can export your entire personalized plan (budget, vendors, tasks) as a PDF anytime during your access period to keep forever.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F4F1]">
      <nav className="fixed top-0 left-0 right-0 z-[70] bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center py-2">
              <img
                src="/logowhite.svg"
                alt="Hausa Wedding Guide"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>
            <div className="desktop-nav-links hidden md:flex items-center space-x-6 lg:space-x-8">
              {[
                { id: "hero", label: "Home" },
                { id: "about", label: "About" },
                { id: "features", label: "Features" },
                { id: "pricing", label: "Get Your Guide" },
                { id: "faq", label: "FAQ" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${activeSection === item.id ? "text-[#740015] font-semibold bg-[#740015]/5" : "text-gray-700 hover:text-[#740015]"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-button block md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={28} weight="bold" />
              ) : (
                <ListIcon size={28} weight="bold" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`mobile-menu-panel fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-2xl z-[80] md:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="px-4 py-6 space-y-3">
          {[
            { id: "hero", label: "Home" },
            { id: "about", label: "About" },
            { id: "features", label: "Features" },
            { id: "pricing", label: "Get Your Guide" },
            { id: "faq", label: "FAQ" },
            { id: "contact", label: "Contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? "bg-[#740015]/5 text-[#740015] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handlePurchasePDF}
            className="w-full mt-4 px-6 py-3 bg-[#CE805C] hover:bg-[#B87050] text-white font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <DownloadSimpleIcon size={18} weight="bold" /> Get PDF Guide
          </button>
          <button
            onClick={handlePurchaseWebApp}
            className="w-full mt-2 px-6 py-3 bg-[#740015] hover:bg-[#531946] text-white font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MonitorPlayIcon size={18} weight="bold" /> Get Interactive Guide
          </button>
          <button
            onClick={handlePurchaseBundle}
            className="w-full mt-2 px-6 py-3 border-2 border-[#740015] text-[#740015] font-semibold rounded-lg shadow-sm hover:bg-[#740015]/5 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <PackageIcon size={18} weight="bold" /> Get Bundle Deal
          </button>
        </div>
      </div>

      <section
        id="hero"
        className="relative min-h-screen bg-gradient-to-br from-[#990200] via-[#740015] to-[#531946] overflow-hidden flex flex-col items-center justify-center pt-24 pb-12 md:pt-32 md:pb-16"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#CE805C]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D4A574]/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-[#CE805C] to-[#D4A574] text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 justify-center hover:scale-105 transition-transform duration-300">
              <SparkleIcon
                size={20}
                weight="duotone"
                className="animate-pulse"
              />
              <span>Your Complete Wedding Planning Solution</span>
            </span>
          </div>
          <h1
            id="hero-heading"
            className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up"
          >
            Plan Your Perfect{" "}
            <span className="bg-gradient-to-r from-white via-[#D4A574] to-white bg-clip-text text-transparent animate-gradient">
              Hausa Wedding
            </span>
          </h1>
          <p
            className="font-inter text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-delay"
            style={{ animationDelay: "0.2s" }}
          >
            Stress-free planning starts here! Choose our detailed{" "}
            <strong>PDF Guide</strong>, the dynamic{" "}
            <strong>Interactive Web Planner</strong>, or get the{" "}
            <strong>Best Value Bundle</strong>. All options ensure an authentic
            celebration.
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-delay"
            style={{ animationDelay: "0.4s" }}
          >
            <button
              onClick={() => scrollToSection("pricing")}
              className="group relative bg-gradient-to-r from-[#CE805C] to-[#B87050] hover:from-[#B87050] hover:to-[#740015] text-white w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-bold font-inter transition-all shadow-lg hover:shadow-[#CE805C]/50 transform hover:scale-105 duration-300 flex items-center justify-center gap-3"
            >
              <span>Choose Your Guide</span>
              <ArrowRightIcon
                size={20}
                weight="bold"
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl text-lg font-semibold font-inter transition-all hover:bg-white/20 transform hover:scale-105 duration-300"
            >
              Explore Features
            </button>
          </div>
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-20 max-w-5xl mx-auto"
            role="img"
            aria-label="Traditional Northern Nigerian wedding photography gallery"
          >
            <div
              className="group mx-auto animate-scale-in"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-[#CE805C]/40">
                <img
                  src="/assets/couple2.png"
                  alt="Traditional Northern Nigerian wedding couple celebrating"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#740015]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
            </div>
            <div
              className="group mx-auto animate-scale-in"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-[#CE805C]/40">
                <img
                  src="/assets/bride2.png"
                  alt="Northern Nigerian bride in traditional wedding attire"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#740015]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
            </div>
            <div
              className="group mx-auto animate-scale-in"
              style={{ animationDelay: "0.9s" }}
            >
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-[#CE805C]/40">
                <img
                  src="/assets/bride3.png"
                  alt="Beautiful Northern Nigerian bride portrait"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#740015]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 bg-[#F9F4F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6 animate-slide-in-left">
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] leading-tight">
                Authentic Guidance for Your Modern Wedding
              </h2>
              <p className="font-inter text-base md:text-lg text-gray-700 leading-relaxed">
                Our guides merge deep respect for Hausa & Northern Nigerian
                traditions with practical tools for today's couples. Easily
                navigate cultural customs, budgets, and timelines using either
                the comprehensive <strong>PDF Guide</strong> or the dynamic{" "}
                <strong>Interactive Planner</strong>.
              </p>
              <div className="bg-gradient-to-r from-[#740015]/5 to-[#CE805C]/5 p-6 rounded-2xl border-l-4 border-[#CE805C] shadow-lg space-y-4">
                <h4 className="font-semibold text-[#740015] text-lg">
                  What You'll Discover:
                </h4>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      weight="fill"
                      className="text-[#CE805C] mr-3 mt-1 flex-shrink-0"
                    />
                    <span>
                      In-depth explanations of traditional ceremonies (Kamu,
                      Fatiha, etc.)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      weight="fill"
                      className="text-[#CE805C] mr-3 mt-1 flex-shrink-0"
                    />
                    <span>Step-by-step planning timelines & checklists</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      weight="fill"
                      className="text-[#CE805C] mr-3 mt-1 flex-shrink-0"
                    />
                    <span>
                      Comprehensive budget breakdowns & tracking (Interactive
                      includes calculator)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      weight="fill"
                      className="text-[#CE805C] mr-3 mt-1 flex-shrink-0"
                    />
                    <span>
                      Guidance on vendor selection and management (Interactive
                      includes tracker)
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon
                      size={18}
                      weight="fill"
                      className="text-[#CE805C] mr-3 mt-1 flex-shrink-0"
                    />
                    <span>
                      Tips for blending tradition with modern preferences
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center animate-scale-in">
              <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="/assets/couple1.png"
                  alt="Hausa couple in traditional wedding attire"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] mb-4">
              Choose Your Perfect Planning Tool
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              We offer two powerful options to guide your Hausa wedding planning
              journey.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="flex flex-col bg-gradient-to-br from-[#F9F4F1] to-white rounded-2xl p-8 border-2 border-[#CE805C]/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
              <div className="flex-shrink-0 mb-6 inline-block p-4 bg-gradient-to-br from-[#CE805C]/10 to-[#B87050]/10 rounded-2xl border border-[#CE805C]/20">
                <DownloadSimpleIcon
                  size={40}
                  weight="duotone"
                  className="text-[#CE805C]"
                />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-[#740015] mb-4">
                The PDF Guide
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                A comprehensive, beautifully designed downloadable guide.
                Perfect for printing, taking notes, and offline planning.
                Includes checklists, budget templates, and detailed cultural
                explanations.
              </p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#CE805C]"
                  />{" "}
                  Instant Download
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#CE805C]"
                  />{" "}
                  Printable Checklists & Templates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#CE805C]"
                  />{" "}
                  Keep Forever
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#CE805C]"
                  />{" "}
                  Detailed Cultural Guidance
                </li>
              </ul>
              <button
                onClick={() => scrollToSection("pricing")}
                className="mt-auto w-full px-6 py-3 bg-[#CE805C] hover:bg-[#B87050] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                See PDF Pricing
              </button>
            </div>
            <div
              className="flex flex-col bg-gradient-to-br from-[#740015]/5 to-[#531946]/5 rounded-2xl p-8 border-2 border-[#740015]/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex-shrink-0 mb-6 inline-block p-4 bg-gradient-to-br from-[#740015]/10 to-[#531946]/10 rounded-2xl border border-[#740015]/20">
                <MonitorPlayIcon
                  size={40}
                  weight="duotone"
                  className="text-[#740015]"
                />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-[#740015] mb-4">
                The Interactive Guide
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                A dynamic web application for a modern planning experience.
                Includes everything in the PDF, plus interactive tools: vision
                quiz, smart budget calculator, vendor tracker, task manager,
                cloud sync, and personalized PDF export.
              </p>
              <ul className="space-y-3 text-sm text-gray-700 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#740015]"
                  />{" "}
                  All PDF Content Included
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#740015]"
                  />{" "}
                  Dynamic Budget Tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#740015]"
                  />{" "}
                  Vendor & Task Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#740015]"
                  />{" "}
                  Cloud Sync & Auto-Save
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#740015]"
                  />{" "}
                  Personalized PDF Export
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={18}
                    weight="fill"
                    className="text-[#740015]"
                  />{" "}
                  20-Day Access
                </li>
              </ul>
              <button
                onClick={() => scrollToSection("pricing")}
                className="mt-auto w-full px-6 py-3 bg-[#740015] hover:bg-[#531946] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                See Interactive Pricing
              </button>
            </div>
          </div>
          <p className="text-center text-gray-600 mt-12 text-base md:text-lg animate-fade-in">
            <strong>Save more!</strong> Get both the PDF and Interactive Guide
            in our{" "}
            <a
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pricing");
              }}
              className="text-[#740015] font-semibold hover:underline"
            >
              Best Value Bundle
            </a>
            .
          </p>
        </div>
      </section>

      <section id="pricing" className="py-16 md:py-24 bg-[#F9F4F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] mb-4">
              Choose Your Perfect Guide
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Select your planning tool or get the bundle for the best value!
              (Test prices shown).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
            {/* PDF Guide Pricing */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#CE805C]/50 shadow-lg text-center flex flex-col items-center animate-slide-up">
              <DownloadSimpleIcon
                size={40}
                weight="duotone"
                className="text-[#CE805C] mb-4"
              />
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#740015] mb-2">
                PDF Guide
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Comprehensive & Printable
              </p>
              <p className="font-playfair text-4xl md:text-5xl font-bold text-[#740015] mb-2">
                ₦110
              </p>
              <p className="text-gray-500 text-xs md:text-sm mb-6">
                One-time payment
              </p>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700 text-left mb-6 list-none pl-0 flex-grow">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#CE805C] flex-shrink-0"
                  />{" "}
                  Instant PDF Download
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#CE805C] flex-shrink-0"
                  />{" "}
                  Printable Checklists
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#CE805C] flex-shrink-0"
                  />{" "}
                  Detailed Cultural Guide
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#CE805C] flex-shrink-0"
                  />{" "}
                  Keep Forever
                </li>
              </ul>
              <button
                onClick={handlePurchasePDF}
                className="w-full mt-auto px-6 py-2.5 bg-[#CE805C] hover:bg-[#B87050] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
              >
                Buy PDF (Test)
              </button>
            </div>

            {/* Bundle Pricing Card */}
            <div
              className="bg-gradient-to-br from-[#740015] to-[#531946] rounded-2xl p-6 md:p-8 border-4 border-[#D4A574] shadow-2xl text-center flex flex-col items-center transform md:scale-105 z-10 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#D4A574] text-[#740015] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                Discounted
              </div>
              <PackageIcon
                size={40}
                weight="duotone"
                className="text-[#D4A574] mb-4 mt-5"
              />
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                Bundle Deal
              </h3>
              <p className="text-white/80 text-sm mb-6">
                PDF Guide + Interactive Access
              </p>
              <p className="font-playfair text-4xl md:text-5xl font-bold text-[#D4A574] mb-2">
                ₦120
              </p>
              <p className="text-white/70 text-xs md:text-sm mb-6">
                One-time payment
              </p>
              <ul className="space-y-2 text-xs md:text-sm text-white/90 text-left mb-6 list-none pl-0 flex-grow">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#D4A574] flex-shrink-0"
                  />{" "}
                  <strong>All PDF Guide Features</strong>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#D4A574] flex-shrink-0"
                  />{" "}
                  <strong>+ All Interactive Features</strong>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#D4A574] flex-shrink-0"
                  />{" "}
                  Instant PDF Download
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#D4A574] flex-shrink-0"
                  />{" "}
                  20-Day Interactive Access
                </li>
              </ul>
              <button
                onClick={handlePurchaseBundle}
                className="w-full mt-auto px-6 py-2.5 bg-[#D4A574] hover:bg-[#CE805C] text-[#740015] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
              >
                Buy Bundle (Test)
              </button>
            </div>

            {/* Interactive Guide Pricing */}
            <div
              className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#740015]/30 shadow-lg text-center flex flex-col items-center animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <MonitorPlayIcon
                size={40}
                weight="duotone"
                className="text-[#740015] mb-4"
              />
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#740015] mb-2">
                Interactive Guide
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Dynamic & Cloud-Synced
              </p>
              <p className="font-playfair text-4xl md:text-5xl font-bold text-[#740015] mb-2">
                ₦100
              </p>
              <p className="text-gray-500 text-xs md:text-sm mb-6">
                One-time payment
              </p>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700 text-left mb-6 list-none pl-0 flex-grow">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#740015] flex-shrink-0"
                  />{" "}
                  Includes All PDF Content
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#740015] flex-shrink-0"
                  />{" "}
                  Dynamic Budget & Tasks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#740015] flex-shrink-0"
                  />{" "}
                  Vendor Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#740015] flex-shrink-0"
                  />{" "}
                  Cloud Sync & Auto-Save
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#740015] flex-shrink-0"
                  />{" "}
                  Personalized PDF Export
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon
                    size={16}
                    weight="fill"
                    className="text-[#740015] flex-shrink-0"
                  />{" "}
                  20-Day Access
                </li>
              </ul>
              <button
                onClick={handlePurchaseWebApp}
                className="w-full mt-auto px-6 py-2.5 bg-[#740015] hover:bg-[#531946] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
              >
                Buy Interactive (Test)
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              Find answers to common questions about our wedding guides.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#F9F4F1] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-[#F0E6DD]/50 transition-colors"
                  aria-expanded={openFAQ === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-semibold text-[#740015] pr-4 flex-1">
                    {faq.question}
                  </span>
                  <CaretDownIcon
                    size={20}
                    weight="bold"
                    className={`text-[#CE805C] flex-shrink-0 transition-transform duration-300 ${openFAQ === index ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className="bg-gradient-to-br from-[#990200] via-[#740015] to-[#531946] text-white py-12 md:py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-center">
            <div className="text-center md:text-left space-y-3">
              <img
                src="/logowhite.svg"
                alt="Hausa Wedding Guide Logo"
                className="h-16 md:h-20 mb-4 mx-auto md:mx-0"
              />
              <h3 className="font-playfair text-xl md:text-2xl font-bold bg-gradient-to-r from-[#D4A574] to-white bg-clip-text text-transparent">
                Hausa Room
              </h3>
              <p className="font-inter text-white/70 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                Your trusted companion for authentic Northern Nigerian wedding
                planning.
              </p>
            </div>
            <nav className="text-center md:text-left">
              <h4 className="font-playfair text-lg font-semibold mb-4 text-white uppercase tracking-wider">
                Quick Links
              </h4>
              <ul className="space-y-2 font-inter text-sm">
                <li>
                  <a
                    href="#hero"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("hero");
                    }}
                    className="text-white/80 hover:text-[#D4A574] transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("features");
                    }}
                    className="text-white/80 hover:text-[#D4A574] transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("pricing");
                    }}
                    className="text-white/80 hover:text-[#D4A574] transition-colors"
                  >
                    Get Guide
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("faq");
                    }}
                    className="text-white/80 hover:text-[#D4A574] transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </nav>
            <div className="text-center md:text-right">
              <h4 className="font-playfair text-lg font-semibold mb-4 text-white uppercase tracking-wider">
                Get in Touch
              </h4>
              <div className="space-y-3">
                <a
                  href="mailto:support@hausaroom.com"
                  className="group flex items-center justify-center md:justify-end text-white/80 hover:text-[#D4A574] transition-colors duration-200"
                >
                  <EnvelopeSimpleIcon
                    size={20}
                    weight="bold"
                    className="mr-2 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-sm font-medium">
                    support@hausaroom.com
                  </span>
                </a>
                <div className="flex items-center justify-center md:justify-end gap-4 mt-4">
                  <a
                    href="https://www.instagram.com/hausaroom/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-[#D4A574] transition-all duration-300 transform hover:scale-125"
                    aria-label="Follow us on Instagram"
                  >
                    <InstagramLogoIcon
                      size={24}
                      weight="fill"
                      className="drop-shadow-lg"
                    />
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=100070178342524"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-[#D4A574] transition-all duration-300 transform hover:scale-125"
                    aria-label="Follow us on Facebook"
                  >
                    <FacebookLogoIcon
                      size={24}
                      weight="fill"
                      className="drop-shadow-lg"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>
          <div className="text-center">
            <p className="font-inter text-white/60 text-xs">
              © {new Date().getFullYear()} Hausa Room. All rights reserved.
              Made with ❤️ for Hausa traditions.
            </p>
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#CE805C] hover:bg-[#740015] text-white p-3 md:p-4 rounded-full shadow-2xl hover:shadow-[#CE805C]/50 transition-all duration-300 transform hover:scale-110 z-40 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon size={20} weight="bold" />
        </button>
      )}

      {showPurchaseSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-[#990200] to-[#531946] p-6 text-white text-center relative">
              <button
                onClick={() => {
                  setShowPurchaseSuccess(false);
                  setPurchasedProductType(null);
                  window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                  );
                }}
                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={20} weight="bold" />
              </button>
              <div className="flex justify-center mb-3">
                <div className="bg-white/20 rounded-full p-3">
                  <CheckCircleIcon
                    size={40}
                    weight="fill"
                    className="text-white"
                  />
                </div>
              </div>
              <h2 className="font-playfair text-2xl font-bold">
                Payment Successful!
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-base font-inter text-center">
                Thank you! We've sent instructions for your
                <strong>
                  {purchasedProductType === "pdf" ? " PDF Guide download" : ""}
                  {purchasedProductType === "webapp"
                    ? " Interactive Guide access"
                    : ""}
                  {purchasedProductType === "bundle"
                    ? " Bundle (PDF + Interactive Guide)"
                    : ""}
                  {!purchasedProductType && " items"}
                </strong>{" "}
                to your email.
              </p>
              <div className="bg-[#CE805C]/10 border-l-4 border-[#CE805C] rounded-r-lg p-4">
                <h3 className="font-semibold text-[#740015] text-base mb-2 flex items-center gap-2">
                  <EnvelopeSimpleIcon size={18} weight="bold" /> Check Your
                  Email
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Please check your inbox (and spam folder!) for an email from
                  Hausa Room containing your access details.
                  {purchasedProductType === "bundle" &&
                    " You should receive two separate emails, one for your PDF and one for your planner access."}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 text-base mb-2">
                  Next Steps:
                </h3>
                <ol className="space-y-1 text-sm text-gray-600 list-decimal list-inside">
                  <li>Find the email(s) from Hausa Room.</li>
                  <li>
                    Follow the instructions for your PDF download and/or
                    interactive planner access.
                  </li>
                  <li>Start planning!</li>
                </ol>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Need help?{" "}
                <a
                  href="mailto:support@hausaroom.com"
                  className="text-[#990200] hover:underline font-medium"
                >
                  Contact Support
                </a>
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 text-right border-t">
              <button
                onClick={() => {
                  setShowPurchaseSuccess(false);
                  setPurchasedProductType(null);
                  window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                  );
                }}
                className="bg-[#CE805C] hover:bg-[#740015] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105"
              >
                Okay, Got It!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
