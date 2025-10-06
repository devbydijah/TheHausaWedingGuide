import { Card, Button } from "../../components/ui";
import QuickStats from "./QuickStats";

/**
 * Dashboard Component
 *
 * Main landing page showing overview of wedding planning progress
 */
export default function Dashboard({ data, setActiveSection }) {
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
      icon: "💎",
      description: "Discover your wedding style with our quiz",
      stats: data.visionQuiz?.result
        ? `${data.visionQuiz.result.title}`
        : "Not taken",
      color: "from-purple-600 to-pink-600",
    },
    {
      id: "vision",
      name: "Vision & Values",
      icon: "✨",
      description: "Define your wedding priorities and intentions",
      stats: `${data.weddingPriorities?.filter((p) => p).length || 0} priorities`,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "budget",
      name: "Budget Builder",
      icon: "💰",
      description: "Plan and track your wedding expenses",
      stats:
        budgetTotal > 0
          ? `₦${(budgetTotal / 1000000).toFixed(1)}M total`
          : "Not set",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "vendors",
      name: "Vendor Tracker",
      icon: "🏪",
      description: "Manage your wedding service providers",
      stats: `${data.vendorList?.filter((v) => v.status === "Booked").length || 0}/${totalVendors} booked`,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "timeline",
      name: "Timeline & Tasks",
      icon: "📅",
      description: "Organize tasks and track deadlines",
      stats: `${data.taskList?.filter((t) => t.status === "Completed").length || 0}/${totalTasks} completed`,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "blueprint",
      name: "Final Blueprint",
      icon: "📋",
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
      color: "from-indigo-500 to-purple-500",
    },
  ];

  const isEmptyState =
    !weddingDate && totalVendors === 0 && totalTasks === 0 && budgetTotal === 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#CE805C] to-[#b86a4a] rounded-xl p-8 text-white">
        <h1 className="font-playfair text-3xl font-bold mb-2">
          Welcome to Your Hausa Wedding Guide
        </h1>
        <p className="font-inter text-lg opacity-90">
          Your personalized planning dashboard for a beautiful and blessed
          celebration
        </p>
      </div>

      {/* Wedding Countdown Card */}
      {weddingDate && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-playfair text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                Wedding Countdown
              </h2>
              <p className="font-inter text-gray-600 dark:text-gray-400">
                {weddingDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#CE805C]">
                {daysUntilWedding > 0 ? daysUntilWedding : 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
      <QuickStats data={data} />

      {/* Section Navigation */}
      <div>
        <h2 className="font-playfair text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Planning Sections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionCards.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="group bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 text-left hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`text-4xl p-3 rounded-lg bg-gradient-to-br ${section.color} text-white`}
                >
                  {section.icon}
                </div>
              </div>
              <h3 className="font-playfair text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-[#CE805C] transition-colors">
                {section.name}
              </h3>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-400 mb-3">
                {section.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                  {section.stats}
                </span>
                <span className="text-[#CE805C] opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </div>
            </button>
          ))}
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
                📅 Set Wedding Date
              </Button>
            )}
            {totalVendors === 0 && (
              <Button
                onClick={() => setActiveSection("vendors")}
                variant="secondary"
                size="sm"
              >
                🏪 Add First Vendor
              </Button>
            )}
            {totalTasks === 0 && (
              <Button
                onClick={() => setActiveSection("timeline")}
                variant="secondary"
                size="sm"
              >
                ✅ Create First Task
              </Button>
            )}
            {budgetTotal === 0 && (
              <Button
                onClick={() => setActiveSection("budget")}
                variant="secondary"
                size="sm"
              >
                💰 Set Budget
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Getting Started Guide (for empty state) */}
      {isEmptyState && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-blue-200 dark:border-gray-700 p-8">
          <h2 className="font-playfair text-2xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <span>🌟</span> Let's Get Started!
          </h2>
          <p className="font-inter text-gray-700 dark:text-gray-300 mb-6">
            Welcome to your wedding planning journey! Here are the recommended
            steps to begin:
          </p>
          <ol className="space-y-3 mb-6">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#CE805C] text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </span>
              <div>
                <strong className="font-inter text-gray-900 dark:text-white">
                  Define Your Vision
                </strong>
                <p className="font-inter text-sm text-gray-600 dark:text-gray-400">
                  Start by setting your top priorities and writing your niyyah
                  (intention)
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#CE805C] text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </span>
              <div>
                <strong className="font-inter text-gray-900 dark:text-white">
                  Set Your Budget
                </strong>
                <p className="font-inter text-sm text-gray-600 dark:text-gray-400">
                  Establish your total budget and allocate funds to different
                  categories
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#CE805C] text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </span>
              <div>
                <strong className="font-inter text-gray-900 dark:text-white">
                  Choose Your Wedding Date
                </strong>
                <p className="font-inter text-sm text-gray-600 dark:text-gray-400">
                  Pick your special day to start the countdown and plan your
                  timeline
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#CE805C] text-white rounded-full flex items-center justify-center text-xs font-bold">
                4
              </span>
              <div>
                <strong className="font-inter text-gray-900 dark:text-white">
                  Start Tracking Vendors & Tasks
                </strong>
                <p className="font-inter text-sm text-gray-600 dark:text-gray-400">
                  Add vendors you're considering and create tasks to stay
                  organized
                </p>
              </div>
            </li>
          </ol>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setActiveSection("quiz")} variant="primary">
              💎 Take Vision Quiz
            </Button>
            <Button
              onClick={() => setActiveSection("vision")}
              variant="secondary"
            >
              Start with Vision & Values →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
