import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Purchase & Access",
      description:
        "Make your one-time payment of ₦100 and receive instant access to your dashboard",
    },
    {
      number: 2,
      title: "Discover Your Style",
      description:
        "Take the Vision & Values Quiz to uncover your unique wedding aesthetic",
    },
    {
      number: 3,
      title: "Plan & Execute",
      description:
        "Use our interactive tools to budget, organize vendors, and manage your timeline",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F9F4F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-slide-up">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary-500 mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
              Get started with your wedding planning in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 text-white text-3xl font-bold mb-6 shadow-xl">
                  {step.number}
                </div>
                <h3 className="font-playfair text-2xl font-bold text-primary-500 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-secondary-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
