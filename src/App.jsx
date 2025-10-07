import { useState, useEffect, useRef } from "react";
import InteractiveGuide from "./components/InteractiveGuide";
import LoginGate from "./components/LoginGate";

// Paystack Storefront URLs
const USE_TEST_STOREFRONT = window.location.search.includes("test=1");
const STOREFRONT_URL = USE_TEST_STOREFRONT
  ? "https://paystack.shop/hausaroom-wedding-guide-GLQSt?test=1"
  : "https://paystack.shop/hausaroom-wedding-guide-GLQSt";

function App() {
  // State management
  const [showNav, setShowNav] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [openFaq, setOpenFaq] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [auth, setAuth] = useState(null);

  // Download token state
  const [downloadStatus, setDownloadStatus] = useState(null); // 'valid', 'expired', 'downloading', null
  const [timeLeft, setTimeLeft] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [expires, setExpires] = useState(null);

  // Claim by email state
  const [claimMode, setClaimMode] = useState(false);
  const [claimEmail, setClaimEmail] = useState("");
  const [claimMsg, setClaimMsg] = useState("");
  const [claimBusy, setClaimBusy] = useState(false);
  const claimInputRef = useRef(null);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract URL parameters for download token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const downloadToken = params.get("download");
    const expiresParam = params.get("expires");
    const emailParam = params.get("email");
    const guideParam = params.get("guide");

    // If guide parameter is present, show interactive guide
    if (guideParam === "1") {
      setShowGuide(true);
      // Check if auth parameters are present
      if (emailParam && downloadToken) {
        setAuth(emailParam);
      }
      return;
    }

    if (downloadToken && expiresParam && emailParam) {
      setToken(downloadToken);
      setEmail(emailParam);
      const expiresTime = parseInt(expiresParam, 10);
      setExpires(expiresTime);

      // Validate token expiration
      const now = Date.now();
      if (expiresTime > now) {
        setDownloadStatus("valid");
      } else {
        setDownloadStatus("expired");
      }
    }
  }, []);

  // Countdown timer for download link expiration
  useEffect(() => {
    if (downloadStatus !== "valid" || !expires) return;

    const updateCountdown = () => {
      const now = Date.now();
      const diff = expires - now;

      if (diff <= 0) {
        setDownloadStatus("expired");
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours}h ${minutes}m ${seconds}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [downloadStatus, expires]);

  // Handle download button click
  const handleDownload = async () => {
    setDownloadStatus("downloading");

    try {
      // Extract signature from URL for security
      const params = new URLSearchParams(window.location.search);
      const sig = params.get("sig") || "";
      
      // Call the download API endpoint with token validation and signature
      const response = await fetch(
        `/api/download?token=${encodeURIComponent(
          token
        )}&email=${encodeURIComponent(email)}&expires=${expires}&sig=${encodeURIComponent(sig)}`
      );

      if (response.ok) {
        // Trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Hausa_Wedding_Guide.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setDownloadStatus("valid");
      } else {
        const errorData = await response.json();
        if (response.status === 429) {
          alert("Too many download attempts. Please wait a moment and try again.");
        } else {
          alert(errorData.error || "Download failed. Please try again.");
        }
        setDownloadStatus("valid");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed. Please try again.");
      setDownloadStatus("valid");
    }
  };

  // Handle claim by email
  const handleClaim = async (e) => {
    e.preventDefault();
    setClaimBusy(true);
    setClaimMsg("");

    try {
      const response = await fetch("/api/claim-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: claimEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setClaimMsg(
          data.message ||
            "Download link sent! Check your email (including spam folder)."
        );
        setClaimEmail("");
      } else {
        setClaimMsg(
          data.error ||
            "No recent payment found. Please check your email or contact support."
        );
      }
    } catch (error) {
      console.error("Claim error:", error);
      setClaimMsg("Something went wrong. Please try again.");
    } finally {
      setClaimBusy(false);
    }
  };

  // Handle image load tracking
  const handleImageLoad = (src) => {
    setImagesLoaded((prev) => ({ ...prev, [src]: true }));
  };

  // Simulated loading progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 second loading simulation

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  // Navigation scroll handling with throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setShowNav(scrollY > 300);

          // Update active section based on scroll position
          const sections = ["hero", "about", "features", "preview", "faq"];

          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (
                scrollY >= offsetTop - 100 &&
                scrollY < offsetTop + offsetHeight - 100
              ) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBuyNow = () => {
    // Redirect to Paystack storefront (test URL when ?test=1)
    window.open(STOREFRONT_URL, "_blank");
  };

  const faqs = [
    {
      question: "Is this guide culturally authentic and respectful?",
      answer:
        "Absolutely! The guide is created with deep respect for Hausa traditions and customs. It includes traditional ceremonies, cultural significance explanations, and guidance that honors authentic northern Nigerian wedding practices.",
    },
    {
      question: "What budget planning tools are included?",
      answer:
        "The guide includes comprehensive budget breakdown tables, expense tracking sheets, planning checklists, and practical money-saving strategies to help you manage your wedding finances effectively.",
    },
    {
      question: "What budget range does this realistically cover?",
      answer:
        "The guide covers various budget ranges with detailed breakdowns. The planning principles, budgeting strategies, and cultural guidance work for both modest and elaborate wedding celebrations.",
    },
    {
      question: "How quickly can I start using this guide?",
      answer:
        "Immediately! It's a downloadable PDF with planning tools, checklists, and templates. Most couples find it saves months of research time and helps avoid common planning mistakes from day one.",
    },
    {
      question: "What if I'm planning from outside Northern Nigeria?",
      answer:
        "The guide's cultural guidance, ceremony explanations, budgeting principles, and planning timelines apply anywhere you're planning a Hausa wedding. The traditions and customs are universal to Hausa culture.",
    },
    {
      question: "Does this work for different religious backgrounds?",
      answer:
        "Yes! While the guide includes traditional Hausa customs, it's designed to be adaptable for different religious preferences and family traditions. The cultural and planning elements are universally applicable.",
    },
  ];

  // Show interactive guide if guide=1 parameter is present
  if (showGuide) {
    if (!auth) {
      return (
        <LoginGate
          onAuthenticated={(userEmail) => {
            setAuth(userEmail);
          }}
        />
      );
    }
    return <InteractiveGuide auth={auth} />;
  }

  return (
    <div className="min-h-screen bg-[#F9F4F1]">
      {/* Floating Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              <img
                src="/logowhite.svg"
                alt="Hausa Wedding Guide"
                className="h-8"
              />

              {/* Desktop Navigation Items */}
              <div className="hidden md:flex items-center space-x-6">
                {[
                  { id: "about", label: "About" },
                  { id: "features", label: "Features" },
                  { id: "preview", label: "Preview" },
                  { id: "faq", label: "FAQ" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-lg min-h-[44px] min-w-[44px] ${
                      activeSection === item.id
                        ? "text-[#740015] font-semibold bg-[#740015]/5"
                        : "text-gray-700 hover:text-[#740015]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-[#740015] min-h-[44px] min-w-[44px]"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Desktop Buy Guide Button */}
              <button
                onClick={handleBuyNow}
                className="hidden md:block px-6 py-2.5 bg-[#CE805C] hover:bg-[#B87050] text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 min-h-[44px]"
              >
                Buy Guide
              </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-100 py-4">
                <div className="flex flex-col space-y-2">
                  {[
                    { id: "about", label: "About" },
                    { id: "features", label: "Features" },
                    { id: "preview", label: "Preview" },
                    { id: "faq", label: "FAQ" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-4 py-3 rounded-lg transition-colors min-h-[44px] ${
                        activeSection === item.id
                          ? "text-[#740015] font-semibold bg-[#740015]/5"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      handleBuyNow();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 bg-[#CE805C] hover:bg-[#B87050] text-white font-semibold rounded-lg shadow-md transition-all duration-300 min-h-[44px]"
                  >
                    Buy Guide
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-[#8B0000] via-[#740015] to-[#531946] overflow-hidden">
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">
            {/* Left side - Text content */}
            <div className="text-left space-y-4 sm:space-y-6 order-2 md:order-1">
              <div className="inline-flex items-center px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs md:text-sm font-medium">
                <span className="w-2 h-2 bg-[#CE805C] rounded-full mr-2 animate-pulse"></span>
                Welcome to the Wedding Guide
              </div>

              {USE_TEST_STOREFRONT && (
                <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-400/40 text-yellow-200 rounded-lg text-sm">
                  Test mode: Buy button opens Paystack TEST storefront.
                </div>
              )}

              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Your Complete
                <br />
                <span className="text-[#D4A574]">Hausa Wedding</span>
                <br />
                <span className="text-[#D4A574]">Guide</span>
              </h1>

              <p className="font-inter text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-lg">
                Welcome! Your comprehensive guide with{" "}
                <strong className="text-white">budget planning tools</strong>, traditional ceremony
                guidance, and authentic cultural customs is ready for you.
              </p>

              {/* Conditional UI based on download status */}
              {downloadStatus === "valid" ? (
                // Download Interface
                <div className="flex flex-col gap-4 mt-6">
                  <div className="bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Purchase Complete!
                    </h3>
                    <p className="text-white/90 text-sm mb-3">
                      Thank you for your purchase! Your Hausa Wedding Guide is ready for download.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-white/80">Sent to: {email}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-white/80">Expires in {timeLeft}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    disabled={downloadStatus === "downloading"}
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-[#CE805C] hover:bg-[#B87050] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {downloadStatus === "downloading" ? "Downloading..." : "Download Your Guide Now"}
                  </button>
                  <p className="text-white/70 text-xs text-center">
                    PDF file • ~3 MB • Please save a copy after download
                  </p>
                </div>
              ) : downloadStatus === "expired" ? (
                // Expired Token
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-xl p-4 mt-6">
                  <h3 className="text-white font-semibold mb-2">⚠️ Download Link Expired</h3>
                  <p className="text-white/90 text-sm mb-2">
                    Your download link has expired. For security, links are valid for 24 hours.
                  </p>
                  <p className="text-white/70 text-xs">
                    Click "Already Purchased?" below to get a fresh link using the same email from checkout.
                  </p>
                </div>
              ) : null}

              {/* Claim by email interface */}
              {claimMode && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-3 border border-white/10">
                  <p className="text-white/90 text-sm font-semibold">
                    Already paid? Get your download by email
                  </p>
                  <form onSubmit={handleClaim} className="flex gap-2">
                    <input
                      type="email"
                      value={claimEmail}
                      onChange={(e) => setClaimEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="flex-1 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400"
                      ref={claimInputRef}
                      required
                    />
                    <button
                      type="submit"
                      disabled={claimBusy}
                      className="px-4 py-2 bg-[#CE805C] hover:bg-[#B87050] text-white rounded-lg disabled:opacity-60 text-sm font-medium transition-colors"
                    >
                      {claimBusy ? "Sending..." : "Send link"}
                    </button>
                  </form>
                  {claimMsg && (
                    <p className="text-white/90 text-sm">{claimMsg}</p>
                  )}
                  <p className="text-white/70 text-xs">
                    Use the <strong>same email</strong> from checkout. We'll match it to a recent payment.
                  </p>
                </div>
              )}

              {/* Purchase buttons */}
              {!downloadStatus && (
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                  <button
                    onClick={handleBuyNow}
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[#CE805C] hover:bg-[#B87050] text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px]"
                  >
                    Buy Your Guide Now
                  </button>
                  <button
                    onClick={() => setClaimMode(!claimMode)}
                    className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border-2 border-white/60 text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-white hover:text-[#740015] transition-all duration-300 min-h-[44px]"
                  >
                    {claimMode ? "Hide" : "Already Purchased?"}
                  </button>
                </div>
              )}

              {/* Stats cards */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mt-4 sm:mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4A574]">Complete</div>
                  <div className="text-xs md:text-sm text-white/80">Planning Guide</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/20">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4A574]">Cultural</div>
                  <div className="text-xs md:text-sm text-white/80">Traditions</div>
                </div>
              </div>

              {/* Dev link */}
              {import.meta.env.DEV && (
                <a
                  href="/?guide=1&email=test@example.com&token=sample123"
                  className="inline-flex items-center rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white hover:bg-white/5 mt-4"
                >
                  Open Interactive Guide (dev)
                </a>
              )}
            </div>

            {/* Right side - Phone mockup with bride image */}
            <div className="flex justify-center md:justify-end order-1 md:order-2">
              <div className="relative group">
                {/* Phone mockup */}
                <div className="relative w-[220px] sm:w-[260px] md:w-[300px] lg:w-[360px]">
                  <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] sm:border-[10px] border-gray-800 bg-gray-900">
                    <div className="relative aspect-[9/16] overflow-hidden">
                      {!imagesLoaded["/assets/bride1.png"] && (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 animate-pulse"></div>
                      )}
                      <img
                        src="/assets/bride1.png"
                        alt="Beautiful Hausa Bride"
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                          imagesLoaded["/assets/bride1.png"] ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => handleImageLoad("/assets/bride1.png")}
                        loading="eager"
                      />
                    </div>
                    {/* Phone notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-28 md:w-32 h-5 sm:h-6 bg-gray-900 rounded-b-2xl z-10"></div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 opacity-70">
                  <img src="/assets/purpleoutline.png" alt="" className="w-full h-full" />
                </div>
                <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 opacity-50">
                  <img src="/assets/greenoutline.png" alt="" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 md:py-24 bg-[#F9F4F1]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] leading-tight">
                Your Complete Wedding Planning Resource
              </h2>
              <p className="font-inter text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                Created with deep respect for Hausa traditions and modern planning needs. This comprehensive guide helps you navigate cultural customs, budget planning, and timeline management for your special day.
              </p>

              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-[#740015] text-base sm:text-lg">What You'll Discover:</h4>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-[#CE805C] rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                    <span>Traditional ceremony steps and cultural significance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-[#CE805C] rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                    <span>Comprehensive budget breakdowns and expense tracking</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-[#CE805C] rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                    <span>Step-by-step planning timelines for organized execution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-[#CE805C] rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                    <span>Essential wedding planning guidance and practical tips</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#740015]">Comprehensive</div>
                  <div className="text-xs sm:text-sm text-gray-600">Guidance</div>
                </div>
                <div className="w-px h-10 sm:h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#740015]">Authentic</div>
                  <div className="text-xs sm:text-sm text-gray-600">Traditions</div>
                </div>
                <div className="w-px h-10 sm:h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#740015]">Practical</div>
                  <div className="text-xs sm:text-sm text-gray-600">Tools</div>
                </div>
              </div>
            </div>

            {/* Circular bride image */}
            <div className="flex justify-center">
              <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden shadow-2xl border-6 sm:border-8 border-white">
                {!imagesLoaded["/assets/bride2.png"] && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse"></div>
                )}
                <img
                  src="/assets/bride2.png"
                  alt="Hausa bride with traditional gele"
                  className={`w-full h-full object-cover transition-opacity duration-700 ${
                    imagesLoaded["/assets/bride2.png"] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad("/assets/bride2.png")}
                  loading="lazy"
                  width="400"
                  height="400"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] mb-3 sm:mb-4">
              What Makes This Guide Special
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Everything you need to plan an authentic Hausa wedding with confidence and cultural respect.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F9F4F1] rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#740015] rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6" role="img" aria-label="Book icon">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#740015] mb-2 sm:mb-3">Traditional Ceremonies & Customs</h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Complete guide to traditional Hausa wedding ceremonies including Kunshi, Kamu, Sa-Lalle, Fatihah, and more. Learn the cultural customs and meanings to help you honor traditions respectfully.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F9F4F1] rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#740015] rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6" role="img" aria-label="Clipboard icon">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#740015] mb-2 sm:mb-3">Timeline Planning & Management</h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Comprehensive budget timelines and planning checklists to keep you organized. Includes money-saving strategies for effective wedding planning at any budget level.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F9F4F1] rounded-2xl p-6 sm:p-8 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#740015] rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6" role="img" aria-label="Money icon">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#740015] mb-2 sm:mb-3">Wedding Planning & Budgeting</h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Comprehensive budget breakdown tables with detailed guidance and practical tips for organizing your authentic Hausa wedding within your preferred budget range.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Preview Section */}
      <section id="preview" className="py-12 sm:py-16 md:py-24 bg-[#F9F4F1]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] mb-3 sm:mb-4">
              Inside the Guide
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Preview some of the beautifully designed pages that await you in the complete guide. Click on any page to view details.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {[
              { src: "/assets/samplepage1.png", label: "Get Your Copy" },
              { src: "/assets/samplepage2.png", label: "Timeline" },
              { src: "/assets/samplepage3.png", label: "Wedding Expenses" },
              { src: "/assets/samplepage4.png", label: "Planning Timeline" },
              { src: "/assets/samplepage5.png", label: "Head Wrap" },
            ].map((page, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {!imagesLoaded[page.src] && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse"></div>
                    )}
                    <img
                      src={page.src}
                      alt={`${page.label} preview page from Hausa Wedding Guide`}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        imagesLoaded[page.src] ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(page.src)}
                      loading="lazy"
                      width="300"
                      height="400"
                    />
                  </div>
                  <div className="p-3 text-center bg-[#740015]">
                    <p className="text-white text-xs font-semibold">{page.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleBuyNow}
              className="inline-flex items-center px-8 py-3.5 bg-[#CE805C] hover:bg-[#B87050] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Your Complete Guide Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Everything you need to know about the Hausa Wedding Guide.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#F9F4F1] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-[#F0E6DD] transition-colors min-h-[44px]"
                >
                  <span className="font-semibold text-[#740015] pr-3 sm:pr-4 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#740015] flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#8B0000] via-[#740015] to-[#531946]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Ready to Start Planning Your Perfect Wedding?
          </h2>
          <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Get instant access to your guide now. Includes budget templates, cultural customs, and planning timelines for your unforgettable celebration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 border border-white/20">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4A574]">Instant</div>
              <div className="text-xs md:text-sm text-white/80">Download</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 border border-white/20">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4A574]">Complete</div>
              <div className="text-xs md:text-sm text-white/80">Planning Tools</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 border border-white/20">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#D4A574]">Authentic</div>
              <div className="text-xs md:text-sm text-white/80">Cultural Guide</div>
            </div>
          </div>

          <button
            onClick={handleBuyNow}
            className="inline-flex items-center px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-[#CE805C] hover:bg-[#B87050] text-white text-base sm:text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-h-[44px]"
          >
            Get Your Complete Guide Now
          </button>

          <p className="text-white/70 text-xs sm:text-sm mt-4 sm:mt-6">
            Instant digital download • PDF format • Access on any device
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <img
              src="/logowhite.svg"
              alt="Hausa Wedding Guide"
              className="h-10 mx-auto mb-6"
            />
            <p className="text-gray-400 text-sm">
              Preserving traditions, celebrating love. Your trusted companion for an authentic Hausa wedding.
            </p>
            <div className="pt-6 border-t border-gray-700">
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} The Hausa Wedding Guide. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
