import { useState, useMemo } from "react";
import {
  ClipboardText,
  DiamondsFour,
  CurrencyCircleDollar,
  Storefront,
  CalendarCheck,
  DownloadSimple,
  Printer,
  CheckCircle,
  Warning,
  Info,
  Sparkle,
  ChartPieSlice,
  ListChecks,
  Clock,
  Diamond,
  Crown,
  CalendarBlank,
} from "@phosphor-icons/react";
// Material UI Icons for enhanced blueprint
import {
  VerifiedUser,
  Assessment,
  TrendingUp,
  Download,
  Print,
  EmojiEvents,
  AutoAwesome,
  Diamond as MuiDiamond,
} from "@mui/icons-material";
import { Card } from "../../components/ui";
import {
  BUDGET_CATEGORIES,
  VENDOR_STATUS,
  TASK_STATUS,
} from "../../lib/constants";
import { generatePersonalizedPDF } from "../../components/PersonalizedPDFExport";

/**
 * FinalBlueprint Component
 *
 * Comprehensive overview of all wedding plans with export capabilities
 */
export default function FinalBlueprint({
  data,
  setActiveSection,
  darkMode,
  userData,
  userEmail,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPrintView, setShowPrintView] = useState(false);

  // Calculate completion statistics
  const completionStats = useMemo(() => {
    // Vision Quiz
    const hasVisionResult = !!data?.visionResult;

    // Budget
    const totalBudget = data?.totalBudget || 0;
    const budgetCategories = data?.budgetCategories || {};
    const budgetAllocated = Object.values(budgetCategories).reduce(
      (sum, cat) => sum + (parseFloat(cat.percentage) || 0),
      0
    );
    const hasBudget = totalBudget > 0 && budgetAllocated > 0;

    // Vendors
    const vendors = data?.vendorList || [];
    const bookedVendors = vendors.filter(
      (v) =>
        v.status === "Booked" ||
        v.status === "Deposit Paid" ||
        v.status === "Confirmed"
    ).length;
    const hasVendors = vendors.length > 0;

    // Timeline
    const tasks = data?.taskList || [];
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const hasTasks = tasks.length > 0;
    const weddingDate = data?.weddingDate;

    // Overall completion
    const sectionsComplete = [
      hasVisionResult,
      hasBudget,
      hasVendors,
      hasTasks && weddingDate,
    ].filter(Boolean).length;
    const overallProgress = Math.round((sectionsComplete / 4) * 100);

    return {
      hasVisionResult,
      hasBudget,
      hasVendors,
      hasTasks,
      weddingDate,
      vendors,
      bookedVendors,
      tasks,
      completedTasks,
      totalBudget,
      budgetAllocated,
      sectionsComplete,
      overallProgress,
    };
  }, [data]);

  // Get wedding countdown
  const getCountdown = () => {
    if (!completionStats.weddingDate) return null;

    const wedding = new Date(completionStats.weddingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    wedding.setHours(0, 0, 0, 0);

    const diffTime = wedding - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { days: Math.abs(diffDays), isPast: true };
    if (diffDays === 0) return { days: 0, isToday: true };
    return { days: diffDays, isFuture: true };
  };

  const countdown = getCountdown();

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle PDF export with personalized data
  const handleExport = () => {
    try {
      console.log("🎉 Generating PDF with data:", data);
      generatePersonalizedPDF(data, {
        brideName: userData?.brideName || "Bride",
        email: userEmail || "your-email@example.com",
        weddingDate: userData?.weddingDate || data?.weddingDate || "TBD",
      });
      console.log("✅ PDF generation complete!");
    } catch (error) {
      console.error("❌ PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Get vision result details
  const getVisionDetails = () => {
    const result = data?.visionResult;
    if (!result) return null;

    const details = {
      traditional: {
        title: "Traditional Northern Nigerian Wedding",
        description:
          "Your wedding will honor authentic Northern Nigerian customs with full traditional ceremonies, attire, and cultural elements.",
        icon: <EmojiEvents sx={{ fontSize: 64 }} />,
        color: "from-[#CE805C] to-[#B87050]",
      },
      fusion: {
        title: "Fusion Wedding Style",
        description:
          "You'll blend cherished Northern Nigerian traditions with modern elements for a unique celebration that honors both heritage and contemporary style.",
        icon: <AutoAwesome sx={{ fontSize: 64 }} />,
        color: "from-[#531946] to-[#740015]",
      },
      modern: {
        title: "Modern Contemporary Wedding",
        description:
          "Your wedding will feature a contemporary approach with minimalist elegance and Western influences while respecting cultural significance.",
        icon: <MuiDiamond sx={{ fontSize: 64 }} />,
        color: "from-[#740015] to-[#531946]",
      },
    };

    return details[result] || null;
  };

  const visionDetails = getVisionDetails();

  return (
    <div className="space-y-6 print:block">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#531946] to-[#740015] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center">
          <ClipboardText
            size={72}
            weight="duotone"
            className="mx-auto mb-4"
            aria-hidden="true"
          />
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold mb-3">
            Final Blueprint
          </h1>
          <p className="font-inter text-lg opacity-90">
            Your complete wedding plan at a glance
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <Card className="!p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-playfair text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent">
            Planning Progress
          </h2>
          <span className="font-inter text-3xl font-bold text-[#CE805C]">
            {completionStats.overallProgress}%
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 mb-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#CE805C] to-[#B87050] transition-all duration-500 rounded-full flex items-center justify-center"
            style={{ width: `${completionStats.overallProgress}%` }}
          >
            {completionStats.overallProgress >= 20 && (
              <span className="text-sm font-bold text-white">
                {completionStats.sectionsComplete}/4 sections
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveSection("vision")}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 text-center ${
              completionStats.hasVisionResult
                ? "border-[#57886C] bg-[#57886C]/10 dark:bg-[#57886C]/20"
                : "border-gray-300 dark:border-gray-600 hover:border-[#CE805C]"
            }`}
          >
            <DiamondsFour
              size={32}
              weight="bold"
              className={`mx-auto mb-2 ${
                completionStats.hasVisionResult
                  ? "text-[#57886C] dark:text-[#57886C]"
                  : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
              }`}
            />
            <p
              className={`text-sm font-semibold ${
                completionStats.hasVisionResult
                  ? "text-[#57886C] dark:text-[#57886C]"
                  : darkMode
                    ? "text-gray-400"
                    : "text-gray-600"
              }`}
            >
              Vision
            </p>
            {completionStats.hasVisionResult && (
              <VerifiedUser
                sx={{ fontSize: 16 }}
                className="text-[#57886C] dark:text-[#57886C] mx-auto mt-1"
              />
            )}
          </button>

          <button
            onClick={() => setActiveSection("budget")}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 text-center ${
              completionStats.hasBudget
                ? "border-[#57886C] bg-[#57886C]/10 dark:bg-[#57886C]/20"
                : "border-gray-300 dark:border-gray-600 hover:border-[#CE805C]"
            }`}
          >
            <CurrencyCircleDollar
              size={32}
              weight="bold"
              className={`mx-auto mb-2 ${
                completionStats.hasBudget
                  ? "text-[#57886C] dark:text-[#57886C]"
                  : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
              }`}
            />
            <p
              className={`text-sm font-semibold ${
                completionStats.hasBudget
                  ? "text-[#57886C] dark:text-[#57886C]"
                  : darkMode
                    ? "text-gray-400"
                    : "text-gray-600"
              }`}
            >
              Budget
            </p>
            {completionStats.hasBudget && (
              <VerifiedUser
                sx={{ fontSize: 16 }}
                className="text-[#57886C] dark:text-[#57886C] mx-auto mt-1"
              />
            )}
          </button>

          <button
            onClick={() => setActiveSection("vendors")}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 text-center ${
              completionStats.hasVendors
                ? "border-[#57886C] bg-[#57886C]/10 dark:bg-[#57886C]/20"
                : "border-gray-300 dark:border-gray-600 hover:border-[#CE805C]"
            }`}
          >
            <Storefront
              size={32}
              weight="bold"
              className={`mx-auto mb-2 ${
                completionStats.hasVendors
                  ? "text-[#57886C] dark:text-[#57886C]"
                  : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
              }`}
            />
            <p
              className={`text-sm font-semibold ${
                completionStats.hasVendors
                  ? "text-[#57886C] dark:text-[#57886C]"
                  : darkMode
                    ? "text-gray-400"
                    : "text-gray-600"
              }`}
            >
              Vendors
            </p>
            {completionStats.hasVendors && (
              <VerifiedUser
                sx={{ fontSize: 16 }}
                className="text-[#57886C] dark:text-[#57886C] mx-auto mt-1"
              />
            )}
          </button>

          <button
            onClick={() => setActiveSection("timeline")}
            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 text-center ${
              completionStats.hasTasks && completionStats.weddingDate
                ? "border-[#57886C] bg-[#57886C]/10 dark:bg-[#57886C]/20"
                : "border-gray-300 dark:border-gray-600 hover:border-[#CE805C]"
            }`}
          >
            <CalendarCheck
              size={32}
              weight="bold"
              className={`mx-auto mb-2 ${
                completionStats.hasTasks && completionStats.weddingDate
                  ? "text-[#57886C] dark:text-[#57886C]"
                  : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
              }`}
            />
            <p
              className={`text-sm font-semibold ${
                completionStats.hasTasks && completionStats.weddingDate
                  ? "text-[#57886C] dark:text-[#57886C]"
                  : darkMode
                    ? "text-gray-400"
                    : "text-gray-600"
              }`}
            >
              Timeline
            </p>
            {completionStats.hasTasks && completionStats.weddingDate && (
              <VerifiedUser
                sx={{ fontSize: 16 }}
                className="text-[#57886C] dark:text-[#57886C] mx-auto mt-1"
              />
            )}
          </button>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CE805C]/50"
        >
          <Download sx={{ fontSize: 20 }} />
          Download Complete Wedding Plan (PDF)
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b-2 border-gray-200 dark:border-gray-700 print:hidden">
        <nav
          className="flex space-x-1 overflow-x-auto"
          aria-label="Blueprint sections"
        >
          {[
            { id: "overview", label: "Overview", icon: ListChecks },
            { id: "vision", label: "Vision", icon: Sparkle },
            { id: "budget", label: "Budget", icon: ChartPieSlice },
            { id: "vendors", label: "Vendors", icon: Storefront },
            { id: "timeline", label: "Timeline", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#CE805C] text-[#CE805C]"
                    : darkMode
                      ? "border-transparent text-gray-400 hover:text-gray-300"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon size={20} weight="bold" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Wedding Date & Countdown */}
          {countdown && (
            <Card className="!p-6 sm:!p-8 text-center bg-gradient-to-br from-[#CE805C]/10 to-[#B87050]/10 border-2 border-[#CE805C]/30">
              <div className="flex items-center justify-center gap-3 mb-3">
                <CalendarBlank
                  size={40}
                  weight="duotone"
                  className="text-[#CE805C]"
                />
                <div className="text-5xl sm:text-6xl font-bold">
                  {countdown.isToday ? (
                    <span className="bg-gradient-to-r from-[#740015] to-[#531946] bg-clip-text text-transparent">
                      Today!
                    </span>
                  ) : countdown.isPast ? (
                    <span
                      className={darkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      {countdown.days} days ago
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-[#CE805C] to-[#B87050] bg-clip-text text-transparent">
                      {countdown.days}
                    </span>
                  )}
                </div>
              </div>
              <p
                className={`font-inter text-base sm:text-lg mb-2 font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {countdown.isToday
                  ? "Your wedding day is here! Alhamdulillah!"
                  : countdown.isPast
                    ? "since your wedding"
                    : "days until your wedding"}
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {new Date(completionStats.weddingDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="!p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#531946]/10 dark:bg-[#531946]/30 rounded-lg">
                  <Sparkle
                    size={24}
                    weight="bold"
                    className="text-[#531946] dark:text-[#CE805C]"
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Wedding Style
                  </p>
                  <p
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {completionStats.hasVisionResult
                      ? data.visionResult.charAt(0).toUpperCase() +
                        data.visionResult.slice(1)
                      : "Not set"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="!p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#57886C]/10 dark:bg-[#57886C]/30 rounded-lg">
                  <CurrencyCircleDollar
                    size={24}
                    weight="bold"
                    className="text-[#57886C] dark:text-[#57886C]"
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Total Budget
                  </p>
                  <p
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {completionStats.totalBudget > 0
                      ? `₦${completionStats.totalBudget.toLocaleString()}`
                      : "Not set"}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="!p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#740015]/10 dark:bg-[#740015]/30 rounded-lg">
                  <Storefront
                    size={24}
                    weight="bold"
                    className="text-[#740015] dark:text-[#CE805C]"
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Vendors
                  </p>
                  <p
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {completionStats.bookedVendors}/
                    {completionStats.vendors.length} booked
                  </p>
                </div>
              </div>
            </Card>

            <Card className="!p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#CE805C]/10 dark:bg-[#CE805C]/30 rounded-lg">
                  <CalendarCheck
                    size={24}
                    weight="bold"
                    className="text-[#CE805C] dark:text-[#B87050]"
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Tasks
                  </p>
                  <p
                    className={`font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {completionStats.completedTasks}/
                    {completionStats.tasks.length} done
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Alerts */}
          <div className="space-y-3">
            {!completionStats.weddingDate && (
              <div className="bg-[#CE805C]/10 border-2 border-[#CE805C] dark:bg-[#CE805C]/20 dark:border-[#B87050] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Warning
                    size={24}
                    weight="bold"
                    className="text-[#CE805C] dark:text-[#B87050] flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-[#740015] dark:text-[#CE805C] mb-1">
                      Wedding Date Not Set
                    </p>
                    <p className="text-sm text-[#B87050] dark:text-[#CE805C]">
                      Set your wedding date in the Timeline section to unlock
                      countdown and task scheduling features.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!completionStats.hasBudget && (
              <div className="bg-[#531946]/10 border-2 border-[#531946] dark:bg-[#531946]/20 dark:border-[#740015] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info
                    size={24}
                    weight="bold"
                    className="text-[#531946] dark:text-[#CE805C] flex-shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-[#740015] dark:text-[#CE805C] mb-1">
                      Budget Planning Needed
                    </p>
                    <p className="text-sm text-[#531946] dark:text-[#B87050]">
                      Start your budget planning to track expenses and stay on
                      target.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {completionStats.vendors.length > 0 &&
              completionStats.bookedVendors === 0 && (
                <div className="bg-[#740015]/10 border-2 border-[#740015] dark:bg-[#740015]/20 dark:border-[#531946] rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info
                      size={24}
                      weight="bold"
                      className="text-[#740015] dark:text-[#CE805C] flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-[#740015] dark:text-[#CE805C] mb-1">
                        No Vendors Booked Yet
                      </p>
                      <p className="text-sm text-[#531946] dark:text-[#B87050]">
                        You have {completionStats.vendors.length} vendor(s)
                        tracked but none are booked yet.
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {activeTab === "vision" && (
        <Card className="!p-6">
          {visionDetails ? (
            <div>
              <div
                className={`bg-gradient-to-r ${visionDetails.color} rounded-2xl p-8 text-white text-center mb-6`}
              >
                <div className="text-6xl mb-4">{visionDetails.icon}</div>
                <h2 className="font-playfair text-3xl font-bold mb-3">
                  {visionDetails.title}
                </h2>
                <p className="text-lg opacity-90">
                  {visionDetails.description}
                </p>
              </div>

              {data?.visionAnswers && (
                <div>
                  <h3
                    className={`font-semibold text-lg mb-4 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Your Preferences
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(data.visionAnswers).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 rounded-lg ${
                          darkMode ? "bg-gray-800" : "bg-gray-50"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Question {key.replace("q", "")}
                        </p>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkle
                size={64}
                className={`mx-auto mb-4 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <p
                className={`font-inter text-lg mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                You haven't completed the Vision Quiz yet
              </p>
              <button
                onClick={() => setActiveSection("vision")}
                className="px-6 py-2.5 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Take Vision Quiz
              </button>
            </div>
          )}
        </Card>
      )}

      {activeTab === "budget" && (
        <Card className="!p-6">
          {completionStats.hasBudget ? (
            <div className="space-y-6">
              <div className="text-center">
                <p
                  className={`text-sm mb-2 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Budget
                </p>
                <p className="text-4xl font-bold text-[#CE805C]">
                  ₦{completionStats.totalBudget.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(data.budgetCategories || {}).map(
                  ([key, cat]) => {
                    const categoryInfo = BUDGET_CATEGORIES[key];
                    if (!categoryInfo || !cat.percentage) return null;

                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-sm font-medium flex items-center gap-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <span aria-hidden="true">{categoryInfo.icon}</span>
                            {categoryInfo.label}
                          </span>
                          <span className="text-sm font-bold text-[#CE805C]">
                            {cat.percentage}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#CE805C] to-[#B87050] transition-all duration-300"
                              style={{ width: `${cat.percentage}%` }}
                            />
                          </div>
                          <span
                            className={`text-sm font-semibold min-w-[100px] text-right ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            ₦{cat.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <CurrencyCircleDollar
                size={64}
                className={`mx-auto mb-4 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <p
                className={`font-inter text-lg mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                You haven't set up your budget yet
              </p>
              <button
                onClick={() => setActiveSection("budget")}
                className="px-6 py-2.5 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create Budget
              </button>
            </div>
          )}
        </Card>
      )}

      {activeTab === "vendors" && (
        <Card className="!p-6">
          {completionStats.hasVendors ? (
            <div className="space-y-4">
              {completionStats.vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className={`p-4 rounded-xl border-2 ${
                    darkMode
                      ? "bg-gray-800/50 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`font-semibold text-lg mb-1 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {vendor.name}
                      </h3>
                      <p
                        className={`text-sm mb-2 ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {vendor.category}
                      </p>
                      {vendor.contact && (
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {vendor.contact}
                        </p>
                      )}
                      {vendor.price && (
                        <p className="text-sm font-semibold text-[#57886C] dark:text-[#57886C] mt-2">
                          ₦{parseFloat(vendor.price).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        vendor.status === "Booked" ||
                        vendor.status === "Confirmed"
                          ? "bg-[#57886C]/10 text-[#57886C] dark:bg-[#57886C]/30 dark:text-[#57886C]"
                          : vendor.status === "Deposit Paid"
                            ? "bg-[#CE805C]/10 text-[#B87050] dark:bg-[#CE805C]/30 dark:text-[#CE805C]"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Storefront
                size={64}
                className={`mx-auto mb-4 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <p
                className={`font-inter text-lg mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                You haven't added any vendors yet
              </p>
              <button
                onClick={() => setActiveSection("vendors")}
                className="px-6 py-2.5 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Add Vendors
              </button>
            </div>
          )}
        </Card>
      )}

      {activeTab === "timeline" && (
        <Card className="!p-6">
          {completionStats.hasTasks ? (
            <div className="space-y-4">
              {completionStats.tasks
                .filter((t) => t.status !== "Completed")
                .slice(0, 10)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border-2 ${
                      darkMode
                        ? "bg-gray-800/50 border-gray-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <VerifiedUser
                        sx={{ fontSize: 20 }}
                        className={
                          task.status === "Completed"
                            ? "text-[#57886C] dark:text-[#57886C]"
                            : "text-gray-400 dark:text-gray-600"
                        }
                      />
                      <div className="flex-1">
                        <h3
                          className={`font-semibold mb-1 ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span
                            className={`px-2 py-0.5 rounded ${
                              darkMode
                                ? "bg-gray-700 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {task.category}
                          </span>
                          {task.dueDate && (
                            <span
                              className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                                darkMode
                                  ? "bg-[#CE805C]/30 text-[#CE805C]"
                                  : "bg-[#CE805C]/10 text-[#B87050]"
                              }`}
                            >
                              <CalendarBlank size={14} weight="bold" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded ${
                              task.priority === "urgent"
                                ? "bg-[#740015]/10 text-[#740015] dark:bg-[#740015]/30 dark:text-[#CE805C]"
                                : task.priority === "high"
                                  ? "bg-[#CE805C]/10 text-[#B87050] dark:bg-[#CE805C]/30 dark:text-[#CE805C]"
                                  : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {completionStats.tasks.filter((t) => t.status !== "Completed")
                .length > 10 && (
                <p
                  className={`text-sm text-center ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  ... and{" "}
                  {completionStats.tasks.filter((t) => t.status !== "Completed")
                    .length - 10}{" "}
                  more pending tasks
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarCheck
                size={64}
                className={`mx-auto mb-4 ${
                  darkMode ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <p
                className={`font-inter text-lg mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                You haven't added any tasks yet
              </p>
              <button
                onClick={() => setActiveSection("timeline")}
                className="px-6 py-2.5 bg-gradient-to-r from-[#CE805C] to-[#B87050] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create Tasks
              </button>
            </div>
          )}
        </Card>
      )}

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          /* Hide navigation, buttons, and UI elements */
          .print\\:hidden,
          button,
          nav,
          header,
          .no-print {
            display: none !important;
          }

          /* Ensure content is visible */
          body,
          body * {
            visibility: visible;
          }

          /* Position content at top of page */
          .print\\:block {
            position: static;
          }

          /* Improve print layout */
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
