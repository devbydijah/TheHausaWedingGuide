import { useState } from "react";
import { Card, ProgressRing } from "../../components/ui";
import {
  Target,
  Wallet,
  Storefront,
  CheckCircle,
  TrendUp,
  CaretUp,
  CaretDown,
} from "@phosphor-icons/react";

/**
 * QuickStats Component
 *
 * Displays 4 key metrics with interactive visualization options
 */
export default function QuickStats({ data, darkMode = false }) {
  const [viewMode, setViewMode] = useState("cards"); // "cards" | "compact"
  // Calculate statistics
  const budgetTotal = data.totalBudget || 0;
  const budgetAllocated = Object.values(data.budgetCategories || {}).reduce(
    (sum, cat) => sum + (cat.amount || 0),
    0
  );
  const budgetRemaining = budgetTotal - budgetAllocated;
  const budgetCompletion =
    budgetTotal > 0 ? (budgetAllocated / budgetTotal) * 100 : 0;

  const totalVendors = data.vendorList?.length || 0;
  const bookedVendors =
    data.vendorList?.filter((v) => v.status === "Booked").length || 0;
  const vendorCompletion =
    totalVendors > 0 ? (bookedVendors / totalVendors) * 100 : 0;

  const totalTasks = data.taskList?.length || 0;
  const completedTasks =
    data.taskList?.filter((t) => t.status === "Completed").length || 0;
  const taskCompletion =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const today = new Date();
  const overdueTasks =
    data.taskList?.filter((task) => {
      if (task.status === "Completed" || !task.dueDate) return false;
      return new Date(task.dueDate) < today;
    }).length || 0;

  const overallProgress = Math.round(
    (budgetCompletion + vendorCompletion + taskCompletion) / 3
  );

  // Calculate trends (mock data - in real app, compare with previous period)
  const trends = {
    overall: overallProgress > 0 ? 12 : 0,
    budget: budgetCompletion > 0 ? 8 : 0,
    vendors: vendorCompletion > 0 ? 15 : 0,
    tasks: taskCompletion > 0 ? 10 : 0,
  };

  const stats = [
    {
      id: "overall",
      title: "Overall Progress",
      value: `${overallProgress}%`,
      metric: overallProgress,
      icon: Target,
      iconColor: "#740015",
      bgGradient: "from-[#740015]/10 to-[#531946]/10",
      color: "#740015",
      showProgressRing: true,
      progress: overallProgress,
      trend: trends.overall,
      description: "Total completion across all sections",
    },
    {
      id: "budget",
      title: "Budget",
      subtitle: budgetTotal > 0 ? "Remaining" : "Status",
      value:
        budgetTotal > 0
          ? new Intl.NumberFormat("en-NG", {
              style: "currency",
              currency: "NGN",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(budgetRemaining)
          : "Not set",
      metric: Math.round(budgetCompletion),
      secondaryValue:
        budgetTotal > 0
          ? `${Math.round(budgetCompletion)}% allocated`
          : "Set your budget to start",
      icon: Wallet,
      iconColor: "#CE805C",
      bgGradient: "from-[#CE805C]/10 to-[#B87050]/10",
      showProgressBar: budgetTotal > 0,
      progress: budgetCompletion,
      color: "#CE805C",
      trend: trends.budget,
      description:
        budgetTotal > 0 ? "Budget allocation progress" : "Configure budget",
    },
    {
      id: "vendors",
      title: "Vendors",
      subtitle: "Booked",
      value: totalVendors > 0 ? `${bookedVendors}/${totalVendors}` : "0",
      metric: Math.round(vendorCompletion),
      secondaryValue:
        totalVendors > 0
          ? `${Math.round(vendorCompletion)}% confirmed`
          : "Add vendors to track",
      icon: Storefront,
      iconColor: "#531946",
      bgGradient: "from-[#531946]/10 to-[#990200]/10",
      showProgressBar: totalVendors > 0,
      progress: vendorCompletion,
      color: "#531946",
      trend: trends.vendors,
      description:
        totalVendors > 0 ? "Vendor booking status" : "Track your vendors",
    },
    {
      id: "tasks",
      title: "Tasks",
      subtitle: "Completed",
      value: totalTasks > 0 ? `${completedTasks}/${totalTasks}` : "0",
      metric: Math.round(taskCompletion),
      secondaryValue:
        overdueTasks > 0 ? (
          <span className="text-red-600 dark:text-red-400 font-bold flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {overdueTasks} overdue
          </span>
        ) : totalTasks > 0 ? (
          `${Math.round(taskCompletion)}% done`
        ) : (
          "Create your first task"
        ),
      icon: CheckCircle,
      iconColor: "#B87050",
      bgGradient: "from-[#B87050]/10 to-[#CE805C]/10",
      showProgressBar: totalTasks > 0,
      progress: taskCompletion,
      color: "#B87050",
      trend: trends.tasks,
      description:
        totalTasks > 0 ? "Task completion rate" : "Organize your tasks",
      alert: overdueTasks > 0,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Quick Stats
          </h2>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Your planning progress at a glance
          </p>
        </div>

        {/* View Mode Toggle */}
        <div
          className={`hidden sm:flex items-center gap-1 p-0.5 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <button
            onClick={() => setViewMode("cards")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === "cards"
                ? darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-900 shadow-sm"
                : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode("compact")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              viewMode === "compact"
                ? darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-900 shadow-sm"
                : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Compact
          </button>
        </div>
      </div>

      {/* Stats Display */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const IconComponent = stat.icon;

            return (
              <Card
                key={stat.id}
                className={`relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer ${
                  stat.showProgressRing
                    ? `bg-gradient-to-br ${stat.bgGradient} animate-gradient`
                    : ""
                } ${stat.alert ? "ring-2 ring-red-500/50 animate-pulse-slow" : ""}`}
              >
                {/* Overall Progress - Special Layout */}
                {stat.showProgressRing ? (
                  <div className="p-5 flex flex-col items-center space-y-3">
                    <div className="relative">
                      <ProgressRing
                        percentage={stat.progress}
                        size={110}
                        strokeWidth={10}
                        color={stat.color}
                        darkMode={darkMode}
                      />
                      {/* Animated pulse ring */}
                      <div
                        className="absolute inset-0 rounded-full border-4 border-[#740015]/20 animate-ping"
                        style={{ animationDuration: "3s" }}
                      />
                    </div>

                    <div className="text-center space-y-1.5">
                      <h3
                        className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {stat.title}
                      </h3>
                      <p
                        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {stat.description}
                      </p>

                      {/* Trend Indicator */}
                      {stat.trend > 0 && (
                        <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 animate-bounce-subtle">
                          <TrendUp size={14} weight="bold" />
                          <span className="text-xs font-semibold">
                            +{stat.trend}% this week
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    {/* Icon Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-0.5 flex-1">
                        <p
                          className={`text-xs font-semibold uppercase tracking-wider ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {stat.subtitle || stat.title}
                        </p>
                      </div>

                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 bg-gradient-to-br ${stat.bgGradient}`}
                      >
                        <IconComponent
                          size={24}
                          weight="duotone"
                          style={{ color: stat.iconColor }}
                        />
                      </div>
                    </div>

                    {/* Value Display */}
                    <div className="space-y-2">
                      <div className="flex items-end gap-2">
                        <div
                          className="text-2xl sm:text-3xl font-black leading-none animate-count-up"
                          style={{ color: stat.color }}
                        >
                          {stat.value}
                        </div>

                        {/* Trend Badge */}
                        {stat.trend > 0 && (
                          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 mb-0.5 transition-all duration-300 hover:scale-105">
                            <CaretUp size={10} weight="bold" />
                            <span className="text-xs font-bold">
                              {stat.trend}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Secondary Value */}
                      <div
                        className={`text-xs font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {stat.secondaryValue}
                      </div>

                      {/* Progress Bar */}
                      {stat.showProgressBar && (
                        <div className="pt-1.5">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs font-semibold ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                            >
                              Progress
                            </span>
                            <span
                              className={`text-xs font-bold ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                            >
                              {Math.round(stat.progress)}%
                            </span>
                          </div>
                          <div
                            className={`relative w-full rounded-full h-2.5 overflow-hidden ${
                              darkMode ? "bg-gray-800" : "bg-gray-200"
                            }`}
                          >
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out shadow-md animate-slide-in"
                              style={{
                                width: `${stat.progress}%`,
                                background: `linear-gradient(90deg, ${stat.color}, ${stat.color}dd)`,
                              }}
                              role="progressbar"
                              aria-valuenow={stat.progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                              aria-label={`${stat.title} progress`}
                            >
                              {/* Animated shine effect */}
                              <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                                style={{ animationDuration: "2s" }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        /* Compact View */
        <Card className="p-4">
          <div className="space-y-3">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;

              return (
                <div
                  key={stat.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer animate-slide-in ${
                    darkMode ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                  } ${stat.alert ? "bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 animate-pulse-slow" : ""}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${stat.bgGradient} transform hover:rotate-6 hover:scale-110 transition-all duration-500`}
                  >
                    <IconComponent
                      size={20}
                      weight="duotone"
                      style={{ color: stat.iconColor }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {stat.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {stat.trend > 0 && (
                          <span className="flex items-center gap-0.5 text-xs font-bold text-green-600 dark:text-green-400 transition-all duration-300 hover:scale-105">
                            <CaretUp size={12} weight="bold" />
                            {stat.trend}%
                          </span>
                        )}
                        <span
                          className="text-lg font-black animate-count-up"
                          style={{ color: stat.color }}
                        >
                          {stat.showProgressRing
                            ? stat.value
                            : stat.metric + "%"}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div
                      className={`h-2 rounded-full overflow-hidden ${
                        darkMode ? "bg-gray-800" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out animate-slide-in"
                        style={{
                          width: `${stat.showProgressRing ? stat.progress : stat.progress}%`,
                          backgroundColor: stat.color,
                          animationDelay: `${index * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
