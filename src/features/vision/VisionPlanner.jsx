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
  Question,
  Star,
  Palette,
  BookOpen,
  Lightbulb,
  Crown,
  Diamond,
  X,
} from "@phosphor-icons/react";
// Material UI Icons for vision styles and enhancements
import {
  EmojiEvents,
  AutoAwesome,
  Diamond as MuiDiamond,
  Favorite,
  CheckCircle as MuiCheckCircle,
  StarRate,
} from "@mui/icons-material";
import { Card, AnimatedCard, GradientHeader, Modal } from "../../components/ui";

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
  const [selectedValueInfo, setSelectedValueInfo] = useState(null);
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
        "How important is honoring Northern Nigerian traditions and customs in your wedding?",
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
      detailedDescription:
        "Center your wedding around faith-based principles, incorporating religious ceremonies, prayers, and spiritual guidance. This value emphasizes the sacred nature of marriage and seeking blessings from a higher power.",
      recommendations: [
        "Include Quranic recitations and Islamic ceremonies",
        "Seek blessings from religious leaders and elders",
        "Incorporate prayer times and spiritual moments",
        "Choose venues and vendors aligned with faith values",
      ],
      combinations: {
        family:
          "Create a spiritually-centered celebration that honors family traditions",
        tradition: "Blend religious practices with cultural customs seamlessly",
        simplicity:
          "Focus on meaningful spiritual moments over material displays",
      },
    },
    {
      value: "family",
      label: "Family Unity",
      icon: Users,
      description: "Bringing families together in celebration",
      detailedDescription:
        "Prioritize family involvement, unity, and bringing two families together. This value emphasizes the importance of familial bonds, respect for elders, and creating lasting family memories.",
      recommendations: [
        "Involve both families in planning and ceremonies",
        "Honor parents and elders with special roles",
        "Create opportunities for families to bond",
        "Include family traditions from both sides",
      ],
      combinations: {
        faith: "Build a strong spiritual foundation for your new family",
        tradition: "Honor family heritage through cultural customs",
        community: "Extend family warmth to your wider social circle",
      },
    },
    {
      value: "tradition",
      label: "Cultural Heritage",
      icon: Crown,
      description: "Honoring Northern Nigerian customs and traditions",
      detailedDescription:
        "Embrace and celebrate authentic Northern Nigerian wedding customs, from Kayan Lefe to traditional ceremonies. This value honors your cultural roots and preserves heritage for future generations.",
      recommendations: [
        "Include all traditional Northern Nigerian wedding ceremonies",
        "Present authentic Kayan Lefe collection",
        "Wear traditional Northern Nigerian attire and accessories",
        "Serve traditional Northern Nigerian cuisine",
      ],
      combinations: {
        faith: "Integrate religious and cultural practices harmoniously",
        family: "Pass down cultural traditions through family involvement",
        elegance: "Present traditions with refined, sophisticated styling",
      },
    },
    {
      value: "love",
      label: "Love & Romance",
      icon: Heart,
      description: "Celebrating your love story and connection",
      detailedDescription:
        "Put your unique love story at the center of your celebration. This value emphasizes romance, intimacy, and personalizing your wedding to reflect your relationship journey.",
      recommendations: [
        "Share your love story through decor and programs",
        "Include personal vows or meaningful exchanges",
        "Create intimate moments throughout the day",
        "Incorporate songs, quotes, or symbols meaningful to you",
      ],
      combinations: {
        joy: "Create a celebration overflowing with love and happiness",
        simplicity: "Focus on authentic connection over elaborate productions",
        elegance: "Express your love through refined, romantic aesthetics",
      },
    },
    {
      value: "community",
      label: "Community & Friends",
      icon: Users,
      description: "Sharing joy with your wider community",
      detailedDescription:
        "Celebrate with your extended community of friends, neighbors, and social network. This value emphasizes inclusivity, hospitality, and creating a warm, welcoming atmosphere for all guests.",
      recommendations: [
        "Invite a wider circle of friends and community",
        "Create interactive, engaging activities for guests",
        "Ensure warm hospitality and guest comfort",
        "Include community traditions and celebrations",
      ],
      combinations: {
        family: "Unite family and community in joyful celebration",
        joy: "Share infectious happiness with everyone present",
        tradition: "Invite community to witness cultural traditions",
      },
    },
    {
      value: "simplicity",
      label: "Simplicity & Mindfulness",
      icon: Sparkle,
      description: "Meaningful moments over extravagance",
      detailedDescription:
        "Focus on what truly matters—the commitment, relationships, and meaningful moments rather than elaborate displays. This value emphasizes mindfulness, intentionality, and authentic experiences.",
      recommendations: [
        "Choose quality over quantity in all decisions",
        "Create intimate, meaningful ceremony moments",
        "Minimize unnecessary expenses and complications",
        "Focus on experiences that create lasting memories",
      ],
      combinations: {
        faith: "Emphasize spiritual depth over material displays",
        love: "Highlight the authentic connection between you",
        elegance: "Achieve sophisticated beauty through minimalism",
      },
    },
    {
      value: "joy",
      label: "Joy & Celebration",
      icon: Sparkle,
      description: "Creating unforgettable happy memories",
      detailedDescription:
        "Prioritize fun, happiness, and creating an energetic, celebratory atmosphere. This value emphasizes entertainment, laughter, and ensuring everyone has an amazing time.",
      recommendations: [
        "Include lively entertainment and music",
        "Plan interactive activities and surprises",
        "Create photo-worthy, joyful moments",
        "Ensure upbeat energy throughout events",
      ],
      combinations: {
        community: "Spread joy across your entire guest community",
        love: "Celebrate your love with unbridled happiness",
        tradition: "Present cultural traditions with vibrant energy",
      },
    },
    {
      value: "elegance",
      label: "Elegance & Beauty",
      icon: Diamond,
      description: "Refined aesthetics and sophisticated style",
      detailedDescription:
        "Create a visually stunning wedding with refined aesthetics, sophisticated details, and elevated style. This value emphasizes beauty, artistry, and creating an Instagram-worthy celebration.",
      recommendations: [
        "Invest in high-quality decor and floral design",
        "Choose elegant color palettes and styling",
        "Hire professional photographers and videographers",
        "Pay attention to every aesthetic detail",
      ],
      combinations: {
        tradition: "Present cultural elements with refined elegance",
        simplicity: "Achieve sophisticated beauty through minimalism",
        love: "Express romance through beautiful, elegant details",
      },
    },
  ];

  const selectedValues = data?.coreValues || [];

  const toggleValue = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    updateField("coreValues", newValues);
  };

  // Get personalized recommendations based on selected values
  const getPersonalizedRecommendations = () => {
    if (selectedValues.length === 0) return null;

    const recommendations = new Set();
    selectedValues.forEach((valueKey) => {
      const valueOption = coreValuesOptions.find(
        (opt) => opt.value === valueKey
      );
      if (valueOption?.recommendations) {
        valueOption.recommendations.forEach((rec) => recommendations.add(rec));
      }
    });

    return Array.from(recommendations);
  };

  // Get value combination insights
  const getValueCombinationInsights = () => {
    if (selectedValues.length < 2) return [];

    const insights = [];
    const processedPairs = new Set();

    selectedValues.forEach((value1) => {
      selectedValues.forEach((value2) => {
        if (value1 !== value2) {
          const pairKey = [value1, value2].sort().join("-");
          if (!processedPairs.has(pairKey)) {
            processedPairs.add(pairKey);

            const option1 = coreValuesOptions.find(
              (opt) => opt.value === value1
            );
            const option2 = coreValuesOptions.find(
              (opt) => opt.value === value2
            );

            if (option1?.combinations?.[value2]) {
              insights.push({
                value1: option1.label,
                value2: option2.label,
                insight: option1.combinations[value2],
                icon1: option1.icon,
                icon2: option2.icon,
              });
            } else if (option2?.combinations?.[value1]) {
              insights.push({
                value1: option2.label,
                value2: option1.label,
                insight: option2.combinations[value1],
                icon1: option2.icon,
                icon2: option1.icon,
              });
            }
          }
        }
      });
    });

    return insights;
  };

  const personalizedRecommendations = getPersonalizedRecommendations();
  const combinationInsights = getValueCombinationInsights();

  // Get vision result details with Phosphor icons
  const getVisionDetails = () => {
    const result = data?.visionResult;
    if (!result) return null;

    const details = {
      traditional: {
        title: "Traditional Northern Nigerian Wedding",
        description:
          "Your wedding will honor authentic Northern Nigerian customs with full traditional ceremonies, attire, and cultural elements.",
        icon: Crown,
        color: "from-[#740015] to-[#531946]",
        recommendations: [
          "Complete Kayan Lefe collection",
          "Traditional Fatiha, Kamu, and Walima ceremonies",
          "Full Northern attire for all events",
          "Traditional music and entertainment",
          "Northern cuisine menu",
        ],
      },
      fusion: {
        title: "Fusion Wedding Style",
        description:
          "You'll blend cherished Northern Nigerian traditions with modern elements for a unique celebration that honors both heritage and contemporary style.",
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
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    {/* Info Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedValueInfo(option);
                      }}
                      className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                        darkMode
                          ? "border-[#CE805C] text-[#CE805C] hover:bg-[#CE805C] hover:text-white"
                          : "border-[#740015] text-[#740015] hover:bg-[#740015] hover:text-white"
                      }`}
                      title="More info"
                    >
                      <Question size={16} weight="bold" />
                    </motion.button>

                    {/* Value Card */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleValue(option.value)}
                      className={`w-full group p-5 rounded-2xl border-2 transition-all text-left ${
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

                        <div className="flex-1 min-w-0 pr-6">
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
                  </motion.div>
                );
              })}
            </div>

            {selectedValues.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-6"
              >
                {/* Selected Values Summary with Progress */}
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: darkMode
                      ? "rgba(116, 0, 21, 0.1)"
                      : "rgba(206, 128, 92, 0.1)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Selected Values ({selectedValues.length}/
                      {coreValuesOptions.length})
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(selectedValues.length / coreValuesOptions.length) * 100}%`,
                          }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, #740015 0%, #531946 100%)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
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
                </div>

                {/* Value Combination Insights */}
                {combinationInsights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`p-5 rounded-xl border-2 ${
                      darkMode
                        ? "bg-gray-800/50 border-[#CE805C]/30"
                        : "bg-white border-[#CE805C]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb
                        size={20}
                        weight="bold"
                        className="text-[#CE805C]"
                      />
                      <h4
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Value Combination Insights
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {combinationInsights.slice(0, 3).map((insight, index) => {
                        const Icon1 = insight.icon1;
                        const Icon2 = insight.icon2;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className={`p-3 rounded-lg ${
                              darkMode ? "bg-gray-700/50" : "bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #740015 0%, #531946 100%)",
                                  }}
                                >
                                  <Icon1 size={16} weight="bold" />
                                </div>
                                <span className="text-gray-400">+</span>
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #740015 0%, #531946 100%)",
                                  }}
                                >
                                  <Icon2 size={16} weight="bold" />
                                </div>
                              </div>
                              <p
                                className={`text-sm leading-relaxed ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                <span className="font-medium text-[#CE805C]">
                                  {insight.value1} + {insight.value2}:
                                </span>{" "}
                                {insight.insight}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Personalized Recommendations */}
                {personalizedRecommendations && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`p-5 rounded-xl border-2 ${
                      darkMode
                        ? "bg-gray-800/50 border-[#740015]/30"
                        : "bg-white border-[#740015]/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Star
                        size={20}
                        weight="bold"
                        className="text-[#740015]"
                      />
                      <h4
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Personalized Recommendations
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {personalizedRecommendations
                        .slice(0, 6)
                        .map((recommendation, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * index }}
                            className={`p-3 rounded-lg flex items-start gap-2 ${
                              darkMode ? "bg-gray-700/50" : "bg-gray-50"
                            }`}
                          >
                            <CheckCircle
                              size={18}
                              weight="fill"
                              className="text-[#740015] flex-shrink-0 mt-0.5"
                            />
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {recommendation}
                            </p>
                          </motion.div>
                        ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </Card>

          {/* Value Info Modal */}
          {selectedValueInfo && (
            <Modal
              isOpen={selectedValueInfo !== null}
              onClose={() => setSelectedValueInfo(null)}
              title={selectedValueInfo.label}
              darkMode={darkMode}
              size="md"
            >
              <div className="space-y-4 max-h-[75vh] overflow-y-auto p-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #740015 0%, #531946 100%)",
                    }}
                  >
                    {selectedValueInfo.icon && (
                      <selectedValueInfo.icon size={32} weight="bold" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-xl font-bold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedValueInfo.label}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedValueInfo.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4
                    className={`font-bold mb-3 text-base ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    What This Means
                  </h4>
                  <p
                    className={`text-sm leading-relaxed ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {selectedValueInfo.detailedDescription}
                  </p>
                </div>

                {selectedValueInfo.recommendations &&
                  selectedValueInfo.recommendations.length > 0 && (
                    <div className="pt-2">
                      <h4
                        className={`font-bold mb-3 text-base ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Recommendations
                      </h4>
                      <div className="space-y-2">
                        {selectedValueInfo.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              darkMode ? "bg-gray-700/50" : "bg-gray-50"
                            }`}
                          >
                            <CheckCircle
                              size={18}
                              weight="fill"
                              className="text-[#740015] flex-shrink-0 mt-0.5"
                            />
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {rec}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="pt-3 pb-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      toggleValue(selectedValueInfo.value);
                      setSelectedValueInfo(null);
                    }}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                      selectedValues.includes(selectedValueInfo.value)
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "hover:opacity-90"
                    }`}
                    style={
                      !selectedValues.includes(selectedValueInfo.value)
                        ? {
                            background:
                              "linear-gradient(135deg, #740015 0%, #531946 100%)",
                          }
                        : {}
                    }
                  >
                    {selectedValues.includes(selectedValueInfo.value)
                      ? "Remove from Selection"
                      : "Add to My Values"}
                  </motion.button>
                </div>
              </div>
            </Modal>
          )}
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
                "Marriage is a partnership of equals, built on mutual respect,
                trust, and shared dreams. Take time to reflect on what you hope
                to create together as you begin this journey."
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Main Niyyah */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Heart
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Your Primary Intention
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "niyyah",
                        "To build a loving partnership rooted in mutual respect, understanding, and shared values. We aim to support each other's growth while creating a home filled with warmth, joy, and purpose."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Sparkle
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Spiritual & Faith Goals
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "niyyahSpiritual",
                        "We will grow together in our faith, support each other's spiritual journey, and build a home where our beliefs and values are honored and lived daily."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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
                  placeholder="How will you grow together spiritually? What values and beliefs will guide your marriage?"
                />
              </div>

              {/* Family Intentions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Users
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Family & Community
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "niyyahFamily",
                        "We will honor both our families, build strong relationships with our extended family, and actively contribute to our community's wellbeing."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Star
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Personal Growth
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "niyyahGrowth",
                        "We commit to encouraging each other's ambitions, celebrating individual achievements, and creating space for both personal and shared growth throughout our marriage."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Crown
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Legacy & Future
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "niyyahLegacy",
                        "We aspire to build a lasting legacy of love, integrity, and positive impact—creating a family that future generations will be proud of."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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

              {/* Communication & Conflict */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Users
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Communication & Conflict Resolution
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "niyyahCommunication",
                        "We will prioritize open, honest communication, listen with empathy, and resolve conflicts with patience and understanding rather than anger."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
                <textarea
                  value={data?.niyyahCommunication || ""}
                  onChange={(e) =>
                    updateField("niyyahCommunication", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="How will you communicate effectively? How will you handle disagreements?"
                />
              </div>

              {/* Daily Life & Partnership */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Heart
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Daily Life & Partnership
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "niyyahDaily",
                        "In our daily life, we will be true partners—sharing responsibilities, celebrating small moments, and building rituals that strengthen our bond."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
                <textarea
                  value={data?.niyyahDaily || ""}
                  onChange={(e) => updateField("niyyahDaily", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="How will you navigate daily life together? What kind of partnership do you envision?"
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
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Sparkle
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Overall Vision & Atmosphere
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "visionNotes",
                        "We envision a warm, joyful celebration that blends elegance with authentic cultural heritage—creating an atmosphere where every guest feels the love and significance of this union."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Diamond
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Colors & Decor Style
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "visionColors",
                        "Rich burgundy, gold, and cream tones with elegant floral arrangements and traditional textile accents. Modern minimalist touches balanced with cultural ornaments."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Crown
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Attire & Fashion Vision
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "visionAttire",
                        "Traditional Northern Nigerian bridal attire with contemporary embellishments. Multiple outfit changes showcasing both heritage and modern style—incorporating handcrafted fabrics and beadwork."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Heart
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Must-Have Moments
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "visionMoments",
                        "The first look, meaningful vows, cultural dances, heartfelt toasts from family, and creating space for intimate moments amidst the celebration."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <BookOpen
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Cultural & Traditional Elements
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "visionCultural",
                        "Incorporate Kayan Lefe presentation, traditional henna art, live cultural music, and blessing ceremonies while making them accessible and meaningful for all guests."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
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
                  placeholder="Which Northern Nigerian traditions are essential to include? Any modern twists on traditions?"
                />
              </div>

              {/* Entertainment & Music */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Sparkle
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Entertainment & Music
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "visionEntertainment",
                        "Live traditional drummers and dancers, DJ for contemporary music, and special performances that honor our heritage while keeping the energy vibrant and celebratory."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
                <textarea
                  value={data?.visionEntertainment || ""}
                  onChange={(e) =>
                    updateField("visionEntertainment", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="What type of entertainment and music will create the perfect atmosphere?"
                />
              </div>

              {/* Food & Hospitality */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`block font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    <Heart
                      size={18}
                      weight="bold"
                      className="inline mr-2 text-[#740015]"
                    />
                    Food & Hospitality
                  </label>
                  <button
                    onClick={() =>
                      updateField(
                        "visionFood",
                        "A feast of authentic Northern Nigerian cuisine alongside international dishes, beautifully presented with warm hospitality that makes every guest feel honored and welcomed."
                      )
                    }
                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                      darkMode
                        ? "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    + Template
                  </button>
                </div>
                <textarea
                  value={data?.visionFood || ""}
                  onChange={(e) => updateField("visionFood", e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 resize-none ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-[#CE805C] focus:border-[#CE805C]"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-[#740015] focus:border-[#740015]"
                  }`}
                  placeholder="What culinary experience do you want to offer? How will you show hospitality?"
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
