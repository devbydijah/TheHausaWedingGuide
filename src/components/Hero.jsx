import React from "react";
import { Sparkle } from "@phosphor-icons/react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with enhanced typography */}
        <section
          className="text-center text-white mb-16 animate-slide-up"
          aria-labelledby="hero-heading"
        >
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-secondary-500 to-accent text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 justify-center">
              <Sparkle size={20} weight="duotone" />
              <span>Your Complete Wedding Planning Solution</span>
            </span>
          </div>

          <h1
            id="hero-heading"
            className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent animate-gradient">
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
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-secondary-500/40">
              <img
                src="/assets/couple2.png"
                alt="Traditional Hausa wedding couple celebrating"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </div>
          </div>

          <div className="group mx-auto">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-secondary-500/40">
              <img
                src="/assets/bride2.png"
                alt="Hausa bride in traditional wedding attire"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </div>
          </div>

          <div className="group mx-auto">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-secondary-500/40">
              <img
                src="/assets/bride3.png"
                alt="Beautiful Hausa bride portrait"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
