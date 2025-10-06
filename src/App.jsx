import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [showClaim, setShowClaim] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const claimParam = params.get('claim');
    const downloadParam = params.get('download');
    
    if (claimParam === '1' || downloadParam) {
      setShowClaim(true);
    }
  }, []);

  const handlePurchase = () => {
    window.location.href = "https://paystack.shop/hausaroom-wedding-guide-GLQSt";
  };

  // Show claim/success page after purchase
  if (showClaim) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#990200] to-[#531946] flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-white">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Thank You for Your Purchase!
            </h1>
            <p className="text-xl mb-8">
              Your Hausa Wedding Guide PDF is ready to download.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">What's Inside Your Guide:</h2>
            <ul className="space-y-3 text-lg">
              <li className="flex items-start">
                <span className="text-2xl mr-3">📖</span>
                <span>Complete guide to traditional Hausa wedding ceremonies</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">👗</span>
                <span>Attire recommendations for bride, groom, and guests</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">🎊</span>
                <span>Kamu (Traditional pre-wedding celebrations) planning</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">💍</span>
                <span>Ceremony customs, traditions, and protocols</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">🍽️</span>
                <span>Menu planning with authentic Hausa cuisine suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">📋</span>
                <span>Checklists, timelines, and planning templates</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#CE805C]/20 border-2 border-[#CE805C] rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-3">📧 Check Your Email</h3>
            <p className="text-lg mb-2">
              We've sent you a secure download link. Click it to download your PDF guide.
            </p>
            <p className="text-sm opacity-90">
              Link expires in 24 hours. If you don't see the email, check your spam folder.
            </p>
          </div>

          <div className="bg-white/5 rounded-xl p-6 text-center">
            <p className="text-sm opacity-75">
              💡 <strong>Pro Tip:</strong> Save the PDF to your device for offline access. You can also print it for easy reference during planning.
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
        <div className="text-center text-white mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-[#CE805C] bg-clip-text text-transparent">
            Hausa Wedding Guide
          </h1>
          <p className="text-2xl mb-4">
            Your Complete PDF Resource for Authentic Hausa Weddings
          </p>
          <p className="text-xl opacity-90">
            Everything you need to plan a beautiful, traditional Hausa wedding ceremony
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="text-xl font-bold text-white mb-2">Comprehensive Coverage</h3>
            <p className="text-white/90 text-sm">
              From engagement to reception, every detail of traditional Hausa wedding customs explained
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-2">Ready-to-Use Checklists</h3>
            <p className="text-white/90 text-sm">
              Practical templates, timelines, and checklists to keep your planning organized
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/15 transition-all">
            <div className="text-4xl mb-4">🎊</div>
            <h3 className="text-xl font-bold text-white mb-2">Cultural Authenticity</h3>
            <p className="text-white/90 text-sm">
              Respect traditions while adding your personal touch to create a memorable celebration
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What You'll Learn:</h2>
          <div className="grid md:grid-cols-2 gap-4 text-white">
            <div className="flex items-start space-x-3">
              <span className="text-xl">👗</span>
              <span>Traditional attire and dress codes</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">💰</span>
              <span>Budget planning and cost estimates</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">🎵</span>
              <span>Music, entertainment, and celebrations</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">🍽️</span>
              <span>Authentic Hausa cuisine menu planning</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">📜</span>
              <span>Ceremonial protocols and etiquette</span>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">🎁</span>
              <span>Gift-giving customs and traditions</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-6">
            <span className="text-5xl font-bold text-white">₦100</span>
            <span className="text-xl text-white/80 ml-2">one-time payment</span>
          </div>
          <button
            onClick={handlePurchase}
            className="bg-[#CE805C] hover:bg-[#740015] text-white px-12 py-5 rounded-xl text-2xl font-semibold transition-all shadow-2xl hover:scale-105"
          >
            Get Your PDF Guide - ₦100
          </button>
          <p className="text-white/70 mt-4 text-sm">
            Instant download • Lifetime access • Print-friendly format
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
