import { useState, useMemo, useCallback, useRef } from "react";
import {
  CurrencyCircleDollar,
  ChartPieSlice,
  Warning,
  CheckCircle,
  Info,
  TrendUp,
  Calculator,
} from "@phosphor-icons/react";
import { Card } from "../../components/ui";
import { BUDGET_CATEGORIES } from "../../lib/constants";

/**
 * BudgetBuilder Component
 *
 * Comprehensive budget planning with visual charts, sliders, and real-time calculations
 */
export default function BudgetBuilder({
  data,
  updateTotalBudget,
  updateCategoryField,
  setActiveSection,
  darkMode,
}) {
  const [showChart, setShowChart] = useState(true);
  const totalBudgetInputRef = useRef(null);

  const totalBudget = data?.totalBudget || 0;
  const categories = data?.budgetCategories || {};

  // Calculate total percentage and amounts with memoization
  const budgetStats = useMemo(() => {
    const categoryKeys = Object.keys(BUDGET_CATEGORIES);

    let totalPercentage = 0;
    let totalAllocated = 0;
    let categoryStats = [];

    categoryKeys.forEach((key) => {
      const category = categories[key] || { percentage: 0, amount: 0 };
      const percentage = parseFloat(category.percentage) || 0;
      const amount = parseFloat(category.amount) || 0;

      totalPercentage += percentage;
      totalAllocated += amount;

      categoryStats.push({
        key,
        label: BUDGET_CATEGORIES[key].label,
        icon: BUDGET_CATEGORIES[key].icon,
        percentage,
        amount,
      });
    });

    const remainingPercentage = 100 - totalPercentage;
    const remainingAmount = totalBudget - totalAllocated;
    const isOverBudget = totalPercentage > 100;
    const isFullyAllocated = totalPercentage === 100;
    const isUnderAllocated = totalPercentage < 100 && totalPercentage > 0;

    return {
      totalPercentage,
      totalAllocated,
      remainingPercentage,
      remainingAmount,
      isOverBudget,
      isFullyAllocated,
      isUnderAllocated,
      categoryStats,
    };
  }, [categories, totalBudget]);

  // Update percentage and sync amount
  const handlePercentageChange = useCallback(
    (categoryKey, newPercentage) => {
      const percentage = parseFloat(newPercentage) || 0;
      const amount = totalBudget ? (percentage / 100) * totalBudget : 0;

      updateCategoryField(categoryKey, "percentage", percentage);
      updateCategoryField(categoryKey, "amount", Math.round(amount));
    },
    [totalBudget, updateCategoryField]
  );

  // Update amount and sync percentage
  const handleAmountChange = useCallback(
    (categoryKey, newAmount) => {
      const amount = parseFloat(newAmount) || 0;
      const percentage = totalBudget ? (amount / totalBudget) * 100 : 0;

      updateCategoryField(categoryKey, "amount", amount);
      updateCategoryField(
        categoryKey,
        "percentage",
        Math.round(percentage * 10) / 10
      );
    },
    [totalBudget, updateCategoryField]
  );

  // Apply suggested percentages
  const applySuggestedPercentages = () => {
    if (!totalBudget) {
      alert("Please set your total budget first!");
      return;
    }

    Object.keys(BUDGET_CATEGORIES).forEach((key) => {
      const defaultPercentage = BUDGET_CATEGORIES[key].defaultPercentage;
      handlePercentageChange(key, defaultPercentage);
    });
  };

  // Clear all allocations
  const clearAllocations = () => {
    if (
      window.confirm("Are you sure you want to clear all budget allocations?")
    ) {
      Object.keys(BUDGET_CATEGORIES).forEach((key) => {
        updateCategoryField(key, "percentage", 0);
        updateCategoryField(key, "amount", 0);
      });
    }
  };

  // Get status color for percentage
  const getPercentageColor = (percentage) => {
    if (percentage === 0) return darkMode ? "text-gray-400" : "text-gray-500";
    if (percentage < 10) return "text-blue-600 dark:text-blue-400";
    if (percentage < 20) return "text-green-600 dark:text-green-400";
    if (percentage < 30) return "text-yellow-600 dark:text-yellow-400";
    if (percentage < 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#740015] to-[#531946] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 text-center">
          <div className="text-6xl sm:text-7xl mb-4" aria-hidden="true">
            💰
          </div>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold mb-3">
            Budget Builder
          </h1>
          <p className="font-inter text-lg opacity-90">
            Plan and track your wedding expenses
          </p>
        </div>
      </div>

      {/* Total Budget Input */}
      <Card className="!p-6">
        <div className="flex items-center gap-3 mb-4">
          <CurrencyCircleDollar
            size={32}
            weight="bold"
            className="text-[#CE805C]"
          />
          <div className="flex-1">
            <label
              htmlFor="total-budget"
              className={`block text-sm font-semibold mb-1 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Total Wedding Budget
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                ₦
              </span>
              <input
                ref={totalBudgetInputRef}
                type="number"
                id="total-budget"
                value={totalBudget || ""}
                onChange={(e) =>
                  updateTotalBudget(parseFloat(e.target.value) || 0)
                }
                min="0"
                step="10000"
                className={`flex-1 text-3xl font-bold px-4 py-2 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="0"
                aria-label="Total wedding budget in Naira"
              />
            </div>
          </div>
        </div>

        {totalBudget > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={applySuggestedPercentages}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calculator size={16} weight="bold" />
              Apply Suggested
            </button>
            <button
              onClick={clearAllocations}
              className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2"
            >
              Clear All
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setShowChart(!showChart)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                showChart
                  ? "bg-[#CE805C] text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              <ChartPieSlice size={16} weight="bold" />
              {showChart ? "Hide" : "Show"} Chart
            </button>
          </div>
        )}
      </Card>

      {/* Budget Status Alert */}
      {totalBudget > 0 && budgetStats.totalPercentage > 0 && (
        <div
          role="status"
          aria-live="polite"
          className={`rounded-xl p-4 border-2 ${
            budgetStats.isOverBudget
              ? "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700"
              : budgetStats.isFullyAllocated
                ? "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700"
                : budgetStats.remainingPercentage < 10
                  ? "bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700"
                  : "bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700"
          }`}
        >
          <div className="flex items-start gap-3">
            {budgetStats.isOverBudget ? (
              <Warning
                size={24}
                weight="bold"
                className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              />
            ) : budgetStats.isFullyAllocated ? (
              <CheckCircle
                size={24}
                weight="fill"
                className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
              />
            ) : budgetStats.remainingPercentage < 10 ? (
              <Info
                size={24}
                weight="bold"
                className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
              />
            ) : (
              <TrendUp
                size={24}
                weight="bold"
                className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
              />
            )}

            <div className="flex-1">
              <p
                className={`font-semibold mb-1 ${
                  budgetStats.isOverBudget
                    ? "text-red-700 dark:text-red-400"
                    : budgetStats.isFullyAllocated
                      ? "text-green-700 dark:text-green-400"
                      : budgetStats.remainingPercentage < 10
                        ? "text-yellow-700 dark:text-yellow-400"
                        : "text-blue-700 dark:text-blue-400"
                }`}
              >
                {budgetStats.isOverBudget
                  ? "⚠️ Over Budget!"
                  : budgetStats.isFullyAllocated
                    ? "✅ Budget Fully Allocated"
                    : budgetStats.remainingPercentage < 10
                      ? "⚡ Almost Fully Allocated"
                      : "📊 Budget In Progress"}
              </p>
              <p
                className={`text-sm ${
                  budgetStats.isOverBudget
                    ? "text-red-600 dark:text-red-300"
                    : budgetStats.isFullyAllocated
                      ? "text-green-600 dark:text-green-300"
                      : budgetStats.remainingPercentage < 10
                        ? "text-yellow-600 dark:text-yellow-300"
                        : "text-blue-600 dark:text-blue-300"
                }`}
              >
                {budgetStats.isOverBudget ? (
                  <>
                    Total allocated: {budgetStats.totalPercentage.toFixed(1)}% (
                    {(budgetStats.totalPercentage - 100).toFixed(1)}% over) • ₦
                    {budgetStats.totalAllocated.toLocaleString()} (₦
                    {(
                      budgetStats.totalAllocated - totalBudget
                    ).toLocaleString()}{" "}
                    over budget)
                  </>
                ) : budgetStats.isFullyAllocated ? (
                  <>
                    Perfect! All 100% of your budget is allocated (₦
                    {budgetStats.totalAllocated.toLocaleString()})
                  </>
                ) : (
                  <>
                    Remaining: {budgetStats.remainingPercentage.toFixed(1)}% • ₦
                    {budgetStats.remainingAmount.toLocaleString()} left to
                    allocate
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Chart */}
      {totalBudget > 0 && showChart && budgetStats.totalPercentage > 0 && (
        <Card className="!p-6">
          <h2
            className={`font-playfair text-xl sm:text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Budget Distribution
          </h2>

          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {budgetStats.categoryStats.map((cat) => {
              if (cat.percentage === 0) return null;

              return (
                <div key={cat.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-sm font-medium flex items-center gap-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <span aria-hidden="true">{cat.icon}</span>
                      {cat.label}
                    </span>
                    <span
                      className={`text-sm font-bold ${getPercentageColor(
                        cat.percentage
                      )}`}
                    >
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#CE805C] to-[#B87050] transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    >
                      {cat.percentage >= 15 && (
                        <span className="text-xs font-bold text-white">
                          ₦{cat.amount.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {cat.percentage < 15 && cat.percentage > 0 && (
                      <span
                        className={`absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ₦{cat.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Category Allocations */}
      <Card className="!p-6">
        <h2
          className={`font-playfair text-xl sm:text-2xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Budget Categories
        </h2>

        {!totalBudget && (
          <div className="text-center py-8">
            <Info
              size={48}
              className={`mx-auto mb-3 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <p
              className={`font-inter ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Set your total budget above to start allocating funds
            </p>
          </div>
        )}

        <div className="space-y-6">
          {Object.keys(BUDGET_CATEGORIES).map((categoryKey) => {
            const category = BUDGET_CATEGORIES[categoryKey];
            const values = categories[categoryKey] || {
              percentage: 0,
              amount: 0,
            };

            return (
              <div
                key={categoryKey}
                className={`p-4 rounded-xl border-2 transition-all ${
                  darkMode
                    ? "bg-gray-800/50 border-gray-700 hover:border-[#CE805C]/50"
                    : "bg-gray-50 border-gray-200 hover:border-[#CE805C]/50"
                }`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl" aria-hidden="true">
                    {category.icon}
                  </span>
                  <div className="flex-1">
                    <h3
                      className={`font-semibold text-lg ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.label}
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Suggested: {category.defaultPercentage}%
                    </p>
                  </div>
                </div>

                {/* Slider */}
                <div className="mb-4">
                  <label
                    htmlFor={`${categoryKey}-slider`}
                    className={`block text-sm font-medium mb-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Allocation
                  </label>
                  <input
                    type="range"
                    id={`${categoryKey}-slider`}
                    min="0"
                    max="100"
                    step="0.5"
                    value={values.percentage || 0}
                    onChange={(e) =>
                      handlePercentageChange(categoryKey, e.target.value)
                    }
                    disabled={!totalBudget}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer budget-slider"
                    style={{
                      background: `linear-gradient(to right, #CE805C 0%, #CE805C ${values.percentage || 0}%, ${
                        darkMode ? "#374151" : "#E5E7EB"
                      } ${values.percentage || 0}%, ${
                        darkMode ? "#374151" : "#E5E7EB"
                      } 100%)`,
                    }}
                    aria-label={`${category.label} percentage allocation`}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={values.percentage || 0}
                  />
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Percentage Input */}
                  <div>
                    <label
                      htmlFor={`${categoryKey}-percentage`}
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Percentage
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id={`${categoryKey}-percentage`}
                        value={values.percentage || ""}
                        onChange={(e) =>
                          handlePercentageChange(categoryKey, e.target.value)
                        }
                        min="0"
                        max="100"
                        step="0.5"
                        disabled={!totalBudget}
                        className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                            : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        }`}
                        placeholder="0"
                        aria-label={`${category.label} percentage`}
                      />
                      <span
                        className={`text-lg font-bold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        %
                      </span>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label
                      htmlFor={`${categoryKey}-amount`}
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Amount
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-lg font-bold ${
                          darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        ₦
                      </span>
                      <input
                        type="number"
                        id={`${categoryKey}-amount`}
                        value={values.amount || ""}
                        onChange={(e) =>
                          handleAmountChange(categoryKey, e.target.value)
                        }
                        min="0"
                        step="1000"
                        disabled={!totalBudget}
                        className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#CE805C] ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                            : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                        }`}
                        placeholder="0"
                        aria-label={`${category.label} amount in Naira`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Budget Summary Table */}
      {totalBudget > 0 && budgetStats.totalPercentage > 0 && (
        <Card className="!p-6 overflow-x-auto">
          <h2
            className={`font-playfair text-xl sm:text-2xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Budget Summary
          </h2>

          <table className="w-full">
            <thead>
              <tr
                className={`border-b-2 ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <th
                  className={`text-left py-3 px-2 font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Category
                </th>
                <th
                  className={`text-right py-3 px-2 font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  %
                </th>
                <th
                  className={`text-right py-3 px-2 font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {budgetStats.categoryStats.map((cat) => {
                if (cat.percentage === 0) return null;

                return (
                  <tr
                    key={cat.key}
                    className={`border-b ${
                      darkMode ? "border-gray-700" : "border-gray-100"
                    }`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true">{cat.icon}</span>
                        <span
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {cat.label}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`text-right py-3 px-2 font-semibold ${getPercentageColor(
                        cat.percentage
                      )}`}
                    >
                      {cat.percentage.toFixed(1)}%
                    </td>
                    <td
                      className={`text-right py-3 px-2 font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      ₦{cat.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              <tr
                className={`border-t-2 font-bold ${
                  darkMode ? "border-gray-600" : "border-gray-300"
                }`}
              >
                <td
                  className={`py-3 px-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Total Allocated
                </td>
                <td
                  className={`text-right py-3 px-2 ${
                    budgetStats.isOverBudget
                      ? "text-red-600 dark:text-red-400"
                      : budgetStats.isFullyAllocated
                        ? "text-green-600 dark:text-green-400"
                        : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {budgetStats.totalPercentage.toFixed(1)}%
                </td>
                <td
                  className={`text-right py-3 px-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ₦{budgetStats.totalAllocated.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      )}

      {/* Custom Slider Styles */}
      <style jsx>{`
        .budget-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ce805c;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s ease;
        }

        .budget-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .budget-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ce805c;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.15s ease;
        }

        .budget-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }

        .budget-slider:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
