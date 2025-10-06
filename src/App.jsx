import React from 'react';
import './index.css';

function App() {
  const handlePurchase = () => {
    // Redirect to Paystack storefront for Interactive guide (₦100)
    window.location.href = "https://paystack.com/pay/hausaweddingguideinteractive";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#531946] to-[#990200] flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-8">
          Interactive Wedding Guide
        </h1>
        <p className="text-xl mb-8">
          Experience our interactive web application for comprehensive wedding planning.
        </p>
        <p className="text-3xl font-bold mb-4">₦100</p>
        <button 
          onClick={handlePurchase}
          className="bg-[#CE805C] hover:bg-[#740015] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
        >
          Buy Interactive Guide - ₦100
        </button>
      </div>
    </div>
  );
}

export default App;
