import React from "react";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

const Pricing = ({ handlePurchase }) => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-gradient-to-br from-primary-600/5 to-primary-500/10 rounded-3xl p-12 border-2 border-primary-500/20 shadow-2xl mb-8">
          <div className="mb-8">
            <div className="inline-block mb-4">
              <span className="bg-secondary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Special Launch Offer
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="font-playfair text-6xl md:text-7xl font-bold text-primary-500 drop-shadow-lg">
                ₦100
              </span>
            </div>
            <p className="font-inter text-xl text-gray-600">one-time payment</p>
          </div>

          <button
            onClick={handlePurchase}
            className="group relative bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-primary-500 text-white w-full sm:w-auto px-16 py-6 rounded-2xl text-2xl font-bold font-inter transition-all shadow-2xl hover:shadow-secondary-500/50 transform hover:scale-105 hover:-translate-y-1 duration-300 mb-6"
            aria-label="Purchase Interactive Wedding Guide for 100 Naira"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>Get Started Now</span>
              <ArrowRight
                size={24}
                weight="bold"
                className="group-hover:translate-x-2 transition-transform"
              />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>

          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 text-base">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Extended access period</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-green-600" />
              <span>Cloud sync included</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} weight="fill" className="text-green-600" />
              <span>No monthly fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
