import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [productType, setProductType] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get('product');
    if (product) {
      setProductType(product);
    }
  }, []);

  const getContent = () => {
    if (productType === 'pdf') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#990200] to-[#531946] flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Hausa Wedding Guide PDF
            </h1>
            <p className="text-xl mb-8">
              Your comprehensive PDF guide for authentic Hausa wedding planning.
            </p>
            <button className="bg-[#CE805C] hover:bg-[#740015] text-white px-8 py-4 rounded-xl text-lg font-semibold">
              Download PDF Guide
            </button>
          </div>
        </div>
      );
    } else if (productType === 'webapp') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#531946] to-[#990200] flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Interactive Wedding Guide
            </h1>
            <p className="text-xl mb-8">
              Experience our interactive web application for comprehensive wedding planning.
            </p>
            <button className="bg-[#CE805C] hover:bg-[#740015] text-white px-8 py-4 rounded-xl text-lg font-semibold">
              Start Interactive Guide
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#990200] to-[#531946] flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Hausa Wedding Guide
            </h1>
            <p className="text-xl mb-8">
              Choose your preferred format for authentic Hausa wedding planning resources.
            </p>
            <div className="flex gap-4 justify-center">
              <a href="/?product=pdf" className="bg-[#CE805C] hover:bg-[#740015] text-white px-8 py-4 rounded-xl text-lg font-semibold">
                PDF Guide
              </a>
              <a href="/?product=webapp" className="bg-[#CE805C] hover:bg-[#740015] text-white px-8 py-4 rounded-xl text-lg font-semibold">
                Interactive Guide
              </a>
            </div>
          </div>
        </div>
      );
    }
  };

  return getContent();
}

export default App;
