import React from "react";
import {
  Sparkle,
  CurrencyCircleDollar,
  ClipboardText,
  CalendarBlank,
  Cloud,
  FloppyDisk,
} from "@phosphor-icons/react";

const Features = () => {
  const features = [
    {
      icon: Sparkle,
      title: "Vision & Values Quiz",
      description:
        "Discover your unique wedding style and aesthetic preferences",
    },
    {
      icon: CurrencyCircleDollar,
      title: "Smart Budget Builder",
      description: "Real-time calculations and comprehensive expense tracking",
    },
    {
      icon: ClipboardText,
      title: "Vendor Tracker",
      description: "Organize all your contacts and communications effortlessly",
    },
    {
      icon: CalendarBlank,
      title: "Timeline Manager",
      description:
        "Priority sorting and task management for stress-free planning",
    },
    {
      icon: Cloud,
      title: "Cloud Sync",
      description: "Access your plans from any device with automatic syncing",
    },
    {
      icon: FloppyDisk,
      title: "Auto-Save Progress",
      description: "Never lose your work with automatic progress saving",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-slide-up">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary-500 mb-4">
              Everything You Need to Plan Your Perfect Day
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
              Powerful tools and cultural guidance all in one interactive
              platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-primary-600/5 to-primary-500/10 backdrop-blur-xl rounded-2xl p-8 border border-primary-500/20 hover:border-secondary-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-secondary-500/10 to-primary-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <feature.icon
                    size={40}
                    weight="duotone"
                    className="text-secondary-500"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-primary-500 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.slice(3).map((feature, index) => (
              <div
                key={index + 3}
                className="group bg-gradient-to-br from-primary-600/5 to-primary-500/10 backdrop-blur-xl rounded-2xl p-8 border border-primary-500/20 hover:border-secondary-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-6 inline-block p-4 bg-gradient-to-br from-secondary-500/10 to-primary-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <feature.icon
                    size={40}
                    weight="duotone"
                    className="text-secondary-500"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-primary-500 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
