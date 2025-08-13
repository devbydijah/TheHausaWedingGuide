import React, { useState, useEffect } from "react";

function App() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [showNav, setShowNav] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const openImageModal = (imageSrc, altText) => {
    setSelectedImage({ src: imageSrc, alt: altText });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleImageLoad = (imageSrc) => {
    setImagesLoaded((prev) => ({ ...prev, [imageSrc]: true }));
  };

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
        "The guide focuses on various budget ranges with detailed breakdowns. The planning principles, budgeting strategies, and cultural guidance work for both modest and elaborate wedding celebrations.",
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

  return (
    <div className="min-h-screen">
      {/* Floating Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-4 relative">
              <img
                src="/logowhite.svg"
                alt="Hausa Wedding Guide"
                className="h-8 sm:h-10 md:h-12 absolute left-0"
              />

              {/* Navigation Items - Centered on all screen sizes */}
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6">
                {[
                  { id: "about", label: "About" },
                  { id: "features", label: "Features" },
                  { id: "preview", label: "Preview" },
                  { id: "faq", label: "FAQ" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-xs sm:text-sm font-inter font-medium transition-all duration-200 px-1 sm:px-2 md:px-3 py-2 rounded-lg hover:bg-gray-50 min-h-[44px] flex items-center ${
                      activeSection === item.id
                        ? "text-[#CE805C] font-semibold bg-orange-50"
                        : "text-[#1E1E1E] hover:text-[#CE805C]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                {/* Access Guide Button */}
                <a
                  href="/Hausa_Wedding_Guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 sm:px-3 md:px-6 py-2 md:py-3 bg-[#CE805C] hover:bg-[#740015] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 absolute right-0 min-h-[44px]"
                >
                  <span className="hidden sm:inline">Access Guide</span>
                  <span className="sm:hidden">Access</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen bg-gradient-to-b from-[#990200] to-[#531946] overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/brownoutline.png"
            alt=""
            className="absolute top-20 left-10 w-32 h-32"
          />
          <img
            src="/assets/deepbrowncircle.png"
            alt=""
            className="absolute bottom-20 right-10 w-40 h-40"
          />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-20 items-center min-h-screen">
            {/* Left side - Text content */}
            <div className="text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  <span className="w-2 h-2 bg-[#CE805C] rounded-full mr-2 animate-pulse"></span>
                  Welcome to Your Wedding Guide
                </div>
                <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Your Complete
                  <br />
                  <span className="text-[#CE805C]">Hausa Wedding Guide</span>
                </h1>
                <p className="font-inter text-lg md:text-xl text-white/90 leading-relaxed max-w-lg">
                  Welcome! Your comprehensive guide with{" "}
                  <strong>budget planning tools</strong>, traditional ceremony
                  guidance, and authentic cultural customs is ready for you.
                </p>

                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#CE805C]">
                      Complete
                    </div>
                    <div className="text-sm text-white/80">Planning Guide</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#CE805C]">
                      Cultural
                    </div>
                    <div className="text-sm text-white/80">Traditions</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="/Hausa_Wedding_Guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#CE805C] hover:bg-[#740015] text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <svg
                    className="w-5 h-5 mr-2 group-hover:animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Access Your Guide
                </a>
                <button
                  onClick={() => scrollToSection("about")}
                  className="inline-flex items-center justify-center px-6 py-4 border-2 border-white/80 text-white font-semibold rounded-2xl hover:bg-white hover:text-[#990200] transition-all duration-300 backdrop-blur-sm"
                >
                  Explore Contents
                </button>
              </div>
            </div>

            {/* Right side - Hero image */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-72 h-[24rem] sm:w-80 sm:h-[28rem] md:w-96 md:h-[32rem] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 group-hover:shadow-3xl transition-all duration-500">
                  {!imagesLoaded["/assets/bride1.png"] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 animate-pulse"></div>
                  )}
                  <img
                    src="/assets/bride1.png"
                    alt="Beautiful Hausa Bride in traditional wedding attire"
                    className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 ${
                      imagesLoaded["/assets/bride1.png"]
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad("/assets/bride1.png")}
                    loading="eager"
                  />
                </div>

                {/* Decorative elements with enhanced animations */}
                <div className="absolute -top-6 -right-6 w-16 h-16 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                  <img
                    src="/assets/purpleoutline.png"
                    alt="Decorative element"
                    className="w-full h-full animate-pulse"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 opacity-50 group-hover:opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                  <img
                    src="/assets/greenoutline.png"
                    alt="Decorative element"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Guide Section */}
      <section id="about" className="py-16 sm:py-24 md:py-32 bg-[#F9F4F1]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] leading-tight">
                  Your Complete Wedding Planning Resource
                </h2>
                <p className="font-inter text-lg md:text-xl text-[#1E1E1E] leading-relaxed">
                  Created with deep respect for Hausa traditions and modern
                  planning needs. This comprehensive guide helps you navigate
                  cultural customs, budget planning, and timeline management for
                  your special day.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl border-l-4 border-[#CE805C] shadow-lg">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#740015]">
                      What You'll Discover:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#CE805C] rounded-full mr-3"></span>
                        Traditional ceremony steps and cultural significance
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#CE805C] rounded-full mr-3"></span>
                        Budget breakdown tables and expense tracking
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#CE805C] rounded-full mr-3"></span>
                        Step-by-step planning timeline and checklists
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border-l-4 border-[#CE805C] shadow-lg">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-[#740015]">
                      Perfect For:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#CE805C] rounded-full mr-3"></span>
                        Couples planning their first Hausa wedding
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#CE805C] rounded-full mr-3"></span>
                        Families wanting to honor cultural traditions
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-[#CE805C] rounded-full mr-3"></span>
                        Anyone seeking authentic planning guidance
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#F9F4F1] p-6 rounded-xl">
                <div className="text-center">
                  <p className="text-lg font-semibold text-[#740015] mb-2">
                    Comprehensive • Authentic • Practical
                  </p>
                  <p className="text-sm text-gray-600">
                    Everything you need to plan with confidence and cultural
                    respect
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative group">
                <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  {!imagesLoaded["/assets/couple1.png"] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 animate-pulse"></div>
                  )}
                  <img
                    src="/assets/couple1.png"
                    alt="Happy Hausa wedding couple in traditional ceremony attire"
                    className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-110 ${
                      imagesLoaded["/assets/couple1.png"]
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad("/assets/couple1.png")}
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125">
                  <img
                    src="/assets/brownoutline.png"
                    alt="Decorative element"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="space-y-6">
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] leading-tight">
                What Makes This Guide Special
              </h2>
              <p className="font-inter text-lg md:text-xl text-[#1E1E1E] max-w-3xl mx-auto leading-relaxed">
                Everything you need to plan an authentic Hausa wedding with
                confidence and cultural respect.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#CE805C]/20 group transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#CE805C] to-[#740015] rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="space-y-4">
                <h3 className="font-playfair text-xl md:text-2xl font-semibold text-[#740015] leading-tight">
                  Traditional Ceremonies & Customs
                </h3>
                <p className="font-inter text-[#1E1E1E] leading-relaxed text-lg">
                  Complete guide to traditional Hausa wedding ceremonies,
                  cultural customs, and meaningful rituals with step-by-step
                  explanations and significance.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#CE805C]/20 group transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#CE805C] to-[#740015] rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="space-y-4">
                <h3 className="font-playfair text-xl md:text-2xl font-semibold text-[#740015] leading-tight">
                  Budget Planning & Management
                </h3>
                <p className="font-inter text-[#1E1E1E] leading-relaxed text-lg">
                  Comprehensive budget breakdown tables, expense tracking
                  sheets, planning checklists, and money-saving strategies for
                  effective wedding financial management.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-[#CE805C]/20 group transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-[#CE805C] to-[#740015] rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div className="space-y-4">
                <h3 className="font-playfair text-xl md:text-2xl font-semibold text-[#740015] leading-tight">
                  Wedding Planning & Budgeting
                </h3>
                <p className="font-inter text-[#1E1E1E] leading-relaxed text-lg">
                  Comprehensive budget breakdown tables, timeline planning
                  steps, cultural guidance, and practical tips for organizing
                  your authentic Hausa wedding celebration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Pages Gallery */}
      <section
        id="preview"
        className="py-20 bg-gradient-to-r from-[#F9F4F1] to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#740015] mb-4">
              Inside the Guide
            </h2>
            <p className="font-inter text-lg text-[#1E1E1E] max-w-2xl mx-auto">
              Preview some of the beautifully designed pages that await you in
              the complete guide. Click any page to view larger.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {[
              {
                num: 1,
                title: "Wedding Expenses",
                subtitle: "Budget Management",
              },
              { num: 2, title: "Planning Timeline", subtitle: "2-Month Guide" },
              {
                num: 3,
                title: "Planning Timeline",
                subtitle: "Step-by-Step Tips",
              },
              { num: 4, title: "Final Recap", subtitle: "Essential Summary" },
            ].map((page) => (
              <div key={page.num} className="group">
                <button
                  onClick={() =>
                    openImageModal(
                      `/assets/samplepage${page.num}.png`,
                      `${page.title} - ${page.subtitle}`
                    )
                  }
                  className="relative bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer w-full group"
                >
                  <img
                    src={`/assets/samplepage${page.num}.png`}
                    alt={`${page.title} - Click to enlarge`}
                    className="w-full h-48 sm:h-64 md:h-72 object-cover rounded-lg"
                  />
                  <div className="absolute inset-4 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <svg
                        className="w-6 h-6 text-[#CE805C]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-sm font-inter text-[#740015] font-bold">
                      {page.title}
                    </p>
                    <p className="text-xs font-inter text-[#CE805C] mt-1">
                      {page.subtitle}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-[#740015] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-inter text-lg text-[#1E1E1E] max-w-2xl mx-auto">
              Everything you need to know about the Hausa Wedding Guide.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#F9F4F1] rounded-lg shadow-md">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left font-inter font-semibold text-[#740015] hover:text-[#CE805C] transition-colors duration-200 flex justify-between items-center"
                >
                  {faq.question}
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-200 ${
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
                  <div className="px-6 pb-4">
                    <p className="font-inter text-[#1E1E1E]">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-[#F9F4F1]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-[#740015]">
              Ready to Start Planning Your Perfect Wedding?
            </h2>
            <p className="font-inter text-lg md:text-xl text-[#1E1E1E] mb-8 max-w-2xl mx-auto">
              Your comprehensive planning tools, budget templates, and cultural
              guidance are ready to use. Everything you need for an authentic
              and memorable celebration.
            </p>

            <div className="bg-white rounded-2xl p-6 mb-8 max-w-2xl mx-auto shadow-lg border border-[#CE805C]/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#740015]">
                    Instant
                  </div>
                  <div className="text-sm text-gray-600">Access Ready</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#740015]">
                    Complete
                  </div>
                  <div className="text-sm text-gray-600">Planning Guide</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#740015]">
                    Authentic
                  </div>
                  <div className="text-sm text-gray-600">Cultural Guidance</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <a
                href="/Hausa_Wedding_Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-[#CE805C] hover:bg-[#740015] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Access Your Complete Guide
              </a>
              <p className="text-sm text-gray-600">
                💝 Your authentic Hausa wedding planning resource is ready to
                download
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gradient-to-r from-[#990200] to-[#531946] text-white py-12"
      >
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-center">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <img
                src="/logowhite.svg"
                alt="Hausa Wedding Guide Logo"
                className="h-16 md:h-20 mb-4 mx-auto md:mx-0"
              />
              <p className="font-inter text-gray-200 text-base leading-relaxed max-w-md mx-auto md:mx-0">
                Preserving tradition, embracing modernity. Your trusted
                companion for authentic Hausa wedding planning.
              </p>
            </div>

            {/* Contact Section */}
            <div className="text-center md:text-right">
              <h4 className="font-playfair text-xl font-semibold mb-4 text-white">
                Get in Touch
              </h4>
              <div className="space-y-3">
                <a
                  href="mailto:hausaroom1@gmail.com"
                  className="flex items-center justify-center md:justify-end text-gray-200 hover:text-white transition-colors duration-200 min-h-[48px] p-2"
                >
                  <svg
                    className="w-6 h-6 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-base font-medium">
                    Send us an email
                  </span>
                </a>

                <a
                  href="https://www.instagram.com/hausaroom/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-end text-[#CE805C] hover:text-white transition-colors duration-200 min-h-[48px] p-2"
                  aria-label="Follow us on Instagram"
                >
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="text-base">@hausaroom</span>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-2 sm:space-y-0">
              <p className="font-inter text-gray-200 text-sm">
                © 2025 Hausa Wedding Guide. All rights reserved.
              </p>
              <p className="font-inter text-gray-300 text-sm">
                Made with ❤️ for Hausa traditions
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close image preview"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
