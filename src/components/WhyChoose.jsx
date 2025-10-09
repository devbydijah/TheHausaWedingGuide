import React from "react";
import { CheckCircle } from "@phosphor-icons/react";

const WhyChoose = () => {
  const benefits = [
    {
      title: "Live Updates & Calculations",
      description:
        "Budget calculations update instantly as you make changes - no manual math needed",
    },
    {
      title: "Access Anywhere",
      description:
        "Cloud sync means your plans are available on any device, anytime",
    },
    {
      title: "Never Lose Your Work",
      description:
        "Automatic saving ensures your planning progress is always protected",
    },
    {
      title: "Personalized Experience",
      description: "Discover your unique style with our Vision & Values Quiz",
    },
  ];

  return (
    <section
      id="why-choose"
      className="py-20 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-slide-up">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose the Interactive Guide?
            </h2>
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              More than just a PDF - a complete digital planning experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-secondary-500 flex items-center justify-center">
                    <CheckCircle
                      size={24}
                      weight="bold"
                      className="text-white"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-white/80">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
