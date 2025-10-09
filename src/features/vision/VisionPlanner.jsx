import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkle,
  Heart,
  Users,
  PencilLine,
  CheckCircle,
  ArrowRight,
  Info,
  Star,
  Palette,
  BookOpen,
  Lightbulb,
  Crown,
  Diamond,
} from "@phosphor-icons/react";
import { Card, AnimatedCard, GradientHeader } from "../../components/ui";

/**
 * VisionPlanner Component
 *
 * Define wedding priorities, niyyah (intention), values, and vision details
 */
export default function VisionPlanner({
  data,
  updatePriorities,
  updateField,
  setActiveSection,
  darkMode,
}) {
  const [activeTab, setActiveTab] = useState("priorities");
  const [localPriorities, setLocalPriorities] = useState({
    cultural: data?.priorities?.cultural || 5,
    budget: data?.priorities?.budget || 5,
    family: data?.priorities?.family || 5,
    personal: data?.priorities?.personal || 5,
  });

  const niyyahRef = useRef(null);
  const visionNotesRef = useRef(null);

  // Save priorities when they change
  const handlePriorityChange = (key, value) => {
    const newPriorities = { ...localPriorities, [key]: value };
    setLocalPriorities(newPriorities);
    updatePriorities(newPriorities);
  };

  // Priority categories with descriptions
  const priorityCategories = [
    {
      key: "cultural",
      label: "Cultural Traditions",
      icon: <Palette size={24} weight="bold" />,
      description:
        "How important is honoring Hausa traditions and customs in your wedding?",
      lowLabel: "Minimal traditions",
      highLabel: "Full traditional",
    },
    {
      key: "budget",
      label: "Budget Consciousness",
      icon: <Star size={24} weight="bold" />,
      description:
        "How much do you prioritize staying within budget vs. splurging?",
      lowLabel: "Flexible spending",
      highLabel: "Strict budget",
    },
    {
      key: "family",
      label: "Family Involvement",
      icon: <Users size={24} weight="bold" />,
      description:
        "How involved should family be in wedding decisions and planning?",
      lowLabel: "Independent",
      highLabel: "Family-centered",
    },
    {
      key: "personal",
      label: "Personal Expression",
      icon: <Heart size={24} weight="bold" />,
      description:
        "How important is it to express your unique style and personality?",
      lowLabel: "Traditional style",
      highLabel: "Unique & personal",
    },
  ];

  // Core values options with Phosphor icons and descriptions
  const coreValuesOptions = [
    {
      value: "faith",
      label: "Faith & Spirituality",
      icon: BookOpen,
      description: "Islamic values at the heart of your union",
    },
    {
      value: "family",
      label: "Family Unity",
      icon: Users,
      description: "Bringing families together in celebration",
    },
    {
      value: "tradition",
      label: "Cultural Heritage",
      icon: Crown,
      description: "Honoring Hausa customs and traditions",
    },
    {
      value: "love",
      label: "Love & Romance",
      icon: Heart,
      description: "Celebrating your love story and connection",
    },
    {
      value: "community",
      label: "Community & Friends",
      icon: Users,
      description: "Sharing joy with your wider community",
    },
    {
      value: "simplicity",
      label: "Simplicity & Mindfulness",
      icon: Sparkle,
      description: "Meaningful moments over extravagance",
    },
    {
      value: "joy",
      label: "Joy & Celebration",
      icon: Sparkle,
      description: "Creating unforgettable happy memories",
    },
    {
      value: "elegance",
      label: "Elegance & Beauty",
      icon: Diamond,
      description: "Refined aesthetics and sophisticated style",
    },
  ];

  const selectedValues = data?.coreValues || [];

  const toggleValue = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    updateField("coreValues", newValues);
  };

  // Get vision result details with Phosphor icons
  const getVisionDetails = () => {
    const result = data?.visionResult;
    if (!result) return null;

    const details = {
      traditional: {
        title: "Traditional Hausa Wedding",
        description:
          "Your wedding will honor authentic Hausa customs with full traditional ceremonies, attire, and cultural elements.",
        icon: Crown,
        color: "from-[#740015] to-[#531946]",
        recommendations: [
          "Complete Kayan Lefe collection",
          "Traditional Fatiha, Kamu, and Walima ceremonies",
          "Full Hausa attire for all events",
          "Traditional music and entertainment",
          "Hausa cuisine menu",
        ],
      },
      fusion: {
        title: "Fusion Wedding Style",
        description:
          "You'll blend cherished Hausa traditions with modern elements for a unique celebration that honors both heritage and contemporary style.",
        icon: Sparkle,
        color: "from-[#CE805C] to-[#B87050]",
        recommendations: [
          "Selective Kayan Lefe with modern touches",
          "Combine traditional and modern events",
          "Mix traditional and contemporary attire",
          "Blend of traditional and modern music",
          "Fusion menu with diverse options",
        ],
      },
      modern: {
        title: "Modern Contemporary Wedding",
        description:
          "Your wedding will feature a contemporary approach with minimalist elegance and Western influences while respecting cultural significance.",
        icon: Diamond,
        color: "from-[#531946] to-[#CE805C]",
        recommendations: [
          "Symbolic Kayan Lefe items only",
          "Simplified ceremony structure",
          "Modern elegant attire with cultural accents",
          "Contemporary music and entertainment",
          "International menu with Nigerian options",
        ],
      },
    };

    return details[result] || null;
  };

  const visionDetails = getVisionDetails();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <GradientHeader
        icon={Sparkle}
        title="Vision & Values"
        subtitle="Define your wedding priorities and intentions"
        gradientFrom="#740015"
        gradientTo="#531946"
        iconSize={56}
      />

      {/* Vision Result Summary */}
      {visionDetails && (
        <AnimatedCard delay={0.2} className="!p-0 overflow-hidden">
          <div
            className={`p-6 bg-gradient-to-br ${visionDetails.color} text-white`}
          >
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <visionDetails.icon size={36} weight="bold" />
              </motion.div>
              <div className="flex-1">
                <h2 className="font-playfair text-2xl font-bold mb-2">
                  {visionDetails.title}
                </h2>
                <p className="text-white/90 mb-4">
                  {visionDetails.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection("quiz")}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all backdrop-blur-sm"
                >
                  Retake Quiz
                  <ArrowRight size={16} weight="bold" />
                </motion.button>
              </div>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="border-b-2 border-gray-200 dark:border-gray-700"
      >
        <nav
          className="flex space-x-1 overflow-x-auto"
          aria-label="Vision sections"
        >
          {[
            { id: "priorities", label: "Priorities", icon: Star },
            { id: "values", label: "Core Values", icon: Heart },
            { id: "niyyah", label: "Niyyah", icon: BookOpen },
            { id: "vision", label: "Vision Notes", icon: PencilLine },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap relative ${
                  isActive
                    ? "text-white"
                    : darkMode
                      ? "border-transparent text-gray-400 hover:text-gray-300"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, #740015 0%, #531946 100%)",
                        borderColor: "transparent",
                        borderRadius: "0.5rem 0.5rem 0 0",
                      }
                    : {}
                }
              >
                <Icon size={20} weight="bold" />
                {tab.label}
              </motion.button>
            );
          })}
        </nav>
      </motion.div>

      {/* Priorities Tab */}
      {activeTab === "priorities" && (
        <div className="space-y-6">
          <Card className="!p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#740015] to-[#531946] text-white">
                <Info size={24} className="flex-shrink-0" />
              </div>
              <div>
                <h3
                  className={`font-semibold mb-1 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Set Your Priorities
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Use the sliders to indicate how important each aspect is to
                  you. This will help guide your planning decisions.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {priorityCategories.map((category) => (
                <div key={category.key}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#CE805C]/20 to-[#B87050]/20 border-2 border-[#CE805C]/30">
                      <div className="text-[#740015]">{category.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-semibold ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {category.label}
                        </h4>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent">
                          {localPriorities[category.key]}
                        </span>
                      </div>
                      <p
                        className={`text-sm mb-3 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {category.description}
                      </p>

                      {/* Slider */}
                      <div className="mb-2">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={localPriorities[category.key]}
                          onChange={(e) =>
                            handlePriorityChange(
                              category.key,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full h-3 rounded-lg appearance-none cursor-pointer priority-slider"
                          style={{
                            background: `linear-gradient(to right, #740015 0%, #531946 ${
                              (localPriorities[category.key] - 1) * 11.11
                            }%, ${darkMode ? "#374151" : "#E5E7EB"} ${
                              (localPriorities[category.key] - 1) * 11.11
                            }%, ${darkMode ? "#374151" : "#E5E7EB"} 100%)`,
                          }}
                          aria-label={`${category.label} priority level`}
                          aria-valuemin="1"
                          aria-valuemax="10"
                          aria-valuenow={localPriorities[category.key]}
                        />
                      </div>

                      {/* Labels */}
                      <div className="flex items-center justify-between text-xs">
                        <span
                          className={
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }
                        >
                          {category.lowLabel}
                        </span>
                        <span
                          className={
                            darkMode ? "text-gray-500" : "text-gray-500"
                          }
                        >
                          {category.highLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Priority Summary */}
          <Card className="!p-6 bg-gradient-to-br from-[#740015]/5 to-[#531946]/5 border-[#740015]/20">
            <h3
              className={`font-semibold mb-4 flex items-center gap-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Lightbulb size={20} weight="bold" className="text-[#740015]" />
              Your Priority Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {priorityCategories.map((category) => {
                const value = localPriorities[category.key];
                const level =
                  value <= 3 ? "Low" : value <= 7 ? "Medium" : "High";
                const levelColor =
                  value <= 3
                    ? "text-gray-600 dark:text-gray-400"
                    : value <= 7
                      ? "text-[#CE805C]"
                      : "text-[#740015]";

                return (
                  <div key={category.key} className="text-center">
                    <div className="mb-2 text-[#740015]">{category.icon}</div>
                    <p
                      className={`text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {category.label.split(" ")[0]}
                    </p>
                    <p className={`text-xs font-semibold ${levelColor}`}>
                      {level} ({value}/10)
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Core Values Tab */}
      {activeTab === "values" && (
        <AnimatedCard delay={0.2} variant="fade">
          <Card className="!p-6">
            <div className="flex items-start gap-3 mb-6">
              <div
                className="p-2 rounded-lg flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, #740015 0%, #531946 100%)",
                }}
              >
                <Heart size={24} weight="bold" className="text-white" />
              </div>
              <div>
                <h3
                  className={`font-semibold mb-1 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Select Your Core Values
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Choose the values that are most important to you. These will
                  guide your wedding planning decisions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreValuesOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                const IconComponent = option.icon;

                return (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleValue(option.value)}
                    className={`group p-5 rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-[#740015] shadow-lg"
                        : darkMode
                          ? "border-gray-700 hover:border-[#CE805C]/50 bg-gray-800/50 hover:bg-gray-800"
                          : "border-gray-200 hover:border-[#CE805C]/50 bg-white hover:shadow-md"
                    }`}
                    style={
                      isSelected
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(116, 0, 21, 0.05) 0%, rgba(83, 25, 70, 0.05) 100%)",
                          }
                        : {}
                    }
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        animate={isSelected ? { rotate: [0, -5, 5, 0] } : {}}
                        transition={{ duration: 0.5 }}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "text-white"
                            : darkMode
                              ? "text-gray-400 group-hover:text-[#CE805C]"
                              : "text-gray-600 group-hover:text-[#740015]"
                        }`}
                        style={
                          isSelected
                            ? {
                                background:
                                  "linear-gradient(135deg, #740015 0%, #531946 100%)",
                              }
                            : {
                                background: darkMode ? "#374151" : "#F3F4F6",
                              }
                        }
                      >
                        <IconComponent size={28} weight="bold" />
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold mb-1 ${
                            isSelected
                              ? "text-[#740015] dark:text-[#CE805C]"
                              : darkMode
                                ? "text-gray-200 group-hover:text-white"
                                : "text-gray-900"
                          }`}
                        >
                          {option.label}
                        </p>
                        <p
                          className={`text-xs leading-relaxed ${
                            isSelected
                              ? darkMode
                                ? "text-[#CE805C]/80"
                                : "text-[#740015]/80"
                              : darkMode
                                ? "text-gray-400"
                                : "text-gray-600"
                          }`}
                        >
                          {option.description}
                        </p>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                          }}
                        >
                          <CheckCircle
                            size={24}
                            weight="fill"
                            className="text-[#740015]"
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {selectedValues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl"
                style={{
                  background: darkMode
                    ? "rgba(116, 0, 21, 0.1)"
                    : "rgba(206, 128, 92, 0.1)",
                }}
              >
                <p
                  className={`text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Selected Values ({selectedValues.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedValues.map((value) => {
                    const option = coreValuesOptions.find(
                      (o) => o.value === value
                    );
                    const SelectedIcon = option?.icon;
                    return (
                      <motion.span
                        key={value}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, #740015 0%, #531946 100%)",
                        }}
                      >
                        {SelectedIcon && (
                          <SelectedIcon size={16} weight="bold" />
                        )}
                        {option?.label}
                      </motion.span>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </Card>
        </AnimatedCard>
      )}

      {/* Niyyah (Intention) Tab */}
      {activeTab === "niyyah" && (
        <div className="space-y-6">
          <Card className="!p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#740015] to-[#531946] text-white">
                <BookOpen size={24} className="flex-shrink-0" />
              </div>
              <div>
                <h3
                  className={`font-semibold mb-1 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Your Niyyah (Intention)
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Reflect on the spiritual and personal significance of your
                  union through these guided prompts.
                </p>
              </div>
            </div>

            <div
              className="mb-6 p-4 rounded-xl border-2"
              style={{
                background: darkMode
                  ? "rgba(116, 0, 21, 0.1)"
                  : "rgba(206, 128, 92, 0.1)",
                borderColor: darkMode
                  ? "rgba(116, 0, 21, 0.3)"
                  : "rgba(206, 128, 92, 0.3)",
              }}
            >
              <p
                className={`text-sm italic ${
                  darkMode ? "text-[#CE805C]" : "text-[#740015]"
                }`}
              >
                "And among His signs is that He created for you spouses from
                among yourselves so that you may find comfort in them. And He
                has placed between you compassion and mercy. Surely in this are
                signs for people who reflect." - Quran 30:21
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Main Niyyah */}
              <div className="lg:col-span-2">
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <Heart
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Your Primary Intention
                </label>
                <textarea
                  value={data?.niyyah || ""}
                  onChange={(e) => updateField("niyyah", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="What is your core intention for this marriage? What do you hope to build together?"
                />
              </div>

              {/* Spiritual Goals */}
              <div>
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <Sparkle
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Spiritual Goals
                </label>
                <textarea
                  value={data?.niyyahSpiritual || ""}
                  onChange={(e) =>
                    updateField("niyyahSpiritual", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="How will you grow together spiritually? What Islamic values will guide your marriage?"
                />
              </div>

              {/* Family Intentions */}
              <div>
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <Users
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Family & Community
                </label>
                <textarea
                  value={data?.niyyahFamily || ""}
                  onChange={(e) => updateField("niyyahFamily", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="What role will family play in your union? How will you serve your community together?"
                />
              </div>

              {/* Personal Growth */}
              <div>
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <Star
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Personal Growth
                </label>
                <textarea
                  value={data?.niyyahGrowth || ""}
                  onChange={(e) => updateField("niyyahGrowth", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="How will you support each other's personal development and dreams?"
                />
              </div>

              {/* Legacy */}
              <div>
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <Crown
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Legacy & Future
                </label>
                <textarea
                  value={data?.niyyahLegacy || ""}
                  onChange={(e) => updateField("niyyahLegacy", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="What legacy do you hope to leave? What impact do you want to make together?"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Vision Notes Tab */}
      {activeTab === "vision" && (
        <div className="space-y-6">
          <Card className="!p-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gradient-to-br from-[#740015] to-[#531946] text-white">
                <PencilLine size={24} className="flex-shrink-0" />
              </div>
              <div>
                <h3
                  className={`font-semibold mb-1 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Vision & Inspiration Notes
                </h3>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Capture your ideas, inspiration, and vision across different
                  aspects of your wedding day.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Overall Vision */}
              <div className="lg:col-span-2">
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <Sparkle
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Overall Vision & Atmosphere
                </label>
                <textarea
                  value={data?.visionNotes || ""}
                  onChange={(e) => updateField("visionNotes", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="Describe your ideal wedding day... What overall atmosphere and feeling do you want to create?"
                />
              </div>

              {/* Color & Decor */}
              <div>
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <Diamond
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Colors & Decor Style
                </label>
                <textarea
                  value={data?.visionColors || ""}
                  onChange={(e) => updateField("visionColors", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="What color palette inspires you? What decor style matches your vision?"
                />
              </div>

              {/* Attire & Fashion */}
              <div>
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <Crown
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Attire & Fashion Vision
                </label>
                <textarea
                  value={data?.visionAttire || ""}
                  onChange={(e) => updateField("visionAttire", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="What style of traditional or modern attire appeals to you? Any specific looks you admire?"
                />
              </div>

              {/* Special Moments */}
              <div>
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <Heart
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Must-Have Moments
                </label>
                <textarea
                  value={data?.visionMoments || ""}
                  onChange={(e) => updateField("visionMoments", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="What specific moments or experiences are most important to you on your wedding day?"
                />
              </div>

              {/* Cultural Elements */}
              <div>
                <label
                  className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  <BookOpen
                    size={18}
                    weight="bold"
                    className="inline mr-2 text-[#740015]"
                  />
                  Cultural & Traditional Elements
                </label>
                <textarea
                  value={data?.visionCultural || ""}
                  onChange={(e) =>
                    updateField("visionCultural", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="Which Hausa traditions are essential to include? Any modern twists on traditions?"
                />
              </div>
            </div>
          </Card>

          {/* Recommendations Based on Vision Result */}
          {visionDetails && (
            <Card className="!p-6">
              <h3
                className={`font-semibold mb-4 flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <Sparkle size={20} weight="bold" className="text-[#740015]" />
                Recommendations for Your {visionDetails.title}
              </h3>

              <ul className="space-y-3">
                {visionDetails.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      weight="fill"
                      className="text-[#740015] flex-shrink-0 mt-0.5"
                    />
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Custom Slider Styles */}
      <style jsx>{`
        .priority-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #740015 0%, #531946 100%);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(116, 0, 21, 0.4);
          transition: transform 0.15s ease;
        }

        .priority-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .priority-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #740015 0%, #531946 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(116, 0, 21, 0.4);
          transition: transform 0.15s ease;
        }

        .priority-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </motion.div>
  );
}
