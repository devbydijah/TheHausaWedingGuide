// /src/App.jsx

import React, { useState, useEffect } from "react";
// --- CORRECTED ICON IMPORTS ---
import {
  ListIcon, X, ArrowUpIcon, SparkleIcon, CheckCircleIcon, ArrowRightIcon,
  EnvelopeSimpleIcon, InstagramLogoIcon, FacebookLogoIcon, CaretDownIcon,
  DownloadSimpleIcon, MonitorPlayIcon, PackageIcon
} from "@phosphor-icons/react";
// --- END CORRECTED ICON IMPORTS ---
import "./index.css";
import LoginGate from "./components/LoginGate";
import InteractiveGuide from "./components/InteractiveGuide";
import OnboardingForm from "./components/OnboardingForm";

// --- USE THE SINGLE PAYSTACK STOREFRONT TEST LINK ---
const STOREFRONT_URL = "https://paystack.shop/the-hausa-room-wedding-guide-test-AutTd";
// --- END STOREFRONT LINK ---

function App() {
  const [showGuide, setShowGuide] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [purchasedProductType, setPurchasedProductType] = useState(null); // 'pdf', 'webapp', or potentially ambiguous from storefront redirect

  // Auth states
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [accessStatus, setAccessStatus] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guideParam = params.get("guide");
    const purchasedParam = params.get("purchased"); // Relies on Paystack product redirect settings
    const emailParam = params.get("email");

    if (guideParam === "1") {
      setShowGuide(true);
      if (emailParam) {
        setUserEmail(emailParam);
      }
    } else if (purchasedParam) {
      // Note: If Paystack redirects based on only one item even if bundle bought,
      // this might show 'pdf' or 'webapp' instead of 'bundle'. Webhook handles actual delivery.
      setPurchasedProductType(purchasedParam);
      setShowPurchaseSuccess(true);
      setTimeout(() => {
        setShowPurchaseSuccess(false);
        setPurchasedProductType(null);
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 15000);
    }
  }, []);

  // Scroll spy effect remains the same...
  useEffect(() => { /* ... */ }, []);

  // Scroll functions remain the same...
  const scrollToSection = (sectionId) => { /* ... */ };
  const scrollToTop = () => { /* ... */ };

  // --- Purchase Handler (Points ALL buttons to the storefront) ---
  const handlePurchase = () => {
    window.location.href = STOREFRONT_URL;
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Auth handlers remain the same...
  const handleLogout = async () => { /* ... */ };
  const handleAuthenticated = (email, status) => { /* ... */ };
  const handleOnboardingComplete = (data) => { /* ... */ };


  if (showGuide) {
    return ( <LoginGate onAuthenticated={handleAuthenticated} prefilledEmail={userEmail}> { /* LoginGate content */ } </LoginGate> );
  }

  // FAQ data remains the same...
  const faqs = [ /* ... */ ];

  return (
    <div className="min-h-screen bg-[#F9F4F1]">
      {/* --- Navigation --- */}
      {/* Update Mobile buttons to use handlePurchase */}
      <nav /* ... */ > {/* ... Nav content ... */} </nav>
      <div className={`mobile-menu-panel ... ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="px-4 py-6 space-y-3">
            {/* Nav links */}
            {[{ id: "hero", label: "Home" }, { id: "about", label: "About" }, { id: "features", label: "Features" }, { id: "pricing", label: "Get Your Guide" }, { id: "faq", label: "FAQ" }, { id: "contact", label: "Contact" }].map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)} className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${activeSection === item.id ? "bg-[#740015]/5 text-[#740015] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                {item.label}
                </button>
            ))}
            <button onClick={handlePurchase} className="w-full mt-4 px-6 py-3 bg-[#CE805C] hover:bg-[#B87050] text-white font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center justify-center gap-2">
                <PackageIcon size={18} weight="bold" /> View Purchase Options
            </button>
        </div>
      </div>


      {/* --- Hero Section --- */}
      {/* Main CTA button now goes to storefront */}
      <section id="hero" /* ... */ >
          {/* ... Hero header ... */}
          <h1 /* ... */ >Plan Your Perfect <span /* ... */ >Hausa Wedding</span></h1>
          <p /* ... */ >
              Stress-free planning starts here! Choose our detailed <strong>PDF Guide</strong>, the dynamic <strong>Interactive Web Planner</strong>, or get the <strong>Best Value Bundle</strong>. All options ensure an authentic celebration.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-in-delay" style={{ animationDelay: '0.4s' }}>
             <button onClick={handlePurchase} className="group ...">
                 <span>View Buying Options</span>
                 <ArrowRightIcon size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
             </button>
             <button onClick={() => scrollToSection('features')} className="w-full ...">
                Explore Features
             </button>
          </div>
          {/* Image Grid */}
          { /* ... */ }
      </section>

      {/* --- About & Features Sections remain the same --- */}
      <section id="about" /* ... */ >{/* ... About content ... */}</section>
      <section id="features" /* ... */ >{/* ... Features content ... */}</section>

      {/* --- Pricing Section --- */}
      {/* (Update ALL buttons to use handlePurchase, update Bundle price) */}
      <section id="pricing" className="py-16 md:py-24 bg-[#F9F4F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
              <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-[#740015] mb-4">
                Choose Your Perfect Guide
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Select the planning tool (or bundle!) that fits your needs. Add items to your cart via our secure Paystack Storefront. (Test prices shown).
              </p>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
              {/* PDF Guide Pricing */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#CE805C]/50 shadow-lg text-center flex flex-col items-center animate-slide-up">
                  <DownloadSimpleIcon size={40} weight="duotone" className="text-[#CE805C] mb-4" />
                   <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#740015] mb-2">PDF Guide</h3>
                   <p className="text-gray-600 text-sm mb-6">Comprehensive & Printable</p>
                    <p className="font-playfair text-4xl md:text-5xl font-bold text-[#740015] mb-2">₦110</p>
                   <p className="text-gray-500 text-xs md:text-sm mb-6">One-time payment</p>
                   <ul className="space-y-2 text-xs md:text-sm text-gray-700 text-left mb-6 list-none pl-0 flex-grow">
                        {/* ... features ... */}
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#CE805C] flex-shrink-0" /> Instant PDF Download</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#CE805C] flex-shrink-0" /> Printable Checklists</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#CE805C] flex-shrink-0" /> Detailed Cultural Guide</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#CE805C] flex-shrink-0" /> Keep Forever</li>
                   </ul>
                   {/* Button now uses handlePurchase */}
                   <button onClick={handlePurchase} className="w-full mt-auto px-6 py-2.5 bg-[#CE805C] hover:bg-[#B87050] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                     View in Store
                   </button>
              </div>

              {/* Bundle Pricing Card */}
              <div className="bg-gradient-to-br from-[#740015] to-[#531946] rounded-2xl p-6 md:p-8 border-4 border-[#D4A574] shadow-2xl text-center flex flex-col items-center transform md:scale-105 z-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#D4A574] text-[#740015] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Best Value</div>
                  <PackageIcon size={40} weight="duotone" className="text-[#D4A574] mb-4 mt-5" />
                   <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">Bundle Deal</h3>
                   <p className="text-white/80 text-sm mb-6">PDF Guide + Interactive Access</p>
                    {/* --- UPDATED BUNDLE TEST PRICE (No discount) --- */}
                    <p className="font-playfair text-4xl md:text-5xl font-bold text-[#D4A574] mb-2">₦210</p>
                   <p className="text-white/70 text-xs md:text-sm mb-6">One-time payment</p>
                   <ul className="space-y-2 text-xs md:text-sm text-white/90 text-left mb-6 list-none pl-0 flex-grow">
                        {/* ... features ... */}
                        <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#D4A574] flex-shrink-0" /> <strong>All PDF Guide Features</strong></li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#D4A574] flex-shrink-0" /> <strong>+ All Interactive Features</strong></li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#D4A574] flex-shrink-0" /> Instant PDF Download</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#D4A574] flex-shrink-0" /> 20-Day Interactive Access</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#D4A574] flex-shrink-0" /> Maximum Flexibility</li>
                   </ul>
                    {/* Button now uses handlePurchase */}
                   <button onClick={handlePurchase} className="w-full mt-auto px-6 py-2.5 bg-[#D4A574] hover:bg-[#CE805C] text-[#740015] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                     View in Store
                   </button>
              </div>

               {/* Interactive Guide Pricing */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#740015]/30 shadow-lg text-center flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <MonitorPlayIcon size={40} weight="duotone" className="text-[#740015] mb-4" />
                   <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#740015] mb-2">Interactive Guide</h3>
                   <p className="text-gray-600 text-sm mb-6">Dynamic & Cloud-Synced</p>
                    <p className="font-playfair text-4xl md:text-5xl font-bold text-[#740015] mb-2">₦100</p>
                   <p className="text-gray-500 text-xs md:text-sm mb-6">One-time payment</p>
                   <ul className="space-y-2 text-xs md:text-sm text-gray-700 text-left mb-6 list-none pl-0 flex-grow">
                        {/* ... features ... */}
                         <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#740015] flex-shrink-0" /> Includes All PDF Content</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#740015] flex-shrink-0" /> Dynamic Budget & Tasks</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#740015] flex-shrink-0" /> Vendor Management</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#740015] flex-shrink-0" /> Cloud Sync & Auto-Save</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#740015] flex-shrink-0" /> Personalized PDF Export</li>
                       <li className="flex items-center gap-2"><CheckCircleIcon size={16} weight="fill" className="text-[#740015] flex-shrink-0" /> 20-Day Access</li>
                   </ul>
                   {/* Button now uses handlePurchase */}
                   <button onClick={handlePurchase} className="w-full mt-auto px-6 py-2.5 bg-[#740015] hover:bg-[#531946] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                     View in Store
                   </button>
              </div>
           </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      {/* (Remains the same) */}
      <section id="faq" /* ... */ > {/* ... FAQ content ... */} </section>

      {/* --- Footer --- */}
      {/* (Remains the same) */}
      <footer id="contact" /* ... */ > {/* ... Footer content ... */} </footer>

      {/* --- Back to Top Button --- */}
      {/* (Remains the same) */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-[#740015] hover:bg-[#CE805C] text-white p-3 rounded-full shadow-lg transition-all duration-300 animate-fade-in"
          aria-label="Back to Top"
        >
          <ArrowUpIcon size={24} weight="bold" />
        </button>
      )}

      {/* --- Purchase Success Modal --- */}
      {/* (Messaging adjusted for potential ambiguity) */}
      {showPurchaseSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden animate-slide-up">
              <div className="bg-gradient-to-r from-[#990200] to-[#531946] p-6 text-white text-center relative">
                 <button onClick={() => { setShowPurchaseSuccess(false); setPurchasedProductType(null); window.history.replaceState({}, document.title, window.location.pathname); }} className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors" aria-label="Close modal">
                   <X size={20} weight="bold" />
                 </button>
                 <div className="flex justify-center mb-3">
                   <div className="bg-white/20 rounded-full p-3">
                     <CheckCircleIcon size={40} weight="fill" className="text-white" />
                   </div>
                 </div>
                 <h2 className="font-playfair text-2xl font-bold">Payment Successful!</h2>
              </div>
              <div className="p-6 space-y-4">
                 <p className="text-gray-700 text-base font-inter text-center">
                   Thank you for your purchase! We've sent instructions for your
                   <strong>
                     {/* Generic message if type is unknown, specific if known */}
                     {purchasedProductType === 'pdf' ? ' PDF Guide download' : ''}
                     {purchasedProductType === 'webapp' ? ' Interactive Guide access' : ''}
                     {purchasedProductType === 'bundle' ? ' Bundle (PDF + Interactive Guide)' : ''}
                     {!purchasedProductType && ' items'} {/* Fallback */}
                   </strong> to your email.
                 </p>
                  <div className="bg-[#CE805C]/10 border-l-4 border-[#CE805C] rounded-r-lg p-4">
                     <h3 className="font-semibold text-[#740015] text-base mb-2 flex items-center gap-2"><EnvelopeSimpleIcon size={18} weight="bold" /> Check Your Email</h3>
                     <p className="text-gray-700 text-sm leading-relaxed">
                         Please check your inbox (and spam folder!) for an email from Hausa Room containing your access details based on the item(s) you purchased.
                         {/* Specific instructions might be less reliable here */}
                     </p>
                  </div>
                   <div className="bg-gray-50 rounded-lg p-4">
                     <h3 className="font-semibold text-gray-800 text-base mb-2">Next Steps:</h3>
                      <ol className="space-y-1 text-sm text-gray-600 list-decimal list-inside">
                        <li>Find the email from Hausa Room.</li>
                        <li>Follow the instructions for your PDF download and/or interactive planner access.</li>
                        <li>Start planning!</li>
                     </ol>
                   </div>
                   <p className="text-xs text-gray-500 text-center">
                      Need help? <a href="mailto:support@hausaroom.com" className="text-[#990200] hover:underline font-medium">Contact Support</a>
                   </p>
              </div>
              <div className="bg-gray-50 px-6 py-4 text-right border-t">
                  <button onClick={() => { setShowPurchaseSuccess(false); setPurchasedProductType(null); window.history.replaceState({}, document.title, window.location.pathname); }} className="bg-[#CE805C] hover:bg-[#740015] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105">
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