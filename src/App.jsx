import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-amber-900 mb-6">
            Hausa Wedding Guide
          </h1>
          <p className="font-inter text-lg text-amber-800 mb-8 max-w-2xl mx-auto">
            Your comprehensive guide to traditional Hausa wedding ceremonies,
            customs, and celebrations.
          </p>

          {/* Download PDF Button */}
          <div className="mb-12">
            <a
              href="/Hausa_Wedding_Guide.pdf"
              download="Hausa_Wedding_Guide.pdf"
              className="inline-flex items-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              Download Wedding Guide PDF
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-playfair text-xl font-semibold text-amber-900 mb-3">
                Traditional Ceremonies
              </h3>
              <p className="font-inter text-amber-700">
                Learn about the rich traditions and ceremonies that make Hausa
                weddings special.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-playfair text-xl font-semibold text-amber-900 mb-3">
                Cultural Customs
              </h3>
              <p className="font-inter text-amber-700">
                Discover the meaningful customs and rituals passed down through
                generations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="font-playfair text-xl font-semibold text-amber-900 mb-3">
                Planning Guide
              </h3>
              <p className="font-inter text-amber-700">
                Get practical tips and guidance for planning your perfect Hausa
                wedding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
