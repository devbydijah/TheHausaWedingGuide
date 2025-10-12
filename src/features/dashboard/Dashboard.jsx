import { Card, Button } from "../../components/ui";
import QuickStats from "./QuickStats";
import {
  DiamondsFour,
  Sparkle,
  CurrencyCircleDollar,
  Storefront,
  CalendarCheck,
  ClipboardText,
  Calendar,
  CheckCircle,
  Wallet,
} from "@phosphor-icons/react";

/**
 * Dashboard Component
 *
 * Main landing page showing overview of wedding planning progress
 */
export default function Dashboard({
  data,
  setActiveSection,
  darkMode = false,
}) {
  // Calculate wedding countdown
  const weddingDate = data.weddingDate ? new Date(data.weddingDate) : null;
  const today = new Date();
  const daysUntilWedding = weddingDate
    ? Math.ceil((weddingDate - today) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate statistics for quick actions
  const budgetTotal = data.totalBudget || 0;
  const totalVendors = data.vendorList?.length || 0;
  const totalTasks = data.taskList?.length || 0;

  // Section navigation cards
  const sectionCards = [
    {
      id: "quiz",
      name: "Vision Quiz",
      icon: DiamondsFour,
      iconColor: "#FFFFFF",
      bgGradient: "from-[#531946] to-[#740015]",
      accentShape: "star", // Star burst for discovery
      description: "Discover your wedding style with our quiz",
      stats: data.visionQuiz?.result
        ? `${data.visionQuiz.result.title}`
        : "Not taken",
    },
    {
      id: "vision",
      name: "Vision & Values",
      icon: Sparkle,
      iconColor: "#FFFFFF",
      bgGradient: "from-[#CE805C] to-[#B87050]",
      accentShape: "diamond", // Diamond for values
      description: "Define your wedding priorities and intentions",
      stats: data.priorities
        ? `${Object.keys(data.priorities).length} priorities set`
        : "Not set",
    },
    {
      id: "budget",
      name: "Budget Builder",
      icon: CurrencyCircleDollar,
      iconColor: "#FFFFFF",
      bgGradient: "from-[#740015] to-[#531946]",
      accentShape: "coins", // Stacked circles for budget
      description: "Plan and track your wedding expenses",
      stats:
        budgetTotal > 0
          ? `₦${(budgetTotal / 1000000).toFixed(1)}M total`
          : "Not set",
    },
    {
      id: "vendors",
      name: "Vendor Tracker",
      icon: Storefront,
      iconColor: "#FFFFFF",
      bgGradient: "from-[#B87050] to-[#CE805C]",
      accentShape: "grid", // Grid for multiple vendors
      description: "Manage your wedding service providers",
      stats: `${data.vendorList?.filter((v) => v.status === "Booked").length || 0}/${totalVendors} booked`,
    },
    {
      id: "timeline",
      name: "Timeline & Tasks",
      icon: CalendarCheck,
      iconColor: "#FFFFFF",
      bgGradient: "from-[#531946] to-[#CE805C]",
      accentShape: "bars", // Progress bars for tasks
      description: "Organize tasks and track deadlines",
      stats: `${data.taskList?.filter((t) => t.status === "Completed").length || 0}/${totalTasks} completed`,
    },
    {
      id: "blueprint",
      name: "Final Blueprint",
      icon: ClipboardText,
      iconColor: "#FFFFFF",
      bgGradient: "from-[#740015] to-[#B87050]",
      accentShape: "checkmarks", // Checkmarks for completion
      description: "Review your complete wedding plan",
      stats: `${Math.round(
        ((Object.values(data.budgetCategories || {}).reduce(
          (sum, cat) => sum + (cat.amount || 0),
          0
        ) /
          (budgetTotal || 1)) *
          100 +
          ((data.vendorList?.filter((v) => v.status === "Booked").length || 0) /
            (totalVendors || 1)) *
            100 +
          ((data.taskList?.filter((t) => t.status === "Completed").length ||
            0) /
            (totalTasks || 1)) *
            100) /
          3
      )}% complete`,
    },
  ];

  const isEmptyState =
    !weddingDate && totalVendors === 0 && totalTasks === 0 && budgetTotal === 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#CE805C] to-[#b86a4a] rounded-xl p-6 sm:p-8 text-white">
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Welcome to Your Hausa Wedding Guide
        </h1>
        <p className="font-inter text-base sm:text-lg md:text-xl opacity-90">
          Your personalized planning dashboard for a beautiful and blessed
          celebration
        </p>
      </div>

      {/* Wedding Countdown Card */}
      {weddingDate && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="font-playfair text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-1">
                Wedding Countdown
              </h2>
              <p className="font-inter text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {weddingDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#CE805C]">
                {daysUntilWedding > 0 ? daysUntilWedding : 0}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                {daysUntilWedding > 0
                  ? "days to go"
                  : daysUntilWedding === 0
                    ? "Today!"
                    : "days ago"}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats Grid */}
      <QuickStats data={data} darkMode={darkMode} />

      {/* Section Navigation */}
      <div>
        <h2 className="font-playfair text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Planning Sections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sectionCards.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/60 dark:border-gray-700/60 p-7 text-left overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(206,128,92,0.3)] hover:border-[#CE805C]/30 hover:-translate-y-2 hover:scale-[1.02]"
              >
                {/* Gradient Background Overlay - Brand Colors */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${section.bgGradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`}
                />

                {/* Content Wrapper */}
                <div className="relative z-10">
                  {/* Icon with Brand Color Background */}
                  <div className="mb-5 relative">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${section.bgGradient} shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl group-hover:shadow-[#CE805C]/20`}
                    >
                      <IconComponent
                        size={40}
                        weight="duotone"
                        className="text-white"
                      />
                    </div>

                    {/* Decorative Pulse Ring - Brand Color */}
                    <div
                      className={`absolute inset-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${section.bgGradient} opacity-20 group-hover:scale-125 group-hover:opacity-0 transition-all duration-700`}
                    />
                  </div>

                  {/* Stats Badge - Top Right with Brand Colors */}
                  <div className="absolute top-7 right-7">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                        section.stats.includes("Not") ||
                        section.stats.includes("0/") ||
                        section.stats.includes("0 p")
                          ? "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                          : "bg-[#CE805C]/10 dark:bg-[#CE805C]/20 text-[#740015] dark:text-[#CE805C]"
                      } group-hover:scale-105`}
                    >
                      {section.stats}
                    </span>
                  </div>

                  {/* Title with Brand Color Gradient */}
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#740015] group-hover:to-[#CE805C]">
                    {section.name}
                  </h3>

                  {/* Description */}
                  <p className="font-inter text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {section.description}
                  </p>

                  {/* Action Indicator - Brand Color */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-gray-500 group-hover:text-[#CE805C] transition-colors duration-300">
                    <span>Explore</span>
                    <svg
                      className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>

                  {/* Contextual Corner Accent - Geometric Shapes per Section */}
                  <div className="absolute bottom-0 right-0 w-48 h-48 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                    {section.accentShape === "star" && (
                      // Star burst for Vision Quiz - Only quarter visible
                      <svg
                        viewBox="0 0 64 64"
                        className={`w-full h-full text-[#531946] opacity-25 translate-x-24 translate-y-24`}
                      >
                        <path
                          fill="currentColor"
                          d="M32 5L40.24 22.03L59 24.72L45.5 37.71L48.48 56.38L32 47.39L15.52 56.38L18.5 37.71L5 24.72L23.76 22.03L32 5Z"
                        />
                      </svg>
                    )}
                    {section.accentShape === "diamond" && (
                      // Diamond for Vision & Values - Only quarter visible
                      <svg
                        viewBox="0 0 64 64"
                        className={`w-full h-full text-[#CE805C] opacity-25 translate-x-24 translate-y-24`}
                      >
                        <path
                          fill="currentColor"
                          d="M32 5L5 19L32 59L59 19L32 5M32 17L43 24L32 49L21 24L32 17Z"
                        />
                      </svg>
                    )}
                    {section.accentShape === "coins" && (
                      // Stacked circles for Budget - Only quarter visible
                      <svg
                        viewBox="0 0 64 64"
                        className={`w-full h-full text-[#740015] opacity-25 translate-x-24 translate-y-24`}
                      >
                        <circle cx="24" cy="24" r="18" fill="currentColor" />
                        <circle
                          cx="40"
                          cy="40"
                          r="18"
                          fill="currentColor"
                          opacity="0.6"
                        />
                      </svg>
                    )}
                    {section.accentShape === "grid" && (
                      // Grid for Vendors - Only quarter visible
                      <svg
                        viewBox="0 0 64 64"
                        className={`w-full h-full text-[#B87050] opacity-25 translate-x-24 translate-y-24`}
                      >
                        <rect
                          x="8"
                          y="8"
                          width="22"
                          height="22"
                          rx="3"
                          fill="currentColor"
                        />
                        <rect
                          x="34"
                          y="8"
                          width="22"
                          height="22"
                          rx="3"
                          fill="currentColor"
                        />
                        <rect
                          x="8"
                          y="34"
                          width="22"
                          height="22"
                          rx="2"
                          fill="currentColor"
                        />
                        <rect
                          x="26"
                          y="26"
                          width="16"
                          height="16"
                          rx="2"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    {section.accentShape === "bars" && (
                      // Progress bars for Timeline - Only quarter visible
                      <svg
                        viewBox="0 0 64 64"
                        className={`w-full h-full text-[#531946] opacity-25 translate-x-24 translate-y-24`}
                      >
                        <rect
                          x="8"
                          y="10"
                          width="48"
                          height="8"
                          rx="4"
                          fill="currentColor"
                        />
                        <rect
                          x="8"
                          y="26"
                          width="38"
                          height="8"
                          rx="4"
                          fill="currentColor"
                          opacity="0.7"
                        />
                        <rect
                          x="8"
                          y="42"
                          width="28"
                          height="8"
                          rx="4"
                          fill="currentColor"
                          opacity="0.4"
                        />
                      </svg>
                    )}
                    {section.accentShape === "checkmarks" && (
                      // Checkmarks for Blueprint - Only quarter visible
                      <svg
                        viewBox="0 0 64 64"
                        className={`w-full h-full text-[#740015] opacity-25 translate-x-24 translate-y-24`}
                      >
                        <path
                          fill="currentColor"
                          strokeWidth="2.5"
                          d="M24 43.12L12.88 32l-3.78 3.76L24 50.67 56 18.67l-3.76-3.76L24 43.12z"
                        />
                        <path
                          fill="currentColor"
                          strokeWidth="2.5"
                          d="M24 27.12L18.22 21.34l-3.78 3.76L24 34.67 45.34 13.34l-3.76-3.76L24 27.12z"
                          opacity="0.5"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      {!isEmptyState && (
        <Card title="Quick Actions" className="p-6">
          <div className="flex flex-wrap gap-3">
            {!weddingDate && (
              <Button
                onClick={() => setActiveSection("timeline")}
                variant="primary"
                size="sm"
              >
                <Calendar size={16} weight="bold" className="inline mr-1" />
                Set Wedding Date
              </Button>
            )}
            {totalVendors === 0 && (
              <Button
                onClick={() => setActiveSection("vendors")}
                variant="secondary"
                size="sm"
              >
                <Storefront size={16} weight="bold" className="inline mr-1" />
                Add First Vendor
              </Button>
            )}
            {totalTasks === 0 && (
              <Button
                onClick={() => setActiveSection("timeline")}
                variant="secondary"
                size="sm"
              >
                <CheckCircle size={16} weight="bold" className="inline mr-1" />
                Create First Task
              </Button>
            )}
            {budgetTotal === 0 && (
              <Button
                onClick={() => setActiveSection("budget")}
                variant="secondary"
                size="sm"
              >
                <Wallet size={16} weight="bold" className="inline mr-1" />
                Set Budget
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Getting Started Guide (for empty state) */}
      {isEmptyState && (
        <div className="relative bg-gradient-to-br from-[#CE805C]/5 via-white to-[#531946]/5 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 rounded-3xl border-2 border-[#CE805C]/20 dark:border-gray-700 p-6 sm:p-8 overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#740015]/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#531946]/5 to-transparent rounded-full blur-2xl" />

          <div className="relative z-10">
            {/* Header with Brand Icon */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CE805C] to-[#B87050] flex items-center justify-center shadow-lg">
                <Sparkle size={24} weight="duotone" className="text-white" />
              </div>
              <h2 className="font-playfair text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent">
                Let's Get Started!
              </h2>
            </div>

            {/* Welcome Text */}
            <p className="font-inter text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Welcome to your wedding planning journey! Here are the recommended
              steps to begin:
            </p>

            {/* Steps in Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="group flex items-start gap-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#CE805C]/30 hover:shadow-md transition-all duration-300">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#740015] to-[#531946] text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                  1
                </span>
                <div className="flex-1">
                  <strong className="font-inter text-sm font-bold text-gray-900 dark:text-white block mb-1">
                    Define Your Vision
                  </strong>
                  <p className="font-inter text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Set priorities and write your niyyah (intention)
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#CE805C]/30 hover:shadow-md transition-all duration-300">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#CE805C] to-[#B87050] text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                  2
                </span>
                <div className="flex-1">
                  <strong className="font-inter text-sm font-bold text-gray-900 dark:text-white block mb-1">
                    Set Your Budget
                  </strong>
                  <p className="font-inter text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Establish total budget and allocate funds
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#CE805C]/30 hover:shadow-md transition-all duration-300">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#531946] to-[#740015] text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                  3
                </span>
                <div className="flex-1">
                  <strong className="font-inter text-sm font-bold text-gray-900 dark:text-white block mb-1">
                    Choose Wedding Date
                  </strong>
                  <p className="font-inter text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Pick your special day to start the countdown
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#CE805C]/30 hover:shadow-md transition-all duration-300">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#B87050] to-[#CE805C] text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md">
                  4
                </span>
                <div className="flex-1">
                  <strong className="font-inter text-sm font-bold text-gray-900 dark:text-white block mb-1">
                    Track Vendors & Tasks
                  </strong>
                  <p className="font-inter text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Add vendors and create tasks to stay organized
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons with Brand Colors */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setActiveSection("quiz")}
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#740015] to-[#531946] hover:from-[#531946] hover:to-[#740015] text-white font-semibold text-sm rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <DiamondsFour size={18} weight="duotone" />
                <span>Take Vision Quiz</span>
              </button>
              <button
                onClick={() => setActiveSection("vision")}
                className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border-2 border-[#CE805C] text-[#740015] dark:text-[#CE805C] font-semibold text-sm rounded-xl hover:bg-[#CE805C] hover:text-white dark:hover:bg-[#CE805C] shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <span>Start with Vision & Values</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
