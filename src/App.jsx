import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const claimParam = params.get("claim");
    const downloadParam = params.get("download");

    if (claimParam === "1" || downloadParam) {
      setShowClaim(true);
    }
  }, []);

  const handlePurchase = () => {
    window.location.href =
      "https://paystack.shop/hausaroom-wedding-guide-GLQSt";
  };

  // Show claim/success page after purchase
  if (showClaim) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#990200] to-[#531946] flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-white">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <img 
              src="/assets/logowhite.jpg" 
              alt="Hausa Wedding Guide Logo" 
              className="h-16 md:h-20 mx-auto mb-4 rounded-lg shadow-lg"
            />
          </div>

          <div className="text-center mb-12">
            <div className="text-6xl mb-6" role="img" aria-label="Celebration">
              🎉
            </div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              Thank You for Your Purchase!
            </h1>
            <p className="text-xl font-inter mb-8">
              Your Hausa Wedding Guide PDF is ready to download.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-playfair font-bold mb-4">
              What's Inside Your Guide:
            </h2>
            <ul className="space-y-3 text-lg font-inter">
              <li className="flex items-start">
                <span className="text-2xl mr-3" role="img" aria-label="Book">
                  📖
                </span>
                <span>
                  Complete guide to traditional Hausa wedding ceremonies
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3" role="img" aria-label="Dress">
                  👗
                </span>
                <span>Attire recommendations for bride, groom, and guests</span>
              </li>
              <li className="flex items-start">
                <span
                  className="text-2xl mr-3"
                  role="img"
                  aria-label="Celebration"
                >
                  🎊
                </span>
                <span>
                  Kamu (Traditional pre-wedding celebrations) planning
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3" role="img" aria-label="Ring">
                  💍
                </span>
                <span>Ceremony customs, traditions, and protocols</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3" role="img" aria-label="Food">
                  🍽️
                </span>
                <span>
                  Menu planning with authentic Hausa cuisine suggestions
                </span>
              </li>
              <li className="flex items-start">
                <span
                  className="text-2xl mr-3"
                  role="img"
                  aria-label="Checklist"
                >
                  📋
                </span>
                <span>Checklists, timelines, and planning templates</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#CE805C]/20 border-2 border-[#CE805C] rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-playfair font-bold mb-3">
              <span role="img" aria-label="Email">
                📧
              </span>{" "}
              Check Your Email
            </h3>
            <p className="text-lg font-inter mb-2">
              We've sent you a secure download link. Click it to download your
              PDF guide.
            </p>
            <p className="text-sm font-inter opacity-90">
              Link expires in 24 hours. If you don't see the email, check your
              spam folder.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 text-center">
            <p className="text-sm font-inter opacity-75">
              <span role="img" aria-label="Light bulb">
                💡
              </span>{" "}
              <strong>Pro Tip:</strong> Save the PDF to your device for offline
              access. You can also print it for easy reference during planning.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default landing page for new visitors
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#990200] to-[#531946] flex items-center justify-center p-8">
      <div className="max-w-6xl mx-auto">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <img 
            src="/assets/logowhite.jpg" 
            alt="Hausa Wedding Guide Logo" 
            className="h-20 md:h-24 mx-auto mb-4 rounded-lg shadow-2xl"
          />
        </div>

        {/* Hero Section with Image */}
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 bg-gradient-to-r from-white to-[#CE805C] bg-clip-text text-transparent">
            Hausa Wedding Guide
          </h1>
          <p className="text-2xl font-inter mb-4">
            Your Complete PDF Resource for Authentic Hausa Weddings
          </p>
          <p className="text-xl font-inter opacity-90">
            Everything you need to plan a beautiful, traditional Hausa wedding
            ceremony
          </p>
        </div>

        {/* Hero Images Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/assets/couple1.png" 
              alt="Traditional Hausa wedding couple" 
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/assets/bride1.png" 
              alt="Hausa bride in traditional attire" 
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <img 
              src="/assets/eventdecor.png" 
              alt="Traditional Hausa wedding decoration" 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all">
            <div className="text-4xl mb-4" role="img" aria-label="Book">
              📖
            </div>
            <h3 className="text-xl font-playfair font-bold text-white mb-2">
              Comprehensive Coverage
            </h3>
            <p className="text-white/90 font-inter text-sm">
              From engagement to reception, every detail of traditional Hausa
              wedding customs explained
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all">
            <div className="text-4xl mb-4" role="img" aria-label="Checkmark">
              ✅
            </div>
            <h3 className="text-xl font-playfair font-bold text-white mb-2">
              Ready-to-Use Checklists
            </h3>
            <p className="text-white/90 font-inter text-sm">
              Practical templates, timelines, and checklists to keep your
              planning organized
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all">
            <div className="text-4xl mb-4" role="img" aria-label="Party popper">
              🎊
            </div>
            <h3 className="text-xl font-playfair font-bold text-white mb-2">
              Cultural Authenticity
            </h3>
            <p className="text-white/90 font-inter text-sm">
              Respect traditions while adding your personal touch to create a
              memorable celebration
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-playfair font-bold text-white mb-6 text-center">
            What You'll Learn:
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-white font-inter">
            <div className="flex items-start space-x-3">
              <span className="text-xl" role="img" aria-label="Dress">
                👗
              </span>
              <span>Traditional attire and dress codes</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl" role="img" aria-label="Money bag">
                💰
              </span>
              <span>Budget planning and cost estimates</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl" role="img" aria-label="Music">
                🎵
              </span>
              <span>Music, entertainment, and celebrations</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl" role="img" aria-label="Food">
                🍽️
              </span>
              <span>Authentic Hausa cuisine menu planning</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl" role="img" aria-label="Scroll">
                📜
              </span>
              <span>Ceremonial protocols and etiquette</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl" role="img" aria-label="Gift">
                🎁
              </span>
              <span>Gift-giving customs and traditions</span>
            </div>
          </div>
        </div>

        {/* PDF Preview Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-playfair font-bold text-white mb-6 text-center">
            <span role="img" aria-label="Eyes">👀</span> Preview What's Inside
          </h2>
          <p className="text-center text-white/90 font-inter mb-8">
            Take a sneak peek at the comprehensive guide that will help you plan your perfect Hausa wedding
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border-2 border-[#CE805C]/30">
              <img 
                src="/assets/samplepage1.png" 
                alt="PDF preview page 1" 
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border-2 border-[#CE805C]/30">
              <img 
                src="/assets/samplepage2.png" 
                alt="PDF preview page 2" 
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border-2 border-[#CE805C]/30">
              <img 
                src="/assets/samplepage3.png" 
                alt="PDF preview page 3" 
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border-2 border-[#CE805C]/30">
              <img 
                src="/assets/samplepage4.png" 
                alt="PDF preview page 4" 
                className="w-full h-auto"
              />
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 border-2 border-[#CE805C]/30">
              <img 
                src="/assets/samplepage5.png" 
                alt="PDF preview page 5" 
                className="w-full h-auto"
              />
            </div>
          </div>
          <p className="text-center text-white/70 font-inter mt-6 text-sm">
            <span role="img" aria-label="Sparkles">✨</span> Beautiful, professionally designed pages with actionable guidance
          </p>
        </div>

        <div className="text-center">
          <div className="mb-6">
            <span className="text-5xl font-playfair font-bold text-white">
              ₦100
            </span>
            <span className="text-xl font-inter text-white/80 ml-2">
              one-time payment
            </span>
          </div>
          <button
            onClick={handlePurchase}
            className="bg-[#CE805C] hover:bg-[#740015] text-white px-12 py-5 rounded-xl text-2xl font-playfair font-semibold transition-all shadow-2xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50"
          >
            Get Your PDF Guide - ₦100
          </button>
          <p className="text-white/70 font-inter mt-4 text-sm">
            Instant download • Lifetime access • Print-friendly format
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
